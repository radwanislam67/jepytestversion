import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Film, Wand2, Palette, Smartphone, Youtube, Megaphone } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Jepy" },
      { name: "description", content: "Cinematic post-production services: editing, motion graphics, color, short-form, long-form and commercial work." },
      { property: "og:title", content: "Services — Jepy" },
      { property: "og:description", content: "Cinematic post-production services." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: Services,
});

const SERVICES = [
  {
    icon: Film,
    title: "Video Editing",
    desc: "Story-first edits with cinematic pacing — for films, ads and content of any length.",
    benefits: ["Narrative editing", "Sound design", "Music selection"],
    deliverables: ["Master edit", "Platform cuts", "Project files"],
    timeline: "1–3 weeks",
  },
  {
    icon: Wand2,
    title: "Motion Graphics",
    desc: "Kinetic typography, animated UI, lower-thirds and product reveals that move with intent.",
    benefits: ["Custom typography", "2D/3D animation", "Brand-true motion"],
    deliverables: ["Animated sequences", "Templates", "Source files"],
    timeline: "1–4 weeks",
  },
  {
    icon: Palette,
    title: "Color Grading",
    desc: "Cinematic looks, LUTs and shot-matching to give every frame an emotional temperature.",
    benefits: ["Primary & secondary grade", "Shot match", "Custom LUTs"],
    deliverables: ["Graded master", "LUT package", "Reference stills"],
    timeline: "3–7 days",
  },
  {
    icon: Smartphone,
    title: "Short-form Reels",
    desc: "TikTok, Reels and Shorts engineered for retention — captions, hooks, momentum.",
    benefits: ["Hook-first edits", "Captioning", "Trend-aware"],
    deliverables: ["Vertical cuts", "Captions", "Hook variants"],
    timeline: "Weekly cadence",
  },
  {
    icon: Youtube,
    title: "Long-form YouTube",
    desc: "Documentary-grade edits for founders, creators and educational series.",
    benefits: ["Retention pacing", "B-roll curation", "Chapter design"],
    deliverables: ["Final episode", "Thumbnails (assist)", "Promo cuts"],
    timeline: "1–2 weeks/ep",
  },
  {
    icon: Megaphone,
    title: "Commercial Ads",
    desc: "Brand films, product spots and performance creative built to perform and look luxurious.",
    benefits: ["Multiple ratios", "A/B variants", "Performance-aware"],
    deliverables: ["Hero spot", "Cutdowns", "Static frames"],
    timeline: "2–4 weeks",
  },
];

function Services() {
  return (
    <div className="pt-40 pb-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">Services</div>
        <Reveal>
          <h1 className="font-display text-6xl md:text-[8rem] leading-[0.95] tracking-tighter">
            Crafted, <span className="text-[var(--accent)] text-glow">not assembled.</span>
          </h1>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-8 max-w-xl text-foreground/70">
            A focused suite of post-production services. Choose one — or compose a workflow that runs end-to-end.
          </p>
        </Reveal>

        <div className="mt-20 grid md:grid-cols-2 gap-5">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.title} delay={(i % 2) * 80}>
                <article className="group relative rounded-3xl border border-white/5 bg-[var(--surface)] p-8 md:p-10 h-full overflow-hidden transition-all duration-500 hover:border-[var(--accent)]/30">
                  <div
                    className="pointer-events-none absolute -top-32 -right-32 h-72 w-72 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{ background: "radial-gradient(circle, var(--accent), transparent 60%)", filter: "blur(60px)" }}
                  />
                  <div className="relative">
                    <div className="flex items-start justify-between">
                      <div className="h-12 w-12 rounded-2xl glass flex items-center justify-center text-[var(--accent)]">
                        <Icon size={22} />
                      </div>
                      <div className="font-mono text-xs text-muted-foreground">0{i + 1}</div>
                    </div>
                    <h3 className="mt-8 font-display text-3xl md:text-4xl tracking-tight">{s.title}</h3>
                    <p className="mt-3 text-foreground/70">{s.desc}</p>

                    <div className="mt-8 grid grid-cols-2 gap-6 text-sm">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">Benefits</div>
                        <ul className="space-y-1 text-foreground/80">{s.benefits.map((b) => <li key={b}>— {b}</li>)}</ul>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">Deliverables</div>
                        <ul className="space-y-1 text-foreground/80">{s.deliverables.map((b) => <li key={b}>— {b}</li>)}</ul>
                      </div>
                    </div>
                    <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-5">
                      <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Timeline · <span className="text-foreground/80">{s.timeline}</span></div>
                      <Link to="/contact" className="inline-flex items-center gap-1 text-sm text-foreground/80 hover:text-[var(--accent)] transition-colors">
                        Start <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}
