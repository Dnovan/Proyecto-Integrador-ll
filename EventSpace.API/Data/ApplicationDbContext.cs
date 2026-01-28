using EventSpace.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace EventSpace.API.Data;

/// <summary>
/// Contexto de base de datos para Entity Framework
/// STUB: Tu compañero implementará la conexión real a la base de datos
/// </summary>
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) 
        : base(options)
    {
    }

    // DbSets - Tu compañero configurará las relaciones y restricciones
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Venue> Venues { get; set; } = null!;
    public DbSet<VenueImage> VenueImages { get; set; } = null!;
    public DbSet<VenueAmenity> VenueAmenities { get; set; } = null!;
    public DbSet<VenuePaymentMethod> VenuePaymentMethods { get; set; } = null!;
    public DbSet<Booking> Bookings { get; set; } = null!;
    public DbSet<Review> Reviews { get; set; } = null!;
    public DbSet<Conversation> Conversations { get; set; } = null!;
    public DbSet<ConversationParticipant> ConversationParticipants { get; set; } = null!;
    public DbSet<Message> Messages { get; set; } = null!;
    public DbSet<FAQ> FAQs { get; set; } = null!;
    public DbSet<UserFavorite> UserFavorites { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuración de UserFavorite (tabla de unión)
        modelBuilder.Entity<UserFavorite>()
            .HasKey(uf => new { uf.UserId, uf.VenueId });

        // Tu compañero añadirá más configuraciones aquí:
        // - Índices
        // - Restricciones de unicidad
        // - Relaciones
        // - Conversiones de enum
        // - Seed data
    }
}
