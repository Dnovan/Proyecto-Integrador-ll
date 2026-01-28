using EventSpace.API.Models.DTOs.Messages;
using EventSpace.API.Models.Entities;
using EventSpace.API.Models.Enums;
using EventSpace.API.Services.Interfaces;

namespace EventSpace.API.Services.Implementations;

/// <summary>
/// Implementación del servicio de mensajería con datos mock
/// </summary>
public class MessageService : IMessageService
{
    private static readonly List<Conversation> MockConversations = new()
    {
        new Conversation
        {
            Id = "c1",
            VenueId = "v1",
            UnreadCount = 1,
            CreatedAt = new DateTime(2025, 1, 10)
        }
    };

    private static readonly List<ConversationParticipant> MockParticipants = new()
    {
        new ConversationParticipant { Id = "cp1", ConversationId = "c1", UserId = "1" },
        new ConversationParticipant { Id = "cp2", ConversationId = "c1", UserId = "2" }
    };

    private static readonly List<Message> MockMessages = new()
    {
        new Message
        {
            Id = "m1",
            ConversationId = "c1",
            SenderId = "1",
            Content = "Hola, me interesa reservar la hacienda.",
            Timestamp = new DateTime(2025, 1, 10, 9, 0, 0),
            IsRead = true
        },
        new Message
        {
            Id = "m2",
            ConversationId = "c1",
            SenderId = "2",
            Content = "¡Hola! Claro, esa fecha está disponible.",
            Timestamp = new DateTime(2025, 1, 10, 9, 15, 0),
            IsRead = true
        }
    };

    public Task<List<ConversationDto>> GetConversationsAsync(string userId)
    {
        var userConvIds = MockParticipants
            .Where(p => p.UserId == userId)
            .Select(p => p.ConversationId)
            .ToList();

        var conversations = MockConversations
            .Where(c => userConvIds.Contains(c.Id))
            .Select(c => MapConversationToDto(c, userId))
            .ToList();

        return Task.FromResult(conversations);
    }

    public Task<List<MessageDto>> GetMessagesAsync(string conversationId, string userId)
    {
        var messages = MockMessages
            .Where(m => m.ConversationId == conversationId)
            .OrderBy(m => m.Timestamp)
            .Select(MapMessageToDto)
            .ToList();

        return Task.FromResult(messages);
    }

    public Task<MessageDto> SendMessageAsync(string conversationId, string senderId, SendMessageDto dto)
    {
        var message = new Message
        {
            Id = $"m-{DateTime.UtcNow.Ticks}",
            ConversationId = conversationId,
            SenderId = senderId,
            Content = dto.Content,
            Timestamp = DateTime.UtcNow,
            IsRead = false
        };

        MockMessages.Add(message);
        return Task.FromResult(MapMessageToDto(message));
    }

    public Task<ConversationDto> CreateConversationAsync(string userId, CreateConversationDto dto)
    {
        var conversation = new Conversation
        {
            Id = $"c-{DateTime.UtcNow.Ticks}",
            VenueId = dto.VenueId,
            UnreadCount = 0,
            CreatedAt = DateTime.UtcNow
        };

        MockConversations.Add(conversation);
        MockParticipants.Add(new ConversationParticipant { Id = $"cp-{DateTime.UtcNow.Ticks}", ConversationId = conversation.Id, UserId = userId });
        MockParticipants.Add(new ConversationParticipant { Id = $"cp-{DateTime.UtcNow.Ticks + 1}", ConversationId = conversation.Id, UserId = dto.ParticipantId });

        // Send initial message
        SendMessageAsync(conversation.Id, userId, new SendMessageDto { Content = dto.Message });

        return Task.FromResult(MapConversationToDto(conversation, userId));
    }

    public Task MarkAsReadAsync(string conversationId, string userId)
    {
        var messages = MockMessages.Where(m => m.ConversationId == conversationId && m.SenderId != userId);
        foreach (var msg in messages)
        {
            msg.IsRead = true;
        }

        var conv = MockConversations.FirstOrDefault(c => c.Id == conversationId);
        if (conv != null) conv.UnreadCount = 0;

        return Task.CompletedTask;
    }

    private static ConversationDto MapConversationToDto(Conversation c, string currentUserId)
    {
        var participantIds = MockParticipants
            .Where(p => p.ConversationId == c.Id)
            .Select(p => p.UserId)
            .ToList();

        var participants = participantIds
            .Select(id => AuthService.GetUserById(id))
            .Where(u => u != null)
            .Select(u => new ParticipantDto
            {
                Id = u!.Id,
                Name = u.Name,
                Avatar = u.Avatar,
                Role = u.Role
            })
            .ToList();

        var lastMsg = MockMessages
            .Where(m => m.ConversationId == c.Id)
            .OrderByDescending(m => m.Timestamp)
            .FirstOrDefault();

        var venue = VenueService.GetById(c.VenueId ?? "");

        return new ConversationDto
        {
            Id = c.Id,
            Participants = participants,
            VenueId = c.VenueId,
            VenueName = venue?.Name,
            LastMessage = lastMsg != null ? MapMessageToDto(lastMsg) : null,
            UnreadCount = c.UnreadCount,
            CreatedAt = c.CreatedAt
        };
    }

    private static MessageDto MapMessageToDto(Message m)
    {
        var sender = AuthService.GetUserById(m.SenderId);
        return new MessageDto
        {
            Id = m.Id,
            ConversationId = m.ConversationId,
            SenderId = m.SenderId,
            SenderName = sender?.Name ?? "Usuario",
            SenderAvatar = sender?.Avatar,
            Content = m.Content,
            Timestamp = m.Timestamp,
            IsRead = m.IsRead
        };
    }
}
