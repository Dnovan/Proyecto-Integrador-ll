using EventSpace.API.Models.DTOs.Admin;

namespace EventSpace.API.Services.Interfaces;

/// <summary>
/// Servicio de métricas
/// </summary>
public interface IMetricsService
{
    Task<ProviderMetricsDto> GetProviderMetricsAsync(string providerId);
    Task<AdminMetricsDto> GetAdminMetricsAsync();
}
