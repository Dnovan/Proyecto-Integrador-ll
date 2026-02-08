/**
 * @fileoverview Página de confirmación de reserva exitosa
 * @description Actualiza el booking en Supabase y muestra los detalles de la reserva
 */

import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Calendar, CheckCircle, Clock, CreditCard, Home, MapPin, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface BookingDetails {
    venueName: string;
    venueImage: string;
    eventDate: string;
    guestCount: number;
    totalPrice: number;
    providerName: string;
    startTime?: string;
    endTime?: string;
}

const BookingConfirmedPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const processPayment = async () => {
            setIsLoading(true);

            // Obtener datos del localStorage
            const pendingBookingId = localStorage.getItem('pendingBookingId');
            const pendingBookingData = localStorage.getItem('pendingBookingData');

            if (pendingBookingData) {
                setBookingDetails(JSON.parse(pendingBookingData));
            }

            // Verificar el status del pago desde los query params de MercadoPago
            const status = searchParams.get('status') || searchParams.get('collection_status');
            const paymentId = searchParams.get('payment_id') || searchParams.get('collection_id');

            console.log('Payment status:', status);
            console.log('Payment ID:', paymentId);
            console.log('Booking ID:', pendingBookingId);

            if (pendingBookingId && (status === 'approved' || !status)) {
                try {
                    // Actualizar el booking a CONFIRMED
                    const { error } = await supabase
                        .from('bookings')
                        .update({
                            status: 'CONFIRMED',
                            payment_status: 'PAID',
                            confirmed_at: new Date().toISOString(),
                        })
                        .eq('id', pendingBookingId);

                    if (!error) {
                        console.log('Booking confirmed successfully');

                        // Limpiar localStorage
                        localStorage.removeItem('pendingBookingId');
                        localStorage.removeItem('pendingBookingData');
                    } else {
                        console.error('Error updating booking:', error);
                    }
                } catch (err) {
                    console.error('Error:', err);
                }
            }

            setIsLoading(false);
        };

        processPayment();
    }, [searchParams]);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-MX', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(price);
    };

    if (isLoading) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #FAFAFA 0%, #F5F5F5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        border: '3px solid #E8E8E8',
                        borderTop: '3px solid #C5A059',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 16px'
                    }} />
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    <p style={{ color: '#5D5D5D' }}>Procesando tu reserva...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #FAFAFA 0%, #F5F5F5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
        }}>
            <div style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '2.5rem',
                maxWidth: '550px',
                width: '100%',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
            }}>
                {/* Success Icon */}
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    boxShadow: '0 8px 30px rgba(16, 185, 129, 0.3)',
                }}>
                    <CheckCircle style={{ width: 40, height: 40, color: '#FFFFFF' }} />
                </div>

                {/* Title */}
                <h1 style={{
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    color: '#1F2937',
                    marginBottom: '0.75rem',
                    textAlign: 'center',
                }}>
                    ¡Reserva Confirmada!
                </h1>

                <p style={{
                    fontSize: '1rem',
                    color: '#6B7280',
                    marginBottom: '1.5rem',
                    lineHeight: 1.6,
                    textAlign: 'center',
                }}>
                    Tu pago ha sido procesado exitosamente.
                </p>

                {/* Booking Details */}
                {bookingDetails && (
                    <div style={{
                        background: '#F9FAFB',
                        borderRadius: '16px',
                        padding: '1.25rem',
                        marginBottom: '1.5rem',
                    }}>
                        {bookingDetails.venueImage && (
                            <div style={{
                                height: '120px',
                                borderRadius: '12px',
                                background: `url(${bookingDetails.venueImage}) center/cover`,
                                marginBottom: '1rem',
                            }} />
                        )}

                        <h3 style={{
                            fontSize: '1.125rem',
                            fontWeight: 600,
                            color: '#1F2937',
                            marginBottom: '1rem',
                        }}>
                            {bookingDetails.venueName}
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Calendar style={{ width: 18, height: 18, color: '#C5A059' }} />
                                <span style={{ color: '#5D5D5D', fontSize: '0.9375rem' }}>
                                    {formatDate(bookingDetails.eventDate)}
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Users style={{ width: 18, height: 18, color: '#C5A059' }} />
                                <span style={{ color: '#5D5D5D', fontSize: '0.9375rem' }}>
                                    {bookingDetails.guestCount} invitados
                                </span>
                            </div>
                            {bookingDetails.startTime && bookingDetails.endTime && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Clock style={{ width: 18, height: 18, color: '#C5A059' }} />
                                    <span style={{ color: '#5D5D5D', fontSize: '0.9375rem' }}>
                                        {bookingDetails.startTime.slice(0, 5)} - {bookingDetails.endTime.slice(0, 5)}
                                    </span>
                                </div>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <MapPin style={{ width: 18, height: 18, color: '#C5A059' }} />
                                <span style={{ color: '#5D5D5D', fontSize: '0.9375rem' }}>
                                    Proveedor: {bookingDetails.providerName}
                                </span>
                            </div>
                        </div>

                        {/* Total */}
                        <div style={{
                            marginTop: '1rem',
                            paddingTop: '1rem',
                            borderTop: '1px solid #E5E7EB',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <span style={{ fontWeight: 500, color: '#5D5D5D' }}>Total Pagado</span>
                            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#C5A059' }}>
                                {formatPrice(bookingDetails.totalPrice)}
                            </span>
                        </div>
                    </div>
                )}

                {/* Payment Confirmation */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '1rem',
                    background: '#ECFDF5',
                    borderRadius: '12px',
                    marginBottom: '1.5rem',
                }}>
                    <CreditCard style={{ width: 20, height: 20, color: '#10B981' }} />
                    <span style={{ color: '#047857', fontSize: '0.875rem' }}>
                        Pago procesado con MercadoPago
                    </span>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <Link
                        to="/cliente/reservas"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            padding: '0.875rem 1.5rem',
                            background: 'linear-gradient(135deg, #C5A059 0%, #E8C872 100%)',
                            color: '#FFFFFF',
                            textDecoration: 'none',
                            borderRadius: '12px',
                            fontWeight: 600,
                            fontSize: '0.9375rem',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <Calendar style={{ width: 20, height: 20 }} />
                        Ver Mis Reservas
                        <ArrowRight style={{ width: 18, height: 18 }} />
                    </Link>

                    <Link
                        to="/"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            padding: '0.875rem 1.5rem',
                            background: '#F3F4F6',
                            color: '#4B5563',
                            textDecoration: 'none',
                            borderRadius: '12px',
                            fontWeight: 500,
                            fontSize: '0.9375rem',
                        }}
                    >
                        <Home style={{ width: 20, height: 20 }} />
                        Volver al Inicio
                    </Link>
                </div>

                {/* Footer Note */}
                <p style={{
                    fontSize: '0.75rem',
                    color: '#9CA3AF',
                    marginTop: '1.5rem',
                    textAlign: 'center',
                }}>
                    El proveedor ha sido notificado y se pondrá en contacto contigo para coordinar los detalles.
                </p>
            </div>
        </div>
    );
};

export default BookingConfirmedPage;
