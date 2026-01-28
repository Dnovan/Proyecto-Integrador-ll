using EventSpace.API.Models.Enums;

namespace EventSpace.API.Models.Entities;

/// <summary>
/// Entidad de usuario del sistema
/// </summary>
public class User
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Avatar { get; set; }
    public UserRole Role { get; set; }
    public VerificationStatus? VerificationStatus { get; set; }
    public string? IneDocumentId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    // Navegación
    public virtual ICollection<Venue>? Venues { get; set; }
    public virtual ICollection<Booking>? ClientBookings { get; set; }
    public virtual ICollection<Booking>? ProviderBookings { get; set; }
    public virtual ICollection<Review>? Reviews { get; set; }
    public virtual ICollection<UserFavorite>? Favorites { get; set; }
}

/// <summary>
/// Relación usuario-favorito
/// </summary>
public class UserFavorite
{
    public string UserId { get; set; } = string.Empty;
    public string VenueId { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    public virtual User? User { get; set; }
    public virtual Venue? Venue { get; set; }
}
