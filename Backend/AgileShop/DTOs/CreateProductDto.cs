using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace AgileShop.DTOs
{
    public class CreateProductDto
    {
		[Required]
		[MaxLength(100)]
		public string Name { get; set; } = string.Empty;

		[MaxLength(500)]
		public string? Description { get; set; }

		[Required]
		[Range(0.01, double.MaxValue, ErrorMessage = "O preço deve ser maior que 0.")]
		public decimal Price { get; set; }

		[Required]
		[Range(0, int.MaxValue, ErrorMessage = "O estoque não pode ser negativo!")]
		public int Stock { get; set; }

		[Required]
		[MaxLength(50)]
		public string Category { get; set; } = string.Empty;

		[Url]
		public string? ImageUrl { get; set; }
		
		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}