using EventSpace.API.Models.Enums;

namespace EventSpace.API.Models.DTOs.Auth;

/// <summary>
/// DTO de respuesta de autenticación
/// </summary>
public class AuthResponse
{
    public UserDto User { get; set; } = null!;
    public string Token { get; set; } = string.Empty;
    public string? RefreshToken { get; set; }
}

/// <summary>
/// DTO de usuario para respuestas
/// </summary>
public class UserDto
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public string? Avatar { get; set; }
    public string? Phone { get; set; }
    public DateTime CreatedAt { get; set; }
    public VerificationStatus? VerificationStatus { get; set; }
}
