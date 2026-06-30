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
      <section className="relative pt-32 md:pt-36 pb-16 md:pb-20">
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
                    "rounded-full px-4 py-1.5 text-sm transition-all duration-200 " +
                    (isActive
                      ? "bg-green-500/10 text-green-400 border border-green-500/30"
                      : "text-gray-500 border border-gray-700 hover:text-gray-300 hover:border-gray-500")
                  }
                >
                  {f}
                </button>
              );
            })}
          </div>

          <div className="rounded-3xl border border-gray-700/40 bg-gray-900/20 p-6 transition-opacity duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((w, i) => (
                <Reveal key={w.id} delay={i * 80}>
                  <div
                    className="group relative block w-full text-left overflow-hidden"
                    style={{
                      background: "#171717",
                      border: "1px solid #222222",
                      borderRadius: "12px",
                    }}
                  >
                    <div className="relative aspect-video flex flex-col items-center justify-center gap-3">
                      <span className="absolute top-3 left-3 z-10 text-xs uppercase tracking-[0.15em] px-2 py-1 rounded-full border border-green-500/40 text-green-400 bg-black/60 backdrop-blur-sm">
                        {w.category}
                      </span>
                      <Play size={36} style={{ color: "#39ff14" }} fill="#39ff14" />
                      <div className="text-xs text-gray-500">Video coming soon</div>
                    </div>
                    <div className="p-4">
                      <div className="text-base font-medium text-white">{w.title}</div>
                      <div className="text-sm text-gray-400 mt-1 line-clamp-1">{w.subtitle}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Reveal delay={100}>
        <p className="text-center text-gray-500 text-sm py-12">
          <span className="text-green-500 mr-2">✦</span>
          Trusted by 50+ creators, brands and SaaS teams worldwide.
        </p>
      </Reveal>
      <CTASection />
    </>
  );
}
