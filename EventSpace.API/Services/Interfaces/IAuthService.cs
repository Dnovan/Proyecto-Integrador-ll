using EventSpace.API.Models.DTOs.Auth;
using EventSpace.API.Models.Entities;

namespace EventSpace.API.Services.Interfaces;

/// <summary>
/// Servicio de autenticación
/// </summary>
public interface IAuthService
{
    /// <summary>
    /// Inicia sesión con credenciales
    /// </summary>
    Task<AuthResponse?> LoginAsync(LoginRequest request);

    /// <summary>
    /// Registra un nuevo cliente
    /// </summary>
    Task<AuthResponse?> RegisterAsync(RegisterRequest request);

    /// <summary>
    /// Cierra sesión (invalida token)
    /// </summary>
    Task LogoutAsync(string userId);

    /// <summary>
    /// Obtiene el usuario actual por ID
    /// </summary>
    Task<UserDto?> GetCurrentUserAsync(string userId);

    /// <summary>
    /// Renueva el token JWT
    /// </summary>
    Task<AuthResponse?> RefreshTokenAsync(string refreshToken);
}
