using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AgileShop.DTOs;
using AgileShop.Helpers;
using AgileShop.Models;

namespace AgileShop.Interfaces
{
    public interface IProductRepository
    {
        Task<List<Product>> GetAllAsync(ProductQuery query);
		Task<Product?> GetByIdAsync(Guid id);
		Task<Product?> CreateAsync(Product ProductModel);
		Task<Product?> UpdateAsync(Guid id , UpdateProductDto ProductDto);
		Task<Product?> DeleteAsync(Guid id);
		Task<bool> ProductExists(Guid id);
    }
}