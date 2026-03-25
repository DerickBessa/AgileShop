import { Pencil, Trash2, CheckCircle, AlertTriangle, XCircle, ImageOff } from "lucide-react";
import type { Product } from "../types/product";

interface ProductCardProps{
	product: Product;
	onEdit: (product: Product) => void;
	onDelete: (product: Product) => void;
}

const stockConfig = {
  "available": {
    label: "unidades",
    className: "text-[#065F46]",
    style: { backgroundColor: "#D1FAE5" },
    icon: <CheckCircle size={13} />,
  },
  "low-stock": {
    label: "unidades",
    className: "text-[#92400E]",
    style: { backgroundColor: "#FEF3C7" },
    icon: <AlertTriangle size={13} />,
  },
  "unavailable": {
    label: "Indisponível",
    className: "text-[#991B1B]",
    style: { backgroundColor: "#FEE2E2" },
    icon: <XCircle size={13} />,
  },
} as const;

	export function ProductCard({ product, onEdit, onDelete}: ProductCardProps){
		const config = stockConfig[product.stockStatus as keyof typeof stockConfig] 
		?? stockConfig["unavailable"];

		const formattedPrice = new Intl.NumberFormat("pt-BR", {
			style: "currency",
			currency: "BRL",
		}).format(product.price);

		return (
    <div
      className={`
        bg-[var(--color-card)] rounded-xl border border-[var(--color-border)]
        shadow-sm hover:shadow-md hover:-translate-y-0.5
        transition-all duration-200 overflow-hidden
        ${!product.isActive ? "opacity-60" : ""}
      `}
    >
      {/* imagem */}
      <div className="w-full h-44 bg-gray-100 dark:bg-gray-800 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={e => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.classList.remove("hidden");
            }}
          />
        ) : null}
        <div className={`w-full h-full flex items-center justify-center ${product.imageUrl ? "hidden" : ""}`}>
          <ImageOff size={32} className="text-[var(--color-text-secondary)]" />
        </div>
      </div>

      <div className="p-4">

        <h3 className="text-[var(--color-text-primary)] font-semibold text-base mb-1 truncate">
          {product.name}
        </h3>


        <p className="text-[var(--color-primary)] font-bold text-xl mb-3">
          {formattedPrice}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-[var(--color-text-secondary)]">
            {product.category}
          </span>

          <span className={`flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${config.className}`}>
            {config.icon}
            {product.stockStatus === "unavailable"
              ? config.label
              : `${product.stock} ${config.label}`}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[var(--color-primary)] hover:opacity-90 text-white font-semibold text-sm transition-opacity cursor-pointer"
          >
            <Pencil size={15} />
            Editar
          </button>
          <button
            onClick={() => onDelete(product)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[var(--color-danger)] hover:opacity-90 text-white font-semibold text-sm transition-opacity cursor-pointer"
          >
            <Trash2 size={15} />
            Excluir
          </button>
        </div>

      </div>
    </div>
  );
}
