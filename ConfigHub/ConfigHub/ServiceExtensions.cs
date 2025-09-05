using ConfigHub.Business;
using ConfigHub.Repository;
using ConfigHub.Respository;
using EFCore.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ConfigHub
{
    public static class ServiceExtensions
    {
        public static void ConfigureServices(this IServiceCollection services, IConfiguration configuration)
        {
            // Configure DbContext - Auto-detect database provider based on connection string
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            
            services.AddDbContext<ConfigHubContext>(options =>
            {
                if (string.IsNullOrEmpty(connectionString))
                {
                    throw new InvalidOperationException("DefaultConnection string is not configured.");
                }
                
                // Auto-detect database provider based on connection string pattern
                if (connectionString.Contains("Data Source=") && connectionString.Contains(".db"))
                {
                    // SQLite
                    options.UseSqlite(connectionString);
                }
                else if (connectionString.Contains("Server=") || connectionString.Contains("Data Source="))
                {
                    // SQL Server
                    options.UseSqlServer(connectionString);
                }
                else
                {
                    // Default to SQLite for safety
                    options.UseSqlite(connectionString);
                }
            });

            // Register repository and service
            // Register Basecomponent
            services.AddScoped<IRepository<Basecomponent>, BasecomponentRepository>();
            services.AddScoped<IBasecomponentService, BasecomponentService>();

            // Register BaseDatum
            services.AddScoped<IBaseDatumRepository, BaseDatumRepository>();
            services.AddScoped<IBaseDatumService, BaseDatumService>();

            // Register BaseDefinition
            services.AddScoped<IBaseDefinitionRepository, BaseDefinitionRepository>();
            services.AddScoped<IBaseDefinitionService, BaseDefinitionService>();

            // Register repository and service
            // Register Basecomponent
            services.AddScoped<IRepository<MasterBase>, MasterBaseRepository>();
            services.AddScoped<IMastercomponentService, MastercomponentService>();

            // Register BaseDatum
            services.AddScoped<IMasterDataRepository, MasterDataRepository>();
            services.AddScoped<IMasterDataService, MasterDataService>();

            // Register BaseDefinition
            services.AddScoped<IMasterDefinitionRepository, MasterDefinitionRepository>();
            services.AddScoped<IMasterDefinitionService, MasterDefinitionService>();

            // Register AutoMapper
            services.AddAutoMapper(typeof(MappingProfile));
        }
    }

}
