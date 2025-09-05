using AutoMapper;
using ConfigHub.Repository;
using ConfigHub.Respository;
using ConfigHub.Shared;
using EFCore.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ConfigHub.Business
{
    public interface IMasterDefinitionService
    {
        Task<IEnumerable<MasterDefinitionDto>> GetAllAsync();
        Task<IEnumerable<MasterDefinitionDto>> GetAllByCompIdAsync(long compId);
        Task<MasterDefinitionDto> GetByIdAsync(long id);
        Task<MasterDefinitionDto> GetByComponentIdAsync(long id);
        Task<MasterDefinitionDto> CreateAsync(MasterDefinitionDto masterDefinitionDto);
        Task<MasterDefinitionDto> UpdateAsync(MasterDefinitionDto masterDefinitionDto);
        Task DeleteAsync(long id);
    }

    public class MasterDefinitionService : IMasterDefinitionService
    {
        private readonly IMasterDefinitionRepository _repository;
        private readonly IMapper _mapper;

        public MasterDefinitionService(IMasterDefinitionRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<MasterDefinitionDto>> GetAllAsync()
        {
            var masterDefinitions = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<MasterDefinitionDto>>(masterDefinitions);
        }

        public async Task<MasterDefinitionDto> GetByIdAsync(long id)
        {
            var masterDefinition = await _repository.GetByIdAsync(id);
            return _mapper.Map<MasterDefinitionDto>(masterDefinition);
        }

        public async Task<MasterDefinitionDto> GetByComponentIdAsync(long id)
        {
            var masterDefinition = await _repository.GetByComponentIdAsync(id);
            return _mapper.Map<MasterDefinitionDto>(masterDefinition);
        }

        public async Task<MasterDefinitionDto> CreateAsync(MasterDefinitionDto masterDefinitionDto)
        {
            var masterDefinition = _mapper.Map<MasterDefinition>(masterDefinitionDto);
            var createdMasterDefinition = await _repository.AddAsync(masterDefinition);
            return _mapper.Map<MasterDefinitionDto>(createdMasterDefinition);
        }

        public async Task<MasterDefinitionDto> UpdateAsync(MasterDefinitionDto masterDefinitionDto)
        {
            var masterDefinition = _mapper.Map<MasterDefinition>(masterDefinitionDto);
            var updatedMasterDefinition = await _repository.UpdateAsync(masterDefinition);
            return _mapper.Map<MasterDefinitionDto>(updatedMasterDefinition);
        }

        public async Task DeleteAsync(long id)
        {
            await _repository.DeleteAsync(id);
        }

        public async Task<IEnumerable<MasterDefinitionDto>> GetAllByCompIdAsync(long compId)
        {
            var masterDefinitions = await _repository.GetAllByCompIdAsync(compId);
            return _mapper.Map<IEnumerable<MasterDefinitionDto>>(masterDefinitions);
        }
    }
}
