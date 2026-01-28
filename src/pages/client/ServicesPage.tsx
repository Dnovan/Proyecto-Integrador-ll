
import React from 'react';
import { motion } from 'framer-motion';
import BounceCards from '../../components/molecules/BounceCards';
import { Music, Utensils, Camera, Mic2, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ServicesPage: React.FC = () => {
    const navigate = useNavigate();

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

    const images = [
        "https://cdn0.bodas.com.mx/vendor/3785/3_2/1280/jpg/pinzon-22_5_43785-172468561594702.webp",
        "https://cdn0.bodas.com.mx/vendor/7305/original/1280/jpg/img-2829x_5_147305.webp",
        "https://cdn0.bodas.com.mx/vendor/1031/3_2/960/jpeg/3aecf5fc-c702-40e5-9c74-786f983f8664_5_251031-162604050917968.webp",
        "https://cdn0.bodas.com.mx/vendor/7063/3_2/960/png/belleza-acogedora_v8.webp",
        "https://verydiferente.com/wp-content/uploads/2021/10/Loleo.jpg",
        "https://partfy.s3.eu-south-2.amazonaws.com/frontend/files/packs/3157/unnamed-_7166.jpg",
        "https://thebestofdr.do/wp-content/uploads/2025/01/locales-para-eventos-rd-1000x630.jpg"
    ];

    const transformStyles = [
        "rotate(10deg) translate(-210px)",
        "rotate(5deg) translate(-140px)",
        "rotate(2deg) translate(-70px)",
        "rotate(0deg)",
        "rotate(-2deg) translate(70px)",
        "rotate(-5deg) translate(140px)",
        "rotate(-10deg) translate(210px)"
    ];

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
            {/* Hero Section with BounceCards */}
            <section style={{
                position: 'relative',
                padding: '5rem 1rem',
                overflow: 'hidden',
                minHeight: '600px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, rgba(197, 160, 89, 0.05) 0%, rgba(232, 200, 114, 0.08) 100%)',
            }}>
                <div style={{ maxWidth: '56rem', margin: '0 auto', textAlign: 'center', marginBottom: '4rem', position: 'relative', zIndex: 10 }}>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                            fontWeight: 900,
                            marginBottom: '1.5rem',
                            background: `linear-gradient(135deg, ${colors.text} 0%, ${colors.gold} 50%, ${colors.text} 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            letterSpacing: '-0.02em',
                        }}>
                            Nuestros Servicios
                        </h1>
                        <p style={{ fontSize: '1.25rem', color: colors.textSecondary, maxWidth: '42rem', margin: '0 auto' }}>
                            Descubre los mejores espacios y servicios para hacer de tu evento una experiencia inolvidable.
                        </p>
                    </motion.div>
                </div>

                <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', paddingBottom: '5rem' }}>
                    <BounceCards
                        className="custom-bounceCards scale-75 md:scale-100"
                        images={images}
                        containerWidth={500}
                        containerHeight={250}
                        animationDelay={1}
                        animationStagger={0.08}
                        easeType="elastic.out(1, 0.5)"
                        transformStyles={transformStyles}
                        enableHover={true}
                    />
                </div>
            </section>

            {/* Categorías de Servicios */}
            <section style={{ padding: '5rem 1rem', background: colors.bgLight }}>
                <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}
                    >
                        {/* Header */}
                        <div style={{ gridColumn: '1 / -1', marginBottom: '2rem' }}>
                            <h2 style={{
                                fontSize: '2rem',
                                fontWeight: 700,
                                color: colors.text,
                                marginBottom: '1rem',
                                paddingLeft: '1rem',
                                borderLeft: `4px solid ${colors.gold}`
                            }}>
                                Espacios Exclusivos
                            </h2>
                            <p style={{ color: colors.textSecondary, marginBottom: '2rem' }}>
                                Encuentra el lugar perfecto para tu celebración.
                            </p>
                        </div>

                        {[
                            { title: 'Jardines', img: images[0], desc: 'Espacios al aire libre para bodas y eventos de día.' },
                            { title: 'Salones', img: images[1], desc: 'Elegancia y confort para eventos nocturnos.' },
                            { title: 'Haciendas', img: images[2], desc: 'Arquitectura histórica y encanto tradicional.' }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                style={{
                                    position: 'relative',
                                    borderRadius: '1rem',
                                    overflow: 'hidden',
                                    aspectRatio: '4/3',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                }}
                                onClick={() => navigate('/buscar')}
                                whileHover={{ scale: 1.02 }}
                            >
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    padding: '1.5rem'
                                }}>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.25rem' }}>{item.title}</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Servicios Adicionales & Entretenimiento */}
            <section style={{ padding: '5rem 1rem', background: '#FFFFFF' }}>
                <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem' }}>

                        {/* Servicios */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                        >
                            <h2 style={{
                                fontSize: '1.875rem',
                                fontWeight: 700,
                                color: colors.text,
                                marginBottom: '2rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}>
                                <Utensils style={{ color: colors.gold }} /> Servicios Esenciales
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {[
                                    { icon: <Utensils />, title: 'Banquetes', desc: 'Menús gourmet adaptados a tus preferencias.' },
                                    { icon: <Camera />, title: 'Fotografía y Video', desc: 'Captura cada momento especial.' },
                                    { icon: <Palette />, title: 'Decoración', desc: 'Transformamos espacios en sueños.' }
                                ].map((service, idx) => (
                                    <motion.div
                                        key={idx}
                                        variants={fadeInUp}
                                        style={{
                                            display: 'flex',
                                            gap: '1rem',
                                            padding: '1.25rem',
                                            borderRadius: '1rem',
                                            background: colors.bgLight,
                                            border: `1px solid ${colors.border}`,
                                            transition: 'all 0.2s ease',
                                        }}
                                        whileHover={{ borderColor: colors.gold, boxShadow: `0 4px 12px rgba(197, 160, 89, 0.15)` }}
                                    >
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '12px',
                                            background: `linear-gradient(135deg, ${colors.gold}20, ${colors.goldLight}30)`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: colors.gold,
                                            flexShrink: 0,
                                        }}>
                                            {service.icon}
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: colors.text }}>{service.title}</h4>
                                            <p style={{ color: colors.textSecondary, fontSize: '0.875rem' }}>{service.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Entretenimiento */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                        >
                            <h2 style={{
                                fontSize: '1.875rem',
                                fontWeight: 700,
                                color: colors.text,
                                marginBottom: '2rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}>
                                <Music style={{ color: colors.gold }} /> Show y Entretenimiento
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {[
                                    { icon: <Music />, title: 'DJs en Vivo' },
                                    { icon: <Mic2 />, title: 'Bandas' },
                                    { icon: <Palette />, title: 'Performances' },
                                    { icon: <Camera />, title: 'Cabina 360' }
                                ].map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        variants={fadeInUp}
                                        style={{
                                            aspectRatio: '1/1',
                                            borderRadius: '1rem',
                                            background: colors.bgLight,
                                            border: `1px solid ${colors.border}`,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.75rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                        }}
                                        whileHover={{
                                            background: `linear-gradient(135deg, ${colors.gold}10, ${colors.goldLight}15)`,
                                            borderColor: colors.gold,
                                        }}
                                    >
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '50%',
                                            background: `linear-gradient(135deg, ${colors.gold}15, ${colors.goldLight}20)`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: colors.gold,
                                            transition: 'all 0.2s ease',
                                        }}>
                                            {item.icon}
                                        </div>
                                        <span style={{ fontWeight: 500, color: colors.text }}>{item.title}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: '5rem 1rem' }}>
                <div style={{
                    maxWidth: '48rem',
                    margin: '0 auto',
                    textAlign: 'center',
                    padding: '3rem',
                    borderRadius: '1.5rem',
                    background: `linear-gradient(135deg, ${colors.gold}15, ${colors.goldLight}20)`,
                    border: `1px solid ${colors.gold}30`,
                }}>
                    <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, color: colors.text, marginBottom: '1.5rem' }}>
                        ¿Listo para planear tu evento?
                    </h2>
                    <p style={{ color: colors.textSecondary, marginBottom: '2rem', fontSize: '1.125rem' }}>
                        Encuentra todo lo que necesitas en un solo lugar.
                    </p>
                    <button
                        onClick={() => navigate('/buscar')}
                        style={{
                            padding: '1rem 2.5rem',
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
                        Explorar Catálogo Completo
                    </button>
                </div>
            </section>
        </div>
    );
};
