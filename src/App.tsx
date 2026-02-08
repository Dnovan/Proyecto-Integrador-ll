/**
 * @fileoverview Componente principal de la aplicación EventSpace
 * @description Configuración de rutas y layout principal
 * 
 * @iso25010
 * - Usabilidad: Navegación clara y estructura lógica
 * - Seguridad: Rutas protegidas por rol
 * - Mantenibilidad: Rutas centralizadas y organizadas
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ProtectedRoute, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/organisms/Navbar';
import { Footer } from './components/organisms/Footer';

// ==================== PÁGINAS ====================
import { ClientDashboardPage } from './pages/client/ClientDashboardPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ProviderLoginPage } from './pages/auth/ProviderLoginPage';
import { HomePage } from './pages/client/HomePage';
import { VenueDetailPage } from './pages/client/VenueDetailPage';
import { InstitutionPage } from './pages/client/InstitutionPage';
import { ServicesPage } from './pages/client/ServicesPage';
import { ContactPage } from './pages/client/ContactPage';
import { DashboardPro } from './pages/provider/DashboardPro';
import { AdminPanel } from './pages/admin/AdminPanel';
import { HelpCenterPage } from './pages/shared/HelpCenterPage';
import { AuthCallbackPage } from './pages/auth/AuthCallbackPage';
import RegisterProviderPage from './pages/auth/RegisterProviderPage';
import { ProviderDashboardPage } from './pages/provider/ProviderDashboardPage';
import BookingConfirmedPage from './pages/booking/BookingConfirmedPage';
import BookingPendingPage from './pages/booking/BookingPendingPage';
import BookingFailedPage from './pages/booking/BookingFailedPage';
import BookingDetailPage from './pages/booking/BookingDetailPage';
import { ProviderVenuesPage } from './pages/provider/ProviderVenuesPage';
import { CreateVenuePage } from './pages/provider/CreateVenuePage';
import { EditVenuePage } from './pages/provider/EditVenuePage';
import { ProviderBookingsPage } from './pages/provider/ProviderBookingsPage';
import { ExplorePage } from './pages/client/ExplorePage';
import { ClientBookingsPage } from './pages/client/ClientBookingsPage'; // Importación añadida

// ==================== RUTAS ====================

// ==================== LAYOUT ====================

/**
 * Layout principal con Navbar y Footer - Diseño Premium Blanco
 */
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ minHeight: '100vh', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
    <Navbar />
    <main style={{ flex: 1, paddingTop: '72px' }}>{children}</main>
    <Footer />
  </div>
);

/**
 * Layout para páginas de autenticación (sin navbar/footer)
 * Fondo blanco para el diseño premium
 */
const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen" style={{ background: '#FFFFFF' }}>{children}</div>
);

/**
 * Layout para admin (sin footer)
 */
const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-black flex flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
  </div>
);

/**
 * Componente de rutas con lógica de redirección basada en rol
 */
const AppRoutes: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-neon border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }



  return (
    <Routes>
      {/* Autenticación */}
      <Route
        path="/login"
        element={
          <AuthLayout>
            <LoginPage />
          </AuthLayout>
        }
      />
      <Route
        path="/registro"
        element={
          <AuthLayout>
            <RegisterPage />
          </AuthLayout>
        }
      />
      <Route
        path="/login/proveedor"
        element={
          <AuthLayout>
            <ProviderLoginPage />
          </AuthLayout>
        }
      />
      <Route
        path="/auth/callback"
        element={
          <AuthLayout>
            <AuthCallbackPage />
          </AuthLayout>
        }
      />
      <Route
        path="/registro/proveedor"
        element={
          <AuthLayout>
            <RegisterProviderPage />
          </AuthLayout>
        }
      />
      <Route
        path="/provider-dashboard"
        element={
          <ProtectedRoute allowedRoles={['PROVEEDOR']}>
            <MainLayout>
              <ProviderDashboardPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Home - Landing para visitantes, Dashboard para clientes */}
      <Route
        path="/"
        element={
          isAuthenticated && user?.role === 'CLIENTE' ? (
            <Navigate to="/client-dashboard" replace />
          ) : (
            <MainLayout>
              <HomePage />
            </MainLayout>
          )
        }
      />

      {/* Dashboard de Cliente */}
      <Route
        path="/client-dashboard"
        element={
          <ProtectedRoute allowedRoles={['CLIENTE']}>
            <MainLayout>
              <ClientDashboardPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Mis Reservaciones (Cliente) */}
      <Route
        path="/mis-reservaciones"
        element={
          <ProtectedRoute allowedRoles={['CLIENTE']}>
            <MainLayout>
              <ClientBookingsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Detalle de local - público */}
      <Route
        path="/local/:id"
        element={
          <MainLayout>
            <VenueDetailPage />
          </MainLayout>
        }
      />

      {/* Búsqueda - público */}
      <Route
        path="/buscar"
        element={
          <MainLayout>
            <ExplorePage />
          </MainLayout>
        }
      />

      {/* Ayuda - público */}
      <Route
        path="/ayuda"
        element={
          <MainLayout>
            <HelpCenterPage />
          </MainLayout>
        }
      />

      {/* Institución - público */}
      <Route
        path="/institucion"
        element={
          <MainLayout>
            <InstitutionPage />
          </MainLayout>
        }
      />

      {/* Servicios - público */}
      <Route
        path="/servicios"
        element={
          <MainLayout>
            <ServicesPage />
          </MainLayout>
        }
      />

      {/* Contacto - público */}
      <Route
        path="/contacto"
        element={
          <MainLayout>
            <ContactPage />
          </MainLayout>
        }
      />

      {/* Rutas de Reserva/Pago - Mercado Pago */}
      <Route path="/reserva/confirmada" element={<BookingConfirmedPage />} />
      <Route path="/reserva/pendiente" element={<BookingPendingPage />} />
      <Route path="/reserva/fallida" element={<BookingFailedPage />} />

      {/* ==================== RUTAS PROTEGIDAS - PROVEEDOR ==================== */}
      <Route
        path="/proveedor"
        element={
          <ProtectedRoute allowedRoles={['PROVEEDOR']}>
            <MainLayout>
              <DashboardPro />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Mis Locales */}
      <Route
        path="/proveedor/locales"
        element={
          <ProtectedRoute allowedRoles={['PROVEEDOR']}>
            <MainLayout>
              <ProviderVenuesPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Publicar Nuevo Local */}
      <Route
        path="/proveedor/publicar"
        element={
          <ProtectedRoute allowedRoles={['PROVEEDOR']}>
            <MainLayout>
              <CreateVenuePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Editar Local */}
      <Route
        path="/proveedor/locales/:id/editar"
        element={
          <ProtectedRoute allowedRoles={['PROVEEDOR']}>
            <MainLayout>
              <EditVenuePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Mis Reservaciones */}
      <Route
        path="/proveedor/reservaciones"
        element={
          <ProtectedRoute allowedRoles={['PROVEEDOR']}>
            <MainLayout>
              <ProviderBookingsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Detalle de Reserva */}
      <Route
        path="/reserva/:id"
        element={
          <ProtectedRoute allowedRoles={['PROVEEDOR', 'CLIENTE']}>
            <MainLayout>
              <BookingDetailPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />


      {/* ==================== RUTAS PROTEGIDAS - ADMIN ==================== */}
      <Route
        path="/admin-panel"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout>
              <AdminPanel />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 - Redirigir a home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// ==================== APP ====================

/**
 * Componente raíz de la aplicación
 */
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
