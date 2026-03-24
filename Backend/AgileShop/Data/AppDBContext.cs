using AgileShop.Models;
using Microsoft.EntityFrameworkCore;

namespace AgileShop.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Product> Produtos { get; set; }
}