using EventSpace.API.Models.DTOs.Common;

namespace EventSpace.API.Services.Interfaces;

/// <summary>
/// Servicio de FAQ
/// </summary>
public interface IFAQService
{
    Task<List<FAQDto>> GetAllAsync();
    Task<FAQDto?> GetByIdAsync(string id);
    Task<FAQDto> CreateAsync(FAQCreateUpdateDto dto);
    Task<FAQDto?> UpdateAsync(string id, FAQCreateUpdateDto dto);
    Task<bool> DeleteAsync(string id);
}
