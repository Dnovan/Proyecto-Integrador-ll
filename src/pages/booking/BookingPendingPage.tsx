/**
 * @fileoverview Página de pago pendiente
 */

import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Clock, Home, Mail } from 'lucide-react';

const BookingPendingPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const paymentId = searchParams.get('payment_id') || '';

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
                {/* Pending Icon */}
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    boxShadow: '0 8px 30px rgba(245, 158, 11, 0.3)',
                }}>
                    <Clock style={{ width: 40, height: 40, color: '#FFFFFF' }} />
                </div>

                <h1 style={{
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    color: '#1F2937',
                    marginBottom: '0.75rem',
                }}>
                    Pago Pendiente
                </h1>

                <p style={{
                    fontSize: '1rem',
                    color: '#6B7280',
                    marginBottom: '2rem',
                    lineHeight: 1.6,
                }}>
                    Tu pago está siendo procesado. Te notificaremos por correo
                    electrónico cuando se confirme la transacción.
                </p>

                {paymentId && (
                    <div style={{
                        background: '#FEF3C7',
                        borderRadius: '12px',
                        padding: '1rem',
                        marginBottom: '2rem',
                        border: '1px solid #FCD34D',
                    }}>
                        <p style={{ fontSize: '0.875rem', color: '#92400E' }}>
                            Referencia: <strong>{paymentId}</strong>
                        </p>
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: '0.875rem',
                        background: '#F3F4F6',
                        borderRadius: '12px',
                        color: '#6B7280',
                    }}>
                        <Mail style={{ width: 20, height: 20 }} />
                        <span>Revisa tu correo electrónico</span>
                    </div>

                    <Link
                        to="/"
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
                        }}
                    >
                        <Home style={{ width: 20, height: 20 }} />
                        Volver al Inicio
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BookingPendingPage;
