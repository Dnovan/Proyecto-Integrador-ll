using EventSpace.API.Models.DTOs.Messages;

namespace EventSpace.API.Services.Interfaces;

/// <summary>
/// Servicio de mensajería
/// </summary>
public interface IMessageService
{
    Task<List<ConversationDto>> GetConversationsAsync(string userId);
    Task<List<MessageDto>> GetMessagesAsync(string conversationId, string userId);
    Task<MessageDto> SendMessageAsync(string conversationId, string senderId, SendMessageDto dto);
    Task<ConversationDto> CreateConversationAsync(string userId, CreateConversationDto dto);
    Task MarkAsReadAsync(string conversationId, string userId);
}
