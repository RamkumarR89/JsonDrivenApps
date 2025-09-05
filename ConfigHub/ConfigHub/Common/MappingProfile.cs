using AutoMapper;
using ConfigHub.Shared;
using EFCore.Models;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Basecomponent, BasecomponentDto>().ReverseMap();
        CreateMap<BaseDatum, BaseDataDto>().ReverseMap();
        CreateMap<BaseDefinition, BaseDefinitionDto>().ReverseMap();

        CreateMap<MasterBase, MasterBaseDto>()
    .ForMember(dest => dest.ComponentName, opt => opt.MapFrom(src => src.Name))
    .ReverseMap()
    .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.ComponentName));

        CreateMap<MasterDatum, MasterDataDto>().ReverseMap();
        CreateMap<MasterDefinition, MasterDefinitionDto>().ReverseMap();
    }
}
