/**
 * @fileoverview Componente Input - Átomo
 * @description Campo de entrada reutilizable con estilo neón
 * 
 * @iso25010
 * - Usabilidad: Labels claros, mensajes de error visibles
 * - Accesibilidad: Asociación label-input, aria-describedby para errores
 */

import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    /** Etiqueta del campo */
    label?: string;
    /** Mensaje de error */
    error?: string;
    /** Texto de ayuda */
    helperText?: string;
    /** Icono a la izquierda */
    leftIcon?: React.ReactNode;
    /** Icono a la derecha */
    rightIcon?: React.ReactNode;
    /** Ocupar todo el ancho */
    fullWidth?: boolean;
}

/**
 * Campo de entrada con estilo neón
 * 
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="tu@email.com"
 *   leftIcon={<Mail />}
 *   error={errors.email}
 * />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            helperText,
            leftIcon,
            rightIcon,
            fullWidth = true,
            className = '',
            id,
            ...props
        },
        ref
    ) => {
        const inputId = id || `input-${label?.toLowerCase().replace(/\s/g, '-')}`;
        const errorId = error ? `${inputId}-error` : undefined;
        const helperId = helperText ? `${inputId}-helper` : undefined;

        return (
            <div className={`${fullWidth ? 'w-full' : ''}`}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-text-secondary mb-2"
                    >
                        {label}
                    </label>
                )}

                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                            {leftIcon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        aria-describedby={errorId || helperId}
                        aria-invalid={!!error}
                        className={`
              w-full bg-bg-card text-text-primary
              border ${error ? 'border-error' : 'border-neon/20'}
              rounded-2xl px-4 py-3
              placeholder:text-text-muted
              focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon
              transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed
              ${leftIcon ? 'pl-12' : ''}
              ${rightIcon ? 'pr-12' : ''}
              ${className}
            `}
                        {...props}
                    />

                    {rightIcon && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">
                            {rightIcon}
                        </div>
                    )}
                </div>

                {error && (
                    <p id={errorId} className="mt-2 text-sm text-error">
                        {error}
                    </p>
                )}

                {helperText && !error && (
                    <p id={helperId} className="mt-2 text-sm text-text-muted">
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
