/**
 * @fileoverview Página de Mis Reservaciones para el Cliente
 * @description Lista todas las reservaciones del cliente con filtros y búsqueda
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Search,
    Calendar,
    Clock,
    MapPin,
    CheckCircle,
    XCircle,
    ArrowRight,
    Trash2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGlobalNotification } from '../../context/NotificationContext';
import { supabase } from '../../lib/supabase';
import type { Booking } from '../../types';
import { Button } from '../../components/atoms/Button';
import { Badge } from '../../components/atoms/Badge';

export const ClientBookingsPage: React.FC = () => {
    const { user } = useAuth();
    const { showError, showSuccess } = useGlobalNotification();
    const navigate = useNavigate();

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'ALL' | 'UPCOMING' | 'PAST'>('ALL');

    useEffect(() => {
        const loadBookings = async () => {
            if (!user?.id) return;

            setIsLoading(true);
            try {
                const { data, error } = await supabase
                    .from('bookings')
                    .select(`
                        *,
                        venues(name, address, zone, images),
                        provider:users!bookings_provider_id_fkey(name)
                    `)
                    .eq('client_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                const mappedBookings: Booking[] = (data || []).map((b: any) => ({
                    id: b.id,
                    venueId: b.venue_id,
                    venueName: b.venues?.name || 'Local no disponible',
                    venueImage: b.venues?.images?.[0] || '',
                    clientId: b.client_id,
                    clientName: user.name, // El usuario actual es el cliente
                    providerId: b.provider_id,
                    date: b.event_date,
                    status: b.status,
                    totalPrice: Number(b.total_price),
                    paymentMethod: b.payment_method || 'TARJETA', // Default
                    startTime: b.start_time,
                    endTime: b.end_time,
                    createdAt: new Date(b.created_at),
                    // Campos adicionales para mostrar en UI
                    venueAddress: b.venues?.address,
                    venueZone: b.venues?.zone,
                    providerName: b.provider?.name
                }));

                setBookings(mappedBookings);
            } catch (error) {
                console.error('Error loading bookings:', error);
                showError('Error al cargar tus reservaciones', 'Error de carga');
            } finally {
                setIsLoading(false);
            }
        };

        loadBookings();
    }, [user?.id, showError, user?.name]);

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch =
            booking.venueName.toLowerCase().includes(searchTerm.toLowerCase());

        const bookingDate = new Date(booking.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let matchesFilter = true;
        if (filter === 'UPCOMING') {
            matchesFilter = bookingDate >= today;
        } else if (filter === 'PAST') {
            matchesFilter = bookingDate < today;
        }

        return matchesSearch && matchesFilter;
    });

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

    const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);

    const handleDeleteClick = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        setBookingToDelete(id);
    };

    const confirmDelete = async () => {
        if (!bookingToDelete) return;

        try {
            const { error, count } = await supabase
                .from('bookings')
                .delete({ count: 'exact' })
                .eq('id', bookingToDelete);

            if (error) throw error;

            if (count === 0) {
                // If count is 0, it means it wasn't deleted (probably permissions)
                throw new Error('No se pudo eliminar la reservación. Verifica que tengas permisos y que la solicitud sea tuya.');
            }

            setBookings(prev => prev.filter(b => b.id !== bookingToDelete));
            showSuccess('La solicitud ha sido eliminada correctamente de tu lista.', 'Solicitud Eliminada');
        } catch (error: any) {
            console.error('Error deleting booking:', error);
            showError(error.message || 'Hubo un problema al eliminar la solicitud.', 'Error');
        } finally {
            setBookingToDelete(null);
        }
    };

    return (
        <div className="min-h-screen bg-bg-primary pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-text-primary mb-2">Mis Reservaciones</h1>
                    <p className="text-text-muted">
                        Historial y estado de tus eventos
                    </p>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre del local..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl 
                                     text-gray-900 placeholder:text-gray-400
                                     focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20
                                     transition-all duration-200"
                        />
                    </div>

                    <div className="flex gap-2 bg-gray-50 p-1 rounded-xl">
                        {(['ALL', 'UPCOMING', 'PAST'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex-1 md:flex-none ${filter === f
                                    ? 'bg-white text-gold shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {f === 'ALL' ? 'Todas' : f === 'UPCOMING' ? 'Próximas' : 'Pasadas'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List */}
                {isLoading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="animate-pulse bg-white rounded-2xl p-6 border border-gray-100 h-40" />
                        ))}
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gold/10 rounded-full flex items-center justify-center">
                            <Calendar className="w-8 h-8 text-gold" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No tienes reservaciones
                        </h3>
                        <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                            {searchTerm || filter !== 'ALL'
                                ? 'No se encontraron resultados con los filtros actuales.'
                                : 'Explora nuestros espacios exclusivos y reserva el lugar perfecto para tu evento.'}
                        </p>
                        {!searchTerm && filter === 'ALL' && (
                            <Button variant="primary" onClick={() => navigate('/client-dashboard')}>
                                Explorar Espacios
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredBookings.map((booking) => {
                            const statusConfig = getStatusConfig(booking.status);

                            return (
                                <Link to={`/reserva/${booking.id}`} key={booking.id} className="block group">
                                    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 hover:border-gold/30 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                                        <div className="flex flex-col sm:flex-row gap-6">
                                            {/* Image */}
                                            <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden shrink-0 relative">
                                                {booking.venueImage ? (
                                                    <img
                                                        src={booking.venueImage}
                                                        alt={booking.venueName}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                                        <MapPin className="w-8 h-8 text-gray-300" />
                                                    </div>
                                                )}
                                                <div className="absolute top-2 left-2">
                                                    <Badge variant={statusConfig.variant} size="sm">
                                                        {statusConfig.label}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-gold transition-colors line-clamp-1 pr-4">
                                                            {booking.venueName}
                                                        </h3>
                                                        <div className="flex flex-col items-end gap-2">
                                                            <span className="font-bold text-gold shrink-0">
                                                                {formatPrice(booking.totalPrice)}
                                                            </span>

                                                            {/* Delete Button for Pending */}
                                                            {booking.status === 'PENDING' && (
                                                                <button
                                                                    onClick={(e) => handleDeleteClick(e, booking.id)}
                                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors z-10"
                                                                    title="Eliminar solicitud"
                                                                >
                                                                    <Trash2 className="w-5 h-5" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-500 text-sm mt-1 mb-3 flex items-center gap-1">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        {(booking as any).venueZone || 'Ubicación'}
                                                    </p>

                                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                                            <Calendar className="w-4 h-4 text-gold" />
                                                            <span className="font-medium">{formatDate(booking.date)}</span>
                                                        </div>
                                                        {booking.startTime && (
                                                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                                                <Clock className="w-4 h-4 text-gold" />
                                                                <span>{booking.startTime.slice(0, 5)} - {booking.endTime?.slice(0, 5)}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Arrow */}
                                            <div className="hidden sm:flex items-center justify-center pl-4 border-l border-gray-50">
                                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gold group-hover:text-white transition-all duration-300">
                                                    <ArrowRight className="w-5 h-5" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* Styled Delete Confirmation Modal */}
                {bookingToDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                        <div
                            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform transition-all scale-100 animate-scale-in border border-white/20"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                                    <Trash2 className="w-8 h-8 text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    ¿Eliminar solicitud?
                                </h3>
                                <p className="text-gray-500 mb-8">
                                    Esta acción no se puede deshacer. La solicitud desaparecerá de tu historial.
                                </p>
                                <div className="flex gap-3 w-full">
                                    <button
                                        onClick={() => setBookingToDelete(null)}
                                        className="flex-1 px-4 py-3 bg-gray-50 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="flex-1 px-4 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all hover:scale-[1.02]"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientBookingsPage;
