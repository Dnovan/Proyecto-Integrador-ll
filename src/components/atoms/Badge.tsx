/**
 * @fileoverview Componente Badge - Átomo
 * @description Etiqueta/insignia para mostrar estados o categorías
 * 
 * @iso25010
 * - Usabilidad: Indicadores visuales claros y distinguibles
 */

import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    /** Variante de color */
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'neon';
    /** Tamaño */
    size?: 'sm' | 'md' | 'lg';
    /** Icono opcional */
    icon?: React.ReactNode;
    /** Efecto de pulso */
    pulse?: boolean;
}

/**
 * Badge/Etiqueta con estilo neón
 * 
 * @example
 * ```tsx
 * <Badge variant="success" icon={<Check />}>
 *   Verificado
 * </Badge>
 * ```
 */
export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'default',
    size = 'md',
    icon,
    pulse = false,
    className = '',
    ...props
}) => {
    const baseStyles = `
    inline-flex items-center gap-1.5
    font-medium rounded-full
    whitespace-nowrap
  `;

    const variants = {
        default: 'bg-bg-card text-text-secondary border border-neon/20',
        success: 'bg-success/10 text-success border border-success/30',
        warning: 'bg-warning/10 text-warning border border-warning/30',
        error: 'bg-error/10 text-error border border-error/30',
        info: 'bg-info/10 text-info border border-info/30',
        neon: 'bg-neon/10 text-neon border border-neon/50',
    };

    const sizes = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-3 py-1',
        lg: 'text-base px-4 py-1.5',
    };

    return (
        <span
            className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${pulse ? 'animate-pulse-neon' : ''}
        ${className}
      `}
            {...props}
        >
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
        </span>
    );
};

export default Badge;
