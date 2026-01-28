/**
 * @fileoverview Dashboard del Cliente - EventSpace
 * @description Vista principal para usuarios autenticados.
 * Muestra saludo personalizado, filtros por categoría y lista de locales.
 * Reemplaza a la Landing Page para usuarios logueados.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PropertyCard } from '../../components/organisms/PropertyCard';
import { Search, Filter, Warehouse, Heart, Building2, Trees } from 'lucide-react';
import type { Venue } from '../../types';

import * as api from '../../services/mockApi';

const CATEGORIES = [
    { id: 'all', label: 'Todos', icon: Search },
    { id: 'SALON_EVENTOS', label: 'Salones', icon: Warehouse },
    { id: 'JARDIN', label: 'Jardines', icon: Trees },
    { id: 'TERRAZA', label: 'Terrazas', icon: Building2 },
    { id: 'HACIENDA', label: 'Haciendas', icon: Building2 },
    { id: 'BODA', label: 'Bodas', icon: Heart }, // Note: VenueCategory doesn't have BODA, this is logical category
];

export const ClientDashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [venues, setVenues] = useState<Venue[]>([]);
    const [_isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadVenues = async () => {
            try {
                const response = await api.getVenues(undefined, 1, 100); // Fetch all for client-side filtering simplicity
                setVenues(response.data);
            } catch (error) {
                console.error('Error loading venues:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadVenues();
    }, []);

    // Obtener primer nombre para saludo
    const firstName = user?.name?.split(' ')[0] || 'Cliente';

    // Filtrar locales
    const filteredVenues = venues.filter(venue => {
        if (selectedCategory === 'all') return true;
        // BODA logic needs handling if category is strictly VenueCategory or if we use tags
        if (selectedCategory === 'BODA') {
            // For now assume venues with category 'SALON_EVENTOS' or 'HACIENDA' are suitable for weddings or check description
            return ['SALON_EVENTOS', 'HACIENDA', 'JARDIN'].includes(venue.category);
        }
        return venue.category === selectedCategory;
    });

    return (
        <div className="min-h-screen bg-neutral-50 pb-20 pt-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header Section */}
                <header className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight">
                        Hola, <span className="text-gold-500">{firstName}</span> 👋
                    </h1>
                    <p className="text-lg text-neutral-500 max-w-2xl">
                        ¿Qué tipo de evento estás planeando hoy? Descubre los mejores espacios exclusivos para ti.
                    </p>
                </header>

                {/* Categories Scroll */}
                <div className="relative group">
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                        {CATEGORIES.map((cat) => {
                            const Icon = cat.icon;
                            const isActive = selectedCategory === cat.id;

                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`
                                        flex items-center gap-2 px-6 py-3 rounded-full border transition-all duration-300 whitespace-nowrap
                                        ${isActive
                                            ? 'bg-neutral-900 border-neutral-900 text-white shadow-lg transform scale-105'
                                            : 'bg-white border-neutral-200 text-neutral-600 hover:border-gold-400 hover:text-gold-600'
                                        }
                                    `}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : ''}`} />
                                    <span className="font-medium">{cat.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Grid */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-neutral-900">
                            {selectedCategory === 'all' ? 'Recomendados para ti' : CATEGORIES.find(c => c.id === selectedCategory)?.label}
                        </h2>
                        <button className="flex items-center gap-2 text-neutral-500 hover:text-gold-600 transition-colors">
                            <Filter className="w-4 h-4" />
                            <span className="text-sm font-medium">Filtros</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredVenues.map((venue) => (
                            <div key={venue.id} className="animate-fade-in-up">
                                <PropertyCard venue={venue} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientDashboardPage;
