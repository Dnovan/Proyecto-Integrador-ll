using EventSpace.API.Models.DTOs.Common;
using EventSpace.API.Models.Entities;
using EventSpace.API.Services.Interfaces;

namespace EventSpace.API.Services.Implementations;

/// <summary>
/// Implementación del servicio de FAQ con datos mock
/// </summary>
public class FAQService : IFAQService
{
    private static readonly List<FAQ> MockFAQs = new()
    {
        new FAQ
        {
            Id = "faq1",
            Question = "¿Cómo puedo reservar un local?",
            Answer = "Para reservar un local, primero navega al detalle del espacio que te interesa. Revisa la disponibilidad en el calendario y haz clic en \"Solicitar Reservación\".",
            Category = "Reservaciones"
        },
        new FAQ
        {
            Id = "faq2",
            Question = "¿Cuáles son los métodos de pago aceptados?",
            Answer = "Cada local puede aceptar diferentes métodos de pago. Los más comunes son transferencia bancaria y efectivo.",
            Category = "Pagos"
        },
        new FAQ
        {
            Id = "faq3",
            Question = "¿Cómo me convierto en proveedor?",
            Answer = "Los proveedores son verificados manualmente por nuestro equipo. Contáctanos a través del formulario de contacto.",
            Category = "Proveedores"
        },
        new FAQ
        {
            Id = "faq4",
            Question = "¿Puedo cancelar una reservación?",
            Answer = "Las políticas de cancelación varían según el proveedor. Te recomendamos revisar los términos antes de confirmar.",
            Category = "Reservaciones"
        },
        new FAQ
        {
            Id = "faq5",
            Question = "¿Cómo contacto a un proveedor?",
            Answer = "Puedes enviar un mensaje al proveedor directamente desde la página del espacio o desde tu centro de mensajes.",
            Category = "Comunicación"
        }
    };

    public Task<List<FAQDto>> GetAllAsync()
    {
        var faqs = MockFAQs.Select(f => new FAQDto
        {
            Id = f.Id,
            Question = f.Question,
            Answer = f.Answer,
            Category = f.Category
        }).ToList();

        return Task.FromResult(faqs);
    }

    public Task<FAQDto?> GetByIdAsync(string id)
    {
        var faq = MockFAQs.FirstOrDefault(f => f.Id == id);
        if (faq == null) return Task.FromResult<FAQDto?>(null);

        return Task.FromResult<FAQDto?>(new FAQDto
        {
            Id = faq.Id,
            Question = faq.Question,
            Answer = faq.Answer,
            Category = faq.Category
        });
    }

    public Task<FAQDto> CreateAsync(FAQCreateUpdateDto dto)
    {
        var faq = new FAQ
        {
            Id = $"faq-{DateTime.UtcNow.Ticks}",
            Question = dto.Question,
            Answer = dto.Answer,
            Category = dto.Category
        };

        MockFAQs.Add(faq);

        return Task.FromResult(new FAQDto
        {
            Id = faq.Id,
            Question = faq.Question,
            Answer = faq.Answer,
            Category = faq.Category
        });
    }

    public Task<FAQDto?> UpdateAsync(string id, FAQCreateUpdateDto dto)
    {
        var faq = MockFAQs.FirstOrDefault(f => f.Id == id);
        if (faq == null) return Task.FromResult<FAQDto?>(null);

        faq.Question = dto.Question;
        faq.Answer = dto.Answer;
        faq.Category = dto.Category;

        return Task.FromResult<FAQDto?>(new FAQDto
        {
            Id = faq.Id,
            Question = faq.Question,
            Answer = faq.Answer,
            Category = faq.Category
        });
    }

    public Task<bool> DeleteAsync(string id)
    {
        var faq = MockFAQs.FirstOrDefault(f => f.Id == id);
        if (faq == null) return Task.FromResult(false);

        MockFAQs.Remove(faq);
        return Task.FromResult(true);
    }
}
