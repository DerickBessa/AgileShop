import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { ProductsPage } from "../pages/ProductPage";
import { ProductDetailPage } from "../pages/ProductDetailPage";
import { ProductForm } from "../components/ProductForm";
import { ConfirmModal } from "../components/ConfirmModal";
import { useProducts } from "../context/ProductContext";
import type { Product } from "../types/product";
import DashboardPage from "../pages/DashboardPage";

export function AppRoutes() {
const { deleteProduct } = useProducts();
const [formOpen, setFormOpen] = useState(false);
const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

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

	return (
		<>
		<Routes>
			<Route path="/" element={<ProductsPage />} />
			<Route
			path="/produto/:id"
			element={
				<ProductDetailPage
				onEdit={handleEdit}
				onDelete={(p) => setDeletingProduct(p)}
				/>
			}
			/>
			<Route path="/dashboard" element={<DashboardPage />} />
		</Routes>

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
		</>
	);
}