/**
 * @fileoverview Panel de Super-Administrador
 * @description Interfaz de administración con estilo consola/técnico
 * 
 * @iso25010
 * - Seguridad: Acceso restringido solo a rol ADMIN
 * - Usabilidad: Interfaz densa pero organizada para gestión eficiente
 */

import React, { useState, useEffect } from 'react';
import {
    Users,
    Building2,
    TrendingUp,
    Shield,
    UserPlus,
    Ban,
    Star,
    RefreshCw,
    Check,
    Terminal,
    Activity,
} from 'lucide-react';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import { Badge } from '../../components/atoms/Badge';
import { Input } from '../../components/atoms/Input';
import { Avatar } from '../../components/atoms/Avatar';
import * as api from '../../services/mockApi';
import type { User, Venue, AdminMetrics } from '../../types';

// ==================== COMPONENTES INTERNOS ====================

/**
 * Componente de métricas con estilo consola
 */
const AdminMetricCard: React.FC<{
    label: string;
    value: number | string;
    icon: React.ReactNode;
    trend?: number;
}> = ({ label, value, icon, trend }) => (
    <div className="bg-admin-bg border border-admin-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
            <span className="text-text-muted text-sm font-mono">{label}</span>
            <div className="text-admin-accent">{icon}</div>
        </div>
        <p className="text-2xl font-bold text-text-primary font-mono">{value}</p>
        {trend !== undefined && (
            <p className={`text-xs mt-1 ${trend >= 0 ? 'text-success' : 'text-error'}`}>
                {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs mes anterior
            </p>
        )}
    </div>
);

// ==================== PANEL ADMIN ====================

export const AdminPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'users' | 'inventory' | 'metrics'>('users');
    const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [venues, setVenues] = useState<Venue[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Estado para crear proveedor
    const [newProvider, setNewProvider] = useState({
        email: '',
        name: '',
        phone: '',
        verified: true,
    });
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [createError, setCreateError] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [metricsData, usersData, venuesData] = await Promise.all([
                api.getAdminMetrics(),
                api.getAllUsers(),
                api.getAllVenues(),
            ]);
            setMetrics(metricsData);
            setUsers(usersData);
            setVenues(venuesData);
        } catch (error) {
            console.error('Error loading admin data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await loadData();
        setIsRefreshing(false);
    };

    const handleCreateProvider = async () => {
        if (!newProvider.email || !newProvider.name) {
            setCreateError('Email y nombre son requeridos');
            return;
        }

        try {
            const user = await api.createProvider(
                newProvider.email,
                newProvider.name,
                newProvider.phone,
                newProvider.verified
            );
            setUsers((prev) => [...prev, user]);
            setNewProvider({ email: '', name: '', phone: '', verified: true });
            setShowCreateForm(false);
            setCreateError('');
        } catch (error) {
            setCreateError(error instanceof Error ? error.message : 'Error al crear proveedor');
        }
    };

    const handleUpdateVenueStatus = async (venueId: string, status: 'ACTIVE' | 'BANNED' | 'FEATURED') => {
        try {
            const updated = await api.updateVenueStatus(venueId, status);
            setVenues((prev) =>
                prev.map((v) => (v.id === venueId ? updated : v))
            );
        } catch (error) {
            console.error('Error updating venue status:', error);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const tabs = [
        { id: 'users', label: 'User Factory', icon: <Users className="w-4 h-4" /> },
        { id: 'inventory', label: 'Inventory Control', icon: <Building2 className="w-4 h-4" /> },
        { id: 'metrics', label: 'Metrics Overview', icon: <Activity className="w-4 h-4" /> },
    ] as const;

    return (
        <div className="min-h-screen bg-black pt-20 pb-12 font-mono">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header estilo consola */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-admin-accent/10 rounded-lg border border-admin-accent/30">
                            <Shield className="w-8 h-8 text-admin-accent" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                                <Terminal className="w-6 h-6 text-admin-accent" />
                                ADMIN_PANEL
                            </h1>
                            <p className="text-text-muted text-sm">
                                <span className="text-admin-accent">$</span> EventSpace System Control
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                    >
                        Sync
                    </Button>
                </div>

                {/* Tabs estilo terminal */}
                <div className="flex gap-2 mb-6 border-b border-admin-border pb-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm
                transition-all duration-200
                ${activeTab === tab.id
                                    ? 'bg-admin-accent/20 text-admin-accent border border-admin-accent/50'
                                    : 'text-text-muted hover:text-text-primary hover:bg-admin-bg'
                                }
              `}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Contenido de tabs */}
                {activeTab === 'users' && (
                    <div className="space-y-6">
                        {/* Crear proveedor */}
                        <Card variant="default" className="bg-admin-bg border-admin-border">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                                    <UserPlus className="w-5 h-5 text-admin-accent" />
                                    User Factory - Crear Proveedor
                                </h2>
                                <Button
                                    variant={showCreateForm ? 'ghost' : 'primary'}
                                    size="sm"
                                    onClick={() => setShowCreateForm(!showCreateForm)}
                                >
                                    {showCreateForm ? 'Cancelar' : 'Nuevo Proveedor'}
                                </Button>
                            </div>

                            {showCreateForm && (
                                <div className="grid md:grid-cols-4 gap-4 p-4 bg-bg-primary rounded-lg border border-admin-border">
                                    <Input
                                        placeholder="Email *"
                                        value={newProvider.email}
                                        onChange={(e) =>
                                            setNewProvider((prev) => ({ ...prev, email: e.target.value }))
                                        }
                                    />
                                    <Input
                                        placeholder="Nombre completo *"
                                        value={newProvider.name}
                                        onChange={(e) =>
                                            setNewProvider((prev) => ({ ...prev, name: e.target.value }))
                                        }
                                    />
                                    <Input
                                        placeholder="Teléfono"
                                        value={newProvider.phone}
                                        onChange={(e) =>
                                            setNewProvider((prev) => ({ ...prev, phone: e.target.value }))
                                        }
                                    />
                                    <div className="flex items-center gap-3">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={newProvider.verified}
                                                onChange={(e) =>
                                                    setNewProvider((prev) => ({ ...prev, verified: e.target.checked }))
                                                }
                                                className="w-4 h-4 accent-neon"
                                            />
                                            <span className="text-text-secondary text-sm">Verificado</span>
                                        </label>
                                        <Button onClick={handleCreateProvider}>Crear</Button>
                                    </div>
                                    {createError && (
                                        <p className="col-span-4 text-error text-sm">{createError}</p>
                                    )}
                                </div>
                            )}
                        </Card>

                        {/* Tabla de usuarios */}
                        <Card variant="default" className="bg-admin-bg border-admin-border overflow-hidden">
                            <h2 className="text-lg font-semibold text-text-primary mb-4">
                                Usuarios Registrados ({users.length})
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-admin-border">
                                            <th className="text-left py-3 px-4 text-text-muted font-medium">Usuario</th>
                                            <th className="text-left py-3 px-4 text-text-muted font-medium">Email</th>
                                            <th className="text-left py-3 px-4 text-text-muted font-medium">Rol</th>
                                            <th className="text-left py-3 px-4 text-text-muted font-medium">Estado</th>
                                            <th className="text-left py-3 px-4 text-text-muted font-medium">Fecha</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading ? (
                                            Array.from({ length: 3 }).map((_, i) => (
                                                <tr key={i} className="border-b border-admin-border">
                                                    <td colSpan={5} className="py-4 px-4">
                                                        <div className="h-6 bg-bg-card rounded animate-pulse" />
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            users.map((user) => (
                                                <tr
                                                    key={user.id}
                                                    className="border-b border-admin-border hover:bg-bg-secondary/50 transition-colors"
                                                >
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar src={user.avatar} name={user.name} size="sm" />
                                                            <span className="text-text-primary">{user.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-text-secondary font-mono text-xs">
                                                        {user.email}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <Badge
                                                            variant={
                                                                user.role === 'ADMIN'
                                                                    ? 'error'
                                                                    : user.role === 'PROVEEDOR'
                                                                        ? 'neon'
                                                                        : 'default'
                                                            }
                                                            size="sm"
                                                        >
                                                            {user.role}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        {user.role === 'PROVEEDOR' && (
                                                            <Badge
                                                                variant={user.verificationStatus === 'VERIFIED' ? 'success' : 'warning'}
                                                                size="sm"
                                                                icon={user.verificationStatus === 'VERIFIED' ? <Check className="w-3 h-3" /> : undefined}
                                                            >
                                                                {user.verificationStatus || 'N/A'}
                                                            </Badge>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-4 text-text-muted text-xs">
                                                        {new Date(user.createdAt).toLocaleDateString('es-MX')}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'inventory' && (
                    <Card variant="default" className="bg-admin-bg border-admin-border overflow-hidden">
                        <h2 className="text-lg font-semibold text-text-primary mb-4">
                            Inventory Control - Locales ({venues.length})
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-admin-border">
                                        <th className="text-left py-3 px-4 text-text-muted font-medium">Local</th>
                                        <th className="text-left py-3 px-4 text-text-muted font-medium">Proveedor</th>
                                        <th className="text-left py-3 px-4 text-text-muted font-medium">Precio</th>
                                        <th className="text-left py-3 px-4 text-text-muted font-medium">Rating</th>
                                        <th className="text-left py-3 px-4 text-text-muted font-medium">Estado</th>
                                        <th className="text-left py-3 px-4 text-text-muted font-medium">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        Array.from({ length: 5 }).map((_, i) => (
                                            <tr key={i} className="border-b border-admin-border">
                                                <td colSpan={6} className="py-4 px-4">
                                                    <div className="h-6 bg-bg-card rounded animate-pulse" />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        venues.map((venue) => (
                                            <tr
                                                key={venue.id}
                                                className="border-b border-admin-border hover:bg-bg-secondary/50 transition-colors"
                                            >
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={venue.images[0]}
                                                            alt={venue.name}
                                                            className="w-10 h-10 object-cover rounded"
                                                        />
                                                        <div>
                                                            <p className="text-text-primary font-medium truncate max-w-[200px]">
                                                                {venue.name}
                                                            </p>
                                                            <p className="text-text-muted text-xs">{venue.zone}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-text-secondary">
                                                    {venue.providerName}
                                                </td>
                                                <td className="py-3 px-4 text-neon font-mono">
                                                    {formatPrice(venue.price)}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 text-neon fill-current" />
                                                        <span className="text-text-primary">{venue.rating.toFixed(1)}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Badge
                                                        variant={
                                                            venue.status === 'BANNED'
                                                                ? 'error'
                                                                : venue.status === 'FEATURED'
                                                                    ? 'neon'
                                                                    : 'default'
                                                        }
                                                        size="sm"
                                                    >
                                                        {venue.status}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex gap-2">
                                                        {venue.status !== 'BANNED' ? (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-error hover:bg-error/10"
                                                                leftIcon={<Ban className="w-4 h-4" />}
                                                                onClick={() => handleUpdateVenueStatus(venue.id, 'BANNED')}
                                                            >
                                                                Ban
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-success hover:bg-success/10"
                                                                leftIcon={<Check className="w-4 h-4" />}
                                                                onClick={() => handleUpdateVenueStatus(venue.id, 'ACTIVE')}
                                                            >
                                                                Activar
                                                            </Button>
                                                        )}
                                                        {venue.status !== 'FEATURED' && venue.status !== 'BANNED' && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-neon hover:bg-neon/10"
                                                                leftIcon={<Star className="w-4 h-4" />}
                                                                onClick={() => handleUpdateVenueStatus(venue.id, 'FEATURED')}
                                                            >
                                                                Destacar
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}

                {activeTab === 'metrics' && metrics && (
                    <div className="space-y-6">
                        {/* Grid de métricas */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <AdminMetricCard
                                label="TOTAL_USERS"
                                value={metrics.totalUsers}
                                icon={<Users className="w-5 h-5" />}
                                trend={15.2}
                            />
                            <AdminMetricCard
                                label="TOTAL_VENUES"
                                value={metrics.totalVenues}
                                icon={<Building2 className="w-5 h-5" />}
                                trend={8.5}
                            />
                            <AdminMetricCard
                                label="TOTAL_BOOKINGS"
                                value={metrics.totalBookings}
                                icon={<TrendingUp className="w-5 h-5" />}
                                trend={22.1}
                            />
                            <AdminMetricCard
                                label="REVENUE_MXN"
                                value={formatPrice(metrics.revenue)}
                                icon={<Activity className="w-5 h-5" />}
                                trend={18.3}
                            />
                        </div>

                        {/* Gráficas simplificadas */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card variant="default" className="bg-admin-bg border-admin-border">
                                <h3 className="text-lg font-semibold text-text-primary mb-4">
                                    User Growth
                                </h3>
                                <div className="flex items-end gap-2 h-40">
                                    {metrics.userGrowth.map((item, idx) => (
                                        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                                            <div
                                                className="w-full bg-admin-accent/80 rounded-t transition-all"
                                                style={{ height: `${(item.count / 150) * 100}%` }}
                                            />
                                            <span className="text-xs text-text-muted">{item.month}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card variant="default" className="bg-admin-bg border-admin-border">
                                <h3 className="text-lg font-semibold text-text-primary mb-4">
                                    Bookings by Month
                                </h3>
                                <div className="flex items-end gap-2 h-40">
                                    {metrics.bookingsByMonth.map((item, idx) => (
                                        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                                            <div
                                                className="w-full bg-neon/80 rounded-t transition-all"
                                                style={{ height: `${(item.count / 40) * 100}%` }}
                                            />
                                            <span className="text-xs text-text-muted">{item.month}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>

                        {/* Stats adicionales */}
                        <Card variant="default" className="bg-admin-bg border-admin-border">
                            <h3 className="text-lg font-semibold text-text-primary mb-4">
                                Platform Stats
                            </h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="p-4 bg-bg-primary rounded-lg border border-admin-border">
                                    <p className="text-text-muted text-sm">Clientes Activos</p>
                                    <p className="text-2xl font-bold text-text-primary">{metrics.totalClients}</p>
                                </div>
                                <div className="p-4 bg-bg-primary rounded-lg border border-admin-border">
                                    <p className="text-text-muted text-sm">Proveedores Activos</p>
                                    <p className="text-2xl font-bold text-text-primary">{metrics.totalProviders}</p>
                                </div>
                                <div className="p-4 bg-bg-primary rounded-lg border border-admin-border">
                                    <p className="text-text-muted text-sm">Reservaciones Completadas</p>
                                    <p className="text-2xl font-bold text-success">{metrics.completedBookings}</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
