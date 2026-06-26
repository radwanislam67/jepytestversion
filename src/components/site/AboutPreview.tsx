import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

const SLIDES: { src: string; label: string }[] = [
  {
    src: "https://picsum.photos/seed/jepy-about-1/800/600",
    label: "Studio Frame 01",
  },
  {
    src: "https://picsum.photos/seed/jepy-about-2/800/600",
    label: "Studio Frame 02",
  },
];

function Carousel() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 4000);
    return () => clearInterval(t);
  }, []);
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        aspectRatio: "4 / 3",
        borderRadius: 12,
        border: "1px solid rgba(83,255,47,0.45)",
        boxShadow: "0 0 40px rgba(83,255,47,0.22), inset 0 0 60px rgba(83,255,47,0.04)",
      }}
    >
      {SLIDES.map((s, i) => (
        <div
          key={i}
          aria-hidden={i !== idx}
          className="absolute inset-0"
          style={{
            opacity: i === idx ? 1 : 0,
            transition: "opacity 1200ms ease",
          }}
        >
          <img
            src={s.src}
            alt={s.label}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(1.15) contrast(1.05) saturate(1.1)",
              animation: i === idx ? "ken-burns 8s ease-out forwards" : "none",
              willChange: "transform",
            }}
          />
        </div>
      ))}
    </div>
  );
}

export function AboutPreview() {
  return (
    <section
      id="about"
      className="relative scroll-mt-24"
      style={{ paddingTop: "clamp(48px, 8vw, 80px)", paddingBottom: "64px" }}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <Reveal>
            <div>
              <div
                style={{
                  color: "#00FF00",
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  marginBottom: 16,
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Who We Are
              </div>
              <h2 className="font-display text-5xl md:text-7xl tracking-tighter">
                The Obsessives <br />
                <span className="text-[var(--accent)] text-glow">Behind Your Content</span>
              </h2>
              <p className="mt-6 text-foreground/70 leading-relaxed max-w-xl">
                In 2021, two editors made a decision — stop settling for good enough. Jepy was built on the belief that every piece of content deserves intention, craft, and a team that genuinely cares about the result.
              </p>
              <p className="mt-4 text-foreground/70 leading-relaxed max-w-xl">
                That&rsquo;s still what we show up for. Every frame. Every client. Every time.
              </p>
              <div className="mt-8">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[var(--accent)] text-[var(--accent)] bg-transparent font-medium transition-colors duration-200 hover:bg-[var(--accent)] hover:text-black"
                >
                  Meet the Team <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <Carousel />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
