using ConfigHub;
using ConfigHub.Business;
using ConfigHub.Respository;
using EFCore;
using EFCore.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

// Add services to the container.
builder.Services.ConfigureServices(builder.Configuration);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ConfigHubContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    
    // Create DB directory if it doesn't exist
    var dbDirectory = Path.Combine(Directory.GetCurrentDirectory(), "DB");
    if (!Directory.Exists(dbDirectory))
    {
        Directory.CreateDirectory(dbDirectory);
        logger.LogInformation("Created DB directory: {DbDirectory}", dbDirectory);
    }
    
    await context.Database.EnsureCreatedAsync();
    
    // Seed data if no components exist
    if (!await context.Basecomponents.AnyAsync())
    {
        logger.LogInformation("Seeding database with sample data...");
        context.Basecomponents.AddRange(
            new Basecomponent { Id = 2, ComponentName = "EMP Detail", ParentComponent = "16", DisplayName = "EMP Detail", IsActive = true, IsDeleted = false, ComponentJson = "{\"menuicon\": \"far fa-file-alt me-2\",\"routerurl\": \"/adminconfiguration/baseconfiguration\",\"routerparam\": \"\"}", CustomAttributeJson = null, IsMaster = false },
            new Basecomponent { Id = 14, ComponentName = "ContractDetail", ParentComponent = "16", DisplayName = "Contract Detail", IsActive = true, IsDeleted = false, ComponentJson = "{\"menuicon\": \"far fa-file-alt me-2\",\"routerurl\": \"/adminconfiguration/baseconfiguration\",\"routerparam\": \"\"}", CustomAttributeJson = null, IsMaster = false },
            new Basecomponent { Id = 15, ComponentName = "Register Form", ParentComponent = "16", DisplayName = "Register Form", IsActive = true, IsDeleted = false, ComponentJson = "{\"menuicon\": \"far fa-file-alt me-2\",\"routerurl\": \"/adminconfiguration/baseconfiguration\",\"routerparam\": \"\"}", CustomAttributeJson = null, IsMaster = false },
            new Basecomponent { Id = 16, ComponentName = "DefaultComponent", ParentComponent = "0", DisplayName = "Home", IsActive = true, IsDeleted = false, ComponentJson = "{\"menuicon\": \"far fa-file-alt me-2\",\"routerurl\": \"/adminconfiguration/jsonformviewer\",\"routerparam\": \"\"}", CustomAttributeJson = null, IsMaster = false }
        );
        await context.SaveChangesAsync();
        logger.LogInformation("Database seeded with {Count} components", 4);
    }
    
    // Log database configuration
    logger.LogInformation("Database configured with connection string: {ConnectionString}", connectionString);
    
    if (connectionString?.Contains("Data Source=") == true && connectionString.Contains(".db"))
    {
        // SQLite database
        var dbPath = connectionString.Replace("Data Source=", "").Split(';')[0];
        var fullDbPath = Path.Combine(Directory.GetCurrentDirectory(), dbPath);
        logger.LogInformation("SQLite database file location: {DbPath}", fullDbPath);
    }
    else
    {
        // Other database (SQL Server, etc.)
        logger.LogInformation("Using external database server");
    }
}

app.UseCors("AllowAll"); // Enable CORS

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// HTTPS redirection disabled for development with HTTP

app.UseAuthorization();

app.MapControllers();

await app.RunAsync();
