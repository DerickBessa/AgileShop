import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	CheckCircle,
	AlertTriangle,
	XCircle,
	ImageOff,
	Pencil,
	Trash2,
	Tag,
	Package,
	Calendar,
	BadgeCheck,
	BadgeX,
	} from "lucide-react";
import { productService } from "../services/productService";
import { ProductCard } from "../components/ProductCard";
import type { Product } from "../types/product";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

const stockConfig = {
	available: {
		label: "unidades disponíveis",
		className: "text-[var(--color-success)] bg-[var(--color-success)]/15",
		icon: <CheckCircle size={16} />,
	},
	"low-stock": {
		label: "unidades (estoque baixo)",
		className: "text-[var(--color-warning)] bg-[var(--color-warning)]/15",
		icon: <AlertTriangle size={16} />,
	},
	unavailable: {
		label: "Indisponível",
		className: "text-[var(--color-danger)] bg-[var(--color-danger)]/15",
		icon: <XCircle size={16} />,
	},
	} as const;

interface ProductDetailPageProps {
	onEdit?: (product: Product) => void;
	onDelete?: (product: Product) => void;
	}

export function ProductDetailPage({ onEdit, onDelete }: ProductDetailPageProps) {
		const { id } = useParams<{ id: string }>();
		const navigate = useNavigate();
		const [product, setProduct] = useState<Product | null>(null);
		const [loading, setLoading] = useState(true);
		const [error, setError] = useState<string | null>(null);
		const [imgError, setImgError] = useState(false);
		const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
		const { addItem } = useCart();
		const isInactive = !product?.isActive || product?.stock === 0;	

	useEffect(() => {
		if (!id) return;
		setLoading(true);
		setError(null);
		productService
		.getById(id)
		.then((data) => {
			setProduct(data);
			return productService.getAll({ category: data.category });
		})
		.then((all) => {
			setSimilarProducts(all.filter((p) => p.id !== id).slice(0, 4));
		})
		.catch(() => setError("Produto não encontrado ou erro ao carregar."))
		.finally(() => setLoading(false));
	}, [id]);

		const formattedPrice = product
			? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(product.price)
			: "";

		const formattedDate = product
			? new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date(product.createdAt))
			: "";

		const config =
			product
			? stockConfig[product.stockStatus as keyof typeof stockConfig] ?? stockConfig["unavailable"]
			: stockConfig["unavailable"];

		if (loading) {
			return (
			<main className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
				<div className="flex flex-col items-center gap-4 text-[var(--color-text-secondary)]">
				<div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
				<span className="text-sm font-medium">Carregando produto...</span>
				</div>
			</main>
		);
	}

		if (error || !product) {
			return (
			<main className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
				<div className="flex flex-col items-center gap-4 text-center px-4">
				<XCircle size={48} className="text-[var(--color-danger)]" />
				<p className="text-[var(--color-text-primary)] font-semibold text-lg">
					{error ?? "Produto não encontrado."}
				</p>
				<button
					onClick={() => navigate("/")}
					className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
				>
					<ArrowLeft size={16} />
					Voltar ao catálogo
				</button>
				</div>
			</main>
			);
	}

		return (
		<main className={`min-h-screen bg-[var(--color-bg)] ${!product.isActive ? "opacity-80" : ""}`}>
		<div className="max-w-6xl mx-auto px-6 py-8">

			<button
			onClick={() => navigate("/")}
			className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] text-sm font-semibold mb-8 transition-colors cursor-pointer group"
			>
			<ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
			Voltar ao catálogo
			</button>

			<div className="flex flex-col lg:flex-row gap-10 items-start">

			<div className="w-full lg:w-[520px] flex-shrink-0">
				{product.imageUrl && !imgError ? (
				<img
					src={product.imageUrl}
					alt={product.name}
					className="w-full object-cover rounded-2xl"
					style={{ maxHeight: 520 }}
					onError={() => setImgError(true)}
				/>
				) : (
				<div className="w-full rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] flex flex-col items-center justify-center gap-3 text-[var(--color-text-secondary)]" style={{ minHeight: 460 }}>
					<ImageOff size={56} />
					<span className="text-sm">Sem imagem</span>
				</div>
				)}
			</div>

			<div className="flex-1 min-w-0">

				<div className="flex flex-wrap items-center gap-2 mb-4">
				<span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-[var(--color-text-secondary)]">
					<Tag size={12} />
					{product.category}
				</span>

				<span
					className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${config.className}`}
				>
					{config.icon}
					{product.stockStatus === "unavailable"
					? config.label
					: `${product.stock} ${config.label}`}
				</span>

				{product.isActive ? (
					<span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full text-[var(--color-success)] bg-[var(--color-success)]/15">
					<BadgeCheck size={13} />
					Ativo
					</span>
				) : (
					<span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full text-[var(--color-danger)] bg-[var(--color-danger)]/15">
					<BadgeX size={13} />
					Inativo
					</span>
				)}
				</div>

				<h1 className="text-[var(--color-text-primary)] text-2xl md:text-3xl font-bold mb-1 leading-snug">
				{product.name}
				</h1>

				<hr className="border-[var(--color-border)] my-4" />

				<p className="text-[var(--color-primary)] text-3xl md:text-4xl font-bold mb-5">
				{formattedPrice}
				</p>


				<div className="mb-6">
				<h2 className="text-[var(--color-text-secondary)] text-xs font-semibold uppercase tracking-wider mb-2">
					Descrição
				</h2>
				{product.description ? (
					<p className="text-[var(--color-text-primary)] text-sm leading-relaxed">
					{product.description}
					</p>
				) : (
					<p className="text-[var(--color-text-secondary)] text-sm italic">
					Sem descrição cadastrada.
					</p>
				)}
				</div>


				<hr className="border-[var(--color-border)] mb-6" />


				<div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-8">
				<div>
					<p className="text-[var(--color-text-secondary)] text-xs font-semibold uppercase tracking-wider mb-1">
					CATEGORIA
					</p>
					<p className="text-[var(--color-text-primary)] text-sm font-medium">
					{product.category}
					</p>
				</div>

				<div>
					<p className="text-[var(--color-text-secondary)] text-xs font-semibold uppercase tracking-wider mb-1">
					Estoque
					</p>
					<div className="flex items-center gap-2">
					<Package size={14} className="text-[var(--color-text-secondary)]" />
					<p className="text-[var(--color-text-primary)] text-sm font-medium">
						{product.stock} unidades
					</p>
					</div>
				</div>

				<div>
					<p className="text-[var(--color-text-secondary)] text-xs font-semibold uppercase tracking-wider mb-1">
					Disponibilidade
					</p>
					<p className={`text-sm font-semibold ${product.isActive && product.stock > 0 ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"}`}>
					{product.isActive && product.stock > 0 ? "Em estoque" : "Indisponível"}
					</p>
				</div>

				<div>
					<p className="text-[var(--color-text-secondary)] text-xs font-semibold uppercase tracking-wider mb-1">
					Cadastrado em
					</p>
					<div className="flex items-center gap-2">
					<Calendar size={14} className="text-[var(--color-text-secondary)]" />
					<p className="text-[var(--color-text-primary)] text-sm font-medium">
						{formattedDate}
					</p>
					</div>
				</div>
				</div>


				{(onEdit || onDelete) && (
				<div className="flex flex-col sm:flex-row gap-3">
					{onEdit && (
					<button
						onClick={() => onEdit(product)}
						className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--color-primary)] hover:opacity-90 text-white font-semibold text-sm transition-opacity cursor-pointer"
					>
						<Pencil size={15} />
						Editar Produto
					</button>
					)}
					{onDelete && (
					<button
						onClick={() => onDelete(product)}
						className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--color-danger)] hover:opacity-90 text-white font-semibold text-sm transition-opacity cursor-pointer"
					>
						<Trash2 size={15} />
						Excluir Produto
					</button>
					)}
					<button
					onClick={() => addItem(product)}
					disabled={isInactive}
					className={`
						flex items-center justify-center gap-2
						px-6 py-3 rounded-xl text-sm font-semibold transition-all
						${isInactive
						? "bg-[var(--color-border)] text-[var(--color-text-secondary)] cursor-not-allowed"
						: "bg-[var(--color-primary)] text-white hover:opacity-90 active:scale-[0.98]"
						}
					`}
					>
					<ShoppingCart size={16} />
					{isInactive ? "Produto Indisponível" : "Adicionar ao Carrinho"}
					</button>
				</div>
				)}

			</div>
			</div>

		</div>

		{similarProducts.length > 0 && (
			<div className="max-w-6xl mx-auto px-6 pb-12">
			<hr className="border-[var(--color-border)] mb-8" />
			<h2 className="text-[var(--color-text-primary)] text-xl font-bold mb-6">
				Produtos Similares
			</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
				{similarProducts.map((p) => (
				<ProductCard
					key={p.id}
					product={p}
					onEdit={onEdit ?? (() => {})}
					onDelete={onDelete ?? (() => {})}
				/>
				))}
			</div>
			</div>
		)}

		</main>
	);
}