import type { CreatedProductDto, Product, ProductQuery, UpdateProductDto } from "../types/product";
import { request } from "../helpers/request";

const API_URL = import.meta.env.VITE_API_URL as string;

export const buildParams = (query?: ProductQuery): string => { //tratamento de querys para verificar se existem ou nao filtros aplicados!!
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
  getAll: (query?: ProductQuery): Promise<Product[]> =>
    request<Product[]>(`${API_URL}${buildParams(query)}`),

  getById: (id: string): Promise<Product> =>
    request<Product>(`${API_URL}/${id}`),

  getCategories: (): Promise<string[]> =>
    request<string[]>(`${API_URL}/categorias`),

  create: (dto: CreatedProductDto): Promise<Product> =>
    request<Product>(API_URL, {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  update: (id: string, dto: UpdateProductDto): Promise<Product> =>
    request<Product>(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(dto),
    }),

  delete: (id: string): Promise<void> =>
    request<void>(`${API_URL}/${id}`, {
      method: "DELETE",
    }),
};