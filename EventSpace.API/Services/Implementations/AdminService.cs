using EventSpace.API.Models.DTOs.Admin;
using EventSpace.API.Models.DTOs.Auth;
using EventSpace.API.Models.DTOs.Venues;
using EventSpace.API.Models.Entities;
using EventSpace.API.Models.Enums;
using EventSpace.API.Services.Interfaces;

namespace EventSpace.API.Services.Implementations;

/// <summary>
/// Implementación del servicio de administración con datos mock
/// </summary>
public class AdminService : IAdminService
{
    public Task<List<UserDto>> GetAllUsersAsync()
    {
        var users = AuthService.GetAllUsers()
            .Select(u => new UserDto
            {
                Id = u.Id,
                Email = u.Email,
                Name = u.Name,
                Role = u.Role,
                Avatar = u.Avatar,
                Phone = u.Phone,
                CreatedAt = u.CreatedAt,
                VerificationStatus = u.VerificationStatus
            })
            .ToList();

        return Task.FromResult(users);
    }

    public Task<List<VenueDto>> GetAllVenuesAsync()
    {
        var venues = VenueService.GetAll()
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
                Rating = v.Rating,
                ReviewCount = v.ReviewCount,
                Views = v.Views,
                Favorites = v.Favorites,
                CreatedAt = v.CreatedAt,
                UpdatedAt = v.UpdatedAt
            })
            .ToList();

        return Task.FromResult(venues);
    }

    public Task<UserDto> CreateProviderAsync(CreateProviderDto dto)
    {
        var newProvider = new User
        {
            Id = $"prov-{DateTime.UtcNow.Ticks}",
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("proveedor123"),
            Name = dto.Name,
            Phone = dto.Phone,
            Role = UserRole.PROVEEDOR,
            Avatar = $"https://api.dicebear.com/7.x/avataaars/svg?seed={dto.Name.Replace(" ", "")}",
            CreatedAt = DateTime.UtcNow,
            VerificationStatus = dto.Verified ? VerificationStatus.VERIFIED : VerificationStatus.PENDING
        };

        AuthService.AddUser(newProvider);

        return Task.FromResult(new UserDto
        {
            Id = newProvider.Id,
            Email = newProvider.Email,
            Name = newProvider.Name,
            Role = newProvider.Role,
            Avatar = newProvider.Avatar,
            Phone = newProvider.Phone,
            CreatedAt = newProvider.CreatedAt,
            VerificationStatus = newProvider.VerificationStatus
        });
    }

    public Task<VenueDto?> UpdateVenueStatusAsync(string venueId, VenueStatus status)
    {
        VenueService.UpdateStatus(venueId, status);
        var venue = VenueService.GetById(venueId);
        
        if (venue == null) return Task.FromResult<VenueDto?>(null);

        return Task.FromResult<VenueDto?>(new VenueDto
        {
            Id = venue.Id,
            ProviderId = venue.ProviderId,
            ProviderName = AuthService.GetUserById(venue.ProviderId)?.Name ?? "Proveedor",
            Name = venue.Name,
            Status = venue.Status,
            UpdatedAt = DateTime.UtcNow
        });
    }

    public Task<bool> DeleteUserAsync(string userId)
    {
        // In production, would delete from database
        // For mock, we don't actually remove to keep data consistent
        return Task.FromResult(true);
    }
}
