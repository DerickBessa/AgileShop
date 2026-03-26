import { buildParams } from "../services/productService";

describe("buildParams", () => {
	it("retorna string vazia quando não recebe query", () => {
		expect(buildParams()).toBe("");
	});

	it("retorna string vazia quando query é undefined", () => {
		expect(buildParams(undefined)).toBe("");
	});

	it("monta query string com um parâmetro", () => {
		expect(buildParams({ name: "Notebook" })).toBe("?name=Notebook");
	});

	it("monta query string com múltiplos parâmetros", () => {
		const result = buildParams({ name: "Notebook", category: "Eletrônicos" });
		expect(result).toContain("name=Notebook");
		expect(result).toContain("category=Eletr%C3%B4nicos");
		expect(result.startsWith("?")).toBe(true);
	});

	it("ignora parâmetros undefined", () => {
		const result = buildParams({ name: "Notebook", category: undefined });
		expect(result).toBe("?name=Notebook");
	});

	it("ignora parâmetros com string vazia", () => {
		const result = buildParams({ name: "", category: "Eletrônicos" });
		expect(result).toBe("?category=Eletr%C3%B4nicos");
	});

	it("inclui parâmetro numérico corretamente", () => {
		const result = buildParams({ pageNumber: 2, pageSize: 10 });
		expect(result).toContain("pageNumber=2");
		expect(result).toContain("pageSize=10");
	});

	it("inclui o valor 0 como parâmetro válido", () => {
		const result = buildParams({ availability: 0 });
		expect(result).toBe("?availability=0");
	});
});