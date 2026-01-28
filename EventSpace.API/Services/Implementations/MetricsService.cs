using EventSpace.API.Models.DTOs.Admin;
using EventSpace.API.Models.Enums;
using EventSpace.API.Services.Interfaces;

namespace EventSpace.API.Services.Implementations;

/// <summary>
/// Implementación del servicio de métricas con datos mock
/// </summary>
public class MetricsService : IMetricsService
{
    public Task<ProviderMetricsDto> GetProviderMetricsAsync(string providerId)
    {
        var venues = VenueService.GetAll().Where(v => v.ProviderId == providerId).ToList();
        var bookings = BookingService.GetAll().Where(b => b.ProviderId == providerId).ToList();

        return Task.FromResult(new ProviderMetricsDto
        {
            TotalViews = venues.Sum(v => v.Views),
            TotalReservations = bookings.Count,
            TotalFavorites = venues.Sum(v => v.Favorites),
            TotalMessages = 5, // Mock value
            ViewsChange = 12.5,
            ReservationsChange = 8.3,
            FavoritesChange = 15.2,
            MessagesChange = -2.1
        });
    }

    public Task<AdminMetricsDto> GetAdminMetricsAsync()
    {
        var users = AuthService.GetAllUsers();
        var venues = VenueService.GetAll();
        var bookings = BookingService.GetAll();

        return Task.FromResult(new AdminMetricsDto
        {
            TotalUsers = users.Count,
            TotalClients = users.Count(u => u.Role == UserRole.CLIENTE),
            TotalProviders = users.Count(u => u.Role == UserRole.PROVEEDOR),
            TotalVenues = venues.Count,
            TotalBookings = bookings.Count,
            CompletedBookings = bookings.Count(b => b.Status == BookingStatus.COMPLETED),
            Revenue = bookings
                .Where(b => b.Status == BookingStatus.CONFIRMED || b.Status == BookingStatus.COMPLETED)
                .Sum(b => b.TotalPrice),
            UserGrowth = new List<MonthlyCountDto>
            {
                new() { Month = "Ago", Count = 45 },
                new() { Month = "Sep", Count = 62 },
                new() { Month = "Oct", Count = 78 },
                new() { Month = "Nov", Count = 95 },
                new() { Month = "Dic", Count = 112 },
                new() { Month = "Ene", Count = 134 }
            },
            BookingsByMonth = new List<MonthlyCountDto>
            {
                new() { Month = "Ago", Count = 12 },
                new() { Month = "Sep", Count = 18 },
                new() { Month = "Oct", Count = 24 },
                new() { Month = "Nov", Count = 31 },
                new() { Month = "Dic", Count = 28 },
                new() { Month = "Ene", Count = 35 }
            }
        });
    }
}
