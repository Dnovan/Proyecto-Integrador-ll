/**
 * @fileoverview Servicio Mock API para EventSpace
 * @description Simula las respuestas del backend .NET 9 con latencia artificial
 * 
 * @iso25010
 * - Eficiencia de Desempeño: Latencia configurable para pruebas realistas
 * - Mantenibilidad: Estructura modular que facilita migración a API real
 * - Portabilidad: Interfaces compatibles con endpoints .NET 9
 */



import type {
    User,
    Venue,
    Booking,
    Review,
    Message,
    Conversation,
    ProviderMetrics,
    AdminMetrics,
    FAQItem,
    SearchFilters,
    PaginatedResponse,
    VenueCategory,
    DateAvailability,
    LoginCredentials,
    RegisterData,
} from '../types';

// ==================== CONFIGURACIÓN ====================

/** Latencia mínima simulada en ms */
const MIN_LATENCY = 300;
/** Latencia máxima simulada en ms */
const MAX_LATENCY = 800;

/**
 * Simula latencia de red
 */
const simulateLatency = (): Promise<void> => {
    const delay = Math.random() * (MAX_LATENCY - MIN_LATENCY) + MIN_LATENCY;
    return new Promise((resolve) => setTimeout(resolve, delay));
};

// ==================== DATOS MOCK ====================

/** Usuarios de prueba */
const mockUsers: User[] = [
    {
        id: '1',
        email: 'cliente@eventspace.com',
        name: 'María García',
        role: 'CLIENTE',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
        phone: '+52 55 1234 5678',
        createdAt: new Date('2025-01-01'),
    },
    {
        id: '2',
        email: 'proveedor@eventspace.com',
        name: 'Carlos Rodríguez',
        role: 'PROVEEDOR',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
        phone: '+52 55 9876 5432',
        createdAt: new Date('2024-06-15'),
        verificationStatus: 'VERIFIED',
        ineDocumentId: 'INE-12345',
    },
    {
        id: '3',
        email: 'admin@eventspace.com',
        name: 'Admin EventSpace',
        role: 'ADMIN',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
        createdAt: new Date('2024-01-01'),
    },
];

/** Contraseñas mock (en producción estarían hasheadas) */
const mockPasswords: Record<string, string> = {
    'cliente@eventspace.com': 'cliente123',
    'proveedor@eventspace.com': 'proveedor123',
    'admin@eventspace.com': 'admin123',
};

/** Zonas disponibles */
export const zones = [
    'Polanco',
    'Roma Norte',
    'Condesa',
    'Santa Fe',
    'Coyoacán',
    'San Ángel',
    'Tlalpan',
    'Xochimilco',
];

/** Categorías con labels */
export const categoryLabels: Record<VenueCategory, string> = {
    SALON_EVENTOS: 'Salón de Eventos',
    JARDIN: 'Jardín',
    TERRAZA: 'Terraza',
    HACIENDA: 'Hacienda',
    BODEGA: 'Bodega Industrial',
    RESTAURANTE: 'Restaurante',
    HOTEL: 'Hotel',
};

/** Locales de prueba */
const mockVenues: Venue[] = [
    {
        id: 'v1',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Hacienda Los Arcos',
        description: 'Hermosa hacienda colonial del siglo XVIII con amplios jardines, fuentes tradicionales y arquitectura histórica. Perfecta para bodas y eventos de gala con capacidad para grandes celebraciones.',
        address: 'Av. Insurgentes Sur 1234, Tlalpan',
        zone: 'Tlalpan',
        category: 'HACIENDA',
        price: 35000,
        capacity: 350,
        images: [
            'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
            'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
            'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800',
            'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800',
            'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Estacionamiento', 'Cocina', 'Mobiliario', 'Jardín', 'Capilla', 'Suite Nupcial'],
        status: 'FEATURED',
        rating: 4.8,
        reviewCount: 127,
        views: 3420,
        favorites: 234,
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date('2025-01-10'),
    },
    {
        id: 'v2',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Terraza Skyline CDMX',
        description: 'Exclusiva terraza en el piso 25 con vista panorámica a la Ciudad de México. Diseño contemporáneo con iluminación LED personalizable y sistema de audio profesional.',
        address: 'Paseo de la Reforma 500, Polanco',
        zone: 'Polanco',
        category: 'TERRAZA',
        price: 55000,
        capacity: 200,
        images: [
            'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
            'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
            'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
            'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA'],
        amenities: ['Valet Parking', 'Barra Premium', 'DJ Booth', 'Terraza Techada', 'Clima'],
        status: 'ACTIVE',
        rating: 4.6,
        reviewCount: 89,
        views: 2150,
        favorites: 178,
        createdAt: new Date('2024-05-20'),
        updatedAt: new Date('2025-01-08'),
    },
    {
        id: 'v3',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Jardín Botánico Roma',
        description: 'Oasis verde en el corazón de la Roma Norte. Jardín secreto con vegetación exótica, pérgolas de madera y ambiente íntimo para eventos boutique.',
        address: 'Calle Orizaba 89, Roma Norte',
        zone: 'Roma Norte',
        category: 'JARDIN',
        price: 18000,
        capacity: 100,
        images: [
            'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800',
            'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
            'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
            'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800',
            'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Estacionamiento', 'Jardín', 'Pérgola', 'Iluminación', 'Mobiliario'],
        status: 'ACTIVE',
        rating: 4.9,
        reviewCount: 56,
        views: 1890,
        favorites: 145,
        createdAt: new Date('2024-07-10'),
        updatedAt: new Date('2025-01-05'),
    },
    {
        id: 'v4',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Salón Imperial Condesa',
        description: 'Elegante salón art déco con techos altos, candelabros de cristal y pisos de mármol. Ideal para galas, cenas de empresa y celebraciones formales.',
        address: 'Av. Ámsterdam 156, Condesa',
        zone: 'Condesa',
        category: 'SALON_EVENTOS',
        price: 28000,
        capacity: 180,
        images: [
            'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
            'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800',
            'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
            'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800',
            'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA'],
        amenities: ['Valet Parking', 'Cocina Industrial', 'Audio Profesional', 'Pista de Baile', 'Clima'],
        status: 'ACTIVE',
        rating: 4.7,
        reviewCount: 203,
        views: 4560,
        favorites: 312,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2025-01-12'),
    },
    {
        id: 'v5',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Bodega Industrial 1920',
        description: 'Espacioso loft industrial con ladrillo expuesto, vigas de acero y amplios ventanales. Perfecto para eventos alternativos, exposiciones de arte y fiestas temáticas.',
        address: 'Calle Liverpool 45, Roma Norte',
        zone: 'Roma Norte',
        category: 'BODEGA',
        price: 22000,
        capacity: 250,
        images: [
            'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
            'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
            'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
            'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Estacionamiento', 'Cocina', 'Barra', 'Proyector', 'WiFi', 'Terraza'],
        status: 'ACTIVE',
        rating: 4.5,
        reviewCount: 78,
        views: 2340,
        favorites: 167,
        createdAt: new Date('2024-04-22'),
        updatedAt: new Date('2025-01-09'),
    },
    // ==================== NUEVOS LOCALES ====================
    {
        id: 'v6',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Hacienda San Miguel',
        description: 'Majestuosa hacienda del siglo XIX con capilla propia, jardines de 3 hectáreas y caballerizas. El lugar perfecto para bodas de ensueño con hasta 500 invitados.',
        address: 'Carretera Xochimilco km 12, Xochimilco',
        zone: 'Xochimilco',
        category: 'HACIENDA',
        price: 65000,
        capacity: 500,
        images: [
            'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
            'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
            'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800',
            'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Capilla', 'Jardín', 'Caballerizas', 'Suite Nupcial', 'Estacionamiento 200 autos', 'Cocina Industrial'],
        status: 'FEATURED',
        rating: 4.9,
        reviewCount: 89,
        views: 5200,
        favorites: 412,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2025-01-15'),
    },
    {
        id: 'v7',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Jardín Encantado Coyoacán',
        description: 'Romántico jardín secreto con árboles centenarios, fuente colonial y kiosco de hierro forjado. Ambiente mágico para ceremonias íntimas.',
        address: 'Calle Francisco Sosa 234, Coyoacán',
        zone: 'Coyoacán',
        category: 'JARDIN',
        price: 22000,
        capacity: 120,
        images: [
            'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800',
            'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
            'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Jardín', 'Fuente', 'Kiosco', 'Iluminación', 'Mobiliario', 'Estacionamiento'],
        status: 'ACTIVE',
        rating: 4.8,
        reviewCount: 67,
        views: 2890,
        favorites: 198,
        createdAt: new Date('2024-02-20'),
        updatedAt: new Date('2025-01-12'),
    },
    {
        id: 'v8',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Salón Versalles Premium',
        description: 'Lujoso salón inspirado en el Palacio de Versalles con acabados en pan de oro, espejos venecianos y candelabros de cristal Swarovski.',
        address: 'Av. Presidente Masaryk 456, Polanco',
        zone: 'Polanco',
        category: 'SALON_EVENTOS',
        price: 75000,
        capacity: 300,
        images: [
            'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
            'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800',
            'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA'],
        amenities: ['Valet Parking', 'Cocina Gourmet', 'Pista de Cristal', 'Suite VIP', 'Audio Premium', 'Iluminación Profesional'],
        status: 'FEATURED',
        rating: 4.9,
        reviewCount: 156,
        views: 6700,
        favorites: 523,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2025-01-14'),
    },
    {
        id: 'v9',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Terraza Luna Condesa',
        description: 'Espectacular rooftop con vista al Parque México. Diseño minimalista con jardín vertical y bar de autor. Ideal para cócteles y eventos nocturnos.',
        address: 'Av. Michoacán 78, Condesa',
        zone: 'Condesa',
        category: 'TERRAZA',
        price: 32000,
        capacity: 150,
        images: [
            'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
            'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
            'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Terraza', 'Barra Premium', 'Jardín Vertical', 'Lounge', 'DJ Booth', 'Clima'],
        status: 'ACTIVE',
        rating: 4.7,
        reviewCount: 93,
        views: 3450,
        favorites: 267,
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date('2025-01-10'),
    },
    {
        id: 'v10',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Hacienda La Esperanza',
        description: 'Hacienda pulquera restaurada con frescos originales, patios empedrados y vista a los volcanes. Experiencia auténtica mexicana para bodas campestres.',
        address: 'Camino Real a Tlalpan 890, Tlalpan',
        zone: 'Tlalpan',
        category: 'HACIENDA',
        price: 45000,
        capacity: 400,
        images: [
            'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800',
            'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
            'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Capilla', 'Jardín', 'Tinacal', 'Suite Nupcial', 'Estacionamiento', 'Área Camping'],
        status: 'ACTIVE',
        rating: 4.8,
        reviewCount: 112,
        views: 4100,
        favorites: 356,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2025-01-11'),
    },
    {
        id: 'v11',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Jardín Secreto San Ángel',
        description: 'Exclusivo jardín privado en una casona colonial de San Ángel. Bugambilias, arcos de cantera y ambiente bohemio para celebraciones únicas.',
        address: 'Av. de la Paz 45, San Ángel',
        zone: 'San Ángel',
        category: 'JARDIN',
        price: 28000,
        capacity: 80,
        images: [
            'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
            'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800',
            'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA'],
        amenities: ['Jardín', 'Fuente', 'Terraza', 'Cocina', 'Estacionamiento', 'WiFi'],
        status: 'ACTIVE',
        rating: 4.9,
        reviewCount: 45,
        views: 2100,
        favorites: 178,
        createdAt: new Date('2024-04-10'),
        updatedAt: new Date('2025-01-08'),
    },
    {
        id: 'v12',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Salón Diamante Santa Fe',
        description: 'Moderno salón corporativo con tecnología de punta, paredes de vidrio y vista panorámica. Perfecto para eventos empresariales y galas de lujo.',
        address: 'Av. Santa Fe 200, Torre Omega, Santa Fe',
        zone: 'Santa Fe',
        category: 'SALON_EVENTOS',
        price: 52000,
        capacity: 250,
        images: [
            'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800',
            'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
            'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA'],
        amenities: ['Valet Parking', 'Tecnología AV', 'Catering Premium', 'Sala VIP', 'Helipuerto', 'Seguridad 24/7'],
        status: 'ACTIVE',
        rating: 4.6,
        reviewCount: 78,
        views: 3200,
        favorites: 189,
        createdAt: new Date('2024-03-20'),
        updatedAt: new Date('2025-01-13'),
    },
    {
        id: 'v13',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Terraza del Valle',
        description: 'Terraza rústica con pérgolas de madera, luces colgantes y vista al atardecer. Ambiente cálido y acogedor para bodas campestres urbanas.',
        address: 'Insurgentes Sur 3500, Coyoacán',
        zone: 'Coyoacán',
        category: 'TERRAZA',
        price: 25000,
        capacity: 120,
        images: [
            'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
            'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
            'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Pérgola', 'Iluminación', 'Barra', 'Pista', 'Estacionamiento', 'Jardín'],
        status: 'ACTIVE',
        rating: 4.7,
        reviewCount: 62,
        views: 2650,
        favorites: 201,
        createdAt: new Date('2024-05-05'),
        updatedAt: new Date('2025-01-09'),
    },
    {
        id: 'v14',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Hacienda Floresta',
        description: 'Hermosa hacienda rodeada de bosque de oyameles. Arquitectura de piedra volcánica, chimeneas y un lago privado para fotos memorables.',
        address: 'Camino al Ajusco km 8, Tlalpan',
        zone: 'Tlalpan',
        category: 'HACIENDA',
        price: 55000,
        capacity: 350,
        images: [
            'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
            'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
            'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Lago', 'Bosque', 'Capilla', 'Chimeneas', 'Cabañas', 'Spa'],
        status: 'FEATURED',
        rating: 4.9,
        reviewCount: 134,
        views: 5800,
        favorites: 467,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2025-01-14'),
    },
    {
        id: 'v15',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Jardín de las Rosas',
        description: 'Encantador jardín temático con más de 200 variedades de rosas. Pérgolas florales, glorieta victoriana y ambiente romántico inigualable.',
        address: 'Calle del Carmen 123, San Ángel',
        zone: 'San Ángel',
        category: 'JARDIN',
        price: 35000,
        capacity: 150,
        images: [
            'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800',
            'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
            'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA'],
        amenities: ['Jardín de Rosas', 'Glorieta', 'Pérgola', 'Fuente', 'Suite', 'Estacionamiento'],
        status: 'ACTIVE',
        rating: 4.8,
        reviewCount: 89,
        views: 3400,
        favorites: 289,
        createdAt: new Date('2024-02-15'),
        updatedAt: new Date('2025-01-10'),
    },
    {
        id: 'v16',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Salón Gran Época',
        description: 'Elegante salón estilo Belle Époque con techos abovedados, frescos italianos y piano de cola. Para quienes buscan sofisticación clásica.',
        address: 'Av. Álvaro Obregón 200, Roma Norte',
        zone: 'Roma Norte',
        category: 'SALON_EVENTOS',
        price: 42000,
        capacity: 200,
        images: [
            'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800',
            'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
            'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Piano de Cola', 'Frescos', 'Valet Parking', 'Cocina Francesa', 'Guardarropa', 'Lounge'],
        status: 'ACTIVE',
        rating: 4.7,
        reviewCount: 98,
        views: 2900,
        favorites: 234,
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2025-01-12'),
    },
    {
        id: 'v17',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Terraza Cielo Abierto',
        description: 'Impresionante terraza de 800m² con lounge bar, alberca infinita y sistema de techo retráctil. La experiencia más exclusiva de la CDMX.',
        address: 'Paseo de la Reforma 222, Polanco',
        zone: 'Polanco',
        category: 'TERRAZA',
        price: 85000,
        capacity: 180,
        images: [
            'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
            'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA'],
        amenities: ['Alberca Infinita', 'Techo Retráctil', 'Lounge', 'Bar Premium', 'DJ Internacional', 'Seguridad VIP'],
        status: 'FEATURED',
        rating: 4.9,
        reviewCount: 67,
        views: 4500,
        favorites: 378,
        createdAt: new Date('2024-04-01'),
        updatedAt: new Date('2025-01-15'),
    },
    {
        id: 'v18',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Jardín Mediterráneo',
        description: 'Jardín inspirado en la Toscana italiana con olivos centenarios, fuentes de mármol y pérgolas de glicinia. Ambiente europeo en el corazón de México.',
        address: 'Calle Durango 150, Roma Norte',
        zone: 'Roma Norte',
        category: 'JARDIN',
        price: 30000,
        capacity: 100,
        images: [
            'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
            'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800',
            'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Olivos', 'Fuente de Mármol', 'Pérgola', 'Cocina Italiana', 'Terraza', 'WiFi'],
        status: 'ACTIVE',
        rating: 4.8,
        reviewCount: 54,
        views: 2200,
        favorites: 167,
        createdAt: new Date('2024-05-15'),
        updatedAt: new Date('2025-01-11'),
    },
    {
        id: 'v19',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Salón Real Chapultepec',
        description: 'Imponente salón con vista al Bosque de Chapultepec. Decoración imperial, candelabros de bronce y servicio de mayordomía. El lujo en su máxima expresión.',
        address: 'Av. Reforma 500, Chapultepec',
        zone: 'Polanco',
        category: 'SALON_EVENTOS',
        price: 95000,
        capacity: 400,
        images: [
            'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
            'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800',
            'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA'],
        amenities: ['Vista al Bosque', 'Mayordomía', 'Cocina Gourmet', 'Suite Imperial', 'Valet Parking', 'Seguridad'],
        status: 'FEATURED',
        rating: 4.9,
        reviewCount: 189,
        views: 7200,
        favorites: 589,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2025-01-15'),
    },
    {
        id: 'v20',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Hacienda Los Volcanes',
        description: 'Espectacular hacienda con vista directa al Popocatépetl e Iztaccíhuatl. 5 hectáreas de jardines, lago con cisnes y capilla del siglo XVII.',
        address: 'Carretera Chalco-Amecameca km 25, Xochimilco',
        zone: 'Xochimilco',
        category: 'HACIENDA',
        price: 78000,
        capacity: 600,
        images: [
            'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800',
            'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
            'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Vista Volcanes', 'Lago', 'Capilla Histórica', 'Jardines 5ha', 'Cabañas', 'Helipuerto'],
        status: 'ACTIVE',
        rating: 4.9,
        reviewCount: 145,
        views: 5400,
        favorites: 423,
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2025-01-14'),
    },
    // ==================== HACIENDAS ADICIONALES ====================
    {
        id: 'v21',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Hacienda Santa Clara',
        description: 'Antigua hacienda henequenera con arquitectura yucateca, arcos coloniales y jardines tropicales. Fusión perfecta de historia y elegancia.',
        address: 'Carretera a Cuernavaca km 45, Tlalpan',
        zone: 'Tlalpan',
        category: 'HACIENDA',
        price: 42000,
        capacity: 280,
        images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800'],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Capilla', 'Jardín Tropical', 'Piscina', 'Suite Nupcial'],
        status: 'ACTIVE',
        rating: 4.7,
        reviewCount: 98,
        views: 3100,
        favorites: 245,
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2025-01-10'),
    },
    {
        id: 'v22',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Hacienda El Molino',
        description: 'Hacienda con molino de agua restaurado, puentes de piedra y cascadas naturales. Ambiente bucólico para bodas de cuento.',
        address: 'Camino a Contreras 234, San Ángel',
        zone: 'San Ángel',
        category: 'HACIENDA',
        price: 52000,
        capacity: 320,
        images: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800'],
        paymentMethods: ['TRANSFERENCIA'],
        amenities: ['Molino Histórico', 'Cascadas', 'Capilla', 'Jardines'],
        status: 'FEATURED',
        rating: 4.9,
        reviewCount: 156,
        views: 4800,
        favorites: 389,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2025-01-12'),
    },
    {
        id: 'v23',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Hacienda Las Palomas',
        description: 'Hacienda ganadera con establos de época, palomar centenario y vistas al valle. Rusticidad elegante para eventos campestres.',
        address: 'Carretera Picacho-Ajusco km 15, Tlalpan',
        zone: 'Tlalpan',
        category: 'HACIENDA',
        price: 38000,
        capacity: 250,
        images: ['https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800'],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Establos', 'Palomar', 'Jardín', 'Fogata'],
        status: 'ACTIVE',
        rating: 4.6,
        reviewCount: 87,
        views: 2900,
        favorites: 198,
        createdAt: new Date('2024-04-20'),
        updatedAt: new Date('2025-01-08'),
    },
    {
        id: 'v24',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Hacienda Del Pedregal',
        description: 'Hacienda construida sobre roca volcánica con jardines de cactáceas, fuentes de cantera y arquitectura brutalista mexicana.',
        address: 'Av. De las Fuentes 890, Coyoacán',
        zone: 'Coyoacán',
        category: 'HACIENDA',
        price: 48000,
        capacity: 300,
        images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800'],
        paymentMethods: ['TRANSFERENCIA'],
        amenities: ['Jardín Volcánico', 'Fuentes', 'Terraza', 'Museo'],
        status: 'ACTIVE',
        rating: 4.8,
        reviewCount: 112,
        views: 3500,
        favorites: 278,
        createdAt: new Date('2024-02-28'),
        updatedAt: new Date('2025-01-11'),
    },
    {
        id: 'v25',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Hacienda Tres Marías',
        description: 'Hacienda pulquera con magueyes centenarios, tinacal original y vistas espectaculares. Auténtica experiencia mexicana.',
        address: 'Carretera Federal México-Cuernavaca km 52, Xochimilco',
        zone: 'Xochimilco',
        category: 'HACIENDA',
        price: 58000,
        capacity: 400,
        images: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800'],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Tinacal', 'Magueyes', 'Capilla', 'Caballos'],
        status: 'FEATURED',
        rating: 4.9,
        reviewCount: 134,
        views: 5200,
        favorites: 412,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2025-01-14'),
    },
    {
        id: 'v26',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Hacienda San Antonio',
        description: 'Imponente hacienda con capilla barroca, claustros y fuente central. Patrimonio histórico para bodas inolvidables.',
        address: 'Av. Universidad Sur 1500, Coyoacán',
        zone: 'Coyoacán',
        category: 'HACIENDA',
        price: 62000,
        capacity: 450,
        images: ['https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800'],
        paymentMethods: ['TRANSFERENCIA'],
        amenities: ['Capilla Barroca', 'Claustros', 'Jardines', 'Suite'],
        status: 'ACTIVE',
        rating: 4.8,
        reviewCount: 167,
        views: 5800,
        favorites: 456,
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2025-01-13'),
    },
    {
        id: 'v27',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Hacienda Los Laureles',
        description: 'Hacienda rodeada de laureles centenarios con kiosco victoriano y lago artificial. Romance en cada rincón.',
        address: 'Camino Real a Xochimilco 456, Xochimilco',
        zone: 'Xochimilco',
        category: 'HACIENDA',
        price: 44000,
        capacity: 280,
        images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800'],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Lago', 'Kiosco', 'Jardín', 'Lanchas'],
        status: 'ACTIVE',
        rating: 4.7,
        reviewCount: 89,
        views: 3200,
        favorites: 234,
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date('2025-01-09'),
    },
    {
        id: 'v28',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Hacienda Vista Hermosa',
        description: 'Hacienda en lo alto de la montaña con vistas de 360 grados a la ciudad. Atardeceres espectaculares garantizados.',
        address: 'Cerro del Ajusco km 22, Tlalpan',
        zone: 'Tlalpan',
        category: 'HACIENDA',
        price: 72000,
        capacity: 350,
        images: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800'],
        paymentMethods: ['TRANSFERENCIA'],
        amenities: ['Vista Panorámica', 'Helipuerto', 'Spa', 'Suite'],
        status: 'FEATURED',
        rating: 4.9,
        reviewCount: 145,
        views: 6100,
        favorites: 489,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2025-01-15'),
    },
    {
        id: 'v29',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Hacienda Del Bosque',
        description: 'Hacienda inmersa en bosque de encinos con senderos naturales y área de glamping. Conexión con la naturaleza.',
        address: 'Parque Nacional Desierto de los Leones, Santa Fe',
        zone: 'Santa Fe',
        category: 'HACIENDA',
        price: 56000,
        capacity: 200,
        images: ['https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800'],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Bosque', 'Glamping', 'Fogatas', 'Senderos'],
        status: 'ACTIVE',
        rating: 4.8,
        reviewCount: 78,
        views: 2800,
        favorites: 212,
        createdAt: new Date('2024-04-01'),
        updatedAt: new Date('2025-01-10'),
    },
    // ==================== JARDINES ADICIONALES ====================
    {
        id: 'v30',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Jardín Los Girasoles',
        description: 'Campo de girasoles con carpa de cristal, luces colgantes y ambiente bohemio. Perfecto para bodas de día.',
        address: 'Calle Durango 234, Roma Norte',
        zone: 'Roma Norte',
        category: 'JARDIN',
        price: 24000,
        capacity: 120,
        images: ['https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800'],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Carpa de Cristal', 'Jardín', 'Luces', 'Bar'],
        status: 'ACTIVE',
        rating: 4.7,
        reviewCount: 67,
        views: 2100,
        favorites: 156,
        createdAt: new Date('2024-03-20'),
        updatedAt: new Date('2025-01-08'),
    },
    {
        id: 'v31',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Jardín Zen Polanco',
        description: 'Jardín japonés con puente rojo, estanque koi y pagoda de madera. Serenidad y elegancia oriental.',
        address: 'Av. Horacio 567, Polanco',
        zone: 'Polanco',
        category: 'JARDIN',
        price: 38000,
        capacity: 80,
        images: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800'],
        paymentMethods: ['TRANSFERENCIA'],
        amenities: ['Estanque Koi', 'Pagoda', 'Puente', 'Bambú'],
        status: 'FEATURED',
        rating: 4.9,
        reviewCount: 45,
        views: 3400,
        favorites: 267,
        createdAt: new Date('2024-02-15'),
        updatedAt: new Date('2025-01-12'),
    },
    {
        id: 'v32',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Jardín Colonial',
        description: 'Jardín de casona colonial con naranjos, buganvilias y fuente de talavera. Tradición mexicana pura.',
        address: 'Calle Fernández Leal 89, Coyoacán',
        zone: 'Coyoacán',
        category: 'JARDIN',
        price: 26000,
        capacity: 100,
        images: ['https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800'],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Naranjos', 'Fuente Talavera', 'Corredores', 'Cocina'],
        status: 'ACTIVE',
        rating: 4.8,
        reviewCount: 89,
        views: 2600,
        favorites: 189,
        createdAt: new Date('2024-04-10'),
        updatedAt: new Date('2025-01-09'),
    },
    {
        id: 'v33',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Jardín La Pérgola',
        description: 'Jardín con pérgola de glicinas, piso de adoquín y ambiente provenzal. Como estar en el sur de Francia.',
        address: 'Calle Colima 156, Roma Norte',
        zone: 'Roma Norte',
        category: 'JARDIN',
        price: 32000,
        capacity: 90,
        images: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800'],
        paymentMethods: ['TRANSFERENCIA'],
        amenities: ['Pérgola Glicinas', 'Adoquín', 'Fuente', 'Romántico'],
        status: 'ACTIVE',
        rating: 4.8,
        reviewCount: 56,
        views: 2300,
        favorites: 178,
        createdAt: new Date('2024-03-05'),
        updatedAt: new Date('2025-01-11'),
    },
    {
        id: 'v34',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Jardín Lluvia de Estrellas',
        description: 'Jardín con techo de luces LED que simula el cielo nocturno. Mágico para eventos nocturnos.',
        address: 'Av. Revolución 890, San Ángel',
        zone: 'San Ángel',
        category: 'JARDIN',
        price: 35000,
        capacity: 150,
        images: ['https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800'],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Cielo LED', 'Jardín', 'Lounge', 'Bar'],
        status: 'FEATURED',
        rating: 4.9,
        reviewCount: 78,
        views: 3800,
        favorites: 298,
        createdAt: new Date('2024-02-20'),
        updatedAt: new Date('2025-01-13'),
    },
    {
        id: 'v35',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Jardín del Arte',
        description: 'Jardín-galería con esculturas de artistas mexicanos, murales y espacios creativos.',
        address: 'Plaza San Jacinto 12, San Ángel',
        zone: 'San Ángel',
        category: 'JARDIN',
        price: 28000,
        capacity: 80,
        images: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800'],
        paymentMethods: ['TRANSFERENCIA'],
        amenities: ['Esculturas', 'Galería', 'Jardín', 'Terraza'],
        status: 'ACTIVE',
        rating: 4.7,
        reviewCount: 45,
        views: 1900,
        favorites: 145,
        createdAt: new Date('2024-05-01'),
        updatedAt: new Date('2025-01-08'),
    },
    {
        id: 'v36',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Jardín Primavera',
        description: 'Jardín con flores de temporada todo el año, invernadero de cristal y mariposas.',
        address: 'Av. Universidad 456, Coyoacán',
        zone: 'Coyoacán',
        category: 'JARDIN',
        price: 22000,
        capacity: 100,
        images: ['https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800'],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Invernadero', 'Mariposario', 'Flores', 'Fotografía'],
        status: 'ACTIVE',
        rating: 4.6,
        reviewCount: 67,
        views: 2200,
        favorites: 167,
        createdAt: new Date('2024-04-15'),
        updatedAt: new Date('2025-01-10'),
    },
    {
        id: 'v37',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Jardín Las Orquídeas',
        description: 'Jardín tropical con colección de orquídeas exóticas, cascada y vegetación selvática.',
        address: 'Calle Atlixco 234, Condesa',
        zone: 'Condesa',
        category: 'JARDIN',
        price: 29000,
        capacity: 110,
        images: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800'],
        paymentMethods: ['TRANSFERENCIA'],
        amenities: ['Orquídeas', 'Cascada', 'Tropical', 'Fotografía'],
        status: 'ACTIVE',
        rating: 4.8,
        reviewCount: 56,
        views: 2500,
        favorites: 189,
        createdAt: new Date('2024-03-10'),
        updatedAt: new Date('2025-01-11'),
    },
    {
        id: 'v38',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Jardín La Cascada',
        description: 'Jardín con cascada natural de 8 metros, puente colgante y vegetación exuberante.',
        address: 'Camino a Santa Fe 678, Santa Fe',
        zone: 'Santa Fe',
        category: 'JARDIN',
        price: 42000,
        capacity: 150,
        images: ['https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800'],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Cascada Natural', 'Puente Colgante', 'Jardín', 'Lounge'],
        status: 'FEATURED',
        rating: 4.9,
        reviewCount: 89,
        views: 4200,
        favorites: 334,
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2025-01-14'),
    },
    {
        id: 'v39',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Jardín Vintage',
        description: 'Jardín estilo inglés con rosas antiguas, gazebo de hierro y mobiliario vintage.',
        address: 'Calle Liverpool 123, Roma Norte',
        zone: 'Roma Norte',
        category: 'JARDIN',
        price: 25000,
        capacity: 70,
        images: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800'],
        paymentMethods: ['TRANSFERENCIA'],
        amenities: ['Rosas Antiguas', 'Gazebo', 'Vintage', 'Romántico'],
        status: 'ACTIVE',
        rating: 4.7,
        reviewCount: 45,
        views: 1800,
        favorites: 134,
        createdAt: new Date('2024-05-10'),
        updatedAt: new Date('2025-01-09'),
    },
    // ==================== SALONES ADICIONALES ====================
    {
        id: 'v40',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Salón Metropolis',
        description: 'Salón futurista con pantallas LED 360°, sistema de sonido Dolby y diseño vanguardista.',
        address: 'Av. Santa Fe 400, Santa Fe',
        zone: 'Santa Fe',
        category: 'SALON_EVENTOS',
        price: 68000,
        capacity: 350,
        images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800'],
        paymentMethods: ['TRANSFERENCIA'],
        amenities: ['LED 360°', 'Dolby Atmos', 'Valet', 'Catering'],
        status: 'FEATURED',
        rating: 4.9,
        reviewCount: 123,
        views: 5400,
        favorites: 423,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2025-01-15'),
    },
    {
        id: 'v41',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Salón Belle Époque',
        description: 'Salón clásico francés con molduras doradas, espejos de piso a techo y piano Steinway.',
        address: 'Av. Masaryk 234, Polanco',
        zone: 'Polanco',
        category: 'SALON_EVENTOS',
        price: 58000,
        capacity: 200,
        images: ['https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800'],
        paymentMethods: ['TRANSFERENCIA'],
        amenities: ['Piano Steinway', 'Molduras Oro', 'Espejos', 'Elegante'],
        status: 'ACTIVE',
        rating: 4.8,
        reviewCount: 98,
        views: 3800,
        favorites: 289,
        createdAt: new Date('2024-02-05'),
        updatedAt: new Date('2025-01-12'),
    },
    {
        id: 'v42',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Salón Oro Negro',
        description: 'Salón elegante en tonos negro y dorado con cristalería Baccarat y alfombras persas.',
        address: 'Paseo de la Reforma 300, Polanco',
        zone: 'Polanco',
        category: 'SALON_EVENTOS',
        price: 82000,
        capacity: 280,
        images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800'],
        paymentMethods: ['TRANSFERENCIA'],
        amenities: ['Cristalería Baccarat', 'Alfombras Persas', 'Lujo', 'Exclusivo'],
        status: 'FEATURED',
        rating: 4.9,
        reviewCount: 145,
        views: 6200,
        favorites: 489,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2025-01-14'),
    },
    {
        id: 'v43',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Salón Cristal',
        description: 'Salón minimalista con paredes de cristal, vistas a la ciudad y diseño escandinavo.',
        address: 'Torre Mayor Piso 40, Reforma',
        zone: 'Polanco',
        category: 'SALON_EVENTOS',
        price: 72000,
        capacity: 180,
        images: ['https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800'],
        paymentMethods: ['TRANSFERENCIA'],
        amenities: ['Vista 360°', 'Diseño Escandinavo', 'Minimalista', 'Premium'],
        status: 'ACTIVE',
        rating: 4.8,
        reviewCount: 89,
        views: 4100,
        favorites: 312,
        createdAt: new Date('2024-02-20'),
        updatedAt: new Date('2025-01-11'),
    },
    {
        id: 'v44',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Salón Azteca',
        description: 'Salón con temática prehispánica, murales de Diego Rivera (réplicas) y detalles en obsidiana.',
        address: 'Av. Insurgentes Sur 2000, Coyoacán',
        zone: 'Coyoacán',
        category: 'SALON_EVENTOS',
        price: 45000,
        capacity: 250,
        images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800'],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Murales', 'Temático', 'Cultural', 'Mexicano'],
        status: 'ACTIVE',
        rating: 4.7,
        reviewCount: 78,
        views: 2900,
        favorites: 212,
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date('2025-01-09'),
    },
    {
        id: 'v45',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Salón Jardín Interior',
        description: 'Salón con jardín vertical interior, tragaluz y cascada de pared. Naturaleza bajo techo.',
        address: 'Av. Revolución 500, San Ángel',
        zone: 'San Ángel',
        category: 'SALON_EVENTOS',
        price: 38000,
        capacity: 150,
        images: ['https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800'],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Jardín Vertical', 'Tragaluz', 'Cascada', 'Natural'],
        status: 'ACTIVE',
        rating: 4.8,
        reviewCount: 67,
        views: 2600,
        favorites: 198,
        createdAt: new Date('2024-04-01'),
        updatedAt: new Date('2025-01-10'),
    },
    {
        id: 'v46',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Salón Ejecutivo Plaza',
        description: 'Salón corporativo con sala de juntas, centro de negocios y catering ejecutivo.',
        address: 'Av. Vasco de Quiroga 1800, Santa Fe',
        zone: 'Santa Fe',
        category: 'SALON_EVENTOS',
        price: 48000,
        capacity: 200,
        images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800'],
        paymentMethods: ['TRANSFERENCIA'],
        amenities: ['Centro Negocios', 'Videoconferencia', 'Catering', 'WiFi 5G'],
        status: 'ACTIVE',
        rating: 4.6,
        reviewCount: 89,
        views: 3200,
        favorites: 234,
        createdAt: new Date('2024-03-10'),
        updatedAt: new Date('2025-01-12'),
    },
    {
        id: 'v47',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Salón Rooftop Roma',
        description: 'Salón en azotea con terraza, jacuzzi y vista a la Torre Latinoamericana.',
        address: 'Calle Tonalá 200, Roma Norte',
        zone: 'Roma Norte',
        category: 'SALON_EVENTOS',
        price: 35000,
        capacity: 120,
        images: ['https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800'],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Rooftop', 'Jacuzzi', 'Terraza', 'Vista Ciudad'],
        status: 'ACTIVE',
        rating: 4.7,
        reviewCount: 56,
        views: 2400,
        favorites: 178,
        createdAt: new Date('2024-04-20'),
        updatedAt: new Date('2025-01-08'),
    },
    {
        id: 'v48',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Salón Art Nouveau',
        description: 'Salón con vitrales Tiffany, lámparas Murano y arquitectura modernista catalana.',
        address: 'Av. Álvaro Obregón 150, Roma Norte',
        zone: 'Roma Norte',
        category: 'SALON_EVENTOS',
        price: 52000,
        capacity: 180,
        images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800'],
        paymentMethods: ['TRANSFERENCIA'],
        amenities: ['Vitrales Tiffany', 'Lámparas Murano', 'Histórico', 'Artístico'],
        status: 'FEATURED',
        rating: 4.9,
        reviewCount: 98,
        views: 4500,
        favorites: 356,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2025-01-13'),
    },
    {
        id: 'v49',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Salón Cinema',
        description: 'Antiguo cine art déco convertido en salón de eventos con escenario y telón original.',
        address: 'Av. Coyoacán 800, Del Valle',
        zone: 'Coyoacán',
        category: 'SALON_EVENTOS',
        price: 42000,
        capacity: 300,
        images: ['https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800'],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Escenario', 'Telón', 'Art Déco', 'Acústica'],
        status: 'ACTIVE',
        rating: 4.7,
        reviewCount: 78,
        views: 3100,
        favorites: 245,
        createdAt: new Date('2024-03-25'),
        updatedAt: new Date('2025-01-10'),
    },
    // ==================== TERRAZAS ADICIONALES ====================
    {
        id: 'v50',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Terraza Sunset',
        description: 'Terraza orientada al poniente para atardeceres espectaculares. Lounge, fogatas y bar.',
        address: 'Torres Arcos Piso 20, Santa Fe',
        zone: 'Santa Fe',
        category: 'TERRAZA',
        price: 48000,
        capacity: 150,
        images: ['https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800'],
        paymentMethods: ['TRANSFERENCIA'],
        amenities: ['Sunset View', 'Fogatas', 'Lounge', 'Bar Premium'],
        status: 'FEATURED',
        rating: 4.9,
        reviewCount: 112,
        views: 4800,
        favorites: 378,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2025-01-14'),
    },
    {
        id: 'v51',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Terraza Jardín Aéreo',
        description: 'Terraza con jardín elevado, césped real y árboles en macetas gigantes.',
        address: 'Av. Insurgentes Sur 1500, Condesa',
        zone: 'Condesa',
        category: 'TERRAZA',
        price: 38000,
        capacity: 120,
        images: ['https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800'],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Césped Real', 'Árboles', 'Jardín Aéreo', 'Naturaleza'],
        status: 'ACTIVE',
        rating: 4.8,
        reviewCount: 78,
        views: 3200,
        favorites: 256,
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2025-01-11'),
    },
    {
        id: 'v52',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Terraza Industrial',
        description: 'Terraza estilo Brooklyn con containers, grafiti y ambiente urbano alternativo.',
        address: 'Calle Regina 150, Centro Histórico',
        zone: 'Roma Norte',
        category: 'TERRAZA',
        price: 28000,
        capacity: 180,
        images: ['https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800'],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Containers', 'Grafiti', 'Urbano', 'Alternativo'],
        status: 'ACTIVE',
        rating: 4.6,
        reviewCount: 89,
        views: 2800,
        favorites: 212,
        createdAt: new Date('2024-03-05'),
        updatedAt: new Date('2025-01-09'),
    },
    {
        id: 'v53',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Terraza Bohemia',
        description: 'Terraza con hamacas, cojines marroquíes y luces de feria. Ambiente hippie chic.',
        address: 'Calle Ámsterdam 200, Condesa',
        zone: 'Condesa',
        category: 'TERRAZA',
        price: 32000,
        capacity: 100,
        images: ['https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800'],
        paymentMethods: ['TRANSFERENCIA'],
        amenities: ['Hamacas', 'Cojines', 'Bohemio', 'Relajado'],
        status: 'ACTIVE',
        rating: 4.7,
        reviewCount: 67,
        views: 2400,
        favorites: 189,
        createdAt: new Date('2024-04-01'),
        updatedAt: new Date('2025-01-10'),
    },
    {
        id: 'v54',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Terraza Mediterránea',
        description: 'Terraza estilo griego con paredes blancas, buganvilias y vista al mar de la ciudad.',
        address: 'Torre Reforma Piso 50, Reforma',
        zone: 'Polanco',
        category: 'TERRAZA',
        price: 65000,
        capacity: 140,
        images: ['https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800'],
        paymentMethods: ['TRANSFERENCIA'],
        amenities: ['Estilo Griego', 'Buganvilias', 'Vista Premium', 'Elegante'],
        status: 'FEATURED',
        rating: 4.9,
        reviewCount: 98,
        views: 5200,
        favorites: 412,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2025-01-15'),
    },
    {
        id: 'v55',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Terraza 360',
        description: 'Terraza giratoria con vista panorámica completa de la CDMX. Experiencia única.',
        address: 'WTC Torre 2 Piso 45, Nápoles',
        zone: 'Santa Fe',
        category: 'TERRAZA',
        price: 78000,
        capacity: 120,
        images: ['https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800'],
        paymentMethods: ['TRANSFERENCIA'],
        amenities: ['Giratoria', 'Vista 360°', 'Única', 'Exclusiva'],
        status: 'FEATURED',
        rating: 4.9,
        reviewCount: 56,
        views: 4600,
        favorites: 367,
        createdAt: new Date('2024-02-05'),
        updatedAt: new Date('2025-01-13'),
    },
    {
        id: 'v56',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Terraza Vintage Garden',
        description: 'Terraza con mobiliario vintage, macetas antiguas y ambiente retro elegante.',
        address: 'Calle Tonalá 150, Roma Norte',
        zone: 'Roma Norte',
        category: 'TERRAZA',
        price: 26000,
        capacity: 80,
        images: ['https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800'],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Vintage', 'Macetas Antiguas', 'Retro', 'Acogedor'],
        status: 'ACTIVE',
        rating: 4.7,
        reviewCount: 45,
        views: 1900,
        favorites: 145,
        createdAt: new Date('2024-05-01'),
        updatedAt: new Date('2025-01-08'),
    },
    {
        id: 'v57',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Terraza Tropical',
        description: 'Terraza con palmeras, bar tiki y ambiente caribeño. Fiesta tropical garantizada.',
        address: 'Av. Nuevo León 200, Condesa',
        zone: 'Condesa',
        category: 'TERRAZA',
        price: 35000,
        capacity: 130,
        images: ['https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800'],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Palmeras', 'Bar Tiki', 'Tropical', 'Fiesta'],
        status: 'ACTIVE',
        rating: 4.8,
        reviewCount: 78,
        views: 3100,
        favorites: 234,
        createdAt: new Date('2024-03-20'),
        updatedAt: new Date('2025-01-11'),
    },
    {
        id: 'v58',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Terraza Constelación',
        description: 'Terraza con observatorio amateur, telescopios y cena bajo las estrellas.',
        address: 'Cerro de la Estrella, Iztapalapa',
        zone: 'Coyoacán',
        category: 'TERRAZA',
        price: 42000,
        capacity: 100,
        images: ['https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800'],
        paymentMethods: ['TRANSFERENCIA'],
        amenities: ['Observatorio', 'Telescopios', 'Estrellas', 'Romántico'],
        status: 'ACTIVE',
        rating: 4.8,
        reviewCount: 56,
        views: 2700,
        favorites: 212,
        createdAt: new Date('2024-04-10'),
        updatedAt: new Date('2025-01-10'),
    },
    {
        id: 'v59',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Terraza Minimalista',
        description: 'Terraza de diseño japonés minimalista con zen garden y estanque de carpas.',
        address: 'Av. Palmas 500, Lomas',
        zone: 'Polanco',
        category: 'TERRAZA',
        price: 55000,
        capacity: 90,
        images: ['https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800'],
        paymentMethods: ['TRANSFERENCIA'],
        amenities: ['Zen Garden', 'Estanque', 'Minimalista', 'Carpas Koi'],
        status: 'ACTIVE',
        rating: 4.9,
        reviewCount: 45,
        views: 3400,
        favorites: 278,
        createdAt: new Date('2024-02-15'),
        updatedAt: new Date('2025-01-12'),
    },
    {
        id: 'v60',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Terraza La Azotea',
        description: 'Terraza tradicional mexicana con macetas de barro, nopales y ambiente casero elegante.',
        address: 'Calle Puebla 300, Roma Norte',
        zone: 'Roma Norte',
        category: 'TERRAZA',
        price: 22000,
        capacity: 70,
        images: ['https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800'],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Tradicional', 'Macetas Barro', 'Acogedor', 'Mexicano'],
        status: 'ACTIVE',
        rating: 4.6,
        reviewCount: 67,
        views: 2000,
        favorites: 156,
        createdAt: new Date('2024-05-05'),
        updatedAt: new Date('2025-01-09'),
    },
];

/** Reseñas de prueba */
const mockReviews: Review[] = [
    {
        id: 'r1',
        venueId: 'v1',
        userId: '1',
        userName: 'María García',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
        rating: 5,
        comment: 'Increíble experiencia. El lugar es mágico y el servicio impecable. Nuestra boda fue un sueño hecho realidad.',
        createdAt: new Date('2025-01-05'),
    },
    {
        id: 'r2',
        venueId: 'v1',
        userId: '4',
        userName: 'Ana López',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
        rating: 5,
        comment: 'La hacienda es espectacular. Los jardines perfectos para fotos. 100% recomendado.',
        createdAt: new Date('2024-12-20'),
    },
    {
        id: 'r3',
        venueId: 'v2',
        userId: '5',
        userName: 'Roberto Sánchez',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto',
        rating: 4,
        comment: 'Vista increíble de la ciudad. El evento corporativo fue todo un éxito. Solo mejoraría el sistema de audio.',
        createdAt: new Date('2025-01-02'),
    },
];

/** Reservaciones de prueba */
const mockBookings: Booking[] = [
    {
        id: 'b1',
        venueId: 'v1',
        venueName: 'Hacienda Los Arcos',
        venueImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
        clientId: '1',
        clientName: 'María García',
        providerId: '2',
        date: '2025-02-14',
        status: 'CONFIRMED',
        totalPrice: 85000,
        paymentMethod: 'TRANSFERENCIA',
        createdAt: new Date('2025-01-10'),
        notes: 'Boda - 180 invitados',
    },
    {
        id: 'b2',
        venueId: 'v2',
        venueName: 'Terraza Skyline CDMX',
        venueImage: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
        clientId: '1',
        clientName: 'María García',
        providerId: '2',
        date: '2025-03-20',
        status: 'PENDING',
        totalPrice: 120000,
        paymentMethod: 'TRANSFERENCIA',
        createdAt: new Date('2025-01-12'),
        notes: 'Evento corporativo',
    },
];

/** Conversaciones de chat */
const mockConversations: Conversation[] = [
    {
        id: 'c1',
        participants: [
            { id: '1', name: 'María García', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria', role: 'CLIENTE' },
            { id: '2', name: 'Carlos Rodríguez', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos', role: 'PROVEEDOR' },
        ],
        venueId: 'v1',
        venueName: 'Hacienda Los Arcos',
        lastMessage: {
            id: 'm3',
            conversationId: 'c1',
            senderId: '2',
            senderName: 'Carlos Rodríguez',
            content: '¡Perfecto! Te envío la cotización actualizada.',
            timestamp: new Date('2025-01-13T10:30:00'),
            isRead: false,
        },
        unreadCount: 1,
        createdAt: new Date('2025-01-10'),
    },
];

/** Mensajes de chat */
const mockMessages: Message[] = [
    {
        id: 'm1',
        conversationId: 'c1',
        senderId: '1',
        senderName: 'María García',
        senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
        content: 'Hola, me interesa reservar la hacienda para el 14 de febrero.',
        timestamp: new Date('2025-01-10T09:00:00'),
        isRead: true,
    },
    {
        id: 'm2',
        conversationId: 'c1',
        senderId: '2',
        senderName: 'Carlos Rodríguez',
        senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
        content: '¡Hola María! Claro, esa fecha está disponible. ¿Cuántos invitados tendrás?',
        timestamp: new Date('2025-01-10T09:15:00'),
        isRead: true,
    },
    {
        id: 'm3',
        conversationId: 'c1',
        senderId: '1',
        senderName: 'María García',
        senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
        content: 'Seremos aproximadamente 180 personas. ¿Incluye el montaje de mesas?',
        timestamp: new Date('2025-01-13T10:00:00'),
        isRead: true,
    },
    {
        id: 'm4',
        conversationId: 'c1',
        senderId: '2',
        senderName: 'Carlos Rodríguez',
        senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
        content: '¡Perfecto! Te envío la cotización actualizada.',
        timestamp: new Date('2025-01-13T10:30:00'),
        isRead: false,
    },
];

/** FAQ */
const mockFAQs: FAQItem[] = [
    {
        id: 'faq1',
        question: '¿Cómo puedo reservar un local?',
        answer: 'Para reservar un local, primero navega al detalle del espacio que te interesa. Revisa la disponibilidad en el calendario y haz clic en "Solicitar Reservación". El proveedor recibirá tu solicitud y te contactará para confirmar los detalles.',
        category: 'Reservaciones',
    },
    {
        id: 'faq2',
        question: '¿Cuáles son los métodos de pago aceptados?',
        answer: 'Cada local puede aceptar diferentes métodos de pago. Los más comunes son transferencia bancaria y efectivo. Puedes ver los métodos aceptados en la página de detalle de cada espacio.',
        category: 'Pagos',
    },
    {
        id: 'faq3',
        question: '¿Cómo me convierto en proveedor?',
        answer: 'Los proveedores son verificados manualmente por nuestro equipo. Si tienes un espacio que deseas publicar, contáctanos a través del formulario de contacto y nuestro equipo evaluará tu solicitud.',
        category: 'Proveedores',
    },
    {
        id: 'faq4',
        question: '¿Puedo cancelar una reservación?',
        answer: 'Las políticas de cancelación varían según el proveedor. Te recomendamos revisar los términos antes de confirmar y comunicarte directamente con el proveedor para acordar cualquier cambio.',
        category: 'Reservaciones',
    },
    {
        id: 'faq5',
        question: '¿Cómo contacto a un proveedor?',
        answer: 'Una vez que hayas encontrado un local que te interese, puedes enviar un mensaje al proveedor directamente desde la página del espacio. También puedes iniciar una conversación desde tu centro de mensajes.',
        category: 'Comunicación',
    },
];

/** IDs de locales vistos recientemente (simulación) */
let recentlyViewedIds: string[] = ['v1', 'v3'];

// ==================== SERVICIOS DE AUTENTICACIÓN ====================

/**
 * Inicia sesión con credenciales
 */
export const login = async (credentials: LoginCredentials): Promise<User> => {
    await simulateLatency();

    const user = mockUsers.find((u) => u.email === credentials.email);
    const password = mockPasswords[credentials.email];

    if (!user || password !== credentials.password) {
        throw new Error('Credenciales inválidas');
    }

    return user;
};

/**
 * Registra un nuevo cliente
 * @throws Error si el email ya existe o si se intenta registrar un proveedor
 */
export const register = async (data: RegisterData): Promise<User> => {
    await simulateLatency();

    if (mockUsers.some((u) => u.email === data.email)) {
        throw new Error('El email ya está registrado');
    }

    const newUser: User = {
        id: `user-${Date.now()}`,
        email: data.email,
        name: data.name,
        role: 'CLIENTE',
        phone: data.phone,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name.replace(' ', '')}`,
        createdAt: new Date(),
    };

    mockUsers.push(newUser);
    mockPasswords[data.email] = data.password;

    return newUser;
};

/**
 * Cierra sesión (limpia datos locales)
 */
export const logout = async (): Promise<void> => {
    await simulateLatency();
    // En producción, invalidaría el token en el servidor
};

// ==================== SERVICIOS DE LOCALES ====================

/**
 * Obtiene locales con filtros y paginación
 */
export const getVenues = async (
    filters?: SearchFilters,
    page = 1,
    pageSize = 10
): Promise<PaginatedResponse<Venue>> => {
    await simulateLatency();

    let filtered = [...mockVenues].filter((v) => v.status !== 'BANNED');

    if (filters?.query) {
        const query = filters.query.toLowerCase();
        filtered = filtered.filter(
            (v) =>
                v.name.toLowerCase().includes(query) ||
                v.description.toLowerCase().includes(query) ||
                v.zone.toLowerCase().includes(query)
        );
    }

    if (filters?.zone) {
        filtered = filtered.filter((v) => v.zone === filters.zone);
    }

    if (filters?.category) {
        filtered = filtered.filter((v) => v.category === filters.category);
    }

    if (filters?.priceMin !== undefined) {
        filtered = filtered.filter((v) => v.price >= filters.priceMin!);
    }

    if (filters?.priceMax !== undefined) {
        filtered = filtered.filter((v) => v.price <= filters.priceMax!);
    }

    if (filters?.capacity) {
        filtered = filtered.filter((v) => v.capacity >= filters.capacity!);
    }

    // Ordenar: destacados primero, luego por rating
    filtered.sort((a, b) => {
        if (a.status === 'FEATURED' && b.status !== 'FEATURED') return -1;
        if (b.status === 'FEATURED' && a.status !== 'FEATURED') return 1;
        return b.rating - a.rating;
    });

    const total = filtered.length;
    const startIndex = (page - 1) * pageSize;
    const data = filtered.slice(startIndex, startIndex + pageSize);

    return {
        data,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
    };
};

/**
 * Obtiene un local por ID
 */
export const getVenueById = async (id: string): Promise<Venue> => {
    await simulateLatency();

    const venue = mockVenues.find((v) => v.id === id);
    if (!venue) {
        throw new Error('Local no encontrado');
    }

    // Registrar vista
    venue.views++;

    // Agregar a vistos recientemente
    recentlyViewedIds = [id, ...recentlyViewedIds.filter((vid) => vid !== id)].slice(0, 5);

    return venue;
};

/**
 * Obtiene locales vistos recientemente
 */
export const getRecentlyViewed = async (): Promise<Venue[]> => {
    await simulateLatency();

    return recentlyViewedIds
        .map((id) => mockVenues.find((v) => v.id === id))
        .filter((v): v is Venue => v !== undefined);
};

/**
 * Obtiene locales recomendados
 */
export const getRecommendedVenues = async (): Promise<Venue[]> => {
    await simulateLatency();

    // Simula recomendaciones basadas en popularidad
    return [...mockVenues]
        .filter((v) => v.status !== 'BANNED')
        .sort((a, b) => b.favorites - a.favorites)
        .slice(0, 4);
};

/**
 * Obtiene disponibilidad de fechas para un local
 */
export const getVenueAvailability = async (
    venueId: string,
    month: number,
    year: number
): Promise<DateAvailability[]> => {
    await simulateLatency();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const availability: DateAvailability[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateStr = date.toISOString().split('T')[0];

        // Simula disponibilidad aleatoria
        const isBooked = mockBookings.some(
            (b) => b.venueId === venueId && b.date === dateStr && b.status !== 'CANCELLED'
        );

        // Fechas pasadas no disponibles
        const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

        availability.push({
            date: dateStr,
            isAvailable: !isBooked && !isPast,
        });
    }

    return availability;
};

/**
 * Obtiene reseñas de un local
 */
export const getVenueReviews = async (venueId: string): Promise<Review[]> => {
    await simulateLatency();

    return mockReviews.filter((r) => r.venueId === venueId);
};

// ==================== SERVICIOS DE RESERVACIONES ====================

/**
 * Obtiene reservaciones del usuario
 */
export const getUserBookings = async (userId: string): Promise<Booking[]> => {
    await simulateLatency();

    return mockBookings.filter((b) => b.clientId === userId);
};

/**
 * Obtiene reservaciones del proveedor
 */
export const getProviderBookings = async (providerId: string): Promise<Booking[]> => {
    await simulateLatency();

    return mockBookings.filter((b) => b.providerId === providerId);
};

/**
 * Crea una nueva reservación
 */
export const createBooking = async (
    venueId: string,
    clientId: string,
    date: string,
    paymentMethod: 'TRANSFERENCIA' | 'EFECTIVO',
    notes?: string
): Promise<Booking> => {
    await simulateLatency();

    const venue = mockVenues.find((v) => v.id === venueId);
    if (!venue) throw new Error('Local no encontrado');

    const client = mockUsers.find((u) => u.id === clientId);
    if (!client) throw new Error('Usuario no encontrado');

    const booking: Booking = {
        id: `b-${Date.now()}`,
        venueId,
        venueName: venue.name,
        venueImage: venue.images[0],
        clientId,
        clientName: client.name,
        providerId: venue.providerId,
        date,
        status: 'PENDING',
        totalPrice: venue.price,
        paymentMethod,
        createdAt: new Date(),
        notes,
    };

    mockBookings.push(booking);
    return booking;
};

// ==================== SERVICIOS DE MENSAJERÍA ====================

/**
 * Obtiene conversaciones del usuario
 */
export const getConversations = async (userId: string): Promise<Conversation[]> => {
    await simulateLatency();

    return mockConversations.filter((c) =>
        c.participants.some((p) => p.id === userId)
    );
};

/**
 * Obtiene mensajes de una conversación
 */
export const getMessages = async (conversationId: string): Promise<Message[]> => {
    await simulateLatency();

    return mockMessages.filter((m) => m.conversationId === conversationId);
};

/**
 * Envía un mensaje
 */
export const sendMessage = async (
    conversationId: string,
    senderId: string,
    content: string
): Promise<Message> => {
    await simulateLatency();

    const sender = mockUsers.find((u) => u.id === senderId);
    if (!sender) throw new Error('Usuario no encontrado');

    const message: Message = {
        id: `m-${Date.now()}`,
        conversationId,
        senderId,
        senderName: sender.name,
        senderAvatar: sender.avatar,
        content,
        timestamp: new Date(),
        isRead: false,
    };

    mockMessages.push(message);
    return message;
};

// ==================== SERVICIOS DE MÉTRICAS ====================

/**
 * Obtiene métricas del proveedor
 */
export const getProviderMetrics = async (providerId: string): Promise<ProviderMetrics> => {
    await simulateLatency();

    const providerVenues = mockVenues.filter((v) => v.providerId === providerId);
    const providerBookings = mockBookings.filter((b) => b.providerId === providerId);
    const providerConversations = mockConversations.filter((c) =>
        c.participants.some((p) => p.id === providerId)
    );

    return {
        totalViews: providerVenues.reduce((sum, v) => sum + v.views, 0),
        totalReservations: providerBookings.length,
        totalFavorites: providerVenues.reduce((sum, v) => sum + v.favorites, 0),
        totalMessages: providerConversations.reduce((sum, c) => sum + c.unreadCount, 0),
        viewsChange: 12.5,
        reservationsChange: 8.3,
        favoritesChange: 15.2,
        messagesChange: -2.1,
    };
};

/**
 * Obtiene métricas de administración
 */
export const getAdminMetrics = async (): Promise<AdminMetrics> => {
    await simulateLatency();

    return {
        totalUsers: mockUsers.length,
        totalClients: mockUsers.filter((u) => u.role === 'CLIENTE').length,
        totalProviders: mockUsers.filter((u) => u.role === 'PROVEEDOR').length,
        totalVenues: mockVenues.length,
        totalBookings: mockBookings.length,
        completedBookings: mockBookings.filter((b) => b.status === 'COMPLETED').length,
        revenue: mockBookings
            .filter((b) => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
            .reduce((sum, b) => sum + b.totalPrice, 0),
        userGrowth: [
            { month: 'Ago', count: 45 },
            { month: 'Sep', count: 62 },
            { month: 'Oct', count: 78 },
            { month: 'Nov', count: 95 },
            { month: 'Dic', count: 112 },
            { month: 'Ene', count: 134 },
        ],
        bookingsByMonth: [
            { month: 'Ago', count: 12 },
            { month: 'Sep', count: 18 },
            { month: 'Oct', count: 24 },
            { month: 'Nov', count: 31 },
            { month: 'Dic', count: 28 },
            { month: 'Ene', count: 35 },
        ],
    };
};

// ==================== SERVICIOS DE ADMINISTRACIÓN ====================

/**
 * Obtiene todos los usuarios (solo admin)
 */
export const getAllUsers = async (): Promise<User[]> => {
    await simulateLatency();
    return mockUsers;
};

/**
 * Obtiene todos los locales (solo admin)
 */
export const getAllVenues = async (): Promise<Venue[]> => {
    await simulateLatency();
    return mockVenues;
};

/**
 * Crea un nuevo proveedor (solo admin)
 */
export const createProvider = async (
    email: string,
    name: string,
    phone: string,
    verified: boolean
): Promise<User> => {
    await simulateLatency();

    if (mockUsers.some((u) => u.email === email)) {
        throw new Error('El email ya está registrado');
    }

    const newProvider: User = {
        id: `prov-${Date.now()}`,
        email,
        name,
        role: 'PROVEEDOR',
        phone,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(' ', '')}`,
        createdAt: new Date(),
        verificationStatus: verified ? 'VERIFIED' : 'PENDING',
    };

    mockUsers.push(newProvider);
    mockPasswords[email] = 'proveedor123'; // Contraseña por defecto

    return newProvider;
};

/**
 * Actualiza estado de un local (bannear/destacar)
 */
export const updateVenueStatus = async (
    venueId: string,
    status: 'ACTIVE' | 'BANNED' | 'FEATURED'
): Promise<Venue> => {
    await simulateLatency();

    const venue = mockVenues.find((v) => v.id === venueId);
    if (!venue) throw new Error('Local no encontrado');

    venue.status = status;
    venue.updatedAt = new Date();

    return venue;
};

// ==================== SERVICIOS DE AYUDA ====================

/**
 * Obtiene preguntas frecuentes
 */
export const getFAQs = async (): Promise<FAQItem[]> => {
    await simulateLatency();
    return mockFAQs;
};

/**
 * Obtiene locales del proveedor
 */
export const getProviderVenues = async (providerId: string): Promise<Venue[]> => {
    await simulateLatency();
    return mockVenues.filter((v) => v.providerId === providerId);
};
