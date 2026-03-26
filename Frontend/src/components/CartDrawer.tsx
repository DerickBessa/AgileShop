import { useEffect, useRef } from "react";
import { X, Trash2, ShoppingCart, Plus, Minus, PackageX } from "lucide-react";
import { useCart } from "../context/CartContext";


function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}


export function CartDrawer() {
  const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart, isOpen, closeCart } =
    useCart();

  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeCart();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeCart]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      <div
        onClick={closeCart}
        className={`
          fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        aria-hidden="true"
      />

      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Carrinho de compras"
        className={`
          fixed top-0 right-0 z-50 h-full w-full max-w-sm
          bg-[var(--color-card)] border-l border-[var(--color-border)]
          flex flex-col shadow-2xl
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          	<div className="flex items-center gap-2">
				<ShoppingCart size={18} className="text-[var(--color-primary)]" />
					<h2 className="text-base font-semibold text-[var(--color-text-primary)]">
						Carrinho
					</h2>
						{totalItems > 0 && (
					<span className="text-xs font-bold bg-[var(--color-primary)] text-white rounded-full px-2 py-0.5">
						{totalItems}
					</span>
				)}
          	</div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              	<button
					onClick={clearCart}
					title="Limpar carrinho"
					className="flex items-center gap-1 text-xs text-[var(--color-danger)] hover:opacity-70 transition-opacity px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950"
				>
					<Trash2 size={13} />
                	Limpar
              	</button>
            )}
				<button
					onClick={closeCart}
					aria-label="Fechar carrinho"
					className="p-1.5 rounded-lg hover:bg-[var(--color-border)] transition-colors text-[var(--color-text-secondary)]"
					>
					<X size={18} />
				</button>
          	</div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          	{items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-[var(--color-text-secondary)]">
              	<PackageX size={48} strokeWidth={1.2} />
              	<p className="text-sm font-medium">Seu carrinho está vazio</p>
              	<p className="text-xs text-center">
                	Adicione produtos pelo catálogo ou pela página do produto.
              	</p>
            </div>
          	) : (
            items.map(({ product, quantity }) => (
              	<div
                	key={product.id}
                	className="flex gap-3 pb-4 border-b border-[var(--color-border)] last:border-none last:pb-0"
              	>
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--color-border)]">
                  	{product.imageUrl ? (
                    <img
                      	src={product.imageUrl}
                      	alt={product.name}
                      	className="w-full h-full object-cover"
                    />
                  	) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--color-text-secondary)]">
                      	<ShoppingCart size={20} strokeWidth={1.2} />
                    </div>
                  	)}
                </div>

                <div className="flex-1 min-w-0">
                  	<p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                    	{product.name}
                  	</p>
                  	<p className="text-xs text-[var(--color-text-secondary)] mb-2">
                    	{product.category}
                 	</p>

                  	<div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      	<button
							onClick={() => updateQuantity(product.id, quantity - 1)}
							disabled={quantity <= 1}
							aria-label="Diminuir quantidade"
							className="w-6 h-6 rounded-md border border-[var(--color-border)] flex items-center justify-center
							text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]
							disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
						>
                        	<Minus size={11} />
                      </button>
                      <span className="w-7 text-center text-sm font-semibold text-[var(--color-text-primary)]">
                        {quantity}
                      </span>
						<button
							onClick={() => updateQuantity(product.id, quantity + 1)}
							disabled={quantity >= product.stock}
							aria-label="Aumentar quantidade"
							className="w-6 h-6 rounded-md border border-[var(--color-border)] flex items-center justify-center
							text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]
							disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
						>
							<Plus size={11} />
						</button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[var(--color-primary)]">
                        {formatBRL(product.price * quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(product.id)}
                        aria-label={`Remover ${product.name}`}
                        className="p-1 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>

                  {quantity >= product.stock && (
                    <p className="text-[10px] text-[var(--color-warning)] mt-1">
                      Limite de estoque atingido ({product.stock} un.)
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          	<div className="px-5 py-4 border-t border-[var(--color-border)] space-y-3">
				<div className="flex items-center justify-between text-sm text-[var(--color-text-secondary)]">
				<span>{totalItems} {totalItems === 1 ? "item" : "itens"}</span>
				<span>subtotal</span>
				</div>
            <div className="flex items-center justify-between">
              	<span className="text-base font-semibold text-[var(--color-text-primary)]">Total</span>
              	<span className="text-xl font-extrabold text-[var(--color-primary)]">
                {formatBRL(totalPrice)}
              	</span>
            </div>
            <button
              	className="w-full py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold text-sm
                hover:opacity-90 active:scale-[0.98] transition-all"
            >
              	Finalizar Pedido
            </button>
          </div>
        )}
      	</div>
    </>
  	);
}