/**
 * @fileoverview Componente PropertyCard - Organismo
 * @description Tarjeta ULTRA PREMIUM de presentación de un local/venue
 * Diseño super elegante con glassmorphism, sombras refinadas y animaciones sofisticadas
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Heart, Star, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Venue } from '../../types';
import { categoryLabels } from '../../services/mockApi';

interface PropertyCardProps {
    venue: Venue;
    isFavorite?: boolean;
    onFavoriteToggle?: (venueId: string) => void;
}

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

    const handlePrevImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + venue.images.length) % venue.images.length);
    };

    const handleNextImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % venue.images.length);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const getCategoryStyle = (category: string) => {
        const styles: Record<string, { bg: string; text: string }> = {
            'SALON_EVENTOS': { bg: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)', text: '#FFFFFF' },
            'JARDIN': { bg: 'linear-gradient(135deg, #10B981 0%, #22C55E 100%)', text: '#FFFFFF' },
            'TERRAZA': { bg: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)', text: '#FFFFFF' },
            'HACIENDA': { bg: 'linear-gradient(135deg, #F97316 0%, #F59E0B 100%)', text: '#FFFFFF' },
            'BODEGA': { bg: 'linear-gradient(135deg, #6B7280 0%, #9CA3AF 100%)', text: '#FFFFFF' },
        };
        return styles[category] || { bg: 'linear-gradient(135deg, #C5A059 0%, #E8C872 100%)', text: '#1F1F1F' };
    };

    const categoryStyle = getCategoryStyle(venue.category);

    return (
        <Link to={`/local/${venue.id}`} style={{ textDecoration: 'none', display: 'block' }}>
            <article
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    position: 'relative',
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isHovered
                        ? '0 25px 60px rgba(197, 160, 89, 0.18), 0 0 0 1px rgba(197, 160, 89, 0.1)'
                        : '0 4px 24px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.02)',
                    transform: isHovered ? 'translateY(-8px) scale(1.01)' : 'translateY(0) scale(1)',
                }}
            >
                {/* Image Container */}
                <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
                    {/* Skeleton Loader */}
                    {!imageLoaded && (
                        <div
                            className="animate-shimmer"
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)',
                                backgroundSize: '200% 100%',
                            }}
                        />
                    )}

                    {/* Main Image */}
                    <img
                        src={venue.images[currentImageIndex]}
                        alt={venue.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                            opacity: imageLoaded ? 1 : 0,
                        }}
                        onLoad={() => setImageLoaded(true)}
                        loading="lazy"
                    />

                    {/* Gradient Overlays */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 40%, transparent 100%)',
                        pointerEvents: 'none',
                    }} />

                    {/* Golden Hover Overlay */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(197, 160, 89, 0.2) 0%, transparent 60%)',
                        opacity: isHovered ? 1 : 0,
                        transition: 'opacity 0.4s ease',
                        pointerEvents: 'none',
                    }} />

                    {/* Navigation Arrows */}
                    {venue.images.length > 1 && (
                        <>
                            <button
                                onClick={handlePrevImage}
                                style={{
                                    position: 'absolute',
                                    left: '12px',
                                    top: '50%',
                                    transform: `translateY(-50%) ${isHovered ? 'translateX(0)' : 'translateX(-10px)'}`,
                                    padding: '10px',
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(10px)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
                                    opacity: isHovered ? 1 : 0,
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                <ChevronLeft style={{ width: 18, height: 18, color: '#1F1F1F' }} />
                            </button>
                            <button
                                onClick={handleNextImage}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: `translateY(-50%) ${isHovered ? 'translateX(0)' : 'translateX(10px)'}`,
                                    padding: '10px',
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(10px)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
                                    opacity: isHovered ? 1 : 0,
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                <ChevronRight style={{ width: 18, height: 18, color: '#1F1F1F' }} />
                            </button>
                        </>
                    )}

                    {/* Top Badges */}
                    <div style={{
                        position: 'absolute',
                        top: '16px',
                        left: '16px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                    }}>
                        {venue.status === 'FEATURED' && (
                            <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 14px',
                                background: 'linear-gradient(135deg, #C5A059 0%, #E8C872 100%)',
                                borderRadius: '100px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                color: '#1F1F1F',
                                boxShadow: '0 4px 15px rgba(197, 160, 89, 0.4)',
                                letterSpacing: '0.02em',
                            }}>
                                <Sparkles style={{ width: 12, height: 12 }} />
                                DESTACADO
                            </span>
                        )}
                        <span style={{
                            padding: '8px 14px',
                            background: categoryStyle.bg,
                            borderRadius: '100px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: categoryStyle.text,
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                        }}>
                            {categoryLabels[venue.category]}
                        </span>
                    </div>

                    {/* Favorite Button */}
                    <button
                        onClick={handleFavoriteClick}
                        style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            padding: '12px',
                            borderRadius: '50%',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            background: isFavorite
                                ? 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)'
                                : 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            color: isFavorite ? '#FFFFFF' : '#6B7280',
                            boxShadow: isFavorite
                                ? '0 4px 20px rgba(239, 68, 68, 0.4)'
                                : '0 4px 15px rgba(0, 0, 0, 0.1)',
                            transform: isHovered && !isFavorite ? 'scale(1.1)' : 'scale(1)',
                        }}
                        aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                    >
                        <Heart
                            style={{ width: 20, height: 20 }}
                            fill={isFavorite ? 'currentColor' : 'none'}
                        />
                    </button>

                    {/* Image Indicators */}
                    {venue.images.length > 1 && (
                        <div style={{
                            position: 'absolute',
                            bottom: '16px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            gap: '6px',
                            padding: '6px 12px',
                            background: 'rgba(0, 0, 0, 0.4)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '100px',
                        }}>
                            {venue.images.slice(0, 5).map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setCurrentImageIndex(idx);
                                    }}
                                    style={{
                                        width: idx === currentImageIndex ? '20px' : '6px',
                                        height: '6px',
                                        borderRadius: '100px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        background: idx === currentImageIndex
                                            ? 'linear-gradient(90deg, #C5A059 0%, #E8C872 100%)'
                                            : 'rgba(255, 255, 255, 0.5)',
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div style={{ padding: '1.25rem 1.5rem 1.5rem' }}>
                    {/* Title & Rating */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        marginBottom: '0.75rem',
                    }}>
                        <h3 style={{
                            fontWeight: 700,
                            fontSize: '1.125rem',
                            lineHeight: 1.3,
                            color: isHovered ? '#C5A059' : '#1F1F1F',
                            transition: 'color 0.3s ease',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            letterSpacing: '-0.01em',
                            margin: 0,
                        }}>
                            {venue.name}
                        </h3>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 10px',
                            background: 'linear-gradient(135deg, rgba(197, 160, 89, 0.1) 0%, rgba(232, 200, 114, 0.05) 100%)',
                            borderRadius: '10px',
                            flexShrink: 0,
                        }}>
                            <Star style={{ width: 14, height: 14, color: '#C5A059', fill: '#C5A059' }} />
                            <span style={{
                                fontWeight: 700,
                                fontSize: '0.875rem',
                                color: '#997B30',
                            }}>
                                {venue.rating.toFixed(1)}
                            </span>
                        </div>
                    </div>

                    {/* Location */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '1rem',
                    }}>
                        <MapPin style={{ width: 15, height: 15, color: '#9CA3AF', flexShrink: 0 }} />
                        <span style={{
                            fontSize: '0.9375rem',
                            color: '#6B7280',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}>
                            {venue.zone}
                        </span>
                    </div>

                    {/* Footer: Capacity & Price */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        paddingTop: '1rem',
                        borderTop: '1px solid #F3F4F6',
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}>
                            <div style={{
                                padding: '6px',
                                background: '#F9FAFB',
                                borderRadius: '8px',
                            }}>
                                <Users style={{ width: 16, height: 16, color: '#9CA3AF' }} />
                            </div>
                            <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                                Hasta {venue.capacity}
                            </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{
                                fontSize: '1.375rem',
                                fontWeight: 800,
                                background: 'linear-gradient(135deg, #997B30 0%, #C5A059 50%, #E8C872 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                margin: 0,
                                letterSpacing: '-0.02em',
                            }}>
                                {formatPrice(venue.price)}
                            </p>
                            <p style={{
                                fontSize: '0.75rem',
                                color: '#9CA3AF',
                                margin: '2px 0 0 0',
                                fontWeight: 500,
                            }}>
                                por evento
                            </p>
                        </div>
                    </div>
                </div>

                {/* Elegant Border Glow on Hover */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '24px',
                    pointerEvents: 'none',
                    opacity: isHovered ? 1 : 0,
                    transition: 'opacity 0.4s ease',
                    boxShadow: 'inset 0 0 0 2px rgba(197, 160, 89, 0.2)',
                }} />
            </article>
        </Link>
    );
};

export default PropertyCard;
