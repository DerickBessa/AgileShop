using AgileShop.DTOs;
using AgileShop.Mappers;
using AgileShop.Models;
using FluentAssertions;

namespace AgileShop.Tests;

public class ProductMapperTests
{
    // ─── ToProductDto ─────────────────────────────────────────────────────────

    [Fact]
    public void ToProductDto_DeveMapearTodosOsCamposCorretamente()
    {
        var product = new Product
        {
            Id = Guid.NewGuid(),
            Name = "Notebook Gamer",
            Description = "Um notebook potente",
            Price = 5499.90m,
            Stock = 45,
            Category = "Eletrônicos",
            ImageUrl = "https://exemplo.com/imagem.jpg",
            IsActive = true,
            CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        };

        var dto = product.ToProductDto();

        dto.Id.Should().Be(product.Id);
        dto.Name.Should().Be("Notebook Gamer");
        dto.Description.Should().Be("Um notebook potente");
        dto.Price.Should().Be(5499.90m);
        dto.Stock.Should().Be(45);
        dto.Category.Should().Be("Eletrônicos");
        dto.ImageUrl.Should().Be("https://exemplo.com/imagem.jpg");
        dto.IsActive.Should().BeTrue();
        dto.CreatedAt.Should().Be(product.CreatedAt);
    }

    [Fact]
    public void ToProductDto_DeveMapearCamposOpcionaisNulos()
    {
        var product = new Product
        {
            Name = "Mouse",
            Price = 99.90m,
            Stock = 10,
            Category = "Eletrônicos",
            Description = null,
            ImageUrl = null,
        };

        var dto = product.ToProductDto();

        dto.Description.Should().BeNull();
        dto.ImageUrl.Should().BeNull();
    }

    [Fact]
    public void ToProductDto_ProdutoInativo_DeveMapearIsActiveComoFalse()
    {
        var product = new Product
        {
            Name = "Produto Inativo",
            Price = 10m,
            Stock = 0,
            Category = "Outros",
            IsActive = false,
        };

        var dto = product.ToProductDto();

        dto.IsActive.Should().BeFalse();
    }

    // ─── ToProductFromCreateDto ───────────────────────────────────────────────

    [Fact]
    public void ToProductFromCreateDto_DeveMapearTodosOsCamposCorretamente()
    {
        var createDto = new CreateProductDto
        {
            Name = "Teclado Mecânico",
            Description = "Teclado com switches azuis",
            Price = 389.90m,
            Stock = 20,
            Category = "Eletrônicos",
            ImageUrl = "https://exemplo.com/teclado.jpg",
        };

        var product = createDto.ToProductFromCreateDto();

        product.Name.Should().Be("Teclado Mecânico");
        product.Description.Should().Be("Teclado com switches azuis");
        product.Price.Should().Be(389.90m);
        product.Stock.Should().Be(20);
        product.Category.Should().Be("Eletrônicos");
        product.ImageUrl.Should().Be("https://exemplo.com/teclado.jpg");
    }

    [Fact]
    public void ToProductFromCreateDto_DeveTerIsActiveTrueporPadrao()
    {
        var createDto = new CreateProductDto
        {
            Name = "Webcam",
            Price = 299.90m,
            Stock = 5,
            Category = "Eletrônicos",
        };

        var product = createDto.ToProductFromCreateDto();

        product.IsActive.Should().BeTrue();
    }

    [Fact]
    public void ToProductFromCreateDto_DeveGerarIdAutomaticamente()
    {
        var createDto = new CreateProductDto
        {
            Name = "Monitor",
            Price = 1299.90m,
            Stock = 8,
            Category = "Eletrônicos",
        };

        var product = createDto.ToProductFromCreateDto();

        product.Id.Should().NotBe(Guid.Empty);
    }
}