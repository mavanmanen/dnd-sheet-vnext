using Mavanmanen.DndSheet.API.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Mavanmanen.DndSheet.API.Data;

public sealed class DatabaseContext : DbContext
{
    public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
    {
        Database.Migrate();
    }

    public DbSet<Sheet> Sheets { get; set; }
}