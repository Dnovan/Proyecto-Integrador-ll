/**
 * @fileoverview Página de Detalle del Local
 * @description Vista detallada con galería, información, calendario y widget de reserva premium
 * Diseño Premium Blanco y Dorado
 * 
 * @iso25010
 * - Usabilidad: Información completa y acciones claras
 * - Eficiencia: Carga diferida de imágenes y datos secundarios
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    MapPin,
    Users,
    Star,
    Heart,
    Share2,
    ChevronLeft,
    ChevronRight,
    X,
    Calendar,
    CreditCard,
    Banknote,
    MessageSquare,
    Check,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Avatar } from '../../components/atoms/Avatar';
import { Skeleton } from '../../components/atoms/Skeleton';
import { Notification } from '../../components/atoms/Notification';
import { StarRating } from '../../components/molecules/StarRating';
import { BookingWidget } from '../../components/organisms/BookingWidget';
import * as api from '../../services/mockApi';
import { createPaymentPreference, redirectToCheckout, type BookingPaymentData } from '../../services/mercadoPago';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../hooks/useNotification';
import type { Venue, Review, DateAvailability } from '../../types';

// Premium colors
const colors = {
    gold: '#C5A059',
    goldLight: '#E8C872',
    text: '#2C2C2C',
    textSecondary: '#5D5D5D',
    textMuted: '#8C8C8C',
    bgLight: '#FAFAFA',
    border: '#E8E8E8',
    white: '#FFFFFF',
};

export const VenueDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { notification, showError, showSuccess, showWarning, closeNotification } = useNotification();

    const [venue, setVenue] = useState<Venue | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [availability, setAvailability] = useState<DateAvailability[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const { user, isAuthenticated } = useAuth();

    // Load venue and reviews data only once
    useEffect(() => {
        const loadVenueData = async () => {
            if (!id) return;

            setIsLoading(true);
            try {
                const [venueData, reviewsData] = await Promise.all([
                    api.getVenueById(id),
                    api.getVenueReviews(id),
                ]);
                setVenue(venueData);
                setReviews(reviewsData);
            } catch (error) {
                console.error('Error loading venue:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadVenueData();
    }, [id]);

    // Load availability data when month changes (without full page refresh)
    useEffect(() => {
        const loadAvailability = async () => {
            if (!id) return;

            try {
                const availabilityData = await api.getVenueAvailability(id, currentMonth.getMonth(), currentMonth.getFullYear());
                setAvailability(availabilityData);
            } catch (error) {
                console.error('Error loading availability:', error);
            }
        };

        loadAvailability();
    }, [id, currentMonth]);

    const nextImage = () => {
        if (venue) {
            setCurrentImageIndex((prev) => (prev + 1) % venue.images.length);
        }
    };

    const prevImage = () => {
        if (venue) {
            setCurrentImageIndex((prev) => (prev - 1 + venue.images.length) % venue.images.length);
        }
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];

        for (let i = 0; i < firstDay.getDay(); i++) {
            days.push(null);
        }

        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(i);
        }

        return days;
    };

    const isDateAvailable = (day: number): boolean => {
        const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return availability.find((a) => a.date === dateStr)?.isAvailable ?? false;
    };

    if (isLoading) {
        return (
            <div style={{ minHeight: '100vh', background: colors.white, paddingTop: '80px', padding: '80px 16px 16px' }}>
                <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
                    <Skeleton variant="rounded" height={500} className="w-full mb-8" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                        <Skeleton variant="text" width="60%" height={40} />
                        <Skeleton variant="text" width="40%" />
                        <Skeleton variant="rounded" height={200} />
                    </div>
                </div>
            </div>
        );
    }

    if (!venue) {
        return (
            <div style={{ minHeight: '100vh', background: colors.white, paddingTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: colors.gold, marginBottom: '1rem' }}>404</h1>
                    <p style={{ color: colors.textSecondary, marginBottom: '1.5rem' }}>Local no encontrado</p>
                    <Link to="/" style={{
                        padding: '12px 24px',
                        background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldLight})`,
                        color: colors.white,
                        borderRadius: '12px',
                        textDecoration: 'none',
                        fontWeight: 600,
                    }}>
                        Volver al inicio
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: colors.white }}>
            {/* Sistema de Notificaciones Toast */}
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    title={notification.title}
                    onClose={closeNotification}
                    duration={notification.duration || 4000}
                />
            )}

            {/* Galería de imágenes */}
            <section style={{ position: 'relative' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gridTemplateRows: 'repeat(2, 1fr)',
                    gap: '4px',
                    height: '500px'
                }}>
                    {/* Imagen principal */}
                    <div
                        style={{ gridColumn: 'span 2', gridRow: 'span 2', position: 'relative', cursor: 'pointer', overflow: 'hidden' }}
                        onClick={() => setIsLightboxOpen(true)}
                    >
                        <img
                            src={venue.images[0]}
                            alt={venue.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        />
                    </div>

                    {/* Imágenes secundarias */}
                    {venue.images.slice(1, 5).map((img, idx) => (
                        <div
                            key={idx}
                            style={{ position: 'relative', cursor: 'pointer', overflow: 'hidden' }}
                            onClick={() => {
                                setCurrentImageIndex(idx + 1);
                                setIsLightboxOpen(true);
                            }}
                        >
                            <img
                                src={img}
                                alt={`${venue.name} ${idx + 2}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            />

                            {idx === 3 && venue.images.length > 5 && (
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'rgba(0,0,0,0.5)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <span style={{ color: 'white', fontWeight: 600 }}>
                                        +{venue.images.length - 5} más
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Botones de acción */}
                <div style={{ position: 'absolute', bottom: '16px', right: '16px', display: 'flex', gap: '8px' }}>
                    <button
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '10px 16px',
                            background: colors.white,
                            border: `1px solid ${colors.border}`,
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: colors.text,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        }}
                    >
                        <Share2 style={{ width: 16, height: 16 }} />
                        Compartir
                    </button>
                    <button
                        onClick={() => setIsFavorite(!isFavorite)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '10px 16px',
                            background: isFavorite ? colors.gold : colors.white,
                            border: `1px solid ${isFavorite ? colors.gold : colors.border}`,
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: isFavorite ? colors.white : colors.text,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        }}
                    >
                        <Heart style={{ width: 16, height: 16, fill: isFavorite ? 'currentColor' : 'none' }} />
                        {isFavorite ? 'Guardado' : 'Guardar'}
                    </button>
                </div>
            </section>

            {/* Contenido principal */}
            <section style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="lg:grid-cols-[1fr_380px]">
                    {/* Información del local */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Header */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                {venue.status === 'FEATURED' && (
                                    <span style={{
                                        padding: '4px 12px',
                                        background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldLight})`,
                                        color: colors.white,
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                    }}>
                                        Destacado
                                    </span>
                                )}
                                <span style={{
                                    padding: '4px 12px',
                                    background: colors.bgLight,
                                    color: colors.textSecondary,
                                    borderRadius: '20px',
                                    fontSize: '0.75rem',
                                    fontWeight: 500,
                                }}>
                                    {api.categoryLabels[venue.category]}
                                </span>
                            </div>
                            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, color: colors.text, marginBottom: '12px' }}>
                                {venue.name}
                            </h1>
                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px', color: colors.textSecondary }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <MapPin style={{ width: 16, height: 16 }} />
                                    <span style={{ fontSize: '0.875rem' }}>{venue.address}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Users style={{ width: 16, height: 16 }} />
                                    <span style={{ fontSize: '0.875rem' }}>Hasta {venue.capacity} personas</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Star style={{ width: 16, height: 16, color: colors.gold, fill: colors.gold }} />
                                    <span style={{ color: colors.gold, fontWeight: 600 }}>{venue.rating.toFixed(1)}</span>
                                    <span style={{ fontSize: '0.875rem' }}>({venue.reviewCount} reseñas)</span>
                                </div>
                            </div>
                        </div>

                        {/* Descripción */}
                        <div style={{ background: colors.bgLight, borderRadius: '16px', padding: '24px', border: `1px solid ${colors.border}` }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: colors.text, marginBottom: '12px' }}>
                                Descripción del espacio
                            </h2>
                            <p style={{ color: colors.textSecondary, lineHeight: 1.7 }}>
                                {venue.description}
                            </p>
                        </div>

                        {/* Amenidades */}
                        <div style={{ background: colors.bgLight, borderRadius: '16px', padding: '24px', border: `1px solid ${colors.border}` }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: colors.text, marginBottom: '16px' }}>
                                Amenidades incluidas
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                                {venue.amenities.map((amenity, idx) => (
                                    <div
                                        key={idx}
                                        style={{ display: 'flex', alignItems: 'center', gap: '8px', color: colors.textSecondary }}
                                    >
                                        <Check style={{ width: 18, height: 18, color: colors.gold }} />
                                        <span style={{ fontSize: '0.875rem' }}>{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Métodos de pago */}
                        <div style={{ background: colors.bgLight, borderRadius: '16px', padding: '24px', border: `1px solid ${colors.border}` }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: colors.text, marginBottom: '16px' }}>
                                Métodos de pago aceptados
                            </h2>
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                {venue.paymentMethods.includes('TRANSFERENCIA') && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '12px 16px',
                                        background: colors.white,
                                        borderRadius: '12px',
                                        border: `1px solid ${colors.border}`,
                                    }}>
                                        <CreditCard style={{ width: 20, height: 20, color: colors.gold }} />
                                        <span style={{ color: colors.text, fontSize: '0.875rem', fontWeight: 500 }}>Transferencia bancaria</span>
                                    </div>
                                )}
                                {venue.paymentMethods.includes('EFECTIVO') && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '12px 16px',
                                        background: colors.white,
                                        borderRadius: '12px',
                                        border: `1px solid ${colors.border}`,
                                    }}>
                                        <Banknote style={{ width: 20, height: 20, color: colors.gold }} />
                                        <span style={{ color: colors.text, fontSize: '0.875rem', fontWeight: 500 }}>Efectivo</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Calendario */}
                        <div style={{ background: colors.bgLight, borderRadius: '16px', padding: '24px', border: `1px solid ${colors.border}` }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: colors.text, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Calendar style={{ width: 20, height: 20, color: colors.gold }} />
                                Disponibilidad
                            </h2>

                            {/* Navegación del mes */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <button
                                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                                    style={{
                                        padding: '8px',
                                        background: colors.white,
                                        border: `1px solid ${colors.border}`,
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        color: colors.text,
                                    }}
                                >
                                    <ChevronLeft style={{ width: 20, height: 20 }} />
                                </button>
                                <span style={{ fontSize: '1rem', fontWeight: 600, color: colors.text, textTransform: 'capitalize' }}>
                                    {currentMonth.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}
                                </span>
                                <button
                                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                                    style={{
                                        padding: '8px',
                                        background: colors.white,
                                        border: `1px solid ${colors.border}`,
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        color: colors.text,
                                    }}
                                >
                                    <ChevronRight style={{ width: 20, height: 20 }} />
                                </button>
                            </div>

                            {/* Días de la semana */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                                    <div key={day} style={{ textAlign: 'center', color: colors.textMuted, fontSize: '0.75rem', padding: '8px 0' }}>
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Días del mes */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                                {getDaysInMonth(currentMonth).map((day, idx) => {
                                    const dateStr = day !== null
                                        ? `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                                        : '';
                                    const isSelected = selectedDate === dateStr;
                                    const isAvailable = day !== null && isDateAvailable(day);

                                    // Colors for calendar states
                                    const calendarColors = {
                                        available: { bg: `${colors.gold}18`, text: colors.gold, hover: `${colors.gold}30` },
                                        selected: { bg: `linear-gradient(135deg, ${colors.gold}, ${colors.goldLight})`, text: '#FFFFFF' },
                                        reserved: { bg: '#FEE2E2', text: '#DC2626' }
                                    };

                                    return (
                                        <div key={idx} style={{ aspectRatio: '1/1' }}>
                                            {day !== null && (
                                                <motion.button
                                                    onClick={() => {
                                                        if (isAvailable) {
                                                            setSelectedDate(dateStr);
                                                        }
                                                    }}
                                                    disabled={!isAvailable}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        borderRadius: '10px',
                                                        fontSize: '0.9rem',
                                                        fontWeight: isSelected ? 700 : 600,
                                                        border: isSelected
                                                            ? `2px solid ${colors.gold}`
                                                            : isAvailable
                                                                ? `1px solid ${colors.gold}50`
                                                                : '1px solid #FECACA',
                                                        cursor: isAvailable ? 'pointer' : 'not-allowed',
                                                        background: isSelected
                                                            ? colors.gold
                                                            : isAvailable
                                                                ? calendarColors.available.bg
                                                                : calendarColors.reserved.bg,
                                                        color: isSelected
                                                            ? '#FFFFFF'
                                                            : isAvailable
                                                                ? calendarColors.available.text
                                                                : calendarColors.reserved.text,
                                                        boxShadow: isSelected
                                                            ? '0 4px 15px rgba(197, 160, 89, 0.5)'
                                                            : 'none',
                                                        transition: 'all 0.2s ease',
                                                    }}
                                                    whileHover={isAvailable && !isSelected ? { scale: 1.08 } : {}}
                                                    whileTap={isAvailable ? { scale: 0.95 } : {}}
                                                >
                                                    {day}
                                                </motion.button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Leyenda mejorada */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '20px',
                                marginTop: '20px',
                                padding: '12px 16px',
                                background: colors.white,
                                borderRadius: '10px',
                                border: `1px solid ${colors.border}`,
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        background: `${colors.gold}18`,
                                        borderRadius: '4px',
                                        border: `1px solid ${colors.gold}40`,
                                    }} />
                                    <span style={{ color: colors.text, fontSize: '0.8125rem', fontWeight: 500 }}>Disponible</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldLight})`,
                                        borderRadius: '4px',
                                        boxShadow: '0 2px 6px rgba(197, 160, 89, 0.4)',
                                    }} />
                                    <span style={{ color: colors.text, fontSize: '0.8125rem', fontWeight: 500 }}>Seleccionado</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        background: '#FEE2E2',
                                        borderRadius: '4px',
                                    }} />
                                    <span style={{ color: colors.text, fontSize: '0.8125rem', fontWeight: 500 }}>Reservado</span>
                                </div>
                            </div>
                        </div>

                        {/* Reseñas */}
                        <div style={{ background: colors.bgLight, borderRadius: '16px', padding: '24px', border: `1px solid ${colors.border}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: colors.text }}>
                                    Reseñas ({venue.reviewCount})
                                </h2>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <StarRating value={venue.rating} readOnly size="lg" showValue />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                {reviews.map((review) => (
                                    <div key={review.id} style={{ borderBottom: `1px solid ${colors.border}`, paddingBottom: '24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                            <Avatar
                                                src={review.userAvatar}
                                                name={review.userName}
                                                size="md"
                                            />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                    <div>
                                                        <p style={{ fontWeight: 600, color: colors.text }}>
                                                            {review.userName}
                                                        </p>
                                                        <p style={{ fontSize: '0.75rem', color: colors.textMuted }}>
                                                            {new Date(review.createdAt).toLocaleDateString('es-MX', {
                                                                month: 'long',
                                                                year: 'numeric',
                                                            })}
                                                        </p>
                                                    </div>
                                                    <StarRating value={review.rating} readOnly size="sm" />
                                                </div>
                                                <p style={{ color: colors.textSecondary, lineHeight: 1.6 }}>{review.comment}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Booking Widget */}
                    <div className="lg:block" style={{ position: 'relative' }}>
                        <div style={{ position: 'sticky', top: '96px' }}>
                            <BookingWidget
                                basePrice={venue.price}
                                maxCapacity={venue.capacity}
                                minCapacity={Math.max(10, Math.floor(venue.capacity * 0.1))}
                                pricePerPerson={Math.round(venue.price / venue.capacity)}
                                selectedDate={selectedDate}
                                isLoading={isProcessingPayment}
                                onReserve={async (data) => {
                                    if (!isAuthenticated || !user) {
                                        showWarning('Debes iniciar sesión para reservar', 'Autenticación requerida');
                                        return;
                                    }

                                    if (!selectedDate) {
                                        showWarning('Por favor selecciona una fecha en el calendario', 'Fecha requerida');
                                        return;
                                    }

                                    setIsProcessingPayment(true);
                                    try {
                                        const paymentData: BookingPaymentData = {
                                            venueId: venue.id,
                                            venueName: venue.name,
                                            venueImage: venue.images[0],
                                            eventDate: selectedDate,
                                            guestCount: data.guestCount,
                                            totalPrice: data.totalPrice,
                                            extras: data.extras,
                                            clientEmail: user.email,
                                            clientName: user.name,
                                        };

                                        showSuccess('Procesando pago...', 'Redirigiendo a Mercado Pago');

                                        // Usar el access token de las variables de entorno
                                        const preference = await createPaymentPreference(paymentData);

                                        // Redirigir a Mercado Pago (sandbox para pruebas)
                                        redirectToCheckout(preference.id, true);
                                    } catch (error) {
                                        console.error('Error creating payment:', error);
                                        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
                                        showError(`Error al procesar el pago: ${errorMessage}`, 'Error de pago');
                                    } finally {
                                        setIsProcessingPayment(false);
                                    }
                                }}
                            />

                            {/* Provider Info */}
                            <div style={{
                                marginTop: '16px',
                                padding: '20px',
                                background: colors.white,
                                borderRadius: '16px',
                                border: `1px solid ${colors.border}`,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                    <Avatar name={venue.providerName} size="md" />
                                    <div>
                                        <p style={{ fontWeight: 600, color: colors.text }}>
                                            {venue.providerName}
                                        </p>
                                        <p style={{ fontSize: '0.75rem', color: colors.textMuted }}>Proveedor verificado</p>
                                    </div>
                                </div>
                                <button
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        padding: '12px',
                                        background: 'transparent',
                                        border: `2px solid ${colors.gold}`,
                                        borderRadius: '12px',
                                        color: colors.gold,
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = colors.gold;
                                        e.currentTarget.style.color = colors.white;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = colors.gold;
                                    }}
                                >
                                    <MessageSquare style={{ width: 18, height: 18 }} />
                                    Contactar Proveedor
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Lightbox */}
            {
                isLightboxOpen && (
                    <div style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 50,
                        background: 'rgba(0,0,0,0.95)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <button
                            style={{ position: 'absolute', top: '16px', right: '16px', padding: '8px', color: 'white', background: 'transparent', border: 'none', cursor: 'pointer' }}
                            onClick={() => setIsLightboxOpen(false)}
                        >
                            <X style={{ width: 32, height: 32 }} />
                        </button>

                        <button
                            style={{ position: 'absolute', left: '16px', padding: '8px', color: 'white', background: 'transparent', border: 'none', cursor: 'pointer' }}
                            onClick={prevImage}
                        >
                            <ChevronLeft style={{ width: 32, height: 32 }} />
                        </button>

                        <img
                            src={venue.images[currentImageIndex]}
                            alt={`${venue.name} ${currentImageIndex + 1}`}
                            style={{ maxHeight: '90vh', maxWidth: '90vw', objectFit: 'contain' }}
                        />

                        <button
                            style={{ position: 'absolute', right: '16px', padding: '8px', color: 'white', background: 'transparent', border: 'none', cursor: 'pointer' }}
                            onClick={nextImage}
                        >
                            <ChevronRight style={{ width: 32, height: 32 }} />
                        </button>

                        {/* Indicadores */}
                        <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
                            {venue.images.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    style={{
                                        width: idx === currentImageIndex ? '16px' : '8px',
                                        height: '8px',
                                        borderRadius: '4px',
                                        background: idx === currentImageIndex ? colors.gold : 'rgba(255,255,255,0.5)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )
            }

            {/* CSS for responsive layout */}
            <style>{`
                @media (min-width: 1024px) {
                    .lg\\:grid-cols-\\[1fr_380px\\] {
                        grid-template-columns: 1fr 380px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default VenueDetailPage;
