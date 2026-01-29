/**
 * @fileoverview Contexto global para notificaciones toast
 * @description Maneja notificaciones a nivel de aplicación con limpieza automática al navegar
 * 
 * @iso25010
 * - Usabilidad: Feedback visual consistente en toda la app
 * - Mantenibilidad: Lógica centralizada de notificaciones
 */

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Notification } from '../components/atoms/Notification';
import type { NotificationType } from '../components/atoms/Notification';

// ==================== TIPOS ====================

interface NotificationState {
    id: string;
    message: string;
    type: NotificationType;
    title?: string;
    duration?: number;
}

interface NotificationContextType {
    /** Muestra una notificación de éxito */
    showSuccess: (message: string, title?: string) => void;
    /** Muestra una notificación de error */
    showError: (message: string, title?: string) => void;
    /** Muestra una notificación de advertencia */
    showWarning: (message: string, title?: string) => void;
    /** Muestra una notificación informativa */
    showInfo: (message: string, title?: string) => void;
    /** Cierra la notificación actual */
    closeNotification: () => void;
    /** Limpia todas las notificaciones */
    clearAll: () => void;
}

// ==================== CONTEXTO ====================

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// ==================== PROVIDER ====================

interface NotificationProviderProps {
    children: ReactNode;
    /** Si true, limpia notificaciones automáticamente al cambiar de ruta */
    clearOnNavigate?: boolean;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
    children,
    clearOnNavigate = true
}) => {
    const [notification, setNotification] = useState<NotificationState | null>(null);
    const location = useLocation();
    const previousPathRef = useRef(location.pathname);

    // Limpiar notificaciones al navegar usando ref para evitar cascading renders
    // El setState aquí es intencional - limpiamos las notificaciones cuando el usuario navega
    useEffect(() => {
        if (clearOnNavigate && previousPathRef.current !== location.pathname) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setNotification(null);
        }
        previousPathRef.current = location.pathname;
    }, [location.pathname, clearOnNavigate]);

    /**
     * Genera un ID único para cada notificación
     */
    const generateId = (): string => {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    };

    /**
     * Muestra una notificación
     */
    const showNotification = useCallback((
        message: string,
        type: NotificationType,
        title?: string,
        duration?: number
    ) => {
        setNotification({
            id: generateId(),
            message,
            type,
            title,
            duration,
        });
    }, []);

    /**
     * Cierra la notificación actual
     */
    const closeNotification = useCallback(() => {
        setNotification(null);
    }, []);

    /**
     * Limpia todas las notificaciones
     */
    const clearAll = useCallback(() => {
        setNotification(null);
    }, []);

    // Funciones convenientes para cada tipo
    const showSuccess = useCallback((message: string, title?: string) => {
        showNotification(message, 'success', title);
    }, [showNotification]);

    const showError = useCallback((message: string, title?: string) => {
        showNotification(message, 'error', title);
    }, [showNotification]);

    const showWarning = useCallback((message: string, title?: string) => {
        showNotification(message, 'warning', title);
    }, [showNotification]);

    const showInfo = useCallback((message: string, title?: string) => {
        showNotification(message, 'info', title);
    }, [showNotification]);

    const value: NotificationContextType = {
        showSuccess,
        showError,
        showWarning,
        showInfo,
        closeNotification,
        clearAll,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}

            {/* Renderizar notificación global */}
            {notification && (
                <Notification
                    key={notification.id}
                    type={notification.type}
                    message={notification.message}
                    title={notification.title}
                    duration={notification.duration}
                    onClose={closeNotification}
                />
            )}
        </NotificationContext.Provider>
    );
};

// ==================== HOOK ====================

/**
 * Hook para usar el sistema de notificaciones global
 * 
 * @example
 * ```tsx
 * const { showSuccess, showError } = useGlobalNotification();
 * 
 * const handleSubmit = async () => {
 *   try {
 *     await saveData();
 *     showSuccess('Datos guardados correctamente');
 *   } catch (error) {
 *     showError('Error al guardar los datos');
 *   }
 * ```
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useGlobalNotification = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useGlobalNotification debe usarse dentro de un NotificationProvider');
    }
    return context;
};

export default NotificationProvider;
