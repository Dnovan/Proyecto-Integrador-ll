namespace EventSpace.API.Models.Entities;

/// <summary>
/// Entidad de reseña
/// </summary>
public class Review
{
    public string Id { get; set; } = string.Empty;
    public string VenueId { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    // Navegación
    public virtual Venue? Venue { get; set; }
    public virtual User? User { get; set; }
}
