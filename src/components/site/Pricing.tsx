import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

const TIERS = [
  {
    name: "Basic",
    price: "Starting at $X",
    features: ["1 edited video", "Up to 60 seconds", "Color & sound polish", "2 revisions"],
    highlighted: false,
    cta: "Ship My First Video →",
  },
  {
    name: "Standard",
    price: "Starting at $XX",
    features: ["4 edited videos / mo", "Up to 3 minutes each", "Motion graphics", "Unlimited revisions", "Priority delivery"],
    highlighted: true,
    cta: "Scale My Content →",
  },
  {
    name: "Premium",
    price: "Starting at $XXX",
    features: ["Full retainer", "Long & short form", "Custom motion design", "Dedicated editor", "24h turnaround"],
    highlighted: false,
    cta: "Go Full Retainer →",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-32 md:py-40 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="text-center mb-16">
          <Reveal>
            <h2 className="font-display text-5xl md:text-7xl tracking-tighter">
              <span className="text-[var(--accent)] text-glow">Pricing</span>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-5 text-foreground/70">Transparent pricing. Flexible for every budget.</p>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TIERS.map((t, i) => (
            <Reveal key={t.name} delay={i * 100}>
              <div
                className={`relative h-full rounded-3xl p-8 flex flex-col transition-all duration-200 ${
                  t.highlighted
                    ? "border-2 border-[var(--accent)] -translate-y-3 py-10"
                    : "border border-white/10 hover:border-white/25"
                }`}
                style={{
                  background: t.highlighted
                    ? "linear-gradient(180deg, rgba(83,255,47,0.06), rgba(11,11,11,0.8))"
                    : "rgba(11,11,11,0.6)",
                  boxShadow: t.highlighted
                    ? "0 0 60px -10px rgba(83,255,47,0.35)"
                    : undefined,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = t.highlighted
                    ? "0 0 60px -8px rgba(83,255,47,0.5)"
                    : "0 0 28px -4px rgba(83,255,47,0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = t.highlighted
                    ? "0 0 60px -10px rgba(83,255,47,0.35)"
                    : "";
                }}
              >
                {t.highlighted && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] font-semibold"
                    style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
                  >
                    Most Popular
                  </div>
                )}
                <div className="text-xs uppercase tracking-[0.3em] text-foreground/60">{t.name}</div>
                <div className="mt-3 font-display text-3xl md:text-4xl tracking-tight">{t.price}</div>
                <ul className="mt-6 space-y-3 text-sm text-foreground/85 flex-1">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check size={16} className="mt-0.5 text-[var(--accent)] shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] whitespace-nowrap transition-transform duration-200 hover:scale-[1.03] ${
                    t.highlighted ? "" : "border border-white/15"
                  }`}
                  style={
                    t.highlighted
                      ? { background: "var(--accent)", color: "var(--accent-foreground)" }
                      : { color: "#fff" }
                  }
                >
                  {t.cta}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div
            className="mt-20 pt-10 flex flex-col items-center gap-6"
            style={{ borderTop: "1px solid color-mix(in oklab, var(--accent) 55%, transparent)" }}
          >
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]"
              style={{
                background: "var(--accent)",
                color: "var(--accent-foreground)",
                animation: "budget-pulse 2.8s ease-in-out infinite",
              }}
            >
              ✦ Smaller Budget? We Got You
            </span>
            <p className="font-display text-2xl md:text-3xl tracking-tight text-center flex flex-wrap items-center justify-center gap-x-3 gap-y-3">
              <span className="text-white">Start small.</span>
              <span className="text-[var(--accent)] text-glow">Look expensive.</span>
              <span
                aria-hidden
                className="text-[var(--accent)] inline-block"
                style={{ animation: "arrow-slide 1.6s ease-in-out infinite" }}
              >
                →
              </span>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.16em] whitespace-nowrap transition-colors duration-200 align-middle"
                style={{
                  border: "1px solid var(--accent)",
                  color: "var(--accent)",
                  background: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "color-mix(in oklab, var(--accent) 12%, transparent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Tell Yours
              </Link>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
