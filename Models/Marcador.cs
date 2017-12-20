using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Agenda.Models
{
    public class Marcador : BaseEntity
    {
        [Required]
        public string Valor { get; set; }

        public Pessoa Pessoa { get; set; }
    }
}