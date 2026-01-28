/**
 * @fileoverview Componente Button - Átomo
 * @description Botón reutilizable con variantes de estilo neón
 * 
 * @iso25010
 * - Usabilidad: Estados visuales claros (hover, disabled, loading)
 * - Accesibilidad: Soporte para aria-labels y estados de foco
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** Variante visual del botón */
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    /** Tamaño del botón */
    size?: 'sm' | 'md' | 'lg';
    /** Estado de carga */
    isLoading?: boolean;
    /** Icono a mostrar a la izquierda */
    leftIcon?: React.ReactNode;
    /** Icono a mostrar a la derecha */
    rightIcon?: React.ReactNode;
    /** Ocupar todo el ancho disponible */
    fullWidth?: boolean;
}

/**
 * Botón con estilo neón brutalista
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="lg" leftIcon={<Plus />}>
 *   Crear Local
 * </Button>
 * ```
 */
export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled,
    className = '',
    ...props
}) => {
    const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-semibold transition-all duration-300 ease-out
    focus:outline-none focus:ring-2 focus:ring-neon focus:ring-offset-2 focus:ring-offset-bg-primary
    disabled:opacity-50 disabled:cursor-not-allowed
    rounded-2xl
  `;

    const variants = {
        primary: `
      bg-neon text-black
      hover:bg-neon-light hover:shadow-[0_0_20px_rgba(57,255,20,0.5)]
      active:scale-95
    `,
        secondary: `
      bg-bg-card text-text-primary border border-neon/30
      hover:border-neon hover:shadow-[0_0_15px_rgba(57,255,20,0.3)]
      active:scale-95
    `,
        outline: `
      bg-transparent text-neon border-2 border-neon
      hover:bg-neon/10 hover:shadow-[0_0_15px_rgba(57,255,20,0.3)]
      active:scale-95
    `,
        ghost: `
      bg-transparent text-text-secondary
      hover:text-neon hover:bg-neon/10
      active:scale-95
    `,
        danger: `
      bg-error text-white
      hover:bg-error/80 hover:shadow-[0_0_15px_rgba(255,59,48,0.5)]
      active:scale-95
    `,
    };

    const sizes = {
        sm: 'text-sm px-3 py-1.5 min-h-[32px]',
        md: 'text-base px-5 py-2.5 min-h-[44px]',
        lg: 'text-lg px-7 py-3.5 min-h-[52px]',
    };

    return (
        <button
            className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <>
                    {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
                    {children}
                    {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
                </>
            )}
        </button>
    );
};

export default Button;
