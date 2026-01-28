using System.Security.Claims;

namespace EventSpace.API.Middleware;

/// <summary>
/// Middleware para autenticación JWT
/// </summary>
public class JwtMiddleware
{
    private readonly RequestDelegate _next;

    public JwtMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, IServiceProvider serviceProvider)
    {
        var token = context.Request.Headers["Authorization"]
            .FirstOrDefault()?.Split(" ").Last();

        if (!string.IsNullOrEmpty(token))
        {
            var jwtHelper = serviceProvider.GetRequiredService<Helpers.JwtHelper>();
            var principal = jwtHelper.ValidateToken(token);

            if (principal != null)
            {
                context.User = principal;
            }
        }

        await _next(context);
    }
}

/// <summary>
/// Extensiones para registrar el middleware
/// </summary>
public static class JwtMiddlewareExtensions
{
    public static IApplicationBuilder UseJwtMiddleware(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<JwtMiddleware>();
    }
}
