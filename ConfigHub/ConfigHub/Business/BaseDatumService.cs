using AutoMapper;
using ConfigHub.Respository;
using ConfigHub.Shared;
using EFCore.Models;

namespace ConfigHub.Business
{
    public interface IBaseDatumService
    {
        Task<IEnumerable<BaseDataDto>> GetAllAsync();
        Task<BaseDataDto> GetByIdAsync(long id);
        Task<IEnumerable<BaseDataDto>> GetBaseDataByComponentIdAsync(long compid);
        Task<BaseDataDto> GetBaseDataByCompIdByIdAsync(long compid, long id);
        Task<BaseDataDto> CreateAsync(BaseDataDto baseDatumDto);
        Task<BaseDataDto> UpdateAsync(BaseDataDto baseDatumDto);
        Task DeleteAsync(long id);
    }

    public class BaseDatumService : IBaseDatumService
    {
        private readonly IBaseDatumRepository _repository;
        private readonly IMapper _mapper;

        public BaseDatumService(IBaseDatumRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<BaseDataDto>> GetAllAsync()
        {
            var baseData = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<BaseDataDto>>(baseData);
        }

        public async Task<BaseDataDto> GetByIdAsync(long id)
        {
            var baseDatum = await _repository.GetByIdAsync(id);
            return _mapper.Map<BaseDataDto>(baseDatum);
        }

        public async Task<BaseDataDto> CreateAsync(BaseDataDto baseDatumDto)
        {
            var baseDatum = _mapper.Map<BaseDatum>(baseDatumDto);
            var createdBaseDatum = await _repository.AddAsync(baseDatum);
            return _mapper.Map<BaseDataDto>(createdBaseDatum);
        }

        public async Task<BaseDataDto> UpdateAsync(BaseDataDto baseDatumDto)
        {
            var baseDatum = _mapper.Map<BaseDatum>(baseDatumDto);
            var updatedBaseDatum = await _repository.UpdateAsync(baseDatum);
            return _mapper.Map<BaseDataDto>(updatedBaseDatum);
        }

        public async Task DeleteAsync(long id)
        {
            await _repository.DeleteAsync(id);
        }

        public async Task<IEnumerable<BaseDataDto>> GetBaseDataByComponentIdAsync(long compid)
        {
            var baseData = await _repository.GetBaseDataByComponentIdAsync(compid);
            return _mapper.Map<IEnumerable<BaseDataDto>>(baseData);
        }

        public async Task<BaseDataDto> GetBaseDataByCompIdByIdAsync(long compid, long id)
        {
            var baseData = await _repository.GetBaseDataByCompIdByIdAsync(compid,id);
            return _mapper.Map<BaseDataDto>(baseData);
        }
    }


}
