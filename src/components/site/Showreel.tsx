import { useEffect, useRef } from "react";

export const SHOWREEL_SRC = "https://www.w3schools.com/html/mov_bbb.mp4";

export function Showreel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const box = boxRef.current;
    if (!section || !box) return;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
      const scale = 1 - p * 0.2;
      const radius = p * 16;
      box.style.transform = `scale(${scale})`;
      box.style.borderRadius = `${radius}px`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-background"
      aria-label="Showreel"
    >
      <div
        ref={boxRef}
        className="absolute inset-0 overflow-hidden will-change-transform"
        style={{ transition: "border-radius 200ms ease" }}
      >
        <video
          src={SHOWREEL_SRC}
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-3">
          <div
            className="text-xs md:text-sm uppercase tracking-[0.4em] text-white/80"
            style={{ animation: "fade-in 1.6s ease both" }}
          >
            Our Showreel
          </div>
          <div
            className="text-[var(--accent)] text-2xl"
            style={{ animation: "arrow-pulse 1.8s ease-in-out infinite" }}
            aria-hidden
          >
            ↓
          </div>
        </div>
      </div>
    </section>
  );
}
