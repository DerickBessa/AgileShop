import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CreatedProductDto, Product, ProductQuery, UpdateProductDto } from "../types/product";
import { productService } from "../services/productService";

interface ProductContextType {
  products: Product[];    
  allProducts: Product[];     
  categories: string[];
  loading: boolean;
  error: string | null;
  query: ProductQuery;
  hasNextPage: boolean;

  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;

  createProduct: (dto: CreatedProductDto) => Promise<void>;
  updateProduct: (id: string, dto: UpdateProductDto) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  setQuery: (query: ProductQuery) => void;
  nextPage: () => void;
  prevPage: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const PAGE_SIZE = 8;

const DEFAULT_QUERY: ProductQuery = {
  pageNumber: 1,
  pageSize: PAGE_SIZE,
};

function applyFilters(all: Product[], query: ProductQuery): Product[] {
  let result = [...all];


  if (query.name && query.name.trim() !== "") {
    const term = query.name.trim().toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(term));
  }


  if (query.category && query.category !== "") {
    result = result.filter(p => p.category === query.category);
  }

  if (query.availability !== undefined && query.availability !== null) {
    if (query.availability === 0) {
      result = result.filter(p => p.isActive && p.stock >= 10);
    } else if (query.availability === 1) {
      result = result.filter(p => p.isActive && p.stock > 0 && p.stock < 10);
    } else if (query.availability === 2) {
      result = result.filter(p => !p.isActive || p.stock === 0);
    }
  }


  if (query.priceMin !== undefined) {
    result = result.filter(p => p.price >= query.priceMin!);
  }
  if (query.priceMax !== undefined) {
    result = result.filter(p => p.price <= query.priceMax!);
  }

  const sortBy = query.sortBy ?? "newest";
  if (sortBy === "name_asc")   result.sort((a, b) => a.name.localeCompare(b.name));
  if (sortBy === "name_desc")  result.sort((a, b) => b.name.localeCompare(a.name));
  if (sortBy === "price_asc")  result.sort((a, b) => a.price - b.price);
  if (sortBy === "price_desc") result.sort((a, b) => b.price - a.price);
  if (sortBy === "newest")     result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return result;
}

export function ProductProvider({ children }: { children: ReactNode }) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQueryState] = useState<ProductQuery>(DEFAULT_QUERY);


  const filtered = useMemo(() => applyFilters(allProducts, query), [allProducts, query]);

  const pageSize = query.pageSize ?? PAGE_SIZE;
  const pageNumber = query.pageNumber ?? 1;
  const paginated = useMemo(
    () => filtered.slice((pageNumber - 1) * pageSize, pageNumber * pageSize),
    [filtered, pageNumber, pageSize]
  );

  const hasNextPage = pageNumber * pageSize < filtered.length;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getAll();
      setAllProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar produtos");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await productService.getCategories();
      setCategories(data);
    } catch {
    }
  }, []);

  const createProduct = useCallback(async (dto: CreatedProductDto) => {
    setLoading(true);
    setError(null);
    try {
      await productService.create(dto);
      await fetchProducts(); 
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar produto");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProducts]);

  const updateProduct = useCallback(async (id: string, dto: UpdateProductDto) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await productService.update(id, dto);
      setAllProducts(prev => prev.map(p => (p.id === id ? updated : p)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar produto");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await productService.delete(id);
      setAllProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao deletar produto");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);


  const setQuery = useCallback((newQuery: ProductQuery) => {
    setQueryState({ ...newQuery, pageNumber: 1 });
  }, []);

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setQueryState(prev => ({ ...prev, pageNumber: (prev.pageNumber ?? 1) + 1 }));
    }
  }, [hasNextPage]);

  const prevPage = useCallback(() => {
    setQueryState(prev => {
      const current = prev.pageNumber ?? 1;
      return current > 1 ? { ...prev, pageNumber: current - 1 } : prev;
    });
  }, []);

  const value: ProductContextType = {
    products: paginated,
    allProducts,
    categories,
    loading,
    error,
    query,
    hasNextPage,
    fetchProducts,
    fetchCategories,
    createProduct,
    updateProduct,
    deleteProduct,
    setQuery,
    nextPage,
    prevPage,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts(): ProductContextType {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts deve ser usado dentro de <ProductProvider>");
  }
  return context;
}