/**
 * @fileoverview Componente PropertyCard - Organismo
 * @description Tarjeta de presentación de un local/venue
 * Diseño Premium Blanco y Dorado
 * 
 * @iso25010
 * - Usabilidad: Información esencial visible de un vistazo
 * - Eficiencia: Lazy loading de imágenes
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Heart, Star, Sparkles } from 'lucide-react';
import type { Venue } from '../../types';
import { categoryLabels } from '../../services/mockApi';

// Premium colors
const colors = {
    gold: '#C5A059',
    goldLight: '#E8C872',
    text: '#2C2C2C',
    textSecondary: '#5D5D5D',
    textMuted: '#8C8C8C',
    bgLight: '#FAFAFA',
    bgCard: '#FFFFFF',
    border: '#E8E8E8',
};

interface PropertyCardProps {
    /** Datos del local */
    venue: Venue;
    /** Mostrar como favorito */
    isFavorite?: boolean;
    /** Callback al marcar favorito */
    onFavoriteToggle?: (venueId: string) => void;
}

/**
 * Tarjeta de local con imagen, info y acciones
 * Tema Premium Blanco y Dorado
 */
export const PropertyCard: React.FC<PropertyCardProps> = ({
    venue,
    isFavorite = false,
    onFavoriteToggle,
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onFavoriteToggle?.(venue.id);
    };

    const handleImageHover = () => {
        if (venue.images.length > 1) {
            setCurrentImageIndex((prev) => (prev + 1) % venue.images.length);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <Link
            to={`/local/${venue.id}`}
            style={{ textDecoration: 'none' }}
        >
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    background: colors.bgCard,
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: `1px solid ${isHovered ? colors.gold : colors.border}`,
                    boxShadow: isHovered
                        ? `0 12px 40px rgba(197, 160, 89, 0.2)`
                        : '0 4px 20px rgba(0,0,0,0.06)',
                    transition: 'all 0.3s ease',
                    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                    cursor: 'pointer',
                }}
            >
                {/* Imagen */}
                <div
                    style={{
                        position: 'relative',
                        aspectRatio: '4/3',
                        overflow: 'hidden',
                    }}
                    onMouseEnter={handleImageHover}
                >
                    {/* Skeleton mientras carga */}
                    {!imageLoaded && (
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background: colors.bgLight,
                                animation: 'pulse 2s infinite',
                            }}
                        />
                    )}

                    <img
                        src={venue.images[currentImageIndex]}
                        alt={venue.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'all 0.5s ease',
                            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                            opacity: imageLoaded ? 1 : 0,
                        }}
                        onLoad={() => setImageLoaded(true)}
                        loading="lazy"
                    />

                    {/* Overlay gradient */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent, transparent)',
                        }}
                    />

                    {/* Badges */}
                    <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '8px' }}>
                        {venue.status === 'FEATURED' && (
                            <span style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '6px 12px',
                                background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldLight})`,
                                color: '#FFFFFF',
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                            }}>
                                <Sparkles style={{ width: 12, height: 12 }} />
                                Destacado
                            </span>
                        )}
                        <span style={{
                            padding: '6px 12px',
                            background: 'rgba(255,255,255,0.95)',
                            color: colors.text,
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                        }}>
                            {categoryLabels[venue.category]}
                        </span>
                    </div>

                    {/* Botón favorito */}
                    <button
                        onClick={handleFavoriteClick}
                        style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            padding: '10px',
                            borderRadius: '50%',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            background: isFavorite ? colors.gold : 'rgba(255,255,255,0.9)',
                            color: isFavorite ? '#FFFFFF' : colors.text,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        }}
                        aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                    >
                        <Heart
                            style={{ width: 18, height: 18 }}
                            fill={isFavorite ? 'currentColor' : 'none'}
                        />
                    </button>

                    {/* Indicadores de imagen */}
                    {venue.images.length > 1 && (
                        <div style={{
                            position: 'absolute',
                            bottom: '12px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            gap: '6px',
                        }}>
                            {venue.images.slice(0, 5).map((_, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        width: idx === currentImageIndex ? '16px' : '6px',
                                        height: '6px',
                                        borderRadius: '3px',
                                        transition: 'all 0.3s ease',
                                        background: idx === currentImageIndex ? colors.gold : 'rgba(255,255,255,0.6)',
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Contenido */}
                <div style={{ padding: '16px' }}>
                    {/* Título y rating */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: '12px',
                        marginBottom: '8px',
                    }}>
                        <h3 style={{
                            fontWeight: 600,
                            color: isHovered ? colors.gold : colors.text,
                            fontSize: '1.1rem',
                            lineHeight: 1.3,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            transition: 'color 0.3s ease',
                            margin: 0,
                        }}>
                            {venue.name}
                        </h3>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: colors.gold,
                            flexShrink: 0,
                        }}>
                            <Star style={{ width: 16, height: 16, fill: colors.gold }} />
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                {venue.rating.toFixed(1)}
                            </span>
                        </div>
                    </div>

                    {/* Ubicación */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: colors.textSecondary,
                        fontSize: '0.875rem',
                        marginBottom: '12px',
                    }}>
                        <MapPin style={{ width: 14, height: 14, flexShrink: 0 }} />
                        <span style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            {venue.zone}
                        </span>
                    </div>

                    {/* Capacidad y precio */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '12px',
                        borderTop: `1px solid ${colors.border}`,
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: colors.textMuted,
                            fontSize: '0.875rem',
                        }}>
                            <Users style={{ width: 16, height: 16 }} />
                            <span>Hasta {venue.capacity}</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{
                                color: colors.gold,
                                fontWeight: 700,
                                fontSize: '1.15rem',
                                margin: 0,
                            }}>
                                {formatPrice(venue.price)}
                            </p>
                            <p style={{
                                color: colors.textMuted,
                                fontSize: '0.75rem',
                                margin: 0,
                            }}>
                                por evento
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default PropertyCard;
