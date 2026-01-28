/**
 * @fileoverview Tipos e interfaces de TypeScript para EventSpace
 * @description Define todas las estructuras de datos utilizadas en la aplicación
 * 
 * @iso25010 
 * - Mantenibilidad: Tipos estrictos facilitan el mantenimiento y refactoring
 * - Usabilidad: Interfaces claras mejoran la experiencia del desarrollador
 */

/**
 * Roles de usuario disponibles en el sistema
 */
export type UserRole = 'CLIENTE' | 'PROVEEDOR' | 'ADMIN';

/**
 * Estado de verificación de proveedor
 */
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

/**
 * Estado de un local
 */
export type VenueStatus = 'ACTIVE' | 'BANNED' | 'FEATURED' | 'PENDING' | 'INACTIVE';

/**
 * Categorías de locales disponibles
 */
export type VenueCategory =
    | 'SALON_EVENTOS'
    | 'JARDIN'
    | 'TERRAZA'
    | 'HACIENDA'
    | 'BODEGA'
    | 'RESTAURANTE'
    | 'HOTEL';

/**
 * Métodos de pago aceptados
 */
export type PaymentMethod = 'TRANSFERENCIA' | 'EFECTIVO';

/**
 * Información de usuario
 */
export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatar?: string;
    phone?: string;
    createdAt: Date;
    verificationStatus?: VerificationStatus;
    /** Solo para proveedores: ID de documento de identificación */
    ineDocumentId?: string;
}

/**
 * Datos de autenticación
 */
export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

/**
 * Credenciales de login
 */
export interface LoginCredentials {
    email: string;
    password: string;
}

/**
 * Datos de registro (solo para clientes)
 */
export interface RegisterData {
    email: string;
    password: string;
    name: string;
    phone?: string;
    /** Preferencias iniciales para recomendaciones */
    preferences?: {
        zones: string[];
        categories: VenueCategory[];
        priceRange?: {
            min: number;
            max: number;
        };
    };
    /** Rol del usuario (opcional, por defecto CLIENTE) */
    role?: UserRole;
}

/**
 * Datos de un local/venue
 */
export interface Venue {
    id: string;
    providerId: string;
    providerName: string;
    name: string;
    description: string;
    address: string;
    zone: string;
    category: VenueCategory;
    price: number;
    capacity: number;
    images: string[];
    paymentMethods: PaymentMethod[];
    amenities: string[];
    status: VenueStatus;
    rating: number;
    reviewCount: number;
    views: number;
    favorites: number;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Datos para crear/editar un local
 */
export interface VenueFormData {
    name: string;
    description: string;
    address: string;
    zone: string;
    category: VenueCategory;
    price: number;
    capacity: number;
    images: File[];
    paymentMethods: PaymentMethod[];
    amenities: string[];
    /** Documento INE para verificación */
    ineDocument?: File;
}

/**
 * Disponibilidad de fecha
 */
export interface DateAvailability {
    date: string;
    isAvailable: boolean;
    price?: number;
}

/**
 * Reservación
 */
export interface Booking {
    id: string;
    venueId: string;
    venueName: string;
    venueImage: string;
    clientId: string;
    clientName: string;
    providerId: string;
    date: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    totalPrice: number;
    paymentMethod: PaymentMethod;
    createdAt: Date;
    notes?: string;
}

/**
 * Reseña de un local
 */
export interface Review {
    id: string;
    venueId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    comment: string;
    createdAt: Date;
    images?: string[];
}

/**
 * Mensaje en el chat
 */
export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    content: string;
    timestamp: Date;
    isRead: boolean;
    attachments?: MessageAttachment[];
}

/**
 * Archivo adjunto en mensaje
 */
export interface MessageAttachment {
    id: string;
    name: string;
    url: string;
    type: 'IMAGE' | 'DOCUMENT';
    size: number;
}

/**
 * Conversación del chat
 */
export interface Conversation {
    id: string;
    participants: {
        id: string;
        name: string;
        avatar?: string;
        role: UserRole;
    }[];
    venueId?: string;
    venueName?: string;
    lastMessage?: Message;
    unreadCount: number;
    createdAt: Date;
}

/**
 * Mini-comunidad
 */
export interface Community {
    id: string;
    name: string;
    description: string;
    memberCount: number;
    createdBy: string;
    createdAt: Date;
}

/**
 * Métricas del dashboard del proveedor
 */
export interface ProviderMetrics {
    totalViews: number;
    totalReservations: number;
    totalFavorites: number;
    totalMessages: number;
    viewsChange: number;
    reservationsChange: number;
    favoritesChange: number;
    messagesChange: number;
}

/**
 * Métricas del panel de administración
 */
export interface AdminMetrics {
    totalUsers: number;
    totalClients: number;
    totalProviders: number;
    totalVenues: number;
    totalBookings: number;
    completedBookings: number;
    revenue: number;
    userGrowth: { month: string; count: number }[];
    bookingsByMonth: { month: string; count: number }[];
}

/**
 * Item de FAQ
 */
export interface FAQItem {
    id: string;
    question: string;
    answer: string;
    category: string;
}

/**
 * Filtros de búsqueda
 */
export interface SearchFilters {
    query?: string;
    zone?: string;
    category?: VenueCategory;
    priceMin?: number;
    priceMax?: number;
    date?: string;
    capacity?: number;
}

/**
 * Respuesta paginada de la API
 */
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
