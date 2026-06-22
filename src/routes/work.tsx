import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Work — Jepy" },
      { name: "description", content: "Selected post-production work: cinematic edits, motion graphics, color grading, short-form and long-form video." },
      { property: "og:title", content: "Work — Jepy" },
      { property: "og:description", content: "Selected cinematic post-production work." },
      { property: "og:url", content: "/work" },
    ],
    links: [{ rel: "canonical", href: "/work" }],
  }),
  component: WorkPage,
});

const CATEGORIES = [
  "All",
  "Video Editing",
  "Motion Graphics",
  "Short-form Reels",
  "Long-form YouTube",
  "Commercial Ads",
  "Color Grading",
] as const;

type Cat = typeof CATEGORIES[number];

const ITEMS: { title: string; category: Exclude<Cat, "All">; desc: string; hue: number }[] = [
  { title: "Northwave Anthem", category: "Commercial Ads", desc: "60s brand film for a Series-B launch.", hue: 145 },
  { title: "Lumen Drop", category: "Motion Graphics", desc: "Kinetic typography product reveal.", hue: 95 },
  { title: "Octave Docu Ep.04", category: "Long-form YouTube", desc: "Docu-series edited for retention.", hue: 175 },
  { title: "Strata Sprint", category: "Short-form Reels", desc: "30-day short-form sprint.", hue: 65 },
  { title: "Halcyon Teaser", category: "Video Editing", desc: "Cinematic teaser for a film festival.", hue: 200 },
  { title: "Forma Look-dev", category: "Color Grading", desc: "LUTs and grade for a fashion campaign.", hue: 35 },
  { title: "Vanta Reel", category: "Motion Graphics", desc: "Pitch reel with custom typography.", hue: 280 },
  { title: "Meridian Series", category: "Long-form YouTube", desc: "8-episode founder interview series.", hue: 220 },
  { title: "Atelier 01", category: "Commercial Ads", desc: "Product hero spot, 15s and 30s cuts.", hue: 120 },
];

function WorkPage() {
  const [cat, setCat] = useState<Cat>("All");
  const filtered = cat === "All" ? ITEMS : ITEMS.filter((i) => i.category === cat);
  return (
    <div className="pt-40 pb-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">Portfolio</div>
        <Reveal>
          <h1 className="font-display text-6xl md:text-[8rem] leading-[0.95] tracking-tighter">
            Selected<br /><span className="text-[var(--accent)] text-glow">work.</span>
          </h1>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-8 max-w-xl text-foreground/70">
            A cross-section of edits, motion and color for SaaS, creators and brands.
          </p>
        </Reveal>

        <div className="mt-16 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.2em] border transition-all ${
                cat === c
                  ? "bg-[var(--accent)] text-[var(--accent-foreground)] border-transparent"
                  : "border-white/10 text-foreground/70 hover:border-[var(--accent)]/60 hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p, i) => (
            <Reveal key={p.title} delay={(i % 6) * 60}>
              <Link to="/case-studies" className="group block rounded-3xl overflow-hidden border border-white/5">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <div
                    className="absolute inset-0 transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                    style={{
                      background: `radial-gradient(120% 80% at 30% 30%, hsl(${p.hue} 80% 55% / 0.55), transparent 60%), radial-gradient(80% 60% at 80% 70%, hsl(${(p.hue + 40) % 360} 70% 50% / 0.45), transparent 60%), #0a0a0a`,
                    }}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(0,0,0,0.85)_100%)]" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="h-14 w-14 rounded-full glass flex items-center justify-center glow-ring">
                      <Play size={18} className="text-[var(--accent)]" fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute left-5 bottom-5 right-5">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)]">{p.category}</div>
                    <div className="mt-1 font-display text-2xl tracking-tight">{p.title}</div>
                    <div className="mt-1 text-sm text-white/60 line-clamp-1">{p.desc}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between px-5 py-4 bg-[var(--surface)]">
                  <span className="text-xs text-muted-foreground">Case study</span>
                  <ArrowUpRight size={16} className="text-foreground/70 group-hover:text-[var(--accent)] transition-colors" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
