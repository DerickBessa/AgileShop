import { Pencil, Trash2, CheckCircle, AlertTriangle, XCircle, ImageOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../types/product";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const stockConfig = {
  available: {
    label: "unidades",
    className: "text-[var(--color-success)]",
    style: { backgroundColor: "rgba(16, 185, 129, 0.15)" },
    icon: <CheckCircle size={13} />,
  },
  "low-stock": {
    label: "unidades",
    className: "text-[var(--color-warning)]",
    style: { backgroundColor: "rgba(245, 158, 11, 0.15)" },
    icon: <AlertTriangle size={13} />,
  },
  unavailable: {
    label: "Esgotado",
    className: "text-[var(--color-danger)]",
    style: { backgroundColor: "rgba(239, 68, 68, 0.15)" },
    icon: <XCircle size={13} />,
  },
} as const;

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const navigate = useNavigate();

  // Estoque 0 trata como inativo
  const isInactive = !product.isActive || product.stock === 0;

  const config =
    stockConfig[product.stockStatus as keyof typeof stockConfig] ??
    stockConfig["unavailable"];

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(product.price);

  const goToDetail = () => navigate(`/produto/${product.id}`);

  return (
    <div
      className={`
        flex flex-col bg-[var(--color-card)] rounded-xl border border-[var(--color-border)]
        shadow-sm hover:shadow-md hover:-translate-y-0.5
        transition-all duration-200 overflow-hidden
        ${isInactive ? "opacity-60" : ""}
      `}
    >
      {/* Imagem */}
      <div
        className="relative w-full h-44 bg-gray-100 dark:bg-gray-800 overflow-hidden cursor-pointer flex-shrink-0"
        onClick={goToDetail}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={e => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.classList.remove("hidden");
            }}
          />
        ) : null}
        <div className={`w-full h-full flex items-center justify-center ${product.imageUrl ? "hidden" : ""}`}>
          <ImageOff size={32} className="text-[var(--color-text-secondary)]" />
        </div>

        {/* Faixa Indisponível */}
        {isInactive && (
          <div className="absolute top-0 left-0 right-0 flex items-center justify-center gap-1.5 py-1.5 bg-[var(--color-danger)] text-white text-xs font-bold tracking-wide uppercase select-none">
            <XCircle size={12} />
            Indisponível
          </div>
        )}
      </div>

      {/* Conteúdo — flex-col com grow para empurrar botões para baixo */}
      <div className="flex flex-col flex-1 p-4">

        {/* Nome */}
        <h3
          className="text-[var(--color-text-primary)] font-semibold text-base mb-1 truncate cursor-pointer hover:text-[var(--color-primary)] transition-colors"
          onClick={goToDetail}
        >
          {product.name}
        </h3>

        {/* Preço */}
        <p className="text-[var(--color-primary)] font-bold text-xl mb-3">
          {formattedPrice}
        </p>

        {/* Badges — coluna, full width com gap lateral */}
        <div className="flex flex-col gap-1.5 flex-1">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-[var(--color-text-secondary)] w-full text-center">
            {product.category}
          </span>

          {isInactive ? (
            <span
              className={`flex items-center justify-center gap-1 text-xs font-semibold px-3 py-1 rounded-full w-full ${stockConfig.unavailable.className}`}
              style={stockConfig.unavailable.style}
            >
              <XCircle size={13} />
              Indisponível
            </span>
          ) : (
            <span
              className={`flex items-center justify-center gap-1 text-xs font-semibold px-3 py-1 rounded-full w-full ${config.className}`}
              style={config.style}
            >
              {config.icon}
              {product.stockStatus === "unavailable"
                ? config.label
                : `${product.stock} ${config.label}`}
            </span>
          )}
        </div>

        {/* Botões — sempre na base */}
        <div className="flex gap-2 mt-4">
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