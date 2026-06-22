import { Reveal } from "@/components/site/Reveal";
import { Counter } from "@/components/site/Counter";

export function StatsSection() {
  const items = [
    { v: 750, suf: "+", label: "Projects Delivered" },
    { v: 30, suf: "M+", label: "Views Generated" },
    { v: 4, suf: "+", label: "Years Experience" },
  ];
  return (
    <section className="relative py-24">
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

const TESTIMONIALS = [
  { name: "Amelia Reyes", company: "Northwave", quote: "Jepy turned six hours of raw footage into the most-watched launch film we've ever shipped." },
  { name: "Hiroshi Tanaka", company: "Lumen Labs", quote: "Their color and motion work feels like cinema, not content. We won't edit anywhere else." },
  { name: "Priya Sharma", company: "Octave Studios", quote: "Every cut has intent. Our retention curves changed the week we started working with them." },
];

export function TestimonialsSection() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">Kind Words</div>
        <Reveal>
          <h2 className="font-display text-4xl md:text-6xl tracking-tighter max-w-3xl">
            Trusted by founders, creators<br />and studios worldwide.
          </h2>
        </Reveal>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 120}>
              <figure className="glass rounded-3xl p-8 h-full flex flex-col gap-6">
                <div className="text-[var(--accent)] text-4xl font-display leading-none">&ldquo;</div>
                <blockquote className="text-foreground/85 leading-relaxed flex-1">{t.quote}</blockquote>
                <figcaption className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full" style={{ background: `linear-gradient(135deg, hsl(${i * 80 + 90} 70% 50%), hsl(${i * 80 + 140} 60% 30%))` }} />
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
