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
    <div className="relative">
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: "4 / 3",
          borderRadius: 16,
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
      {/* Persistent green glow dot */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          width: 10,
          height: 10,
          borderRadius: 999,
          background: "#53FF2F",
          boxShadow: "0 0 14px rgba(83,255,47,0.9), 0 0 28px rgba(83,255,47,0.55)",
          animation: "pulse-dot 2s ease-in-out infinite",
        }}
      />
    </div>
  );
}

export function AboutPreview() {
  return (
    <section id="about" className="relative scroll-mt-24 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
          <Reveal>
            <div className="text-left">
              <div
                style={{
                  color: "#53FF2F",
                  fontSize: 12,
                  letterSpacing: "0.18em",
                  marginBottom: 20,
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Who We Are
              </div>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tighter leading-[1.05] text-white">
                The Obsessives <br />
                <span className="text-[var(--accent)] text-glow">Behind Your Content</span>
              </h2>
              <p className="mt-8 text-gray-300/90 leading-relaxed max-w-xl text-base md:text-lg">
                In 2021, two editors made a decision — stop settling for good enough. Jepy was built on the belief that every piece of content deserves intention, craft, and a team that genuinely cares about the result.
              </p>
              <p className="mt-5 text-gray-300/90 leading-relaxed max-w-xl text-base md:text-lg">
                That&rsquo;s still what we show up for. Every frame. Every client. Every time.
              </p>
              <div className="mt-8">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[var(--accent)] text-[var(--accent)] bg-transparent font-medium transition-all duration-300 hover:bg-[var(--accent)] hover:text-black hover:scale-105 hover:shadow-[0_0_24px_rgba(83,255,47,0.45)]"
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
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.75; }
        }
      `}</style>
    </section>
  );
}
