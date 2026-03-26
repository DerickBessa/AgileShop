import { X, ImageOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Product } from "../types/product";
import { useProducts } from "../context/ProductContext";

const schema = z.object({
	name: z.string().min(1, "Nome é obrigatório").max(100, "Máximo 100 caracteres"),
	description: z.string().max(500, "Máximo 500 caracteres").optional(),
	price: z.coerce.number().min(0.01, "Preço deve ser maior que R$ 0,01"),
	stock: z.coerce.number().int().min(0, "Estoque não pode ser negativo"),
	category: z.string().min(1, "Categoria é obrigatória"),
	imageUrl: z.union([z.string().url("URL inválida"), z.literal("")]).optional(),
	isActive: z.boolean().optional(),
});

const DEFAULT_CATEGORIES = [
	"Eletrônicos",
	"Roupas",
	"Alimentos",
	"Livros",
	"Móveis",
	"Esportes",
	"Beleza",
	"Brinquedos",
	"Ferramentas",
	"Outros",
];

type FormInput = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;
type FormData = z.infer<typeof schema>;

interface ProductFormProps {
	product?: Product;
	onClose: () => void;
	onSuccess: (message: string) => void;
}

export function ProductForm({ product, onClose, onSuccess }: ProductFormProps) {
	const { createProduct, updateProduct } = useProducts();
	const isEditing = !!product;
	const [imagePreview, setImagePreview] = useState(product?.imageUrl ?? "");
	const [imageError, setImageError] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<string>(
		product?.category
			? DEFAULT_CATEGORIES.includes(product.category) ? product.category : "Outros"
			: ""
	);

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors, isSubmitting, isValid },
	} = useForm<FormInput, unknown, FormOutput>({
		resolver: zodResolver(schema) as any,
		mode: "onBlur",
		reValidateMode: "onChange",
		defaultValues: {
			name: product?.name ?? "",
			description: product?.description ?? "",
			price: product?.price ?? 0,
			stock: product?.stock ?? 0,
			category: product?.category ?? "",
			imageUrl: product?.imageUrl ?? "",
			isActive: product?.isActive ?? true,
		},
	});

	const watchedImageUrl = watch("imageUrl");

	useEffect(() => {
		const timeout = setTimeout(() => {
			setImageError(false);
			setImagePreview(watchedImageUrl ?? "");
		}, 500);
		return () => clearTimeout(timeout);
	}, [watchedImageUrl]);

	const handleClearImage = () => {
		setValue("imageUrl", "", { shouldValidate: true });
		setImagePreview("");
		setImageError(false);
	};

	const onSubmit = async (data: FormData) => {
		const dto = {
			name: data.name,
			description: data.description || undefined,
			price: data.price,
			stock: data.stock,
			category: data.category,
			imageUrl: data.imageUrl || undefined,
		};

		if (isEditing) {
			await updateProduct(product.id, { ...dto, isActive: data.isActive ?? product.isActive });
			onSuccess("Produto atualizado com sucesso!");
		} else {
			await createProduct(dto);
			onSuccess("Produto criado com sucesso!");
		}
	};

	const inputClass =
		"w-full bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] " +
		"rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] " +
		"transition-shadow placeholder:text-[var(--color-text-secondary)]";

	const labelClass = "block text-sm font-semibold text-[var(--color-text-primary)] mb-1.5";
	const errorClass = "text-xs text-[var(--color-danger)] mt-1";

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
			onClick={onClose}
		>
			<div
				className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
				onClick={e => e.stopPropagation()}
			>
				<div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
					<h2 className="text-[var(--color-text-primary)] text-lg font-bold">
						{isEditing ? "Editar Produto" : "Novo Produto"}
					</h2>
					<button
						onClick={onClose}
						className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] py-1.5 px-1.5 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
					>
						<X size={20} />
					</button>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-4">
					<div>
						<label className={labelClass}>Nome do Produto *</label>
						<input {...register("name")} placeholder="Ex: Notebook Gamer" className={inputClass} />
						{errors.name && <p className={errorClass}>{errors.name.message}</p>}
					</div>

					<div>
						<label className={labelClass}>Descrição</label>
						<textarea
							{...register("description")}
							placeholder="Descreva o produto..."
							rows={3}
							className={`${inputClass} resize-none`}
						/>
						{errors.description && <p className={errorClass}>{errors.description.message}</p>}
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className={labelClass}>Preço (R$) *</label>
							<input
								{...register("price")}
								type="number"
								step="0.01"
								min="0.01"
								placeholder="0,00"
								className={inputClass}
							/>
							{errors.price && <p className={errorClass}>{errors.price.message}</p>}
						</div>
						<div>
							<label className={labelClass}>Estoque *</label>
							<input
								{...register("stock")}
								type="number"
								min="0"
								placeholder="0"
								className={inputClass}
							/>
							{errors.stock && <p className={errorClass}>{errors.stock.message}</p>}
						</div>
					</div>

					<div>
						<label className={labelClass}>Categoria *</label>
						<select
							value={selectedCategory}
							onChange={e => {
								setSelectedCategory(e.target.value);
								if (e.target.value !== "Outros") {
									setValue("category", e.target.value, { shouldValidate: true });
								} else {
									setValue("category", "", { shouldValidate: true });
								}
							}}
							className={`${inputClass} cursor-pointer`}
						>
							<option value="">Selecione...</option>
							{DEFAULT_CATEGORIES.map(cat => (
								<option key={cat} value={cat}>{cat}</option>
							))}
						</select>

						{selectedCategory === "Outros" && (
							<input
								{...register("category")}
								placeholder="Digite a categoria..."
								className={`${inputClass} mt-2`}
							/>
						)}
						{errors.category && <p className={errorClass}>{errors.category.message}</p>}
					</div>

					<div>
						<label className={labelClass}>URL da Imagem</label>
						<div className="relative">
							<input
								{...register("imageUrl")}
								placeholder="https://..."
								className={`${inputClass} pr-8`}
							/>
							{watchedImageUrl && (
								<button
									type="button"
									onClick={handleClearImage}
									className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] transition-colors cursor-pointer"
								>
									<X size={14}/>
								</button>
							)}
						</div>
						{errors.imageUrl && <p className={errorClass}>{errors.imageUrl.message}</p>}


						{imagePreview && (
							<div className="mt-3 relative rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg)]">
								{!imageError ? (
									<>
										<img
											src={imagePreview}
											alt="Preview"
											className="w-full h-52 object-contain p-2"
											onError={() => setImageError(true)}
										/>
										<button
											type="button"
											onClick={handleClearImage}
											className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
										>
											<X size={13} />
										</button>
									</>
								) : (
									<div className="w-full h-32 flex flex-col items-center justify-center gap-2 text-[var(--color-text-secondary)]">
										<ImageOff size={28} strokeWidth={1.2} />
										<span className="text-xs">Não foi possível carregar a imagem</span>
									</div>
								)}
							</div>
						)}
					</div>

					{isEditing && (
						<div className="flex items-center gap-3">
							<input
								{...register("isActive")}
								type="checkbox"
								id="isActive"
								className="w-4 h-4 accent-[var(--color-primary)] cursor-pointer"
							/>
							<label htmlFor="isActive" className="text-sm font-semibold text-[var(--color-text-primary)] cursor-pointer">
								Produto ativo
							</label>
						</div>
					)}

					<div className="flex gap-3 pt-2">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 py-2.5 rounded-lg border border-[var(--color-border)] bg-red-400 hover:bg-red-500 hover:shadow-md text-white text-sm font-semibold hover:brightness-95 transition-all cursor-pointer"
						>
							Cancelar
						</button>
						<button
							type="submit"
							disabled={!isValid || isSubmitting}
							className="flex-1 py-2.5 rounded-lg text-white text-sm font-semibold transition-all cursor-pointer disabled:cursor-not-allowed"
							style={{
								backgroundColor: isValid && !isSubmitting ? "#10B981" : "#6EE7B7",
								opacity: isValid && !isSubmitting ? 1 : 0.6,
								boxShadow: isValid && !isSubmitting ? "0 4px 12px rgba(16,185,129,0.35)" : "none",
							}}
						>
							{isSubmitting ? "Salvando..." : "Salvar Produto"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}