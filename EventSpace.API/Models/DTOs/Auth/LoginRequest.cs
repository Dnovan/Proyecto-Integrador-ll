using System.ComponentModel.DataAnnotations;

namespace EventSpace.API.Models.DTOs.Auth;

/// <summary>
/// DTO para solicitud de login
/// </summary>
public class LoginRequest
{
    [Required(ErrorMessage = "El email es requerido")]
    [EmailAddress(ErrorMessage = "Email inválido")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "La contraseña es requerida")]
    public string Password { get; set; } = string.Empty;
}
