import { Search, LayoutGrid, SlidersHorizontal, ChevronDown, Package } from "lucide-react";
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
  { value: "1", label: "Estoque Baixo" },
  { value: "2", label: "Sem Estoque" },
];

export function ProductFilters() {
  const { query, categories, setQuery } = useProducts();
  const inputClass =
    "bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text-primary)] " +
    "rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] " +
    "transition-shadow placeholder:text-[var(--color-text-secondary)]";

  const currentAvailability = query.availability !== undefined ? String(query.availability) : "";

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
              setQuery({ ...query, name: e.target.value || undefined });
            }}
            className={`${inputClass} w-full pl-9`}
          />
        </div>

        <div className="relative w-full sm:w-auto">
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
            className={`${inputClass} w-full sm:min-w-[180px] pl-9 pr-8 appearance-none cursor-pointer hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]`}
          >
            <option value="">Todas as Categorias</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-0.5">
        <div className="relative flex-shrink-0">
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
            className={`${inputClass} pl-9 pr-8 appearance-none cursor-pointer hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]`}
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Mobile: select igual aos outros filtros */}
        <div className="relative flex-shrink-0 sm:hidden">
          <Package
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none"
          />
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none"
          />
          <select
            value={currentAvailability}
            onChange={e =>
              setQuery({
                ...query,
                availability: e.target.value === "" ? undefined : (Number(e.target.value) as 0 | 1 | 2),
              })
            }
            className={`${inputClass} pl-9 pr-8 appearance-none cursor-pointer hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]`}
          >
            {AVAILABILITY_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Desktop: botões originais */}
        <div className="hidden sm:flex rounded-lg border border-[var(--color-border)] flex-shrink-0">
          {AVAILABILITY_OPTIONS.map(opt => {
            const active = currentAvailability === opt.value;
            const activeClass = active
              ? "bg-[var(--color-primary)] text-white"
              : "bg-[var(--color-card)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)]";

            return (
              <button
                key={opt.value}
                onClick={() =>
                  setQuery({
                    ...query,
                    availability: opt.value === "" ? undefined : (Number(opt.value) as 0 | 1 | 2),
                  })
                }
                className={`px-4 py-2 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap flex-shrink-0 ${activeClass}`}
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