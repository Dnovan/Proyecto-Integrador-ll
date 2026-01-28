using EventSpace.API.Models.Enums;

namespace EventSpace.API.Models.Entities;

/// <summary>
/// Entidad de local/venue
/// </summary>
public class Venue
{
    public string Id { get; set; } = string.Empty;
    public string ProviderId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Zone { get; set; } = string.Empty;
    public VenueCategory Category { get; set; }
    public decimal Price { get; set; }
    public int Capacity { get; set; }
    public VenueStatus Status { get; set; }
    public double Rating { get; set; }
    public int ReviewCount { get; set; }
    public int Views { get; set; }
    public int Favorites { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navegación
    public virtual User? Provider { get; set; }
    public virtual ICollection<VenueImage>? Images { get; set; }
    public virtual ICollection<VenueAmenity>? Amenities { get; set; }
    public virtual ICollection<VenuePaymentMethod>? PaymentMethods { get; set; }
    public virtual ICollection<Review>? Reviews { get; set; }
    public virtual ICollection<Booking>? Bookings { get; set; }
    public virtual ICollection<UserFavorite>? FavoritedBy { get; set; }
}

/// <summary>
/// Imagen de un venue
/// </summary>
public class VenueImage
{
    public string Id { get; set; } = string.Empty;
    public string VenueId { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public int Order { get; set; }

    public virtual Venue? Venue { get; set; }
}

/// <summary>
/// Amenidad de un venue
/// </summary>
public class VenueAmenity
{
    public string Id { get; set; } = string.Empty;
    public string VenueId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;

    public virtual Venue? Venue { get; set; }
}

/// <summary>
/// Método de pago aceptado por un venue
/// </summary>
public class VenuePaymentMethod
{
    public string Id { get; set; } = string.Empty;
    public string VenueId { get; set; } = string.Empty;
    public PaymentMethod Method { get; set; }

    public virtual Venue? Venue { get; set; }
}
