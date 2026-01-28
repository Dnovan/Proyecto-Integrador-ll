
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Users } from 'lucide-react';
import CardSwap, { Card } from '../../components/molecules/CardSwap';

export const ContactPage: React.FC = () => {
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const founders = [
        "Uziel Alfonso García Ríos",
        "Andrés Ernesto Ciau Chan",
        "Donovan Yael De Icaza Cruz",
        "Marco Antonio Castellanos Solís"
    ];

    const venueImages = [
        "https://cdn0.bodas.com.mx/vendor/3785/3_2/1280/jpg/pinzon-22_5_43785-172468561594702.webp",
        "https://cdn0.bodas.com.mx/vendor/7305/original/1280/jpg/img-2829x_5_147305.webp",
        "https://cdn0.bodas.com.mx/vendor/1031/3_2/960/jpeg/3aecf5fc-c702-40e5-9c74-786f983f8664_5_251031-162604050917968.webp",
        "https://thebestofdr.do/wp-content/uploads/2025/01/locales-para-eventos-rd-1000x630.jpg"
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
            {/* Hero & Content */}
            <section style={{ padding: '5rem 1rem' }}>
                <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        transition={{ duration: 0.6 }}
                        style={{ textAlign: 'center', marginBottom: '4rem' }}
                    >
                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                            fontWeight: 900,
                            marginBottom: '2rem',
                            background: `linear-gradient(135deg, ${colors.text} 0%, ${colors.gold} 50%, ${colors.text} 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>
                            Sobre Nosotros
                        </h1>

                        <div style={{
                            background: colors.bgLight,
                            padding: '2rem',
                            borderRadius: '1.5rem',
                            border: `1px solid ${colors.border}`,
                            marginBottom: '3rem',
                        }}>
                            <p style={{ fontSize: '1.125rem', color: colors.textSecondary, lineHeight: 1.7, marginBottom: '3rem' }}>
                                EventSpace es una aplicación creada y administrada por su equipo fundador, enfocado en ofrecer una plataforma confiable, práctica y moderna para la renta de locales y la organización de eventos.
                            </p>

                            {/* CardSwap Animation with Venue Images */}
                            <div style={{ marginBottom: '4rem', position: 'relative', height: '350px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <CardSwap
                                    width={400}
                                    height={250}
                                    cardDistance={50}
                                    verticalDistance={30}
                                    delay={3500}
                                    pauseOnHover={true}
                                >
                                    {venueImages.map((src, index) => (
                                        <Card key={index} className="overflow-hidden" style={{ border: `4px solid ${colors.gold}`, borderRadius: '12px' }}>
                                            <img src={src} alt={`Venue ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </Card>
                                    ))}
                                </CardSwap>
                            </div>

                            {/* Founders List */}
                            <div style={{ marginBottom: '3rem' }}>
                                <h3 style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 700,
                                    color: colors.text,
                                    marginBottom: '2rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem'
                                }}>
                                    <Users style={{ color: colors.gold }} />
                                    El proyecto está liderado por:
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                                    {founders.map((name, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            style={{
                                                padding: '1rem',
                                                borderRadius: '12px',
                                                background: '#FFFFFF',
                                                border: `1px solid ${colors.border}`,
                                                transition: 'all 0.2s ease',
                                            }}
                                            whileHover={{ borderColor: colors.gold, boxShadow: `0 4px 12px rgba(197, 160, 89, 0.15)` }}
                                        >
                                            <p style={{ fontSize: '1.125rem', color: colors.text, fontWeight: 500 }}>{name}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <p style={{ color: colors.textSecondary, lineHeight: 1.7, marginBottom: '1.5rem' }}>
                                Como fundadores de EventSpace, participamos activamente en el desarrollo, operación y crecimiento de la plataforma, con el compromiso de mejorar constantemente la experiencia de nuestros usuarios y aliados.
                            </p>

                            <p style={{ color: colors.textSecondary, lineHeight: 1.7, fontWeight: 500 }}>
                                Si tienes dudas, comentarios o estás interesado en colaborar con nosotros, no dudes en ponerte en contacto. En EventSpace creemos en las alianzas, la innovación y en crear eventos mejor organizados.
                            </p>
                        </div>
                    </motion.div>

                    {/* Contact Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            style={{
                                background: colors.bgLight,
                                padding: '2rem',
                                borderRadius: '1rem',
                                border: `1px solid ${colors.border}`,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem'
                            }}
                        >
                            <div style={{
                                width: '48px',
                                height: '48px',
                                background: `linear-gradient(135deg, ${colors.gold}20, ${colors.goldLight}30)`,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: colors.gold
                            }}>
                                <Mail />
                            </div>
                            <div>
                                <h4 style={{ color: colors.text, fontWeight: 700 }}>Email</h4>
                                <p style={{ color: colors.textSecondary }}>contacto@localspace.com</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            style={{
                                background: colors.bgLight,
                                padding: '2rem',
                                borderRadius: '1rem',
                                border: `1px solid ${colors.border}`,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem'
                            }}
                        >
                            <div style={{
                                width: '48px',
                                height: '48px',
                                background: `linear-gradient(135deg, ${colors.gold}20, ${colors.goldLight}30)`,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: colors.gold
                            }}>
                                <Phone />
                            </div>
                            <div>
                                <h4 style={{ color: colors.text, fontWeight: 700 }}>Teléfono</h4>
                                <p style={{ color: colors.textSecondary }}>+52 55 1234 5678</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Map */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        style={{
                            borderRadius: '1.5rem',
                            overflow: 'hidden',
                            border: `1px solid ${colors.border}`,
                            height: '400px',
                            width: '100%',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        }}
                    >
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14902.138477123985!2d-89.60533346939088!3d20.97120300067645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f5673e4407519ff%3A0x6291619623631f6!2zSG90ZWwgUGxhemEgTWlyYWRvciBNw6lyaWRh!5e0!3m2!1ses-419!2smx!4v1736895318536!5m2!1ses-419!2smx"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </motion.div>
                </div>
            </section>
        </div>
    );
};
