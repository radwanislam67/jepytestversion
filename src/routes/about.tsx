import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Jepy" },
      { name: "description", content: "Jepy is a premium post-production studio crafting cinematic edits for creators, brands and SaaS." },
      { property: "og:title", content: "About — Jepy" },
      { property: "og:description", content: "Inside the studio: mission, process and craft." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

const PROCESS = [
  { n: "01", t: "Discover", d: "We start with story. Who is this for, what should they feel, and how do we earn the next second?" },
  { n: "02", t: "Direct", d: "Treatment, references, structure. Every project gets a creative spine before a single cut." },
  { n: "03", t: "Edit", d: "Story-first edits with cinematic pacing — drafts shared as we go, never as a surprise." },
  { n: "04", t: "Polish", d: "Motion, color, sound. The unseen 30% that makes the work feel inevitable." },
  { n: "05", t: "Deliver", d: "Every aspect ratio you need, organized files, and assets ready for the platforms you live on." },
];

function About() {
  return (
    <div className="pt-40 pb-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">About</div>
        <Reveal>
          <h1 className="font-display text-6xl md:text-[7.5rem] leading-[0.95] tracking-tighter max-w-5xl">
            A small studio<br />for <span className="text-[var(--accent)] text-glow">big stories.</span>
          </h1>
        </Reveal>

        <div className="mt-20 grid md:grid-cols-2 gap-16">
          <Reveal>
            <h2 className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">Mission</h2>
            <p className="text-2xl md:text-3xl font-display tracking-tight leading-tight">
              To turn raw footage into work that <span className="text-[var(--accent)]">feels inevitable</span> — for the people brave enough to ship it.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">Story</h2>
            <p className="text-foreground/75 leading-relaxed">
              Jepy began as a quiet obsession with the moment a cut lands. Four years and 750 projects later, that obsession is a studio: a tight team of editors, motion designers and colorists working with founders, creators and brands who care how the work moves.
            </p>
            <p className="mt-4 text-foreground/75 leading-relaxed">
              We don&apos;t take every project. We take the ones we&apos;d be proud to show our heroes.
            </p>
          </Reveal>
        </div>

        <section className="mt-32">
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">Process</div>
          <Reveal>
            <h2 className="font-display text-4xl md:text-6xl tracking-tighter mb-16">How a project moves through the studio.</h2>
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
        </section>
      </div>
    </div>
  );
}
