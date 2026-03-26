import { useEffect, useState } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { ProductGrid } from "../components/ProductGrid";
import { ProductFilters } from "../components/ProductFilters";
import { ProductSidebar } from "../components/ProductSidebar";
import { ProductForm } from "../components/ProductForm";
import { ConfirmModal } from "../components/ConfirmModal";
import type { Product } from "../types/product";

export function ProductsPage() {
const { fetchCategories, deleteProduct, hasNextPage, query, nextPage, prevPage } = useProducts();

const [formOpen, setFormOpen] = useState(false);
const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

useEffect(() => {
		fetchCategories();
}, []);

const handleEdit = (product: Product) => {
		setEditingProduct(product);
		setFormOpen(true);
};

const handleCloseForm = () => {
		setFormOpen(false);
		setEditingProduct(undefined);
};

const handleDeleteConfirm = async () => {
		if (!deletingProduct) return;
		await deleteProduct(deletingProduct.id);
		setDeletingProduct(null);
};

const currentPage = query.pageNumber ?? 1;

	return (
		<main className="min-h-screen bg-[var(--color-bg)]">
		<div className="max-w-7xl mx-auto px-6 py-8">

		
			<div className="flex items-center justify-between mb-8">
			<div>
				<h1 className="text-[var(--color-text-primary)] text-3xl font-extrabold tracking-tight">
				Catálogo de Produtos
				</h1>
				<p className="text-[var(--color-text-secondary)] text-sm mt-1">
				Gerencie os produtos da sua loja
				</p>
			</div>
			<button
				onClick={() => setFormOpen(true)}
				className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold hover:opacity-80 hover:bg-[var(--color-card)] hover:border hover:border-[var(--color-primary)] hover:transition-colors hover:duration-200 transition-opacity cursor-pointer shadow-sm"
			>
				<Plus size={17} />
				Novo Produto
			</button>
			</div>

		
			<div className="lg:hidden mb-6">
			<ProductFilters />
			</div>

		
			<div className="flex gap-6 items-start">

			
			<aside className="hidden lg:flex flex-col gap-0 w-64 flex-shrink-0 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden">
				<ProductSidebar />
			</aside>

			
			<div className="flex-1 min-w-0">
				<ProductGrid
				onEdit={handleEdit}
				onDelete={(product) => setDeletingProduct(product)}
				/>

				<div className="flex items-center justify-center gap-3 mt-8">
				<button
					onClick={prevPage}
					disabled={currentPage <= 1}
					className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text-secondary)] text-sm font-semibold hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
				>
					<ChevronLeft size={16} />
					Anterior
				</button>

				<span className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold min-w-[40px] text-center">
					{currentPage}
				</span>

				<button
					onClick={nextPage}
					disabled={!hasNextPage}
					className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text-secondary)] text-sm font-semibold hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
				>
					Proxima
					<ChevronRight size={16} />
				</button>
				</div>
			</div>

			</div>
		</div>

		{formOpen && (
			<ProductForm product={editingProduct} onClose={handleCloseForm} />
		)}

		{deletingProduct && (
			<ConfirmModal
			product={deletingProduct}
			onConfirm={handleDeleteConfirm}
			onCancel={() => setDeletingProduct(null)}
			/>
		)}
		</main>
	);
}