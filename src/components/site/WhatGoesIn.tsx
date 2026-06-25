import { Reveal } from "@/components/site/Reveal";

const ITEMS = [
  {
    n: "01",
    title: "Hook",
    body: "The first 3 seconds decide everything. We craft an opening that stops the scroll and demands attention.",
  },
  {
    n: "02",
    title: "Story",
    body: "Every edit follows a clear narrative arc. We keep viewers watching from the first frame to the last.",
  },
  {
    n: "03",
    title: "Conversion",
    body: "By the time your video ends, your viewer knows exactly what to do next — book, buy, or share.",
  },
];

function Media() {
  return (
    <div
      className="aspect-video w-full rounded-2xl border border-[var(--accent)]/20 overflow-hidden relative"
      style={{
        background:
          "radial-gradient(ellipse at 30% 30%, rgba(83,255,47,0.18), transparent 60%), linear-gradient(135deg, #061a09, #050505 70%)",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(83,255,47,0.12),transparent_60%)]" />
    </div>
  );
}

export function WhatGoesIn() {
  return (
    <section className="relative py-32 md:py-40">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="text-center mb-20">
          <Reveal>
            <h2 className="font-display text-5xl md:text-7xl tracking-tighter">
              What Goes Into <span className="text-[var(--accent)] text-glow">Every Video</span>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-5 text-foreground/70">Three things we bring in every edit.</p>
          </Reveal>
        </div>

        <div className="flex flex-col gap-24 md:gap-32">
          {ITEMS.map((it, i) => {
            const mediaLeft = i % 2 === 0;
            return (
              <div
                key={it.n}
                className="grid md:grid-cols-2 gap-10 md:gap-20 items-center"
              >
                <Reveal className={mediaLeft ? "md:order-1" : "md:order-2"}>
                  <Media />
                </Reveal>
                <Reveal
                  delay={120}
                  className={mediaLeft ? "md:order-2" : "md:order-1"}
                >
                  <div className="text-xs font-mono tracking-[0.3em] text-[var(--accent)] mb-4">
                    {it.n}
                  </div>
                  <h3 className="font-display text-4xl md:text-6xl tracking-tighter mb-5">
                    {it.title}
                  </h3>
                  <p className="text-foreground/70 text-lg leading-relaxed max-w-lg">
                    {it.body}
                  </p>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
