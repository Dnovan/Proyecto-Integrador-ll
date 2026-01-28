using EventSpace.API.Models.DTOs.Users;
using EventSpace.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EventSpace.API.Controllers;

/// <summary>
/// Controlador de usuarios
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    /// <summary>
    /// Obtiene perfil del usuario
    /// </summary>
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Unauthorized();

        var user = await _userService.GetProfileAsync(userId);
        if (user == null)
            return NotFound();

        return Ok(user);
    }

    /// <summary>
    /// Actualiza perfil del usuario
    /// </summary>
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UserUpdateDto dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Unauthorized();

        var user = await _userService.UpdateProfileAsync(userId, dto);
        if (user == null)
            return NotFound();

        return Ok(user);
    }

    /// <summary>
    /// Sube avatar del usuario
    /// </summary>
    [HttpPut("profile/avatar")]
    public async Task<IActionResult> UpdateAvatar(IFormFile file)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Unauthorized();

        using var stream = file.OpenReadStream();
        var avatarUrl = await _userService.UpdateAvatarAsync(userId, stream, file.FileName);

        return Ok(new { avatarUrl });
    }

    /// <summary>
    /// Obtiene locales favoritos
    /// </summary>
    [HttpGet("favorites")]
    public async Task<IActionResult> GetFavorites()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Unauthorized();

        var venues = await _userService.GetFavoritesAsync(userId);
        return Ok(venues);
    }

    /// <summary>
    /// Agrega local a favoritos
    /// </summary>
    [HttpPost("favorites/{venueId}")]
    public async Task<IActionResult> AddFavorite(string venueId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Unauthorized();

        await _userService.AddFavoriteAsync(userId, venueId);
        return Ok();
    }

    /// <summary>
    /// Quita local de favoritos
    /// </summary>
    [HttpDelete("favorites/{venueId}")]
    public async Task<IActionResult> RemoveFavorite(string venueId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Unauthorized();

        var removed = await _userService.RemoveFavoriteAsync(userId, venueId);
        if (!removed)
            return NotFound();

        return NoContent();
    }
}
