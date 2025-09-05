using ConfigHub.Respository;
using EFCore.Models;
using Microsoft.EntityFrameworkCore;

namespace ConfigHub.Repository
{
    public interface IMasterDataRepository : IRepository<MasterDatum>
    {
        Task<MasterDatum> GetMasterDataByComponentIdAsync(long id);
        // Add any additional methods specific to MasterData if necessary
    }

    public class MasterDataRepository : IMasterDataRepository
    {
        private readonly ConfigHubContext _context;

        public MasterDataRepository(ConfigHubContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<MasterDatum>> GetAllAsync()
        {
            return await _context.MasterData.ToListAsync();
        }

        public async Task<MasterDatum> GetByIdAsync(long id)
        {
            return await _context.MasterData.FindAsync(id);
        }

        public async Task<MasterDatum> AddAsync(MasterDatum entity)
        {
            _context.MasterData.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<MasterDatum> UpdateAsync(MasterDatum entity)
        {
            _context.MasterData.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task DeleteAsync(long id)
        {
            var entity = await _context.MasterData.FindAsync(id);
            if (entity != null)
            {
                _context.MasterData.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<MasterDatum> GetMasterDataByComponentIdAsync(long id)
        {
            return await _context.MasterData.Where(x => x.ComponentId == id).FirstOrDefaultAsync();
        }
    }
}
