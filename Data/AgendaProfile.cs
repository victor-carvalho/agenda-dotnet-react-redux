using AutoMapper;
using Agenda.Models;

namespace Agenda.Data
{
    public class AgendaProfile : Profile
    {
        public AgendaProfile()
        {
            CreateMap<string, Marcador>()
                .ForMember(m => m.Valor, opt => opt.MapFrom(s => s))
                .ReverseMap()
                .ConvertUsing(m => m.Valor);
            CreateMap<Contato, ContatoDTO>().ReverseMap();
            CreateMap<Endereco, EnderecoDTO>().ReverseMap();
            CreateMap<Pessoa, PessoaDTO>().ReverseMap();
        }
    }
}