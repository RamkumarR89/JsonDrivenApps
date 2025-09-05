using AutoMapper;
using ConfigHub.Repository;
using ConfigHub.Respository;
using ConfigHub.Shared;
using EFCore.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ConfigHub.Business
{
    public interface IMasterDataService
    {
        Task<IEnumerable<MasterDataDto>> GetAllAsync();
        Task<MasterDataDto> GetByIdAsync(long id);
        Task<MasterDataDto> GetByComponentIdAsync(long id);
        Task<MasterDataDto> CreateAsync(MasterDataDto masterDataDto);
        Task<MasterDataDto> UpdateAsync(MasterDataDto masterDataDto);
        Task DeleteAsync(long id);
    }

    public class MasterDataService : IMasterDataService
    {
        private readonly IMasterDataRepository _repository;
        private readonly IMapper _mapper;

        public MasterDataService(IMasterDataRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<MasterDataDto>> GetAllAsync()
        {
            var masterData = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<MasterDataDto>>(masterData);
        }

        public async Task<MasterDataDto> GetByIdAsync(long id)
        {
            var masterData = await _repository.GetByIdAsync(id);
            return _mapper.Map<MasterDataDto>(masterData);
        }

        public async Task<MasterDataDto> GetByComponentIdAsync(long id)
        {
            var masterData = await _repository.GetMasterDataByComponentIdAsync(id);
            return _mapper.Map<MasterDataDto>(masterData);
        }

        public async Task<MasterDataDto> CreateAsync(MasterDataDto masterDataDto)
        {
            var masterData = _mapper.Map<MasterDatum>(masterDataDto);
            var createdMasterData = await _repository.AddAsync(masterData);
            return _mapper.Map<MasterDataDto>(createdMasterData);
        }

        public async Task<MasterDataDto> UpdateAsync(MasterDataDto masterDataDto)
        {
            var masterData = _mapper.Map<MasterDatum>(masterDataDto);
            var updatedMasterData = await _repository.UpdateAsync(masterData);
            return _mapper.Map<MasterDataDto>(updatedMasterData);
        }

        public async Task DeleteAsync(long id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}
