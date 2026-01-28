using EventSpace.API.Models.DTOs.Bookings;
using EventSpace.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EventSpace.API.Controllers;

/// <summary>
/// Controlador de reservaciones
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingsController(IBookingService bookingService)
    {
        _bookingService = bookingService;
    }

    /// <summary>
    /// Obtiene reservaciones del cliente
    /// </summary>
    [HttpGet("user")]
    public async Task<IActionResult> GetUserBookings()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Unauthorized();

        var bookings = await _bookingService.GetUserBookingsAsync(userId);
        return Ok(bookings);
    }

    /// <summary>
    /// Obtiene reservaciones del proveedor
    /// </summary>
    [HttpGet("provider")]
    [Authorize(Policy = "ProveedorOrAdmin")]
    public async Task<IActionResult> GetProviderBookings()
    {
        var providerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (providerId == null)
            return Unauthorized();

        var bookings = await _bookingService.GetProviderBookingsAsync(providerId);
        return Ok(bookings);
    }

    /// <summary>
    /// Obtiene detalle de reservación
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetBookingById(string id)
    {
        var booking = await _bookingService.GetBookingByIdAsync(id);
        if (booking == null)
            return NotFound(new { message = "Reservación no encontrada" });

        return Ok(booking);
    }

    /// <summary>
    /// Crea una reservación
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateBooking([FromBody] BookingCreateDto dto)
    {
        var clientId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (clientId == null)
            return Unauthorized();

        var booking = await _bookingService.CreateBookingAsync(clientId, dto);
        return CreatedAtAction(nameof(GetBookingById), new { id = booking.Id }, booking);
    }

    /// <summary>
    /// Actualiza estado de reservación
    /// </summary>
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateBookingStatus(string id, [FromBody] BookingStatusUpdateDto dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Unauthorized();

        var booking = await _bookingService.UpdateBookingStatusAsync(id, userId, dto);
        if (booking == null)
            return NotFound(new { message = "Reservación no encontrada o no autorizado" });

        return Ok(booking);
    }

    /// <summary>
    /// Cancela una reservación
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBooking(string id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Unauthorized();

        var deleted = await _bookingService.DeleteBookingAsync(id, userId);
        if (!deleted)
            return NotFound(new { message = "Reservación no encontrada o no autorizado" });

        return NoContent();
    }
}
