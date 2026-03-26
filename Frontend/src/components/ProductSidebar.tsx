import { LayoutGrid, SlidersHorizontal, ChevronDown, Package } from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { PriceRangeFilter } from "./PricerRangeFilter";

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

const selectClass =
  "bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)] " +
  "rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] " +
  "transition-shadow w-full pl-9 pr-8 appearance-none cursor-pointer " +
  "hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]";

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-4 py-4 border-b border-[var(--color-border)] last:border-b-0">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-3">
        {title}
      </p>
      {children}
    </div>
  );
}

export function ProductSidebar() {
  const { query, categories, setQuery } = useProducts();
  const currentAvailability = query.availability !== undefined ? String(query.availability) : "";

  return (
    <div className="flex flex-col">

      {/* Cabeçalho da sidebar */}
      <div className="px-4 py-3.5 border-b border-[var(--color-border)]">
        <span className="text-sm font-bold text-[var(--color-text-primary)]">Filtros</span>
      </div>

      {/* Categoria */}
      <SidebarSection title="Categoria">
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
            className={selectClass}
          >
            <option value="">Todas</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </SidebarSection>

      {/* Ordenação */}
      <SidebarSection title="Ordenar por">
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
            className={selectClass}
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </SidebarSection>

      {/* Disponibilidade */}
      <SidebarSection title="Disponibilidade">
        <div className="flex flex-col gap-1">
          {AVAILABILITY_OPTIONS.map(opt => {
            const active = currentAvailability === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() =>
                  setQuery({
                    ...query,
                    availability: opt.value === "" ? undefined : (Number(opt.value) as 0 | 1 | 2),
                  })
                }
                className={`
                  text-left text-sm px-3 py-2 rounded-lg transition-colors cursor-pointer font-medium
                  ${active
                    ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]/50 hover:text-[var(--color-text-primary)]"
                  }
                `}
              >
                {active && <span className="mr-1.5">✓</span>}
                {opt.label}
              </button>
            );
          })}
        </div>
      </SidebarSection>

      {/* Faixa de Preço */}
      <SidebarSection title="Preço">
        <PriceRangeFilter />
      </SidebarSection>

    </div>
  );
}