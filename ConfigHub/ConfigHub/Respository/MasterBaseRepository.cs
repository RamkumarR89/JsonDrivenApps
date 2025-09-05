using ConfigHub.Respository;
using EFCore.Models;
using Microsoft.EntityFrameworkCore;

namespace ConfigHub.Repository
{
    public interface IMasterBaseRepository : IRepository<MasterBase>
    {
        // Add any additional methods specific to MasterBase if necessary
    }

    public class MasterBaseRepository : IMasterBaseRepository
    {
        private readonly ConfigHubContext _context;

        public MasterBaseRepository(ConfigHubContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<MasterBase>> GetAllAsync()
        {
            return await _context.MasterBases.ToListAsync();
        }

        public async Task<MasterBase> GetByIdAsync(long id)
        {
            return await _context.MasterBases.FindAsync(id);
        }

        public async Task<MasterBase> AddAsync(MasterBase entity)
        {
            _context.MasterBases.Add(entity);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception eex)
            {

                throw;
            }
            return entity;
        }

        public async Task<MasterBase> UpdateAsync(MasterBase entity)
        {
            _context.MasterBases.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task DeleteAsync(long id)
        {
            var entity = await _context.MasterBases.FindAsync(id);
            if (entity != null)
            {
                _context.MasterBases.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }
    }
}
