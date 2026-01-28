/**
 * @fileoverview Componente Card - Átomo
 * @description Contenedor de tarjeta con efecto glassmorphism
 * 
 * @iso25010
 * - Usabilidad: Agrupación visual clara de contenido relacionado
 * - Eficiencia de Desempeño: Animaciones optimizadas con CSS
 */

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Variante visual */
    variant?: 'default' | 'glass' | 'outline' | 'elevated';
    /** Padding interno */
    padding?: 'none' | 'sm' | 'md' | 'lg';
    /** Efecto hover habilitado */
    hoverable?: boolean;
    /** Efecto de brillo neón en hover */
    glowOnHover?: boolean;
}

/**
 * Tarjeta contenedora con estilo brutalista
 * 
 * @example
 * ```tsx
 * <Card variant="glass" hoverable glowOnHover>
 *   <h3>Título</h3>
 *   <p>Contenido</p>
 * </Card>
 * ```
 */
export const Card: React.FC<CardProps> = ({
    children,
    variant = 'default',
    padding = 'md',
    hoverable = false,
    glowOnHover = false,
    className = '',
    ...props
}) => {
    const baseStyles = `
    rounded-2xl
    transition-all duration-300 ease-out
  `;

    const variants = {
        default: 'bg-bg-card border border-neon/10',
        glass: 'glass',
        outline: 'bg-transparent border-2 border-neon/30',
        elevated: 'bg-bg-card shadow-lg shadow-neon/5 border border-neon/10',
    };

    const paddings = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    const hoverStyles = hoverable
        ? 'cursor-pointer transform hover:-translate-y-1'
        : '';

    const glowStyles = glowOnHover
        ? 'hover:shadow-[0_0_25px_rgba(57,255,20,0.2)] hover:border-neon/50'
        : '';

    return (
        <div
            className={`
        ${baseStyles}
        ${variants[variant]}
        ${paddings[padding]}
        ${hoverStyles}
        ${glowStyles}
        ${className}
      `}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
