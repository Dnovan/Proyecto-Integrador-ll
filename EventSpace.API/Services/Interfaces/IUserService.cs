using EventSpace.API.Models.DTOs.Auth;
using EventSpace.API.Models.DTOs.Users;
using EventSpace.API.Models.DTOs.Venues;

namespace EventSpace.API.Services.Interfaces;

/// <summary>
/// Servicio de usuarios
/// </summary>
public interface IUserService
{
    Task<UserDto?> GetProfileAsync(string userId);
    Task<UserDto?> UpdateProfileAsync(string userId, UserUpdateDto dto);
    Task<string?> UpdateAvatarAsync(string userId, Stream fileStream, string fileName);
    Task<List<VenueDto>> GetFavoritesAsync(string userId);
    Task<bool> AddFavoriteAsync(string userId, string venueId);
    Task<bool> RemoveFavoriteAsync(string userId, string venueId);
}
