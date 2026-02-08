/**
 * @fileoverview Página de Detalles de Reserva
 * @description Muestra información completa de una reserva específica
 */

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, MapPin, CreditCard, Clock, Check, X, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

interface BookingDetail {
    id: string;
    venue_id: string;
    client_id: string;
    provider_id: string;
    event_date: string;
    guest_count: number;
    total_price: number;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    payment_status: 'PENDING' | 'PAID' | 'REFUNDED';
    special_requests?: string;
    confirmed_at?: string;
    created_at: string;
    // Relaciones
    venue?: {
        name: string;
        address: string;
        zone: string;
        images: string[];
    };
    client?: {
        name: string;
        email: string;
    };
}

const BookingDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [booking, setBooking] = useState<BookingDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const colors = {
        gold: '#C5A059',
        goldLight: '#E8C872',
        text: '#1F1F1F',
        textSecondary: '#6B7280',
        bgLight: '#FAFAFA',
        border: '#E5E7EB',
    };

    useEffect(() => {
        const loadBooking = async () => {
            if (!id) return;

            setIsLoading(true);
            try {
                // Primero intentamos obtener la reserva sin los joins complejos para asegurar que existe
                const { data: simpleBooking, error: simpleError } = await supabase
                    .from('bookings')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (simpleError) throw simpleError;

                // Luego intentamos obtener con relaciones
                const { data, error } = await supabase
                    .from('bookings')
                    .select(`
                        *,
                        venue:venues(name, address, zone, images),
                        client:users!bookings_client_id_fkey(name, email)
                    `)
                    .eq('id', id)
                    .single();

                if (error) {
                    console.warn('Error loading relations, using simple booking:', error);
                    setBooking(simpleBooking);
                } else {
                    setBooking(data);
                }
            } catch (err) {
                console.error('Error loading booking:', err);
                setError('No se pudo cargar la reserva');
            } finally {
                setIsLoading(false);
            }
        };

        loadBooking();
    }, [id]);

    const handleUpdateStatus = async (newStatus: 'CONFIRMED' | 'CANCELLED') => {
        if (!booking) return;

        try {
            const updateData: any = { status: newStatus };
            if (newStatus === 'CONFIRMED') {
                updateData.confirmed_at = new Date().toISOString();
                updateData.payment_status = 'PAID';
            }

            const { error } = await supabase
                .from('bookings')
                .update(updateData)
                .eq('id', booking.id);

            if (error) throw error;

            setBooking({ ...booking, ...updateData });
        } catch (err) {
            console.error('Error updating booking:', err);
        }
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'CONFIRMED':
                return { bg: '#DEF7EC', text: '#03543F', label: 'Confirmada', icon: Check };
            case 'CANCELLED':
                return { bg: '#FDE8E8', text: '#9B1C1C', label: 'Cancelada', icon: X };
            case 'COMPLETED':
                return { bg: '#E1EFFE', text: '#1E429F', label: 'Completada', icon: Check };
            default:
                return { bg: '#FEF3C7', text: '#92400E', label: 'Pendiente', icon: Clock };
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('es-MX', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(price);
    };

    if (isLoading) {
        return (
            <div style={{ minHeight: '100vh', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 48, height: 48, border: `3px solid ${colors.gold}`, borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 1rem' }} className="animate-spin" />
                    <p style={{ color: colors.textSecondary }}>Cargando reserva...</p>
                </div>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div style={{ minHeight: '100vh', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <AlertCircle style={{ width: 48, height: 48, color: '#EF4444', margin: '0 auto 1rem' }} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: colors.text, marginBottom: '0.5rem' }}>
                        Reserva no encontrada
                    </h2>
                    <p style={{ color: colors.textSecondary, marginBottom: '1.5rem' }}>
                        {error || 'No pudimos encontrar esta reserva'}
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: colors.gold,
                            color: colors.text,
                            border: 'none',
                            borderRadius: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        Volver
                    </button>
                </div>
            </div>
        );
    }

    const statusConfig = getStatusConfig(booking.status);
    const StatusIcon = statusConfig.icon;
    const isProvider = user?.role === 'PROVEEDOR';
    const isPending = booking.status === 'PENDING';

    return (
        <div style={{ minHeight: '100vh', background: '#FFFFFF' }}>
            {/* Header */}
            <div style={{ background: colors.bgLight, borderBottom: `1px solid ${colors.border}` }}>
                <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '1.5rem 1rem' }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: '#FFFFFF',
                            border: `1px solid ${colors.border}`,
                            borderRadius: '12px',
                            color: colors.textSecondary,
                            cursor: 'pointer',
                            marginBottom: '1.5rem',
                        }}
                    >
                        <ArrowLeft style={{ width: 18, height: 18 }} />
                        Volver
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: colors.text, marginBottom: '0.5rem' }}>
                                Detalles de Reserva
                            </h1>
                            <p style={{ color: colors.textSecondary, fontSize: '0.875rem' }}>
                                ID: {booking.id.slice(0, 8)}...
                            </p>
                        </div>

                        <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: statusConfig.bg,
                            color: statusConfig.text,
                            borderRadius: '100px',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                        }}>
                            <StatusIcon style={{ width: 16, height: 16 }} />
                            {statusConfig.label}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '2rem 1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                    {/* Venue Info */}
                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: '20px',
                        border: `1px solid ${colors.border}`,
                        overflow: 'hidden',
                    }}>
                        {booking.venue?.images?.[0] && (
                            <img
                                src={booking.venue.images[0]}
                                alt={booking.venue.name}
                                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                            />
                        )}
                        <div style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: colors.text, marginBottom: '0.75rem' }}>
                                {booking.venue?.name || 'Local'}
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: colors.textSecondary, marginBottom: '0.5rem' }}>
                                <MapPin style={{ width: 16, height: 16 }} />
                                <span style={{ fontSize: '0.875rem' }}>{booking.venue?.address}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: colors.textSecondary }}>
                                <span style={{ fontSize: '0.875rem' }}>{booking.venue?.zone}</span>
                            </div>

                            <Link
                                to={`/local/${booking.venue_id}`}
                                style={{
                                    display: 'block',
                                    marginTop: '1rem',
                                    padding: '0.75rem',
                                    background: colors.bgLight,
                                    color: colors.gold,
                                    textAlign: 'center',
                                    textDecoration: 'none',
                                    borderRadius: '12px',
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                }}
                            >
                                Ver local
                            </Link>
                        </div>
                    </div>

                    {/* Booking Details */}
                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: '20px',
                        border: `1px solid ${colors.border}`,
                        padding: '1.5rem',
                    }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: colors.text, marginBottom: '1.5rem' }}>
                            Información de la Reserva
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: colors.bgLight, borderRadius: '12px' }}>
                                <Calendar style={{ width: 24, height: 24, color: colors.gold }} />
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: colors.textSecondary, marginBottom: '0.25rem' }}>Fecha del Evento</p>
                                    <p style={{ fontWeight: 600, color: colors.text }}>{formatDate(booking.event_date)}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: colors.bgLight, borderRadius: '12px' }}>
                                <Users style={{ width: 24, height: 24, color: colors.gold }} />
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: colors.textSecondary, marginBottom: '0.25rem' }}>Invitados</p>
                                    <p style={{ fontWeight: 600, color: colors.text }}>{booking.guest_count} personas</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: `linear-gradient(135deg, rgba(197, 160, 89, 0.1) 0%, rgba(232, 200, 114, 0.05) 100%)`, borderRadius: '12px' }}>
                                <CreditCard style={{ width: 24, height: 24, color: colors.gold }} />
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: colors.textSecondary, marginBottom: '0.25rem' }}>Total</p>
                                    <p style={{ fontWeight: 700, fontSize: '1.25rem', color: colors.gold }}>{formatPrice(booking.total_price)}</p>
                                </div>
                            </div>

                            {booking.client && (
                                <div style={{ padding: '1rem', background: colors.bgLight, borderRadius: '12px' }}>
                                    <p style={{ fontSize: '0.75rem', color: colors.textSecondary, marginBottom: '0.5rem' }}>Cliente</p>
                                    <p style={{ fontWeight: 600, color: colors.text }}>{booking.client.name}</p>
                                    <p style={{ fontSize: '0.875rem', color: colors.textSecondary }}>{booking.client.email}</p>
                                </div>
                            )}

                            {booking.special_requests && (
                                <div style={{ padding: '1rem', background: colors.bgLight, borderRadius: '12px' }}>
                                    <p style={{ fontSize: '0.75rem', color: colors.textSecondary, marginBottom: '0.5rem' }}>Solicitudes Especiales</p>
                                    <p style={{ color: colors.text }}>{booking.special_requests}</p>
                                </div>
                            )}
                        </div>

                        {/* Actions for Provider */}
                        {isProvider && isPending && (
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <button
                                    onClick={() => handleUpdateStatus('CONFIRMED')}
                                    style={{
                                        flex: 1,
                                        padding: '1rem',
                                        background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.goldLight} 100%)`,
                                        color: colors.text,
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                    }}
                                >
                                    <Check style={{ width: 18, height: 18 }} />
                                    Confirmar
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus('CANCELLED')}
                                    style={{
                                        flex: 1,
                                        padding: '1rem',
                                        background: '#FEE2E2',
                                        color: '#991B1B',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                    }}
                                >
                                    <X style={{ width: 18, height: 18 }} />
                                    Cancelar
                                </button>
                            </div>
                        )}

                        {booking.confirmed_at && (
                            <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: colors.textSecondary, textAlign: 'center' }}>
                                Confirmada el {formatDate(booking.confirmed_at)}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetailPage;
