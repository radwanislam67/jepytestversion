import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { WORK_PROJECTS } from "@/components/site/work-data";
import { BeforeAfterModal } from "@/components/site/BeforeAfterModal";

type Slot = "hero" | "left" | "right";

const SLOT_STYLE: Record<Slot, React.CSSProperties> = {
  hero: { transform: "translateX(0) translateY(0) scale(1) rotate(0deg)", opacity: 1, zIndex: 3 },
  left: {
    transform: "translateX(-110px) translateY(20px) scale(0.88) rotate(-6deg)",
    opacity: 0.55,
    zIndex: 2,
  },
  right: {
    transform: "translateX(110px) translateY(20px) scale(0.88) rotate(6deg)",
    opacity: 0.55,
    zIndex: 1,
  },
};

const EXIT_STYLE: React.CSSProperties = {
  transform: "translateX(0) translateY(-260px) scale(0.8) rotate(0deg)",
  opacity: 0,
  zIndex: 4,
};

export function StackedWork() {
  // order = [leftIndex, heroIndex, rightIndex]
  const [order, setOrder] = useState<[number, number, number]>([2, 0, 1]);
  const [exiting, setExiting] = useState<number | null>(null);
  const [rotating, setRotating] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const heroIndexRef = useRef(0);
  const rotationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rotate = useCallback(() => {
    const exitingIndex = heroIndexRef.current;
    setRotating(true);
    setExiting(exitingIndex);
    setOrder(([left, hero, right]) => {
      heroIndexRef.current = left;
      return [right, left, hero];
    });
    if (rotationTimeoutRef.current) clearTimeout(rotationTimeoutRef.current);
    rotationTimeoutRef.current = setTimeout(() => {
      setExiting(null);
      setRotating(false);
    }, 600);
  }, []);

  useEffect(() => {
    if (openIndex !== null) return;
    const id = setInterval(rotate, 3500);
    return () => {
      clearInterval(id);
      if (rotationTimeoutRef.current) clearTimeout(rotationTimeoutRef.current);
    };
  }, [rotate, openIndex]);

  const slotOf = (i: number): Slot =>
    order[1] === i ? "hero" : order[0] === i ? "left" : "right";

  return (
    <section id="work" className="relative py-16 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--accent)] mb-4">
            Featured Work
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-display text-5xl md:text-7xl tracking-tighter text-left">
            Selected frames from{" "}
            <span className="text-[var(--accent)] text-glow">recent edits.</span>
          </h2>
        </Reveal>

        <div
          className="mt-20 relative mx-auto"
          style={{ height: 430, maxWidth: 520, perspective: 1200 }}
        >
          {WORK_PROJECTS.map((p, i) => {
            const slot = slotOf(i);
            const isHero = slot === "hero";
            const style = exiting === i ? EXIT_STYLE : SLOT_STYLE[slot];
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => (isHero ? setOpenIndex(i) : rotate())}
                aria-label={isHero ? `Open ${p.title}` : `Show ${p.title}`}
                className={`stack-card absolute left-1/2 top-4 -ml-[110px] text-left ${
                  isHero && !rotating ? "stack-float" : ""
                } ${!isHero ? "stack-card-side" : ""}`}
                style={{
                  width: 220,
                  height: 370,
                  background: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  borderRadius: 18,
                  transition:
                    "transform .6s cubic-bezier(.2,.8,.2,1), opacity .6s ease, border-color .25s ease",
                  ...style,
                }}
              >
                <span
                  className="absolute"
                  style={{
                    top: 12,
                    left: 12,
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                    fontSize: 9,
                    color: "#7FFF00",
                    border: "1px solid #7FFF00",
                    borderRadius: 20,
                    padding: "3px 10px",
                    background: "rgba(0,0,0,0.5)",
                    letterSpacing: "0.1em",
                  }}
                >
                  {p.tag}
                </span>

                <span
                  className="absolute left-1/2 top-1/2 flex items-center justify-center rounded-full"
                  style={{
                    width: 52,
                    height: 52,
                    marginLeft: -26,
                    marginTop: -26,
                    border: "2px solid #7FFF00",
                    background: "rgba(127,255,0,0.08)",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#7FFF00" aria-hidden>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>

                <span className="absolute left-0 right-0 px-4" style={{ bottom: 18 }}>
                  <span className="block" style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>
                    {p.title}
                  </span>
                  <span className="block mt-1" style={{ fontSize: 10, color: "#666" }}>
                    {p.desc}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          {WORK_PROJECTS.map((p, i) => (
            <span
              key={p.id}
              aria-hidden
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: order[1] === i ? "#7FFF00" : "#333",
                transition: "background .3s ease",
              }}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/work"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[var(--accent)] text-[var(--accent)] bg-transparent font-medium transition-colors duration-200 hover:bg-[var(--accent)] hover:text-black"
          >
            View All Work <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      {openIndex !== null && (
        <BeforeAfterModal
          project={WORK_PROJECTS[openIndex]}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </section>
  );
}
