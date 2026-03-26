import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  XCircle,
  Tag,
  ArrowLeft,
  BarChart2,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import { useProducts } from "../context/ProductContext";
import type { Product } from "../types/product";

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatBRLShort(value: number) {
  if (value >= 1_000_000) return `R$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `R$${(value / 1_000).toFixed(1)}k`;
  return formatBRL(value);
}

// ─── sub-components ──────────────────────────────────────────────────────────

interface MetricCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  accent?: "default" | "success" | "warning" | "danger";
}

function MetricCard({ label, value, sub, icon, accent = "default" }: MetricCardProps) {
  const accentStyles: Record<string, string> = {
    default: "text-[var(--color-primary)]",
    success: "text-[var(--color-success)]",
    warning: "text-[var(--color-warning)]",
    danger: "text-[var(--color-danger)]",
  };

  const iconBg: Record<string, string> = {
    default: "bg-blue-50 dark:bg-blue-950",
    success: "bg-green-50 dark:bg-green-950",
    warning: "bg-yellow-50 dark:bg-yellow-950",
    danger: "bg-red-50 dark:bg-red-950",
  };

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 flex items-start gap-4 transition-shadow hover:shadow-md">
      <div className={`rounded-lg p-2.5 ${iconBg[accent]} ${accentStyles[accent]} flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-1 uppercase tracking-wide">
          {label}
        </p>
        <p className={`text-2xl font-bold ${accentStyles[accent]}`}>{value}</p>
        {sub && (
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{sub}</p>
        )}
      </div>
    </div>
  );
}

interface StockBadgeProps {
  stockStatus: Product["stockStatus"];
  stock: number;
  isActive: boolean;
}

function StockBadge({ stockStatus, stock, isActive }: StockBadgeProps) {
  if (!isActive || stock === 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2.5 py-0.5 text-xs font-semibold">
        <XCircle size={11} />
        Indisponível
      </span>
    );
  }
  if (stockStatus === "low-stock") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2.5 py-0.5 text-xs font-semibold">
        <AlertTriangle size={11} />
        {stock} un.
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2.5 py-0.5 text-xs font-semibold">
      <CheckCircle size={11} />
      {stock} un.
    </span>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { allProducts } = useProducts();
  const navigate = useNavigate();

  // ── métricas gerais ──────────────────────────────────────────────────────
  const metrics = useMemo(() => {
    const total = allProducts.length;
    const active = allProducts.filter((p) => p.isActive && p.stock > 0).length;
    const lowStock = allProducts.filter((p) => p.stockStatus === "low-stock").length;
    const unavailable = allProducts.filter((p) => !p.isActive || p.stock === 0).length;
    const totalStockValue = allProducts.reduce(
      (acc, p) => acc + p.price * p.stock,
      0
    );
    return { total, active, lowStock, unavailable, totalStockValue };
  }, [allProducts]);

  // ── produtos por categoria ───────────────────────────────────────────────
  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    allProducts.forEach((p) => {
      map.set(p.category, (map.get(p.category) ?? 0) + 1);
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [allProducts]);

  const maxCategoryCount = byCategory[0]?.[1] ?? 1;

  // ── estoque baixo / sem estoque ──────────────────────────────────────────
  const criticalProducts = useMemo(
    () =>
      allProducts
        .filter((p) => p.stockStatus === "low-stock" || p.stock === 0 || !p.isActive)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 6),
    [allProducts]
  );

  // ── mais caro / mais barato ──────────────────────────────────────────────
  const sorted = useMemo(
    () => [...allProducts].sort((a, b) => a.price - b.price),
    [allProducts]
  );
  const cheapest = sorted.slice(0, 3);
  const priciest = sorted.slice(-3).reverse();

  // ── se não há produtos ───────────────────────────────────────────────────
  if (allProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-[var(--color-text-secondary)]">
        <BarChart2 size={48} strokeWidth={1.2} />
        <p className="text-lg font-medium">Nenhum produto cadastrado ainda</p>
        <button
          onClick={() => navigate("/")}
          className="mt-2 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Ir para o catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate("/")}
          aria-label="Voltar ao catálogo"
          className="p-2 rounded-lg hover:bg-[var(--color-border)] transition-colors text-[var(--color-text-secondary)]"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)]">
            Dashboard
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
            Visão geral do seu catálogo de produtos
          </p>
        </div>
      </div>

      {/* ── cards de métricas ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          label="Total de Produtos"
          value={metrics.total}
          sub={`${metrics.active} ativos`}
          icon={<Package size={20} />}
          accent="default"
        />
        <MetricCard
          label="Valor em Estoque"
          value={formatBRLShort(metrics.totalStockValue)}
          sub="soma de preço × estoque"
          icon={<DollarSign size={20} />}
          accent="success"
        />
        <MetricCard
          label="Estoque Baixo"
          value={metrics.lowStock}
          sub="menos de 10 unidades"
          icon={<AlertTriangle size={20} />}
          accent="warning"
        />
        <MetricCard
          label="Indisponíveis"
          value={metrics.unavailable}
          sub="inativos ou sem estoque"
          icon={<XCircle size={20} />}
          accent="danger"
        />
      </div>

      {/* ── linha 2: categoria + produtos críticos ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* produtos por categoria */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Tag size={16} className="text-[var(--color-primary)]" />
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
              Produtos por Categoria
            </h2>
          </div>

          {byCategory.length === 0 ? (
            <p className="text-sm text-[var(--color-text-secondary)]">Sem categorias.</p>
          ) : (
            <div className="space-y-3">
              {byCategory.map(([cat, count]) => (
                <div key={cat} className="flex items-center gap-3">
                  <span className="text-xs text-[var(--color-text-secondary)] w-28 flex-shrink-0 truncate">
                    {cat}
                  </span>
                  <div className="flex-1 h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500"
                      style={{ width: `${(count / maxCategoryCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-[var(--color-text-primary)] w-6 text-right">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* produtos críticos */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-[var(--color-warning)]" />
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
              Atenção ao Estoque
            </h2>
          </div>

          {criticalProducts.length === 0 ? (
            <p className="text-sm text-[var(--color-text-secondary)]">
              Tudo certo! Nenhum produto crítico.
            </p>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {criticalProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between py-2.5 gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                      {p.name}
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      {p.category}
                    </p>
                  </div>
                  <StockBadge
                    stockStatus={p.stockStatus}
                    stock={p.stock}
                    isActive={p.isActive}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── linha 3: mais caros / mais baratos ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* mais caros */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-[var(--color-success)]" />
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
              Produtos Mais Caros
            </h2>
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            {priciest.map((p, i) => (
              <div key={p.id} className="flex items-center justify-between py-2.5 gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-bold text-[var(--color-text-secondary)] w-4">
                    #{i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                      {p.name}
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)]">{p.category}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-[var(--color-success)] flex-shrink-0">
                  {formatBRL(p.price)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* mais baratos */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign size={16} className="text-[var(--color-text-secondary)]" />
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
              Produtos Mais Baratos
            </h2>
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            {cheapest.map((p, i) => (
              <div key={p.id} className="flex items-center justify-between py-2.5 gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-bold text-[var(--color-text-secondary)] w-4">
                    #{i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                      {p.name}
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)]">{p.category}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-[var(--color-text-secondary)] flex-shrink-0">
                  {formatBRL(p.price)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}