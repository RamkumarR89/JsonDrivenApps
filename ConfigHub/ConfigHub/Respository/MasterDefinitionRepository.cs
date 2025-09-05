using ConfigHub.Respository;
using EFCore.Models;
using Microsoft.EntityFrameworkCore;

namespace ConfigHub.Repository
{
    public interface IMasterDefinitionRepository : IRepository<MasterDefinition>
    {
        Task<MasterDefinition> GetByComponentIdAsync(long id);
        Task<IEnumerable<MasterDefinition>> GetAllByCompIdAsync(long compId);
        // Add any additional methods specific to MasterDefinition if necessary
    }

    public class MasterDefinitionRepository : IMasterDefinitionRepository
    {
        private readonly ConfigHubContext _context;

        public MasterDefinitionRepository(ConfigHubContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<MasterDefinition>> GetAllAsync()
        {
            return await _context.MasterDefinitions.ToListAsync();
        }

        public async Task<IEnumerable<MasterDefinition>> GetAllByCompIdAsync(long compId)
        {
            return await _context.MasterDefinitions.Where(x => x.ComponentId == compId).ToListAsync();
        }

        public async Task<MasterDefinition> GetByIdAsync(long id)
        {
            return await _context.MasterDefinitions.FindAsync(id);
        }

        public async Task<MasterDefinition> GetByComponentIdAsync(long id)
        {
            return await _context.MasterDefinitions.Where(x => x.ComponentId == id).FirstOrDefaultAsync();
        }

        public async Task<MasterDefinition> AddAsync(MasterDefinition entity)
        {
            _context.MasterDefinitions.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<MasterDefinition> UpdateAsync(MasterDefinition entity)
        {
            _context.MasterDefinitions.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task DeleteAsync(long id)
        {
            var entity = await _context.MasterDefinitions.FindAsync(id);
            if (entity != null)
            {
                _context.MasterDefinitions.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }
    }
}
