using EventSpace.API.Models.DTOs.Messages;
using EventSpace.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EventSpace.API.Controllers;

/// <summary>
/// Controlador de mensajería
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MessagesController : ControllerBase
{
    private readonly IMessageService _messageService;

    public MessagesController(IMessageService messageService)
    {
        _messageService = messageService;
    }

    /// <summary>
    /// Lista conversaciones del usuario
    /// </summary>
    [HttpGet("conversations")]
    public async Task<IActionResult> GetConversations()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Unauthorized();

        var conversations = await _messageService.GetConversationsAsync(userId);
        return Ok(conversations);
    }

    /// <summary>
    /// Obtiene mensajes de una conversación
    /// </summary>
    [HttpGet("conversations/{id}")]
    public async Task<IActionResult> GetMessages(string id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Unauthorized();

        var messages = await _messageService.GetMessagesAsync(id, userId);
        return Ok(messages);
    }

    /// <summary>
    /// Envía un mensaje
    /// </summary>
    [HttpPost("conversations/{id}")]
    public async Task<IActionResult> SendMessage(string id, [FromBody] SendMessageDto dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Unauthorized();

        var message = await _messageService.SendMessageAsync(id, userId, dto);
        return Created("", message);
    }

    /// <summary>
    /// Inicia una conversación
    /// </summary>
    [HttpPost("conversations")]
    public async Task<IActionResult> CreateConversation([FromBody] CreateConversationDto dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Unauthorized();

        var conversation = await _messageService.CreateConversationAsync(userId, dto);
        return Created("", conversation);
    }

    /// <summary>
    /// Marca conversación como leída
    /// </summary>
    [HttpPut("conversations/{id}/read")]
    public async Task<IActionResult> MarkAsRead(string id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Unauthorized();

        await _messageService.MarkAsReadAsync(id, userId);
        return Ok();
    }
}
