import { Reveal } from "@/components/site/Reveal";

const PROCESS = [
  { n: "01", t: "Discover", d: "We start with story. Who is this for, what should they feel, and how do we earn the next second?" },
  { n: "02", t: "Direct", d: "Treatment, references, structure. Every project gets a creative spine before a single cut." },
  { n: "03", t: "Edit", d: "Story-first edits with cinematic pacing — drafts shared as we go, never as a surprise." },
  { n: "04", t: "Polish", d: "Motion, color, sound. The unseen 30% that makes the work feel inevitable." },
  { n: "05", t: "Deliver", d: "Every aspect ratio you need, organized files, and assets ready for the platforms you live on." },
];

export function AboutSection() {
  return (
    <section id="about" className="relative py-32 md:py-40 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">About</div>
        <Reveal>
          <h2 className="font-display text-5xl md:text-[7rem] leading-[0.95] tracking-tighter max-w-5xl">
            A small studio for <span className="text-[var(--accent)] text-glow">big stories.</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid md:grid-cols-2 gap-16">
          <Reveal>
            <h3 className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">Mission</h3>
            <p className="text-2xl md:text-3xl font-display tracking-tight leading-tight">
              To turn raw footage into work that <span className="text-[var(--accent)]">feels inevitable</span> — for the people brave enough to ship it.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h3 className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">Story</h3>
            <p className="text-foreground/75 leading-relaxed">
              Jepy began as a quiet obsession with the moment a cut lands. Four years and 750 projects later, that obsession is a studio: a tight team of editors, motion designers and colorists working with founders, creators and brands who care how the work moves.
            </p>
            <p className="mt-4 text-foreground/75 leading-relaxed">
              We don&apos;t take every project. We take the ones we&apos;d be proud to show our heroes.
            </p>
          </Reveal>
        </div>

        <div className="mt-24">
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">Process</div>
          <Reveal>
            <h3 className="font-display text-4xl md:text-6xl tracking-tighter mb-12">How a project moves through the studio.</h3>
          </Reveal>
          <div className="grid gap-px bg-white/5 rounded-3xl overflow-hidden">
            {PROCESS.map((p, i) => (
              <Reveal key={p.n} delay={i * 80}>
                <div className="bg-background p-8 md:p-10 grid md:grid-cols-[120px_240px_1fr] gap-6 items-start hover:bg-[var(--surface)] transition-colors">
                  <div className="font-mono text-sm text-[var(--accent)]">{p.n}</div>
                  <div className="font-display text-2xl md:text-3xl tracking-tight">{p.t}</div>
                  <p className="text-foreground/70 max-w-2xl">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
