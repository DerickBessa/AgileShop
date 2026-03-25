using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AgileShop.DTOs
{
    public class ProductResponseDto
    {
        public Guid Id { get; set; }
		public string Name { get; set; } = string.Empty;
		public string? Description { get; set; }
		public decimal Price { get; set; }
		public int Stock { get; set; }
		public string Category { get; set; } = string.Empty;
		public string? ImageUrl { get; set; }
		public bool IsActive { get; set; } = true;
		public DateTime CreatedAt { get; set; }
		public string StockStatus
		{
			get
			{
				if (Stock == 0) return "unavailable";
				if (Stock < 10) return "low-stock";
				return "available";
 			}
		}
    }
}