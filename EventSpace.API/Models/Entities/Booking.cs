using EventSpace.API.Models.Enums;

namespace EventSpace.API.Models.Entities;

/// <summary>
/// Entidad de reservación
/// </summary>
public class Booking
{
    public string Id { get; set; } = string.Empty;
    public string VenueId { get; set; } = string.Empty;
    public string ClientId { get; set; } = string.Empty;
    public string ProviderId { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public BookingStatus Status { get; set; }
    public decimal TotalPrice { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navegación
    public virtual Venue? Venue { get; set; }
    public virtual User? Client { get; set; }
    public virtual User? Provider { get; set; }
}
