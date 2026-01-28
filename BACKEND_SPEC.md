# 🔧 Especificación del Backend para EventSpace

## 📋 Resumen

Este documento define los endpoints, modelos y servicios necesarios para el backend en **.NET 9** que dará soporte al frontend de EventSpace.

---

## 🏗️ Arquitectura Sugerida

```
EventSpace.API/
├── Controllers/
│   ├── AuthController.cs
│   ├── VenuesController.cs
│   ├── BookingsController.cs
│   ├── MessagesController.cs
│   ├── UsersController.cs
│   └── AdminController.cs
├── Models/
│   ├── Entities/
│   │   ├── User.cs
│   │   ├── Venue.cs
│   │   ├── Booking.cs
│   │   ├── Review.cs
│   │   ├── Message.cs
│   │   ├── Conversation.cs
│   │   └── FAQ.cs
│   └── DTOs/
│       ├── Auth/
│       ├── Venues/
│       ├── Bookings/
│       └── Messages/
├── Services/
│   ├── Interfaces/
│   └── Implementations/
├── Data/
│   └── ApplicationDbContext.cs
├── Middleware/
│   └── JwtMiddleware.cs
└── Helpers/
    └── JwtHelper.cs
```

---

## 👥 Modelos de Entidades

### User
```csharp
public class User
{
    public string Id { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public string Name { get; set; }
    public string Phone { get; set; }
    public string Avatar { get; set; }
    public UserRole Role { get; set; }  // CLIENTE, PROVEEDOR, ADMIN
    public VerificationStatus? VerificationStatus { get; set; }  // Solo proveedores
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    // Navegación
    public ICollection<Venue> Venues { get; set; }  // Si es proveedor
    public ICollection<Booking> Bookings { get; set; }  // Si es cliente
}

public enum UserRole { CLIENTE, PROVEEDOR, ADMIN }
public enum VerificationStatus { PENDING, VERIFIED, REJECTED }
```

### Venue
```csharp
public class Venue
{
    public string Id { get; set; }
    public string ProviderId { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Address { get; set; }
    public string Zone { get; set; }
    public VenueCategory Category { get; set; }
    public decimal Price { get; set; }
    public int Capacity { get; set; }
    public List<string> Images { get; set; }
    public List<PaymentMethod> PaymentMethods { get; set; }
    public List<string> Amenities { get; set; }
    public VenueStatus Status { get; set; }
    public double Rating { get; set; }
    public int ReviewCount { get; set; }
    public int Views { get; set; }
    public int Favorites { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Navegación
    public User Provider { get; set; }
    public ICollection<Review> Reviews { get; set; }
    public ICollection<Booking> Bookings { get; set; }
}

public enum VenueCategory 
{ 
    SALON_EVENTOS, JARDIN, TERRAZA, HACIENDA, BODEGA, RESTAURANTE, HOTEL 
}

public enum VenueStatus { PENDING, ACTIVE, FEATURED, BANNED }
public enum PaymentMethod { TRANSFERENCIA, EFECTIVO }
```

### Booking
```csharp
public class Booking
{
    public string Id { get; set; }
    public string VenueId { get; set; }
    public string ClientId { get; set; }
    public string ProviderId { get; set; }
    public DateTime Date { get; set; }
    public BookingStatus Status { get; set; }
    public decimal TotalPrice { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public string Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    
    // Navegación
    public Venue Venue { get; set; }
    public User Client { get; set; }
    public User Provider { get; set; }
}

public enum BookingStatus { PENDING, CONFIRMED, CANCELLED, COMPLETED }
```

### Review
```csharp
public class Review
{
    public string Id { get; set; }
    public string VenueId { get; set; }
    public string UserId { get; set; }
    public int Rating { get; set; }  // 1-5
    public string Comment { get; set; }
    public DateTime CreatedAt { get; set; }
    
    // Navegación
    public Venue Venue { get; set; }
    public User User { get; set; }
}
```

### Message & Conversation
```csharp
public class Conversation
{
    public string Id { get; set; }
    public string VenueId { get; set; }
    public List<string> ParticipantIds { get; set; }
    public int UnreadCount { get; set; }
    public DateTime CreatedAt { get; set; }
    
    // Navegación
    public Venue Venue { get; set; }
    public ICollection<Message> Messages { get; set; }
}

public class Message
{
    public string Id { get; set; }
    public string ConversationId { get; set; }
    public string SenderId { get; set; }
    public string Content { get; set; }
    public bool IsRead { get; set; }
    public DateTime Timestamp { get; set; }
    
    // Navegación
    public Conversation Conversation { get; set; }
    public User Sender { get; set; }
}
```

---

## 🔌 API Endpoints

### 🔐 AuthController (`/api/auth`)

| Método | Endpoint | Descripción | Body | Respuesta |
|--------|----------|-------------|------|-----------|
| POST | `/login` | Iniciar sesión | `{ email, password }` | `{ user, token }` |
| POST | `/register` | Registrar cliente | `{ email, password, name, phone? }` | `{ user, token }` |
| POST | `/logout` | Cerrar sesión | - | `200 OK` |
| GET | `/me` | Usuario actual | - | `User` |
| POST | `/refresh-token` | Renovar JWT | `{ refreshToken }` | `{ token }` |

### 🏠 VenuesController (`/api/venues`)

| Método | Endpoint | Descripción | Query/Body | Respuesta |
|--------|----------|-------------|------------|-----------|
| GET | `/` | Listar locales | `?query&zone&category&priceMin&priceMax&capacity&page&pageSize` | `PaginatedResponse<Venue>` |
| GET | `/{id}` | Obtener local | - | `Venue` |
| POST | `/` | Crear local | `VenueCreateDto` | `Venue` |
| PUT | `/{id}` | Actualizar local | `VenueUpdateDto` | `Venue` |
| DELETE | `/{id}` | Eliminar local | - | `204 No Content` |
| GET | `/{id}/availability` | Disponibilidad | `?month&year` | `DateAvailability[]` |
| GET | `/{id}/reviews` | Reseñas del local | - | `Review[]` |
| POST | `/{id}/reviews` | Crear reseña | `{ rating, comment }` | `Review` |
| GET | `/recently-viewed` | Vistos recientemente | - | `Venue[]` |
| GET | `/recommended` | Recomendados | - | `Venue[]` |
| GET | `/provider/{providerId}` | Locales del proveedor | - | `Venue[]` |

### 📅 BookingsController (`/api/bookings`)

| Método | Endpoint | Descripción | Body | Respuesta |
|--------|----------|-------------|------|-----------|
| GET | `/user` | Reservaciones del cliente | - | `Booking[]` |
| GET | `/provider` | Reservaciones del proveedor | - | `Booking[]` |
| GET | `/{id}` | Detalle de reservación | - | `Booking` |
| POST | `/` | Crear reservación | `{ venueId, date, paymentMethod, notes? }` | `Booking` |
| PUT | `/{id}/status` | Cambiar estado | `{ status }` | `Booking` |
| DELETE | `/{id}` | Cancelar reservación | - | `204 No Content` |

### 💬 MessagesController (`/api/messages`)

| Método | Endpoint | Descripción | Body | Respuesta |
|--------|----------|-------------|------|-----------|
| GET | `/conversations` | Listar conversaciones | - | `Conversation[]` |
| GET | `/conversations/{id}` | Mensajes de conversación | - | `Message[]` |
| POST | `/conversations/{id}` | Enviar mensaje | `{ content }` | `Message` |
| POST | `/conversations` | Iniciar conversación | `{ venueId, participantId, message }` | `Conversation` |
| PUT | `/conversations/{id}/read` | Marcar como leído | - | `200 OK` |

### 👤 UsersController (`/api/users`)

| Método | Endpoint | Descripción | Body | Respuesta |
|--------|----------|-------------|------|-----------|
| GET | `/profile` | Perfil del usuario | - | `User` |
| PUT | `/profile` | Actualizar perfil | `UserUpdateDto` | `User` |
| PUT | `/profile/avatar` | Subir avatar | `multipart/form-data` | `{ avatarUrl }` |
| GET | `/favorites` | Locales favoritos | - | `Venue[]` |
| POST | `/favorites/{venueId}` | Agregar favorito | - | `200 OK` |
| DELETE | `/favorites/{venueId}` | Quitar favorito | - | `204 No Content` |

### 🛡️ AdminController (`/api/admin`) - Solo ADMIN

| Método | Endpoint | Descripción | Body | Respuesta |
|--------|----------|-------------|------|-----------|
| GET | `/users` | Listar todos los usuarios | - | `User[]` |
| GET | `/venues` | Listar todos los locales | - | `Venue[]` |
| POST | `/providers` | Crear proveedor | `{ email, name, phone, verified }` | `User` |
| PUT | `/venues/{id}/status` | Cambiar estado de local | `{ status }` | `Venue` |
| GET | `/metrics` | Métricas de administración | - | `AdminMetrics` |
| DELETE | `/users/{id}` | Eliminar usuario | - | `204 No Content` |

### ❓ FAQController (`/api/faq`)

| Método | Endpoint | Descripción | Body | Respuesta |
|--------|----------|-------------|------|-----------|
| GET | `/` | Listar FAQs | - | `FAQ[]` |
| POST | `/` | Crear FAQ (admin) | `{ question, answer, category }` | `FAQ` |
| PUT | `/{id}` | Actualizar FAQ | `FAQUpdateDto` | `FAQ` |
| DELETE | `/{id}` | Eliminar FAQ | - | `204 No Content` |

### 📊 MetricsController (`/api/metrics`)

| Método | Endpoint | Descripción | Respuesta |
|--------|----------|-------------|-----------|
| GET | `/provider` | Métricas del proveedor | `ProviderMetrics` |
| GET | `/admin` | Métricas de admin | `AdminMetrics` |

---

## 🔒 Autenticación y Autorización

### JWT Configuration
```csharp
// appsettings.json
{
  "Jwt": {
    "Key": "tu-clave-secreta-muy-larga-de-256-bits",
    "Issuer": "EventSpace",
    "Audience": "EventSpaceUsers",
    "ExpirationInMinutes": 60
  }
}
```

### Políticas de Autorización
```csharp
services.AddAuthorization(options =>
{
    options.AddPolicy("ClienteOnly", policy => 
        policy.RequireRole("CLIENTE"));
    
    options.AddPolicy("ProveedorOnly", policy => 
        policy.RequireRole("PROVEEDOR"));
    
    options.AddPolicy("AdminOnly", policy => 
        policy.RequireRole("ADMIN"));
    
    options.AddPolicy("ProveedorOrAdmin", policy => 
        policy.RequireRole("PROVEEDOR", "ADMIN"));
});
```

### Decoradores en Controllers
```csharp
[Authorize]  // Requiere autenticación
[Authorize(Policy = "AdminOnly")]  // Solo admin
[AllowAnonymous]  // Público
```

---

## 📦 DTOs de Respuesta

### PaginatedResponse
```csharp
public class PaginatedResponse<T>
{
    public List<T> Data { get; set; }
    public int Total { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}
```

### ProviderMetrics
```csharp
public class ProviderMetrics
{
    public int TotalViews { get; set; }
    public int TotalReservations { get; set; }
    public int TotalFavorites { get; set; }
    public int TotalMessages { get; set; }
    public double ViewsChange { get; set; }  // % vs mes anterior
    public double ReservationsChange { get; set; }
    public double FavoritesChange { get; set; }
    public double MessagesChange { get; set; }
}
```

### AdminMetrics
```csharp
public class AdminMetrics
{
    public int TotalUsers { get; set; }
    public int TotalClients { get; set; }
    public int TotalProviders { get; set; }
    public int TotalVenues { get; set; }
    public int TotalBookings { get; set; }
    public int CompletedBookings { get; set; }
    public decimal Revenue { get; set; }
    public List<MonthlyCount> UserGrowth { get; set; }
    public List<MonthlyCount> BookingsByMonth { get; set; }
}

public class MonthlyCount
{
    public string Month { get; set; }
    public int Count { get; set; }
}
```

---

## 🗄️ Base de Datos

### Sugerencia: SQL Server o PostgreSQL

```sql
-- Tablas principales
Users
Venues
VenueImages
VenueAmenities
VenuePaymentMethods
Bookings
Reviews
Conversations
ConversationParticipants
Messages
FAQs
UserFavorites
UserRecentlyViewed
```

### Entity Framework Configuration
```csharp
public class ApplicationDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Venue> Venues { get; set; }
    public DbSet<Booking> Bookings { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<Conversation> Conversations { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<FAQ> FAQs { get; set; }
}
```

---

## ⚙️ Configuración CORS

```csharp
// Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")  // Vite dev
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// En el pipeline
app.UseCors("AllowFrontend");
```

---

## 📁 Almacenamiento de Imágenes

### Opciones:
1. **Azure Blob Storage** (recomendado para producción)
2. **AWS S3**
3. **Carpeta local** (solo desarrollo)

```csharp
public interface IStorageService
{
    Task<string> UploadImageAsync(IFormFile file, string folder);
    Task DeleteImageAsync(string imageUrl);
}
```

---

## 🔔 Funcionalidades Adicionales (Opcionales)

### Notificaciones en Tiempo Real
- **SignalR** para mensajes y actualizaciones de reservaciones

```csharp
public class NotificationHub : Hub
{
    public async Task SendMessage(string conversationId, Message message)
    {
        await Clients.Group(conversationId).SendAsync("ReceiveMessage", message);
    }
    
    public async Task BookingStatusChanged(string userId, Booking booking)
    {
        await Clients.User(userId).SendAsync("BookingUpdate", booking);
    }
}
```

### Sistema de Emails
- Confirmación de registro
- Confirmación de reservación
- Notificaciones de mensajes

---

## ✅ Checklist de Implementación

### Fase 1: Autenticación
- [ ] Modelo User
- [ ] AuthController (login, register)
- [ ] JWT middleware
- [ ] Políticas de autorización

### Fase 2: Locales
- [ ] Modelo Venue
- [ ] VenuesController CRUD
- [ ] Filtros y paginación
- [ ] Subida de imágenes

### Fase 3: Reservaciones
- [ ] Modelo Booking
- [ ] BookingsController
- [ ] Validación de disponibilidad
- [ ] Cambio de estados

### Fase 4: Mensajería
- [ ] Modelos Conversation/Message
- [ ] MessagesController
- [ ] (Opcional) SignalR para tiempo real

### Fase 5: Administración
- [ ] AdminController
- [ ] Métricas
- [ ] Gestión de usuarios

### Fase 6: Extras
- [ ] Reviews
- [ ] Favoritos
- [ ] FAQs
- [ ] Notificaciones

---

## 📝 Notas Importantes

1. **Validación**: Usar FluentValidation o DataAnnotations
2. **Logs**: Implementar Serilog o similar
3. **Errores**: Middleware global de manejo de excepciones
4. **Seguridad**: Hashear contraseñas con BCrypt
5. **Cache**: Redis para datos frecuentes (locales destacados, FAQs)

---

## 🔗 Referencias

- [ASP.NET Core Web API](https://docs.microsoft.com/aspnet/core/web-api)
- [Entity Framework Core](https://docs.microsoft.com/ef/core)
- [JWT Authentication](https://docs.microsoft.com/aspnet/core/security/authentication/jwt)
- [SignalR](https://docs.microsoft.com/aspnet/core/signalr)
