/**
 * @fileoverview Página de pago fallido
 */

import React from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { XCircle, Home, RefreshCw } from 'lucide-react';

const BookingFailedPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const externalReference = searchParams.get('external_reference') || '';

    // Extraer venue ID de la referencia externa (formato: booking_venueId_timestamp)
    const venueId = externalReference.split('_')[1] || '';

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
                {/* Error Icon */}
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    boxShadow: '0 8px 30px rgba(239, 68, 68, 0.3)',
                }}>
                    <XCircle style={{ width: 40, height: 40, color: '#FFFFFF' }} />
                </div>

                <h1 style={{
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    color: '#1F2937',
                    marginBottom: '0.75rem',
                }}>
                    Pago No Completado
                </h1>

                <p style={{
                    fontSize: '1rem',
                    color: '#6B7280',
                    marginBottom: '2rem',
                    lineHeight: 1.6,
                }}>
                    Hubo un problema al procesar tu pago.
                    No te preocupes, no se realizó ningún cargo.
                </p>

                <div style={{
                    background: '#FEE2E2',
                    borderRadius: '12px',
                    padding: '1rem',
                    marginBottom: '2rem',
                    border: '1px solid #FECACA',
                }}>
                    <p style={{ fontSize: '0.875rem', color: '#991B1B' }}>
                        Esto puede ocurrir por fondos insuficientes,
                        datos incorrectos o cancelación del proceso.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {venueId && (
                        <button
                            onClick={() => navigate(`/espacio/${venueId}`)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                padding: '0.875rem 1.5rem',
                                background: 'linear-gradient(135deg, #C5A059 0%, #E8C872 100%)',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: 600,
                                fontSize: '0.9375rem',
                                cursor: 'pointer',
                            }}
                        >
                            <RefreshCw style={{ width: 20, height: 20 }} />
                            Intentar de Nuevo
                        </button>
                    )}

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

export default BookingFailedPage;
