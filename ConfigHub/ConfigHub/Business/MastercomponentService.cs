namespace ConfigHub.Business
{
    using AutoMapper;
    using ConfigHub.Respository;
    using ConfigHub.Shared;
    using EFCore.Models;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public interface IMastercomponentService
    {
        Task<IEnumerable<MasterBaseDto>> GetAllAsync();
        Task<MasterBaseDto> GetByIdAsync(long id);
        Task<MasterBaseDto> CreateAsync(MasterBaseDto masterBaseDto);
        Task<MasterBaseDto> UpdateAsync(MasterBaseDto masterBaseDto);
        Task DeleteAsync(long id);
    }

    public class MastercomponentService : IMastercomponentService
    {
        private readonly IRepository<MasterBase> _repository;
        private readonly IMapper _mapper;

        public MastercomponentService(IRepository<MasterBase> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<MasterBaseDto>> GetAllAsync()
        {
            var masterBases = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<MasterBaseDto>>(masterBases);
        }

        public async Task<MasterBaseDto> GetByIdAsync(long id)
        {
            var masterBase = await _repository.GetByIdAsync(id);
            return _mapper.Map<MasterBaseDto>(masterBase);
        }

        public async Task<MasterBaseDto> CreateAsync(MasterBaseDto masterBaseDto)
        {
            var masterBase = _mapper.Map<MasterBase>(masterBaseDto);
            var createdMasterBase = await _repository.AddAsync(masterBase);
            return _mapper.Map<MasterBaseDto>(createdMasterBase);
        }

        public async Task<MasterBaseDto> UpdateAsync(MasterBaseDto masterBaseDto)
        {
            var masterBase = _mapper.Map<MasterBase>(masterBaseDto);
            var updatedMasterBase = await _repository.UpdateAsync(masterBase);
            return _mapper.Map<MasterBaseDto>(updatedMasterBase);
        }

        public async Task DeleteAsync(long id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}
