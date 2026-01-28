/**
 * @fileoverview Componente Footer - Organismo
 * @description Pie de página con links y copyright - Diseño Premium Blanco y Dorado
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    // Colores del tema premium
    const colors = {
        gold: '#C5A059',
        goldLight: '#E8C872',
        text: '#2C2C2C',
        textSecondary: '#5D5D5D',
        textMuted: '#8C8C8C',
        bgLight: '#FAFAFA',
        border: '#F0F0F0',
    };

    return (
        <footer style={{
            background: colors.bgLight,
            borderTop: `1px solid ${colors.border}`,
        }}>
            <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '3rem 1rem' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '2rem'
                }}>
                    {/* Logo y descripción */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.goldLight} 100%)`,
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <span style={{ color: 'white', fontWeight: 800, fontSize: '0.875rem' }}>LS</span>
                            </div>
                            <span style={{ color: colors.text, fontWeight: 700, fontSize: '1.25rem' }}>EventSpace</span>
                        </Link>
                        <p style={{ color: colors.textSecondary, fontSize: '0.875rem' }}>
                            La plataforma premium para encontrar el espacio perfecto para tu evento.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <a href="#" style={{ color: colors.textMuted, transition: 'color 0.2s ease' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = colors.gold}
                                onMouseLeave={(e) => e.currentTarget.style.color = colors.textMuted}>
                                <Instagram style={{ width: '20px', height: '20px' }} />
                            </a>
                            <a href="#" style={{ color: colors.textMuted, transition: 'color 0.2s ease' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = colors.gold}
                                onMouseLeave={(e) => e.currentTarget.style.color = colors.textMuted}>
                                <Facebook style={{ width: '20px', height: '20px' }} />
                            </a>
                            <a href="#" style={{ color: colors.textMuted, transition: 'color 0.2s ease' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = colors.gold}
                                onMouseLeave={(e) => e.currentTarget.style.color = colors.textMuted}>
                                <Twitter style={{ width: '20px', height: '20px' }} />
                            </a>
                        </div>
                    </div>

                    {/* Enlaces rápidos */}
                    <div>
                        <h4 style={{ color: colors.text, fontWeight: 600, marginBottom: '1rem' }}>Explorar</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {[
                                { to: '/buscar', label: 'Buscar Locales' },
                                { to: '/buscar?category=HACIENDA', label: 'Haciendas' },
                                { to: '/buscar?category=JARDIN', label: 'Jardines' },
                                { to: '/buscar?category=TERRAZA', label: 'Terrazas' },
                            ].map((link) => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        style={{ color: colors.textSecondary, textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s ease' }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = colors.gold}
                                        onMouseLeave={(e) => e.currentTarget.style.color = colors.textSecondary}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Soporte */}
                    <div>
                        <h4 style={{ color: colors.text, fontWeight: 600, marginBottom: '1rem' }}>Soporte</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {[
                                { to: '/ayuda', label: 'Centro de Ayuda' },
                                { to: '/ayuda#faq', label: 'Preguntas Frecuentes' },
                                { to: '#', label: 'Términos y Condiciones' },
                                { to: '#', label: 'Política de Privacidad' },
                            ].map((link, idx) => (
                                <li key={idx}>
                                    <Link
                                        to={link.to}
                                        style={{ color: colors.textSecondary, textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s ease' }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = colors.gold}
                                        onMouseLeave={(e) => e.currentTarget.style.color = colors.textSecondary}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div>
                        <h4 style={{ color: colors.text, fontWeight: 600, marginBottom: '1rem' }}>Contacto</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: colors.textSecondary, fontSize: '0.875rem' }}>
                                <Mail style={{ width: '16px', height: '16px', color: colors.gold }} />
                                <a href="mailto:hola@localspace.mx" style={{ color: colors.textSecondary, textDecoration: 'none', transition: 'color 0.2s ease' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = colors.gold}
                                    onMouseLeave={(e) => e.currentTarget.style.color = colors.textSecondary}>
                                    hola@localspace.mx
                                </a>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: colors.textSecondary, fontSize: '0.875rem' }}>
                                <Phone style={{ width: '16px', height: '16px', color: colors.gold }} />
                                <a href="tel:+525512345678" style={{ color: colors.textSecondary, textDecoration: 'none', transition: 'color 0.2s ease' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = colors.gold}
                                    onMouseLeave={(e) => e.currentTarget.style.color = colors.textSecondary}>
                                    +52 55 1234 5678
                                </a>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: colors.textSecondary, fontSize: '0.875rem' }}>
                                <MapPin style={{ width: '16px', height: '16px', color: colors.gold, flexShrink: 0, marginTop: '0.125rem' }} />
                                <span>Ciudad de México, México</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: `1px solid ${colors.border}`, textAlign: 'center' }}>
                    <p style={{ color: colors.textMuted, fontSize: '0.875rem' }}>
                        © {currentYear} EventSpace. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
