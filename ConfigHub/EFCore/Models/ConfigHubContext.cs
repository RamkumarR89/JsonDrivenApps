using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace EFCore.Models;

public partial class ConfigHubContext : DbContext
{
    public ConfigHubContext()
    {
    }
    public ConfigHubContext(DbContextOptions<ConfigHubContext> options)
        : base(options)
    {
    }

    public virtual DbSet<BaseDatum> BaseData { get; set; }

    public virtual DbSet<BaseDefinition> BaseDefinitions { get; set; }

    public virtual DbSet<Basecomponent> Basecomponents { get; set; }

    public virtual DbSet<MasterBase> MasterBases { get; set; } // Added MasterBase

    public virtual DbSet<MasterDefinition> MasterDefinitions { get; set; } // Added MasterBase
    public virtual DbSet<MasterDatum> MasterData { get; set; } // Added MasterBase



    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            // Read connection string from appsettings.json
            var config = new ConfigurationBuilder()
                .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .Build();
            var connectionString = config.GetConnectionString("DefaultConnection");
            optionsBuilder.UseSqlite(connectionString);
        }
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<BaseDefinition>(entity =>
        {
            entity.ToTable("BaseDefinition");
        });

        modelBuilder.Entity<Basecomponent>(entity =>
        {
            entity.ToTable("Basecomponent");

            entity.Property(e => e.ComponentName).HasMaxLength(255);
            entity.Property(e => e.DisplayName).HasMaxLength(255);
            entity.Property(e => e.ParentComponent).HasMaxLength(255);
        });


        modelBuilder.Entity<MasterBase>(entity =>
        {
            entity.ToTable("MasterBase");

            entity.Property(e => e.Name).HasMaxLength(255);
            entity.Property(e => e.DisplayName).HasMaxLength(255);
            entity.Property(e => e.ParentComponent).HasMaxLength(255);
        });

        modelBuilder.Entity<MasterDefinition>(entity =>
        {
            entity.ToTable("MasterDefinition");
        });
    }
}

public class JsonValueConverter<T> : ValueConverter<T, string>
{
    public JsonValueConverter() : base(
        v => JsonConvert.SerializeObject(v),
    v => JsonConvert.DeserializeObject<T>(v) ?? Activator.CreateInstance<T>())
    { }
}
