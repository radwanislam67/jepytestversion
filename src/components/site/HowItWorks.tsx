import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/site/Reveal";

const STEPS = [
  {
    n: "01",
    title: "Brief",
    body: "You fill out a short form that takes about ten minutes. You tell us what the video needs to do, who it's for, and what you want your viewer to do by the end.",
  },
  {
    n: "02",
    title: "Story Boarding",
    body: "Before we touch the timeline, we align on style, pacing and references. You see the direction before editing begins, and once you're happy we lock it in.",
  },
  {
    n: "03",
    title: "Final Edit",
    body: "Cutting, color, sound design and motion all come from the same team — working on your project from the first frame to the last.",
  },
  {
    n: "04",
    title: "Delivery",
    body: "You get the final file ready for every platform you post on, usually within the agreed timeline from kickoff.",
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [visualIdx, setVisualIdx] = useState(0);
  const [visualVisible, setVisualVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  // IntersectionObserver to track which step is most visible (threshold 0.5)
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

  // Fade out → swap → fade in (200ms) when active step changes
  useEffect(() => {
    if (active === visualIdx) return;
    setVisualVisible(false);
    const t = setTimeout(() => {
      setVisualIdx(active);
      setVisualVisible(true);
    }, 200);
    return () => clearTimeout(t);
  }, [active, visualIdx]);

  // Left progress line (scroll-driven)
  useEffect(() => {
    const onScroll = () => {
      const sec = sectionRef.current;
      if (!sec) return;
      const r = sec.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const passed = Math.min(Math.max(-r.top, 0), Math.max(total, 1));
      setProgress(total > 0 ? passed / total : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 md:py-40">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="text-center mb-20">
          <Reveal>
            <h2 className="font-display text-5xl md:text-7xl tracking-tighter">
              How It <span className="text-[var(--accent)] text-glow">Works</span>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-5 text-foreground/70">Four steps. Zero confusion.</p>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-20 items-start">
          {/* Left: steps with vertical line */}
          <div className="relative">
            {/* Track */}
            <div
              className="absolute left-3 md:left-4 top-2 bottom-2 w-px"
              style={{ background: "color-mix(in oklab, var(--accent) 18%, transparent)" }}
              aria-hidden
            />
            {/* Progress line */}
            <div
              className="absolute left-3 md:left-4 top-2 w-px origin-top"
              style={{
                height: `calc((100% - 16px) * ${progress})`,
                background: "linear-gradient(180deg, var(--accent), var(--glow))",
                boxShadow: "0 0 12px var(--accent)",
                transition: "height 200ms linear",
              }}
              aria-hidden
            />

            <div className="flex flex-col gap-24 md:gap-36 pl-10 md:pl-14">
              {STEPS.map((s, i) => {
                const isActive = i === active;
                return (
                  <div
                    key={s.n}
                    data-idx={i}
                    ref={(el) => {
                      stepRefs.current[i] = el;
                    }}
                    className="relative min-h-[60vh]"
                  >
                    {/* Node dot */}
                    <span
                      className="absolute -left-[34px] md:-left-[42px] top-2 w-3 h-3 rounded-full transition-all duration-500"
                      style={{
                        background: isActive ? "var(--accent)" : "color-mix(in oklab, var(--accent) 25%, transparent)",
                        boxShadow: isActive ? "0 0 14px var(--accent), 0 0 28px color-mix(in oklab, var(--glow) 50%, transparent)" : "none",
                      }}
                      aria-hidden
                    />
                    <div
                      className="font-mono text-sm tracking-[0.3em] mb-3 transition-colors duration-500"
                      style={{
                        color: isActive ? "var(--accent)" : "color-mix(in oklab, var(--foreground) 30%, transparent)",
                      }}
                    >
                      {s.n}
                    </div>
                    <h3
                      className="font-display text-3xl md:text-5xl tracking-tighter mb-4 transition-colors duration-500"
                      style={{
                        color: isActive ? "var(--foreground)" : "color-mix(in oklab, var(--foreground) 35%, transparent)",
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

                    {/* Mobile visual */}
                    <div
                      className="md:hidden mt-6 aspect-square w-full rounded-2xl border border-[var(--accent)]/15"
                      style={{
                        background:
                          "radial-gradient(ellipse at 30% 30%, rgba(83,255,47,0.10), transparent 60%), linear-gradient(135deg, #0a0a0a, #050505 70%)",
                      }}
                      aria-hidden
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: sticky visual */}
          <div className="hidden md:block">
            <div className="sticky top-28">
              <div
                className="aspect-square w-full rounded-3xl border border-[var(--accent)]/15 overflow-hidden relative transition-all duration-500"
                style={{
                  background:
                    "radial-gradient(ellipse at 30% 30%, rgba(83,255,47,0.14), transparent 60%), linear-gradient(135deg, #0a0a0a, #050505 70%)",
                  boxShadow: "0 30px 80px -30px color-mix(in oklab, var(--accent) 25%, transparent)",
                }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(83,255,47,0.10),transparent_60%)]" />
                <div className="absolute bottom-5 left-5 font-mono text-xs tracking-[0.3em] text-[var(--accent)]/70">
                  {STEPS[active].n} — {STEPS[active].title.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
