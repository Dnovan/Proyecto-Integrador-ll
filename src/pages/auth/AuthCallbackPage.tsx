/**
 * @fileoverview Callback de Autenticación
 * @description Maneja el callback de verificación de email de Supabase
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const colors = {
    gold: '#C5A059',
    text: '#2C2C2C',
    textSecondary: '#5D5D5D',
    success: '#22C55E',
    error: '#EF4444',
};

export const AuthCallbackPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verificando...');

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Supabase maneja automáticamente el token de la URL
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    throw error;
                }

                if (session) {
                    setStatus('success');
                    setMessage('¡Email verificado correctamente!');

                    // Redirigir después de 2 segundos
                    setTimeout(() => {
                        navigate('/client-dashboard', { replace: true });
                    }, 2000);
                } else {
                    // Verificar si hay un token en la URL para intercambiar
                    const code = searchParams.get('code');
                    if (code) {
                        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
                        if (exchangeError) {
                            throw exchangeError;
                        }
                        setStatus('success');
                        setMessage('¡Email verificado correctamente!');
                        setTimeout(() => {
                            navigate('/client-dashboard', { replace: true });
                        }, 2000);
                    } else {
                        setStatus('error');
                        setMessage('No se encontró una sesión válida');
                    }
                }
            } catch (error) {
                console.error('Auth callback error:', error);
                setStatus('error');
                setMessage(error instanceof Error ? error.message : 'Error al verificar el email');
            }
        };

        handleCallback();
    }, [navigate, searchParams]);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #FAFAFA 0%, #F4F1EA 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
        }}>
            <div style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '48px',
                textAlign: 'center',
                maxWidth: '400px',
                width: '100%',
                boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
            }}>
                {status === 'loading' && (
                    <>
                        <Loader2
                            style={{
                                width: 64,
                                height: 64,
                                color: colors.gold,
                                animation: 'spin 1s linear infinite',
                                margin: '0 auto 24px',
                            }}
                        />
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: colors.text, marginBottom: '8px' }}>
                            Verificando
                        </h1>
                        <p style={{ color: colors.textSecondary }}>
                            {message}
                        </p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <CheckCircle
                            style={{
                                width: 64,
                                height: 64,
                                color: colors.success,
                                margin: '0 auto 24px',
                            }}
                        />
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: colors.text, marginBottom: '8px' }}>
                            ¡Éxito!
                        </h1>
                        <p style={{ color: colors.textSecondary, marginBottom: '16px' }}>
                            {message}
                        </p>
                        <p style={{ color: colors.textSecondary, fontSize: '0.875rem' }}>
                            Redirigiendo...
                        </p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <XCircle
                            style={{
                                width: 64,
                                height: 64,
                                color: colors.error,
                                margin: '0 auto 24px',
                            }}
                        />
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: colors.text, marginBottom: '8px' }}>
                            Error
                        </h1>
                        <p style={{ color: colors.textSecondary, marginBottom: '24px' }}>
                            {message}
                        </p>
                        <button
                            onClick={() => navigate('/login')}
                            style={{
                                padding: '12px 24px',
                                background: colors.gold,
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            Ir al Login
                        </button>
                    </>
                )}
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default AuthCallbackPage;
