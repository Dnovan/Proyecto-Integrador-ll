using EventSpace.API.Models.Enums;

namespace EventSpace.API.Models.DTOs.Venues;

/// <summary>
/// DTO de respuesta para un local
/// </summary>
public class VenueDto
{
    public string Id { get; set; } = string.Empty;
    public string ProviderId { get; set; } = string.Empty;
    public string ProviderName { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Zone { get; set; } = string.Empty;
    public VenueCategory Category { get; set; }
    public decimal Price { get; set; }
    public int Capacity { get; set; }
    public List<string> Images { get; set; } = new();
    public List<PaymentMethod> PaymentMethods { get; set; } = new();
    public List<string> Amenities { get; set; } = new();
    public VenueStatus Status { get; set; }
    public double Rating { get; set; }
    public int ReviewCount { get; set; }
    public int Views { get; set; }
    public int Favorites { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

/// <summary>
/// DTO para disponibilidad de fecha
/// </summary>
public class DateAvailabilityDto
{
    public string Date { get; set; } = string.Empty;
    public bool IsAvailable { get; set; }
    public decimal? Price { get; set; }
}

/// <summary>
/// DTO para crear una reseña
/// </summary>
public class CreateReviewDto
{
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
}

/// <summary>
/// DTO de respuesta para una reseña
/// </summary>
public class ReviewDto
{
    public string Id { get; set; } = string.Empty;
    public string VenueId { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string? UserAvatar { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
