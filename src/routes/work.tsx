import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Play } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Stats } from "@/components/site/Stats";
import { CTASection } from "@/components/site/CTASection";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Work | Jepy" },
      { name: "description", content: "Selected edits, films and motion work from the Jepy studio." },
      { property: "og:title", content: "Work | Jepy" },
      { property: "og:description", content: "Every frame tells a story." },
    ],
  }),
  component: WorkPage,
});

const ITEMS = [
  { id: "w1", title: "Northwave — Brand Film", subtitle: "Cinematic brand story for a premium lifestyle label.", category: "Commercial" },
  { id: "w2", title: "Lumen — Product Reel", subtitle: "High-energy product showcase with motion graphics.", category: "Motion Design" },
  { id: "w3", title: "Octave — Creator Series", subtitle: "Long-form series edited for retention.", category: "Long Form" },
  { id: "w4", title: "Strata — Shorts Sprint", subtitle: "Scroll-stopping short form content for social.", category: "Short Form" },
  { id: "w5", title: "Halcyon — Launch Film", subtitle: "Product launch film built for maximum impact.", category: "Commercial" },
  { id: "w6", title: "Pixelrun — Promo", subtitle: "Motion-led promo crafted for brand awareness.", category: "Motion Design" },
];

const FILTERS = ["All", "Commercial", "Motion Design", "Long Form", "Short Form"] as const;

function WorkPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const visible = useMemo(
    () => (filter === "All" ? ITEMS : ITEMS.filter((i) => i.category === filter)),
    [filter],
  );

  return (
    <>
      <section className="relative pt-32 md:pt-36 pb-16 md:pb-20 section-light">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <h1 className="font-display text-6xl md:text-8xl tracking-tighter text-center">
              Our <span className="text-[var(--accent)] text-glow">Work</span>
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-5 text-foreground/70 text-lg text-center">Every frame tells a story.</p>
          </Reveal>

          <div className="mt-8">
            <Stats />
          </div>

          <div className="mt-4 mb-8 flex flex-wrap gap-3 justify-center">
            {FILTERS.map((f) => {
              const isActive = f === filter;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={
                    "rounded-full px-4 py-1.5 text-sm transition-all duration-200 border " +
                    (isActive
                      ? "bg-[rgba(48,217,75,.12)] text-[#d8ffdf] border-[rgba(48,217,75,.35)]"
                      : "text-foreground/55 border-white/10 hover:text-foreground hover:border-white/30")
                  }
                >
                  {f}
                </button>
              );
            })}
          </div>

          <div className="rounded-3xl border border-white/10 bg-[rgba(255,255,255,.02)] p-6 transition-opacity duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((w, i) => (
                <Reveal key={w.id} delay={i * 80}>
                  <div
                    className="group relative block w-full text-left overflow-hidden transition-all duration-200"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.015))",
                      border: "1px solid rgba(255,255,255,.1)",
                      borderRadius: "12px",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,.06), 0 30px 60px -30px rgba(0,0,0,.8)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.borderColor = "rgba(48,217,75,.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,.1)";
                    }}
                  >
                    <div className="relative aspect-video flex flex-col items-center justify-center gap-3">
                      <span className="absolute top-3 left-3 z-10 text-xs uppercase tracking-[0.15em] px-2 py-1 rounded-full border border-[rgba(48,217,75,.35)] text-[#d8ffdf] bg-[rgba(20,20,20,.55)] backdrop-blur-sm">
                        {w.category}
                      </span>
                      <Play size={36} style={{ color: "#30d94b" }} fill="#30d94b" />
                      <div className="text-xs text-foreground/45">Video coming soon</div>
                    </div>
                    <div className="p-4">
                      <div className="text-base font-medium text-white">{w.title}</div>
                      <div className="text-sm text-[#a3a3a3] mt-1 line-clamp-1">{w.subtitle}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Reveal delay={100}>
        <p className="text-center text-foreground/55 text-sm py-12">
          <span className="text-[#30d94b] mr-2">✦</span>
          Trusted by 50+ creators, brands and SaaS teams worldwide.
        </p>
      </Reveal>
      <CTASection />
    </>
  );
}
