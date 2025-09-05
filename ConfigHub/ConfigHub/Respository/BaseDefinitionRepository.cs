using EFCore.Models;
using Microsoft.EntityFrameworkCore;

namespace ConfigHub.Respository
{
    public interface IBaseDefinitionRepository : IRepository<BaseDefinition>
    {
        Task<BaseDefinition> GetByComponentIdAsync(long id);
        Task<IEnumerable<BaseDefinition>> GetAllBycompIdAsync(long compId);
        // Add any additional methods specific to BaseDefinition if necessary
    }

    public class BaseDefinitionRepository : IBaseDefinitionRepository
    {
        private readonly ConfigHubContext _context;

        public BaseDefinitionRepository(ConfigHubContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<BaseDefinition>> GetAllAsync()
        {
            return await _context.BaseDefinitions.ToListAsync();
        }

        public async Task<IEnumerable<BaseDefinition>> GetAllBycompIdAsync(long compId)
        {
            return await _context.BaseDefinitions.Where(x => x.ComponentId == compId).ToListAsync();
        }


        public async Task<BaseDefinition> GetByIdAsync(long id)
        {
            return await _context.BaseDefinitions.FindAsync(id);
        }

        public async Task<BaseDefinition> GetByComponentIdAsync(long id)
        {
            return await _context.BaseDefinitions.Where(x => x.ComponentId == id).FirstOrDefaultAsync();
        }

        public async Task<BaseDefinition> AddAsync(BaseDefinition entity)
        {
            _context.BaseDefinitions.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<BaseDefinition> UpdateAsync(BaseDefinition entity)
        {
            _context.BaseDefinitions.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task DeleteAsync(long id)
        {
            var entity = await _context.BaseDefinitions.FindAsync(id);
            if (entity != null)
            {
                _context.BaseDefinitions.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }
    }
}
