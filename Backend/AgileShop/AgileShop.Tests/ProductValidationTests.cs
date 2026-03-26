using System.ComponentModel.DataAnnotations;
using AgileShop.Models;
using FluentAssertions;

namespace AgileShop.Tests;

public class ProductValidationTests
{

    private static IList<ValidationResult> Validate(Product product)
    {
        var results = new List<ValidationResult>();
        var context = new ValidationContext(product);
        Validator.TryValidateObject(product, context, results, validateAllProperties: true);
        return results;
    }


    [Fact]
    public void Produto_Valido_NaoDeveRetornarErros()
    {
        var product = new Product
        {
            Name = "Notebook Gamer",
            Price = 5499.90m,
            Stock = 10,
            Category = "Eletrônicos"
        };

        var errors = Validate(product);

        errors.Should().BeEmpty();
    }


    [Fact]
    public void Nome_Vazio_DeveRetornarErro()
    {
        var product = new Product
        {
            Name = "",
            Price = 99.90m,
            Stock = 5,
            Category = "Eletrônicos"
        };

        var errors = Validate(product);

        errors.Should().Contain(e => e.MemberNames.Contains("Name"));
    }

    [Fact]
    public void Nome_ComMaisDe100Caracteres_DeveRetornarErro()
    {
        var product = new Product
        {
            Name = new string('A', 101),
            Price = 99.90m,
            Stock = 5,
            Category = "Eletrônicos"
        };

        var errors = Validate(product);

        errors.Should().Contain(e => e.MemberNames.Contains("Name"));
    }

    [Fact]
    public void Nome_Com100Caracteres_NaoDeveRetornarErro()
    {
        var product = new Product
        {
            Name = new string('A', 100),
            Price = 99.90m,
            Stock = 5,
            Category = "Eletrônicos"
        };

        var errors = Validate(product);

        errors.Should().BeEmpty();
    }


    [Fact]
    public void Preco_Zero_DeveRetornarErro()
    {
        var product = new Product
        {
            Name = "Notebook",
            Price = 0,
            Stock = 5,
            Category = "Eletrônicos"
        };

        var errors = Validate(product);

        errors.Should().Contain(e => e.MemberNames.Contains("Price"));
    }

    [Fact]
    public void Preco_Negativo_DeveRetornarErro()
    {
        var product = new Product
        {
            Name = "Notebook",
            Price = -1m,
            Stock = 5,
            Category = "Eletrônicos"
        };

        var errors = Validate(product);

        errors.Should().Contain(e => e.MemberNames.Contains("Price"));
    }

    [Fact]
    public void Preco_MaiorQueZero_NaoDeveRetornarErro()
    {
        var product = new Product
        {
            Name = "Notebook",
            Price = 0.01m,
            Stock = 5,
            Category = "Eletrônicos"
        };

        var errors = Validate(product);

        errors.Should().BeEmpty();
    }


    [Fact]
    public void Estoque_Negativo_DeveRetornarErro()
    {
        var product = new Product
        {
            Name = "Notebook",
            Price = 99.90m,
            Stock = -1,
            Category = "Eletrônicos"
        };

        var errors = Validate(product);

        errors.Should().Contain(e => e.MemberNames.Contains("Stock"));
    }

    [Fact]
    public void Estoque_Zero_NaoDeveRetornarErro()
    {
        var product = new Product
        {
            Name = "Notebook",
            Price = 99.90m,
            Stock = 0,
            Category = "Eletrônicos"
        };

        var errors = Validate(product);

        errors.Should().BeEmpty();
    }


    [Fact]
    public void Categoria_Vazia_DeveRetornarErro()
    {
        var product = new Product
        {
            Name = "Notebook",
            Price = 99.90m,
            Stock = 5,
            Category = ""
        };

        var errors = Validate(product);

        errors.Should().Contain(e => e.MemberNames.Contains("Category"));
    }
}