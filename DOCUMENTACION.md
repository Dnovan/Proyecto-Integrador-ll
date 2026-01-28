# 📋 Documentación del Proyecto EventSpace

## 🎯 Descripción General

**EventSpace** es una plataforma premium de renta de locales para eventos en México. Este frontend fue desarrollado con arquitectura modular (Atomic Design) preparado para integrarse con un backend en .NET 9.

---

## 🛠️ Stack Tecnológico

### Lenguajes de Programación
| Lenguaje | Uso |
|----------|-----|
| **TypeScript** | Lenguaje principal para toda la lógica de la aplicación |
| **TSX** | Sintaxis JSX tipada para componentes React |
| **CSS** | Estilos globales con variables CSS personalizadas |
| **HTML** | Estructura base del documento (index.html) |

### Frameworks y Librerías
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 19.0.0 | Biblioteca de UI para componentes |
| **Vite** | 6.2.1 | Build tool y servidor de desarrollo |
| **React Router DOM** | 7.x | Navegación SPA |
| **TailwindCSS** | 4.x | Framework de utilidades CSS |
| **Lucide React** | - | Iconografía SVG |

### Herramientas de Desarrollo
- **ESLint** - Linting de código
- **TypeScript ESLint** - Reglas de TypeScript para ESLint
- **PostCSS** - Procesamiento de CSS

---

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── atoms/           # Componentes básicos reutilizables
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Avatar.tsx
│   │   ├── Skeleton.tsx
│   │   └── index.ts
│   ├── molecules/       # Combinaciones de átomos
│   │   ├── SearchBar.tsx
│   │   ├── StarRating.tsx
│   │   ├── NavItem.tsx
│   │   └── index.ts
│   └── organisms/       # Componentes complejos
│       ├── Navbar.tsx
│       ├── PropertyCard.tsx
│       ├── Footer.tsx
│       └── index.ts
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── client/
│   │   ├── HomePage.tsx
│   │   └── VenueDetailPage.tsx
│   ├── provider/
│   │   └── DashboardPro.tsx
│   ├── admin/
│   │   └── AdminPanel.tsx
│   └── shared/
│       └── HelpCenterPage.tsx
├── context/
│   └── AuthContext.tsx  # Estado global de autenticación
├── services/
│   └── mockApi.ts       # API simulada con datos de prueba
├── types/
│   └── index.ts         # Interfaces TypeScript
├── App.tsx              # Componente raíz con enrutamiento
├── main.tsx             # Punto de entrada
└── index.css            # Estilos globales y tema
```

---

## 🎨 Sistema de Diseño

### Paleta de Colores
```css
--color-bg-primary: #000000;      /* Fondo principal */
--color-bg-secondary: #0a0a0a;    /* Fondo secundario */
--color-neon: #39FF14;            /* Verde neón (accent) */
--color-text-primary: #ffffff;    /* Texto principal */
--color-text-secondary: #a3a3a3;  /* Texto secundario */
```

### Tipografía
- **Fuente Principal**: Inter (Google Fonts)
- **Pesos**: 400, 500, 600, 700, 800, 900

### Estilo Visual
- **Brutalismo Moderno** con acentos neón
- **Glassmorphism** en modales y cards
- **Bordes redondeados** (rounded-2xl)
- **Efectos hover** con brillo neón

---

## 🧩 Componentes Desarrollados

### Átomos (6 componentes)

| Componente | Archivo | Descripción |
|------------|---------|-------------|
| **Button** | `Button.tsx` | Botón con 5 variantes (primary, secondary, outline, ghost, danger), 3 tamaños, estados loading/disabled |
| **Input** | `Input.tsx` | Campo de entrada con label, error, iconos izquierda/derecha, accesibilidad ARIA |
| **Card** | `Card.tsx` | Contenedor con 4 variantes (default, glass, outline, elevated), efectos hover |
| **Badge** | `Badge.tsx` | Etiqueta con 6 variantes de color, animación pulse |
| **Avatar** | `Avatar.tsx` | Imagen de perfil con fallback a iniciales, indicador online |
| **Skeleton** | `Skeleton.tsx` | Placeholder de carga con variantes text, circular, rectangular |

### Moléculas (3 componentes)

| Componente | Archivo | Descripción |
|------------|---------|-------------|
| **SearchBar** | `SearchBar.tsx` | Barra de búsqueda con filtros expandibles (zona, categoría, precio) |
| **StarRating** | `StarRating.tsx` | Sistema de calificación interactivo o de solo lectura |
| **NavItem** | `NavItem.tsx` | Item de navegación con icono, badge y estado activo |

### Organismos (3 componentes)

| Componente | Archivo | Descripción |
|------------|---------|-------------|
| **Navbar** | `Navbar.tsx` | Navegación principal responsive, menú adaptado por rol |
| **PropertyCard** | `PropertyCard.tsx` | Tarjeta de local con galería, rating, precio, favoritos |
| **Footer** | `Footer.tsx` | Pie de página con enlaces, contacto y redes sociales |

---

## 📄 Páginas Implementadas

### Autenticación
| Página | Ruta | Descripción |
|--------|------|-------------|
| **LoginPage** | `/login` | Formulario de inicio de sesión con validación |
| **RegisterPage** | `/registro` | Registro solo para clientes (proveedores vía admin) |

### Cliente
| Página | Ruta | Descripción |
|--------|------|-------------|
| **HomePage** | `/` | Hero, búsqueda, secciones de locales recientes/recomendados |
| **VenueDetailPage** | `/local/:id` | Galería, descripción, calendario de disponibilidad, reseñas |

### Proveedor
| Página | Ruta | Descripción |
|--------|------|-------------|
| **DashboardPro** | `/proveedor` | Métricas en tiempo real, mis locales, reservaciones |

### Administrador
| Página | Ruta | Descripción |
|--------|------|-------------|
| **AdminPanel** | `/admin-panel` | User Factory, Inventory Control, Metrics Overview |

### Compartidas
| Página | Ruta | Descripción |
|--------|------|-------------|
| **HelpCenterPage** | `/ayuda` | FAQ interactivo con búsqueda |

---

## 🔐 Sistema de Autenticación

### Roles de Usuario
| Rol | Permisos |
|-----|----------|
| **CLIENTE** | Buscar locales, reservar, enviar mensajes |
| **PROVEEDOR** | Dashboard, publicar locales, gestionar reservaciones |
| **ADMIN** | Panel de control total, crear proveedores, banear/destacar locales |

### Credenciales de Prueba
```
Cliente:   cliente@eventspace.com / cliente123
Proveedor: proveedor@eventspace.com / proveedor123
Admin:     admin@eventspace.com / admin123
```

### Características de Seguridad
- Persistencia en `localStorage`
- Rutas protegidas por rol (`ProtectedRoute`)
- Redirección automática según rol después del login

---

## 📊 Mock API

El archivo `mockApi.ts` contiene ~900 líneas con:

### Datos de Prueba
- 5 usuarios (1 cliente, 1 proveedor, 1 admin, 2 adicionales)
- 5 locales con imágenes reales de Unsplash
- 3 reseñas
- 2 reservaciones
- 1 conversación con 4 mensajes
- 5 preguntas frecuentes

### Endpoints Simulados (19 funciones)
```typescript
// Autenticación
login(), register(), logout()

// Locales
getVenues(), getVenueById(), getRecentlyViewed(), 
getRecommendedVenues(), getVenueAvailability(), getVenueReviews()

// Reservaciones
getUserBookings(), getProviderBookings(), createBooking()

// Mensajería
getConversations(), getMessages(), sendMessage()

// Métricas
getProviderMetrics(), getAdminMetrics()

// Administración
getAllUsers(), getAllVenues(), createProvider(), 
updateVenueStatus(), getFAQs(), getProviderVenues()
```

---

## 📐 Interfaces TypeScript

El archivo `types/index.ts` define 15+ interfaces:

```typescript
// Usuarios y autenticación
User, UserRole, VerificationStatus
LoginCredentials, RegisterData

// Locales
Venue, VenueCategory, VenueStatus, PaymentMethod

// Reservaciones
Booking, BookingStatus

// Mensajería
Message, Conversation, ConversationParticipant

// Reseñas
Review

// Búsqueda
SearchFilters, DateAvailability

// Métricas
ProviderMetrics, AdminMetrics

// Ayuda
FAQItem

// Utilidades
PaginatedResponse<T>
```

---

## 🚀 Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

---

## 📝 Cumplimiento ISO/IEC 25010

Todos los componentes incluyen documentación JSDoc con notas sobre:

| Característica | Implementación |
|----------------|----------------|
| **Usabilidad** | Formularios claros, feedback visual, navegación intuitiva |
| **Seguridad** | RBAC, rutas protegidas, validación de entrada |
| **Rendimiento** | Skeleton loaders, lazy loading, optimización de renders |
| **Mantenibilidad** | Arquitectura modular, código tipado, comentarios |
| **Accesibilidad** | Atributos ARIA, roles, estados focusables |

---

## 📦 Archivos de Configuración

| Archivo | Propósito |
|---------|-----------|
| `vite.config.ts` | Configuración de Vite con plugin Tailwind |
| `tailwind.config.js` | Tema personalizado, colores, animaciones |
| `tsconfig.json` | Configuración de TypeScript |
| `package.json` | Dependencias y scripts |
| `index.html` | HTML base con fuente Inter |

---

## 🔗 Integración con Backend .NET 9

Para conectar con el backend, reemplazar las funciones en `mockApi.ts` con llamadas reales:

```typescript
// Ejemplo de migración
export const login = async (credentials: LoginCredentials): Promise<User> => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  
  if (!response.ok) throw new Error('Credenciales inválidas');
  return response.json();
};
```

---

## 📅 Fecha de Desarrollo

**Enero 2026**

---

## 👨‍💻 Desarrollado con

- React 19
- TypeScript 5.7
- Vite 6.2
- TailwindCSS 4.x
- Lucide React Icons
