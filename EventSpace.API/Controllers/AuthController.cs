using EventSpace.API.Models.DTOs.Auth;
using EventSpace.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EventSpace.API.Controllers;

/// <summary>
/// Controlador de autenticación
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    /// <summary>
    /// Inicia sesión con credenciales
    /// </summary>
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _authService.LoginAsync(request);
        
        if (result == null)
            return Unauthorized(new { message = "Credenciales inválidas" });

        return Ok(result);
    }

    /// <summary>
    /// Registra un nuevo cliente
    /// </summary>
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var result = await _authService.RegisterAsync(request);
        
        if (result == null)
            return BadRequest(new { message = "El email ya está registrado" });

        return CreatedAtAction(nameof(GetCurrentUser), result);
    }

    /// <summary>
    /// Cierra sesión
    /// </summary>
    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId != null)
            await _authService.LogoutAsync(userId);

        return Ok();
    }

    /// <summary>
    /// Obtiene el usuario actual
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Unauthorized();

        var user = await _authService.GetCurrentUserAsync(userId);
        if (user == null)
            return NotFound();

        return Ok(user);
    }

    /// <summary>
    /// Renueva el token JWT
    /// </summary>
    [HttpPost("refresh-token")]
    [AllowAnonymous]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        var result = await _authService.RefreshTokenAsync(request.RefreshToken);
        
        if (result == null)
            return Unauthorized(new { message = "Token inválido" });

        return Ok(result);
    }
}
