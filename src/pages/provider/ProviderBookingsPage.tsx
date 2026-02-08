/**
 * @fileoverview Página de Mis Reservaciones para el Proveedor
 * @description Lista todas las reservaciones con filtros y búsqueda
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Search,
    Calendar,
    Clock,
    User,
    CheckCircle,
    XCircle,
    ArrowLeft,
    Eye
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGlobalNotification } from '../../context/NotificationContext';
import { supabase } from '../../lib/supabase';
import type { Booking } from '../../types';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import { Badge } from '../../components/atoms/Badge';

export const ProviderBookingsPage: React.FC = () => {
    const { user } = useAuth();
    const { showError } = useGlobalNotification();
    const navigate = useNavigate();

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'>('ALL');

    useEffect(() => {
        const loadBookings = async () => {
            if (!user?.id) return;

            setIsLoading(true);
            try {
                // Fetch bookings with related data
                const { data, error } = await supabase
                    .from('bookings')
                    .select(`
                        *,
                        venues(name, images),
                        users!bookings_client_id_fkey(name, email)
                    `)
                    .eq('provider_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                // Map to frontend Booking type
                const mappedBookings: Booking[] = (data || []).map((b: any) => ({
                    id: b.id,
                    venueId: b.venue_id,
                    venueName: b.venues?.name || 'Local no disponible',
                    venueImage: b.venues?.images?.[0] || '',
                    clientId: b.client_id,
                    clientName: b.users?.name || 'Cliente desconocido',
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
            } catch (error) {
                console.error('Error loading bookings:', error);
                showError('Error al cargar las reservaciones', 'Error de carga');
            } finally {
                setIsLoading(false);
            }
        };

        loadBookings();
    }, [user?.id, showError]);

    // Enhanced Filtering
    const filteredBookings = bookings.filter(booking => {
        const matchesSearch =
            booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.venueName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' || booking.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Valid Statuses for Badge
    const getStatusConfig = (status: Booking['status']) => {
        switch (status) {
            case 'CONFIRMED':
                return { variant: 'success' as const, label: 'Reservado', icon: CheckCircle };
            case 'CANCELLED':
                return { variant: 'error' as const, label: 'Cancelada', icon: XCircle };
            case 'COMPLETED':
                return { variant: 'info' as const, label: 'Completada', icon: CheckCircle };
            default:
                return { variant: 'warning' as const, label: 'Solicitud', icon: Clock };
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('es-MX', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-bg-primary py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header with Back Button */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/proveedor')}
                        className="flex items-center gap-2 text-text-secondary hover:text-neon transition-colors mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Volver al Dashboard
                    </button>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-text-primary">Mis Reservaciones</h1>
                            <p className="text-text-muted mt-1">
                                Gestiona y da seguimiento a todas tus reservas
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Buscar por cliente o local..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-bg-card border border-neon/20 rounded-xl
                                     text-text-primary placeholder:text-text-muted
                                     focus:outline-none focus:border-neon focus:ring-2 focus:ring-neon/20
                                     transition-all duration-200"
                        />
                    </div>

                    <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 no-scrollbar">
                        {(['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${statusFilter === status
                                    ? 'bg-neon text-bg-primary shadow-lg shadow-neon/20'
                                    : 'bg-bg-card text-text-secondary hover:bg-bg-secondary'
                                    }`}
                            >
                                {status === 'ALL' ? 'Todas' :
                                    status === 'PENDING' ? 'Solicitudes' :
                                        status === 'CONFIRMED' ? 'Reservadas' :
                                            status === 'CANCELLED' ? 'Canceladas' : 'Completadas'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bookings List */}
                {isLoading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="animate-pulse bg-bg-card rounded-2xl p-6 border border-neon/10">
                                <div className="h-6 bg-bg-secondary rounded w-1/4 mb-4" />
                                <div className="h-4 bg-bg-secondary rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <Card variant="glass" className="text-center py-16">
                        <div className="w-20 h-20 mx-auto mb-6 bg-neon/10 rounded-full flex items-center justify-center">
                            <Calendar className="w-10 h-10 text-neon" />
                        </div>
                        <h3 className="text-xl font-semibold text-text-primary mb-2">
                            No se encontraron reservaciones
                        </h3>
                        <p className="text-text-muted mb-6">
                            {searchTerm || statusFilter !== 'ALL'
                                ? 'No hay resultados con los filtros actuales'
                                : 'Aún no has recibido ninguna solicitud de reserva'}
                        </p>
                        {(searchTerm || statusFilter !== 'ALL') && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchTerm('');
                                    setStatusFilter('ALL');
                                }}
                            >
                                Limpiar filtros
                            </Button>
                        )}
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {filteredBookings.map((booking) => {
                            const statusConfig = getStatusConfig(booking.status);

                            return (
                                <Link to={`/reserva/${booking.id}`} key={booking.id}>
                                    <div className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-gold/30 hover:shadow-lg transition-all duration-300">
                                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">

                                            {/* Venue Image & Info */}
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                                                    {booking.venueImage ? (
                                                        <img
                                                            src={booking.venueImage}
                                                            alt={booking.venueName}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <CheckCircle className="w-6 h-6 text-gray-300" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 group-hover:text-gold transition-colors">
                                                        {booking.venueName}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                        <User className="w-4 h-4" />
                                                        <span>{booking.clientName}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Date & Time */}
                                            <div className="flex flex-col md:items-center min-w-[200px]">
                                                <div className="flex items-center gap-2 text-gray-700 font-medium">
                                                    <Calendar className="w-4 h-4 text-gold" />
                                                    {formatDate(booking.date)}
                                                </div>
                                                {booking.startTime && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {booking.startTime.slice(0, 5)} - {booking.endTime?.slice(0, 5)}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Status & Price */}
                                            <div className="flex flex-row md:flex-col items-center justify-between w-full md:w-auto gap-4 min-w-[140px] md:items-end">
                                                <Badge variant={statusConfig.variant}>
                                                    {statusConfig.label}
                                                </Badge>
                                                <span className="font-bold text-lg text-gold">
                                                    {formatPrice(booking.totalPrice)}
                                                </span>
                                            </div>

                                            {/* Arrow Icon */}
                                            <div className="hidden md:flex text-gray-300 group-hover:text-gold group-hover:translate-x-1 transition-all">
                                                <Eye className="w-5 h-5" />
                                            </div>

                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProviderBookingsPage;
