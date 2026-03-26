	import { useState, useRef, useCallback, useEffect } from "react";
	import { useProducts } from "../context/ProductContext";

	const MIN_PRICE = 0;
	const MAX_PRICE = 50000;

	const PRESET_RANGES: { label: string; min: number; max: number }[] = [
	{ label: "Até R$500",       min: 0,     max: 500   },
	{ label: "R$500 a R$3.000", min: 500,   max: 3000  },
	{ label: "R$3.000 a R$10.000", min: 3000, max: 10000 },
	{ label: "R$10.000 e mais", min: 10000, max: MAX_PRICE },
	];

	function formatPrice(value: number) {
	if (value >= MAX_PRICE) return `R$${(MAX_PRICE / 1000).toFixed(0)}k`;
	if (value >= 1000) return `R$${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
	return `R$${value.toLocaleString("pt-BR")}`;
	}

	interface PriceRangeFilterProps {
	className?: string;
	}

	export function PriceRangeFilter({ className = "" }: PriceRangeFilterProps) {
	const { query, setQuery } = useProducts();

	const [localMin, setLocalMin] = useState<number>(query.priceMin ?? MIN_PRICE);
	const [localMax, setLocalMax] = useState<number>(query.priceMax ?? MAX_PRICE);
	const [activePreset, setActivePreset] = useState<number | null>(null);
	const [dragging, setDragging] = useState<"min" | "max" | null>(null);

	const trackRef = useRef<HTMLDivElement>(null);

	
	useEffect(() => {
		if (query.priceMin === undefined && query.priceMax === undefined) {
		setLocalMin(MIN_PRICE);
		setLocalMax(MAX_PRICE);
		setActivePreset(null);
		}
	}, [query.priceMin, query.priceMax]);

	const pct = (v: number) => ((v - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;

	const valueFromPct = useCallback((clientX: number) => {
		const track = trackRef.current;
		if (!track) return 0;
		const { left, width } = track.getBoundingClientRect();
		const ratio = Math.max(0, Math.min(1, (clientX - left) / width));
		const raw = MIN_PRICE + ratio * (MAX_PRICE - MIN_PRICE);

		const step = raw < 1000 ? 50 : raw < 10000 ? 500 : 1000;
		return Math.round(raw / step) * step;
	}, []);

	const commit = useCallback((min: number, max: number) => {
		setQuery({
		...query,
		priceMin: min === MIN_PRICE ? undefined : min,
		priceMax: max === MAX_PRICE ? undefined : max,
		});
	}, [query, setQuery]);

	const handleMouseMove = useCallback((e: MouseEvent) => {
		if (!dragging) return;
		const val = valueFromPct(e.clientX);
		if (dragging === "min") {
		const newMin = Math.min(val, localMax - 50);
		setLocalMin(newMin);
		} else {
		const newMax = Math.max(val, localMin + 50);
		setLocalMax(newMax);
		}
	}, [dragging, localMin, localMax, valueFromPct]);

	const handleMouseUp = useCallback(() => {
		if (dragging) {
		commit(localMin, localMax);
		setActivePreset(null);
		}
		setDragging(null);
	}, [dragging, localMin, localMax, commit]);

	useEffect(() => {
		if (dragging) {
		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);
		window.addEventListener("touchmove", handleTouchMove as any);
		window.addEventListener("touchend", handleMouseUp);
		}
		return () => {
		window.removeEventListener("mousemove", handleMouseMove);
		window.removeEventListener("mouseup", handleMouseUp);
		window.removeEventListener("touchmove", handleTouchMove as any);
		window.removeEventListener("touchend", handleMouseUp);
		};
	}, [dragging, handleMouseMove, handleMouseUp]);

	function handleTouchMove(e: TouchEvent) {
		handleMouseMove({ clientX: e.touches[0].clientX } as MouseEvent);
	}

	function startDrag(thumb: "min" | "max") {
		return (e: React.MouseEvent | React.TouchEvent) => {
		e.preventDefault();
		setDragging(thumb);
		};
	}

	function applyPreset(index: number) {
		const { min, max } = PRESET_RANGES[index];
		setLocalMin(min);
		setLocalMax(max);
		setActivePreset(index);
		commit(min, max);
	}

	function clearFilter() {
		setLocalMin(MIN_PRICE);
		setLocalMax(MAX_PRICE);
		setActivePreset(null);
		setQuery({ ...query, priceMin: undefined, priceMax: undefined });
	}

	const isFiltered = localMin > MIN_PRICE || localMax < MAX_PRICE;

	return (
		<div className={`flex flex-col gap-3 ${className}`}>

		<div className="flex items-center justify-between">
			<span className="text-sm font-semibold text-[var(--color-text-primary)]">Preço</span>
			{isFiltered && (
			<button
				onClick={clearFilter}
				className="text-xs text-[var(--color-primary)] hover:underline cursor-pointer"
			>
				Limpar
			</button>
			)}
		</div>

		<p className="text-sm font-medium text-[var(--color-text-primary)]">
			{localMin === MIN_PRICE && localMax >= MAX_PRICE
			? "Todos os preços"
			: `${formatPrice(localMin)} – ${formatPrice(localMax)}${localMax >= MAX_PRICE ? " e mais" : ""}`}
		</p>

		<div className="pt-2 pb-4 px-1">
			<div
			ref={trackRef}
			className="relative h-1.5 rounded-full bg-[var(--color-border)] select-none"
			>
			<div
				className="absolute top-0 h-full rounded-full bg-[var(--color-primary)]"
				style={{
				left: `${pct(localMin)}%`,
				right: `${100 - pct(localMax)}%`,
				}}
			/>

			<button
				onMouseDown={startDrag("min")}
				onTouchStart={startDrag("min")}
				className={`
				absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full
				bg-[var(--color-primary)] border-2 border-white shadow-md
				cursor-grab active:cursor-grabbing transition-transform
				hover:scale-125 focus:outline-none focus:scale-125
				${dragging === "min" ? "scale-125" : ""}
				`}
				style={{ left: `${pct(localMin)}%` }}
				aria-label={`Preço mínimo: ${formatPrice(localMin)}`}
			/>

			<button
				onMouseDown={startDrag("max")}
				onTouchStart={startDrag("max")}
				className={`
				absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full
				bg-[var(--color-primary)] border-2 border-white shadow-md
				cursor-grab active:cursor-grabbing transition-transform
				hover:scale-125 focus:outline-none focus:scale-125
				${dragging === "max" ? "scale-125" : ""}
				`}
				style={{ left: `${pct(localMax)}%` }}
				aria-label={`Preço máximo: ${formatPrice(localMax)}`}
			/>
			</div>

			<div className="flex justify-between mt-2">
			<span className="text-xs text-[var(--color-text-secondary)]">{formatPrice(MIN_PRICE)}</span>
			<span className="text-xs text-[var(--color-text-secondary)]">{formatPrice(MAX_PRICE)}+</span>
			</div>
		</div>

		<div className="flex flex-col gap-1 pt-1 border-t border-[var(--color-border)]">
			{PRESET_RANGES.map((range, i) => (
			<button
				key={i}
				onClick={() => applyPreset(i)}
				className={`
				text-left text-sm py-1 px-1 rounded transition-colors cursor-pointer
				${activePreset === i
					? "text-[var(--color-primary)] font-semibold"
					: "text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
				}
				`}
			>
				{activePreset === i && (
				<span className="mr-1">✓</span>
				)}
				{range.label}
			</button>
			))}
		</div>
		</div>
	);
	}