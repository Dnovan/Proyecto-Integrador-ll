/**
 * @fileoverview Página para Editar Local Existente
 * @description Formulario para actualizar información de un local del proveedor
 * 
 * @iso25010
 * - Usabilidad: Precarga de datos existentes con edición inline
 * - Seguridad: Verificación de propiedad antes de editar
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Building2,
    MapPin,
    DollarSign,
    Image as ImageIcon,
    Check,
    ChevronLeft,
    Save,
    Loader2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGlobalNotification } from '../../context/NotificationContext';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import { Badge } from '../../components/atoms/Badge';
import { db } from '../../lib/supabase';
import type { Database } from '../../lib/supabase';

type Venue = Database['public']['Tables']['venues']['Row'];
type VenueUpdate = Database['public']['Tables']['venues']['Update'];

// Categorías disponibles
const CATEGORIES = [
    { value: 'SALON_EVENTOS', label: 'Salón de Eventos', icon: '🎉' },
    { value: 'JARDIN', label: 'Jardín', icon: '🌳' },
    { value: 'TERRAZA', label: 'Terraza', icon: '🌆' },
    { value: 'HACIENDA', label: 'Hacienda', icon: '🏛️' },
    { value: 'BODEGA', label: 'Bodega (Industrial)', icon: '🏭' },
    { value: 'RESTAURANTE', label: 'Restaurante', icon: '🍽️' },
    { value: 'HOTEL', label: 'Hotel', icon: '🏨' },
    { value: 'FINCA', label: 'Finca', icon: '🏡' },
    { value: 'ROOFTOP', label: 'Rooftop', icon: '🌃' },
];

// Zonas de Guadalajara
const ZONES = [
    'Centro', 'Zapopan', 'Tlaquepaque', 'Tonalá', 'Tlajomulco',
    'Chapala', 'Colonia Americana', 'Providencia', 'Andares', 'Valle Real',
];

// Amenidades disponibles
const AMENITIES = [
    { value: 'estacionamiento', label: 'Estacionamiento' },
    { value: 'wifi', label: 'WiFi' },
    { value: 'aire_acondicionado', label: 'Aire Acondicionado' },
    { value: 'cocina', label: 'Cocina' },
    { value: 'bar', label: 'Bar' },
    { value: 'pista_baile', label: 'Pista de Baile' },
    { value: 'sonido', label: 'Sistema de Sonido' },
    { value: 'iluminacion', label: 'Iluminación Profesional' },
    { value: 'jardin', label: 'Área de Jardín' },
    { value: 'alberca', label: 'Alberca' },
    { value: 'mobiliario', label: 'Mobiliario Incluido' },
    { value: 'servicio_catering', label: 'Servicio de Catering' },
];

// Métodos de pago
const PAYMENT_METHODS = [
    { value: 'TRANSFERENCIA', label: 'Transferencia Bancaria' },
    { value: 'EFECTIVO', label: 'Efectivo' },
    { value: 'TARJETA', label: 'Tarjeta de Crédito/Débito' },
];

/**
 * Página para editar un local existente
 */
export const EditVenuePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showSuccess, showError } = useGlobalNotification();

    const [venue, setVenue] = useState<Venue | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Estado del formulario
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        address: '',
        zone: '',
        price: '',
        pricePerPerson: '',
        minCapacity: '',
        maxCapacity: '',
        imageUrls: '',
        amenities: [] as string[],
        paymentMethods: [] as string[],
        rules: '',
    });

    // Cargar datos del local
    useEffect(() => {
        const loadVenue = async () => {
            if (!id) return;

            try {
                setIsLoading(true);
                const { data, error } = await db.venues.getById(id);

                if (error) throw error;
                if (!data) throw new Error('Local no encontrado');

                // Verificar propiedad
                if (data.provider_id !== user?.id) {
                    showError('No tienes permiso para editar este local', 'Acceso denegado');
                    navigate('/proveedor/locales');
                    return;
                }

                setVenue(data);
                setFormData({
                    name: data.name,
                    description: data.description || '',
                    category: data.category,
                    address: data.address,
                    zone: data.zone,
                    price: String(data.price),
                    pricePerPerson: data.price_per_person ? String(data.price_per_person) : '',
                    minCapacity: String(data.min_capacity),
                    maxCapacity: String(data.max_capacity),
                    imageUrls: data.images?.join(', ') || '',
                    amenities: data.amenities || [],
                    paymentMethods: data.payment_methods || [],
                    rules: data.rules?.join('\n') || '',
                });
            } catch (error) {
                console.error('Error loading venue:', error);
                showError('No se pudo cargar la información del local', 'Error');
                navigate('/proveedor/locales');
            } finally {
                setIsLoading(false);
            }
        };

        loadVenue();
    }, [id, user?.id, showError, navigate]);

    // Manejar cambios en inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Manejar checkboxes
    const handleCheckboxChange = (field: 'amenities' | 'paymentMethods', value: string) => {
        setFormData(prev => {
            const currentValues = prev[field];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(v => v !== value)
                : [...currentValues, value];
            return { ...prev, [field]: newValues };
        });
    };

    // Validar formulario
    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
        if (!formData.category) newErrors.category = 'Selecciona una categoría';
        if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
        if (!formData.address.trim()) newErrors.address = 'La dirección es requerida';
        if (!formData.zone) newErrors.zone = 'Selecciona una zona';
        if (!formData.price) newErrors.price = 'El precio es requerido';
        if (!formData.maxCapacity) newErrors.maxCapacity = 'La capacidad máxima es requerida';
        if (formData.paymentMethods.length === 0) {
            newErrors.paymentMethods = 'Selecciona al menos un método de pago';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Enviar formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate() || !id) return;

        try {
            setIsSubmitting(true);

            const imageUrls = formData.imageUrls
                .split(',')
                .map(url => url.trim())
                .filter(url => url.length > 0);

            const rules = formData.rules
                .split('\n')
                .map(rule => rule.trim())
                .filter(rule => rule.length > 0);

            const updateData: VenueUpdate = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                category: formData.category,
                address: formData.address.trim(),
                zone: formData.zone,
                price: Number(formData.price),
                price_per_person: formData.pricePerPerson ? Number(formData.pricePerPerson) : null,
                min_capacity: Number(formData.minCapacity),
                max_capacity: Number(formData.maxCapacity),
                images: imageUrls,
                amenities: formData.amenities,
                payment_methods: formData.paymentMethods,
                rules: rules,
            };

            const { error } = await db.venues.update(id, updateData);

            if (error) throw error;

            showSuccess('Los cambios han sido guardados', 'Local actualizado');
            navigate('/proveedor/locales');
        } catch (error) {
            console.error('Error updating venue:', error);
            showError('No se pudieron guardar los cambios', 'Error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Obtener badge de status
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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-bg-primary flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-neon animate-spin mx-auto mb-4" />
                    <p className="text-text-muted">Cargando información del local...</p>
                </div>
            </div>
        );
    }

    if (!venue) {
        return null;
    }

    const statusBadge = getStatusBadge(venue.status);

    return (
        <div className="min-h-screen bg-bg-primary py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/proveedor/locales')}
                        className="flex items-center gap-2 text-text-muted hover:text-neon transition-colors mb-4"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Volver a mis locales
                    </button>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-text-primary">Editar Local</h1>
                            <p className="text-text-muted mt-1">{venue.name}</p>
                        </div>
                        <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* Información Básica */}
                        <Card variant="glass" className="border border-neon/20">
                            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-neon" />
                                Información Básica
                            </h2>

                            <div className="space-y-4">
                                <div className="auth-input-group">
                                    <label className="auth-input-label">Nombre del Local *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`auth-input !pl-4 ${errors.name ? 'auth-input--error' : ''}`}
                                    />
                                    {errors.name && <p className="auth-input-error">{errors.name}</p>}
                                </div>

                                <div className="auth-input-group">
                                    <label className="auth-input-label">Categoría *</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className={`auth-input !pl-4 ${errors.category ? 'auth-input--error' : ''}`}
                                    >
                                        <option value="">Selecciona una categoría</option>
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat.value} value={cat.value}>
                                                {cat.icon} {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && <p className="auth-input-error">{errors.category}</p>}
                                </div>

                                <div className="auth-input-group">
                                    <label className="auth-input-label">Descripción *</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={4}
                                        className={`auth-input !pl-4 resize-none ${errors.description ? 'auth-input--error' : ''}`}
                                    />
                                    {errors.description && <p className="auth-input-error">{errors.description}</p>}
                                </div>
                            </div>
                        </Card>

                        {/* Ubicación */}
                        <Card variant="glass" className="border border-neon/20">
                            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-neon" />
                                Ubicación
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="auth-input-group md:col-span-2">
                                    <label className="auth-input-label">Dirección Completa *</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className={`auth-input !pl-4 ${errors.address ? 'auth-input--error' : ''}`}
                                    />
                                    {errors.address && <p className="auth-input-error">{errors.address}</p>}
                                </div>

                                <div className="auth-input-group">
                                    <label className="auth-input-label">Zona *</label>
                                    <select
                                        name="zone"
                                        value={formData.zone}
                                        onChange={handleChange}
                                        className={`auth-input !pl-4 ${errors.zone ? 'auth-input--error' : ''}`}
                                    >
                                        <option value="">Selecciona una zona</option>
                                        {ZONES.map((zone) => (
                                            <option key={zone} value={zone}>{zone}</option>
                                        ))}
                                    </select>
                                    {errors.zone && <p className="auth-input-error">{errors.zone}</p>}
                                </div>
                            </div>
                        </Card>

                        {/* Precios y Capacidad */}
                        <Card variant="glass" className="border border-neon/20">
                            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-neon" />
                                Precios y Capacidad
                            </h2>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="auth-input-group">
                                    <label className="auth-input-label">Precio por Evento *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        min="1000"
                                        className={`auth-input !pl-4 ${errors.price ? 'auth-input--error' : ''}`}
                                    />
                                    {errors.price && <p className="auth-input-error">{errors.price}</p>}
                                </div>

                                <div className="auth-input-group">
                                    <label className="auth-input-label">Precio/Persona</label>
                                    <input
                                        type="number"
                                        name="pricePerPerson"
                                        value={formData.pricePerPerson}
                                        onChange={handleChange}
                                        min="0"
                                        className="auth-input !pl-4"
                                    />
                                </div>

                                <div className="auth-input-group">
                                    <label className="auth-input-label">Cap. Mínima</label>
                                    <input
                                        type="number"
                                        name="minCapacity"
                                        value={formData.minCapacity}
                                        onChange={handleChange}
                                        min="1"
                                        className="auth-input !pl-4"
                                    />
                                </div>

                                <div className="auth-input-group">
                                    <label className="auth-input-label">Cap. Máxima *</label>
                                    <input
                                        type="number"
                                        name="maxCapacity"
                                        value={formData.maxCapacity}
                                        onChange={handleChange}
                                        min="1"
                                        className={`auth-input !pl-4 ${errors.maxCapacity ? 'auth-input--error' : ''}`}
                                    />
                                    {errors.maxCapacity && <p className="auth-input-error">{errors.maxCapacity}</p>}
                                </div>
                            </div>
                        </Card>

                        {/* Amenidades */}
                        <Card variant="glass" className="border border-neon/20">
                            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                                <Check className="w-5 h-5 text-neon" />
                                Amenidades
                            </h2>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {AMENITIES.map((amenity) => (
                                    <label
                                        key={amenity.value}
                                        className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${formData.amenities.includes(amenity.value)
                                            ? 'border-neon bg-neon/10 text-neon'
                                            : 'border-neon/20 hover:border-neon/40 text-text-secondary'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.amenities.includes(amenity.value)}
                                            onChange={() => handleCheckboxChange('amenities', amenity.value)}
                                            className="sr-only"
                                        />
                                        <Check
                                            className={`w-4 h-4 flex-shrink-0 ${formData.amenities.includes(amenity.value) ? 'opacity-100' : 'opacity-0'
                                                }`}
                                        />
                                        <span className="text-sm">{amenity.label}</span>
                                    </label>
                                ))}
                            </div>
                        </Card>

                        {/* Métodos de Pago */}
                        <Card variant="glass" className="border border-neon/20">
                            <h2 className="text-lg font-semibold text-text-primary mb-4">
                                Métodos de Pago *
                            </h2>

                            <div className="flex flex-wrap gap-3">
                                {PAYMENT_METHODS.map((method) => (
                                    <label
                                        key={method.value}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer transition-all ${formData.paymentMethods.includes(method.value)
                                            ? 'border-neon bg-neon text-white'
                                            : 'border-neon/20 hover:border-neon/40 text-text-secondary'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.paymentMethods.includes(method.value)}
                                            onChange={() => handleCheckboxChange('paymentMethods', method.value)}
                                            className="sr-only"
                                        />
                                        <span className="text-sm font-medium">{method.label}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.paymentMethods && (
                                <p className="auth-input-error mt-2">{errors.paymentMethods}</p>
                            )}
                        </Card>

                        {/* Imágenes */}
                        <Card variant="glass" className="border border-neon/20">
                            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-neon" />
                                Imágenes
                            </h2>

                            <div className="auth-input-group">
                                <label className="auth-input-label">URLs de Imágenes (separadas por coma)</label>
                                <textarea
                                    name="imageUrls"
                                    value={formData.imageUrls}
                                    onChange={handleChange}
                                    rows={3}
                                    className="auth-input !pl-4 resize-none"
                                    placeholder="https://ejemplo.com/imagen1.jpg, https://ejemplo.com/imagen2.jpg"
                                />
                            </div>

                            {formData.imageUrls && (
                                <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                                    {formData.imageUrls.split(',').slice(0, 8).map((url, index) => {
                                        const trimmedUrl = url.trim();
                                        if (!trimmedUrl) return null;
                                        return (
                                            <div key={index} className="aspect-video rounded-lg overflow-hidden bg-bg-secondary">
                                                <img
                                                    src={trimmedUrl}
                                                    alt={`Imagen ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Error';
                                                    }}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </Card>

                        {/* Reglas */}
                        <Card variant="glass" className="border border-neon/20">
                            <h2 className="text-lg font-semibold text-text-primary mb-4">
                                Reglas del Local
                            </h2>

                            <div className="auth-input-group">
                                <textarea
                                    name="rules"
                                    value={formData.rules}
                                    onChange={handleChange}
                                    rows={4}
                                    className="auth-input !pl-4 resize-none"
                                    placeholder="Una regla por línea..."
                                />
                            </div>
                        </Card>

                        {/* Submit */}
                        <div className="flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/proveedor/locales')}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                isLoading={isSubmitting}
                                leftIcon={<Save className="w-5 h-5" />}
                            >
                                Guardar Cambios
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditVenuePage;
