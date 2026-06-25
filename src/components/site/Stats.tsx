import { useEffect, useRef, useState } from "react";

type Stat = {
  value: number;
  suffix: string;
  label: string;
};

const STATS: Stat[] = [
  { value: 2000, suffix: "+", label: "Videos Delivered" },
  { value: 60, suffix: "M+", label: "Views Generated" },
  { value: 5, suffix: " Years", label: "Experience" },
  { value: 100, suffix: "+", label: "Projects Completed" },
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
    <div ref={wrapRef} className="text-center md:text-left will-change-transform min-w-0">
      <div
        ref={numRef}
        className="font-display text-3xl sm:text-4xl md:text-6xl font-semibold tabular-nums leading-none break-words"
        style={{
          color: "var(--accent)",
          animation: done ? "stat-glow 1.6s ease-out 1" : undefined,
        }}
      >
        {n.toLocaleString()}
        {stat.suffix}
      </div>
      <div className="mt-2 md:mt-3 text-[11px] sm:text-xs md:text-base uppercase tracking-[0.15em] md:tracking-[0.18em] text-foreground/50">
        {stat.label}
      </div>
    </div>
  );
}

export function Stats() {
  return (
    <section className="relative w-full bg-background py-16 md:py-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-8">
          {STATS.map((s, i) => (
            <StatItem key={s.label} stat={s} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}
