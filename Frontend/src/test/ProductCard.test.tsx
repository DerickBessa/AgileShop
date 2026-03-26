import { render, screen } from "@testing-library/react";
import { formatPrice, StockLabel } from "../components/ProductCard";
import type { Product } from "../types/product";


const baseProduct: Product = {
	id: "1",
	name: "Notebook Gamer",
	price: 5499.9,
	stock: 45,
	category: "Eletrônicos",
	isActive: true,
	createdAt: "2026-01-01",
	stockStatus: "in-stock",
};


describe("formatPrice", () => {
	it("formata preço com centavos corretamente", () => {
		const result = formatPrice(5499.9);
		expect(result.int).toBe("5.499");
		expect(result.dec).toBe("90");
	});

	it("formata preço inteiro com zeros nos centavos", () => {
		const result = formatPrice(100);
		expect(result.int).toBe("100");
		expect(result.dec).toBe("00");
	});

	it("formata preço abaixo de 1000 sem separador de milhar", () => {
		const result = formatPrice(149.9);
		expect(result.int).toBe("149");
		expect(result.dec).toBe("90");
	});

	it("formata preço acima de 1 milhão corretamente", () => {
		const result = formatPrice(1000000);
		expect(result.int).toBe("1.000.000");
		expect(result.dec).toBe("00");
	});
});


describe("StockLabel", () => {
	it("exibe 'Em estoque' quando produto está ativo e tem estoque normal", () => {
		render(<StockLabel product={baseProduct} />);
		expect(screen.getByText(/em estoque/i)).toBeInTheDocument();
	});

	it("exibe a quantidade de unidades disponíveis", () => {
		render(<StockLabel product={baseProduct} />);
		expect(screen.getByText(/45 unidades/i)).toBeInTheDocument();
	});

	it("exibe 'Apenas X em estoque' quando estoque está baixo", () => {
		const lowStock: Product = { ...baseProduct, stock: 8, stockStatus: "low-stock" };
		render(<StockLabel product={lowStock} />);
		expect(screen.getByText(/apenas 8 em estoque/i)).toBeInTheDocument();
	});

	it("exibe 'Indisponível' quando estoque é zero", () => {
		const noStock: Product = { ...baseProduct, stock: 0 };
		render(<StockLabel product={noStock} />);
		expect(screen.getByText(/indisponível/i)).toBeInTheDocument();
	});

	it("exibe 'Indisponível' quando produto está inativo", () => {
		const inactive: Product = { ...baseProduct, isActive: false };
		render(<StockLabel product={inactive} />);
		expect(screen.getByText(/indisponível/i)).toBeInTheDocument();
	});
});