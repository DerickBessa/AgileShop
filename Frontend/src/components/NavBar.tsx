import { Link } from "react-router-dom";
import { ShoppingBag, Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-card)] border-b border-[var(--color-border)] shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-2.5 px-1 py-1 group hover:border-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center shadow-sm group-hover:opacity-90 transition-opacity">
            <ShoppingBag size={16} className="text-white" />
          </div>
          <span className="text-[var(--color-text-primary)] font-bold text-lg tracking-tight">
            Agile<span className="text-[var(--color-primary)]">Shop</span>
          </span>
        </Link>

        <button
          onClick={toggleTheme}
          aria-label="Alternar tema"
          className="w-9 h-9 rounded-lg flex items-center justify-center border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-primary)] transition-colors cursor-pointer"
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </button>

      </div>
    </header>
  );
};

export default Navbar;