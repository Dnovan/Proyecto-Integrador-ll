using EventSpace.API.Models.DTOs.Common;
using EventSpace.API.Models.DTOs.Venues;

namespace EventSpace.API.Services.Interfaces;

/// <summary>
/// Servicio de locales/venues
/// </summary>
public interface IVenueService
{
    Task<PaginatedResponse<VenueDto>> GetVenuesAsync(VenueFilterDto filters);
    Task<VenueDto?> GetVenueByIdAsync(string id);
    Task<VenueDto> CreateVenueAsync(string providerId, VenueCreateDto dto);
    Task<VenueDto?> UpdateVenueAsync(string id, string providerId, VenueUpdateDto dto);
    Task<bool> DeleteVenueAsync(string id, string providerId);
    Task<List<DateAvailabilityDto>> GetAvailabilityAsync(string venueId, int month, int year);
    Task<List<ReviewDto>> GetReviewsAsync(string venueId);
    Task<ReviewDto> CreateReviewAsync(string venueId, string userId, CreateReviewDto dto);
    Task<List<VenueDto>> GetRecentlyViewedAsync(string userId);
    Task<List<VenueDto>> GetRecommendedAsync();
    Task<List<VenueDto>> GetProviderVenuesAsync(string providerId);
}
