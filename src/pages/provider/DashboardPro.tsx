/**
 * @fileoverview Dashboard del Proveedor
 * @description Panel de control con métricas en tiempo real y acceso a funciones
 * 
 * @iso25010
 * - Usabilidad: Métricas visuales claras y acciones accesibles
 * - Eficiencia: Datos actualizados con indicadores de cambio
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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGlobalNotification } from '../../context/NotificationContext';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import { Badge } from '../../components/atoms/Badge';
import { Avatar } from '../../components/atoms/Avatar';
import { MetricCardSkeleton } from '../../components/atoms/Skeleton';
import * as api from '../../services/mockApi';
import type { ProviderMetrics, Venue, Booking } from '../../types';

/**
 * Componente de tarjeta de métrica
 */
interface MetricCardProps {
    title: string;
    value: number;
    change: number;
    icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon }) => {
    const isPositive = change >= 0;

    return (
        <Card variant="glass" className="border border-neon/20" hoverable glowOnHover>
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-neon/10 rounded-2xl text-neon">{icon}</div>
                <div
                    className={`flex items-center gap-1 text-sm ${isPositive ? 'text-success' : 'text-error'
                        }`}
                >
                    {isPositive ? (
                        <TrendingUp className="w-4 h-4" />
                    ) : (
                        <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{Math.abs(change).toFixed(1)}%</span>
                </div>
            </div>
            <p className="text-3xl font-bold text-text-primary mb-1">
                {value.toLocaleString()}
            </p>
            <p className="text-text-muted text-sm">{title}</p>
        </Card>
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
                const [metricsData, venuesData, bookingsData] = await Promise.all([
                    api.getProviderMetrics(user.id),
                    api.getProviderVenues(user.id),
                    api.getProviderBookings(user.id),
                ]);
                setMetrics(metricsData);
                setVenues(venuesData);
                setBookings(bookingsData);
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

    const getBookingStatusBadge = (status: Booking['status']) => {
        const variants: Record<Booking['status'], { variant: 'success' | 'warning' | 'error' | 'info'; label: string }> = {
            PENDING: { variant: 'warning', label: 'Pendiente' },
            CONFIRMED: { variant: 'success', label: 'Confirmada' },
            CANCELLED: { variant: 'error', label: 'Cancelada' },
            COMPLETED: { variant: 'info', label: 'Completada' },
        };
        return variants[status];
    };

    return (
        <div className="min-h-screen bg-bg-primary pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">
                            ¡Hola, {user?.name.split(' ')[0]}!
                        </h1>
                        <p className="text-text-secondary">
                            Bienvenido a tu panel de proveedor
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link to="/proveedor/publicar">
                            <Button leftIcon={<Plus className="w-5 h-5" />}>
                                Publicar Local
                            </Button>
                        </Link>
                        <Link to="/proveedor/configuracion">
                            <Button variant="outline" leftIcon={<Settings className="w-5 h-5" />}>
                                Configuración
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Métricas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {isLoading || !metrics ? (
                        Array.from({ length: 4 }).map((_, i) => <MetricCardSkeleton key={i} />)
                    ) : (
                        <>
                            <MetricCard
                                title="Vistas totales"
                                value={metrics.totalViews}
                                change={metrics.viewsChange}
                                icon={<Eye className="w-6 h-6" />}
                            />
                            <MetricCard
                                title="Reservaciones"
                                value={metrics.totalReservations}
                                change={metrics.reservationsChange}
                                icon={<Calendar className="w-6 h-6" />}
                            />
                            <MetricCard
                                title="Favoritos"
                                value={metrics.totalFavorites}
                                change={metrics.favoritesChange}
                                icon={<Heart className="w-6 h-6" />}
                            />
                            <MetricCard
                                title="Mensajes nuevos"
                                value={metrics.totalMessages}
                                change={metrics.messagesChange}
                                icon={<MessageSquare className="w-6 h-6" />}
                            />
                        </>
                    )}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Mis Locales */}
                    <div className="lg:col-span-2">
                        <Card variant="default">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-text-primary">
                                    Mis Locales
                                </h2>
                                <Link to="/proveedor/locales">
                                    <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                                        Ver todos
                                    </Button>
                                </Link>
                            </div>

                            {isLoading ? (
                                <div className="space-y-4">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="animate-pulse flex gap-4 p-4 bg-bg-secondary rounded-2xl">
                                            <div className="w-20 h-20 bg-bg-card rounded-xl" />
                                            <div className="flex-1 space-y-2">
                                                <div className="h-5 bg-bg-card rounded w-1/2" />
                                                <div className="h-4 bg-bg-card rounded w-1/4" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : venues.length === 0 ? (
                                <div className="text-center py-8">
                                    <Home className="w-12 h-12 text-text-muted mx-auto mb-4" />
                                    <p className="text-text-secondary mb-4">
                                        Aún no tienes locales publicados
                                    </p>
                                    <Link to="/proveedor/publicar">
                                        <Button>Publicar mi primer local</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {venues.slice(0, 3).map((venue) => (
                                        <Link
                                            key={venue.id}
                                            to={`/local/${venue.id}`}
                                            className="flex gap-4 p-4 bg-bg-secondary rounded-2xl hover:bg-bg-card transition-colors group"
                                        >
                                            <img
                                                src={venue.images[0]}
                                                alt={venue.name}
                                                className="w-20 h-20 object-cover rounded-xl"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold text-text-primary truncate group-hover:text-neon transition-colors">
                                                        {venue.name}
                                                    </h3>
                                                    {venue.status === 'FEATURED' && (
                                                        <Badge variant="neon" size="sm">Destacado</Badge>
                                                    )}
                                                </div>
                                                <p className="text-text-muted text-sm mb-2">{venue.zone}</p>
                                                <div className="flex items-center gap-4 text-sm text-text-secondary">
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="w-4 h-4" />
                                                        {venue.views}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Heart className="w-4 h-4" />
                                                        {venue.favorites}
                                                    </span>
                                                    <span className="text-neon font-semibold">
                                                        {formatPrice(venue.price)}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Reservaciones recientes */}
                    <div>
                        <Card variant="default">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-text-primary">
                                    Reservaciones
                                </h2>
                                <Link to="/proveedor/reservaciones">
                                    <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                                        Ver todas
                                    </Button>
                                </Link>
                            </div>

                            {isLoading ? (
                                <div className="space-y-4">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="animate-pulse p-4 bg-bg-secondary rounded-2xl">
                                            <div className="h-5 bg-bg-card rounded w-3/4 mb-2" />
                                            <div className="h-4 bg-bg-card rounded w-1/2" />
                                        </div>
                                    ))}
                                </div>
                            ) : bookings.length === 0 ? (
                                <div className="text-center py-8">
                                    <Calendar className="w-12 h-12 text-text-muted mx-auto mb-4" />
                                    <p className="text-text-secondary">
                                        Sin reservaciones pendientes
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {bookings.slice(0, 5).map((booking) => {
                                        const statusBadge = getBookingStatusBadge(booking.status);
                                        return (
                                            <div
                                                key={booking.id}
                                                className="p-4 bg-bg-secondary rounded-2xl"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="font-semibold text-text-primary truncate">
                                                        {booking.venueName}
                                                    </p>
                                                    <Badge variant={statusBadge.variant} size="sm">
                                                        {statusBadge.label}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
                                                    <Avatar name={booking.clientName} size="xs" />
                                                    <span>{booking.clientName}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-text-muted">
                                                        {new Date(booking.date).toLocaleDateString('es-MX', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                        })}
                                                    </span>
                                                    <span className="text-neon font-semibold">
                                                        {formatPrice(booking.totalPrice)}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPro;
