/**
 * @fileoverview Componente Avatar - Átomo
 * @description Imagen de perfil de usuario con fallback
 * 
 * @iso25010
 * - Usabilidad: Identificación visual clara de usuarios
 * - Eficiencia: Lazy loading de imágenes
 */

import React, { useState } from 'react';
import { User } from 'lucide-react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    /** URL de la imagen */
    src?: string;
    /** Nombre para alt y fallback */
    name?: string;
    /** Tamaño del avatar */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    /** Mostrar indicador de estado online */
    online?: boolean;
    /** Borde neón */
    bordered?: boolean;
}

/**
 * Avatar de usuario con fallback a iniciales
 * 
 * @example
 * ```tsx
 * <Avatar
 *   src={user.avatar}
 *   name={user.name}
 *   size="lg"
 *   online
 * />
 * ```
 */
export const Avatar: React.FC<AvatarProps> = ({
    src,
    name,
    size = 'md',
    online,
    bordered = false,
    className = '',
    ...props
}) => {
    const [imageError, setImageError] = useState(false);

    const sizes = {
        xs: 'w-6 h-6 text-xs',
        sm: 'w-8 h-8 text-sm',
        md: 'w-10 h-10 text-base',
        lg: 'w-14 h-14 text-lg',
        xl: 'w-20 h-20 text-2xl',
    };

    const indicatorSizes = {
        xs: 'w-1.5 h-1.5',
        sm: 'w-2 h-2',
        md: 'w-2.5 h-2.5',
        lg: 'w-3 h-3',
        xl: 'w-4 h-4',
    };

    // Obtener iniciales del nombre
    const getInitials = (name?: string): string => {
        if (!name) return '';
        const words = name.split(' ');
        return words
            .slice(0, 2)
            .map((w) => w[0])
            .join('')
            .toUpperCase();
    };

    const showImage = src && !imageError;

    return (
        <div className={`relative inline-block ${className}`} {...props}>
            <div
                className={`
          ${sizes[size]}
          rounded-full overflow-hidden
          flex items-center justify-center
          ${bordered ? 'ring-2 ring-neon ring-offset-2 ring-offset-bg-primary' : ''}
          ${showImage ? '' : 'bg-neon/20 text-neon'}
          transition-all duration-300
        `}
            >
                {showImage ? (
                    <img
                        src={src}
                        alt={name || 'Avatar'}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                        loading="lazy"
                    />
                ) : name ? (
                    <span className="font-semibold">{getInitials(name)}</span>
                ) : (
                    <User className="w-1/2 h-1/2" />
                )}
            </div>

            {online !== undefined && (
                <div
                    className={`
            absolute bottom-0 right-0
            ${indicatorSizes[size]}
            rounded-full
            border-2 border-bg-primary
            ${online ? 'bg-success' : 'bg-text-muted'}
          `}
                />
            )}
        </div>
    );
};

export default Avatar;
