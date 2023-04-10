using System;
using System.Reflection;
using AzureFunctions.Extensions.Swashbuckle;
using DndSheetApi;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

[assembly: FunctionsStartup(typeof(Startup))]

namespace DndSheetApi;

public class Startup : FunctionsStartup
{
    public override void Configure(IFunctionsHostBuilder builder)
    {
        var context = builder.GetContext();
        var config = context.Configuration;
        builder.Services.AddDbContext<DatabaseContext>(options =>
            options.UseCosmos(config.GetValue<string>("DatabaseConnection"), config.GetValue<string>("DatabaseName")));

        if (context.EnvironmentName.Equals("development", StringComparison.OrdinalIgnoreCase))
        {
            builder.Services.AddSwashBuckle(Assembly.GetExecutingAssembly());
        }
    }
}