using EFCore.Models;
using Microsoft.EntityFrameworkCore;

namespace ConfigHub.Respository
{
    public interface IBasecomponentRepository : IRepository<Basecomponent>
    {
        // Add any additional methods specific to BaseDefinition if necessary
    }

    public class BasecomponentRepository : IBasecomponentRepository
    {
        private readonly ConfigHubContext _context;

        public BasecomponentRepository(ConfigHubContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Basecomponent>> GetAllAsync()
        {
            return await _context.Basecomponents.ToListAsync();
        }

        public async Task<Basecomponent> GetByIdAsync(long id)
        {
            return await _context.Basecomponents.FindAsync(id);
        }

        public async Task<Basecomponent> AddAsync(Basecomponent entity)
        {
            _context.Basecomponents.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<Basecomponent> UpdateAsync(Basecomponent entity)
        {
            _context.Basecomponents.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task DeleteAsync(long id)
        {
            var entity = await _context.Basecomponents.FindAsync(id);
            if (entity != null)
            {
                _context.Basecomponents.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }
    }

}
