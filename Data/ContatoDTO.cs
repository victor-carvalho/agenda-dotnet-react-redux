using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Agenda.Models;

namespace Agenda.Data
{
    public class ContatoDTO
    {
        public long Id { get; set; }

        [Required]
        public string Tipo { get; set; }

        [Required]
        public string Valor { get; set; }
    }
}