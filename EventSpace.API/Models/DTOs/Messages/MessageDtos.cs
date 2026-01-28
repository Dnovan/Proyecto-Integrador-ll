using EventSpace.API.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace EventSpace.API.Models.DTOs.Messages;

/// <summary>
/// DTO para enviar un mensaje
/// </summary>
public class SendMessageDto
{
    [Required(ErrorMessage = "El contenido es requerido")]
    public string Content { get; set; } = string.Empty;
}

/// <summary>
/// DTO para crear una conversación
/// </summary>
public class CreateConversationDto
{
    [Required(ErrorMessage = "El ID del local es requerido")]
    public string VenueId { get; set; } = string.Empty;

    [Required(ErrorMessage = "El ID del participante es requerido")]
    public string ParticipantId { get; set; } = string.Empty;

    [Required(ErrorMessage = "El mensaje es requerido")]
    public string Message { get; set; } = string.Empty;
}

/// <summary>
/// DTO de respuesta para una conversación
/// </summary>
public class ConversationDto
{
    public string Id { get; set; } = string.Empty;
    public List<ParticipantDto> Participants { get; set; } = new();
    public string? VenueId { get; set; }
    public string? VenueName { get; set; }
    public MessageDto? LastMessage { get; set; }
    public int UnreadCount { get; set; }
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// DTO de participante de conversación
/// </summary>
public class ParticipantDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Avatar { get; set; }
    public UserRole Role { get; set; }
}

/// <summary>
/// DTO de respuesta para un mensaje
/// </summary>
public class MessageDto
{
    public string Id { get; set; } = string.Empty;
    public string ConversationId { get; set; } = string.Empty;
    public string SenderId { get; set; } = string.Empty;
    public string SenderName { get; set; } = string.Empty;
    public string? SenderAvatar { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public bool IsRead { get; set; }
}
