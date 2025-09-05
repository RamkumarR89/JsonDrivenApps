using ConfigHub.Shared;
using EFCore.Models;
using Microsoft.EntityFrameworkCore;

namespace ConfigHub.Respository
{
    public interface IBaseDatumRepository : IRepository<BaseDatum>
    {
        Task<IEnumerable<BaseDataDto>> GetBaseDataByComponentIdAsync(long compid);
        Task<BaseDataDto> GetBaseDataByCompIdByIdAsync(long compid, long id);
        // Add any additional methods specific to BaseDatum if necessary
    }

    public class BaseDatumRepository : IBaseDatumRepository
    {
        private readonly ConfigHubContext _context;

        public BaseDatumRepository(ConfigHubContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<BaseDatum>> GetAllAsync()
        {
            return await _context.BaseData.ToListAsync();
        }

        public async Task<BaseDatum> GetByIdAsync(long id)
        {
            return await _context.BaseData.FindAsync(id);
        }

        public async Task<BaseDatum> AddAsync(BaseDatum entity)
        {
            _context.BaseData.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<BaseDatum> UpdateAsync(BaseDatum entity)
        {
            _context.BaseData.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task DeleteAsync(long id)
        {
            var entity = await _context.BaseData.FindAsync(id);
            if (entity != null)
            {
                _context.BaseData.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<BaseDataDto>> GetBaseDataByComponentIdAsync(long compid)
        {
            return await _context.BaseData
                .Where(x => x.ComponentId == compid)
                .Select(x => new BaseDataDto
                {
                    Id = x.Id,
                    ComponentId = x.ComponentId,
                    BaseData = x.BaseData,
                    IsActive = x.IsActive,
                    IsDeleted = x.IsDeleted
                })
                .ToListAsync();
        }

        public async Task<BaseDataDto> GetBaseDataByCompIdByIdAsync(long compid, long id)
        {
            var baseDatum = await _context.BaseData
                .Where(x => x.ComponentId == compid && x.Id == id)
                .FirstOrDefaultAsync();

            if (baseDatum == null)
            {
                return null;
            }

            return new BaseDataDto
            {
                Id = baseDatum.Id,
                ComponentId = baseDatum.ComponentId,
                BaseData = baseDatum.BaseData,
                IsActive = baseDatum.IsActive,
                IsDeleted = baseDatum.IsDeleted
            };
        }
        
    }


}
