/**
 * @fileoverview Servicio de integración con Mercado Pago
 * @description Maneja la creación de preferencias de pago y redirección a Checkout Pro
 */

// Configuración de Mercado Pago desde variables de entorno
const MP_PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY;
const MP_ACCESS_TOKEN = import.meta.env.VITE_MP_ACCESS_TOKEN;

export interface PaymentPreference {
    id: string;
    init_point: string;
    sandbox_init_point: string;
}

export interface BookingPaymentData {
    venueId: string;
    venueName: string;
    venueImage?: string;
    eventDate: string;
    guestCount: number;
    totalPrice: number;
    extras: {
        security: boolean;
        cleaning: boolean;
    };
    clientEmail: string;
    clientName: string;
}

/**
 * Obtiene la URL base de la aplicación
 */
const getBaseUrl = (): string => {
    // En desarrollo usamos localhost, en producción la URL real
    const origin = window.location.origin;
    console.log('[MercadoPago] Base URL:', origin);
    return origin;
};

/**
 * Crea una preferencia de pago para Checkout Pro
 * NOTA: En producción, esto debería hacerse desde el backend
 * para mayor seguridad. Esta implementación es para desarrollo.
 */
export const createPaymentPreference = async (
    data: BookingPaymentData,
    accessToken?: string
): Promise<PaymentPreference> => {
    const token = accessToken || MP_ACCESS_TOKEN;

    if (!token) {
        throw new Error('Access Token de Mercado Pago no configurado. Verifica tu archivo .env');
    }

    const baseUrl = getBaseUrl();
    const isLocalhost = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1');

    // Construir las URLs de retorno
    const backUrls = {
        success: `${baseUrl}/reserva/confirmada`,
        failure: `${baseUrl}/reserva/fallida`,
        pending: `${baseUrl}/reserva/pendiente`,
    };

    console.log('[MercadoPago] Back URLs:', backUrls);
    console.log('[MercadoPago] Is localhost:', isLocalhost);

    // Construir el objeto de preferencia según la documentación de MP
    const preference = {
        items: [
            {
                id: data.venueId,
                title: `Reserva: ${data.venueName}`,
                description: `Evento para ${data.guestCount} personas el ${new Date(data.eventDate).toLocaleDateString('es-MX', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })}`,
                picture_url: data.venueImage || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400',
                quantity: 1,
                currency_id: 'MXN',
                unit_price: data.totalPrice,
            },
        ],
        payer: {
            name: data.clientName.split(' ')[0] || 'Cliente',
            surname: data.clientName.split(' ').slice(1).join(' ') || 'EventSpace',
            email: data.clientEmail,
        },
        // URLs de retorno - DEBEN estar configuradas
        back_urls: backUrls,
        // Solo usar auto_return si no es localhost (MP puede rechazarlo)
        auto_return: isLocalhost ? undefined : 'approved' as const,
        statement_descriptor: 'EVENTSPACE',
        external_reference: `booking_${data.venueId}_${Date.now()}`,
        // Configuración adicional
        notification_url: undefined, // Se puede agregar un webhook después
        expires: false,
        expiration_date_from: undefined,
        expiration_date_to: undefined,
        // Configuración para evitar verificación de cuenta en sandbox
        // binary_mode fuerza resultado inmediato sin verificación adicional
        binary_mode: true,
        // Excluir métodos que requieren cuenta
        payment_methods: {
            excluded_payment_types: [
                { id: 'ticket' },      // Excluir pagos en efectivo
                { id: 'atm' },         // Excluir cajeros
            ],
            installments: 1,           // Solo pago de contado
        },
    };

    console.log('Creating payment preference with:', {
        items: preference.items,
        payer: preference.payer,
        back_urls: preference.back_urls,
        auto_return: preference.auto_return,
    });

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(preference),
    });

    const responseData = await response.json();

    if (!response.ok) {
        console.error('Error creating preference:', responseData);

        // Mensaje de error más descriptivo
        if (responseData.message) {
            throw new Error(responseData.message);
        }
        if (responseData.cause && responseData.cause.length > 0) {
            const causes = responseData.cause.map((c: { code: string; description: string }) =>
                c.description || c.code
            ).join(', ');
            throw new Error(`Error de Mercado Pago: ${causes}`);
        }
        throw new Error('Error al crear la preferencia de pago');
    }

    console.log('Payment preference created:', responseData);
    return responseData;
};

/**
 * Redirige al usuario al checkout de Mercado Pago
 */
export const redirectToCheckout = (preferenceId: string, sandbox: boolean = true): void => {
    // En desarrollo usamos sandbox, en producción usamos el real
    const checkoutUrl = sandbox
        ? `https://sandbox.mercadopago.com.mx/checkout/v1/redirect?pref_id=${preferenceId}`
        : `https://www.mercadopago.com.mx/checkout/v1/redirect?pref_id=${preferenceId}`;

    window.location.href = checkoutUrl;
};

/**
 * Inicializa el SDK de Mercado Pago (para uso futuro con Bricks)
 */
export const getMPPublicKey = (): string => {
    if (!MP_PUBLIC_KEY) {
        console.warn('VITE_MP_PUBLIC_KEY no está configurada');
        return '';
    }
    return MP_PUBLIC_KEY;
};

/**
 * Verifica si las credenciales de MP están configuradas
 */
export const isMPConfigured = (): boolean => {
    return !!(MP_PUBLIC_KEY && MP_ACCESS_TOKEN);
};

export default {
    createPaymentPreference,
    redirectToCheckout,
    getMPPublicKey,
    isMPConfigured,
};
