namespace EventSpace.API.Models.Entities;

/// <summary>
/// Entidad de pregunta frecuente
/// </summary>
public class FAQ
{
    public string Id { get; set; } = string.Empty;
    public string Question { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
}
