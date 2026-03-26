import { Pencil, Trash2, ImageOff, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import type { Product } from "../types/product";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatPrice(price: number) {
  const [int, dec] = price.toFixed(2).split(".");
  const intFormatted = Number(int).toLocaleString("pt-BR");
  return { int: intFormatted, dec };
}

// ─── stock label ─────────────────────────────────────────────────────────────

function StockLabel({ product }: { product: Product }) {
  const isInactive = !product.isActive || product.stock === 0;

  if (isInactive) {
    return (
      <p className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md w-fit"
        style={{ backgroundColor: "#FEE2E2", color: "#991B1B" }}>
        <XCircle size={12} />
        Indisponível
      </p>
    );
  }
  if (product.stockStatus === "low-stock") {
    return (
      <p className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md w-fit"
        style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>
        <AlertTriangle size={12} />
        Apenas {product.stock} em estoque
      </p>
    );
  }
  return (
    <p className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md w-fit"
      style={{ backgroundColor: "#D1FAE5", color: "#065F46" }}>
      <CheckCircle size={12} />
      Em estoque · {product.stock} unidades
    </p>
  );
}

// ─── component ───────────────────────────────────────────────────────────────

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const navigate = useNavigate();
  const { addItem } = useCart();

  const isInactive = !product.isActive || product.stock === 0;
  const { int, dec } = formatPrice(product.price);

  const goToDetail = () => navigate(`/produto/${product.id}`);

  return (
    <div
		className={`
			flex flex-col bg-[var(--color-card)] rounded-xl
			border border-[var(--color-border)]
			hover:border-[var(--color-primary)] hover:shadow-lg hover:-translate-y-1
			transition-all duration-200 overflow-hidden
			${isInactive ? "opacity-70" : ""}
		`}
		>

      <div
        className="relative w-full bg-[var(--color-bg)] cursor-pointer flex items-center justify-center overflow-hidden"
        style={{ height: 200 }}
        onClick={goToDetail}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain p-3 hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
              if (fallback) fallback.style.display = "flex";
            }}
          />
        ) : null}


        <div
          className="absolute inset-0 flex-col items-center justify-center gap-2 text-[var(--color-text-secondary)]"
          style={{ display: product.imageUrl ? "none" : "flex" }}
        >
          <ImageOff size={36} strokeWidth={1.2} />
          <span className="text-xs">Sem imagem</span>
        </div>

        {isInactive && (
          <div className="absolute top-0 inset-x-0 flex items-center justify-center gap-1.5 py-1.5 bg-[var(--color-danger)] text-white text-[11px] font-bold uppercase tracking-wide select-none">
            <XCircle size={11} />
            Indisponível
          </div>
        )}
      </div>


      <div className="flex flex-col flex-1 px-3 pt-3 pb-3 gap-1">

        <span className="self-start text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-[var(--color-text-secondary)]">
          {product.category}
        </span>


        <h3
          className="text-sm font-semibold text-[var(--color-text-primary)] leading-snug cursor-pointer hover:text-[var(--color-primary)] transition-colors line-clamp-2"
          onClick={goToDetail}
        >
          {product.name}
        </h3>


        <div className="mt-1">
          <p className="text-[var(--color-text-primary)] font-bold leading-none" style={{ fontSize: 22 }}>
            <span className="text-sm font-semibold align-top" style={{ lineHeight: "1.8" }}>R$</span>
            {int}
            <span className="text-sm font-semibold align-top" style={{ lineHeight: "1.8" }}>,{dec}</span>
          </p>
          <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
            à vista no Pix
          </p>
        </div>


        <StockLabel product={product} />

        <button
          onClick={(e) => { e.stopPropagation(); addItem(product); }}
          disabled={isInactive}
          className={`
            mt-2 w-full flex items-center justify-center gap-2
            py-2 rounded-lg text-sm font-semibold transition-all
			
            ${isInactive
              ? "bg-[var(--color-border)] text-[var(--color-text-secondary)] cursor-not-allowed"
              : "bg-[var(--color-success)] text-white hover:opacity-90 active:scale-[0.98] hover:opacity-80 hover:bg-[var(--color-card)] hover:border hover:border-[var(--color-success)] hover:transition-colors hover:duration-200"
            }
          `}
        >
          <ShoppingCart size={14} />
          {isInactive ? "Indisponível" : "Adicionar ao carrinho"}
        </button>

        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg
              bg-[var(--color-primary)] hover:opacity-90 active:scale-[0.98]
              text-white text-xs font-semibold transition-all cursor-pointer hover:opacity-80 hover:bg-[var(--color-card)] hover:border hover:border-[var(--color-primary)] hover:transition-colors hover:duration-200"
          >
            <Pencil size={13} />
            Editar
          </button>
          <button
            onClick={() => onDelete(product)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg
              bg-[var(--color-danger)] hover:opacity-90 active:scale-[0.98]
              text-white text-xs font-semibold transition-all cursor-pointer hover:opacity-80 hover:bg-[var(--color-card)] hover:border hover:border-[var(--color-danger)] hover:transition-colors hover:duration-200"
          >
            <Trash2 size={13} />
            Excluir
          </button>
        </div>

      </div>
    </div>
  );
}