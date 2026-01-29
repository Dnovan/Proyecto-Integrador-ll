/**
 * @fileoverview Componente de Notificación Toast para EventSpace
 * @description Muestra notificaciones flotantes tipo toast para feedback al usuario
 * 
 * @iso25010
 * - Usabilidad: Feedback visual claro con iconos y colores diferenciados
 * - Accesibilidad: Roles ARIA y cierre automático/manual
 */

import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// ==================== TIPOS ====================

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationProps {
  /** Mensaje a mostrar en la notificación */
  message: string;
  /** Tipo de notificación que determina el estilo visual */
  type: NotificationType;
  /** Función callback para cerrar la notificación */
  onClose: () => void;
  /** Duración en milisegundos antes del cierre automático (default: 3000) */
  duration?: number;
  /** Título opcional de la notificación */
  title?: string;
}

// ==================== ESTILOS POR TIPO ====================

const notificationStyles: Record<NotificationType, {
  bg: string;
  border: string;
  icon: string;
  text: string;
  progress: string;
}> = {
  success: {
    bg: 'bg-gradient-to-r from-emerald-50 to-green-50',
    border: 'border-emerald-400',
    icon: 'text-emerald-500',
    text: 'text-emerald-800',
    progress: 'bg-emerald-500',
  },
  error: {
    bg: 'bg-gradient-to-r from-red-50 to-rose-50',
    border: 'border-red-400',
    icon: 'text-red-500',
    text: 'text-red-800',
    progress: 'bg-red-500',
  },
  warning: {
    bg: 'bg-gradient-to-r from-amber-50 to-yellow-50',
    border: 'border-amber-400',
    icon: 'text-amber-500',
    text: 'text-amber-800',
    progress: 'bg-amber-500',
  },
  info: {
    bg: 'bg-gradient-to-r from-blue-50 to-sky-50',
    border: 'border-blue-400',
    icon: 'text-blue-500',
    text: 'text-blue-800',
    progress: 'bg-blue-500',
  },
};

const notificationIcons: Record<NotificationType, React.ReactNode> = {
  success: <CheckCircle className="w-6 h-6" />,
  error: <XCircle className="w-6 h-6" />,
  warning: <AlertTriangle className="w-6 h-6" />,
  info: <Info className="w-6 h-6" />,
};

const defaultTitles: Record<NotificationType, string> = {
  success: '¡Éxito!',
  error: 'Error',
  warning: 'Advertencia',
  info: 'Información',
};

// ==================== COMPONENTE ====================

/**
 * Componente de notificación toast flotante
 * 
 * @example
 * ```tsx
 * <Notification
 *   type="success"
 *   message="Operación completada correctamente"
 *   onClose={() => setNotification(null)}
 * />
 * ```
 */
export const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  onClose,
  duration = 3000,
  title,
}) => {
  const styles = notificationStyles[type];
  const Icon = notificationIcons[type];
  const displayTitle = title || defaultTitles[type];

  // Auto-cerrar después de la duración especificada
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`
        fixed top-6 right-6 z-[9999]
        min-w-[320px] max-w-[420px]
        ${styles.bg} ${styles.border}
        border-l-4 rounded-lg shadow-xl
        transform transition-all duration-300 ease-out
        animate-slide-in-right
        backdrop-blur-sm
      `}
      style={{
        animation: 'slideInRight 0.3s ease-out forwards',
      }}
    >
      {/* Contenido principal */}
      <div className="flex items-start gap-3 p-4">
        {/* Icono */}
        <div className={`flex-shrink-0 ${styles.icon}`}>
          {Icon}
        </div>

        {/* Texto */}
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm ${styles.text}`}>
            {displayTitle}
          </p>
          <p className={`mt-1 text-sm ${styles.text} opacity-90`}>
            {message}
          </p>
        </div>

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className={`
            flex-shrink-0 p-1 rounded-full
            ${styles.text} opacity-60
            hover:opacity-100 hover:bg-black/5
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-1
          `}
          aria-label="Cerrar notificación"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Barra de progreso */}
      <div className="h-1 w-full bg-black/5 rounded-b-lg overflow-hidden">
        <div
          className={`h-full ${styles.progress} rounded-b-lg`}
          style={{
            animation: `shrink ${duration}ms linear forwards`,
          }}
        />
      </div>

      {/* Estilos de animación inline */}
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default Notification;
