/**
 * @fileoverview Página para Crear/Publicar Nuevo Local
 * @description Formulario completo para que proveedores publiquen sus espacios
 * 
 * @iso25010
 * - Usabilidad: Formulario por pasos con validación visual
 * - Funcionalidad: Todos los campos necesarios para un local
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Building2,
    MapPin,
    DollarSign,
    Users,
    Image as ImageIcon,
    Check,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    Sparkles,
    Save,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGlobalNotification } from '../../context/NotificationContext';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import { db } from '../../lib/supabase';
import type { Database } from '../../lib/supabase';

type VenueInsert = Database['public']['Tables']['venues']['Insert'];

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
    'Centro',
    'Zapopan',
    'Tlaquepaque',
    'Tonalá',
    'Tlajomulco',
    'Chapala',
    'Colonia Americana',
    'Providencia',
    'Andares',
    'Valle Real',
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
 * Página para crear un nuevo local
 */
export const CreateVenuePage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showSuccess, showError } = useGlobalNotification();

    // Estado del formulario
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        address: '',
        zone: '',
        price: '',
        pricePerPerson: '',
        minCapacity: '10',
        maxCapacity: '',
        images: [] as string[],
        imageUrls: '', // URLs separadas por comas
        amenities: [] as string[],
        paymentMethods: [] as string[],
        rules: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Pasos del formulario
    const steps = [
        { number: 1, title: 'Información Básica', icon: Building2 },
        { number: 2, title: 'Ubicación y Precio', icon: MapPin },
        { number: 3, title: 'Capacidad y Amenidades', icon: Users },
        { number: 4, title: 'Imágenes y Finalizar', icon: ImageIcon },
    ];

    // Manejar cambios en inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Manejar checkboxes (amenidades, pagos)
    const handleCheckboxChange = (field: 'amenities' | 'paymentMethods', value: string) => {
        setFormData(prev => {
            const currentValues = prev[field];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(v => v !== value)
                : [...currentValues, value];
            return { ...prev, [field]: newValues };
        });
    };

    // Validar paso actual
    const validateStep = (step: number): boolean => {
        const newErrors: Record<string, string> = {};

        switch (step) {
            case 1:
                if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
                if (!formData.category) newErrors.category = 'Selecciona una categoría';
                if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
                else if (formData.description.length < 50) newErrors.description = 'La descripción debe tener al menos 50 caracteres';
                break;
            case 2:
                if (!formData.address.trim()) newErrors.address = 'La dirección es requerida';
                if (!formData.zone) newErrors.zone = 'Selecciona una zona';
                if (!formData.price) newErrors.price = 'El precio es requerido';
                else if (Number(formData.price) < 1000) newErrors.price = 'El precio mínimo es $1,000';
                break;
            case 3:
                if (!formData.maxCapacity) newErrors.maxCapacity = 'La capacidad máxima es requerida';
                else if (Number(formData.maxCapacity) < Number(formData.minCapacity)) {
                    newErrors.maxCapacity = 'Debe ser mayor a la capacidad mínima';
                }
                if (formData.paymentMethods.length === 0) {
                    newErrors.paymentMethods = 'Selecciona al menos un método de pago';
                }
                break;
            case 4:
                // Las imágenes son opcionales pero recomendadas
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Navegar entre pasos
    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 4));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    // Enviar formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateStep(currentStep)) return;
        if (!user?.id) {
            showError('Debes iniciar sesión para publicar un local', 'Error');
            return;
        }

        try {
            setIsSubmitting(true);

            // Procesar URLs de imágenes
            const imageUrls = formData.imageUrls
                .split(',')
                .map(url => url.trim())
                .filter(url => url.length > 0);

            // Procesar reglas
            const rules = formData.rules
                .split('\n')
                .map(rule => rule.trim())
                .filter(rule => rule.length > 0);

            const venueData: VenueInsert = {
                provider_id: user.id,
                name: formData.name.trim(),
                description: formData.description.trim(),
                category: formData.category,
                address: formData.address.trim(),
                zone: formData.zone,
                latitude: null,
                longitude: null,
                price: Number(formData.price),
                price_per_person: formData.pricePerPerson ? Number(formData.pricePerPerson) : null,
                min_capacity: Number(formData.minCapacity),
                max_capacity: Number(formData.maxCapacity),
                images: imageUrls,
                amenities: formData.amenities,
                payment_methods: formData.paymentMethods,
                rules: rules,
                status: 'PENDING', // Los nuevos locales inician como pendientes
            };

            const { error } = await db.venues.create(venueData);

            if (error) throw error;

            showSuccess(
                'Tu local ha sido publicado y está pendiente de aprobación',
                '¡Local creado!'
            );
            navigate('/proveedor/locales');
        } catch (error) {
            console.error('Error creating venue:', error);
            showError('No se pudo crear el local. Intenta de nuevo.', 'Error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-primary py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/proveedor/locales')}
                        className="flex items-center gap-2 text-text-muted hover:text-neon transition-colors mb-4"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Volver a mis locales
                    </button>
                    <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
                        <Sparkles className="w-8 h-8 text-neon" />
                        Publicar Nuevo Local
                    </h1>
                    <p className="text-text-muted mt-2">
                        Completa la información de tu espacio para comenzar a recibir reservaciones
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = currentStep === step.number;
                            const isCompleted = currentStep > step.number;

                            return (
                                <React.Fragment key={step.number}>
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted
                                                ? 'bg-neon text-white'
                                                : isActive
                                                    ? 'bg-neon/20 text-neon border-2 border-neon'
                                                    : 'bg-bg-secondary text-text-muted'
                                                }`}
                                        >
                                            {isCompleted ? (
                                                <Check className="w-6 h-6" />
                                            ) : (
                                                <Icon className="w-5 h-5" />
                                            )}
                                        </div>
                                        <span
                                            className={`mt-2 text-xs font-medium ${isActive ? 'text-neon' : 'text-text-muted'
                                                }`}
                                        >
                                            {step.title}
                                        </span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div
                                            className={`flex-1 h-0.5 mx-2 ${currentStep > step.number ? 'bg-neon' : 'bg-bg-secondary'
                                                }`}
                                        />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>

                {/* Form Card */}
                <Card variant="glass" className="border border-neon/20">
                    <form onSubmit={handleSubmit}>
                        {/* Step 1: Información Básica */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-text-primary mb-6">
                                    Información Básica
                                </h2>

                                {/* Nombre */}
                                <div className="auth-input-group">
                                    <label className="auth-input-label">Nombre del Local *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Ej: Jardín Las Rosas"
                                        className={`auth-input !pl-4 ${errors.name ? 'auth-input--error' : ''}`}
                                    />
                                    {errors.name && (
                                        <p className="auth-input-error">{errors.name}</p>
                                    )}
                                </div>

                                {/* Categoría */}
                                <div className="auth-input-group">
                                    <label className="auth-input-label">Categoría *</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {CATEGORIES.map((cat) => (
                                            <button
                                                key={cat.value}
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, category: cat.value }));
                                                    if (errors.category) setErrors(prev => ({ ...prev, category: '' }));
                                                }}
                                                className={`p-3 rounded-xl border-2 transition-all text-center ${formData.category === cat.value
                                                    ? 'border-neon bg-neon/10 text-neon'
                                                    : 'border-neon/20 hover:border-neon/40 text-text-secondary'
                                                    }`}
                                            >
                                                <span className="text-2xl block mb-1">{cat.icon}</span>
                                                <span className="text-xs font-medium">{cat.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                    {errors.category && (
                                        <p className="auth-input-error mt-2">{errors.category}</p>
                                    )}
                                </div>

                                {/* Descripción */}
                                <div className="auth-input-group">
                                    <label className="auth-input-label">Descripción *</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Describe tu local: ambiente, características especiales, qué lo hace único..."
                                        rows={4}
                                        className={`auth-input !pl-4 resize-none ${errors.description ? 'auth-input--error' : ''}`}
                                    />
                                    <div className="flex justify-between mt-1">
                                        {errors.description ? (
                                            <p className="auth-input-error">{errors.description}</p>
                                        ) : (
                                            <span className="text-xs text-text-muted">Mínimo 50 caracteres</span>
                                        )}
                                        <span className="text-xs text-text-muted">
                                            {formData.description.length}/500
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Ubicación y Precio */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-text-primary mb-6">
                                    Ubicación y Precio
                                </h2>

                                {/* Dirección */}
                                <div className="auth-input-group">
                                    <label className="auth-input-label">Dirección Completa *</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Ej: Av. Vallarta 1234, Col. Americana"
                                        className={`auth-input !pl-4 ${errors.address ? 'auth-input--error' : ''}`}
                                    />
                                    {errors.address && (
                                        <p className="auth-input-error">{errors.address}</p>
                                    )}
                                </div>

                                {/* Zona */}
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
                                    {errors.zone && (
                                        <p className="auth-input-error">{errors.zone}</p>
                                    )}
                                </div>

                                {/* Precios */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="auth-input-group">
                                        <label className="auth-input-label">Precio por Evento *</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                            <input
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                placeholder="15000"
                                                min="1000"
                                                className={`auth-input !pl-10 ${errors.price ? 'auth-input--error' : ''}`}
                                            />
                                        </div>
                                        {errors.price && (
                                            <p className="auth-input-error">{errors.price}</p>
                                        )}
                                    </div>

                                    <div className="auth-input-group">
                                        <label className="auth-input-label">
                                            Precio por Persona
                                            <span className="auth-input-label--optional ml-1">(Opcional)</span>
                                        </label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                            <input
                                                type="number"
                                                name="pricePerPerson"
                                                value={formData.pricePerPerson}
                                                onChange={handleChange}
                                                placeholder="150"
                                                min="0"
                                                className="auth-input !pl-10"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Capacidad y Amenidades */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-text-primary mb-6">
                                    Capacidad y Servicios
                                </h2>

                                {/* Capacidad */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="auth-input-group">
                                        <label className="auth-input-label">Capacidad Mínima</label>
                                        <div className="relative">
                                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                            <input
                                                type="number"
                                                name="minCapacity"
                                                value={formData.minCapacity}
                                                onChange={handleChange}
                                                min="1"
                                                className="auth-input !pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div className="auth-input-group">
                                        <label className="auth-input-label">Capacidad Máxima *</label>
                                        <div className="relative">
                                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                            <input
                                                type="number"
                                                name="maxCapacity"
                                                value={formData.maxCapacity}
                                                onChange={handleChange}
                                                placeholder="200"
                                                min="1"
                                                className={`auth-input !pl-10 ${errors.maxCapacity ? 'auth-input--error' : ''}`}
                                            />
                                        </div>
                                        {errors.maxCapacity && (
                                            <p className="auth-input-error">{errors.maxCapacity}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Amenidades */}
                                <div className="auth-input-group">
                                    <label className="auth-input-label">Amenidades</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                                                    className={`w-4 h-4 ${formData.amenities.includes(amenity.value)
                                                        ? 'opacity-100'
                                                        : 'opacity-0'
                                                        }`}
                                                />
                                                <span className="text-sm">{amenity.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Métodos de Pago */}
                                <div className="auth-input-group">
                                    <label className="auth-input-label">Métodos de Pago Aceptados *</label>
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
                                </div>
                            </div>
                        )}

                        {/* Step 4: Imágenes y Finalizar */}
                        {currentStep === 4 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-text-primary mb-6">
                                    Imágenes y Reglas
                                </h2>

                                {/* URLs de Imágenes */}
                                <div className="auth-input-group">
                                    <label className="auth-input-label">
                                        URLs de Imágenes
                                        <span className="auth-input-label--optional ml-1">(separadas por coma)</span>
                                    </label>
                                    <textarea
                                        name="imageUrls"
                                        value={formData.imageUrls}
                                        onChange={handleChange}
                                        placeholder="https://ejemplo.com/imagen1.jpg, https://ejemplo.com/imagen2.jpg"
                                        rows={3}
                                        className="auth-input !pl-4 resize-none"
                                    />
                                    <p className="text-xs text-text-muted mt-1">
                                        Puedes usar URLs de Unsplash, Cloudinary, o cualquier servicio de imágenes
                                    </p>
                                </div>

                                {/* Preview de imágenes */}
                                {formData.imageUrls && (
                                    <div className="grid grid-cols-3 gap-3">
                                        {formData.imageUrls.split(',').slice(0, 6).map((url, index) => {
                                            const trimmedUrl = url.trim();
                                            if (!trimmedUrl) return null;
                                            return (
                                                <div key={index} className="aspect-video rounded-lg overflow-hidden bg-bg-secondary">
                                                    <img
                                                        src={trimmedUrl}
                                                        alt={`Preview ${index + 1}`}
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

                                {/* Reglas */}
                                <div className="auth-input-group">
                                    <label className="auth-input-label">
                                        Reglas del Local
                                        <span className="auth-input-label--optional ml-1">(una por línea)</span>
                                    </label>
                                    <textarea
                                        name="rules"
                                        value={formData.rules}
                                        onChange={handleChange}
                                        placeholder="No fumar en interiores
Horario máximo hasta 2:00 AM
No se permiten mascotas"
                                        rows={4}
                                        className="auth-input !pl-4 resize-none"
                                    />
                                </div>

                                {/* Resumen */}
                                <Card variant="outline" className="bg-neon/5 border-neon/20">
                                    <h3 className="font-semibold text-text-primary mb-3">Resumen</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-text-muted">Nombre:</span>
                                            <p className="font-medium text-text-primary">{formData.name || '-'}</p>
                                        </div>
                                        <div>
                                            <span className="text-text-muted">Categoría:</span>
                                            <p className="font-medium text-text-primary">
                                                {CATEGORIES.find(c => c.value === formData.category)?.label || '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-text-muted">Precio:</span>
                                            <p className="font-medium text-neon">
                                                {formData.price ? `$${Number(formData.price).toLocaleString()}` : '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-text-muted">Capacidad:</span>
                                            <p className="font-medium text-text-primary">
                                                {formData.minCapacity} - {formData.maxCapacity || '-'} personas
                                            </p>
                                        </div>
                                    </div>
                                </Card>

                                {/* Nota */}
                                <div className="flex items-start gap-3 p-4 bg-warning/10 border border-warning/30 rounded-xl">
                                    <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-text-primary">
                                            Tu local será revisado antes de publicarse
                                        </p>
                                        <p className="text-xs text-text-muted mt-1">
                                            Nuestro equipo verificará la información. Recibirás una notificación cuando sea aprobado.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8 pt-6 border-t border-neon/10">
                            {currentStep > 1 ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={prevStep}
                                    leftIcon={<ChevronLeft className="w-5 h-5" />}
                                >
                                    Anterior
                                </Button>
                            ) : (
                                <div />
                            )}

                            {currentStep < 4 ? (
                                <Button
                                    type="button"
                                    variant="primary"
                                    onClick={nextStep}
                                    rightIcon={<ChevronRight className="w-5 h-5" />}
                                >
                                    Siguiente
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    variant="primary"
                                    isLoading={isSubmitting}
                                    leftIcon={<Save className="w-5 h-5" />}
                                >
                                    Publicar Local
                                </Button>
                            )}
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default CreateVenuePage;
