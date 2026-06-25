import { useMemo } from "react";
import { useInView } from "@/hooks/use-in-view";

export function Particles({ count = 28 }: { count?: number }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0, rootMargin: "200px" });

  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 12,
        duration: 14 + Math.random() * 16,
        size: 1 + Math.random() * 2.5,
        opacity: 0.3 + Math.random() * 0.5,
        key: i,
      })),
    [count],
  );

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {inView &&
        items.map((p) => (
          <span
            key={p.key}
            className="particle"
            style={{
              left: `${p.left}%`,
              bottom: `-10vh`,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              animationPlayState: inView ? "running" : "paused",
            }}
          />
        ))}
    </div>
  );
}
