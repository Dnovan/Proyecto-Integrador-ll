using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using EventSpace.API.Models.Entities;
using EventSpace.API.Models.Enums;
using Microsoft.IdentityModel.Tokens;

namespace EventSpace.API.Helpers;

/// <summary>
/// Helper para generación y validación de tokens JWT
/// </summary>
public class JwtHelper
{
    private readonly IConfiguration _configuration;

    public JwtHelper(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    /// <summary>
    /// Genera un token JWT para el usuario
    /// </summary>
    public string GenerateToken(User user)
    {
        var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!);
        var issuer = _configuration["Jwt:Issuer"];
        var audience = _configuration["Jwt:Audience"];
        var expirationMinutes = int.Parse(_configuration["Jwt:ExpirationInMinutes"] ?? "60");

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Name, user.Name),
            new(ClaimTypes.Role, user.Role.ToString())
        };

        var securityKey = new SymmetricSecurityKey(key);
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expirationMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    /// <summary>
    /// Genera un refresh token
    /// </summary>
    public string GenerateRefreshToken()
    {
        return Convert.ToBase64String(Guid.NewGuid().ToByteArray());
    }

    /// <summary>
    /// Valida un token JWT y retorna los claims
    /// </summary>
    public ClaimsPrincipal? ValidateToken(string token)
    {
        try
        {
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!);
            var tokenHandler = new JwtSecurityTokenHandler();
            
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = _configuration["Jwt:Issuer"],
                ValidateAudience = true,
                ValidAudience = _configuration["Jwt:Audience"],
                ClockSkew = TimeSpan.Zero
            };

            var principal = tokenHandler.ValidateToken(token, validationParameters, out _);
            return principal;
        }
        catch
        {
            return null;
        }
    }

    /// <summary>
    /// Extrae el ID del usuario del token
    /// </summary>
    public string? GetUserIdFromToken(ClaimsPrincipal? principal)
    {
        return principal?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    }

    /// <summary>
    /// Extrae el rol del usuario del token
    /// </summary>
    public UserRole? GetUserRoleFromToken(ClaimsPrincipal? principal)
    {
        var roleStr = principal?.FindFirst(ClaimTypes.Role)?.Value;
        if (Enum.TryParse<UserRole>(roleStr, out var role))
            return role;
        return null;
    }
}
