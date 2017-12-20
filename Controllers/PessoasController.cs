using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Agenda.Data;
using Agenda.Filters;
using Agenda.Models;
using Agenda.Repository;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Agenda.Controllers
{
    [Route("api/[controller]")]
    public class PessoasController : Controller
    {
        private readonly IMapper _mapper;
        private readonly IPessoasRepository _repo;

        public PessoasController(IPessoasRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(string nome, string marcador)
        {
            var pessoas = _repo.All;

            if (marcador != null)
                pessoas = pessoas.Where(p => p.Marcadores.Any(m => m.Valor == marcador));

            if (nome != null)
                pessoas = pessoas.Where(p => p.Nome.Contains(nome));

            var result = _mapper.Map<IList<PessoaDTO>>(await pessoas.ToListAsync());
            return Ok(result);
        }

        [HttpGet("{id}", Name = "GetPessoa")]
        public async Task<IActionResult> Get(long id)
        {
            var pessoa = await _repo.GetSingle(id);
            if (pessoa == null)
                return NotFound();
            return Ok(_mapper.Map<PessoaDTO>(pessoa));
        }

        [HttpPost]
        [ValidateModel]
        public async Task<IActionResult> Create([FromBody] PessoaDTO pessoa)
        {
            var model = _mapper.Map<Pessoa>(pessoa);
            await _repo.Create(model);
            await _repo.Save();

            return CreatedAtRoute("GetPessoa", new { Id = model.Id }, _mapper.Map<PessoaDTO>(model));
        }

        [HttpPut("{id}")]
        [ValidateModel]
        public async Task<IActionResult> Update(long id, [FromBody] PessoaDTO pessoa)
        {
            var model = await _repo.Update(_mapper.Map<Pessoa>(pessoa));
            if (model == null)
                return NotFound();

            await _repo.Save();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            var pessoa = await _repo.Remove(id);
            if (pessoa == null)
                return NotFound();

            await _repo.Save();
            return NoContent();
        }
    }
}
