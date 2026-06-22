import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Play } from "lucide-react";
import { Particles } from "@/components/site/Particles";
import { Reveal } from "@/components/site/Reveal";
import { Counter } from "@/components/site/Counter";
import { Marquee } from "@/components/site/Marquee";
import { Magnetic } from "@/components/site/Magnetic";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jepy — Your Content, Elevated." },
      { name: "description", content: "Cinematic edits, motion design and color for creators, brands and SaaS that demand attention." },
      { property: "og:title", content: "Jepy — Your Content, Elevated." },
      { property: "og:description", content: "Cinematic post-production for creators, brands and SaaS." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const FLOATING = ["VIDEO EDITING", "MOTION DESIGN", "COMMERCIAL ADS", "SHORT FORM", "YOUTUBE EDITING", "COLOR GRADING"];

const PROJECTS = [
  { id: "01", title: "Northwave — Brand Film", category: "Commercial Ads", desc: "A 60-second cinematic anthem for a Series-B SaaS launch.", hue: 145 },
  { id: "02", title: "Lumen — Product Reel", category: "Motion Graphics", desc: "Kinetic typography and product reveal for a hardware drop.", hue: 95 },
  { id: "03", title: "Octave — Creator Series", category: "Long-form YouTube", desc: "A 12-episode docu-series edited for retention and rhythm.", hue: 175 },
  { id: "04", title: "Strata — Short Form", category: "Short-form Reels", desc: "30-day short-form sprint, 14M cumulative views.", hue: 65 },
] as const;

const TESTIMONIALS = [
  { name: "Amelia Reyes", company: "Northwave", quote: "Jepy turned six hours of raw footage into the most-watched launch film we've ever shipped." },
  { name: "Hiroshi Tanaka", company: "Lumen Labs", quote: "Their color and motion work feels like cinema, not content. We won't edit anywhere else." },
  { name: "Priya Sharma", company: "Octave Studios", quote: "Every cut has intent. Our retention curves changed the week we started working with them." },
];

function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <FeaturedWork />
      <Stats />
      <Testimonials />
      <CTA />
    </>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden pt-32 pb-20">
      <div className="aurora" />
      <Particles count={36} />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#050505_85%)]" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8 w-full">
        <Reveal delay={100}>
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-foreground/70">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]" />
            Cinematic Post-Production Studio
          </div>
        </Reveal>
        <h1 className="mt-8 font-display text-[14vw] md:text-[10vw] leading-[0.92] tracking-[-0.04em]">
          <Reveal>Your Content,</Reveal>
          <Reveal delay={120}>
            <span className="text-[var(--accent)] text-glow">Elevated.</span>
          </Reveal>
        </h1>
        <Reveal delay={260}>
          <p className="mt-8 max-w-xl text-base md:text-lg text-foreground/70 leading-relaxed">
            We craft cinematic edits and visual experiences for creators, brands and SaaS companies that demand attention.
          </p>
        </Reveal>
        <Reveal delay={360}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Magnetic>
              <Link to="/work" className="btn-primary">
                View Work <ArrowUpRight size={18} />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link to="/contact" className="btn-ghost">
                <Play size={16} /> Book A Call
              </Link>
            </Magnetic>
          </div>
        </Reveal>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3 max-w-3xl">
          {FLOATING.map((w, i) => (
            <Reveal key={w} delay={500 + i * 70}>
              <div className="font-display text-xs md:text-sm tracking-[0.3em] text-foreground/40 hover:text-[var(--accent)] transition-colors">
                — {w}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] text-foreground/40 font-mono">
        Scroll
      </div>
    </section>
  );
}

function FeaturedWork() {
  return (
    <section className="relative py-32 md:py-40">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex items-end justify-between gap-8 mb-16">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">Featured Work</div>
            <Reveal>
              <h2 className="font-display text-5xl md:text-7xl tracking-tighter max-w-2xl">
                Selected frames<br />from recent edits.
              </h2>
            </Reveal>
          </div>
          <Link to="/work" className="hidden md:inline-flex btn-ghost">
            All projects <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="space-y-10">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <Link to="/case-studies" className="group block">
                <div className="grid md:grid-cols-[1fr_1.6fr] gap-8 items-center">
                  <div className="order-2 md:order-1">
                    <div className="font-mono text-xs text-[var(--accent)]">{p.id} / 04</div>
                    <h3 className="mt-3 font-display text-3xl md:text-5xl tracking-tight group-hover:text-[var(--accent)] transition-colors duration-500">
                      {p.title}
                    </h3>
                    <div className="mt-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">{p.category}</div>
                    <p className="mt-4 text-foreground/70 max-w-md">{p.desc}</p>
                    <div className="mt-6 inline-flex items-center gap-2 text-sm text-foreground/80 group-hover:text-[var(--accent)] transition-colors">
                      Open case study <ArrowUpRight size={16} />
                    </div>
                  </div>
                  <div className="order-1 md:order-2 relative aspect-[16/10] rounded-3xl overflow-hidden border border-white/5">
                    <div
                      className="absolute inset-0 transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                      style={{
                        background: `radial-gradient(120% 80% at 30% 30%, hsl(${p.hue} 80% 55% / 0.45), transparent 60%), radial-gradient(80% 60% at 80% 70%, hsl(${(p.hue + 40) % 360} 70% 50% / 0.4), transparent 60%), #0a0a0a`,
                      }}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(0,0,0,0.7)_100%)]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-16 w-16 rounded-full glass flex items-center justify-center glow-ring transition-transform duration-500 group-hover:scale-110">
                        <Play size={22} className="text-[var(--accent)]" fill="currentColor" />
                      </div>
                    </div>
                    <div className="absolute left-5 bottom-5 text-xs uppercase tracking-[0.3em] text-white/70">
                      {p.category}
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { v: 750, suf: "+", label: "Projects Delivered" },
    { v: 30, suf: "M+", label: "Views Generated" },
    { v: 4, suf: "+", label: "Years Experience" },
  ];
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid md:grid-cols-3 gap-10 md:gap-6">
          {items.map((it, i) => (
            <Reveal key={it.label} delay={i * 100}>
              <div className="border-t border-white/10 pt-8">
                <div className="font-display text-6xl md:text-8xl tracking-tighter text-glow">
                  <Counter to={it.v} suffix={it.suf} />
                </div>
                <div className="mt-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">{it.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">Kind Words</div>
        <Reveal>
          <h2 className="font-display text-4xl md:text-6xl tracking-tighter max-w-3xl">
            Trusted by founders, creators<br />and studios worldwide.
          </h2>
        </Reveal>
        <div className="mt-16 grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 120}>
              <figure className="glass rounded-3xl p-8 h-full flex flex-col gap-6">
                <div className="text-[var(--accent)] text-4xl font-display leading-none">&ldquo;</div>
                <blockquote className="text-foreground/85 leading-relaxed flex-1">{t.quote}</blockquote>
                <figcaption className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-full"
                    style={{ background: `linear-gradient(135deg, hsl(${i * 80 + 90} 70% 50%), hsl(${i * 80 + 140} 60% 30%))` }}
                  />
                  <div>
                    <div className="text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.company}</div>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="relative overflow-hidden rounded-[36px] border border-white/10 p-10 md:p-20 text-center">
          <div className="aurora opacity-70" />
          <div className="relative">
            <Reveal>
              <h2 className="font-display text-5xl md:text-8xl tracking-tighter">
                Let&apos;s create something<br />
                <span className="text-[var(--accent)] text-glow">exceptional.</span>
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-6 text-foreground/70 max-w-xl mx-auto">
                Tell us about your next project — film, series, drop, or sprint. We&apos;ll reply within 24 hours.
              </p>
            </Reveal>
            <Reveal delay={220}>
              <div className="mt-10">
                <Magnetic>
                  <Link to="/contact" className="btn-primary">
                    Book A Call <ArrowUpRight size={18} />
                  </Link>
                </Magnetic>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
