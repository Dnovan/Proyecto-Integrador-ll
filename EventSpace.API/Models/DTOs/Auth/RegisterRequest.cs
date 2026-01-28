using System.ComponentModel.DataAnnotations;

namespace EventSpace.API.Models.DTOs.Auth;

/// <summary>
/// DTO para registro de clientes
/// </summary>
public class RegisterRequest
{
    [Required(ErrorMessage = "El email es requerido")]
    [EmailAddress(ErrorMessage = "Email inválido")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "La contraseña es requerida")]
    [MinLength(6, ErrorMessage = "La contraseña debe tener al menos 6 caracteres")]
    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "El nombre es requerido")]
    public string Name { get; set; } = string.Empty;

    public string? Phone { get; set; }
}
