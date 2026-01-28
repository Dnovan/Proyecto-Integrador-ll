namespace EventSpace.API.Models.Entities;

/// <summary>
/// Entidad de mensaje de chat
/// </summary>
public class Message
{
    public string Id { get; set; } = string.Empty;
    public string ConversationId { get; set; } = string.Empty;
    public string SenderId { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime Timestamp { get; set; }

    // Navegación
    public virtual Conversation? Conversation { get; set; }
    public virtual User? Sender { get; set; }
}
