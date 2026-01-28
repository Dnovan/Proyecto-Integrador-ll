/**
 * @fileoverview Servicio de Autenticación con Supabase
 * @description Maneja login, registro y gestión de sesión con Supabase Auth
 */

import { supabase } from '../lib/supabase';
import type { User, LoginCredentials, RegisterData, UserRole } from '../types';

// ==================== SERVICIOS ====================

/**
 * Inicia sesión con email y contraseña
 */
export const login = async (credentials: LoginCredentials): Promise<User> => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
    });

    if (error) {
        throw new Error(translateError(error.message));
    }

    if (!data.user) {
        throw new Error('No se pudo iniciar sesión');
    }

    // Obtener datos adicionales del usuario desde la tabla users
    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

    if (userError || !userData) {
        // Si no existe en la tabla users, crear el registro
        const newUser: User = {
            id: data.user.id,
            email: data.user.email || credentials.email,
            name: data.user.user_metadata?.name || 'Usuario',
            role: (data.user.user_metadata?.role as UserRole) || 'CLIENTE',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.email}`,
            createdAt: new Date(data.user.created_at),
        };
        return newUser;
    }

    return {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role as UserRole,
        phone: userData.phone || undefined,
        avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`,
        createdAt: new Date(userData.created_at),
        verificationStatus: userData.verification_status || undefined,
    };
};

/**
 * Registra un nuevo usuario (solo clientes pueden auto-registrarse)
 */
export const register = async (data: RegisterData): Promise<User> => {
    const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            data: {
                name: data.name,
                role: 'CLIENTE',
            },
        },
    });

    if (error) {
        throw new Error(translateError(error.message));
    }

    if (!authData.user) {
        throw new Error('No se pudo crear la cuenta');
    }

    // Crear registro en la tabla users
    const newUser = {
        id: authData.user.id,
        email: data.email,
        name: data.name,
        role: 'CLIENTE' as UserRole,
        phone: data.phone || undefined,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name.replace(' ', '')}`,
    };

    const { error: insertError } = await supabase
        .from('users')
        .insert(newUser);

    if (insertError) {
        console.error('Error creating user profile:', insertError);
    }

    return {
        ...newUser,
        createdAt: new Date(),
    };
};

/**
 * Cierra sesión
 */
export const logout = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        throw new Error('Error al cerrar sesión');
    }
};

/**
 * Obtiene la sesión actual
 */
export const getCurrentSession = async (): Promise<User | null> => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
        return null;
    }

    // Obtener datos adicionales
    const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

    if (userData) {
        return {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            role: userData.role as UserRole,
            phone: userData.phone || undefined,
            avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`,
            createdAt: new Date(userData.created_at),
            verificationStatus: userData.verification_status || undefined,
        };
    }

    // Fallback a datos del auth
    return {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata?.name || 'Usuario',
        role: (session.user.user_metadata?.role as UserRole) || 'CLIENTE',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`,
        createdAt: new Date(session.user.created_at),
    };
};

/**
 * Escucha cambios en el estado de autenticación
 */
export const onAuthStateChange = (callback: (user: User | null) => void) => {
    return supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
            const user = await getCurrentSession();
            callback(user);
        } else {
            callback(null);
        }
    });
};

// ==================== HELPERS ====================

/**
 * Traduce errores de Supabase al español
 */
const translateError = (message: string): string => {
    const translations: Record<string, string> = {
        'Invalid login credentials': 'Credenciales inválidas',
        'Email not confirmed': 'Por favor confirma tu email para continuar',
        'User already registered': 'Este email ya está registrado',
        'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
        'Unable to validate email address: invalid format': 'Formato de email inválido',
        'Signup requires a valid password': 'Se requiere una contraseña válida',
    };

    return translations[message] || message;
};

export default {
    login,
    register,
    logout,
    getCurrentSession,
    onAuthStateChange,
};
