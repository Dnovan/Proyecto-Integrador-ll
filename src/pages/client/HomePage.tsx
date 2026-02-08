/**
 * @fileoverview Home del Cliente
 * @description Página principal con búsqueda, locales recientes y recomendaciones
 * Diseño Premium con Blanco y Dorado
 * 
 * @iso25010
 * - Usabilidad: Navegación intuitiva y acceso rápido a funciones principales
 * - Eficiencia: Carga optimizada con skeleton loaders
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Clock, TrendingUp, ArrowRight, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { PropertyCard } from '../../components/organisms/PropertyCard';
import { VenueCardSkeleton } from '../../components/atoms/Skeleton';
import Ballpit from '../../components/molecules/Ballpit';
import { getFeaturedVenues } from '../../services/venueService';
import type { Venue } from '../../types';

export const HomePage: React.FC = () => {
    const navigate = useNavigate();

    const [venues, setVenues] = useState<Venue[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const venuesData = await getFeaturedVenues(6);
                setVenues(venuesData);
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    // Colores del tema premium
    const colors = {
        gold: '#C5A059',
        goldLight: '#E8C872',
        text: '#2C2C2C',
        textSecondary: '#5D5D5D',
        bgLight: '#FAFAFA',
        border: '#F0F0F0',
    };

    return (
        <div style={{ minHeight: '100vh', background: '#FFFFFF' }}>
            {/* Hero Section */}
            <section style={{ position: 'relative', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {/* 3D Ballpit Animation */}
                <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.7 }}>
                    <Ballpit
                        count={200}
                        gravity={0.7}
                        friction={0.8}
                        wallBounce={0.95}
                        followCursor={true}
                        colors={[0xD4AF37, 0xC5A059, 0xFFFFFF]}
                    />
                </div>

                <div style={{ position: 'relative', maxWidth: '64rem', margin: '0 auto', textAlign: 'center', zIndex: 10, padding: '0 1rem' }}>
                    <motion.h1
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        transition={{ duration: 0.6 }}
                        style={{
                            fontSize: 'clamp(3.5rem, 12vw, 8rem)',
                            fontWeight: 900,
                            background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.goldLight} 40%, ${colors.gold} 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            marginBottom: '1.5rem',
                            letterSpacing: '-0.04em',
                            textShadow: 'none',
                        }}
                    >
                        EventSpace
                    </motion.h1>
                    <motion.p
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        style={{
                            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                            color: '#3D3D3D',
                            marginBottom: '2.5rem',
                            maxWidth: '42rem',
                            margin: '0 auto 2.5rem',
                            lineHeight: 1.7,
                            fontWeight: 400,
                        }}
                    >
                        Conectamos anfitriones con los espacios más exclusivos para crear eventos inolvidables.
                        Desde salones íntimos hasta grandes auditorios.
                    </motion.p>
                </div>
            </section>

            {/* Servicios Section */}
            <section style={{ padding: '5rem 1rem', background: colors.bgLight }} id="servicios">
                <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        style={{ textAlign: 'center', marginBottom: '4rem' }}
                    >
                        <h2 style={{ fontSize: '2rem', fontWeight: 700, color: colors.text, marginBottom: '1rem' }}>Nuestros Servicios</h2>
                        <p style={{ color: colors.textSecondary, maxWidth: '42rem', margin: '0 auto' }}>Ofrecemos soluciones integrales para facilitarte la búsqueda y gestión de espacios.</p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}
                    >
                        {[
                            { title: 'Búsqueda Inteligente', icon: <Search style={{ width: '32px', height: '32px', color: colors.gold }} />, desc: 'Filtra por ubicación, capacidad y precio para encontrar el lugar ideal.' },
                            { title: 'Gestión de Reservas', icon: <Clock style={{ width: '32px', height: '32px', color: colors.gold }} />, desc: 'Sistema simplificado para agendar visitas y confirmar fechas.' },
                            { title: 'Soporte Premium', icon: <Sparkles style={{ width: '32px', height: '32px', color: colors.gold }} />, desc: 'Asistencia dedicada para asegurar el éxito de tu evento.' }
                        ].map((service, index) => (
                            <motion.div
                                variants={fadeInUp}
                                key={index}
                                style={{
                                    padding: '2rem',
                                    borderRadius: '1rem',
                                    background: '#FFFFFF',
                                    border: `1px solid ${colors.border}`,
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                }}
                                whileHover={{
                                    y: -4,
                                    boxShadow: `0 10px 30px rgba(197, 160, 89, 0.15)`,
                                    borderColor: colors.gold,
                                }}
                            >
                                <div style={{ marginBottom: '1rem' }}>{service.icon}</div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: colors.text, marginBottom: '0.75rem' }}>{service.title}</h3>
                                <p style={{ color: colors.textSecondary }}>{service.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Espacios Destacados */}
            <section style={{ padding: '5rem 1rem', background: '#FFFFFF' }}>
                <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <TrendingUp style={{ width: '24px', height: '24px', color: colors.gold }} />
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: colors.text }}>
                                Espacios Destacados
                            </h2>
                        </div>
                        <button
                            onClick={() => navigate('/buscar')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1.5rem',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: colors.gold,
                                background: 'transparent',
                                border: `2px solid ${colors.gold}`,
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = colors.gold;
                                e.currentTarget.style.color = '#1a1a1a';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = colors.gold;
                            }}
                        >
                            Ver todos
                            <ArrowRight style={{ width: '16px', height: '16px' }} />
                        </button>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}
                    >
                        {isLoading
                            ? Array.from({ length: 3 }).map((_, i) => (
                                <VenueCardSkeleton key={i} />
                            ))
                            : venues.slice(0, 3).map((venue) => (
                                <motion.div variants={fadeInUp} key={venue.id}>
                                    <PropertyCard venue={venue} />
                                </motion.div>
                            ))}
                    </motion.div>
                </div>
            </section>

            {/* Promotores/Afiliación CTA */}
            <section style={{ padding: '6rem 1rem', position: 'relative', overflow: 'hidden', background: `linear-gradient(135deg, ${colors.gold}08, ${colors.goldLight}12)` }}>
                <div style={{ maxWidth: '56rem', margin: '0 auto', position: 'relative' }}>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        style={{
                            background: '#FFFFFF',
                            borderRadius: '1.5rem',
                            padding: 'clamp(2rem, 5vw, 4rem)',
                            textAlign: 'center',
                            border: `1px solid ${colors.gold}30`,
                            boxShadow: '0 10px 40px rgba(197, 160, 89, 0.1)',
                        }}
                    >
                        <h2 style={{
                            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                            fontWeight: 700,
                            color: colors.text,
                            marginBottom: '1.5rem'
                        }}>
                            ¿Eres dueño de un espacio?
                        </h2>
                        <p style={{ color: colors.textSecondary, fontSize: '1.125rem', marginBottom: '2rem', maxWidth: '42rem', margin: '0 auto 2rem' }}>
                            Únete a nuestra red de promotores exclusivos. Aumenta tu visibilidad y gestiona tus reservas de forma profesional.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => navigate('/registro?role=PROVEEDOR')}
                                style={{
                                    padding: '1rem 2rem',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    color: '#1a1a1a',
                                    background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.goldLight} 100%)`,
                                    border: 'none',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 15px rgba(197, 160, 89, 0.35)',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(197, 160, 89, 0.45)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(197, 160, 89, 0.35)';
                                }}
                            >
                                Afiliar mi espacio
                            </button>
                            <button
                                onClick={() => navigate('/promotores')}
                                style={{
                                    padding: '1rem 2rem',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    color: colors.gold,
                                    background: 'transparent',
                                    border: `2px solid ${colors.gold}`,
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = colors.gold;
                                    e.currentTarget.style.color = '#1a1a1a';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = colors.gold;
                                }}
                            >
                                Conocer más
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
