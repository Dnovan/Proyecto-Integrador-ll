/**
 * @fileoverview Servicio de Venues con Supabase
 * @description Funciones para obtener, buscar y gestionar locales desde Supabase
 */

import { supabase } from '../lib/supabase';
import type { Venue, VenueCategory, SearchFilters } from '../types';

/**
 * Mapea un venue de Supabase al formato del frontend
 */
const mapVenueFromDB = (dbVenue: any): Venue => ({
    id: dbVenue.id,
    providerId: dbVenue.provider_id,
    providerName: dbVenue.provider_name || 'Proveedor',
    name: dbVenue.name,
    description: dbVenue.description || '',
    address: dbVenue.address,
    zone: dbVenue.zone,
    category: dbVenue.category as VenueCategory,
    price: Number(dbVenue.price),
    capacity: dbVenue.max_capacity,
    images: dbVenue.images || [],
    paymentMethods: dbVenue.payment_methods || [],
    amenities: dbVenue.amenities || [],
    status: dbVenue.status,
    rating: Number(dbVenue.rating) || 0,
    reviewCount: dbVenue.review_count || 0,
    views: dbVenue.views || 0,
    favorites: dbVenue.favorites_count || 0,
    createdAt: new Date(dbVenue.created_at),
    updatedAt: new Date(dbVenue.updated_at),
});

/**
 * Obtiene todos los venues activos
 */
export const getVenues = async (
    filters?: SearchFilters,
    page: number = 1,
    pageSize: number = 12
): Promise<{ data: Venue[]; total: number }> => {
    let query = supabase
        .from('venues')
        .select('*, users!venues_provider_id_fkey(name)', { count: 'exact' })
        .in('status', ['ACTIVE', 'FEATURED'])
        .order('created_at', { ascending: false });

    // Aplicar filtros
    if (filters?.zone) {
        query = query.eq('zone', filters.zone);
    }
    if (filters?.category) {
        query = query.eq('category', filters.category);
    }
    if (filters?.priceMin) {
        query = query.gte('price', filters.priceMin);
    }
    if (filters?.priceMax) {
        query = query.lte('price', filters.priceMax);
    }
    if (filters?.capacity) {
        query = query.gte('max_capacity', filters.capacity);
    }
    if (filters?.query) {
        // Búsqueda por texto en nombre, descripción o dirección
        query = query.or(`name.ilike.%${filters.query}%,description.ilike.%${filters.query}%,address.ilike.%${filters.query}%`);
    }

    // Paginación
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
        console.error('Error fetching venues:', error);
        return { data: [], total: 0 };
    }

    const venues = (data || []).map((v: any) => ({
        ...mapVenueFromDB(v),
        providerName: v.users?.name || 'Proveedor',
    }));

    return { data: venues, total: count || 0 };
};

/**
 * Obtiene un venue por ID
 */
export const getVenueById = async (id: string): Promise<Venue | null> => {
    const { data, error } = await supabase
        .from('venues')
        .select('*, users!venues_provider_id_fkey(name)')
        .eq('id', id)
        .single();

    if (error || !data) {
        console.error('Error fetching venue:', error);
        return null;
    }

    return {
        ...mapVenueFromDB(data),
        providerName: data.users?.name || 'Proveedor',
    };
};

/**
 * Obtiene venues destacados
 */
export const getFeaturedVenues = async (limit: number = 6): Promise<Venue[]> => {
    const { data, error } = await supabase
        .from('venues')
        .select('*, users!venues_provider_id_fkey(name)')
        .eq('status', 'FEATURED')
        .order('rating', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching featured venues:', error);
        return [];
    }

    return (data || []).map((v: any) => ({
        ...mapVenueFromDB(v),
        providerName: v.users?.name || 'Proveedor',
    }));
};

/**
 * Obtiene la disponibilidad de un venue
 */
export const getVenueAvailability = async (
    venueId: string,
    month: number,
    year: number
): Promise<{ date: string; isAvailable: boolean }[]> => {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const { data, error } = await supabase
        .from('venue_availability')
        .select('date, is_available')
        .eq('venue_id', venueId)
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0]);

    if (error) {
        console.error('Error fetching availability:', error);
    }

    // Generar todas las fechas del mes
    const availability: { date: string; isAvailable: boolean }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 1; day <= endDate.getDate(); day++) {
        const date = new Date(year, month, day);
        const dateStr = date.toISOString().split('T')[0];

        // Buscar si hay un registro específico
        const record = data?.find(d => d.date === dateStr);

        // Por defecto, las fechas futuras están disponibles
        const isAvailable = date >= today && (record?.is_available !== false);

        availability.push({ date: dateStr, isAvailable });
    }

    return availability;
};

/**
 * Busca venues con texto libre
 */
export const searchVenues = async (query: string): Promise<Venue[]> => {
    const { data, error } = await supabase
        .from('venues')
        .select('*, users!venues_provider_id_fkey(name)')
        .in('status', ['ACTIVE', 'FEATURED'])
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,address.ilike.%${query}%,zone.ilike.%${query}%`)
        .limit(20);

    if (error) {
        console.error('Error searching venues:', error);
        return [];
    }

    return (data || []).map((v: any) => ({
        ...mapVenueFromDB(v),
        providerName: v.users?.name || 'Proveedor',
    }));
};

export const getBookingsForVenueDate = async (venueId: string, date: string) => {
    const { data, error } = await supabase
        .from('bookings')
        .select('start_time, end_time')
        .eq('venue_id', venueId)
        .eq('event_date', date)
        .in('status', ['CONFIRMED', 'PENDING']);

    if (error) {
        console.error('Error fetching bookings for date:', error);
        return [];
    }
    return data || [];
};

export default {
    getVenues,
    getVenueById,
    getFeaturedVenues,
    getVenueAvailability,
    searchVenues,
    getBookingsForVenueDate,
};
