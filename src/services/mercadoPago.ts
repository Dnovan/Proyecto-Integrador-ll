/**
 * @fileoverview Servicio de integración con Mercado Pago
 * @description Maneja la creación de preferencias de pago y redirección a Checkout Pro
 */

// Configuración de Mercado Pago
const MP_PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY;

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
 * Crea una preferencia de pago para Checkout Pro
 * NOTA: En producción, esto debería hacerse desde el backend
 * para mayor seguridad. Esta implementación es para desarrollo.
 */
export const createPaymentPreference = async (
    data: BookingPaymentData,
    accessToken: string
): Promise<PaymentPreference> => {
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
            name: data.clientName,
            email: data.clientEmail,
        },
        back_urls: {
            success: `${window.location.origin}/reserva/confirmada`,
            failure: `${window.location.origin}/reserva/fallida`,
            pending: `${window.location.origin}/reserva/pendiente`,
        },
        auto_return: 'approved',
        statement_descriptor: 'EVENTSPACE',
        external_reference: `booking_${data.venueId}_${Date.now()}`,
    };

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(preference),
    });

    if (!response.ok) {
        const error = await response.json();
        console.error('Error creating preference:', error);
        throw new Error(error.message || 'Error al crear la preferencia de pago');
    }

    return response.json();
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

export default {
    createPaymentPreference,
    redirectToCheckout,
    getMPPublicKey,
};
