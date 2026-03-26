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
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Cell,
	} from "recharts";
import { useProducts } from "../context/ProductContext";
import type { Product } from "../types/product";



function formatBRL(value: number) {
	return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
	}

function formatBRLShort(value: number) {
	if (value >= 1_000_000) return `R$${(value / 1_000_000).toFixed(1)}M`;
	if (value >= 1_000) return `R$${(value / 1_000).toFixed(1)}k`;
	return formatBRL(value);
	}


const BAR_COLORS = [
	"#3B82F6",
	"#8B5CF6",
	"#10B981",
	"#F59E0B",
	"#EF4444",
	"#06B6D4",
	];


function CustomTooltip({ active, payload, label }: any) {
	if (!active || !payload?.length) return null;
	return (
		<div
		style={{
			background: "var(--color-card)",
			border: "1px solid var(--color-border)",
			borderRadius: 8,
			padding: "8px 12px",
			fontSize: 13,
		}}
		>
		<p style={{ color: "var(--color-text-secondary)", marginBottom: 2 }}>{label}</p>
		<p style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>
			{payload[0].value} produto{payload[0].value !== 1 ? "s" : ""}
		</p>
		</div>
	);
	}


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

	const iconBg: Record<string, React.CSSProperties> = {
		default: { backgroundColor: "color-mix(in srgb, var(--color-primary) 12%, transparent)" },
		success: { backgroundColor: "color-mix(in srgb, var(--color-success) 12%, transparent)" },
		warning: { backgroundColor: "color-mix(in srgb, var(--color-warning) 12%, transparent)" },
		danger:  { backgroundColor: "color-mix(in srgb, var(--color-danger)  12%, transparent)" },
	};

	return (
		<div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] transition-shadow hover:shadow-md flex items-center gap-3 px-4 py-3 sm:flex-col sm:items-start sm:p-5">
			{/* Mobile: ícone + valor na mesma linha */}
			<div className="flex items-center gap-3 flex-shrink-0">
				<div className={`rounded-lg p-2 flex-shrink-0 ${accentStyles[accent]}`} style={iconBg[accent]}>
					{icon}
				</div>
				<p className={`text-2xl font-bold leading-none sm:hidden ${accentStyles[accent]}`}>
					{value}
				</p>
			</div>

			{/* Label + sub (sempre visíveis) + valor (só desktop) */}
			<div className="min-w-0 flex-1">
				<p className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide leading-tight">
					{label}
				</p>
				<p className={`hidden sm:block text-2xl font-bold mt-1 ${accentStyles[accent]}`}>
					{value}
				</p>
				{sub && (
					<p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5 leading-tight">{sub}</p>
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
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap flex-shrink-0">
        <XCircle size={11} />
        Indisponível
      </span>
    );
  }
  if (stockStatus === "low-stock") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap flex-shrink-0">
        <AlertTriangle size={11} />
        {stock} un.
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap flex-shrink-0">
      <CheckCircle size={11} />
      {stock} un.
    </span>
  );
}



export default function DashboardPage() {
	const { allProducts } = useProducts();
	const navigate = useNavigate();

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


const byCategory = useMemo(() => {
		const map = new Map<string, number>();
		allProducts.forEach((p) => {
		map.set(p.category, (map.get(p.category) ?? 0) + 1);
		});
		return Array.from(map.entries())
		.sort((a, b) => b[1] - a[1])
		.slice(0, 6)
		.map(([name, total]) => ({ name, total }));
	}, [allProducts]);

const criticalProducts = useMemo(
		() =>
		allProducts
			.filter((p) => p.stockStatus === "low-stock" || p.stock === 0 || !p.isActive)
			.sort((a, b) => a.stock - b.stock)
			.slice(0, 6),
		[allProducts]
	);

const sorted = useMemo(
		() => [...allProducts].sort((a, b) => a.price - b.price),
		[allProducts]
	);
const cheapest = sorted.slice(0, 3);
const priciest = sorted.slice(-3).reverse();


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

		<div className="flex items-center gap-3 mb-6">
			<button
			onClick={() => navigate("/")}
			aria-label="Voltar ao catálogo"
			className="p-2 rounded-lg hover:bg-[var(--color-border)] transition-colors text-[var(--color-text-secondary)]"
			>
			<ArrowLeft size={18} />
			</button>
			<div>
			<h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text-primary)]">
				Dashboard
			</h1>
			<p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
				Visão geral do seu catálogo de produtos
			</p>
			</div>
		</div>

		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
			<MetricCard
			label="Total de Produtos"
			value={metrics.total}
			sub={`${metrics.active} ativos`}
			icon={<Package size={18} />}
			accent="default"
			/>
			<MetricCard
			label="Valor em Estoque"
			value={formatBRLShort(metrics.totalStockValue)}
			sub="preço × estoque"
			icon={<DollarSign size={18} />}
			accent="success"
			/>
			<MetricCard
			label="Estoque Baixo"
			value={metrics.lowStock}
			sub="menos de 10 un."
			icon={<AlertTriangle size={18} />}
			accent="warning"
			/>
			<MetricCard
			label="Indisponíveis"
			value={metrics.unavailable}
			sub="inativos ou sem estoque"
			icon={<XCircle size={18} />}
			accent="danger"
			/>
		</div>


		<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

			<div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
			<div className="flex items-center gap-2 mb-4">
				<Tag size={16} className="text-[var(--color-primary)]" />
				<h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
				Produtos por Categoria
				</h2>
			</div>

			{byCategory.length === 0 ? (
				<p className="text-sm text-[var(--color-text-secondary)]">Sem categorias.</p>
			) : (
				<ResponsiveContainer width="100%" height={200}>
				<BarChart
					data={byCategory}
					margin={{ top: 4, right: 8, left: -20, bottom: 4 }}
					barCategoryGap="30%"
				>
					<CartesianGrid
					strokeDasharray="3 3"
					stroke="var(--color-border)"
					vertical={false}
					/>
					<XAxis
					dataKey="name"
					tick={{ fontSize: 10, fill: "var(--color-text-secondary)" }}
					axisLine={false}
					tickLine={false}
					/>
					<YAxis
					allowDecimals={false}
					tick={{ fontSize: 10, fill: "var(--color-text-secondary)" }}
					axisLine={false}
					tickLine={false}
					/>
					<Tooltip
					content={<CustomTooltip />}
					cursor={{ fill: "var(--color-border)", opacity: 0.4 }}
					/>
					<Bar dataKey="total" radius={[6, 6, 0, 0]}>
					{byCategory.map((_, index) => (
						<Cell
						key={index}
						fill={BAR_COLORS[index % BAR_COLORS.length]}
						/>
					))}
					</Bar>
				</BarChart>
				</ResponsiveContainer>
			)}
			</div>


			<div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
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


		<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

			<div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
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
					<span className="text-xs font-bold text-[var(--color-text-secondary)] w-4 flex-shrink-0">
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


			<div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
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
					<span className="text-xs font-bold text-[var(--color-text-secondary)] w-4 flex-shrink-0">
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