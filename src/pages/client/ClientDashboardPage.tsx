/**
 * @fileoverview Dashboard del Cliente - EventSpace
 * @description Vista principal ULTRA PREMIUM para usuarios autenticados.
 * Diseño super elegante con glassmorphism, animaciones sofisticadas y efectos visuales de lujo.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PropertyCard } from '../../components/organisms/PropertyCard';
import LightRays from '../../components/effects/LightRays';
import { Search, Filter, Warehouse, Heart, Building2, Trees, Sparkles, ChevronRight, TrendingUp, Crown, Star } from 'lucide-react';
import type { Venue } from '../../types';

import { getVenues } from '../../services/venueService';

const CATEGORIES = [
    { id: 'all', label: 'Todos', icon: Sparkles, color: 'from-amber-500 to-yellow-400' },
    { id: 'SALON_EVENTOS', label: 'Salones', icon: Warehouse, color: 'from-purple-500 to-pink-400' },
    { id: 'JARDIN', label: 'Jardines', icon: Trees, color: 'from-emerald-500 to-green-400' },
    { id: 'TERRAZA', label: 'Terrazas', icon: Building2, color: 'from-blue-500 to-cyan-400' },
    { id: 'HACIENDA', label: 'Haciendas', icon: Crown, color: 'from-orange-500 to-amber-400' },
    { id: 'BODA', label: 'Bodas', icon: Heart, color: 'from-rose-500 to-pink-400' },
];

export const ClientDashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [venues, setVenues] = useState<Venue[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);

    useEffect(() => {
        const loadVenues = async () => {
            try {
                setIsLoading(true);
                const response = await getVenues({}, 1, 100);
                setVenues(response.data);
            } catch (error) {
                console.error('Error loading venues:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadVenues();
    }, []);

    const firstName = user?.name?.split(' ')[0] || 'Cliente';

    const filteredVenues = venues.filter(venue => {
        const matchesCategory = selectedCategory === 'all' ||
            (selectedCategory === 'BODA'
                ? ['SALON_EVENTOS', 'HACIENDA', 'JARDIN'].includes(venue.category)
                : venue.category === selectedCategory);

        const matchesSearch = searchQuery === '' ||
            venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            venue.zone.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    const featuredVenues = venues.filter(v => v.status === 'FEATURED').slice(0, 4);

    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #FFFCF5 0%, #FEF9EE 50%, #FFFDFB 100%)' }}>
            {/* Hero Section - Ultra Premium */}
            <section className="relative pt-28 pb-16 overflow-hidden">
                {/* LightRays Animation Background */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.5 }}>
                    <LightRays
                        raysOrigin="top-center"
                        raysColor="#C5A059"
                        raysSpeed={0.6}
                        lightSpread={0.4}
                        rayLength={3}
                        followMouse={true}
                        mouseInfluence={0.12}
                        noiseAmount={0}
                        distortion={0}
                        pulsating={false}
                        fadeDistance={1.2}
                        saturation={0.7}
                    />
                </div>

                {/* Floating Decorative Orbs */}
                <div className="absolute top-20 right-[15%] w-64 h-64 rounded-full animate-float" style={{ background: 'radial-gradient(circle, rgba(197, 160, 89, 0.15) 0%, transparent 70%)' }} />
                <div className="absolute top-40 left-[10%] w-48 h-48 rounded-full animate-float" style={{ background: 'radial-gradient(circle, rgba(232, 200, 114, 0.12) 0%, transparent 70%)', animationDelay: '1s' }} />
                <div className="absolute bottom-10 right-[25%] w-32 h-32 rounded-full animate-float" style={{ background: 'radial-gradient(circle, rgba(197, 160, 89, 0.1) 0%, transparent 70%)', animationDelay: '2s' }} />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ zIndex: 1 }}>
                    {/* Premium Greeting Header */}
                    <header className="mb-12 text-center">
                        {/* Premium Badge */}
                        <div className="inline-flex items-center gap-2 mb-6">
                            <span
                                className="inline-flex items-center gap-2.5 px-5 py-2"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(197, 160, 89, 0.08) 0%, rgba(232, 200, 114, 0.05) 100%)',
                                    border: '1px solid rgba(197, 160, 89, 0.2)',
                                    borderRadius: '100px',
                                    backdropFilter: 'blur(10px)',
                                }}
                            >
                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 animate-pulse" />
                                <span style={{
                                    background: 'linear-gradient(90deg, #997B30 0%, #C5A059 50%, #997B30 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    letterSpacing: '0.05em',
                                    textTransform: 'uppercase',
                                }}>
                                    Espacios Exclusivos
                                </span>
                            </span>
                        </div>

                        {/* Main Title */}
                        <h1 className="mb-5" style={{
                            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                            fontWeight: 800,
                            lineHeight: 1.1,
                            letterSpacing: '-0.03em',
                        }}>
                            <span style={{ color: '#1F1F1F' }}>Bienvenido, </span>
                            <span style={{
                                background: 'linear-gradient(135deg, #B8963F 0%, #C5A059 25%, #E8C872 50%, #C5A059 75%, #997B30 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundSize: '200% auto',
                            }}>
                                {firstName}
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p style={{
                            color: '#6B7280',
                            fontSize: '1.25rem',
                            maxWidth: '600px',
                            margin: '0 auto',
                            lineHeight: 1.7,
                            fontWeight: 400,
                        }}>
                            Descubre espacios únicos diseñados para crear
                            <span style={{ color: '#C5A059', fontWeight: 600 }}> momentos inolvidables</span>
                        </p>
                    </header>

                    {/* Premium Search Bar */}
                    <div className="max-w-2xl mx-auto mb-12">
                        <div
                            className="relative"
                            style={{
                                background: searchFocused
                                    ? 'linear-gradient(135deg, rgba(197, 160, 89, 0.1) 0%, rgba(255, 255, 255, 0.95) 100%)'
                                    : '#FFFFFF',
                                borderRadius: '20px',
                                border: searchFocused
                                    ? '2px solid rgba(197, 160, 89, 0.4)'
                                    : '1px solid rgba(0, 0, 0, 0.06)',
                                boxShadow: searchFocused
                                    ? '0 20px 60px rgba(197, 160, 89, 0.15), 0 0 0 4px rgba(197, 160, 89, 0.05)'
                                    : '0 4px 30px rgba(0, 0, 0, 0.04)',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                transform: searchFocused ? 'scale(1.02)' : 'scale(1)',
                            }}
                        >
                            <div className="flex items-center">
                                <div style={{ padding: '0 0 0 1.5rem' }}>
                                    <Search style={{
                                        width: 22,
                                        height: 22,
                                        color: searchFocused ? '#C5A059' : '#9CA3AF',
                                        transition: 'color 0.3s ease',
                                    }} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Buscar haciendas, jardines, salones..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setSearchFocused(true)}
                                    onBlur={() => setSearchFocused(false)}
                                    style={{
                                        flex: 1,
                                        padding: '1.25rem 1rem',
                                        border: 'none',
                                        outline: 'none',
                                        background: 'transparent',
                                        fontSize: '1.0625rem',
                                        color: '#1F2937',
                                        fontWeight: 400,
                                    }}
                                />
                                <button
                                    style={{
                                        margin: '0.5rem',
                                        padding: '0.875rem 2rem',
                                        background: 'linear-gradient(135deg, #C5A059 0%, #D4AF61 50%, #E8C872 100%)',
                                        border: 'none',
                                        borderRadius: '14px',
                                        color: '#1a1a1a',
                                        fontWeight: 600,
                                        fontSize: '0.9375rem',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 20px rgba(197, 160, 89, 0.35)',
                                        transition: 'all 0.3s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = '0 6px 25px rgba(197, 160, 89, 0.45)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(197, 160, 89, 0.35)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    Explorar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Premium Categories */}
                    <div className="relative">
                        <div className="flex flex-wrap justify-center gap-3" style={{ perspective: '1000px' }}>
                            {CATEGORIES.map((cat, index) => {
                                const Icon = cat.icon;
                                const isActive = selectedCategory === cat.id;

                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className="animate-fade-in-up"
                                        style={{
                                            animationDelay: `${index * 80}ms`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.625rem',
                                            padding: isActive ? '0.875rem 1.75rem' : '0.75rem 1.5rem',
                                            borderRadius: '16px',
                                            fontWeight: 600,
                                            fontSize: '0.9375rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                                            border: 'none',
                                            background: isActive
                                                ? 'linear-gradient(135deg, #1F1F1F 0%, #2D2D2D 100%)'
                                                : 'rgba(255, 255, 255, 0.9)',
                                            color: isActive ? '#FFFFFF' : '#4B5563',
                                            boxShadow: isActive
                                                ? '0 10px 40px rgba(31, 31, 31, 0.25), inset 0 1px 0 rgba(255,255,255,0.1)'
                                                : '0 2px 12px rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(0,0,0,0.04)',
                                            transform: isActive ? 'scale(1.05)' : 'scale(1)',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                                                e.currentTarget.style.boxShadow = '0 8px 30px rgba(197, 160, 89, 0.15), inset 0 0 0 1px rgba(197, 160, 89, 0.2)';
                                                e.currentTarget.style.color = '#C5A059';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                                                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(0,0,0,0.04)';
                                                e.currentTarget.style.color = '#4B5563';
                                            }
                                        }}
                                    >
                                        <Icon style={{ width: 18, height: 18 }} />
                                        <span>{cat.label}</span>
                                        {isActive && (
                                            <span style={{
                                                marginLeft: '0.25rem',
                                                padding: '0.25rem 0.625rem',
                                                background: 'linear-gradient(135deg, #C5A059 0%, #E8C872 100%)',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                color: '#1F1F1F',
                                            }}>
                                                {filteredVenues.length}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Section - Elegant */}
            {selectedCategory === 'all' && featuredVenues.length > 0 && (
                <section className="py-12 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(197, 160, 89, 0.03) 100%)' }}>
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-4">
                                <div
                                    style={{
                                        padding: '0.875rem',
                                        background: 'linear-gradient(135deg, #C5A059 0%, #E8C872 100%)',
                                        borderRadius: '16px',
                                        boxShadow: '0 8px 30px rgba(197, 160, 89, 0.35)',
                                    }}
                                >
                                    <TrendingUp style={{ width: 24, height: 24, color: '#FFFFFF' }} />
                                </div>
                                <div>
                                    <h2 style={{
                                        fontSize: '1.75rem',
                                        fontWeight: 700,
                                        color: '#1F1F1F',
                                        letterSpacing: '-0.02em',
                                    }}>
                                        Destacados
                                    </h2>
                                    <p style={{ color: '#6B7280', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
                                        Los espacios más solicitados este mes
                                    </p>
                                </div>
                            </div>
                            <button
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.75rem 1.25rem',
                                    background: 'transparent',
                                    border: '1.5px solid rgba(197, 160, 89, 0.3)',
                                    borderRadius: '12px',
                                    color: '#C5A059',
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(197, 160, 89, 0.08)';
                                    e.currentTarget.style.borderColor = '#C5A059';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.borderColor = 'rgba(197, 160, 89, 0.3)';
                                }}
                            >
                                Ver todos
                                <ChevronRight style={{ width: 18, height: 18 }} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
                            {featuredVenues.map((venue, index) => (
                                <div
                                    key={venue.id}
                                    className="animate-fade-in-up"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <PropertyCard venue={venue} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Main Content Grid - Premium Layout */}
            <section className="py-12 pb-28 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
                        <div>
                            <h2 style={{
                                fontSize: '2rem',
                                fontWeight: 700,
                                color: '#1F1F1F',
                                letterSpacing: '-0.02em',
                                marginBottom: '0.5rem',
                            }}>
                                {selectedCategory === 'all'
                                    ? 'Todos los espacios'
                                    : CATEGORIES.find(c => c.id === selectedCategory)?.label}
                            </h2>
                            <p style={{ color: '#9CA3AF', fontSize: '1rem' }}>
                                <span style={{ color: '#C5A059', fontWeight: 600 }}>{filteredVenues.length}</span>
                                {' '}espacios disponibles para ti
                            </p>
                        </div>
                        <button
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.625rem',
                                padding: '0.875rem 1.5rem',
                                background: '#FFFFFF',
                                border: '1px solid #E5E7EB',
                                borderRadius: '14px',
                                color: '#4B5563',
                                fontWeight: 500,
                                fontSize: '0.9375rem',
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#C5A059';
                                e.currentTarget.style.color = '#C5A059';
                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(197, 160, 89, 0.12)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#E5E7EB';
                                e.currentTarget.style.color = '#4B5563';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                            }}
                        >
                            <Filter style={{ width: 18, height: 18 }} />
                            Filtros avanzados
                        </button>
                    </div>

                    {/* Loading State - Elegant */}
                    {isLoading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    style={{
                                        background: '#FFFFFF',
                                        borderRadius: '24px',
                                        overflow: 'hidden',
                                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                                    }}
                                >
                                    <div style={{ aspectRatio: '4/3', background: 'linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)', backgroundSize: '200% 100%' }} className="animate-shimmer" />
                                    <div style={{ padding: '1.25rem' }}>
                                        <div style={{ height: '1.25rem', background: '#F3F4F6', borderRadius: '8px', width: '70%', marginBottom: '0.75rem' }} />
                                        <div style={{ height: '1rem', background: '#F9FAFB', borderRadius: '6px', width: '50%', marginBottom: '1rem' }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid #F3F4F6' }}>
                                            <div style={{ height: '0.875rem', background: '#F9FAFB', borderRadius: '4px', width: '30%' }} />
                                            <div style={{ height: '1.25rem', background: 'linear-gradient(90deg, rgba(197,160,89,0.1) 0%, rgba(232,200,114,0.1) 100%)', borderRadius: '6px', width: '35%' }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty State - Elegant */}
                    {!isLoading && filteredVenues.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '5rem',
                                height: '5rem',
                                background: 'linear-gradient(135deg, rgba(197, 160, 89, 0.1) 0%, rgba(232, 200, 114, 0.05) 100%)',
                                borderRadius: '50%',
                                marginBottom: '1.5rem',
                            }}>
                                <Search style={{ width: '2.5rem', height: '2.5rem', color: '#C5A059' }} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1F1F1F', marginBottom: '0.75rem' }}>
                                No encontramos espacios
                            </h3>
                            <p style={{ color: '#6B7280', maxWidth: '28rem', margin: '0 auto', lineHeight: 1.6 }}>
                                Prueba cambiando los filtros o la búsqueda para encontrar el espacio perfecto para tu evento.
                            </p>
                        </div>
                    )}

                    {/* Venues Grid */}
                    {!isLoading && filteredVenues.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
                            {filteredVenues.map((venue, index) => (
                                <div
                                    key={venue.id}
                                    className="animate-fade-in-up"
                                    style={{ animationDelay: `${(index % 8) * 60}ms` }}
                                >
                                    <PropertyCard venue={venue} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default ClientDashboardPage;
