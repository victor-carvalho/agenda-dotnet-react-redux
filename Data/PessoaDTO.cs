using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Agenda.Models;

namespace Agenda.Data
{
    public class PessoaDTO
    {
        public long Id { get; set; }

        [Required]
        public string Nome { get; set; }

        public List<ContatoDTO> Contatos { get; set; }

        public List<EnderecoDTO> Enderecos { get; set; }

        public List<string> Marcadores { get; set; }
    }
}