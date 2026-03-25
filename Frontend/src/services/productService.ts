import type { CreatedProductDto, Product, ProductQuery, UpdateProductDto } from "../types/product";

const API_URL = import.meta.env.VITE_API_URL;

const buildParams = (query?: ProductQuery): string => {
  if (!query) return "";
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });
  const str = params.toString();
  return str ? `?${str}` : "";
};

export const productService = {
  getAll: async (query?: ProductQuery): Promise<Product[]> => {
    const response = await fetch(`${API_URL}${buildParams(query)}`);
    if (!response.ok) throw new Error("Erro ao buscar produtos");
    return response.json();
  },

  getById: async (id: string): Promise<Product> => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Produto não encontrado");
    return response.json();
  },

  getCategories: async (): Promise<string[]> => {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) throw new Error("Erro ao buscar categorias");
    return response.json();
  },

  create: async (dto: CreatedProductDto): Promise<Product> => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    if (!response.ok) throw new Error("Erro ao criar produto");
    return response.json();
  },

  update: async (id: string, dto: UpdateProductDto): Promise<Product> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    if (!response.ok) throw new Error("Erro ao atualizar produto");
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Erro ao deletar produto");
  },
};