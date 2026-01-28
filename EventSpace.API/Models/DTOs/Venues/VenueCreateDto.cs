using EventSpace.API.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace EventSpace.API.Models.DTOs.Venues;

/// <summary>
/// DTO para crear un local
/// </summary>
public class VenueCreateDto
{
    [Required(ErrorMessage = "El nombre es requerido")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "La descripción es requerida")]
    public string Description { get; set; } = string.Empty;

    [Required(ErrorMessage = "La dirección es requerida")]
    public string Address { get; set; } = string.Empty;

    [Required(ErrorMessage = "La zona es requerida")]
    public string Zone { get; set; } = string.Empty;

    [Required(ErrorMessage = "La categoría es requerida")]
    public VenueCategory Category { get; set; }

    [Required(ErrorMessage = "El precio es requerido")]
    [Range(0, double.MaxValue, ErrorMessage = "El precio debe ser mayor a 0")]
    public decimal Price { get; set; }

    [Required(ErrorMessage = "La capacidad es requerida")]
    [Range(1, int.MaxValue, ErrorMessage = "La capacidad debe ser mayor a 0")]
    public int Capacity { get; set; }

    public List<string> Images { get; set; } = new();
    public List<PaymentMethod> PaymentMethods { get; set; } = new();
    public List<string> Amenities { get; set; } = new();
}
