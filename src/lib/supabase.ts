/**
 * @fileoverview Configuración del cliente Supabase
 * @description Inicializa y exporta el cliente de Supabase para la aplicación
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

/**
 * Cliente de Supabase
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    },
});

/**
 * Tipos de la base de datos (se generarán automáticamente después)
 */
export type Database = {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string;
                    email: string;
                    name: string;
                    role: 'CLIENTE' | 'PROVEEDOR' | 'ADMIN';
                    phone: string | null;
                    avatar: string | null;
                    email_verified: boolean;
                    email_verified_at: string | null;
                    verification_status: 'PENDING' | 'VERIFIED' | 'REJECTED' | null;
                    ine_document_url: string | null;
                    company_name: string | null;
                    company_rfc: string | null;
                    bio: string | null;
                    created_at: string;
                    updated_at: string;
                    last_login: string | null;
                };
                Insert: Omit<Database['public']['Tables']['users']['Row'], 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['users']['Insert']>;
            };
            venues: {
                Row: {
                    id: string;
                    provider_id: string;
                    name: string;
                    description: string | null;
                    address: string;
                    zone: string;
                    latitude: number | null;
                    longitude: number | null;
                    category: string;
                    price: number;
                    price_per_person: number | null;
                    min_capacity: number;
                    max_capacity: number;
                    images: string[];
                    payment_methods: string[];
                    amenities: string[];
                    rules: string[];
                    status: 'PENDING' | 'ACTIVE' | 'FEATURED' | 'INACTIVE' | 'BANNED';
                    rating: number;
                    review_count: number;
                    views: number;
                    favorites_count: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['venues']['Row'], 'id' | 'created_at' | 'updated_at' | 'rating' | 'review_count' | 'views' | 'favorites_count'>;
                Update: Partial<Database['public']['Tables']['venues']['Insert']>;
            };
            bookings: {
                Row: {
                    id: string;
                    venue_id: string;
                    client_id: string;
                    provider_id: string;
                    event_date: string;
                    event_type: string | null;
                    guest_count: number;
                    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
                    base_price: number;
                    extras_price: number;
                    total_price: number;
                    payment_method: string | null;
                    payment_status: 'PENDING' | 'PARTIAL' | 'PAID';
                    notes: string | null;
                    start_time: string | null;
                    end_time: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['bookings']['Insert']>;
            };
            reviews: {
                Row: {
                    id: string;
                    venue_id: string;
                    user_id: string;
                    booking_id: string | null;
                    rating: number;
                    comment: string | null;
                    images: string[];
                    provider_response: string | null;
                    response_at: string | null;
                    is_verified: boolean;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['reviews']['Insert']>;
            };
        };
    };
};

/**
 * Helpers de autenticación
 */
export const auth = {
    /**
     * Registrar nuevo usuario con verificación de email
     */
    async signUp(email: string, password: string, metadata: { name: string; role?: string; phone?: string }) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: metadata.name,
                    role: metadata.role || 'CLIENTE',
                },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        return { data, error };
    },

    /**
     * Iniciar sesión
     */
    async signIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    },

    /**
     * Cerrar sesión
     */
    async signOut() {
        const { error } = await supabase.auth.signOut();
        return { error };
    },

    /**
     * Obtener usuario actual
     */
    async getUser() {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    },

    /**
     * Obtener sesión actual
     */
    async getSession() {
        const { data: { session } } = await supabase.auth.getSession();
        return session;
    },

    /**
     * Reenviar email de verificación
     */
    async resendVerificationEmail(email: string) {
        const { data, error } = await supabase.auth.resend({
            type: 'signup',
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        return { data, error };
    },

    /**
     * Solicitar recuperación de contraseña
     */
    async resetPassword(email: string) {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`,
        });
        return { data, error };
    },

    /**
     * Actualizar contraseña
     */
    async updatePassword(newPassword: string) {
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword,
        });
        return { data, error };
    },

    /**
     * Verificar si el email está confirmado
     */
    isEmailVerified(user: { email_confirmed_at?: string | null } | null) {
        return user?.email_confirmed_at != null;
    },

    /**
     * Escuchar cambios de autenticación
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onAuthStateChange(callback: (event: string, session: any) => void) {
        return supabase.auth.onAuthStateChange(callback);
    },
};

/**
 * Helpers de base de datos
 */
export const db = {
    // Users
    users: {
        async getById(id: string) {
            return supabase.from('users').select('*').eq('id', id).single();
        },
        async getByEmail(email: string) {
            return supabase.from('users').select('*').eq('email', email).single();
        },
        async update(id: string, data: Partial<Database['public']['Tables']['users']['Update']>) {
            return supabase.from('users').update(data).eq('id', id);
        },
    },

    // Venues
    venues: {
        async getAll(filters?: { zone?: string; category?: string; status?: string }) {
            let query = supabase.from('venues').select('*');
            if (filters?.zone) query = query.eq('zone', filters.zone);
            if (filters?.category) query = query.eq('category', filters.category);
            if (filters?.status) query = query.eq('status', filters.status);
            return query.order('created_at', { ascending: false });
        },
        async getById(id: string) {
            return supabase.from('venues').select('*').eq('id', id).single();
        },
        async getByProvider(providerId: string) {
            return supabase.from('venues').select('*').eq('provider_id', providerId);
        },
        async create(data: Database['public']['Tables']['venues']['Insert']) {
            return supabase.from('venues').insert(data).select().single();
        },
        async update(id: string, data: Database['public']['Tables']['venues']['Update']) {
            return supabase.from('venues').update(data).eq('id', id);
        },
        async delete(id: string) {
            return supabase.from('venues').delete().eq('id', id);
        },
        async incrementViews(id: string) {
            return supabase.rpc('increment_venue_views', { venue_id: id });
        },
    },

    // Bookings
    bookings: {
        async getByClient(clientId: string) {
            return supabase.from('bookings').select('*, venues(*)').eq('client_id', clientId);
        },
        async getByProvider(providerId: string) {
            return supabase.from('bookings').select('*, venues(*), users!bookings_client_id_fkey(*)').eq('provider_id', providerId);
        },
        async create(data: Database['public']['Tables']['bookings']['Insert']) {
            return supabase.from('bookings').insert(data).select().single();
        },
        async updateStatus(id: string, status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED') {
            return supabase.from('bookings').update({ status }).eq('id', id);
        },
    },

    // Reviews
    reviews: {
        async getByVenue(venueId: string) {
            return supabase.from('reviews').select('*, users(name, avatar)').eq('venue_id', venueId).order('created_at', { ascending: false });
        },
        async create(data: Database['public']['Tables']['reviews']['Insert']) {
            return supabase.from('reviews').insert(data).select().single();
        },
    },

    // Favorites
    favorites: {
        async getByUser(userId: string) {
            return supabase.from('favorites').select('*, venues(*)').eq('user_id', userId);
        },
        async add(userId: string, venueId: string) {
            return supabase.from('favorites').insert({ user_id: userId, venue_id: venueId });
        },
        async remove(userId: string, venueId: string) {
            return supabase.from('favorites').delete().eq('user_id', userId).eq('venue_id', venueId);
        },
        async check(userId: string, venueId: string) {
            const { data } = await supabase.from('favorites').select('*').eq('user_id', userId).eq('venue_id', venueId).single();
            return !!data;
        },
    },
};

export default supabase;
