/**
 * @fileoverview Página de Login Premium - EventSpace
 * @description Formulario de inicio de sesión con diseño split-screen y estética premium
 * 
 * @iso25010
 * - Usabilidad: Formulario claro con feedback visual elegante
 * - Seguridad: Validación de campos y manejo seguro de credenciales
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Sparkles, AlertCircle, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AuthImagePanel } from '../../components/molecules/AuthImagePanel';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login, isLoading, error, clearError } = useAuth();

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
            navigate('/client-dashboard');
        } catch {
            // Error manejado por AuthContext
        }
    };

    return (
        <div className="auth-container">
            {/* Panel izquierdo - Imagen inmersiva */}
            <AuthImagePanel variant="client" />

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

                    {/* Header */}
                    <div className="auth-header">
                        <h1 className="auth-header__title">Bienvenido de vuelta</h1>
                        <p className="auth-header__subtitle">
                            Ingresa tus credenciales para continuar
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
                                    placeholder="tu@email.com"
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
                                    <Sparkles className="w-5 h-5" />
                                    Iniciar Sesión
                                </>
                            )}
                        </button>
                    </form>

                    {/* Link a registro */}
                    <div className="auth-links">
                        <p className="auth-links__text">
                            ¿No tienes cuenta?{' '}
                            <Link to="/registro" className="auth-links__link">
                                Regístrate
                            </Link>
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="auth-divider">
                        <div className="auth-divider__line" />
                        <span className="auth-divider__text">o</span>
                        <div className="auth-divider__line" />
                    </div>

                    {/* Acceso Proveedor */}
                    <Link to="/login/proveedor" className="auth-provider-btn">
                        <Building2 className="w-5 h-5" />
                        Iniciar sesión como Proveedor
                    </Link>

                    {/* Demo credentials (solo desarrollo) */}
                    {import.meta.env.DEV && (
                        <div className="auth-demo">
                            <p className="auth-demo__title">Credenciales de demostración:</p>
                            <div className="auth-demo__credentials">
                                <div className="auth-demo__item">
                                    <span className="auth-demo__label">Cliente:</span>
                                    <code className="auth-demo__value">cliente@localspace.com / cliente123</code>
                                </div>
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

export default LoginPage;
