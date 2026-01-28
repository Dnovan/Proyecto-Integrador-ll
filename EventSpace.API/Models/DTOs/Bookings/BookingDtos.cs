using EventSpace.API.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace EventSpace.API.Models.DTOs.Bookings;

/// <summary>
/// DTO para crear una reservación
/// </summary>
public class BookingCreateDto
{
    [Required(ErrorMessage = "El ID del local es requerido")]
    public string VenueId { get; set; } = string.Empty;

    [Required(ErrorMessage = "La fecha es requerida")]
    public string Date { get; set; } = string.Empty;

    [Required(ErrorMessage = "El método de pago es requerido")]
    public PaymentMethod PaymentMethod { get; set; }

    public string? Notes { get; set; }
}

/// <summary>
/// DTO para actualizar estado de reservación
/// </summary>
public class BookingStatusUpdateDto
{
    [Required(ErrorMessage = "El estado es requerido")]
    public BookingStatus Status { get; set; }
}

/// <summary>
/// DTO de respuesta para una reservación
/// </summary>
public class BookingDto
{
    public string Id { get; set; } = string.Empty;
    public string VenueId { get; set; } = string.Empty;
    public string VenueName { get; set; } = string.Empty;
    public string VenueImage { get; set; } = string.Empty;
    public string ClientId { get; set; } = string.Empty;
    public string ClientName { get; set; } = string.Empty;
    public string ProviderId { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public BookingStatus Status { get; set; }
    public decimal TotalPrice { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? Notes { get; set; }
}
