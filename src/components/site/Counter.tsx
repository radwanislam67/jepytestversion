import { useEffect, useRef, useState } from "react";

export function Counter({ to, suffix = "", duration = 1800 }: { to: number; suffix?: string; duration?: number; }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const start = performance.now();
          const tick = (t: number) => {
            const p = Math.min(1, (t - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.floor(eased * to));
            if (p < 1) requestAnimationFrame(tick);
            else setN(to);
          };
          requestAnimationFrame(tick);
          io.unobserve(el);
        });
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);
  return <span ref={ref} className="tabular-nums">{n.toLocaleString()}{suffix}</span>;
}
