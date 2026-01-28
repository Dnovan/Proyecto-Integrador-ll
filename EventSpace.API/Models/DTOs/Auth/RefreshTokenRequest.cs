namespace EventSpace.API.Models.DTOs.Auth;

/// <summary>
/// DTO para renovar token
/// </summary>
public class RefreshTokenRequest
{
    public string RefreshToken { get; set; } = string.Empty;
}
