/**
 * @fileoverview Página de Login para Proveedores - EventSpace
 * @description Formulario de inicio de sesión específico para proveedores con diseño premium
 * 
 * @iso25010
 * - Seguridad: Acceso diferenciado para proveedores
 * - Usabilidad: Interfaz personalizada para socios comerciales
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGlobalNotification } from '../../context/NotificationContext';
import { AuthImagePanel } from '../../components/molecules/AuthImagePanel';

export const ProviderLoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login, isLoading, error, clearError } = useAuth();
    const { showSuccess, showError } = useGlobalNotification();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{
        email?: string;
        password?: string;
    }>({});

    const validateForm = (): boolean => {
        const errors: { email?: string; password?: string } = {};

        if (!email) {
            errors.email = 'El correo electrónico es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Ingresa un correo electrónico válido';
        }

        if (!password) {
            errors.password = 'La contraseña es requerida';
        } else if (password.length < 6) {
            errors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        if (!validateForm()) return;

        try {
            await login({ email, password });
            showSuccess('¡Bienvenido! Acceso exitoso', 'Inicio de sesión');
            // Redirigir al dashboard de proveedor
            setTimeout(() => navigate('/proveedor'), 500);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
            showError(errorMessage, 'Error de acceso');
        }
    };

    return (
        <div className="auth-container">
            {/* Panel izquierdo - Imagen inmersiva para proveedores */}
            <AuthImagePanel
                variant="provider"
                backgroundImage="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80"
            />

            {/* Panel derecho - Formulario */}
            <div className="auth-form-panel">
                <div className="auth-form-container">
                    {/* Logo */}
                    <Link to="/" className="auth-logo">
                        <div className="auth-logo__icon">
                            <span>LS</span>
                        </div>
                        <span className="auth-logo__text">EventSpace</span>
                    </Link>

                    {/* Badge de Proveedor */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: 'linear-gradient(135deg, rgba(197, 160, 89, 0.1) 0%, rgba(197, 160, 89, 0.2) 100%)',
                        borderRadius: '100px',
                        marginBottom: '1.5rem',
                        border: '1px solid rgba(197, 160, 89, 0.3)'
                    }}>
                        <Users className="w-4 h-4" style={{ color: '#C5A059' }} />
                        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#C5A059' }}>
                            Portal de Proveedores
                        </span>
                    </div>

                    {/* Header */}
                    <div className="auth-header">
                        <h1 className="auth-header__title">Acceso Proveedor</h1>
                        <p className="auth-header__subtitle">
                            Gestiona tus espacios y reservaciones
                        </p>
                    </div>

                    {/* Error general */}
                    {error && (
                        <div className="auth-error">
                            <AlertCircle className="auth-error__icon w-5 h-5" />
                            <span className="auth-error__text">{error}</span>
                        </div>
                    )}

                    {/* Formulario */}
                    <form onSubmit={handleSubmit}>
                        {/* Email */}
                        <div className="auth-input-group">
                            <label className="auth-input-label">
                                Correo electrónico
                            </label>
                            <div className="auth-input-wrapper">
                                <Mail className="auth-input-icon w-5 h-5" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="proveedor@empresa.com"
                                    className={`auth-input ${validationErrors.email ? 'auth-input--error' : ''}`}
                                    autoComplete="email"
                                />
                            </div>
                            {validationErrors.email && (
                                <p className="auth-input-error">{validationErrors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="auth-input-group">
                            <label className="auth-input-label">
                                Contraseña
                            </label>
                            <div className="auth-input-wrapper">
                                <Lock className="auth-input-icon w-5 h-5" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className={`auth-input ${validationErrors.password ? 'auth-input--error' : ''}`}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="auth-input-icon auth-input-icon--right w-5 h-5"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {validationErrors.password && (
                                <p className="auth-input-error">{validationErrors.password}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-gold-gradient"
                        >
                            {isLoading ? (
                                <div className="spinner" />
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    Acceder al Portal
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="auth-divider">
                        <div className="auth-divider__line" />
                        <span className="auth-divider__text">¿Nuevo proveedor?</span>
                        <div className="auth-divider__line" />
                    </div>

                    {/* Registro de proveedor */}
                    <div style={{
                        padding: '1.25rem',
                        background: '#FAFAFA',
                        borderRadius: '12px',
                        textAlign: 'center'
                    }}>
                        <p style={{ fontSize: '0.9375rem', color: '#5D5D5D', marginBottom: '0.75rem' }}>
                            ¿Aún no tienes cuenta de proveedor?
                        </p>
                        <Link
                            to="/registro/proveedor"
                            style={{
                                color: '#C5A059',
                                fontWeight: 600,
                                textDecoration: 'none',
                                fontSize: '0.9375rem'
                            }}
                        >
                            Regístrate como proveedor →
                        </Link>
                    </div>

                    {/* Link a login de cliente */}
                    <div className="auth-links" style={{ marginTop: '1.5rem' }}>
                        <p className="auth-links__text">
                            ¿Eres cliente?{' '}
                            <Link to="/login" className="auth-links__link">
                                Inicia sesión aquí
                            </Link>
                        </p>
                    </div>

                    {/* Demo credentials (solo desarrollo) */}
                    {import.meta.env.DEV && (
                        <div className="auth-demo">
                            <p className="auth-demo__title">Credenciales de demostración:</p>
                            <div className="auth-demo__credentials">
                                <div className="auth-demo__item">
                                    <span className="auth-demo__label">Proveedor:</span>
                                    <code className="auth-demo__value">proveedor@localspace.com / proveedor123</code>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProviderLoginPage;
