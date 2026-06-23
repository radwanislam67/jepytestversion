import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import jepyLogo from "@/assets/jepy-logo.png.asset.json";

const NAV = [
  { to: "/work", label: "Work" },
  { to: "/services", label: "Services" },
  { to: "/case-studies", label: "Case Studies" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div
          className="flex items-center justify-between rounded-full px-3 sm:px-5 py-2.5 sm:py-3"
          style={{
            background: "rgba(10,10,10,0.55)",
            backdropFilter: "blur(20px) saturate(160%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow:
              "0 10px 40px -10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          <Link to="/" aria-label="Jepy home" className="flex items-center shrink-0">
            <img
              src={jepyLogo.url}
              alt="Jepy"
              className="h-6 sm:h-7 md:h-8 w-auto select-none"
              draggable={false}
            />
          </Link>
          <nav className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto no-scrollbar">
            {NAV.map((n) => {
              const active = pathname === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className="relative px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-[13px] font-medium uppercase tracking-[0.14em] transition-colors duration-300 whitespace-nowrap group"
                  style={{
                    color: active ? "#ffffff" : "rgba(255,255,255,0.85)",
                    fontWeight: active ? 600 : 500,
                  }}
                >
                  {n.label}
                  <span
                    className={`pointer-events-none absolute left-2.5 right-2.5 sm:left-3.5 sm:right-3.5 -bottom-0.5 h-px bg-[var(--accent)] origin-left transition-transform duration-500 ${
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
