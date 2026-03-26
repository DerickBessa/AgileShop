import { request } from "../helpers/request";

// ─── mock do fetch global ─────────────────────────────────────────────────────

const mockFetch = (status: number, body: unknown, isJson = true) => {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    headers: {
      get: () => (isJson ? "application/json" : "text/plain"),
    },
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(body as string),
  });
};

// ─── testes ───────────────────────────────────────────────────────────────────

describe("request", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("retorna os dados quando a resposta é ok", async () => {
		const data = { id: "1", name: "Notebook" };
		mockFetch(200, data);

		const result = await request("/api/produtos");
		expect(result).toEqual(data);
	});

	it("envia o header Content-Type como application/json", async () => {
		mockFetch(200, {});

		await request("/api/produtos");

		expect(globalThis.fetch).toHaveBeenCalledWith(
		"/api/produtos",
		expect.objectContaining({
			headers: expect.objectContaining({
			"Content-Type": "application/json",
			}),
		})
		);
	});

	it("lança erro com a mensagem do backend quando resposta não é ok", async () => {
		mockFetch(404, { message: "Produto não encontrado" });

		await expect(request("/api/produtos/999")).rejects.toThrow(
		"Produto não encontrado"
		);
  });

	it("lança erro genérico com o status quando não há mensagem", async () => {
	mockFetch(500, null);
	await expect(request("/api/produtos")).rejects.toThrow("Erro 500");
	});

	it("lança erro com o título quando backend retorna title", async () => {
	mockFetch(400, { title: "Requisição inválida" }, true); // força isJson = true
	await expect(request("/api/produtos")).rejects.toThrow("Requisição inválida");
	});

	it("lida com resposta em texto puro", async () => {
		mockFetch(200, "ok", false);

		const result = await request("/api/produtos");
		expect(result).toBe("ok");
	});

	it("lança ApiError com o status correto", async () => {
	mockFetch(404, { message: "Não encontrado" });
	
	try {
		await request("/api/produtos/999");
	} catch (err: any) {
		expect(err.name).toBe("ApiError");
		expect(err.status).toBe(404);
		expect(err.message).toBe("Não encontrado");
	}
	});

	it("passa o método e body corretamente para o fetch", async () => {
		mockFetch(201, { id: "1" });

		await request("/api/produtos", {
		method: "POST",
		body: JSON.stringify({ name: "Mouse" }),
		});

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "/api/produtos",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ name: "Mouse" }),
      })
    );
  });
});