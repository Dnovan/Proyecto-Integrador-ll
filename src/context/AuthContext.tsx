/**
 * @fileoverview Contexto de Autenticación para EventSpace
 * @description Gestiona el estado de autenticación global con Supabase
 * Soporta roles CLIENTE, PROVEEDOR y ADMIN con verificación de email
 * 
 * @iso25010
 * - Seguridad: Control de acceso basado en roles (RBAC) + JWT con Supabase
 * - Usabilidad: Estado de autenticación persistente y feedback de errores claro
 * - Mantenibilidad: Lógica centralizada de autenticación
 */

import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import type { User, AuthState, LoginCredentials, RegisterData, UserRole } from '../types';
import { supabase, auth as supabaseAuth, db } from '../lib/supabase';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';

// ==================== TIPOS DEL CONTEXTO ====================

interface AuthContextType extends AuthState {
    /** Inicia sesión con credenciales */
    login: (credentials: LoginCredentials) => Promise<void>;
    /** Registra un nuevo usuario */
    register: (data: RegisterData) => Promise<void>;
    /** Cierra sesión */
    logout: () => Promise<void>;
    /** Verifica si el usuario tiene un rol específico */
    hasRole: (role: UserRole) => boolean;
    /** Verifica si el usuario tiene alguno de los roles especificados */
    hasAnyRole: (roles: UserRole[]) => boolean;
    /** Limpia errores de autenticación */
    clearError: () => void;
    /** Reenvía email de verificación */
    resendVerificationEmail: () => Promise<void>;
    /** Indica si el email está verificado */
    isEmailVerified: boolean;
    /** Sesión de Supabase */
    session: Session | null;
}

// ==================== CONTEXTO ====================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ==================== PROVIDER ====================

interface AuthProviderProps {
    children: ReactNode;
}

/**
 * Convierte un usuario de Supabase a nuestro tipo User
 */
const mapSupabaseUser = async (supabaseUser: SupabaseUser): Promise<User> => {
    // Intentar obtener datos adicionales de la tabla users
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let userData: any = null;
    try {
        const result = await db.users.getById(supabaseUser.id);
        userData = result?.data;
    } catch (err) {
        console.warn('Could not fetch user data from DB:', err);
    }

    return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: userData?.name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'Usuario',
        role: (userData?.role || supabaseUser.user_metadata?.role || 'CLIENTE') as UserRole,
        avatar: userData?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${supabaseUser.email}`,
        phone: userData?.phone || undefined,
        createdAt: new Date(supabaseUser.created_at),
        verificationStatus: userData?.verification_status || undefined,
    };
};

/**
 * Proveedor del contexto de autenticación con Supabase
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
    });
    const [session, setSession] = useState<Session | null>(null);
    const [isEmailVerified, setIsEmailVerified] = useState(false);

    // Inicializar sesión y escuchar cambios
    useEffect(() => {
        // Obtener sesión inicial - no bloqueante
        const initSession = async () => {
            try {
                // Intentar obtener sesión sin timeout bloqueante
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    console.warn('Error getting session:', error.message);
                    setState(prev => ({ ...prev, isLoading: false }));
                    return;
                }

                setSession(session);
                if (session?.user) {
                    try {
                        const user = await mapSupabaseUser(session.user);
                        setIsEmailVerified(!!session.user.email_confirmed_at);
                        setState({
                            user,
                            isAuthenticated: true,
                            isLoading: false,
                            error: null,
                        });
                    } catch (err) {
                        console.error('Error mapping user:', err);
                        // Fallback to basic user if DB fails
                        setState({
                            user: {
                                id: session.user.id,
                                email: session.user.email || '',
                                name: session.user.email?.split('@')[0] || 'Usuario',
                                role: (session.user.user_metadata?.role || 'CLIENTE') as UserRole,
                                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`,
                                createdAt: new Date(session.user.created_at),
                            },
                            isAuthenticated: true,
                            isLoading: false,
                            error: null,
                        });
                    }
                } else {
                    setState(prev => ({ ...prev, isLoading: false }));
                }
            } catch (err) {
                console.error('Error getting session:', err);
                setState(prev => ({ ...prev, isLoading: false }));
            }
        };

        // Timeout de seguridad: si después de 3 segundos sigue cargando, liberar UI
        const safetyTimeout = setTimeout(() => {
            setState(prev => {
                if (prev.isLoading) {
                    console.warn('Safety timeout: releasing UI');
                    return { ...prev, isLoading: false };
                }
                return prev;
            });
        }, 3000);

        initSession().finally(() => clearTimeout(safetyTimeout));

        // Escuchar cambios de autenticación
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth event:', event);
                setSession(session);

                if (session?.user) {
                    try {
                        const user = await mapSupabaseUser(session.user);
                        setIsEmailVerified(!!session.user.email_confirmed_at);
                        setState({
                            user,
                            isAuthenticated: true,
                            isLoading: false,
                            error: null,
                        });
                    } catch (err) {
                        console.error('Error mapping user on change:', err);
                        // Fallback to basic user
                        setState({
                            user: {
                                id: session.user.id,
                                email: session.user.email || '',
                                name: session.user.email?.split('@')[0] || 'Usuario',
                                role: (session.user.user_metadata?.role || 'CLIENTE') as UserRole,
                                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`,
                                createdAt: new Date(session.user.created_at),
                            },
                            isAuthenticated: true,
                            isLoading: false,
                            error: null,
                        });
                    }
                } else {
                    setState({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: null,
                    });
                    setIsEmailVerified(false);
                }
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    /**
     * Inicia sesión con email y contraseña
     */
    const login = useCallback(async (credentials: LoginCredentials) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        // Timeout de seguridad de 30 segundos para evitar spinner infinito
        const safetyTimeout = setTimeout(() => {
            setState(prev => {
                if (prev.isLoading) {
                    console.warn('Login safety timeout triggered');
                    return { ...prev, isLoading: false, error: 'Timeout de conexión. Intenta de nuevo.' };
                }
                return prev;
            });
        }, 30000);

        try {
            const { data, error } = await supabaseAuth.signIn(credentials.email, credentials.password);

            if (error) {
                clearTimeout(safetyTimeout);
                throw new Error(
                    error.message === 'Invalid login credentials'
                        ? 'Credenciales inválidas. Verifica tu email y contraseña.'
                        : error.message
                );
            }

            if (!data.user) {
                clearTimeout(safetyTimeout);
                throw new Error('No se pudo obtener información del usuario');
            }

            // Login exitoso - limpiar timeout inmediatamente
            clearTimeout(safetyTimeout);

            // El estado se actualizará automáticamente por el listener onAuthStateChange
            // Forzamos isLoading a false después de un corto delay para asegurar que el UI responda
            setTimeout(() => {
                setState(prev => {
                    if (prev.isLoading && prev.user) {
                        return { ...prev, isLoading: false };
                    }
                    return prev;
                });
            }, 2000);
        } catch (error) {
            clearTimeout(safetyTimeout);
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Error al iniciar sesión',
            }));
            throw error;
        }
    }, []);

    /**
     * Registra un nuevo usuario
     */
    const register = useCallback(async (data: RegisterData) => {
        console.log('AuthContext: Starting registration for', data.email);
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            console.log('AuthContext: Calling supabaseAuth.signUp...');
            const { data: authData, error } = await supabaseAuth.signUp(
                data.email,
                data.password,
                {
                    name: data.name,
                    role: data.role || 'CLIENTE',
                    phone: data.phone
                }
            );

            console.log('AuthContext: signUp response:', { authData, error });

            if (error) {
                console.error('AuthContext: signUp error:', error);

                let errorMessage = error.message;
                if (error.message === 'User already registered') {
                    errorMessage = 'Este correo ya está registrado. Intenta iniciar sesión.';
                } else if (error.message.includes('rate limit')) {
                    errorMessage = 'Has excedido el límite de intentos de seguridad. Por favor espera unos minutos o intenta con otro correo.';
                } else if (error.message.includes('sending confirmation email')) {
                    errorMessage = 'Error de configuración: No se pudo enviar el email de confirmación (SMTP no configurado).';
                }

                throw new Error(errorMessage);
            }

            if (!authData.user) {
                console.error('AuthContext: No user in response');
                throw new Error('No se pudo crear el usuario');
            }

            console.log('AuthContext: User created successfully:', authData.user.id);
            console.log('AuthContext: Session present?', !!authData.session);

            // Verificar si requiere confirmación de email
            if (authData.user && !authData.session) {
                console.log('AuthContext: Email verification required, no session');
                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: null,
                }));
                // El usuario necesita verificar su email - esto NO es un error
                return;
            }

            console.log('AuthContext: Registration complete with session');
            // El estado se actualizará automáticamente por el listener
        } catch (error) {
            console.error('AuthContext: Registration catch block:', error);
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Error al registrarse',
            }));
            throw error;
        }
    }, []);

    /**
     * Cierra sesión
     */
    const logout = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true }));

        try {
            await supabaseAuth.signOut();
            // El estado se actualizará automáticamente por el listener
            // Safety fallback: si el listener no dispara en 1s, forzar logout
            setTimeout(() => {
                setState(prev => {
                    if (prev.isLoading) {
                        return {
                            user: null,
                            isAuthenticated: false,
                            isLoading: false,
                            error: null,
                        };
                    }
                    return prev;
                });
            }, 1000);
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Error al cerrar sesión',
            }));
        }
    }, []);

    /**
     * Reenvía email de verificación
     */
    const resendVerificationEmail = useCallback(async () => {
        if (!state.user?.email) {
            throw new Error('No hay email para verificar');
        }

        const { error } = await supabaseAuth.resendVerificationEmail(state.user.email);
        if (error) {
            throw new Error(error.message);
        }
    }, [state.user?.email]);

    /**
     * Verifica si el usuario actual tiene un rol específico
     */
    const hasRole = useCallback(
        (role: UserRole): boolean => {
            return state.user?.role === role;
        },
        [state.user]
    );

    /**
     * Verifica si el usuario actual tiene alguno de los roles especificados
     */
    const hasAnyRole = useCallback(
        (roles: UserRole[]): boolean => {
            return state.user ? roles.includes(state.user.role) : false;
        },
        [state.user]
    );

    /**
     * Limpia el error de autenticación actual
     */
    const clearError = useCallback(() => {
        setState(prev => ({ ...prev, error: null }));
    }, []);

    const value: AuthContextType = {
        ...state,
        login,
        register,
        logout,
        hasRole,
        hasAnyRole,
        clearError,
        resendVerificationEmail,
        isEmailVerified,
        session,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ==================== HOOKS ====================

/**
 * Hook para acceder al contexto de autenticación
 * 
 * @throws Error si se usa fuera del AuthProvider
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};

// ==================== COMPONENTES PROTEGIDOS ====================

interface ProtectedRouteProps {
    children: ReactNode;
    /** Roles permitidos para acceder a la ruta */
    allowedRoles?: UserRole[];
    /** Requiere email verificado */
    requireEmailVerification?: boolean;
    /** Componente a mostrar si no autorizado */
    fallback?: ReactNode;
}

/**
 * Componente para proteger rutas basado en autenticación y roles
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles,
    requireEmailVerification = false,
    fallback,
}) => {
    const { isAuthenticated, isLoading, user, isEmailVerified } = useAuth();

    // Mostrar loading mientras verifica autenticación
    if (isLoading) {
        return (
            <div style={{
                minHeight: '100vh',
                background: '#FAFAFA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    border: '4px solid #C5A059',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                }} />
            </div>
        );
    }

    // No autenticado
    if (!isAuthenticated) {
        return fallback ? <>{fallback}</> : <Navigate to="/login" replace />;
    }

    // Verificar email si es requerido
    if (requireEmailVerification && !isEmailVerified) {
        return (
            <div style={{
                minHeight: '100vh',
                background: '#FAFAFA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
            }}>
                <div style={{
                    textAlign: 'center',
                    maxWidth: '400px',
                    background: '#FFFFFF',
                    padding: '40px',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2C2C2C', marginBottom: '12px' }}>
                        Verifica tu correo
                    </h1>
                    <p style={{ color: '#5D5D5D', marginBottom: '20px' }}>
                        Por favor verifica tu correo electrónico para continuar.
                    </p>
                </div>
            </div>
        );
    }

    // Verificar roles si se especificaron
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return fallback ? (
            <>{fallback}</>
        ) : (
            <div style={{
                minHeight: '100vh',
                background: '#FAFAFA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 700, color: '#C5A059', marginBottom: '16px' }}>403</h1>
                    <p style={{ color: '#5D5D5D' }}>No tienes permisos para acceder a esta página</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default AuthContext;
