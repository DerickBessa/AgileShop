using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AgileShop.Data;
using AgileShop.DTOs;
using AgileShop.Helpers;
using AgileShop.Interfaces;
using AgileShop.Mappers;
using AgileShop.Models;
using Microsoft.AspNetCore.Mvc;

namespace AgileShop.Controllers
{
	[Route("api/products")]
	[ApiController]
    public class ProductController : ControllerBase
    {
        
		private readonly IProductRepository _repo;

		public ProductController(IProductRepository repo)
		{
			_repo = repo;
		}

		[HttpGet]
		public async Task<IActionResult> GetAll([FromQuery] ProductQuery query)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState);

			var product = await _repo.GetAllAsync(query);
			var productDto = product.Select(s => s.ToProductDto()).ToList();

			return Ok(productDto);
		}

		[HttpGet("{id}")]
		public async Task<IActionResult> GetById([FromRoute] Guid id)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState);

			var product = await _repo.GetByIdAsync(id);

			if(product == null)
				return NotFound();

			return Ok(product.ToProductDto());
		}

		[HttpGet("category")]
		public async Task<IActionResult> GetAllCategory()
		{
			var products = await _repo.GetAllAsync(new ProductQuery());
			var category = products.Select(p => p.Category).Distinct().OrderBy(c => c).ToList;
			return Ok(category);
		}

		
		[HttpPost]
		public async Task<IActionResult> Create([FromBody] CreateProductDto productDto)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState);
			

			var productModel = await _repo.CreateAsync(productDto.ToProductFromCreateDto());

			if(productModel == null)
				return StatusCode(500, "Erro ao criar Produto");

			return CreatedAtAction(nameof(GetById), new{id = productModel.Id}, productModel.ToProductDto());
			
			//Acho interessante ressaltar esse retorno, eu poderia mandar um status 201, entretanto eu optei por enviar esse padrão
			// onde eu passo a rota que eu pego no nameof e ponho o id no final, após isso mostro o JSON que foi criado.
			// acho interessante para conseguir dar um retorno mais completo no Network, para sistemas maiores esse retorno completo da rota
			// ajuda a encontrar bugs de forma mais fácil!
		}

		[HttpPut("{id}")]
		public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateProductDto productDto)
		{
			if(!ModelState.IsValid)
				return BadRequest(ModelState);

			var product = await _repo.UpdateAsync(id, productDto);

			if(product == null)
				return NotFound();
			
			return Ok(product.ToProductDto());
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> Delete([FromRoute] Guid id)
		{
			if(!ModelState.IsValid)
				return BadRequest(ModelState);


			var product = await _repo.DeleteAsync(id);

			if(product == null)
				return NotFound();
			
			return NoContent();
		}
    }
}