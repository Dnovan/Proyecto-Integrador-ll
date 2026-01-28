using EventSpace.API.Models.DTOs.Bookings;
using EventSpace.API.Models.Entities;
using EventSpace.API.Models.Enums;
using EventSpace.API.Services.Interfaces;

namespace EventSpace.API.Services.Implementations;

/// <summary>
/// Implementación del servicio de reservaciones con datos mock
/// </summary>
public class BookingService : IBookingService
{
    private static readonly List<Booking> MockBookings = new()
    {
        new Booking
        {
            Id = "b1",
            VenueId = "v1",
            ClientId = "1",
            ProviderId = "2",
            Date = new DateTime(2025, 2, 14),
            Status = BookingStatus.CONFIRMED,
            TotalPrice = 85000,
            PaymentMethod = PaymentMethod.TRANSFERENCIA,
            CreatedAt = new DateTime(2025, 1, 10),
            Notes = "Boda - 180 invitados"
        },
        new Booking
        {
            Id = "b2",
            VenueId = "v2",
            ClientId = "1",
            ProviderId = "2",
            Date = new DateTime(2025, 3, 20),
            Status = BookingStatus.PENDING,
            TotalPrice = 120000,
            PaymentMethod = PaymentMethod.TRANSFERENCIA,
            CreatedAt = new DateTime(2025, 1, 12),
            Notes = "Evento corporativo"
        }
    };

    public Task<List<BookingDto>> GetUserBookingsAsync(string userId)
    {
        var bookings = MockBookings
            .Where(b => b.ClientId == userId)
            .Select(MapToDto)
            .ToList();

        return Task.FromResult(bookings);
    }

    public Task<List<BookingDto>> GetProviderBookingsAsync(string providerId)
    {
        var bookings = MockBookings
            .Where(b => b.ProviderId == providerId)
            .Select(MapToDto)
            .ToList();

        return Task.FromResult(bookings);
    }

    public Task<BookingDto?> GetBookingByIdAsync(string id)
    {
        var booking = MockBookings.FirstOrDefault(b => b.Id == id);
        return Task.FromResult(booking != null ? MapToDto(booking) : null);
    }

    public Task<BookingDto> CreateBookingAsync(string clientId, BookingCreateDto dto)
    {
        var venue = VenueService.GetById(dto.VenueId);
        var client = AuthService.GetUserById(clientId);

        var booking = new Booking
        {
            Id = $"b-{DateTime.UtcNow.Ticks}",
            VenueId = dto.VenueId,
            ClientId = clientId,
            ProviderId = venue?.ProviderId ?? "",
            Date = DateTime.Parse(dto.Date),
            Status = BookingStatus.PENDING,
            TotalPrice = venue?.Price ?? 0,
            PaymentMethod = dto.PaymentMethod,
            CreatedAt = DateTime.UtcNow,
            Notes = dto.Notes
        };

        MockBookings.Add(booking);
        return Task.FromResult(MapToDto(booking));
    }

    public Task<BookingDto?> UpdateBookingStatusAsync(string id, string userId, BookingStatusUpdateDto dto)
    {
        var booking = MockBookings.FirstOrDefault(b => b.Id == id && 
            (b.ClientId == userId || b.ProviderId == userId));

        if (booking == null) return Task.FromResult<BookingDto?>(null);

        booking.Status = dto.Status;
        return Task.FromResult<BookingDto?>(MapToDto(booking));
    }

    public Task<bool> DeleteBookingAsync(string id, string userId)
    {
        var booking = MockBookings.FirstOrDefault(b => b.Id == id && b.ClientId == userId);
        if (booking == null) return Task.FromResult(false);

        booking.Status = BookingStatus.CANCELLED;
        return Task.FromResult(true);
    }

    public static List<Booking> GetAll() => MockBookings;

    private static BookingDto MapToDto(Booking b)
    {
        var venue = VenueService.GetById(b.VenueId);
        var client = AuthService.GetUserById(b.ClientId);

        return new BookingDto
        {
            Id = b.Id,
            VenueId = b.VenueId,
            VenueName = venue?.Name ?? "Local",
            VenueImage = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800",
            ClientId = b.ClientId,
            ClientName = client?.Name ?? "Cliente",
            ProviderId = b.ProviderId,
            Date = b.Date.ToString("yyyy-MM-dd"),
            Status = b.Status,
            TotalPrice = b.TotalPrice,
            PaymentMethod = b.PaymentMethod,
            CreatedAt = b.CreatedAt,
            Notes = b.Notes
        };
    }
}
