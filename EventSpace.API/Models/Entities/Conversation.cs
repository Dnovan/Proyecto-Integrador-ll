namespace EventSpace.API.Models.Entities;

/// <summary>
/// Entidad de conversación de chat
/// </summary>
public class Conversation
{
    public string Id { get; set; } = string.Empty;
    public string? VenueId { get; set; }
    public int UnreadCount { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navegación
    public virtual Venue? Venue { get; set; }
    public virtual ICollection<ConversationParticipant>? Participants { get; set; }
    public virtual ICollection<Message>? Messages { get; set; }
}

/// <summary>
/// Participante de una conversación
/// </summary>
public class ConversationParticipant
{
    public string Id { get; set; } = string.Empty;
    public string ConversationId { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;

    public virtual Conversation? Conversation { get; set; }
    public virtual User? User { get; set; }
}
