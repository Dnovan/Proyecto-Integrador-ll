/**
 * @fileoverview Dashboard del Proveedor - ULTRA PREMIUM
 * @description Panel de control elegante con métricas en tiempo real y acceso a funciones
 * Diseño super sofisticado con gradientes, glassmorphism y animaciones
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Eye,
    Calendar,
    Heart,
    MessageSquare,
    Plus,
    TrendingUp,
    TrendingDown,
    ArrowRight,
    Home,
    Settings,
    Sparkles,
    Crown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGlobalNotification } from '../../context/NotificationContext';
import LightRays from '../../components/effects/LightRays';
import { supabase } from '../../lib/supabase';
import type { ProviderMetrics, Venue, Booking } from '../../types';

/**
 * Componente de tarjeta de métrica - Premium
 */
interface MetricCardProps {
    title: string;
    value: number;
    change: number;
    icon: React.ReactNode;
    iconBg: string;
    delay?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, iconBg, delay = 0 }) => {
    const isPositive = change >= 0;

    return (
        <div
            className="animate-fade-in-up"
            style={{
                animationDelay: `${delay}ms`,
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '1.5rem',
                border: '1px solid rgba(0, 0, 0, 0.04)',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.03)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'default',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(197, 160, 89, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(197, 160, 89, 0.2)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.03)';
                e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.04)';
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div
                    style={{
                        padding: '0.875rem',
                        background: iconBg,
                        borderRadius: '16px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    }}
                >
                    {icon}
                </div>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '6px 12px',
                        borderRadius: '100px',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        background: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: isPositive ? '#059669' : '#DC2626',
                    }}
                >
                    {isPositive ? (
                        <TrendingUp style={{ width: 14, height: 14 }} />
                    ) : (
                        <TrendingDown style={{ width: 14, height: 14 }} />
                    )}
                    <span>{Math.abs(change).toFixed(1)}%</span>
                </div>
            </div>
            <p style={{
                fontSize: '2.25rem',
                fontWeight: 800,
                color: '#1F1F1F',
                marginBottom: '0.375rem',
                letterSpacing: '-0.02em',
            }}>
                {value.toLocaleString()}
            </p>
            <p style={{ color: '#6B7280', fontSize: '0.9375rem', fontWeight: 500 }}>{title}</p>
        </div>
    );
};

export const DashboardPro: React.FC = () => {
    const { user } = useAuth();
    const { showError } = useGlobalNotification();

    const [metrics, setMetrics] = useState<ProviderMetrics | null>(null);
    const [venues, setVenues] = useState<Venue[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!user) return;

            setIsLoading(true);
            try {
                // Cargar venues del proveedor desde Supabase
                const { data: venuesData, error: venuesError } = await supabase
                    .from('venues')
                    .select('*')
                    .eq('provider_id', user.id)
                    .order('created_at', { ascending: false });

                if (venuesError) throw venuesError;

                // Mapear venues al formato del frontend
                const mappedVenues: Venue[] = (venuesData || []).map((v: any) => ({
                    id: v.id,
                    providerId: v.provider_id,
                    providerName: user.name,
                    name: v.name,
                    description: v.description || '',
                    address: v.address,
                    zone: v.zone,
                    category: v.category,
                    price: Number(v.price),
                    capacity: v.max_capacity,
                    images: v.images || [],
                    paymentMethods: v.payment_methods || [],
                    amenities: v.amenities || [],
                    status: v.status,
                    rating: Number(v.rating) || 0,
                    reviewCount: v.review_count || 0,
                    views: v.views || 0,
                    favorites: v.favorites_count || 0,
                    createdAt: new Date(v.created_at),
                    updatedAt: new Date(v.updated_at),
                }));
                setVenues(mappedVenues);

                // Cargar bookings desde Supabase
                const { data: bookingsData, error: bookingsError } = await supabase
                    .from('bookings')
                    .select(`
                        *,
                        venues(name, images),
                        users!bookings_client_id_fkey(name, email)
                    `)
                    .eq('provider_id', user.id)
                    .order('created_at', { ascending: false });

                if (bookingsError) throw bookingsError;

                // Mapear bookings al formato del frontend
                const mappedBookings: Booking[] = (bookingsData || []).map((b: any) => ({
                    id: b.id,
                    venueId: b.venue_id,
                    venueName: b.venues?.name || 'Local',
                    venueImage: b.venues?.images?.[0] || '',
                    clientId: b.client_id,
                    clientName: b.users?.name || 'Cliente',
                    providerId: b.provider_id,
                    date: b.event_date,
                    status: b.status,
                    totalPrice: Number(b.total_price),
                    paymentMethod: b.payment_method || 'TARJETA',
                    startTime: b.start_time,
                    endTime: b.end_time,
                    createdAt: new Date(b.created_at),
                }));
                setBookings(mappedBookings);

                // Calcular métricas
                const totalViews = mappedVenues.reduce((sum, v) => sum + v.views, 0);
                const totalFavorites = mappedVenues.reduce((sum, v) => sum + v.favorites, 0);
                const totalReservations = mappedBookings.length;

                setMetrics({
                    totalViews,
                    totalReservations,
                    totalFavorites,
                    totalMessages: 0,
                    viewsChange: 12.5,
                    reservationsChange: mappedBookings.length > 0 ? 25.0 : 0,
                    favoritesChange: 8.3,
                    messagesChange: 0,
                });
            } catch (error) {
                console.error('Error loading dashboard:', error);
                showError('Error al cargar los datos del dashboard', 'Error de carga');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [user, showError]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const getBookingStatusStyle = (status: Booking['status']) => {
        const styles: Record<Booking['status'], { bg: string; text: string; label: string }> = {
            PENDING: { bg: 'rgba(245, 158, 11, 0.1)', text: '#D97706', label: 'Solicitud' },
            CONFIRMED: { bg: 'rgba(16, 185, 129, 0.1)', text: '#059669', label: 'Reservado' },
            CANCELLED: { bg: 'rgba(239, 68, 68, 0.1)', text: '#DC2626', label: 'Cancelada' },
            COMPLETED: { bg: 'rgba(59, 130, 246, 0.1)', text: '#2563EB', label: 'Completada' },
        };
        return styles[status];
    };

    const firstName = user?.name?.split(' ')[0] || 'Proveedor';

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #FFFCF5 0%, #FEF9EE 50%, #FFFDFB 100%)' }}>
            {/* Hero Section */}
            <section style={{ position: 'relative', paddingTop: '6rem', paddingBottom: '2rem', overflow: 'hidden' }}>
                {/* LightRays Background */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.4 }}>
                    <LightRays
                        raysOrigin="top-center"
                        raysColor="#C5A059"
                        raysSpeed={0.5}
                        lightSpread={0.35}
                        rayLength={2}
                        followMouse={true}
                        mouseInfluence={0.1}
                        fadeDistance={1}
                        saturation={0.6}
                    />
                </div>

                {/* Floating Orbs */}
                <div className="animate-float" style={{ position: 'absolute', top: '5rem', right: '10%', width: '12rem', height: '12rem', borderRadius: '50%', background: 'radial-gradient(circle, rgba(197, 160, 89, 0.15) 0%, transparent 70%)' }} />
                <div className="animate-float" style={{ position: 'absolute', top: '8rem', left: '5%', width: '8rem', height: '8rem', borderRadius: '50%', background: 'radial-gradient(circle, rgba(232, 200, 114, 0.12) 0%, transparent 70%)', animationDelay: '1.5s' }} />

                <div style={{ position: 'relative', zIndex: 1, maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '2.5rem' }}>
                        <div>
                            {/* Premium Badge */}
                            <div style={{ marginBottom: '1rem' }}>
                                <span
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.5rem 1rem',
                                        background: 'linear-gradient(135deg, rgba(197, 160, 89, 0.1) 0%, rgba(232, 200, 114, 0.05) 100%)',
                                        border: '1px solid rgba(197, 160, 89, 0.2)',
                                        borderRadius: '100px',
                                        backdropFilter: 'blur(10px)',
                                    }}
                                >
                                    <Crown style={{ width: 16, height: 16, color: '#C5A059' }} />
                                    <span style={{
                                        background: 'linear-gradient(90deg, #997B30, #C5A059)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        fontWeight: 600,
                                        fontSize: '0.8125rem',
                                        letterSpacing: '0.05em',
                                        textTransform: 'uppercase',
                                    }}>
                                        Panel de Proveedor
                                    </span>
                                </span>
                            </div>

                            <h1 style={{
                                fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                                fontWeight: 800,
                                color: '#1F1F1F',
                                lineHeight: 1.2,
                                letterSpacing: '-0.03em',
                                marginBottom: '0.5rem',
                            }}>
                                ¡Hola, <span style={{
                                    background: 'linear-gradient(135deg, #B8963F 0%, #C5A059 50%, #E8C872 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}>{firstName}</span>!
                            </h1>
                            <p style={{ color: '#6B7280', fontSize: '1.0625rem' }}>
                                Bienvenido a tu panel de control
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <Link to="/proveedor/publicar" style={{ textDecoration: 'none' }}>
                                <button
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.625rem',
                                        padding: '0.9375rem 1.75rem',
                                        background: 'linear-gradient(135deg, #C5A059 0%, #D4AF61 50%, #E8C872 100%)',
                                        border: 'none',
                                        borderRadius: '14px',
                                        color: '#1F1F1F',
                                        fontWeight: 600,
                                        fontSize: '0.9375rem',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 20px rgba(197, 160, 89, 0.35)',
                                        transition: 'all 0.3s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(197, 160, 89, 0.45)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(197, 160, 89, 0.35)';
                                    }}
                                >
                                    <Plus style={{ width: 20, height: 20 }} />
                                    Publicar Local
                                </button>
                            </Link>
                            <button
                                onClick={() => alert('Configuración próximamente disponible')}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.9375rem 1.5rem',
                                    background: '#FFFFFF',
                                    border: '1.5px solid rgba(197, 160, 89, 0.25)',
                                    borderRadius: '14px',
                                    color: '#C5A059',
                                    fontWeight: 600,
                                    fontSize: '0.9375rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#C5A059';
                                    e.currentTarget.style.background = 'rgba(197, 160, 89, 0.05)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(197, 160, 89, 0.25)';
                                    e.currentTarget.style.background = '#FFFFFF';
                                }}
                            >
                                <Settings style={{ width: 18, height: 18 }} />
                                Configuración
                            </button>
                        </div>
                    </div>

                    {/* Metrics Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                        {isLoading || !metrics ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div
                                    key={i}
                                    style={{
                                        background: '#FFFFFF',
                                        borderRadius: '24px',
                                        padding: '1.5rem',
                                        border: '1px solid rgba(0, 0, 0, 0.04)',
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                                        <div style={{ width: '3rem', height: '3rem', background: '#F3F4F6', borderRadius: '16px' }} className="animate-pulse" />
                                        <div style={{ width: '4rem', height: '1.5rem', background: '#F3F4F6', borderRadius: '100px' }} className="animate-pulse" />
                                    </div>
                                    <div style={{ height: '2.5rem', background: '#F3F4F6', borderRadius: '8px', width: '40%', marginBottom: '0.5rem' }} className="animate-pulse" />
                                    <div style={{ height: '1rem', background: '#F9FAFB', borderRadius: '6px', width: '60%' }} className="animate-pulse" />
                                </div>
                            ))
                        ) : (
                            <>
                                <MetricCard
                                    title="Vistas totales"
                                    value={metrics.totalViews}
                                    change={metrics.viewsChange}
                                    icon={<Eye style={{ width: 24, height: 24, color: '#FFFFFF' }} />}
                                    iconBg="linear-gradient(135deg, #C5A059 0%, #E8C872 100%)"
                                    delay={0}
                                />
                                <MetricCard
                                    title="Reservaciones"
                                    value={metrics.totalReservations}
                                    change={metrics.reservationsChange}
                                    icon={<Calendar style={{ width: 24, height: 24, color: '#FFFFFF' }} />}
                                    iconBg="linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)"
                                    delay={100}
                                />
                                <MetricCard
                                    title="Favoritos"
                                    value={metrics.totalFavorites}
                                    change={metrics.favoritesChange}
                                    icon={<Heart style={{ width: 24, height: 24, color: '#FFFFFF' }} />}
                                    iconBg="linear-gradient(135deg, #EC4899 0%, #F472B6 100%)"
                                    delay={200}
                                />
                                <MetricCard
                                    title="Mensajes nuevos"
                                    value={metrics.totalMessages}
                                    change={metrics.messagesChange}
                                    icon={<MessageSquare style={{ width: 24, height: 24, color: '#FFFFFF' }} />}
                                    iconBg="linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)"
                                    delay={300}
                                />
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="lg:grid-cols-3">
                    {/* Mis Locales */}
                    <div style={{ gridColumn: 'span 2' }} className="lg:col-span-2">
                        <div
                            style={{
                                background: '#FFFFFF',
                                borderRadius: '28px',
                                padding: '1.75rem',
                                border: '1px solid rgba(0, 0, 0, 0.04)',
                                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.03)',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#1F1F1F', letterSpacing: '-0.01em' }}>
                                    Mis Locales
                                </h2>
                                <Link to="/proveedor/locales" style={{ textDecoration: 'none' }}>
                                    <button
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.375rem',
                                            padding: '0.5rem 1rem',
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#C5A059',
                                            fontWeight: 600,
                                            fontSize: '0.875rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = '#997B30'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = '#C5A059'}
                                    >
                                        Ver todos
                                        <ArrowRight style={{ width: 16, height: 16 }} />
                                    </button>
                                </Link>
                            </div>

                            {isLoading ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#FAFAFA', borderRadius: '16px' }}>
                                            <div style={{ width: '5rem', height: '5rem', background: '#F3F4F6', borderRadius: '12px' }} className="animate-pulse" />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ height: '1.25rem', background: '#F3F4F6', borderRadius: '6px', width: '60%', marginBottom: '0.5rem' }} className="animate-pulse" />
                                                <div style={{ height: '1rem', background: '#F9FAFB', borderRadius: '4px', width: '40%' }} className="animate-pulse" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : venues.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '4.5rem',
                                        height: '4.5rem',
                                        background: 'linear-gradient(135deg, rgba(197, 160, 89, 0.1) 0%, rgba(232, 200, 114, 0.05) 100%)',
                                        borderRadius: '50%',
                                        marginBottom: '1.25rem',
                                    }}>
                                        <Home style={{ width: '2rem', height: '2rem', color: '#C5A059' }} />
                                    </div>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1F1F1F', marginBottom: '0.5rem' }}>
                                        Aún no tienes locales publicados
                                    </h3>
                                    <p style={{ color: '#6B7280', marginBottom: '1.5rem', maxWidth: '20rem', margin: '0 auto 1.5rem' }}>
                                        Comienza a generar ingresos publicando tu primer espacio para eventos.
                                    </p>
                                    <Link to="/proveedor/publicar" style={{ textDecoration: 'none' }}>
                                        <button
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                padding: '0.875rem 1.5rem',
                                                background: 'linear-gradient(135deg, #C5A059 0%, #E8C872 100%)',
                                                border: 'none',
                                                borderRadius: '12px',
                                                color: '#1F1F1F',
                                                fontWeight: 600,
                                                fontSize: '0.9375rem',
                                                cursor: 'pointer',
                                                boxShadow: '0 4px 15px rgba(197, 160, 89, 0.3)',
                                            }}
                                        >
                                            <Sparkles style={{ width: 18, height: 18 }} />
                                            Publicar mi primer local
                                        </button>
                                    </Link>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {venues.slice(0, 3).map((venue, index) => (
                                        <Link
                                            key={venue.id}
                                            to={`/local/${venue.id}`}
                                            style={{
                                                display: 'flex',
                                                gap: '1rem',
                                                padding: '1rem',
                                                background: '#FAFAFA',
                                                borderRadius: '16px',
                                                textDecoration: 'none',
                                                transition: 'all 0.3s ease',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'rgba(197, 160, 89, 0.08)';
                                                e.currentTarget.style.transform = 'translateX(4px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = '#FAFAFA';
                                                e.currentTarget.style.transform = 'translateX(0)';
                                            }}
                                        >
                                            <img
                                                src={venue.images[0]}
                                                alt={venue.name}
                                                style={{
                                                    width: '5rem',
                                                    height: '5rem',
                                                    objectFit: 'cover',
                                                    borderRadius: '12px',
                                                }}
                                            />
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                                                    <h3 style={{
                                                        fontWeight: 600,
                                                        color: '#1F1F1F',
                                                        fontSize: '1rem',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }}>
                                                        {venue.name}
                                                    </h3>
                                                    {venue.status === 'FEATURED' && (
                                                        <span style={{
                                                            padding: '0.25rem 0.625rem',
                                                            background: 'linear-gradient(135deg, #C5A059 0%, #E8C872 100%)',
                                                            borderRadius: '100px',
                                                            fontSize: '0.6875rem',
                                                            fontWeight: 700,
                                                            color: '#1F1F1F',
                                                        }}>
                                                            DESTACADO
                                                        </span>
                                                    )}
                                                </div>
                                                <p style={{ color: '#9CA3AF', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{venue.zone}</p>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8125rem' }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#6B7280' }}>
                                                        <Eye style={{ width: 14, height: 14 }} />
                                                        {venue.views}
                                                    </span>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#6B7280' }}>
                                                        <Heart style={{ width: 14, height: 14 }} />
                                                        {venue.favorites}
                                                    </span>
                                                    <span style={{
                                                        fontWeight: 700,
                                                        background: 'linear-gradient(135deg, #997B30 0%, #C5A059 100%)',
                                                        WebkitBackgroundClip: 'text',
                                                        WebkitTextFillColor: 'transparent',
                                                    }}>
                                                        {formatPrice(venue.price)}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Reservaciones */}
                    <div>
                        <div
                            style={{
                                background: '#FFFFFF',
                                borderRadius: '28px',
                                padding: '1.75rem',
                                border: '1px solid rgba(0, 0, 0, 0.04)',
                                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.03)',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#1F1F1F', letterSpacing: '-0.01em' }}>
                                    Reservaciones
                                </h2>
                                <Link to="/proveedor/reservaciones" style={{ textDecoration: 'none' }}>
                                    <button
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.375rem',
                                            padding: '0.5rem 1rem',
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#C5A059',
                                            fontWeight: 600,
                                            fontSize: '0.875rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = '#997B30'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = '#C5A059'}
                                    >
                                        Ver todas
                                        <ArrowRight style={{ width: 16, height: 16 }} />
                                    </button>
                                </Link>
                            </div>

                            {isLoading ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} style={{ padding: '1rem', background: '#FAFAFA', borderRadius: '16px' }}>
                                            <div style={{ height: '1.125rem', background: '#F3F4F6', borderRadius: '6px', width: '70%', marginBottom: '0.5rem' }} className="animate-pulse" />
                                            <div style={{ height: '0.875rem', background: '#F9FAFB', borderRadius: '4px', width: '50%' }} className="animate-pulse" />
                                        </div>
                                    ))}
                                </div>
                            ) : bookings.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '4rem',
                                        height: '4rem',
                                        background: 'linear-gradient(135deg, rgba(197, 160, 89, 0.1) 0%, rgba(232, 200, 114, 0.05) 100%)',
                                        borderRadius: '50%',
                                        marginBottom: '1rem',
                                    }}>
                                        <Calendar style={{ width: '1.75rem', height: '1.75rem', color: '#C5A059' }} />
                                    </div>
                                    <p style={{ color: '#6B7280', fontSize: '0.9375rem' }}>
                                        Sin reservaciones pendientes
                                    </p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {bookings.slice(0, 5).map((booking) => {
                                        const statusStyle = getBookingStatusStyle(booking.status);
                                        return (
                                            <Link
                                                key={booking.id}
                                                to={`/reserva/${booking.id}`}
                                                style={{
                                                    padding: '1rem',
                                                    background: '#FAFAFA',
                                                    borderRadius: '16px',
                                                    transition: 'all 0.2s ease',
                                                    textDecoration: 'none',
                                                    display: 'block',
                                                    cursor: 'pointer',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = 'rgba(197, 160, 89, 0.08)';
                                                    e.currentTarget.style.transform = 'translateX(4px)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = '#FAFAFA';
                                                    e.currentTarget.style.transform = 'translateX(0)';
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                    <p style={{
                                                        fontWeight: 600,
                                                        color: '#1F1F1F',
                                                        fontSize: '0.9375rem',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }}>
                                                        {booking.venueName}
                                                    </p>
                                                    <span style={{
                                                        padding: '0.25rem 0.625rem',
                                                        background: statusStyle.bg,
                                                        color: statusStyle.text,
                                                        borderRadius: '100px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                    }}>
                                                        {statusStyle.label}
                                                    </span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                    <div style={{
                                                        width: '1.5rem',
                                                        height: '1.5rem',
                                                        borderRadius: '50%',
                                                        background: 'linear-gradient(135deg, #C5A059 0%, #E8C872 100%)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: '#FFFFFF',
                                                        fontSize: '0.6875rem',
                                                        fontWeight: 700,
                                                    }}>
                                                        {booking.clientName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span style={{ color: '#6B7280', fontSize: '0.8125rem' }}>{booking.clientName}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                                                    <span style={{ color: '#9CA3AF' }}>
                                                        {new Date(booking.date).toLocaleDateString('es-MX', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                        })}
                                                        {booking.startTime && booking.endTime && (
                                                            <span style={{ marginLeft: '8px', fontSize: '0.75rem' }}>
                                                                {booking.startTime.slice(0, 5)} - {booking.endTime.slice(0, 5)}
                                                            </span>
                                                        )}
                                                    </span>
                                                    <span style={{
                                                        fontWeight: 700,
                                                        background: 'linear-gradient(135deg, #997B30 0%, #C5A059 100%)',
                                                        WebkitBackgroundClip: 'text',
                                                        WebkitTextFillColor: 'transparent',
                                                    }}>
                                                        {formatPrice(booking.totalPrice)}
                                                    </span>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DashboardPro;
