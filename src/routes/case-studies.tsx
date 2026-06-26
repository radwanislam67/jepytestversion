import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Play } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/case-studies")({
  head: () => ({
    meta: [
      { title: "Case Studies — Jepy" },
      { name: "description", content: "Deep dives into recent Jepy projects: challenge, strategy, process, and final results." },
      { property: "og:title", content: "Case Studies — Jepy" },
      { property: "og:description", content: "Process and results behind recent projects." },
      { property: "og:url", content: "/case-studies" },
    ],
    links: [{ rel: "canonical", href: "/case-studies" }],
  }),
  component: CaseStudies,
});

const CASES = [
  {
    client: "Northwave",
    industry: "SaaS · Series B",
    challenge: "Launch a category-defining brand film in 4 weeks.",
    strategy: "Documentary-style interviews stitched with product cinematics.",
    process: "Treatment → 3-day shoot → assembly → color → motion polish.",
    style: "Cinematic, grounded, warm grade.",
    motion: "Subtle kinetic typography on product moments.",
    result: "+312% homepage conversion, 4.1M earned views.",
    metrics: [["Views", "4.1M"], ["Watch-through", "62%"], ["Conv. lift", "+312%"]],
    quote: "It set the visual standard for our entire brand.",
    quoteBy: "Amelia Reyes, Head of Brand",
    hue: 145,
  },
  {
    client: "Lumen Labs",
    industry: "Consumer Hardware",
    challenge: "Reveal a product without showing it for 40 seconds.",
    strategy: "Motion-led teaser building tension to a single, restrained reveal.",
    process: "Storyboarding → 3D motion → live-action plate → grade.",
    style: "High-contrast cinema, low-saturation grade with neon punch.",
    motion: "Custom typography choreography, 12 unique transitions.",
    result: "Sold out first drop in 9 minutes.",
    metrics: [["Pre-orders", "11.4K"], ["CTR", "8.6%"], ["Time to sell-out", "9m"]],
    quote: "Their work doesn't just sell the product — it makes the brand.",
    quoteBy: "Hiroshi Tanaka, Founder",
    hue: 95,
  },
  {
    client: "Octave Studios",
    industry: "Creator · 1.2M subs",
    challenge: "Rebuild watch-time on a docu-series losing 38% in the first 90s.",
    strategy: "Re-pace cold opens, redesign chapter structure, lift sound design.",
    process: "Audit → re-cut episodes 1–3 → roll changes into new production.",
    style: "Editorial, intimate, character-forward.",
    motion: "Restrained chapter cards and timeline graphics.",
    result: "Average watch-time +47% across the series.",
    metrics: [["AVD lift", "+47%"], ["Subs/ep", "+2.3K"], ["CTR", "11.2%"]],
    quote: "Every cut has intent. Our retention curves changed in a week.",
    quoteBy: "Priya Sharma, Creative Director",
    hue: 175,
  },
];

function CaseStudies() {
  return (
    <div className="pt-32 md:pt-36 pb-16 md:pb-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">Case Studies</div>
        <Reveal>
          <h1 className="font-display text-6xl md:text-[8rem] leading-[0.95] tracking-tighter">
            The work,<br /><span className="text-[var(--accent)] text-glow">in depth.</span>
          </h1>
        </Reveal>

        <div className="mt-24 space-y-32">
          {CASES.map((c, i) => (
            <article key={c.client} id={c.client.toLowerCase()} className="scroll-mt-32">
              <Reveal>
                <div className="grid md:grid-cols-[1fr_1.4fr] gap-10 items-start">
                  <div>
                    <div className="font-mono text-xs text-[var(--accent)]">CASE {String(i + 1).padStart(2, "0")} / {String(CASES.length).padStart(2, "0")}</div>
                    <h2 className="mt-3 font-display text-5xl md:text-6xl tracking-tighter">{c.client}</h2>
                    <div className="mt-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">{c.industry}</div>
                  </div>
                  <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-white/5">
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `radial-gradient(120% 80% at 30% 30%, hsl(${c.hue} 80% 55% / 0.55), transparent 60%), radial-gradient(80% 60% at 80% 70%, hsl(${(c.hue + 40) % 360} 70% 50% / 0.45), transparent 60%), #0a0a0a`,
                      }}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(0,0,0,0.7)_100%)]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-16 w-16 rounded-full glass flex items-center justify-center glow-ring">
                        <Play size={22} className="text-[var(--accent)]" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              <div className="mt-12 grid md:grid-cols-3 gap-10">
                {[
                  ["Challenge", c.challenge],
                  ["Strategy", c.strategy],
                  ["Process", c.process],
                  ["Editing Style", c.style],
                  ["Motion Graphics", c.motion],
                  ["Final Result", c.result],
                ].map(([t, d]) => (
                  <Reveal key={t}>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-2">{t}</div>
                      <div className="text-foreground/85">{d}</div>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal>
                <div className="mt-12 grid grid-cols-3 gap-4">
                  {c.metrics.map(([k, v]) => (
                    <div key={k} className="rounded-2xl border border-white/5 bg-[var(--surface)] p-6">
                      <div className="font-display text-3xl md:text-5xl tracking-tighter text-glow">{v}</div>
                      <div className="mt-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{k}</div>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal>
                <figure className="mt-12 glass rounded-3xl p-8 md:p-12 max-w-3xl">
                  <div className="text-[var(--accent)] font-display text-4xl leading-none">&ldquo;</div>
                  <blockquote className="mt-2 text-xl md:text-2xl font-display tracking-tight leading-snug">{c.quote}</blockquote>
                  <figcaption className="mt-4 text-sm text-muted-foreground">{c.quoteBy}</figcaption>
                </figure>
              </Reveal>

              {i < CASES.length - 1 && (
                <div className="mt-20 border-t border-white/5 pt-8 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Next</span>
                  <a href={`#${CASES[i + 1].client.toLowerCase()}`} className="inline-flex items-center gap-2 font-display text-2xl md:text-3xl hover:text-[var(--accent)] transition-colors">
                    {CASES[i + 1].client} <ArrowUpRight size={20} />
                  </a>
                </div>
              )}
            </article>
          ))}
        </div>

        <div className="mt-32 text-center">
          <Link to="/contact" className="btn-primary">Start your project <ArrowUpRight size={16} /></Link>
        </div>
      </div>
    </div>
  );
}
