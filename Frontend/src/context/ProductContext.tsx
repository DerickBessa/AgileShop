import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { CreatedProductDto, Product, ProductQuery, UpdateProductDto } from "../types/product";
import { productService } from "../services/productService";

interface ProductContextType{
	products: Product[];
	categories: string[];
	loading: boolean;
	error: string | null;
	query: ProductQuery;
	hasNextPage: boolean;

	fetchProducts: (query?: ProductQuery) => Promise<void>;
	fetchCategories: () => Promise<void>;

	createProduct: (dto: CreatedProductDto) => Promise<void>;
	updateProduct: (id: string, dto: UpdateProductDto) => Promise<void>;
  	deleteProduct: (id: string) => Promise<void>;

	setQuery: (query: ProductQuery) => void;
	nextPage: () => void;
	prevPage: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const DEFAULT_QUERY: ProductQuery = {
	pageNumber: 1,
	pageSize: 8,
}

export function ProductProvider ({ children}: {children: ReactNode}){
	const [products, setProducts] = useState<Product[]>([]);
	const [categories, setCategories] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [query, setQueryState] = useState<ProductQuery>(DEFAULT_QUERY);

	const hasNextPage = products.length === (query.pageSize ?? DEFAULT_QUERY.pageSize);

	const fetchProducts = useCallback(async (overrideQuery?: ProductQuery) =>{
		setLoading(true);
		setError(null);

		try {
			const activeQuery = overrideQuery ?? query;
			const data = await productService.getAll(activeQuery);
			setProducts(data);
		} catch (err){
			setError(err instanceof Error ? err.message: "Erro ao buscar produtos");
		} finally{
			setLoading(false);
		}

	} , [query])

	const fetchCategories = useCallback(async () => {
		try{
			const data = await productService.getCategories();
			setCategories(data);
		} catch{

		}
	}, [])

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

      setProducts(prev => prev.map(p => (p.id === id ? updated : p))); //Prev seria o produto antes da atualizacao.
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

      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao deletar produto");
      throw err;
    } finally {
      setLoading(false);
    }
  	}, []);

	const setQuery = useCallback((newQuery: ProductQuery) => {
    const reset = { ...newQuery, pageNumber: 1 };
    setQueryState(reset);
    fetchProducts(reset);
  }, [fetchProducts]);

  	const nextPage = useCallback(() => {
    const next = { ...query, pageNumber: (query.pageNumber ?? 1) + 1 };
    setQueryState(next);
    fetchProducts(next);
  }, [query, fetchProducts]);
 
  const prevPage = useCallback(() => {
    const current = query.pageNumber ?? 1;
    if (current <= 1) return; // não vai abaixo de 1
    const prev = { ...query, pageNumber: current - 1 };
    setQueryState(prev);
    fetchProducts(prev);
  }, [query, fetchProducts]);

  	 const value: ProductContextType = {
    products,
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
