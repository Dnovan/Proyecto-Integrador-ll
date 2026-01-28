/**
 * @fileoverview Panel de Imagen para páginas de autenticación
 * @description Panel inmersivo con imagen de fondo, estadísticas y badges
 */

import React from 'react';
import { Shield, Users } from 'lucide-react';

interface AuthImagePanelProps {
    /** Tipo de panel: cliente o proveedor */
    variant?: 'client' | 'provider';
    /** Imagen de fondo personalizada */
    backgroundImage?: string;
}

const defaultClientImage = 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80';
const defaultProviderImage = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80';

/**
 * Panel inmersivo para páginas de autenticación
 * Diseño inspirado en la referencia: imagen a la izquierda con overlay y estadísticas
 */
export const AuthImagePanel: React.FC<AuthImagePanelProps> = ({
    variant = 'client',
    backgroundImage,
}) => {
    const image = backgroundImage || (variant === 'client' ? defaultClientImage : defaultProviderImage);

    const stats = variant === 'client'
        ? [
            { value: '500+', label: 'Locales' },
            { value: '10K+', label: 'Eventos' },
            { value: '4.9', label: 'Calificación' },
        ]
        : [
            { value: '95%', label: 'Ocupación' },
            { value: '$2M+', label: 'Generado' },
            { value: '4.8', label: 'Rating' },
        ];

    return (
        <div className="auth-image-panel">
            {/* Imagen de fondo */}
            <div
                className="auth-image-panel__background"
                style={{ backgroundImage: `url(${image})` }}
            />

            {/* Overlay con gradiente */}
            <div className="auth-image-panel__overlay" />

            {/* Contenido */}
            <div className="auth-image-panel__content">
                {/* Badge superior - Seguridad */}
                <div className="auth-image-panel__badge auth-image-panel__badge--top">
                    <Shield className="w-4 h-4" />
                    <span>100% Seguro</span>
                </div>

                {/* Badge lateral - Comunidad */}
                <div className="auth-image-panel__badge auth-image-panel__badge--side">
                    <Users className="w-4 h-4" />
                    <span>
                        {variant === 'client'
                            ? 'Únete a miles de clientes'
                            : 'Red de proveedores verificados'}
                    </span>
                </div>

                {/* Contenido principal */}
                <div className="auth-image-panel__main">
                    <h2 className="auth-image-panel__title">
                        {variant === 'client'
                            ? 'Tu próximo evento comienza aquí'
                            : 'Expande tu negocio con EventSpace'}
                    </h2>
                    <p className="auth-image-panel__subtitle">
                        {variant === 'client'
                            ? 'Desde íntimas reuniones hasta grandes celebraciones.'
                            : 'Conecta con miles de clientes buscando espacios únicos.'}
                    </p>

                    {/* Estadísticas */}
                    <div className="auth-image-panel__stats">
                        {stats.map((stat, index) => (
                            <div key={index} className="auth-image-panel__stat">
                                <span className="auth-image-panel__stat-value">{stat.value}</span>
                                <span className="auth-image-panel__stat-label">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthImagePanel;
