using DndSheetApi.Models;
using Microsoft.EntityFrameworkCore;

namespace DndSheetApi;

public class DatabaseContext : DbContext
{
    public DatabaseContext(DbContextOptions<DatabaseContext> options): base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Sheet>()
            .ToContainer("Sheets")
            .HasNoDiscriminator();

        base.OnModelCreating(modelBuilder);
    }

    public DbSet<Sheet> Sheets { get; set; }
}