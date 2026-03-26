import { CheckCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

interface SuccessToastProps {
	message: string;
	onClose: () => void;
	duration?: number;
}

export function SuccessToast({ message, onClose, duration = 3000 }: SuccessToastProps) {
	const [visible, setVisible] = useState(false);
	const [leaving, setLeaving] = useState(false);

	useEffect(() => {
		// entrada
		const enterTimer = setTimeout(() => setVisible(true), 10);

		// começa a sair antes do onClose
		const leaveTimer = setTimeout(() => setLeaving(true), duration - 400);

		// fecha de vez
		const closeTimer = setTimeout(onClose, duration);

		return () => {
			clearTimeout(enterTimer);
			clearTimeout(leaveTimer);
			clearTimeout(closeTimer);
		};
	}, []);

	const handleClose = () => {
		setLeaving(true);
		setTimeout(onClose, 400);
	};

	return (
		<div
			style={{
				transition: "opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
				opacity: visible && !leaving ? 1 : 0,
				transform: visible && !leaving ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
			}}
			className="fixed bottom-8 right-8 z-[100] flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border-2 border-[var(--color-success)] bg-green-100 text-[var(--color-text-primary)] min-w-[320px] max-w-sm"
		>
			<div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-200 flex-shrink-0">
				<CheckCircle size={22} className="text-[var(--color-success)]" />
			</div>
			<div className="flex flex-col flex-1">
				<span className="text-xs font-semibold text-[var(--color-success)] uppercase tracking-wide">Sucesso</span>
				<span className="text-sm font-semibold text-[var(--color-text-primary)] mt-0.5">{message}</span>
			</div>
			<button
				onClick={handleClose}
				className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer flex-shrink-0"
			>
				<X size={16} />
			</button>
		</div>
	);
}