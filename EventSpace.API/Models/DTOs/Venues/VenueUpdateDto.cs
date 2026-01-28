using EventSpace.API.Models.Enums;

namespace EventSpace.API.Models.DTOs.Venues;

/// <summary>
/// DTO para actualizar un local
/// </summary>
public class VenueUpdateDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Address { get; set; }
    public string? Zone { get; set; }
    public VenueCategory? Category { get; set; }
    public decimal? Price { get; set; }
    public int? Capacity { get; set; }
    public List<string>? Images { get; set; }
    public List<PaymentMethod>? PaymentMethods { get; set; }
    public List<string>? Amenities { get; set; }
}
