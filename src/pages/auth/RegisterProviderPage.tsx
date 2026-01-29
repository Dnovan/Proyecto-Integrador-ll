/**
 * @fileoverview Página de Registro Premium - EventSpace (Proveedor)
 * @description Formulario de registro para proveedores con diseño split-screen y estética premium
 * Integrado con Supabase Auth para verificación de email
 * 
 * @iso25010
 * - Seguridad: Registro de proveedores con verificación de email
 * - Usabilidad: Formulario elegante con validación visual premium
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Phone, Sparkles, AlertCircle, CheckCircle, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AuthImagePanel } from '../../components/molecules/AuthImagePanel';

export const RegisterProviderPage: React.FC = () => {
    const { register, isLoading, error, clearError } = useAuth();

    const [formData, setFormData] = useState({
        businessName: '',
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [showVerificationMessage, setShowVerificationMessage] = useState(false);

    const updateField = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (validationErrors[field]) {
            setValidationErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.businessName.trim()) {
            errors.businessName = 'El nombre del negocio es requerido';
        } else if (formData.businessName.trim().length < 3) {
            errors.businessName = 'El nombre debe tener al menos 3 caracteres';
        }

        if (!formData.name.trim()) {
            errors.name = 'El nombre del encargado es requerido';
        } else if (formData.name.trim().length < 3) {
            errors.name = 'El nombre debe tener al menos 3 caracteres';
        }

        if (!formData.email) {
            errors.email = 'El correo electrónico es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Ingresa un correo electrónico válido';
        }

        if (!formData.phone) {
            errors.phone = 'El teléfono de contacto es requerido';
        } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
            errors.phone = 'Ingresa un número de teléfono válido';
        }

        if (!formData.password) {
            errors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 6) {
            errors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Las contraseñas no coinciden';
        }

        if (!acceptTerms) {
            errors.terms = 'Debes aceptar los términos y condiciones';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        if (!validateForm()) return;

        try {
            console.log('Attempting provider registration with:', formData.email);
            await register({
                name: `${formData.businessName} - ${formData.name}`,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                role: 'PROVEEDOR',
            });

            console.log('Provider registration successful, showing verification message');
            setShowVerificationMessage(true);
        } catch (err) {
            console.error('Provider registration error:', err);
        }
    };

    // Mostrar mensaje de verificación de email
    if (showVerificationMessage) {
        return (
            <div className="auth-container">
                <AuthImagePanel
                    variant="provider"
                    backgroundImage="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80"
                />
                <div className="auth-form-panel">
                    <div className="auth-form-container" style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #C5A059, #E8C872)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                        }}>
                            <CheckCircle style={{ width: 40, height: 40, color: '#FFFFFF' }} />
                        </div>

                        <h1 style={{
                            fontSize: '1.75rem',
                            fontWeight: 700,
                            color: '#2C2C2C',
                            marginBottom: '12px',
                        }}>
                            ¡Registro Exitoso!
                        </h1>

                        <p style={{
                            color: '#5D5D5D',
                            fontSize: '1rem',
                            marginBottom: '24px',
                            lineHeight: 1.6,
                        }}>
                            Hemos enviado un enlace de verificación a<br />
                            <strong style={{ color: '#C5A059' }}>{formData.email}</strong>
                        </p>

                        <p style={{
                            color: '#8C8C8C',
                            fontSize: '0.875rem',
                            marginBottom: '32px',
                        }}>
                            Haz clic en el enlace del correo para verificar tu cuenta.
                            <br />
                            Una vez verificado, podrás iniciar sesión y comenzar a publicar tus espacios.
                            <br />
                            Revisa tu carpeta de spam si no lo encuentras.
                        </p>

                        <Link
                            to="/login/proveedor"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '14px 28px',
                                background: 'linear-gradient(135deg, #C5A059, #E8C872)',
                                color: '#FFFFFF',
                                borderRadius: '12px',
                                fontWeight: 600,
                                textDecoration: 'none',
                                boxShadow: '0 4px 15px rgba(197, 160, 89, 0.3)',
                            }}
                        >
                            Ir a Iniciar Sesión (Proveedor)
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            {/* Panel izquierdo - Imagen para proveedores */}
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
                            <span>ES</span>
                        </div>
                        <span className="auth-logo__text">EventSpace</span>
                    </Link>

                    {/* Header */}
                    <div className="auth-header">
                        <h1 className="auth-header__title">Registro de Proveedor</h1>
                        <p className="auth-header__subtitle">
                            Publica tus espacios y conecta con clientes
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
                        {/* Nombre del Negocio */}
                        <div className="auth-input-group">
                            <label className="auth-input-label">
                                Nombre del Negocio / Local
                            </label>
                            <div className="auth-input-wrapper">
                                <Building2 className="auth-input-icon w-5 h-5" />
                                <input
                                    type="text"
                                    value={formData.businessName}
                                    onChange={(e) => updateField('businessName', e.target.value)}
                                    placeholder="Ej: Salón Los Arcos"
                                    className={`auth-input ${validationErrors.businessName ? 'auth-input--error' : ''}`}
                                    autoComplete="organization"
                                />
                            </div>
                            {validationErrors.businessName && (
                                <p className="auth-input-error">{validationErrors.businessName}</p>
                            )}
                        </div>

                        {/* Nombre del Encargado */}
                        <div className="auth-input-group">
                            <label className="auth-input-label">
                                Nombre del Encargado
                            </label>
                            <div className="auth-input-wrapper">
                                <User className="auth-input-icon w-5 h-5" />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => updateField('name', e.target.value)}
                                    placeholder="Tu nombre completo"
                                    className={`auth-input ${validationErrors.name ? 'auth-input--error' : ''}`}
                                    autoComplete="name"
                                />
                            </div>
                            {validationErrors.name && (
                                <p className="auth-input-error">{validationErrors.name}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="auth-input-group">
                            <label className="auth-input-label">
                                Correo electrónico
                            </label>
                            <div className="auth-input-wrapper">
                                <Mail className="auth-input-icon w-5 h-5" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => updateField('email', e.target.value)}
                                    placeholder="contacto@tunegocio.com"
                                    className={`auth-input ${validationErrors.email ? 'auth-input--error' : ''}`}
                                    autoComplete="email"
                                />
                            </div>
                            {validationErrors.email && (
                                <p className="auth-input-error">{validationErrors.email}</p>
                            )}
                        </div>

                        {/* Teléfono (obligatorio para proveedores) */}
                        <div className="auth-input-group">
                            <label className="auth-input-label">
                                Teléfono de contacto
                            </label>
                            <div className="auth-input-wrapper">
                                <Phone className="auth-input-icon w-5 h-5" />
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => updateField('phone', e.target.value)}
                                    placeholder="+52 55 1234 5678"
                                    className={`auth-input ${validationErrors.phone ? 'auth-input--error' : ''}`}
                                    autoComplete="tel"
                                />
                            </div>
                            {validationErrors.phone && (
                                <p className="auth-input-error">{validationErrors.phone}</p>
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
                                    value={formData.password}
                                    onChange={(e) => updateField('password', e.target.value)}
                                    placeholder="Mínimo 6 caracteres"
                                    className={`auth-input ${validationErrors.password ? 'auth-input--error' : ''}`}
                                    autoComplete="new-password"
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

                        {/* Confirm Password */}
                        <div className="auth-input-group">
                            <label className="auth-input-label">
                                Confirmar contraseña
                            </label>
                            <div className="auth-input-wrapper">
                                <Lock className="auth-input-icon w-5 h-5" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={(e) => updateField('confirmPassword', e.target.value)}
                                    placeholder="Repite tu contraseña"
                                    className={`auth-input ${validationErrors.confirmPassword ? 'auth-input--error' : ''}`}
                                    autoComplete="new-password"
                                />
                            </div>
                            {validationErrors.confirmPassword && (
                                <p className="auth-input-error">{validationErrors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Terms Checkbox */}
                        <div className="auth-checkbox-group">
                            <input
                                type="checkbox"
                                id="accept-terms"
                                checked={acceptTerms}
                                onChange={(e) => setAcceptTerms(e.target.checked)}
                                className="auth-checkbox"
                            />
                            <label htmlFor="accept-terms" className="auth-checkbox-label">
                                Acepto los{' '}
                                <a href="/terminos" target="_blank" rel="noopener noreferrer">
                                    Términos de Servicio
                                </a>{' '}
                                y la{' '}
                                <a href="/privacidad" target="_blank" rel="noopener noreferrer">
                                    Política de Privacidad
                                </a>
                            </label>
                        </div>
                        {validationErrors.terms && (
                            <p className="auth-input-error" style={{ marginTop: '-0.75rem', marginBottom: '1rem' }}>
                                {validationErrors.terms}
                            </p>
                        )}

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
                                    Registrarse como Proveedor
                                </>
                            )}
                        </button>
                    </form>

                    {/* Link a login */}
                    <div className="auth-links">
                        <p className="auth-links__text">
                            ¿Ya tienes cuenta de proveedor?{' '}
                            <Link to="/login/proveedor" className="auth-links__link">
                                Inicia sesión
                            </Link>
                        </p>
                        <p className="auth-links__text" style={{ marginTop: '8px' }}>
                            ¿Eres cliente?{' '}
                            <Link to="/registro" className="auth-links__link">
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterProviderPage;
