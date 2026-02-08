/**
 * @fileoverview Página de Exploración de Locales
 * @description Permite buscar y filtrar locales disponibles con datos de Supabase
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, X, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { PropertyCard } from '../../components/organisms/PropertyCard';
import { VenueCardSkeleton } from '../../components/atoms/Skeleton';
import { getVenues } from '../../services/venueService';
import type { Venue } from '../../types';

// Zonas disponibles
const ZONES = [
    'Centro', 'Zapopan', 'Tlaquepaque', 'Tonalá', 'Tlajomulco',
    'Chapala', 'Colonia Americana', 'Providencia', 'Andares', 'Valle Real'
];

// Categorías
const CATEGORIES = [
    { value: 'SALON_EVENTOS', label: 'Salón de Eventos' },
    { value: 'JARDIN', label: 'Jardín' },
    { value: 'TERRAZA', label: 'Terraza' },
    { value: 'HACIENDA', label: 'Hacienda' },
    { value: 'BODEGA', label: 'Bodega' },
    { value: 'RESTAURANTE', label: 'Restaurante' },
    { value: 'HOTEL', label: 'Hotel' },
    { value: 'FINCA', label: 'Finca' },
    { value: 'ROOFTOP', label: 'Rooftop' },
];

export const ExplorePage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [venues, setVenues] = useState<Venue[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [selectedZone, setSelectedZone] = useState(searchParams.get('zone') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
    const [showFilters, setShowFilters] = useState(false);

    // Colores del tema premium
    const colors = {
        gold: '#C5A059',
        goldLight: '#E8C872',
        text: '#2C2C2C',
        textSecondary: '#5D5D5D',
        bgLight: '#FAFAFA',
        border: '#F0F0F0',
    };

    // Cargar venues
    useEffect(() => {
        const loadVenues = async () => {
            setIsLoading(true);
            try {
                const filters: any = {};
                if (selectedZone) filters.zone = selectedZone;
                if (selectedCategory) filters.category = selectedCategory;
                if (searchQuery) filters.query = searchQuery;
                if (priceRange[0] > 0) filters.priceMin = priceRange[0];
                if (priceRange[1] < 100000) filters.priceMax = priceRange[1];

                const { data } = await getVenues(filters, 1, 50);
                setVenues(data);
            } catch (error) {
                console.error('Error loading venues:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadVenues();
    }, [selectedZone, selectedCategory, searchQuery, priceRange]);

    // Manejar búsqueda
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchQuery) params.set('q', searchQuery);
        if (selectedZone) params.set('zone', selectedZone);
        if (selectedCategory) params.set('category', selectedCategory);
        setSearchParams(params);
    };

    // Limpiar filtros
    const clearFilters = () => {
        setSearchQuery('');
        setSelectedZone('');
        setSelectedCategory('');
        setPriceRange([0, 100000]);
        setSearchParams({});
    };

    const hasActiveFilters = searchQuery || selectedZone || selectedCategory || priceRange[0] > 0 || priceRange[1] < 100000;

    return (
        <div style={{ minHeight: '100vh', background: '#FFFFFF' }}>
            {/* Header con búsqueda */}
            <section style={{
                padding: '3rem 1rem 2rem',
                background: colors.bgLight,
                borderBottom: `1px solid ${colors.border}`,
            }}>
                <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
                    <h1 style={{
                        fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                        fontWeight: 700,
                        color: colors.text,
                        marginBottom: '1.5rem',
                    }}>
                        Explorar Espacios
                    </h1>

                    {/* Barra de búsqueda */}
                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{
                            flex: 1,
                            minWidth: '280px',
                            position: 'relative',
                        }}>
                            <Search style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: 20,
                                height: 20,
                                color: colors.textSecondary,
                            }} />
                            <input
                                type="text"
                                placeholder="Buscar por nombre, zona o dirección..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '1rem 1rem 1rem 3rem',
                                    fontSize: '1rem',
                                    border: `1px solid ${colors.border}`,
                                    borderRadius: '12px',
                                    background: '#FFFFFF',
                                    color: colors.text,
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                }}
                                onFocus={(e) => e.target.style.borderColor = colors.gold}
                                onBlur={(e) => e.target.style.borderColor = colors.border}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '1rem 1.5rem',
                                border: `1px solid ${showFilters ? colors.gold : colors.border}`,
                                borderRadius: '12px',
                                background: showFilters ? `${colors.gold}10` : '#FFFFFF',
                                color: showFilters ? colors.gold : colors.textSecondary,
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: 500,
                                transition: 'all 0.2s',
                            }}
                        >
                            <SlidersHorizontal style={{ width: 20, height: 20 }} />
                            Filtros
                        </button>

                        <button
                            type="submit"
                            style={{
                                padding: '1rem 2rem',
                                background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.goldLight} 100%)`,
                                color: '#1a1a1a',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                        >
                            Buscar
                        </button>
                    </form>

                    {/* Panel de filtros expandible */}
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{
                                marginTop: '1.5rem',
                                padding: '1.5rem',
                                background: '#FFFFFF',
                                borderRadius: '12px',
                                border: `1px solid ${colors.border}`,
                            }}
                        >
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                                {/* Zona */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: colors.text }}>
                                        Zona
                                    </label>
                                    <select
                                        value={selectedZone}
                                        onChange={(e) => setSelectedZone(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            border: `1px solid ${colors.border}`,
                                            background: '#FFFFFF',
                                            color: colors.text,
                                            fontSize: '0.875rem',
                                        }}
                                    >
                                        <option value="">Todas las zonas</option>
                                        {ZONES.map(zone => (
                                            <option key={zone} value={zone}>{zone}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Categoría */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: colors.text }}>
                                        Categoría
                                    </label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            border: `1px solid ${colors.border}`,
                                            background: '#FFFFFF',
                                            color: colors.text,
                                            fontSize: '0.875rem',
                                        }}
                                    >
                                        <option value="">Todas las categorías</option>
                                        {CATEGORIES.map(cat => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Precio mínimo */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: colors.text }}>
                                        Precio mínimo
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="$0"
                                        value={priceRange[0] || ''}
                                        onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            border: `1px solid ${colors.border}`,
                                            background: '#FFFFFF',
                                            color: colors.text,
                                            fontSize: '0.875rem',
                                        }}
                                    />
                                </div>

                                {/* Precio máximo */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: colors.text }}>
                                        Precio máximo
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="$100,000"
                                        value={priceRange[1] === 100000 ? '' : priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 100000])}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            border: `1px solid ${colors.border}`,
                                            background: '#FFFFFF',
                                            color: colors.text,
                                            fontSize: '0.875rem',
                                        }}
                                    />
                                </div>
                            </div>

                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    style={{
                                        marginTop: '1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.5rem 1rem',
                                        background: 'transparent',
                                        border: 'none',
                                        color: colors.gold,
                                        cursor: 'pointer',
                                        fontSize: '0.875rem',
                                        fontWeight: 500,
                                    }}
                                >
                                    <X style={{ width: 16, height: 16 }} />
                                    Limpiar filtros
                                </button>
                            )}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Resultados */}
            <section style={{ padding: '3rem 1rem' }}>
                <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
                    {/* Contador de resultados */}
                    <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ color: colors.textSecondary }}>
                            {isLoading ? 'Buscando...' : `${venues.length} espacios encontrados`}
                        </p>
                    </div>

                    {/* Grid de venues */}
                    {isLoading ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                            {[...Array(6)].map((_, i) => (
                                <VenueCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : venues.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '4rem 2rem',
                            background: colors.bgLight,
                            borderRadius: '16px',
                        }}>
                            <MapPin style={{ width: 48, height: 48, color: colors.gold, margin: '0 auto 1rem' }} />
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: colors.text, marginBottom: '0.5rem' }}>
                                No se encontraron espacios
                            </h3>
                            <p style={{ color: colors.textSecondary, marginBottom: '1.5rem' }}>
                                Intenta ajustar tus filtros o buscar con otras palabras clave.
                            </p>
                            <button
                                onClick={clearFilters}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: colors.gold,
                                    color: '#1a1a1a',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}
                        >
                            {venues.map((venue) => (
                                <motion.div
                                    key={venue.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Link to={`/local/${venue.id}`} style={{ textDecoration: 'none' }}>
                                        <PropertyCard venue={venue} />
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default ExplorePage;
