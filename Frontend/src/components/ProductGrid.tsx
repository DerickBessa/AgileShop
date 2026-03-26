
import { useEffect } from "react";
import { PackageSearch } from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { ProductCard } from "./ProductCard";
import type { Product } from "../types/product";

interface ProductGridProps {
	onEdit: (product: Product) => void;
	onDelete: (product: Product) => void;
}

export function ProductGrid({ onEdit, onDelete }: ProductGridProps) {
const { products, loading, error, fetchProducts } = useProducts();

useEffect(() => {
		fetchProducts();
}, []);

	if (loading) {
		return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
			{Array.from({ length: 8 }).map((_, i) => (
			<div
				key={i}
				className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] h-80 animate-pulse"
			/>
			))}
		</div>
		);
	}

	if (error) {
		return (
		<div className="flex flex-col items-center justify-center py-20 gap-3 text-[var(--color-danger)]">
			<span className="text-lg font-semibold">Erro ao carregar produtos</span>
			<span className="text-sm text-[var(--color-text-secondary)]">{error}</span>
			<button
			onClick={() => fetchProducts()}
			className="mt-2 px-5 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
			>
			Tentar novamente
			</button>
		</div>
		);
	}

	if (products.length === 0) {
		return (
		<div className="flex flex-col items-center justify-center py-20 gap-3 text-[var(--color-text-secondary)]">
			<PackageSearch size={48} strokeWidth={1.5} />
			<span className="text-lg font-semibold">Nenhum produto encontrado</span>
			<span className="text-sm">Tente ajustar os filtros ou cadastre um novo produto.</span>
		</div>
		);
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
		{products.map(product => (
			<ProductCard
			key={product.id}
			product={product}
			onEdit={onEdit}
			onDelete={onDelete}
			/>
		))}
		</div>
	);
}