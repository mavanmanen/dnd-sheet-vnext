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
        var config = builder.GetContext().Configuration;
        builder.Services.AddDbContext<DatabaseContext>(options =>
            options.UseCosmos(config.GetValue<string>("DatabaseConnection"), config.GetValue<string>("DatabaseName")));
    }
}