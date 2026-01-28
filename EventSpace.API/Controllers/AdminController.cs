using EventSpace.API.Models.DTOs.Admin;
using EventSpace.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EventSpace.API.Controllers;

/// <summary>
/// Controlador de administración (solo ADMIN)
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "AdminOnly")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;
    private readonly IMetricsService _metricsService;

    public AdminController(IAdminService adminService, IMetricsService metricsService)
    {
        _adminService = adminService;
        _metricsService = metricsService;
    }

    /// <summary>
    /// Lista todos los usuarios
    /// </summary>
    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _adminService.GetAllUsersAsync();
        return Ok(users);
    }

    /// <summary>
    /// Lista todos los locales
    /// </summary>
    [HttpGet("venues")]
    public async Task<IActionResult> GetAllVenues()
    {
        var venues = await _adminService.GetAllVenuesAsync();
        return Ok(venues);
    }

    /// <summary>
    /// Crea un proveedor
    /// </summary>
    [HttpPost("providers")]
    public async Task<IActionResult> CreateProvider([FromBody] CreateProviderDto dto)
    {
        var provider = await _adminService.CreateProviderAsync(dto);
        return Created("", provider);
    }

    /// <summary>
    /// Actualiza estado de un local
    /// </summary>
    [HttpPut("venues/{id}/status")]
    public async Task<IActionResult> UpdateVenueStatus(string id, [FromBody] VenueStatusUpdateDto dto)
    {
        var venue = await _adminService.UpdateVenueStatusAsync(id, dto.Status);
        if (venue == null)
            return NotFound(new { message = "Local no encontrado" });

        return Ok(venue);
    }

    /// <summary>
    /// Obtiene métricas de administración
    /// </summary>
    [HttpGet("metrics")]
    public async Task<IActionResult> GetMetrics()
    {
        var metrics = await _metricsService.GetAdminMetricsAsync();
        return Ok(metrics);
    }

    /// <summary>
    /// Elimina un usuario
    /// </summary>
    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var deleted = await _adminService.DeleteUserAsync(id);
        if (!deleted)
            return NotFound(new { message = "Usuario no encontrado" });

        return NoContent();
    }
}
