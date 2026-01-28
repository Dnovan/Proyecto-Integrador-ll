using EventSpace.API.Models.DTOs.Bookings;

namespace EventSpace.API.Services.Interfaces;

/// <summary>
/// Servicio de reservaciones
/// </summary>
public interface IBookingService
{
    Task<List<BookingDto>> GetUserBookingsAsync(string userId);
    Task<List<BookingDto>> GetProviderBookingsAsync(string providerId);
    Task<BookingDto?> GetBookingByIdAsync(string id);
    Task<BookingDto> CreateBookingAsync(string clientId, BookingCreateDto dto);
    Task<BookingDto?> UpdateBookingStatusAsync(string id, string userId, BookingStatusUpdateDto dto);
    Task<bool> DeleteBookingAsync(string id, string userId);
}
