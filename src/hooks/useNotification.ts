/**
 * @fileoverview Hook personalizado para gestionar notificaciones toast
 * @description Proporciona estado y funciones para mostrar/ocultar notificaciones
 * 
 * @iso25010
 * - Usabilidad: API simple para mostrar feedback al usuario
 * - Mantenibilidad: Lógica centralizada y reutilizable
 */

import { useState, useCallback } from 'react';
import type { NotificationType } from '../components/atoms/Notification';

// ==================== TIPOS ====================

export interface NotificationState {
    message: string;
    type: NotificationType;
    title?: string;
    duration?: number;
}

export interface UseNotificationReturn {
    /** Estado actual de la notificación (null si no hay ninguna activa) */
    notification: NotificationState | null;
    /** Muestra una notificación con el mensaje y tipo especificados */
    showNotification: (
        message: string,
        type: NotificationType,
        options?: { title?: string; duration?: number }
    ) => void;
    /** Cierra la notificación actual */
    closeNotification: () => void;
    /** Muestra una notificación de éxito */
    showSuccess: (message: string, title?: string) => void;
    /** Muestra una notificación de error */
    showError: (message: string, title?: string) => void;
    /** Muestra una notificación de advertencia */
    showWarning: (message: string, title?: string) => void;
    /** Muestra una notificación informativa */
    showInfo: (message: string, title?: string) => void;
}

// ==================== HOOK ====================

/**
 * Hook para gestionar el sistema de notificaciones toast
 * 
 * @example
 * ```tsx
 * const { notification, showSuccess, showError, closeNotification } = useNotification();
 * 
 * const handleSubmit = async () => {
 *   try {
 *     await saveData();
 *     showSuccess('Datos guardados correctamente');
 *   } catch (error) {
 *     showError('Error al guardar los datos');
 *   }
 * };
 * 
 * return (
 *   <>
 *     {notification && (
 *       <Notification
 *         {...notification}
 *         onClose={closeNotification}
 *       />
 *     )}
 *     <button onClick={handleSubmit}>Guardar</button>
 *   </>
 * );
 * ```
 */
export function useNotification(): UseNotificationReturn {
    const [notification, setNotification] = useState<NotificationState | null>(null);

    /**
     * Muestra una notificación toast
     */
    const showNotification = useCallback((
        message: string,
        type: NotificationType,
        options?: { title?: string; duration?: number }
    ) => {
        setNotification({
            message,
            type,
            title: options?.title,
            duration: options?.duration,
        });
    }, []);

    /**
     * Cierra la notificación actual
     */
    const closeNotification = useCallback(() => {
        setNotification(null);
    }, []);

    /**
     * Atajos para tipos comunes de notificación
     */
    const showSuccess = useCallback((message: string, title?: string) => {
        showNotification(message, 'success', { title });
    }, [showNotification]);

    const showError = useCallback((message: string, title?: string) => {
        showNotification(message, 'error', { title });
    }, [showNotification]);

    const showWarning = useCallback((message: string, title?: string) => {
        showNotification(message, 'warning', { title });
    }, [showNotification]);

    const showInfo = useCallback((message: string, title?: string) => {
        showNotification(message, 'info', { title });
    }, [showNotification]);

    return {
        notification,
        showNotification,
        closeNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
    };
}

export default useNotification;
