using EventSpace.API.Models.DTOs.Auth;
using EventSpace.API.Models.DTOs.Users;
using EventSpace.API.Models.DTOs.Venues;
using EventSpace.API.Models.Entities;
using EventSpace.API.Services.Interfaces;

namespace EventSpace.API.Services.Implementations;

/// <summary>
/// Implementación del servicio de usuarios con datos mock
/// </summary>
public class UserService : IUserService
{
    private static readonly List<UserFavorite> MockFavorites = new()
    {
        new UserFavorite { UserId = "1", VenueId = "v1", CreatedAt = DateTime.UtcNow.AddDays(-5) },
        new UserFavorite { UserId = "1", VenueId = "v3", CreatedAt = DateTime.UtcNow.AddDays(-2) }
    };

    public Task<UserDto?> GetProfileAsync(string userId)
    {
        var user = AuthService.GetUserById(userId);
        if (user == null) return Task.FromResult<UserDto?>(null);

        return Task.FromResult<UserDto?>(new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            Name = user.Name,
            Role = user.Role,
            Avatar = user.Avatar,
            Phone = user.Phone,
            CreatedAt = user.CreatedAt,
            VerificationStatus = user.VerificationStatus
        });
    }

    public Task<UserDto?> UpdateProfileAsync(string userId, UserUpdateDto dto)
    {
        var users = AuthService.GetAllUsers();
        var user = users.FirstOrDefault(u => u.Id == userId);
        
        if (user == null) return Task.FromResult<UserDto?>(null);

        if (dto.Name != null) user.Name = dto.Name;
        if (dto.Phone != null) user.Phone = dto.Phone;
        if (dto.Avatar != null) user.Avatar = dto.Avatar;
        user.UpdatedAt = DateTime.UtcNow;

        return Task.FromResult<UserDto?>(new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            Name = user.Name,
            Role = user.Role,
            Avatar = user.Avatar,
            Phone = user.Phone,
            CreatedAt = user.CreatedAt,
            VerificationStatus = user.VerificationStatus
        });
    }

    public Task<string?> UpdateAvatarAsync(string userId, Stream fileStream, string fileName)
    {
        // In production, would upload to storage service
        var avatarUrl = $"https://api.dicebear.com/7.x/avataaars/svg?seed={fileName}";
        return Task.FromResult<string?>(avatarUrl);
    }

    public Task<List<VenueDto>> GetFavoritesAsync(string userId)
    {
        var favoriteVenueIds = MockFavorites
            .Where(f => f.UserId == userId)
            .Select(f => f.VenueId)
            .ToList();

        var venues = VenueService.GetAll()
            .Where(v => favoriteVenueIds.Contains(v.Id))
            .Select(v => new VenueDto
            {
                Id = v.Id,
                ProviderId = v.ProviderId,
                ProviderName = AuthService.GetUserById(v.ProviderId)?.Name ?? "Proveedor",
                Name = v.Name,
                Description = v.Description,
                Address = v.Address,
                Zone = v.Zone,
                Category = v.Category,
                Price = v.Price,
                Capacity = v.Capacity,
                Status = v.Status,
                Rating = v.Rating
            })
            .ToList();

        return Task.FromResult(venues);
    }

    public Task<bool> AddFavoriteAsync(string userId, string venueId)
    {
        if (MockFavorites.Any(f => f.UserId == userId && f.VenueId == venueId))
            return Task.FromResult(true);

        MockFavorites.Add(new UserFavorite
        {
            UserId = userId,
            VenueId = venueId,
            CreatedAt = DateTime.UtcNow
        });

        return Task.FromResult(true);
    }

    public Task<bool> RemoveFavoriteAsync(string userId, string venueId)
    {
        var favorite = MockFavorites.FirstOrDefault(f => f.UserId == userId && f.VenueId == venueId);
        if (favorite == null) return Task.FromResult(false);

        MockFavorites.Remove(favorite);
        return Task.FromResult(true);
    }
}
