using EventSpace.API.Models.DTOs.Common;
using EventSpace.API.Models.DTOs.Venues;
using EventSpace.API.Models.Entities;
using EventSpace.API.Models.Enums;
using EventSpace.API.Services.Interfaces;

namespace EventSpace.API.Services.Implementations;

/// <summary>
/// Implementación del servicio de venues con datos mock
/// TODO: Reemplazar con implementación real cuando se conecte la base de datos
/// </summary>
public class VenueService : IVenueService
{
    private static readonly List<Venue> MockVenues = new()
    {
        new Venue
        {
            Id = "v1",
            ProviderId = "2",
            Name = "Hacienda Los Arcos",
            Description = "Hermosa hacienda colonial del siglo XVIII con amplios jardines.",
            Address = "Av. Insurgentes Sur 1234, Tlalpan",
            Zone = "Tlalpan",
            Category = VenueCategory.HACIENDA,
            Price = 85000,
            Capacity = 350,
            Status = VenueStatus.FEATURED,
            Rating = 4.8,
            ReviewCount = 127,
            Views = 3420,
            Favorites = 234,
            CreatedAt = new DateTime(2024, 3, 15),
            UpdatedAt = new DateTime(2025, 1, 10)
        },
        new Venue
        {
            Id = "v2",
            ProviderId = "2",
            Name = "Terraza Skyline CDMX",
            Description = "Exclusiva terraza en el piso 25 con vista panorámica.",
            Address = "Paseo de la Reforma 500, Polanco",
            Zone = "Polanco",
            Category = VenueCategory.TERRAZA,
            Price = 120000,
            Capacity = 200,
            Status = VenueStatus.ACTIVE,
            Rating = 4.6,
            ReviewCount = 89,
            Views = 2150,
            Favorites = 178,
            CreatedAt = new DateTime(2024, 5, 20),
            UpdatedAt = new DateTime(2025, 1, 8)
        },
        new Venue
        {
            Id = "v3",
            ProviderId = "2",
            Name = "Jardín Botánico Roma",
            Description = "Oasis verde en el corazón de la Roma Norte.",
            Address = "Calle Orizaba 89, Roma Norte",
            Zone = "Roma Norte",
            Category = VenueCategory.JARDIN,
            Price = 45000,
            Capacity = 100,
            Status = VenueStatus.ACTIVE,
            Rating = 4.9,
            ReviewCount = 56,
            Views = 1890,
            Favorites = 145,
            CreatedAt = new DateTime(2024, 7, 10),
            UpdatedAt = new DateTime(2025, 1, 5)
        }
    };

    private static readonly List<Review> MockReviews = new()
    {
        new Review { Id = "r1", VenueId = "v1", UserId = "1", Rating = 5, Comment = "Increíble experiencia.", CreatedAt = new DateTime(2025, 1, 5) },
        new Review { Id = "r2", VenueId = "v1", UserId = "4", Rating = 5, Comment = "La hacienda es espectacular.", CreatedAt = new DateTime(2024, 12, 20) }
    };

    private static readonly List<string> MockImages = new()
    {
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800",
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800"
    };

    public Task<PaginatedResponse<VenueDto>> GetVenuesAsync(VenueFilterDto filters)
    {
        var query = MockVenues.Where(v => v.Status != VenueStatus.BANNED);

        if (!string.IsNullOrEmpty(filters.Query))
        {
            var q = filters.Query.ToLower();
            query = query.Where(v => 
                v.Name.ToLower().Contains(q) || 
                v.Description.ToLower().Contains(q) ||
                v.Zone.ToLower().Contains(q));
        }

        if (!string.IsNullOrEmpty(filters.Zone))
            query = query.Where(v => v.Zone == filters.Zone);

        if (filters.Category.HasValue)
            query = query.Where(v => v.Category == filters.Category.Value);

        if (filters.PriceMin.HasValue)
            query = query.Where(v => v.Price >= filters.PriceMin.Value);

        if (filters.PriceMax.HasValue)
            query = query.Where(v => v.Price <= filters.PriceMax.Value);

        if (filters.Capacity.HasValue)
            query = query.Where(v => v.Capacity >= filters.Capacity.Value);

        var sorted = query
            .OrderByDescending(v => v.Status == VenueStatus.FEATURED)
            .ThenByDescending(v => v.Rating)
            .ToList();

        var total = sorted.Count;
        var data = sorted
            .Skip((filters.Page - 1) * filters.PageSize)
            .Take(filters.PageSize)
            .Select(MapToDto)
            .ToList();

        return Task.FromResult(new PaginatedResponse<VenueDto>
        {
            Data = data,
            Total = total,
            Page = filters.Page,
            PageSize = filters.PageSize,
            TotalPages = (int)Math.Ceiling((double)total / filters.PageSize)
        });
    }

    public Task<VenueDto?> GetVenueByIdAsync(string id)
    {
        var venue = MockVenues.FirstOrDefault(v => v.Id == id);
        if (venue != null) venue.Views++;
        return Task.FromResult(venue != null ? MapToDto(venue) : null);
    }

    public Task<VenueDto> CreateVenueAsync(string providerId, VenueCreateDto dto)
    {
        var venue = new Venue
        {
            Id = $"v-{DateTime.UtcNow.Ticks}",
            ProviderId = providerId,
            Name = dto.Name,
            Description = dto.Description,
            Address = dto.Address,
            Zone = dto.Zone,
            Category = dto.Category,
            Price = dto.Price,
            Capacity = dto.Capacity,
            Status = VenueStatus.PENDING,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        MockVenues.Add(venue);
        return Task.FromResult(MapToDto(venue));
    }

    public Task<VenueDto?> UpdateVenueAsync(string id, string providerId, VenueUpdateDto dto)
    {
        var venue = MockVenues.FirstOrDefault(v => v.Id == id && v.ProviderId == providerId);
        if (venue == null) return Task.FromResult<VenueDto?>(null);

        if (dto.Name != null) venue.Name = dto.Name;
        if (dto.Description != null) venue.Description = dto.Description;
        if (dto.Address != null) venue.Address = dto.Address;
        if (dto.Zone != null) venue.Zone = dto.Zone;
        if (dto.Category.HasValue) venue.Category = dto.Category.Value;
        if (dto.Price.HasValue) venue.Price = dto.Price.Value;
        if (dto.Capacity.HasValue) venue.Capacity = dto.Capacity.Value;
        venue.UpdatedAt = DateTime.UtcNow;

        return Task.FromResult<VenueDto?>(MapToDto(venue));
    }

    public Task<bool> DeleteVenueAsync(string id, string providerId)
    {
        var venue = MockVenues.FirstOrDefault(v => v.Id == id && v.ProviderId == providerId);
        if (venue == null) return Task.FromResult(false);
        MockVenues.Remove(venue);
        return Task.FromResult(true);
    }

    public Task<List<DateAvailabilityDto>> GetAvailabilityAsync(string venueId, int month, int year)
    {
        var daysInMonth = DateTime.DaysInMonth(year, month);
        var availability = new List<DateAvailabilityDto>();

        for (int day = 1; day <= daysInMonth; day++)
        {
            var date = new DateTime(year, month, day);
            availability.Add(new DateAvailabilityDto
            {
                Date = date.ToString("yyyy-MM-dd"),
                IsAvailable = date >= DateTime.Today && new Random().NextDouble() > 0.2
            });
        }

        return Task.FromResult(availability);
    }

    public Task<List<ReviewDto>> GetReviewsAsync(string venueId)
    {
        var reviews = MockReviews.Where(r => r.VenueId == venueId).Select(r =>
        {
            var user = AuthService.GetUserById(r.UserId);
            return new ReviewDto
            {
                Id = r.Id,
                VenueId = r.VenueId,
                UserId = r.UserId,
                UserName = user?.Name ?? "Usuario",
                UserAvatar = user?.Avatar,
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt
            };
        }).ToList();

        return Task.FromResult(reviews);
    }

    public Task<ReviewDto> CreateReviewAsync(string venueId, string userId, CreateReviewDto dto)
    {
        var user = AuthService.GetUserById(userId);
        var review = new Review
        {
            Id = $"r-{DateTime.UtcNow.Ticks}",
            VenueId = venueId,
            UserId = userId,
            Rating = dto.Rating,
            Comment = dto.Comment,
            CreatedAt = DateTime.UtcNow
        };

        MockReviews.Add(review);

        return Task.FromResult(new ReviewDto
        {
            Id = review.Id,
            VenueId = review.VenueId,
            UserId = review.UserId,
            UserName = user?.Name ?? "Usuario",
            UserAvatar = user?.Avatar,
            Rating = review.Rating,
            Comment = review.Comment,
            CreatedAt = review.CreatedAt
        });
    }

    public Task<List<VenueDto>> GetRecentlyViewedAsync(string userId)
    {
        return Task.FromResult(MockVenues.Take(3).Select(MapToDto).ToList());
    }

    public Task<List<VenueDto>> GetRecommendedAsync()
    {
        return Task.FromResult(MockVenues
            .OrderByDescending(v => v.Favorites)
            .Take(4)
            .Select(MapToDto)
            .ToList());
    }

    public Task<List<VenueDto>> GetProviderVenuesAsync(string providerId)
    {
        return Task.FromResult(MockVenues
            .Where(v => v.ProviderId == providerId)
            .Select(MapToDto)
            .ToList());
    }

    public static Venue? GetById(string id) => MockVenues.FirstOrDefault(v => v.Id == id);
    public static List<Venue> GetAll() => MockVenues;
    public static void UpdateStatus(string id, VenueStatus status)
    {
        var venue = MockVenues.FirstOrDefault(v => v.Id == id);
        if (venue != null) venue.Status = status;
    }

    private static VenueDto MapToDto(Venue v)
    {
        var provider = AuthService.GetUserById(v.ProviderId);
        return new VenueDto
        {
            Id = v.Id,
            ProviderId = v.ProviderId,
            ProviderName = provider?.Name ?? "Proveedor",
            Name = v.Name,
            Description = v.Description,
            Address = v.Address,
            Zone = v.Zone,
            Category = v.Category,
            Price = v.Price,
            Capacity = v.Capacity,
            Images = MockImages,
            PaymentMethods = new List<PaymentMethod> { PaymentMethod.TRANSFERENCIA, PaymentMethod.EFECTIVO },
            Amenities = new List<string> { "Estacionamiento", "Cocina", "Mobiliario" },
            Status = v.Status,
            Rating = v.Rating,
            ReviewCount = v.ReviewCount,
            Views = v.Views,
            Favorites = v.Favorites,
            CreatedAt = v.CreatedAt,
            UpdatedAt = v.UpdatedAt
        };
    }
}
