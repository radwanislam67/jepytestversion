import { useEffect, useRef, useState } from "react";

type Stat = {
  value: number;
  suffix: string;
  label: string;
};

const STATS: Stat[] = [
  { value: 2000, suffix: "+", label: "Videos Delivered" },
  { value: 60, suffix: "M+", label: "Views Generated" },
  { value: 50, suffix: "+", label: "Clients Worldwide" },
];

function StatItem({ stat, delay }: { stat: Stat; delay: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    wrap.style.opacity = "0";
    wrap.style.transform = "translateY(20px)";
    wrap.style.transition = `opacity 0.7s cubic-bezier(.2,.8,.2,1) ${delay}ms, transform 0.7s cubic-bezier(.2,.8,.2,1) ${delay}ms`;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          wrap.style.opacity = "1";
          wrap.style.transform = "translateY(0)";

          const duration = 1800;
          const start = performance.now() + delay;
          const tick = (t: number) => {
            if (t < start) {
              requestAnimationFrame(tick);
              return;
            }
            const p = Math.min(1, (t - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.floor(eased * stat.value));
            if (p < 1) requestAnimationFrame(tick);
            else {
              setN(stat.value);
              setDone(true);
            }
          };
          requestAnimationFrame(tick);
          io.unobserve(wrap);
        });
      },
      { threshold: 0.3 },
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, [stat.value, delay]);

  return (
    <div ref={wrapRef} className="text-center will-change-transform min-w-0 px-2 md:px-4">
      <div
        ref={numRef}
        className="font-display text-2xl sm:text-3xl md:text-5xl font-semibold tabular-nums leading-none whitespace-nowrap"
        style={{
          color: "var(--accent)",
          animation: done ? "stat-glow 1.6s ease-out 1, stat-breath 3.6s ease-in-out 1.6s infinite" : undefined,
        }}
      >
        {n.toLocaleString()}
        {stat.suffix}
      </div>
      <div className="mt-2 md:mt-3 text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.15em] md:tracking-[0.18em] text-foreground/50">
        {stat.label}
      </div>
    </div>
  );
}

export function Stats() {
  return (
    <section className="relative w-full bg-background pt-12 pb-12 md:pb-16 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10 md:gap-y-0">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={
                i > 0
                  ? "md:border-l border-[color-mix(in_oklab,var(--accent)_30%,transparent)] text-center"
                  : "text-center"
              }
            >
              <StatItem stat={s} delay={i * 100} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
