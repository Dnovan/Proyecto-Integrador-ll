using EventSpace.API.Models.DTOs.Venues;
using EventSpace.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EventSpace.API.Controllers;

/// <summary>
/// Controlador de locales/venues
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class VenuesController : ControllerBase
{
    private readonly IVenueService _venueService;

    public VenuesController(IVenueService venueService)
    {
        _venueService = venueService;
    }

    /// <summary>
    /// Lista locales con filtros y paginación
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetVenues([FromQuery] VenueFilterDto filters)
    {
        var result = await _venueService.GetVenuesAsync(filters);
        return Ok(result);
    }

    /// <summary>
    /// Obtiene un local por ID
    /// </summary>
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetVenueById(string id)
    {
        var venue = await _venueService.GetVenueByIdAsync(id);
        if (venue == null)
            return NotFound(new { message = "Local no encontrado" });

        return Ok(venue);
    }

    /// <summary>
    /// Crea un nuevo local (solo proveedores)
    /// </summary>
    [HttpPost]
    [Authorize(Policy = "ProveedorOrAdmin")]
    public async Task<IActionResult> CreateVenue([FromBody] VenueCreateDto dto)
    {
        var providerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (providerId == null)
            return Unauthorized();

        var venue = await _venueService.CreateVenueAsync(providerId, dto);
        return CreatedAtAction(nameof(GetVenueById), new { id = venue.Id }, venue);
    }

    /// <summary>
    /// Actualiza un local
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Policy = "ProveedorOrAdmin")]
    public async Task<IActionResult> UpdateVenue(string id, [FromBody] VenueUpdateDto dto)
    {
        var providerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (providerId == null)
            return Unauthorized();

        var venue = await _venueService.UpdateVenueAsync(id, providerId, dto);
        if (venue == null)
            return NotFound(new { message = "Local no encontrado o no autorizado" });

        return Ok(venue);
    }

    /// <summary>
    /// Elimina un local
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Policy = "ProveedorOrAdmin")]
    public async Task<IActionResult> DeleteVenue(string id)
    {
        var providerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (providerId == null)
            return Unauthorized();

        var deleted = await _venueService.DeleteVenueAsync(id, providerId);
        if (!deleted)
            return NotFound(new { message = "Local no encontrado o no autorizado" });

        return NoContent();
    }

    /// <summary>
    /// Obtiene disponibilidad de fechas
    /// </summary>
    [HttpGet("{id}/availability")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAvailability(string id, [FromQuery] int month, [FromQuery] int year)
    {
        var availability = await _venueService.GetAvailabilityAsync(id, month, year);
        return Ok(availability);
    }

    /// <summary>
    /// Obtiene reseñas del local
    /// </summary>
    [HttpGet("{id}/reviews")]
    [AllowAnonymous]
    public async Task<IActionResult> GetReviews(string id)
    {
        var reviews = await _venueService.GetReviewsAsync(id);
        return Ok(reviews);
    }

    /// <summary>
    /// Crea una reseña
    /// </summary>
    [HttpPost("{id}/reviews")]
    [Authorize]
    public async Task<IActionResult> CreateReview(string id, [FromBody] CreateReviewDto dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Unauthorized();

        var review = await _venueService.CreateReviewAsync(id, userId, dto);
        return Created("", review);
    }

    /// <summary>
    /// Obtiene locales vistos recientemente
    /// </summary>
    [HttpGet("recently-viewed")]
    [Authorize]
    public async Task<IActionResult> GetRecentlyViewed()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Unauthorized();

        var venues = await _venueService.GetRecentlyViewedAsync(userId);
        return Ok(venues);
    }

    /// <summary>
    /// Obtiene locales recomendados
    /// </summary>
    [HttpGet("recommended")]
    [AllowAnonymous]
    public async Task<IActionResult> GetRecommended()
    {
        var venues = await _venueService.GetRecommendedAsync();
        return Ok(venues);
    }

    /// <summary>
    /// Obtiene locales del proveedor
    /// </summary>
    [HttpGet("provider/{providerId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetProviderVenues(string providerId)
    {
        var venues = await _venueService.GetProviderVenuesAsync(providerId);
        return Ok(venues);
    }
}
