using EventSpace.API.Models.DTOs.Common;
using EventSpace.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EventSpace.API.Controllers;

/// <summary>
/// Controlador de preguntas frecuentes
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class FAQController : ControllerBase
{
    private readonly IFAQService _faqService;

    public FAQController(IFAQService faqService)
    {
        _faqService = faqService;
    }

    /// <summary>
    /// Lista todas las FAQs
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var faqs = await _faqService.GetAllAsync();
        return Ok(faqs);
    }

    /// <summary>
    /// Crea una FAQ (solo admin)
    /// </summary>
    [HttpPost]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> Create([FromBody] FAQCreateUpdateDto dto)
    {
        var faq = await _faqService.CreateAsync(dto);
        return Created("", faq);
    }

    /// <summary>
    /// Actualiza una FAQ
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> Update(string id, [FromBody] FAQCreateUpdateDto dto)
    {
        var faq = await _faqService.UpdateAsync(id, dto);
        if (faq == null)
            return NotFound(new { message = "FAQ no encontrada" });

        return Ok(faq);
    }

    /// <summary>
    /// Elimina una FAQ
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> Delete(string id)
    {
        var deleted = await _faqService.DeleteAsync(id);
        if (!deleted)
            return NotFound(new { message = "FAQ no encontrada" });

        return NoContent();
    }
}
