using System;
using Mavanmanen.DndSheet.API;
using Mavanmanen.DndSheet.API.Data;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

[assembly: FunctionsStartup(typeof(Startup))]

namespace Mavanmanen.DndSheet.API;

public class Startup : FunctionsStartup
{
    public override void Configure(IFunctionsHostBuilder builder)
    {
        var configuration = builder.GetContext().Configuration;
        builder.Services.AddDbContext<DatabaseContext>(options => options.UseSqlite(configuration.GetConnectionStringOrSetting("DatabaseConnectionString")));
    }
}