# EventSpace Backend - Walkthrough

## Summary

Se completó la implementación del backend .NET 9 para EventSpace según las especificaciones en `BACKEND_SPEC.md` y `DOCUMENTACION.md`.

> [!NOTE]
> La base de datos **NO** fue implementada como se solicitó. Se incluyen stubs y datos mock para que tu compañero complete la integración.

---

## Project Structure

```
EventSpace.API/
├── Controllers/          (8 archivos)
├── Data/                 (1 archivo - stub)
├── Helpers/              (1 archivo)
├── Middleware/           (1 archivo)
├── Models/
│   ├── DTOs/             (9 archivos)
│   ├── Entities/         (7 archivos)
│   └── Enums/            (6 archivos)
├── Services/
│   ├── Interfaces/       (8 archivos)
│   └── Implementations/  (7 archivos)
├── Program.cs
├── appsettings.json
└── EventSpace.API.csproj
```

---

## Controllers Implemented

| Controller | Route | Endpoints |
|------------|-------|-----------|
| [AuthController](file:///c:/Users/marco/Downloads/Proyecto/Proyecto-integrador/EventSpace.API/Controllers/AuthController.cs) | `/api/auth` | login, register, logout, me, refresh-token |
| [VenuesController](file:///c:/Users/marco/Downloads/Proyecto/Proyecto-integrador/EventSpace.API/Controllers/VenuesController.cs) | `/api/venues` | CRUD, availability, reviews, recommended |
| [BookingsController](file:///c:/Users/marco/Downloads/Proyecto/Proyecto-integrador/EventSpace.API/Controllers/BookingsController.cs) | `/api/bookings` | user, provider, create, update status |
| [MessagesController](file:///c:/Users/marco/Downloads/Proyecto/Proyecto-integrador/EventSpace.API/Controllers/MessagesController.cs) | `/api/messages` | conversations, messages, send |
| [UsersController](file:///c:/Users/marco/Downloads/Proyecto/Proyecto-integrador/EventSpace.API/Controllers/UsersController.cs) | `/api/users` | profile, avatar, favorites |
| [AdminController](file:///c:/Users/marco/Downloads/Proyecto/Proyecto-integrador/EventSpace.API/Controllers/AdminController.cs) | `/api/admin` | users, venues, providers, metrics |
| [FAQController](file:///c:/Users/marco/Downloads/Proyecto/Proyecto-integrador/EventSpace.API/Controllers/FAQController.cs) | `/api/faq` | CRUD |
| [MetricsController](file:///c:/Users/marco/Downloads/Proyecto/Proyecto-integrador/EventSpace.API/Controllers/MetricsController.cs) | `/api/metrics` | provider, admin |

---

## How to Run

```bash
cd EventSpace.API
dotnet restore
dotnet run
```

- **Swagger UI**: `http://localhost:5000/swagger`
- **Health Check**: `http://localhost:5000/`

---

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Cliente | cliente@eventspace.com | cliente123 |
| Proveedor | proveedor@eventspace.com | proveedor123 |
| Admin | admin@eventspace.com | admin123 |

---

## For Your Teammate (DB Implementation)

Files to modify:

1. **[ApplicationDbContext.cs](file:///c:/Users/marco/Downloads/Proyecto/Proyecto-integrador/EventSpace.API/Data/ApplicationDbContext.cs)** - Add EF configurations
2. **[Program.cs](file:///c:/Users/marco/Downloads/Proyecto/Proyecto-integrador/EventSpace.API/Program.cs)** - Replace `UseInMemoryDatabase` with real connection
3. **Services/Implementations/*.cs** - Replace mock data with DB queries
