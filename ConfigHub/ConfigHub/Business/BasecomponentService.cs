namespace ConfigHub.Business
{
    using AutoMapper;
    using ConfigHub.Respository;
    using ConfigHub.Shared;
    using EFCore.Models;

    public interface IBasecomponentService
    {
        Task<IEnumerable<BasecomponentDto>> GetAllAsync();
        Task<BasecomponentDto> GetByIdAsync(long id);
        Task<BasecomponentDto> CreateAsync(BasecomponentDto basecomponentDto);
        Task<BasecomponentDto> UpdateAsync(BasecomponentDto basecomponentDto);
        Task DeleteAsync(long id);
    }

    public class BasecomponentService : IBasecomponentService
    {
        private readonly IRepository<Basecomponent> _repository;
        private readonly IMapper _mapper;

        public BasecomponentService(IRepository<Basecomponent> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<BasecomponentDto>> GetAllAsync()
        {
            var basecomponents = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<BasecomponentDto>>(basecomponents);
        }

        public async Task<BasecomponentDto> GetByIdAsync(long id)
        {
            var basecomponent = await _repository.GetByIdAsync(id);
            return _mapper.Map<BasecomponentDto>(basecomponent);
        }

        public async Task<BasecomponentDto> CreateAsync(BasecomponentDto basecomponentDto)
        {
            var basecomponent = _mapper.Map<Basecomponent>(basecomponentDto);
            var createdBasecomponent = await _repository.AddAsync(basecomponent);
            return _mapper.Map<BasecomponentDto>(createdBasecomponent);
        }

        public async Task<BasecomponentDto> UpdateAsync(BasecomponentDto basecomponentDto)
        {
            var basecomponent = _mapper.Map<Basecomponent>(basecomponentDto);
            var updatedBasecomponent = await _repository.UpdateAsync(basecomponent);
            return _mapper.Map<BasecomponentDto>(updatedBasecomponent);
        }

        public async Task DeleteAsync(long id)
        {
            await _repository.DeleteAsync(id);
        }
    }

}
