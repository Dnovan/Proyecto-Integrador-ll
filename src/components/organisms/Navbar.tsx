/**
 * @fileoverview Componente Navbar - Organismo
 * @description Barra de navegación principal con diseño premium blanco y dorado
 * 
 * @iso25010
 * - Usabilidad: Navegación clara y accesible
 * - Seguridad: Muestra opciones según rol del usuario
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * Navbar principal de EventSpace - Diseño Premium Blanco y Dorado
 */
export const Navbar: React.FC = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/');
        setIsMobileMenuOpen(false);
    };

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const navLinks = [
        { label: 'Inicio', to: '/' },
        { label: 'Institución', to: '/institucion' },
        { label: 'Servicios', to: '/servicios' },
        { label: 'Contacto', to: '/contacto' },
    ];

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            background: '#FFFFFF',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
            borderBottom: '1px solid #F0F0F0',
        }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '72px'
                }}>
                    {/* Logo - Redirige al dashboard según rol */}
                    <Link
                        to={
                            isAuthenticated
                                ? user?.role === 'PROVEEDOR'
                                    ? '/provider-dashboard'
                                    : user?.role === 'ADMIN'
                                        ? '/admin'
                                        : '/client-dashboard'
                                : '/'
                        }
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            textDecoration: 'none',
                        }}
                    >
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, #C5A059 0%, #E8C872 100%)',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <span style={{ color: 'white', fontWeight: 800, fontSize: '1rem' }}>LS</span>
                        </div>
                        <span style={{
                            color: '#2C2C2C',
                            fontWeight: 700,
                            fontSize: '1.25rem',
                            display: 'none',
                        }} className="sm-show">EventSpace</span>
                    </Link>

                    {/* Navegación desktop - Solo visible para visitantes no autenticados */}
                    {!isAuthenticated && (
                        <div style={{
                            display: 'none',
                            alignItems: 'center',
                            gap: '0.5rem',
                        }} className="md-show">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    to={link.to}
                                    style={{
                                        padding: '0.625rem 1.25rem',
                                        color: '#5D5D5D',
                                        textDecoration: 'none',
                                        fontSize: '0.9375rem',
                                        fontWeight: 500,
                                        borderRadius: '8px',
                                        transition: 'all 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = '#C5A059';
                                        e.currentTarget.style.background = 'rgba(197, 160, 89, 0.08)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = '#5D5D5D';
                                        e.currentTarget.style.background = 'transparent';
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Acciones de usuario */}
                    <div style={{
                        display: 'none',
                        alignItems: 'center',
                        gap: '1rem',
                    }} className="md-show">
                        {isAuthenticated ? (
                            <>
                                {/* Link Mis Reservaciones (Solo Cliente) */}
                                {user?.role === 'CLIENTE' && (
                                    <Link to="/mis-reservaciones" style={{ textDecoration: 'none' }}>
                                        <button style={{
                                            padding: '0.625rem 1.25rem',
                                            color: '#5D5D5D',
                                            background: 'transparent',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '0.9375rem',
                                            fontWeight: 500,
                                            transition: 'color 0.2s ease',
                                        }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = '#C5A059'}
                                            onMouseLeave={(e) => e.currentTarget.style.color = '#5D5D5D'}
                                        >
                                            Mis Reservaciones
                                        </button>
                                    </Link>
                                )}

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.875rem',
                                    padding: '0.5rem 1rem 0.5rem 0.5rem',
                                    background: 'linear-gradient(135deg, rgba(197, 160, 89, 0.08) 0%, rgba(232, 200, 114, 0.05) 100%)',
                                    borderRadius: '100px',
                                    border: '1px solid rgba(197, 160, 89, 0.15)',
                                }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #C5A059 0%, #E8C872 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                        boxShadow: '0 2px 8px rgba(197, 160, 89, 0.35)',
                                    }}>
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span style={{
                                        color: '#2C2C2C',
                                        fontWeight: 600,
                                        fontSize: '0.9375rem',
                                        letterSpacing: '-0.01em',
                                    }}>
                                        {user?.name?.split(' ')[0]}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.625rem 1.25rem',
                                        color: '#6B7280',
                                        background: '#F9FAFB',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem',
                                        fontWeight: 500,
                                        transition: 'all 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#FEF2F2';
                                        e.currentTarget.style.color = '#EF4444';
                                        e.currentTarget.style.borderColor = '#FECACA';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = '#F9FAFB';
                                        e.currentTarget.style.color = '#6B7280';
                                        e.currentTarget.style.borderColor = '#E5E7EB';
                                    }}
                                >
                                    <LogOut style={{ width: '16px', height: '16px' }} />
                                    Salir
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" style={{ textDecoration: 'none' }}>
                                    <button style={{
                                        padding: '0.625rem 1.25rem',
                                        color: '#5D5D5D',
                                        background: 'transparent',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '0.9375rem',
                                        fontWeight: 500,
                                        transition: 'color 0.2s ease',
                                    }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = '#C5A059'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = '#5D5D5D'}
                                    >
                                        Iniciar Sesión
                                    </button>
                                </Link>
                                <Link to="/registro" style={{ textDecoration: 'none' }}>
                                    <button style={{
                                        padding: '0.625rem 1.5rem',
                                        color: '#1a1a1a',
                                        background: 'linear-gradient(135deg, #C5A059 0%, #D4AF61 50%, #E8C872 100%)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '0.9375rem',
                                        fontWeight: 600,
                                        boxShadow: '0 2px 8px rgba(197, 160, 89, 0.3)',
                                        transition: 'all 0.2s ease',
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(197, 160, 89, 0.4)';
                                            e.currentTarget.style.transform = 'translateY(-1px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(197, 160, 89, 0.3)';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        Registrarse
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Botón menú móvil */}
                    <button
                        style={{
                            display: 'block',
                            padding: '0.5rem',
                            color: '#2C2C2C',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                        className="md-hide"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Menú"
                    >
                        {isMobileMenuOpen ? (
                            <X style={{ width: '24px', height: '24px' }} />
                        ) : (
                            <Menu style={{ width: '24px', height: '24px' }} />
                        )}
                    </button>
                </div>
            </div>

            {/* Menú móvil */}
            {isMobileMenuOpen && (
                <div style={{
                    background: '#FFFFFF',
                    borderTop: '1px solid #F0F0F0',
                    padding: '1rem',
                }} className="md-hide">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {/* Enlaces de navegación solo para visitantes no autenticados */}
                        {!isAuthenticated && navLinks.map((link) => (
                            <Link
                                key={link.label}
                                to={link.to}
                                onClick={closeMobileMenu}
                                style={{
                                    padding: '0.75rem 1rem',
                                    color: '#2C2C2C',
                                    textDecoration: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    borderRadius: '10px',
                                    transition: 'background 0.2s ease',
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}

                        <div style={{ height: '1px', background: '#F0F0F0', margin: '0.75rem 0' }} />

                        {isAuthenticated ? (
                            <>
                                {/* Link Mis Reservaciones (Solo Cliente) */}
                                {user?.role === 'CLIENTE' && (
                                    <Link
                                        to="/mis-reservaciones"
                                        onClick={closeMobileMenu}
                                        style={{
                                            display: 'block',
                                            padding: '0.75rem 1rem',
                                            color: '#2C2C2C',
                                            textDecoration: 'none',
                                            fontSize: '1rem',
                                            fontWeight: 500,
                                            borderRadius: '10px',
                                            transition: 'background 0.2s ease',
                                            marginBottom: '0.5rem',
                                        }}
                                    >
                                        Mis Reservaciones
                                    </Link>
                                )}

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem 1rem',
                                    background: '#FAFAFA',
                                    borderRadius: '12px',
                                    marginBottom: '0.5rem',
                                }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #C5A059 0%, #E8C872 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 600,
                                    }}>
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p style={{ color: '#2C2C2C', fontWeight: 500, margin: 0 }}>{user?.name}</p>
                                        <p style={{ color: '#8C8C8C', fontSize: '0.875rem', margin: 0, textTransform: 'capitalize' }}>
                                            {user?.role?.toLowerCase()}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        color: '#FF6F69',
                                        background: 'transparent',
                                        border: 'none',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        fontSize: '1rem',
                                        textAlign: 'left',
                                    }}
                                >
                                    <LogOut style={{ width: '20px', height: '20px' }} />
                                    Cerrar Sesión
                                </button>
                            </>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.5rem' }}>
                                <Link to="/login" onClick={closeMobileMenu} style={{ textDecoration: 'none' }}>
                                    <button style={{
                                        width: '100%',
                                        padding: '0.875rem',
                                        color: '#5D5D5D',
                                        background: 'transparent',
                                        border: '1px solid #E5E5E5',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        fontSize: '1rem',
                                        fontWeight: 500,
                                    }}>
                                        Iniciar Sesión
                                    </button>
                                </Link>
                                <Link to="/registro" onClick={closeMobileMenu} style={{ textDecoration: 'none' }}>
                                    <button style={{
                                        width: '100%',
                                        padding: '0.875rem',
                                        color: '#1a1a1a',
                                        background: 'linear-gradient(135deg, #C5A059 0%, #D4AF61 50%, #E8C872 100%)',
                                        border: 'none',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        boxShadow: '0 2px 8px rgba(197, 160, 89, 0.3)',
                                    }}>
                                        Registrarse
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* CSS para responsive */}
            <style>{`
                .sm-show { display: inline !important; }
                .md-show { display: flex !important; }
                .md-hide { display: block !important; }
                
                @media (max-width: 640px) {
                    .sm-show { display: none !important; }
                }
                
                @media (min-width: 768px) {
                    .md-hide { display: none !important; }
                }
                
                @media (max-width: 767px) {
                    .md-show { display: none !important; }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
