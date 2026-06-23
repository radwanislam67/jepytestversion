import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import jepyLogo from "@/assets/jepy-logo.png.asset.json";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/work", label: "Work" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/case-studies", label: "Case Studies" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-6"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div
          className={`flex items-center justify-between rounded-full transition-all duration-500 ${
            scrolled ? "glass px-5 py-3" : "px-2 py-2"
          }`}
        >
          <Link to="/" aria-label="Jepy home" className="flex items-center">
            <img
              src={jepyLogo.url}
              alt="Jepy"
              className="h-7 md:h-8 w-auto select-none"
              draggable={false}
            />
          </Link>
          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="px-4 py-2 text-sm text-foreground/70 hover:text-foreground transition-colors relative group"
                activeProps={{ className: "px-4 py-2 text-sm text-foreground relative" }}
              >
                {n.label}
                <span className="pointer-events-none absolute inset-x-4 -bottom-0.5 h-px bg-[var(--accent)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/contact" className="hidden sm:inline-flex btn-primary text-sm">
              Book A Call
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden p-2 rounded-full border border-white/10"
              aria-label="Menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        {open && (
          <div className="lg:hidden mt-3 glass rounded-3xl p-4 flex flex-col">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="px-3 py-3 text-base text-foreground/80 hover:text-foreground"
              >
                {n.label}
              </Link>
            ))}
            <Link to="/contact" className="btn-primary mt-2 justify-center">
              Book A Call
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
