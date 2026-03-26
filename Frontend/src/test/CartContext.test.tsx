import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "../context/CartContext";
import type { Product } from "../types/product";

	// ─── mock base de produto ─────────────────────────────────────────────────────

const baseProduct: Product = {
	id: "1",
	name: "Notebook Gamer",
	price: 5499.9,
	stock: 5,
	category: "Eletrônicos",
	isActive: true,
	createdAt: "2026-01-01",
	stockStatus: "low-stock",
};

const anotherProduct: Product = {
	...baseProduct,
	id: "2",
	name: "Mouse Sem Fio",
	price: 149.9,
};

	// ─── helper para renderizar o hook com o provider ─────────────────────────────

const wrapper = ({ children }: { children: React.ReactNode }) => (
	<CartProvider>{children}</CartProvider>
);

	// ─── testes ───────────────────────────────────────────────────────────────────

describe("CartContext", () => {
	it("inicia com carrinho vazio", () => {
		const { result } = renderHook(() => useCart(), { wrapper });

		expect(result.current.items).toHaveLength(0);
		expect(result.current.totalItems).toBe(0);
		expect(result.current.totalPrice).toBe(0);
	});

	it("adiciona um produto ao carrinho", () => {
		const { result } = renderHook(() => useCart(), { wrapper });

		act(() => {
		result.current.addItem(baseProduct);
		});

		expect(result.current.items).toHaveLength(1);
		expect(result.current.items[0].product.name).toBe("Notebook Gamer");
		expect(result.current.items[0].quantity).toBe(1);
	});

	it("incrementa a quantidade ao adicionar o mesmo produto", () => {
		const { result } = renderHook(() => useCart(), { wrapper });

		act(() => {
		result.current.addItem(baseProduct);
		result.current.addItem(baseProduct);
		});

		expect(result.current.items).toHaveLength(1);
		expect(result.current.items[0].quantity).toBe(2);
	});

	it("não ultrapassa o limite de estoque ao adicionar", () => {
		const { result } = renderHook(() => useCart(), { wrapper });

		// produto tem stock: 5, tentamos adicionar 6 vezes
		act(() => {
		for (let i = 0; i < 6; i++) {
			result.current.addItem(baseProduct);
		}
		});

		expect(result.current.items[0].quantity).toBe(5);
	});

	it("remove um produto do carrinho", () => {
		const { result } = renderHook(() => useCart(), { wrapper });

		act(() => {
		result.current.addItem(baseProduct);
		result.current.removeItem(baseProduct.id);
		});

		expect(result.current.items).toHaveLength(0);
	});

	it("calcula o totalItems corretamente", () => {
		const { result } = renderHook(() => useCart(), { wrapper });

		act(() => {
		result.current.addItem(baseProduct);
		result.current.addItem(baseProduct);
		result.current.addItem(anotherProduct);
		});

		expect(result.current.totalItems).toBe(3);
	});

	it("calcula o totalPrice corretamente", () => {
		const { result } = renderHook(() => useCart(), { wrapper });

		act(() => {
		result.current.addItem(baseProduct); // 5499.90
		result.current.addItem(anotherProduct); // 149.90
		});

		expect(result.current.totalPrice).toBeCloseTo(5649.8);
	});

	it("limpa o carrinho com clearCart", () => {
		const { result } = renderHook(() => useCart(), { wrapper });

		act(() => {
		result.current.addItem(baseProduct);
		result.current.addItem(anotherProduct);
		result.current.clearCart();
		});

		expect(result.current.items).toHaveLength(0);
		expect(result.current.totalPrice).toBe(0);
	});

	it("atualiza a quantidade de um produto", () => {
		const { result } = renderHook(() => useCart(), { wrapper });

		act(() => {
		result.current.addItem(baseProduct);
		result.current.updateQuantity(baseProduct.id, 3);
		});

		expect(result.current.items[0].quantity).toBe(3);
	});

	it("não deixa a quantidade ser menor que 1 no updateQuantity", () => {
		const { result } = renderHook(() => useCart(), { wrapper });

		act(() => {
		result.current.addItem(baseProduct);
		result.current.updateQuantity(baseProduct.id, 0);
		});

		expect(result.current.items[0].quantity).toBe(1);
	});

	it("respeita o limite de estoque no updateQuantity", () => {
		const { result } = renderHook(() => useCart(), { wrapper });

		act(() => {
		result.current.addItem(baseProduct);
		result.current.updateQuantity(baseProduct.id, 999);
		});

		// stock é 5, não pode passar disso
		expect(result.current.items[0].quantity).toBe(5);
	});
});