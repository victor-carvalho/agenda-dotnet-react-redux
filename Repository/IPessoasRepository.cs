using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Agenda.Models;

namespace Agenda.Repository
{
    public interface IPessoasRepository
    {
        IQueryable<Pessoa> All { get; }
        IQueryable<string> Marcadores { get; }
        Task<Pessoa> GetSingle(long id);
        Task<Pessoa> Create(Pessoa pessoa);
        Task<Pessoa> Update(Pessoa pessoa);
        Task<Pessoa> Remove(long id);
        Task Save();
    }
}