/**
 * @fileoverview Página de confirmación de reserva exitosa
 */

import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Home, Calendar, ArrowRight } from 'lucide-react';

const BookingConfirmedPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [paymentInfo, setPaymentInfo] = useState({
        paymentId: '',
        status: '',
        externalReference: '',
    });

    useEffect(() => {
        // Obtener información del pago de los query params de Mercado Pago
        setPaymentInfo({
            paymentId: searchParams.get('payment_id') || '',
            status: searchParams.get('status') || 'approved',
            externalReference: searchParams.get('external_reference') || '',
        });
    }, [searchParams]);

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
                padding: '3rem',
                maxWidth: '500px',
                width: '100%',
                textAlign: 'center',
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
                }}>
                    ¡Reserva Confirmada!
                </h1>

                <p style={{
                    fontSize: '1rem',
                    color: '#6B7280',
                    marginBottom: '2rem',
                    lineHeight: 1.6,
                }}>
                    Tu pago ha sido procesado exitosamente.
                    Recibirás un correo de confirmación con los detalles de tu reserva.
                </p>

                {/* Payment Details */}
                {paymentInfo.paymentId && (
                    <div style={{
                        background: '#F9FAFB',
                        borderRadius: '12px',
                        padding: '1rem',
                        marginBottom: '2rem',
                    }}>
                        <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                            ID de Pago:
                        </p>
                        <p style={{ fontSize: '1rem', fontWeight: 600, color: '#1F2937' }}>
                            {paymentInfo.paymentId}
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <Link
                        to="/mis-reservas"
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
                }}>
                    El proveedor se pondrá en contacto contigo para coordinar los detalles del evento.
                </p>
            </div>
        </div>
    );
};

export default BookingConfirmedPage;
