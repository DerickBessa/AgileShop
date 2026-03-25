using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AgileShop.Data;
using AgileShop.DTOs;
using AgileShop.Helpers;
using AgileShop.Interfaces;
using AgileShop.Models;
using Microsoft.EntityFrameworkCore;

namespace AgileShop.Repositories //Deixei na ordem CRUD 
{
	public class ProductRepository : IProductRepository
	{
		private readonly AppDbContext _context;
		public ProductRepository(AppDbContext context)
		{
			_context = context;
		}
		
		//Ponto interessante: optei por nao utilizar AddAsync apesar de estar utilizando um método await
		//Na documentacao da propria microsoft ela diz que só é necessário o uso de AddAsync quando se tratam
		//de interações com o banco na hora exata da adição, ou se tiver alguma consistência assíncrona rigorosa, como sequências numéricas.
		// o Add comum salva na memória e faz mais sentido, pois apenas fazemos de fato essa conexão no SaveChangesAsync().
		// Acredito que isso melhora a performance, de certa forma, ao reduzir operapções desnecessárias no banco de dados!

		public async Task<Product?> CreateAsync(Product productModel)
		{
			if (productModel == null)
			{
				return null;
			}
			_context.Products.Add(productModel);
			await _context.SaveChangesAsync();

			return productModel;
		}

		public async Task<List<Product>> GetAllAsync(ProductQuery query)
		{
			var productModel = _context.Products
			.AsNoTracking()
			.AsQueryable();
			//Utilizei AsNoTracking para melhorar a performance, para não ficar criando cópias desnecessárias na memória. Descartar tudo após o uso
			// já que só queremos exibir e utilizar, mas não queremos modificá-los.

			if (!string.IsNullOrWhiteSpace(query.Name))
			{
				productModel = productModel.Where(p => p.Name.Contains(query.Name));
			}

			if (!string.IsNullOrWhiteSpace(query.Category))
			{
				productModel = productModel.Where(p => p.Category.Contains(query.Category));
			}

			if (query.Disponibility.HasValue)
			{
				productModel = query.Disponibility.Value switch
				{
					ProductStatusEnum.Available =>
						productModel.Where(p => p.IsActive && p.Stock > 0),

					ProductStatusEnum.LowStock =>
						productModel.Where(p => p.IsActive && p.Stock < 10 && p.Stock > 0),

					ProductStatusEnum.Unavailable =>
						productModel.Where(p => !p.IsActive || p.Stock == 0),

					_ => productModel
				};
			}

			//Achei interessante esse formato de switch case, nao sabia que dava para fazer dessa forma
			//descobri consultando a documentacao e decidi aplicar.
			productModel = query.SortBy switch  
			{
				"name" => productModel.OrderBy(p => p.Name),
				"preco-asc" => productModel.OrderBy(p => p.Price),
				"preco-desc" => productModel.OrderByDescending(p => p.Price),
				_ => productModel.OrderByDescending(p => p.CreatedAt)
			};

			var skipNumber = (query.PageNumber - 1) * query.PageSize;

			return await productModel.Skip(skipNumber).Take(query.PageSize).ToListAsync();
		}

		public async Task<Product?> GetByIdAsync(Guid id)
		{
				return await _context.Products
				.AsNoTracking()
				.FirstOrDefaultAsync(p => p.Id == id);
		}

		public async Task<bool> ProductExists(Guid id)
		{
			return await _context.Products.AnyAsync(p => p.Id == id);
		}

		public async Task<Product?> UpdateAsync(Guid id, UpdateProductDto productDto)
		{
			var product = await _context.Products.FindAsync(id);

			if(product == null)
			{
				return null;
			}

			product.Name = productDto.Name;
			product.Description = productDto.Description;
			product.Price = productDto.Price;
			product.Stock = productDto.Stock;
			product.Category = productDto.Category;
			product.ImageUrl = productDto.ImageUrl;
			product.IsActive = productDto.IsActive;

			await _context.SaveChangesAsync();

			return product;
		}

		
		public async Task<Product?> DeleteAsync(Guid id)
		{
			var productModel = await _context.Products.FindAsync(id);

			if(productModel == null)
			{
				return null;
			}

			//Achei interessante ressaltar, também, que o remove ñ é um método assíncrono, pois ele Deleta primeiro
			// na memória, que teóricamente já supre a necessidade imediata, e depois ele deleta no banco de fato no SaveChangesAsync;
			// Eu gosto de pensar nele como se tivesse o comportamento parecido com o Add (não async), acredito que de certa forma dá pra fazer essa conexão,
			// Devido os dois fazerem a operação primeiro na memória e só depois "subirem" de fato ao banco.

			_context.Products.Remove(productModel);
			await _context.SaveChangesAsync(); 

			return productModel;
		}
	}
}