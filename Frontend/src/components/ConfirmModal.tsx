import { X, Trash2 } from "lucide-react";
import type { Product } from "../types/product";

interface ConfirmModalProps {
 	product: Product;
 	onConfirm: () => void;
  	onCancel: () => void;
}

export function ConfirmModal({ product, onConfirm, onCancel }: ConfirmModalProps) {
  	return (
    	<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
			onClick={onCancel}
			>
      	<div
			className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] shadow-xl w-full max-w-md p-7"
			onClick={e => e.stopPropagation()}
		>
        <div className="flex items-center justify-between mb-5">
          	<div className="flex items-center gap-3">
            	<div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#FEE2E2" }}>
              		<Trash2 size={18} style={{ color: "#EF4444" }} />
            	</div>
            	<h2 className="text-[var(--color-text-primary)] text-lg font-bold">
             		 Excluir Produto
            	</h2>
          	</div>
          	<button
				onClick={onCancel}
				className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
			>
				<X size={20} />
			</button>
        </div>

        <p className="text-[var(--color-text-secondary)] text-sm mb-1">
          	Tem certeza que deseja excluir o produto:
        </p>
        <p className="text-[var(--color-text-primary)] font-semibold text-base mb-6">
          	"{product.name}"
        </p>
        <p className="text-[var(--color-text-secondary)] text-sm mb-6">
         	Essa ação não pode ser desfeita.
        </p>

			<div className="flex gap-3">
				<button
					onClick={onCancel}
					className="flex-1 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text-primary)] text-sm font-semibold hover:bg-[var(--color-border)] transition-colors cursor-pointer"
				>
					Cancelar
				</button>
				<button
					onClick={onConfirm}
					className="flex-1 py-2.5 rounded-lg bg-[var(--color-danger)] text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
				>
					Excluir
				</button>
			</div>
     	</div>
    </div>
  );
}