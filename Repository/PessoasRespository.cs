using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Agenda.Models;
using Microsoft.EntityFrameworkCore;

namespace Agenda.Repository
{
    public class PessoasRepository : IPessoasRepository
    {
        private readonly ApplicationContext _context;

        public PessoasRepository(ApplicationContext context)
        {
            _context = context;
        }

        public IQueryable<Pessoa> All
        {
            get
            {
                return _context.Pessoas
                    .Include(p => p.Contatos)
                    .Include(p => p.Enderecos)
                    .Include(p => p.Marcadores);
            }
        }

        public Task<Pessoa> GetSingle(long id)
        {
            return All.FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Pessoa> Create(Pessoa pessoa)
        {
            await _context.Pessoas.AddAsync(pessoa);
            return pessoa;
        }

        public async Task<Pessoa> Update(Pessoa pessoa)
        {
            var model = await GetSingle(pessoa.Id);
            if (model != null)
            {
                model.Nome = pessoa.Nome;

                Merge(model.Contatos, pessoa.Contatos, (e, o) =>
                {
                    e.Tipo = o.Tipo;
                    e.Valor = o.Valor;
                });

                Merge(model.Enderecos, pessoa.Enderecos, (e, o) =>
                {
                    e.Tipo = o.Tipo;
                    e.Numero = o.Numero;
                    e.Bairro = o.Bairro;
                    e.Cidade = o.Cidade;
                    e.Estado = o.Estado;
                    e.Logradouro = o.Logradouro;
                    e.Complemento = o.Complemento;
                });

                MergeMarcadores(model.Marcadores, pessoa.Marcadores);
            }
            return model;
        }

        public async Task<Pessoa> Remove(long id)
        {
            var pessoa = await GetSingle(id);
            if (pessoa != null)
                _context.Pessoas.Remove(pessoa);
            return pessoa;
        }

        public IQueryable<string> Marcadores
        {
            get
            {
                return _context.Marcadores
                    .Select(m => m.Valor)
                    .Distinct();
            }
        }

        public Task Save()
        {
            return _context.SaveChangesAsync();
        }

        private void Merge<T>(List<T> source, List<T> input, Action<T, T> mergeEntities) where T : BaseEntity
        {
            var dbSet = _context.Set<T>();
            var cache = new Dictionary<long, T>();

            if (source != null)
            {
                foreach (var item in source)
                    cache.Add(item.Id, item);
            }

            if (input != null)
            {
                foreach (var item in input)
                {
                    if (cache.TryGetValue(item.Id, out T result))
                    {
                        cache.Remove(item.Id);
                        mergeEntities(result, item);
                    }
                    else
                    {
                        source.Add(item);
                    }
                }
            }

            foreach (var (key, value) in cache)
            {
                dbSet.Remove(value);
            }
        }

        private void MergeMarcadores(List<Marcador> source, List<Marcador> input)
        {
            var dbSet = _context.Marcadores;
            var cache = new Dictionary<string, Marcador>();

            if (source != null)
            {
                foreach (var item in source)
                    cache.Add(item.Valor, item);
            }

            if (input != null)
            {
                foreach (var item in input)
                {
                    var valor = item.Valor;
                    if (cache.ContainsKey(valor))
                    {
                        cache.Remove(valor);
                    }
                    else
                    {
                        source.Add(new Marcador { Valor = valor });
                    }
                }
            }

            foreach (var (key, value) in cache)
            {
                dbSet.Remove(value);
            }
        }
    }
}