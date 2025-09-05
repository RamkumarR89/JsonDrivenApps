# ConfigHub Database Configuration

## Current Setup

The database files are organized in the `DB` folder for better structure and maintainability.

### Current Configuration
- **Database Type**: SQLite (Local Development)
- **Database Location**: `DB/ConfigHub.db`
- **Connection String**: `Data Source=DB/ConfigHub.db`

## How to Switch Database Providers

### 1. SQLite (Current - Recommended for Development)
```json
"ConnectionStrings": {
  "DefaultConnection": "Data Source=DB/ConfigHub.db"
}
```

### 2. SQL Server LocalDB
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=ConfigHub;Integrated Security=True;Encrypt=False;TrustServerCertificate=True;"
}
```

### 3. SQL Server (Remote with Windows Authentication)
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=ConfigHub;Integrated Security=True;Encrypt=False;TrustServerCertificate=True;"
}
```

### 4. SQL Server (Remote with SQL Authentication)
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=ConfigHub;User Id=YOUR_USERNAME;Password=YOUR_PASSWORD;Encrypt=False;TrustServerCertificate=True;"
}
```

## Steps to Switch Database

1. **Update Connection String**: Modify the `DefaultConnection` in `appsettings.json`
2. **Install Required Packages** (if needed):
   - For SQL Server: `Microsoft.EntityFrameworkCore.SqlServer` (already installed)
   - For MySQL: `Pomelo.EntityFrameworkCore.MySQL`
   - For PostgreSQL: `Npgsql.EntityFrameworkCore.PostgreSQL`
3. **Update Database Provider** (if using non-SQL Server/SQLite): Modify `ServiceExtensions.cs`
4. **Run Database Migrations**: `dotnet ef database update`

## Auto-Detection

The application automatically detects the database provider based on the connection string:
- **SQLite**: If connection string contains `Data Source=` and `.db`
- **SQL Server**: If connection string contains `Server=` or `Data Source=` without `.db`

## Database Files (SQLite)

When using SQLite, you'll see these files in the `DB` folder:
- `ConfigHub.db` - Main database file
- `ConfigHub.db-shm` - Shared memory file (performance)
- `ConfigHub.db-wal` - Write-Ahead Log file (transactions)

## Backup and Restore (SQLite)

- **Backup**: Copy the entire `DB` folder
- **Restore**: Replace the `DB` folder with your backup
- **Reset**: Delete the `DB` folder and restart the application

## Migration Commands

```bash
# Create new migration
dotnet ef migrations add MigrationName --project EFCore --startup-project ConfigHub

# Update database
dotnet ef database update --project EFCore --startup-project ConfigHub

# Remove last migration
dotnet ef migrations remove --project EFCore --startup-project ConfigHub
```
