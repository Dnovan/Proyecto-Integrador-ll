/**
 * @fileoverview Componente StarRating - Molécula
 * @description Sistema de calificación con estrellas
 * 
 * @iso25010
 * - Usabilidad: Interacción intuitiva para rating
 * - Accesibilidad: Soporte de teclado y aria-labels
 */

import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
    /** Valor actual (0-5) */
    value: number;
    /** Callback al cambiar (si es interactivo) */
    onChange?: (value: number) => void;
    /** Tamaño de las estrellas */
    size?: 'sm' | 'md' | 'lg';
    /** Mostrar valor numérico */
    showValue?: boolean;
    /** Número de reseñas */
    reviewCount?: number;
    /** Solo lectura */
    readOnly?: boolean;
}

/**
 * Rating con estrellas interactivas
 * 
 * @example
 * ```tsx
 * <StarRating value={4.5} showValue reviewCount={127} />
 * <StarRating value={rating} onChange={setRating} />
 * ```
 */
export const StarRating: React.FC<StarRatingProps> = ({
    value,
    onChange,
    size = 'md',
    showValue = false,
    reviewCount,
    readOnly = false,
}) => {
    const [hoverValue, setHoverValue] = useState<number | null>(null);

    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    const textSizes = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
    };

    const displayValue = hoverValue !== null ? hoverValue : value;
    const isInteractive = !readOnly && onChange;

    const handleClick = (index: number) => {
        if (isInteractive) {
            onChange(index + 1);
        }
    };

    const handleMouseEnter = (index: number) => {
        if (isInteractive) {
            setHoverValue(index + 1);
        }
    };

    const handleMouseLeave = () => {
        if (isInteractive) {
            setHoverValue(null);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onChange(index + 1);
        }
    };

    return (
        <div className="flex items-center gap-1">
            <div
                className={`flex ${isInteractive ? 'cursor-pointer' : ''}`}
                role={isInteractive ? 'radiogroup' : undefined}
                aria-label="Calificación"
            >
                {[0, 1, 2, 3, 4].map((index) => {
                    const filled = index < Math.floor(displayValue);
                    const halfFilled = !filled && index < displayValue;

                    return (
                        <span
                            key={index}
                            onClick={() => handleClick(index)}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            tabIndex={isInteractive ? 0 : undefined}
                            role={isInteractive ? 'radio' : undefined}
                            aria-checked={isInteractive ? index < value : undefined}
                            aria-label={isInteractive ? `${index + 1} estrellas` : undefined}
                            className={`
                relative transition-transform duration-200
                ${isInteractive ? 'hover:scale-110' : ''}
              `}
                        >
                            {/* Estrella vacía */}
                            <Star
                                className={`
                  ${sizes[size]}
                  ${filled || halfFilled ? 'text-neon' : 'text-text-muted'}
                  transition-colors duration-200
                `}
                                fill={filled ? 'currentColor' : halfFilled ? 'url(#half-gradient)' : 'none'}
                            />

                            {/* Gradiente para media estrella */}
                            {halfFilled && (
                                <svg className="absolute inset-0 w-0 h-0">
                                    <defs>
                                        <linearGradient id="half-gradient">
                                            <stop offset="50%" stopColor="#39FF14" />
                                            <stop offset="50%" stopColor="transparent" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            )}
                        </span>
                    );
                })}
            </div>

            {showValue && (
                <span className={`text-neon font-semibold ml-1 ${textSizes[size]}`}>
                    {value.toFixed(1)}
                </span>
            )}

            {reviewCount !== undefined && (
                <span className={`text-text-muted ml-1 ${textSizes[size]}`}>
                    ({reviewCount})
                </span>
            )}
        </div>
    );
};

export default StarRating;
