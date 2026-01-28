namespace EventSpace.API.Models.DTOs.Users;

/// <summary>
/// DTO para actualizar perfil de usuario
/// </summary>
public class UserUpdateDto
{
    public string? Name { get; set; }
    public string? Phone { get; set; }
    public string? Avatar { get; set; }
}
