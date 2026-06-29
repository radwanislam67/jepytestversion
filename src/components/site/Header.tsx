import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import jepyLogo from "@/assets/jepy-logo.png";

const SECTIONS = [
  { to: "/services", section: "services", label: "Services" },
  { to: "/work", section: "work", label: "Work" },
  { to: "/pricing", section: "pricing", label: "Pricing" },
  { to: "/about", section: "about", label: "About" },
] as const;

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (e: React.MouseEvent, section: string, to: string) => {
    e.preventDefault();
    setOpen(false);
    if (pathname === "/") {
      scrollToSection(section);
    } else if (to === "/pricing" && section === "pricing") {
      // Pricing has both a section and a dedicated page — prefer dedicated page
      navigate({ to: "/pricing" });
    } else {
      navigate({ to });
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}
      >
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div
            className="flex items-center justify-between rounded-full pl-4 pr-2 sm:pl-6 sm:pr-3 py-2.5 sm:py-3"
            style={{
              background: "rgba(10,10,10,0.65)",
              backdropFilter: "blur(20px) saturate(160%)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 10px 40px -10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            <Link
              to="/"
              aria-label="Jepy home"
              className="flex items-center shrink-0"
              onClick={(e) => {
                if (pathname === "/") {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            >
              <img
                src={jepyLogo}
                alt="Jepy"
                className="h-6 sm:h-7 md:h-8 w-auto select-none"
                draggable={false}
              />
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {SECTIONS.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className="relative px-3.5 py-2 text-[12px] uppercase tracking-[0.14em] whitespace-nowrap transition-colors duration-300 hover:text-[var(--accent)]"
                  style={{ color: "rgba(255,255,255,0.85)", fontWeight: 500 }}
                >
                  {n.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:block">
              <Link
                to="/contact"
                className="inline-flex items-center rounded-full px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.16em] transition-transform duration-300 hover:scale-[1.03]"
                style={{
                  background: "var(--accent)",
                  color: "var(--accent-foreground)",
                  boxShadow: "0 8px 30px -8px color-mix(in oklab, var(--accent) 70%, transparent)",
                }}
              >
                Get Started
              </Link>
            </div>

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full text-white"
              style={{ color: open ? "var(--accent)" : "#ffffff" }}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <div
        className="fixed inset-0 z-40 md:hidden transition-opacity duration-500"
        style={{
          background: "#0a0a0a",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
        aria-hidden={!open}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="absolute top-5 right-6 inline-flex h-10 w-10 items-center justify-center rounded-full"
          style={{ color: "var(--accent)" }}
        >
          <X size={22} />
        </button>
        <nav className="flex h-full flex-col items-center justify-center gap-8 px-6">
          {SECTIONS.map((n, i) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="text-2xl uppercase tracking-[0.18em] text-white transition-colors hover:text-[var(--accent)]"
              style={{
                fontWeight: 500,
                transform: open ? "translateY(0)" : "translateY(12px)",
                opacity: open ? 1 : 0,
                transition: `opacity 500ms ease ${i * 60}ms, transform 500ms ease ${i * 60}ms, color 200ms ease`,
              }}
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center rounded-full px-7 py-3 text-sm font-semibold uppercase tracking-[0.16em]"
            style={{
              background: "var(--accent)",
              color: "var(--accent-foreground)",
              boxShadow: "0 10px 40px -10px color-mix(in oklab, var(--accent) 70%, transparent)",
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(12px)",
              transition: `opacity 500ms ease ${SECTIONS.length * 60}ms, transform 500ms ease ${SECTIONS.length * 60}ms`,
            }}
          >
            Get Started
          </Link>
        </nav>
      </div>
    </>
  );
}
