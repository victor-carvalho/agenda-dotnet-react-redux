using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Agenda.Filters;
using Agenda.Models;
using Agenda.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Agenda.Controllers
{
    [Route("api/[controller]")]
    public class MarcadoresController : Controller
    {
        private readonly IPessoasRepository _repo;

        public MarcadoresController(IPessoasRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var marcadores = await _repo.Marcadores.ToListAsync();
            return Ok(marcadores);
        }
    }
}
