using Microsoft.EntityFrameworkCore;

namespace Agenda.Models
{
    public class ApplicationContext : DbContext
    {
        public ApplicationContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Pessoa> Pessoas { get; set; }
        public DbSet<Contato> Contatos { get; set; }
        public DbSet<Endereco> Enderecos { get; set; }
        public DbSet<Marcador> Marcadores { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Contato>()
                .HasOne(c => c.Pessoa)
                .WithMany(p => p.Contatos)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Endereco>()
                .HasOne(c => c.Pessoa)
                .WithMany(p => p.Enderecos)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Marcador>()
                .HasOne(c => c.Pessoa)
                .WithMany(p => p.Marcadores)
                .OnDelete(DeleteBehavior.Cascade);

            base.OnModelCreating(builder);
        }
    }
}