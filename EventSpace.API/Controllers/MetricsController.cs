using EventSpace.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EventSpace.API.Controllers;

/// <summary>
/// Controlador de métricas
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MetricsController : ControllerBase
{
    private readonly IMetricsService _metricsService;

    public MetricsController(IMetricsService metricsService)
    {
        _metricsService = metricsService;
    }

    /// <summary>
    /// Obtiene métricas del proveedor
    /// </summary>
    [HttpGet("provider")]
    [Authorize(Policy = "ProveedorOrAdmin")]
    public async Task<IActionResult> GetProviderMetrics()
    {
        var providerId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (providerId == null)
            return Unauthorized();

        var metrics = await _metricsService.GetProviderMetricsAsync(providerId);
        return Ok(metrics);
    }

    /// <summary>
    /// Obtiene métricas de administración
    /// </summary>
    [HttpGet("admin")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> GetAdminMetrics()
    {
        var metrics = await _metricsService.GetAdminMetricsAsync();
        return Ok(metrics);
    }
}
