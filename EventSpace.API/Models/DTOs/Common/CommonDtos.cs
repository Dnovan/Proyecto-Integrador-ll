namespace EventSpace.API.Models.DTOs.Common;

/// <summary>
/// DTO de respuesta paginada
/// </summary>
public class PaginatedResponse<T>
{
    public List<T> Data { get; set; } = new();
    public int Total { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}

/// <summary>
/// DTO de respuesta de error
/// </summary>
public class ErrorResponse
{
    public string Message { get; set; } = string.Empty;
    public string? Details { get; set; }
    public int StatusCode { get; set; }
}

/// <summary>
/// DTO de FAQ
/// </summary>
public class FAQDto
{
    public string Id { get; set; } = string.Empty;
    public string Question { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
}

/// <summary>
/// DTO para crear/actualizar FAQ
/// </summary>
public class FAQCreateUpdateDto
{
    public string Question { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
}
