/**
 * @fileoverview Componente NavItem - Molécula
 * @description Item de navegación para el navbar
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItemProps {
    /** Ruta de destino */
    to: string;
    /** Icono del item */
    icon?: React.ReactNode;
    /** Texto del item */
    label: string;
    /** Badge opcional (ej: número de mensajes) */
    badge?: number;
    /** Callback al hacer click */
    onClick?: () => void;
}

/**
 * Item de navegación con estado activo
 */
export const NavItem: React.FC<NavItemProps> = ({
    to,
    icon,
    label,
    badge,
    onClick,
}) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            onClick={onClick}
            className={`
        flex items-center gap-2 px-4 py-2 rounded-2xl
        transition-all duration-300
        ${isActive
                    ? 'bg-neon/10 text-neon border border-neon/30'
                    : 'text-text-secondary hover:text-neon hover:bg-neon/5'
                }
      `}
        >
            {icon && <span className="flex-shrink-0">{icon}</span>}
            <span className="font-medium">{label}</span>
            {badge !== undefined && badge > 0 && (
                <span className="ml-auto bg-neon text-black text-xs font-bold px-2 py-0.5 rounded-full">
                    {badge > 99 ? '99+' : badge}
                </span>
            )}
        </Link>
    );
};

export default NavItem;
