using System.Text;
using EventSpace.API.Data;
using EventSpace.API.Helpers;
using EventSpace.API.Middleware;
using EventSpace.API.Services.Implementations;
using EventSpace.API.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// ==================== SERVICIOS ====================

// Controllers
builder.Services.AddControllers();

// Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "EventSpace API",
        Version = "v1",
        Description = "API Backend para la plataforma EventSpace - Renta de locales para eventos"
    });

    // JWT Authentication en Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header. Ejemplo: \"Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Database Context (stub - tu compañero configurará la conexión real)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    // TODO: Tu compañero reemplazará esto con la cadena de conexión real
    // options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
    options.UseInMemoryDatabase("EventSpaceDb"); // Temporal para desarrollo
});

// JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new Exception("JWT Key no configurada");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ClockSkew = TimeSpan.Zero
        };
    });

// Authorization Policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("ClienteOnly", policy =>
        policy.RequireRole("CLIENTE"));

    options.AddPolicy("ProveedorOnly", policy =>
        policy.RequireRole("PROVEEDOR"));

    options.AddPolicy("AdminOnly", policy =>
        policy.RequireRole("ADMIN"));

    options.AddPolicy("ProveedorOrAdmin", policy =>
        policy.RequireRole("PROVEEDOR", "ADMIN"));
});

// CORS
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() 
    ?? new[] { "http://localhost:5173" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Helpers
builder.Services.AddSingleton<JwtHelper>();

// Services (usando implementaciones mock por ahora)
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IVenueService, VenueService>();
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<IMessageService, MessageService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IMetricsService, MetricsService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IFAQService, FAQService>();

var app = builder.Build();

// ==================== MIDDLEWARE PIPELINE ====================

// Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "EventSpace API v1");
        c.RoutePrefix = "swagger";
    });
}

// HTTPS Redirect (producción)
app.UseHttpsRedirection();

// CORS
app.UseCors("AllowFrontend");

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// Controllers
app.MapControllers();

// Endpoint de salud
app.MapGet("/", () => Results.Ok(new 
{ 
    message = "EventSpace API is running",
    version = "1.0.0",
    docs = "/swagger"
}));

app.Run();
