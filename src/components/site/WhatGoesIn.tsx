import { Reveal } from "@/components/site/Reveal";

const ITEMS = [
  {
    n: "01",
    title: "Hook",
    body: "The first 3 seconds decide everything. We craft an opening that stops the scroll and demands attention.",
    image: "https://cdn.jepystudio.com/media/jepy-hook.webp",
    alt: "Neon green spotlight illuminating an eye icon — representing the Hook that captures viewer attention",
  },
  {
    n: "02",
    title: "Story",
    body: "Every edit follows a clear narrative arc. We keep viewers watching from the first frame to the last.",
    image: "https://cdn.jepystudio.com/media/jepy-story.webp",
    alt: "Venn diagram of Brand and Audience overlapping around a neon brain icon — representing narrative Story alignment",
  },
  {
    n: "03",
    title: "Conversion",
    body: "By the time your video ends, your viewer knows exactly what to do next — book, buy, or share.",
    image: "https://cdn.jepystudio.com/media/jepy-conversion.webp",
    alt: "Glass orbs with icons orbiting a neon green beam — representing the Conversion process",
  },
];

function Media({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      className="aspect-video w-full rounded-2xl border border-[var(--accent)]/30 overflow-hidden relative"
      style={{
        background:
          "radial-gradient(ellipse at 30% 30%, rgba(83,255,47,0.15), transparent 60%), linear-gradient(135deg, #0a1f10, #050505 70%)",
      }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        width={1200}
        height={800}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}


export function WhatGoesIn() {
  return (
    <section className="relative py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="text-center mb-12">
          <Reveal>
            <h2 className="font-display text-5xl md:text-7xl tracking-tighter">
              What Goes Into <span className="text-[var(--accent)] text-glow">Every Video</span>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-4 text-foreground/70">Three things we bring in every edit.</p>
          </Reveal>
        </div>

        <div className="flex flex-col gap-12 md:gap-16">
          {ITEMS.map((it, i) => {
            const mediaLeft = i % 2 === 0;
            return (
              <div
                key={it.n}
                className="grid md:grid-cols-2 gap-10 md:gap-20 items-center"
              >
                <Reveal className={mediaLeft ? "md:order-1" : "md:order-2"}>
                  <Media src={it.image} alt={it.alt} />
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

