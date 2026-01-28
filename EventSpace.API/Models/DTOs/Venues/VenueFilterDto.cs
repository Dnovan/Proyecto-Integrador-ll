using EventSpace.API.Models.Enums;

namespace EventSpace.API.Models.DTOs.Venues;

/// <summary>
/// DTO para filtrar locales
/// </summary>
public class VenueFilterDto
{
    public string? Query { get; set; }
    public string? Zone { get; set; }
    public VenueCategory? Category { get; set; }
    public decimal? PriceMin { get; set; }
    public decimal? PriceMax { get; set; }
    public int? Capacity { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
