using AutoMapper;
using ConfigHub.Respository;
using ConfigHub.Shared;
using EFCore.Models;

namespace ConfigHub.Business
{
    public interface IBaseDefinitionService
    {
        Task<IEnumerable<BaseDefinitionDto>> GetAllAsync();
        Task<IEnumerable<BaseDefinitionDto>> GetAllBycompIdAsync(long compId);
        Task<BaseDefinitionDto> GetByIdAsync(long id);
        Task<BaseDefinitionDto> GetByComponentIdAsync(long id);
        Task<BaseDefinitionDto> CreateAsync(BaseDefinitionDto baseDefinitionDto);
        Task<BaseDefinitionDto> UpdateAsync(BaseDefinitionDto baseDefinitionDto);
        Task DeleteAsync(long id);
    }


    public class BaseDefinitionService : IBaseDefinitionService
    {
        private readonly IBaseDefinitionRepository _repository;
        private readonly IMapper _mapper;

        public BaseDefinitionService(IBaseDefinitionRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<BaseDefinitionDto>> GetAllAsync()
        {
            var baseDefinitions = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<BaseDefinitionDto>>(baseDefinitions);
        }

        public async Task<BaseDefinitionDto> GetByIdAsync(long id)
        {
            var baseDefinition = await _repository.GetByIdAsync(id);
            return _mapper.Map<BaseDefinitionDto>(baseDefinition);
        }

        public async Task<BaseDefinitionDto> GetByComponentIdAsync(long id)
        {
            var baseDefinition = await _repository.GetByComponentIdAsync(id);
            return _mapper.Map<BaseDefinitionDto>(baseDefinition);
        }

        public async Task<BaseDefinitionDto> CreateAsync(BaseDefinitionDto baseDefinitionDto)
        {
            var baseDefinition = _mapper.Map<BaseDefinition>(baseDefinitionDto);
            var createdBaseDefinition = await _repository.AddAsync(baseDefinition);
            return _mapper.Map<BaseDefinitionDto>(createdBaseDefinition);
        }

        public async Task<BaseDefinitionDto> UpdateAsync(BaseDefinitionDto baseDefinitionDto)
        {
            var baseDefinition = _mapper.Map<BaseDefinition>(baseDefinitionDto);
            var updatedBaseDefinition = await _repository.UpdateAsync(baseDefinition);
            return _mapper.Map<BaseDefinitionDto>(updatedBaseDefinition);
        }

        public async Task DeleteAsync(long id)
        {
            await _repository.DeleteAsync(id);
        }

        public async Task<IEnumerable<BaseDefinitionDto>> GetAllBycompIdAsync(long compId)
        {
            var baseDefinitions = await _repository.GetAllBycompIdAsync(compId);
            return _mapper.Map<IEnumerable<BaseDefinitionDto>>(baseDefinitions);
        }
    }
}
