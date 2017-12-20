using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Agenda.Models
{
    public class Contato : BaseEntity
    {
        [Required]
        public string Tipo { get; set; }

        [Required]
        public string Valor { get; set; }

        public Pessoa Pessoa { get; set; }
    }
}