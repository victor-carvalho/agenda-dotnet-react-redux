using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Agenda.Models
{
    public class Pessoa : BaseEntity
    {
        [Required]
        public string Nome { get; set; }

        public List<Contato> Contatos { get; set; }

        public List<Endereco> Enderecos { get; set; }

        public List<Marcador> Marcadores { get; set; }
    }
}