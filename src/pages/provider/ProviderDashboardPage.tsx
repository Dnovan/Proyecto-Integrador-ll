/**
 * @fileoverview Dashboard para proveedores
 * @description Panel principal para que los proveedores gestionen sus locales
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Home, Calendar, Star, TrendingUp, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { Venue } from '../../types';
import { PropertyCard } from '../../components/organisms/PropertyCard'; // Reusing PropertyCard for now but might need a specific one
// import { api } from '../../services/mockApi'; // Or supabase client directly

export const ProviderDashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [venues, setVenues] = useState<Venue[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Mock data for now until we connect to Supabase venues table properly for provider
    useEffect(() => {
        // Simulate fetching provider's venues
        setTimeout(() => {
            setVenues([]); // Start with empty state for new providers
            setIsLoading(false);
        }, 1000);
    }, []);

    const stats = [
        { label: 'Total Visualizaciones', value: '0', icon: <TrendingUp className="w-5 h-5 text-blue-500" />, change: '+0%' },
        { label: 'Reservas Pendientes', value: '0', icon: <Calendar className="w-5 h-5 text-gold-500" />, change: '0' },
        { label: 'Calificación Promedio', value: '0.0', icon: <Star className="w-5 h-5 text-yellow-400" />, change: 'N/A' },
        { label: 'Locales Activos', value: '0', icon: <Home className="w-5 h-5 text-green-500" />, change: '0' },
    ];

    const firstName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Proveedor';

    return (
        <div className="min-h-screen bg-neutral-50 pb-20 pt-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900">
                            Hola, <span className="text-gold-500">{firstName}</span> 👋
                        </h1>
                        <p className="text-neutral-500 mt-1">
                            Gestiona tus propiedades y revisa tus estadísticas.
                        </p>
                    </div>
                    <Link
                        to="/provider/venue/new"
                        className="btn-gold-gradient inline-flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Publicar Nuevo Local
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-neutral-50 rounded-xl">
                                    {stat.icon}
                                </div>
                                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                    {stat.change}
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-neutral-900">{stat.value}</h3>
                            <p className="text-sm text-neutral-500">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Venues Section */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-neutral-900">Mis Propiedades</h2>

                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : venues.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {venues.map((venue) => (
                                <div key={venue.id} className="relative group">
                                    <PropertyCard venue={venue} />
                                    {/* Action Overlays */}
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 bg-white/90 backdrop-blur rounded-full shadow hover:bg-gold-50 text-gold-600">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 bg-white/90 backdrop-blur rounded-full shadow hover:bg-red-50 text-red-500">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-dashed border-neutral-300 p-12 text-center">
                            <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Home className="w-8 h-8 text-neutral-400" />
                            </div>
                            <h3 className="text-lg font-medium text-neutral-900 mb-2">No tienes propiedades publicadas</h3>
                            <p className="text-neutral-500 mb-6 max-w-sm mx-auto">
                                Comienza a generar ingresos publicando tu primer espacio para eventos.
                            </p>
                            <Link
                                to="/provider/venue/new"
                                className="text-gold-600 font-semibold hover:text-gold-700 hover:underline"
                            >
                                Publicar mi primer local &rarr;
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
