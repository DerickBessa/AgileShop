using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AgileShop.DTOs;
using AgileShop.Models;

namespace AgileShop.Mappers
{
    public static class ProductMapper
    {
        public static ProductResponseDto ToProductDto(this Product productModel)
		{
			return new ProductResponseDto
			{
				Id = productModel.Id,
				Name = productModel.Name,
				Description = productModel.Description,
				Price = productModel.Price,
				Stock = productModel.Stock,
				Category = productModel.Category,
				ImageUrl = productModel.ImageUrl,
				IsActive = productModel.IsActive,
				CreatedAt = productModel.CreatedAt,
			};
		}
		public static Product ToProductFromCreateDto(this CreateProductDto productDto)
		{
			return new Product
			{
				Name = productDto.Name,
				Description = productDto.Description,
				Price = productDto.Price,
				Stock = productDto.Stock,
				Category = productDto.Category,
				ImageUrl = productDto.ImageUrl,
			};
		}
    }
}