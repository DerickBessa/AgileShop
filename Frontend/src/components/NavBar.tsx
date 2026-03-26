import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, Search, X } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { useProducts } from "../context/ProductContext";

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { allProducts, query, setQuery } = useProducts();

  const [inputValue, setInputValue] = useState(query.name ?? "");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (!query.name) setInputValue("");
  }, [query.name]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const term = inputValue.trim().toLowerCase();

  const suggestions = term.length >= 1
    ? allProducts
        .filter(p => p.name.toLowerCase().includes(term))
        .slice(0, 6)
    : [];

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setInputValue(val);
    setQuery({ ...query, name: val || undefined });
    setOpen(true);
  }

  function handleSelect(name: string) {
    setInputValue(name);
    setQuery({ ...query, name });
    setOpen(false);
  }

  function handleClear() {
    setInputValue("");
    setQuery({ ...query, name: undefined });
    setOpen(false);
  }


  function renderHighlight(name: string) {
    if (!term) return <span>{name}</span>;
    const idx = name.toLowerCase().indexOf(term);
    if (idx === -1) return <span>{name}</span>;
    return (
      <>
        <span className="text-[var(--color-text-primary)]">{name.slice(0, idx)}</span>
        <span className="text-[var(--color-primary)] font-semibold">{name.slice(idx, idx + term.length)}</span>
        <span className="text-[var(--color-text-primary)]">{name.slice(idx + term.length)}</span>
      </>
    );
  }

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-card)] border-b border-[var(--color-border)] shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-4">


        <Link to="/" className="flex items-center flex-shrink-0 group">

          <img
            src="/assets/logo_icon.png"
            alt="AgileShop"
            className="block sm:hidden h-12 w-auto group-hover:opacity-80 transition-opacity border-4 border-[var(--color-border)] rounded-xl hover:border-white/30 hover:shadow-md hover:-translate-y-0.5
        transition-all"
          />

          <img
            src="/assets/logo.png"
            alt="AgileShop"
            className="hidden sm:block h-auto w-[140px] group-hover:opacity-80 transition-opacity hover:border-[var(--color-border)] hover:border-2 hover:rounded-xl"
          />
        </Link>


        <div ref={containerRef} className="relative flex-1 max-w-xl mx-auto">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none z-10"
          />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={inputValue}
            onChange={handleChange}
            onFocus={() => term.length >= 1 && setOpen(true)}
            className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-primary)]
              rounded-lg pl-9 pr-8 py-2 text-sm outline-none
              focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]
              transition-shadow placeholder:text-[var(--color-text-secondary)]"
          />
          {inputValue && (
            <button
              onClick={handleClear}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          )}


          {open && suggestions.length > 0 && (
            <ul className="absolute top-full left-0 right-0 mt-1.5 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl shadow-lg overflow-hidden z-50">
              {suggestions.map(product => (
                <li key={product.id}>
                  <button
                    onMouseDown={() => handleSelect(product.name)}
                    className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3
                      hover:bg-[var(--color-primary)]/8 transition-colors cursor-pointer"
                  >
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-7 h-7 rounded-md object-cover flex-shrink-0 opacity-80"
                      />
                    )}
                    <span>{renderHighlight(product.name)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>


        <button
          onClick={toggleTheme}
          aria-label="Alternar tema"
          className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-primary)] transition-colors cursor-pointer"
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </button>

      </div>
    </header>
  );
};

export default Navbar;