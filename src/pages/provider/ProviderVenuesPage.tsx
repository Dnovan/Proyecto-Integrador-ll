/**
 * @fileoverview Página de Gestión de Locales del Proveedor
 * @description Lista todos los locales del proveedor con acciones CRUD
 * 
 * @iso25010
 * - Usabilidad: Vista de tarjetas con acciones claras
 * - Eficiencia: Carga rápida con estados de loading
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Plus,
    Edit3,
    Trash2,
    Eye,
    MapPin,
    Star,
    AlertCircle,
    Building2,
    Search,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGlobalNotification } from '../../context/NotificationContext';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import { Badge } from '../../components/atoms/Badge';
import { db } from '../../lib/supabase';
import type { Database } from '../../lib/supabase';

type Venue = Database['public']['Tables']['venues']['Row'];

/**
 * Página de listado de locales del proveedor
 */
export const ProviderVenuesPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showSuccess, showError } = useGlobalNotification();

    const [venues, setVenues] = useState<Venue[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [venueToDelete, setVenueToDelete] = useState<Venue | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Cargar locales del proveedor
    useEffect(() => {
        const loadVenues = async () => {
            if (!user?.id) return;

            try {
                setIsLoading(true);
                const { data, error } = await db.venues.getByProvider(user.id);

                if (error) throw error;
                setVenues(data || []);
            } catch (error) {
                console.error('Error loading venues:', error);
                showError('Error al cargar tus locales', 'Error de carga');
            } finally {
                setIsLoading(false);
            }
        };

        loadVenues();
    }, [user?.id, showError]);

    // Filtrar locales por búsqueda
    const filteredVenues = venues.filter(venue =>
        venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Manejar eliminación
    const handleDeleteClick = (venue: Venue) => {
        setVenueToDelete(venue);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!venueToDelete) return;

        try {
            setIsDeleting(true);
            const { error } = await db.venues.delete(venueToDelete.id);

            if (error) throw error;

            setVenues(prev => prev.filter(v => v.id !== venueToDelete.id));
            showSuccess(`"${venueToDelete.name}" ha sido eliminado`, 'Local eliminado');
            setDeleteModalOpen(false);
            setVenueToDelete(null);
        } catch (error) {
            console.error('Error deleting venue:', error);
            showError('No se pudo eliminar el local', 'Error');
        } finally {
            setIsDeleting(false);
        }
    };

    // Obtener color del status
    const getStatusBadge = (status: Venue['status']) => {
        const variants: Record<typeof status, { variant: 'success' | 'warning' | 'error' | 'info'; label: string }> = {
            ACTIVE: { variant: 'success', label: 'Activo' },
            FEATURED: { variant: 'info', label: 'Destacado' },
            PENDING: { variant: 'warning', label: 'Pendiente' },
            INACTIVE: { variant: 'error', label: 'Inactivo' },
            BANNED: { variant: 'error', label: 'Suspendido' },
        };
        return variants[status] || { variant: 'info', label: status };
    };

    // Formatear precio
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            maximumFractionDigits: 0,
        }).format(price);
    };

    // Obtener categoría legible
    const getCategoryLabel = (category: string) => {
        const labels: Record<string, string> = {
            'SALON_EVENTOS': 'Salón de Eventos',
            'JARDIN': 'Jardín',
            'TERRAZA': 'Terraza',
            'HACIENDA': 'Hacienda',
            'BODEGA': 'Bodega',
            'RESTAURANTE': 'Restaurante',
            'HOTEL': 'Hotel',
            'FINCA': 'Finca',
            'ROOFTOP': 'Rooftop',
        };
        return labels[category] || category;
    };

    return (
        <div className="min-h-screen bg-bg-primary py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">Mis Locales</h1>
                        <p className="text-text-muted mt-1">
                            Gestiona tus espacios y mantén tu información actualizada
                        </p>
                    </div>
                    <Link to="/proveedor/publicar">
                        <Button variant="primary" leftIcon={<Plus className="w-5 h-5" />}>
                            Publicar Local
                        </Button>
                    </Link>
                </div>

                {/* Barra de búsqueda */}
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o dirección..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-bg-card border border-neon/20 rounded-xl 
                                     text-text-primary placeholder:text-text-muted
                                     focus:outline-none focus:border-neon focus:ring-2 focus:ring-neon/20
                                     transition-all duration-200"
                        />
                    </div>
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <Card key={i} variant="glass" className="animate-pulse">
                                <div className="h-48 bg-bg-secondary rounded-lg mb-4" />
                                <div className="h-6 bg-bg-secondary rounded w-3/4 mb-2" />
                                <div className="h-4 bg-bg-secondary rounded w-1/2" />
                            </Card>
                        ))}
                    </div>
                ) : filteredVenues.length === 0 ? (
                    /* Empty State */
                    <Card variant="glass" className="text-center py-16">
                        <div className="w-20 h-20 mx-auto mb-6 bg-neon/10 rounded-full flex items-center justify-center">
                            <Building2 className="w-10 h-10 text-neon" />
                        </div>
                        <h3 className="text-xl font-semibold text-text-primary mb-2">
                            {searchTerm ? 'No se encontraron locales' : 'Aún no tienes locales'}
                        </h3>
                        <p className="text-text-muted mb-6 max-w-md mx-auto">
                            {searchTerm
                                ? 'Intenta con otros términos de búsqueda'
                                : 'Publica tu primer local y comienza a recibir reservaciones de clientes'}
                        </p>
                        {!searchTerm && (
                            <Link to="/proveedor/publicar">
                                <Button variant="primary" leftIcon={<Plus className="w-5 h-5" />}>
                                    Publicar mi primer local
                                </Button>
                            </Link>
                        )}
                    </Card>
                ) : (
                    /* Venue Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredVenues.map((venue) => {
                            const statusBadge = getStatusBadge(venue.status);

                            return (
                                <Card
                                    key={venue.id}
                                    variant="glass"
                                    className="overflow-hidden border border-neon/10 hover:border-neon/30 transition-all duration-300"
                                    hoverable
                                >
                                    {/* Image */}
                                    <div className="relative h-48 -mx-6 -mt-6 mb-4">
                                        {venue.images && venue.images[0] ? (
                                            <img
                                                src={venue.images[0]}
                                                alt={venue.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-bg-secondary flex items-center justify-center">
                                                <Building2 className="w-12 h-12 text-text-muted" />
                                            </div>
                                        )}
                                        {/* Status Badge */}
                                        <div className="absolute top-3 left-3">
                                            <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                                        </div>
                                        {/* Actions Menu */}
                                        <div className="absolute top-3 right-3 flex gap-2">
                                            <button
                                                onClick={() => navigate(`/local/${venue.id}`)}
                                                className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                                                title="Ver local"
                                            >
                                                <Eye className="w-4 h-4 text-text-secondary" />
                                            </button>
                                            <button
                                                onClick={() => navigate(`/proveedor/locales/${venue.id}/editar`)}
                                                className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                                                title="Editar local"
                                            >
                                                <Edit3 className="w-4 h-4 text-text-secondary" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(venue)}
                                                className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-error/10 transition-colors"
                                                title="Eliminar local"
                                            >
                                                <Trash2 className="w-4 h-4 text-error" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div>
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-lg font-semibold text-text-primary line-clamp-1">
                                                    {venue.name}
                                                </h3>
                                                <p className="text-sm text-neon font-medium">
                                                    {getCategoryLabel(venue.category)}
                                                </p>
                                            </div>
                                            {venue.rating > 0 && (
                                                <div className="flex items-center gap-1 text-neon">
                                                    <Star className="w-4 h-4 fill-current" />
                                                    <span className="font-semibold">{venue.rating.toFixed(1)}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1 text-text-muted text-sm mb-3">
                                            <MapPin className="w-4 h-4 flex-shrink-0" />
                                            <span className="line-clamp-1">{venue.address}</span>
                                        </div>

                                        {/* Stats */}
                                        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-neon/10">
                                            <div className="text-center">
                                                <p className="text-lg font-bold text-text-primary">
                                                    {venue.views || 0}
                                                </p>
                                                <p className="text-xs text-text-muted">Vistas</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-lg font-bold text-text-primary">
                                                    {venue.max_capacity}
                                                </p>
                                                <p className="text-xs text-text-muted">Capacidad</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-lg font-bold text-neon">
                                                    {formatPrice(venue.price)}
                                                </p>
                                                <p className="text-xs text-text-muted">Precio</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {deleteModalOpen && venueToDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <Card variant="elevated" className="max-w-md w-full">
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-error/10 rounded-full flex items-center justify-center">
                                    <AlertCircle className="w-8 h-8 text-error" />
                                </div>
                                <h3 className="text-xl font-bold text-text-primary mb-2">
                                    ¿Eliminar local?
                                </h3>
                                <p className="text-text-muted mb-6">
                                    Estás a punto de eliminar <strong>"{venueToDelete.name}"</strong>.
                                    Esta acción no se puede deshacer.
                                </p>
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => {
                                            setDeleteModalOpen(false);
                                            setVenueToDelete(null);
                                        }}
                                        disabled={isDeleting}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="primary"
                                        className="flex-1 !bg-error hover:!bg-error/90"
                                        onClick={confirmDelete}
                                        isLoading={isDeleting}
                                    >
                                        Sí, eliminar
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProviderVenuesPage;
