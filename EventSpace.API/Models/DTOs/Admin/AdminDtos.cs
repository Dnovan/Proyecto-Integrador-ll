using EventSpace.API.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace EventSpace.API.Models.DTOs.Admin;

/// <summary>
/// DTO para crear un proveedor
/// </summary>
public class CreateProviderDto
{
    [Required(ErrorMessage = "El email es requerido")]
    [EmailAddress(ErrorMessage = "Email inválido")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "El nombre es requerido")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "El teléfono es requerido")]
    public string Phone { get; set; } = string.Empty;

    public bool Verified { get; set; } = false;
}

/// <summary>
/// DTO para actualizar estado de un local (admin)
/// </summary>
public class VenueStatusUpdateDto
{
    [Required(ErrorMessage = "El estado es requerido")]
    public VenueStatus Status { get; set; }
}

/// <summary>
/// DTO de métricas de administrador
/// </summary>
public class AdminMetricsDto
{
    public int TotalUsers { get; set; }
    public int TotalClients { get; set; }
    public int TotalProviders { get; set; }
    public int TotalVenues { get; set; }
    public int TotalBookings { get; set; }
    public int CompletedBookings { get; set; }
    public decimal Revenue { get; set; }
    public List<MonthlyCountDto> UserGrowth { get; set; } = new();
    public List<MonthlyCountDto> BookingsByMonth { get; set; } = new();
}

/// <summary>
/// DTO de conteo mensual
/// </summary>
public class MonthlyCountDto
{
    public string Month { get; set; } = string.Empty;
    public int Count { get; set; }
}

/// <summary>
/// DTO de métricas de proveedor
/// </summary>
public class ProviderMetricsDto
{
    public int TotalViews { get; set; }
    public int TotalReservations { get; set; }
    public int TotalFavorites { get; set; }
    public int TotalMessages { get; set; }
    public double ViewsChange { get; set; }
    public double ReservationsChange { get; set; }
    public double FavoritesChange { get; set; }
    public double MessagesChange { get; set; }
}
