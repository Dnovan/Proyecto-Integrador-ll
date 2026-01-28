
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Rocket, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import InfiniteMenu from '../../components/molecules/InfiniteMenu';

export const InstitutionPage: React.FC = () => {
    const navigate = useNavigate();

    const items = [
        {
            image: 'https://images.unsplash.com/photo-1569317002804-ab77bcf1bce4?auto=format&fit=crop&w=800&q=80&v=3',
            link: 'https://google.com/',
            title: 'Eventos Exclusivos',
            description: 'Espacios únicos para momentos memorables.'
        },
        {
            image: 'https://images.unsplash.com/photo-1629812456605-4a044aa38fbc?auto=format&fit=crop&w=800&q=80&v=3',
            link: 'https://google.com/',
            title: 'Ambiente Perfecto',
            description: 'La atmósfera ideal para tu celebración.'
        },
        {
            image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80&v=3',
            link: 'https://google.com/',
            title: 'Jardines Mágicos',
            description: 'Naturaleza y elegancia en un solo lugar.'
        },
        {
            image: 'https://images.unsplash.com/photo-1616423661138-0245a1e7d095?auto=format&fit=crop&w=800&q=80&v=3',
            link: 'https://google.com/',
            title: 'Salones de Lujo',
            description: 'Sofisticación en cada detalle.'
        }
    ];

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
            <section style={{ position: 'relative', height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {/* Background Animation */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                    <InfiniteMenu items={items} />
                </div>

                {/* Content Overlay */}
                <div style={{ position: 'relative', zIndex: 10, maxWidth: '80rem', margin: '0 auto', textAlign: 'center', padding: '0 1rem', pointerEvents: 'none' }}>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 style={{
                            fontSize: 'clamp(3rem, 8vw, 5rem)',
                            fontWeight: 900,
                            marginBottom: '1.5rem',
                            background: `linear-gradient(135deg, #FFFFFF 0%, ${colors.goldLight} 50%, #FFFFFF 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            letterSpacing: '-0.02em',
                            textShadow: '0 4px 30px rgba(0,0,0,0.3)',
                            filter: 'drop-shadow(0 4px 30px rgba(0,0,0,0.3))',
                        }}>
                            EventSpace
                        </h1>
                        <h2 style={{
                            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                            fontWeight: 700,
                            color: '#FFFFFF',
                            marginBottom: '2rem',
                            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
                        }}>
                            Renta. Reserva. Celebra.
                        </h2>
                        <p style={{
                            fontSize: '1.25rem',
                            color: 'rgba(255,255,255,0.95)',
                            maxWidth: '48rem',
                            margin: '0 auto',
                            lineHeight: 1.7,
                            marginBottom: '3rem',
                            fontWeight: 500,
                            textShadow: '0 2px 15px rgba(0,0,0,0.4)',
                        }}>
                            ¿Planeando un evento y no sabes por dónde empezar?
                            <br />
                            Con EventSpace olvídate de la búsqueda interminable, las llamadas y la mala coordinación. Aquí encuentras el local perfecto, comida, y meseros incluidos, todo desde una sola app.
                        </p>
                    </motion.div>
                </div>

                {/* Overlay Gradient to fade into next section */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '8rem', background: 'linear-gradient(to top, #FFFFFF, transparent)', zIndex: 10 }} />
            </section>

            {/* Features Section */}
            <section style={{ padding: '5rem 1rem', background: colors.bgLight }}>
                <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem', alignItems: 'center' }}>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <h3 style={{ fontSize: '1.875rem', fontWeight: 700, color: colors.text, marginBottom: '1.5rem' }}>
                            Todo lo que tu evento necesita, ahora mismo
                        </h3>
                        <p style={{ color: colors.textSecondary, marginBottom: '2rem' }}>
                            En EventSpace conectamos personas con espacios listos para eventos y servicios profesionales que hacen que todo fluya. Tú eliges el lugar, nosotros nos encargamos del resto.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                "Locales disponibles y verificados",
                                "Reservas rápidas y seguras",
                                "Servicios de comida para tu evento",
                                "Meseros profesionales incluidos",
                                "Control total desde tu celular"
                            ].map((item, index) => (
                                <motion.div key={index} variants={fadeInUp} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        background: `linear-gradient(135deg, ${colors.gold}20, ${colors.goldLight}30)`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: colors.gold
                                    }}>
                                        <Check size={14} />
                                    </div>
                                    <span style={{ color: colors.text }}>{item}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        style={{
                            background: '#FFFFFF',
                            padding: '2rem',
                            borderRadius: '1.5rem',
                            border: `1px solid ${colors.border}`,
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '16rem',
                            height: '16rem',
                            background: `radial-gradient(circle, ${colors.gold}15, transparent)`,
                            transform: 'translate(50%, -50%)',
                            borderRadius: '50%',
                        }} />
                        <h4 style={{ fontSize: '1.5rem', fontWeight: 700, color: colors.text, marginBottom: '1rem' }}>
                            Sin estrés. Sin complicaciones. Sin pérdidas de tiempo.
                        </h4>
                        <p style={{ color: colors.textSecondary, marginBottom: '1.5rem' }}>Elige mejor. Reserva más rápido.</p>
                        <button
                            onClick={() => navigate('/buscar')}
                            style={{
                                width: '100%',
                                padding: '1rem',
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
                            Explorar Espacios
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Value Prop Section */}
            <section style={{ padding: '5rem 1rem', background: '#FFFFFF' }}>
                <div style={{ maxWidth: '56rem', margin: '0 auto', textAlign: 'center' }}>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <h3 style={{ fontSize: '1.875rem', fontWeight: 700, color: colors.text, marginBottom: '1.5rem' }}>
                            ¿Por qué complicarte coordinando proveedores?
                        </h3>
                        <p style={{ color: colors.textSecondary, fontSize: '1.125rem', lineHeight: 1.7, marginBottom: '3rem' }}>
                            Con EventSpace tienes todo centralizado para que tu evento salga perfecto desde el primer clic. Ya sea una fiesta, un evento corporativo o una celebración especial, aquí encuentras la solución completa.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Providers Section */}
            <section style={{ padding: '5rem 1rem', background: colors.bgLight, position: 'relative', overflow: 'hidden' }}>
                <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem', alignItems: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        style={{ order: 2 }}
                        className="md-order-1"
                    >
                        <div style={{
                            padding: '2rem',
                            borderRadius: '1.5rem',
                            background: `linear-gradient(135deg, ${colors.gold}10, ${colors.goldLight}15)`,
                            border: `1px solid ${colors.gold}30`,
                        }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: colors.text, marginBottom: '1rem' }}>
                                También para dueños de locales
                            </h3>
                            <p style={{ color: colors.textSecondary, marginBottom: '1.5rem' }}>
                                ¿Tienes un espacio disponible? Publícalo en EventSpace y comienza a generar ingresos. Aumenta tu visibilidad, recibe reservas reales y administra todo desde un solo lugar.
                            </p>
                            <button
                                onClick={() => navigate('/registro?role=PROVEEDOR')}
                                style={{
                                    padding: '0.875rem 2rem',
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
                                Publicar mi espacio
                            </button>
                        </div>
                    </motion.div>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        style={{ order: 1 }}
                        className="md-order-2"
                    >
                        <h3 style={{ fontSize: '1.875rem', fontWeight: 700, color: colors.text, marginBottom: '1.5rem' }}>
                            Convierte tu evento en una experiencia inolvidable
                        </h3>
                        <p style={{ color: colors.textSecondary, marginBottom: '1.5rem' }}>
                            En EventSpace creemos que organizar un evento debe ser fácil, rápido y confiable. Por eso creamos una plataforma que te da control, confianza y resultados.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{ padding: '6rem 1rem', position: 'relative', overflow: 'hidden', background: `linear-gradient(135deg, ${colors.gold}10, ${colors.goldLight}15)` }}>
                <div style={{ maxWidth: '56rem', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <Rocket style={{ width: '32px', height: '32px', color: colors.gold }} />
                            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 700, color: colors.text }}>
                                Reserva hoy. Celebra mañana.
                            </h2>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '1.5rem',
                            marginBottom: '3rem',
                            textAlign: 'left',
                            background: '#FFFFFF',
                            padding: '2rem',
                            borderRadius: '1rem',
                            border: `1px solid ${colors.border}`,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        }}>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <ArrowRight style={{ width: '20px', height: '20px', color: colors.gold, flexShrink: 0, marginTop: '0.25rem' }} />
                                <p style={{ color: colors.textSecondary }}>Reserva ahora y asegura el espacio ideal para tu evento.</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <ArrowRight style={{ width: '20px', height: '20px', color: colors.gold, flexShrink: 0, marginTop: '0.25rem' }} />
                                <p style={{ color: colors.textSecondary }}>Explora locales disponibles en tu ciudad.</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <ArrowRight style={{ width: '20px', height: '20px', color: colors.gold, flexShrink: 0, marginTop: '0.25rem' }} />
                                <p style={{ color: colors.textSecondary }}>Agenda comida y meseros en un solo paso.</p>
                            </div>
                        </div>

                        <div style={{ marginBottom: '3rem' }}>
                            <button
                                onClick={() => navigate('/buscar')}
                                style={{
                                    padding: '1rem 3rem',
                                    fontSize: '1.125rem',
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
                                Comenzar Ahora
                            </button>
                        </div>

                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: colors.text, marginBottom: '0.5rem' }}>EventSpace</h3>
                        <p style={{ color: colors.textSecondary }}>Donde los eventos dejan de ser un problema y se convierten en momentos inolvidables.</p>
                    </motion.div>
                </div>
            </section>

            {/* CSS for responsive order */}
            <style>{`
                @media (min-width: 768px) {
                    .md-order-1 { order: 1 !important; }
                    .md-order-2 { order: 2 !important; }
                }
            `}</style>
        </div>
    );
};
