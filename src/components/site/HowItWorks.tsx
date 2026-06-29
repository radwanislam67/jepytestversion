import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/site/Reveal";

const STEPS = [
  {
    n: "01",
    title: "Brief",
    body: "You fill out a short form that takes about ten minutes. You tell us what the video needs to do, who it's for, and what you want your viewer to do by the end.",
    image: "https://res.cloudinary.com/drmtlvrmm/image/upload/w_800,q_auto,f_auto/v1782765382/ChatGPT_Image_Jun_30_2026_02_34_51_AM_tfwghj.webp",
    alt: "Brief — short intake form illustration",
  },
  {
    n: "02",
    title: "Story Boarding",
    body: "Before we touch the timeline, we align on style, pacing and references. You see the direction before editing begins, and once you're happy we lock it in.",
    image: "https://res.cloudinary.com/drmtlvrmm/image/upload/w_800,q_auto,f_auto/v1782765383/ChatGPT_Image_Jun_30_2026_02_20_22_AM_iy1njc.webp",
    alt: "Story Boarding — visual references and pacing",
  },
  {
    n: "03",
    title: "Final Edit",
    body: "Cutting, color, sound design and motion all come from the same team — working on your project from the first frame to the last.",
    image: "https://res.cloudinary.com/drmtlvrmm/image/upload/w_800,q_auto,f_auto/v1782766163/ChatGPT_Image_Jun_30_2026_02_47_47_AM_dcnusq.webp",
    alt: "Final Edit — cutting, color and sound",
  },
  {
    n: "04",
    title: "Delivery",
    body: "You get the final file ready for every platform you post on, usually within the agreed timeline from kickoff.",
    image: "https://res.cloudinary.com/drmtlvrmm/image/upload/w_800,q_auto,f_auto/v1782767625/ChatGPT_Image_Jun_30_2026_03_09_40_AM_vyjolb.webp",
    alt: "Delivery — final files ready for every platform",
  },
];

export function HowItWorks() {
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const visibility = new Map<number, number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const idx = Number((e.target as HTMLElement).dataset.idx);
          visibility.set(idx, e.intersectionRatio);
        });
        let best = -1;
        let bestRatio = 0;
        visibility.forEach((ratio, idx) => {
          if (ratio >= 0.5 && ratio > bestRatio) {
            bestRatio = ratio;
            best = idx;
          }
        });
        if (best !== -1) setActive(best);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="relative py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="text-center mb-12">
          <Reveal>
            <h2 className="font-display text-5xl md:text-7xl tracking-tighter">
              How It <span className="text-[var(--accent)] text-glow">Works</span>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-4 text-foreground/70">Four steps. Zero confusion.</p>
          </Reveal>
        </div>

        <div className="relative pl-10 md:pl-14">
          {/* Vertical track */}
          <div
            className="absolute left-3 md:left-4 top-2 bottom-2 w-[3px] rounded-full"
            style={{ background: "color-mix(in oklab, var(--accent) 22%, transparent)" }}
            aria-hidden
          />
          {/* Active progress overlay */}
          <div
            className="absolute left-3 md:left-4 top-2 w-[3px] rounded-full origin-top"

            style={{
              height: `calc((100% - 16px) * ${(active + 1) / STEPS.length})`,
              background: "linear-gradient(180deg, var(--accent), var(--glow))",
              boxShadow: "0 0 12px var(--accent)",
              transition: "height 400ms ease",
            }}
            aria-hidden
          />

          <div className="flex flex-col gap-16 md:gap-20">
            {STEPS.map((s, i) => {
              const isActive = i === active;
              return (
                <div
                  key={s.n}
                  data-idx={i}
                  ref={(el) => {
                    stepRefs.current[i] = el;
                  }}
                  className="relative grid md:grid-cols-2 gap-8 md:gap-12 items-center"
                >
                  {/* Node dot */}
                  <span
                    className="absolute -left-[36px] md:-left-[44px] top-6 w-4 h-4 rounded-full border-2 transition-all duration-500"
                    style={{
                      background: isActive
                        ? "var(--accent)"
                        : "color-mix(in oklab, var(--accent) 30%, transparent)",
                      borderColor: "var(--accent)",
                      boxShadow: isActive
                        ? "0 0 16px var(--accent), 0 0 32px color-mix(in oklab, var(--glow) 55%, transparent)"
                        : "0 0 6px color-mix(in oklab, var(--accent) 40%, transparent)",
                    }}
                    aria-hidden
                  />


                  {/* Left: text */}
                  <div>
                    <div
                      className="font-mono text-sm tracking-[0.3em] mb-3 transition-colors duration-500"
                      style={{
                        color: isActive
                          ? "var(--accent)"
                          : "color-mix(in oklab, var(--foreground) 30%, transparent)",
                      }}
                    >
                      {s.n}
                    </div>
                    <h3
                      className="font-display text-3xl md:text-5xl tracking-tighter mb-4 transition-colors duration-500"
                      style={{
                        color: isActive
                          ? "var(--foreground)"
                          : "color-mix(in oklab, var(--foreground) 35%, transparent)",
                      }}
                    >
                      {s.title}
                    </h3>
                    <p
                      className="text-base md:text-lg leading-relaxed max-w-lg transition-colors duration-500"
                      style={{
                        color: isActive
                          ? "color-mix(in oklab, var(--foreground) 80%, transparent)"
                          : "color-mix(in oklab, var(--foreground) 30%, transparent)",
                      }}
                    >
                      {s.body}
                    </p>
                  </div>

                  {/* Right: image */}
                  <div
                    className="relative w-full rounded-2xl border border-[var(--accent)]/30 overflow-hidden"
                    style={{
                      height: 280,
                      boxShadow: isActive
                        ? "0 30px 80px -30px color-mix(in oklab, var(--accent) 25%, transparent)"
                        : "none",
                      transition: "box-shadow 400ms ease",
                    }}
                  >
                    <img
                      src={s.image}
                      alt={s.alt}
                      loading="lazy"
                      decoding="async"
                      width={1200}
                      height={800}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
