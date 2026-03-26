import { Search, LayoutGrid, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useRef } from "react";
import { useProducts } from "../context/ProductContext";

type SortOption = "newest" | "name_asc" | "name_desc" | "price_asc" | "price_desc";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest",     label: "Mais Recentes" },
  { value: "name_asc",   label: "Nome (A-Z)" },
  { value: "name_desc",  label: "Nome (Z-A)" },
  { value: "price_asc",  label: "Menor Preço" },
  { value: "price_desc", label: "Maior Preço" },
];

const AVAILABILITY_OPTIONS: { value: "" | "0" | "1" | "2"; label: string }[] = [
  	{ value: "",  label: "Todos" },
  	{ value: "0", label: "Disponíveis" },
  	{ value: "1", label: "Estoque Baixo"},
  	{ value: "2", label: "Sem Estoque" }
];

export function ProductFilters() {
  const { query, categories, setQuery } = useProducts();
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const inputClass =
    "bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] " +
    "rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] " +
    "transition-shadow placeholder:text-[var(--color-text-secondary)]";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none"
          />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={query.name ?? ""}
            onChange={e => {
              const value = e.target.value;
              if (searchTimeout.current) clearTimeout(searchTimeout.current);
              searchTimeout.current = setTimeout(() => {
                setQuery({ ...query, name: value || undefined });
              }, 400);
            }}
            className={`${inputClass} w-full pl-9`}
          />
        </div>

        <div className="relative">
			<LayoutGrid
				size={15}
				className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none"
			/>
			<ChevronDown
				size={14}
				className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none"
			/>
			<select
				value={query.category ?? ""}
				onChange={e => setQuery({ ...query, category: e.target.value || undefined })}
				className={`${inputClass} pl-9 pr-8 appearance-none min-w-[180px] cursor-pointer`}
			>
				<option value="">Todas as Categorias</option>
				{categories.map(cat => (
				<option key={cat} value={cat}>{cat}</option>
				))}
			</select>
		</div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <SlidersHorizontal
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none"
          />
		  <ChevronDown
			size={14}
			className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none"
			/>
          <select
            value={query.sortBy ?? "newest"}
            onChange={e => setQuery({ ...query, sortBy: e.target.value as SortOption })}
            className={`${inputClass} pl-9 pr-8 appearance-none cursor-pointer`}
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="flex rounded-lg border border-[var(--color-border)] overflow-hidden">
          {AVAILABILITY_OPTIONS.map(opt => {
            const current = query.availability !== undefined ? String(query.availability) : "";
            const active = current === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() =>
                  setQuery({
                    ...query,
                    availability: opt.value === "" ? undefined : (Number(opt.value) as 0 | 1 | 2),
                  })
                }
                className={`px-4 py-2 text-sm font-semibold transition-colors cursor-pointer
                  ${active
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-card)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]"
                  }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}