/**
 * @fileoverview Componente Skeleton - Átomo
 * @description Placeholder animado para estados de carga
 * 
 * @iso25010
 * - Usabilidad: Feedback visual durante carga de datos
 * - Eficiencia de Desempeño: Animación CSS pura, sin JavaScript
 */

import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Variante de forma */
    variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
    /** Ancho personalizado */
    width?: string | number;
    /** Alto personalizado */
    height?: string | number;
    /** Animación habilitada */
    animate?: boolean;
}

/**
 * Skeleton loader con estilo neón
 * 
 * @example
 * ```tsx
 * <Skeleton variant="text" width="80%" />
 * <Skeleton variant="circular" width={48} height={48} />
 * <Skeleton variant="rounded" height={200} />
 * ```
 */
export const Skeleton: React.FC<SkeletonProps> = ({
    variant = 'text',
    width,
    height,
    animate = true,
    className = '',
    style,
    ...props
}) => {
    const baseStyles = `
    bg-gradient-to-r from-bg-card via-neon/5 to-bg-card
    ${animate ? 'animate-pulse' : ''}
  `;

    const variants = {
        text: 'rounded-md h-4',
        circular: 'rounded-full',
        rectangular: 'rounded-none',
        rounded: 'rounded-2xl',
    };

    const customStyle: React.CSSProperties = {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
    };

    return (
        <div
            className={`
        ${baseStyles}
        ${variants[variant]}
        ${className}
      `}
            style={customStyle}
            {...props}
        />
    );
};

// ==================== COMPONENTES COMPUESTOS DE SKELETON ====================

/**
 * Skeleton para una tarjeta de local
 */
export const VenueCardSkeleton: React.FC = () => (
    <div className="bg-bg-card rounded-2xl overflow-hidden border border-neon/10">
        <Skeleton variant="rectangular" height={200} className="w-full" />
        <div className="p-4 space-y-3">
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="50%" />
            <div className="flex justify-between items-center pt-2">
                <Skeleton variant="text" width="30%" />
                <Skeleton variant="text" width="20%" />
            </div>
        </div>
    </div>
);

/**
 * Skeleton para métricas del dashboard
 */
export const MetricCardSkeleton: React.FC = () => (
    <div className="bg-bg-card rounded-2xl p-6 border border-neon/10">
        <div className="flex items-center justify-between mb-4">
            <Skeleton variant="circular" width={48} height={48} />
            <Skeleton variant="text" width={60} height={24} />
        </div>
        <Skeleton variant="text" width="40%" height={32} className="mb-2" />
        <Skeleton variant="text" width="60%" />
    </div>
);

/**
 * Skeleton para mensajes del chat
 */
export const MessageSkeleton: React.FC<{ align?: 'left' | 'right' }> = ({
    align = 'left',
}) => (
    <div className={`flex gap-3 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
        <Skeleton variant="circular" width={40} height={40} />
        <div className={`space-y-2 ${align === 'right' ? 'items-end' : ''}`}>
            <Skeleton variant="rounded" width={200} height={60} />
            <Skeleton variant="text" width={80} />
        </div>
    </div>
);

export default Skeleton;
