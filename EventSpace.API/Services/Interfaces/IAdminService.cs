using EventSpace.API.Models.DTOs.Admin;
using EventSpace.API.Models.DTOs.Auth;
using EventSpace.API.Models.DTOs.Venues;
using EventSpace.API.Models.Enums;

namespace EventSpace.API.Services.Interfaces;

/// <summary>
/// Servicio de administración
/// </summary>
public interface IAdminService
{
    Task<List<UserDto>> GetAllUsersAsync();
    Task<List<VenueDto>> GetAllVenuesAsync();
    Task<UserDto> CreateProviderAsync(CreateProviderDto dto);
    Task<VenueDto?> UpdateVenueStatusAsync(string venueId, VenueStatus status);
    Task<bool> DeleteUserAsync(string userId);
}
