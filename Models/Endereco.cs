using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Agenda.Models
{
    public class Endereco : BaseEntity
    {
        [Required]
        public string Logradouro { get; set; }

        public string Tipo { get; set; }

        public string Numero { get; set; }

        public string Complemento { get; set; }

        public string Bairro { get; set; }

        public string Cidade { get; set; }

        public string Estado { get; set; }

        public Pessoa Pessoa { get; set; }
    }
}