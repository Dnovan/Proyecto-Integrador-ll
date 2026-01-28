using EventSpace.API.Helpers;
using EventSpace.API.Models.DTOs.Auth;
using EventSpace.API.Models.Entities;
using EventSpace.API.Models.Enums;
using EventSpace.API.Services.Interfaces;

namespace EventSpace.API.Services.Implementations;

/// <summary>
/// Implementación del servicio de autenticación con datos mock
/// TODO: Reemplazar con implementación real cuando se conecte la base de datos
/// </summary>
public class AuthService : IAuthService
{
    private readonly JwtHelper _jwtHelper;

    // Datos mock - Tu compañero los reemplazará por consultas a la base de datos
    private static readonly List<User> MockUsers = new()
    {
        new User
        {
            Id = "1",
            Email = "cliente@eventspace.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("cliente123"),
            Name = "María García",
            Role = UserRole.CLIENTE,
            Avatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
            Phone = "+52 55 1234 5678",
            CreatedAt = new DateTime(2025, 1, 1)
        },
        new User
        {
            Id = "2",
            Email = "proveedor@eventspace.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("proveedor123"),
            Name = "Carlos Rodríguez",
            Role = UserRole.PROVEEDOR,
            Avatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
            Phone = "+52 55 9876 5432",
            CreatedAt = new DateTime(2024, 6, 15),
            VerificationStatus = VerificationStatus.VERIFIED
        },
        new User
        {
            Id = "3",
            Email = "admin@eventspace.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
            Name = "Admin EventSpace",
            Role = UserRole.ADMIN,
            Avatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
            CreatedAt = new DateTime(2024, 1, 1)
        }
    };

    public AuthService(JwtHelper jwtHelper)
    {
        _jwtHelper = jwtHelper;
    }

    public Task<AuthResponse?> LoginAsync(LoginRequest request)
    {
        var user = MockUsers.FirstOrDefault(u => u.Email == request.Email);
        
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return Task.FromResult<AuthResponse?>(null);
        }

        var token = _jwtHelper.GenerateToken(user);
        var refreshToken = _jwtHelper.GenerateRefreshToken();

        return Task.FromResult<AuthResponse?>(new AuthResponse
        {
            User = MapToUserDto(user),
            Token = token,
            RefreshToken = refreshToken
        });
    }

    public Task<AuthResponse?> RegisterAsync(RegisterRequest request)
    {
        if (MockUsers.Any(u => u.Email == request.Email))
        {
            return Task.FromResult<AuthResponse?>(null);
        }

        var newUser = new User
        {
            Id = $"user-{DateTime.UtcNow.Ticks}",
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Name = request.Name,
            Phone = request.Phone,
            Role = UserRole.CLIENTE,
            Avatar = $"https://api.dicebear.com/7.x/avataaars/svg?seed={request.Name.Replace(" ", "")}",
            CreatedAt = DateTime.UtcNow
        };

        MockUsers.Add(newUser);

        var token = _jwtHelper.GenerateToken(newUser);
        var refreshToken = _jwtHelper.GenerateRefreshToken();

        return Task.FromResult<AuthResponse?>(new AuthResponse
        {
            User = MapToUserDto(newUser),
            Token = token,
            RefreshToken = refreshToken
        });
    }

    public Task LogoutAsync(string userId)
    {
        // En producción, invalidaría el refresh token en la base de datos
        return Task.CompletedTask;
    }

    public Task<UserDto?> GetCurrentUserAsync(string userId)
    {
        var user = MockUsers.FirstOrDefault(u => u.Id == userId);
        return Task.FromResult(user != null ? MapToUserDto(user) : null);
    }

    public Task<AuthResponse?> RefreshTokenAsync(string refreshToken)
    {
        // En producción, validaría el refresh token en la base de datos
        // Por ahora retorna null (no implementado)
        return Task.FromResult<AuthResponse?>(null);
    }

    private static UserDto MapToUserDto(User user) => new()
    {
        Id = user.Id,
        Email = user.Email,
        Name = user.Name,
        Role = user.Role,
        Avatar = user.Avatar,
        Phone = user.Phone,
        CreatedAt = user.CreatedAt,
        VerificationStatus = user.VerificationStatus
    };

    // Método para obtener usuario por ID (usado internamente)
    public static User? GetUserById(string id) => MockUsers.FirstOrDefault(u => u.Id == id);
    public static List<User> GetAllUsers() => MockUsers;
    public static void AddUser(User user) => MockUsers.Add(user);
}
