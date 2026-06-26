import { useEffect, useRef, useState } from "react";
import { Star, ChevronRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

type Review = {
  quote: string;
  name: string;
  company: string;
  initials: string;
  gradient: string;
};

const REVIEWS: Review[] = [
  {
    quote: "Jepy turned our raw footage into the most-watched video we've ever launched. Insane quality.",
    name: "Amelia Reyes",
    company: "Northwave",
    initials: "AR",
    gradient: "linear-gradient(135deg, #8B5CF6, #3B82F6)",
  },
  {
    quote: "Their motion work feels cinematic, not just edited. We won't go anywhere else.",
    name: "Hiroshi Tanaka",
    company: "Lumen Labs",
    initials: "HT",
    gradient: "linear-gradient(135deg, #F97316, #EF4444)",
  },
  {
    quote: "Every cut has purpose. Our retention jumped the week we switched to Jepy.",
    name: "Priya Sharma",
    company: "Octave",
    initials: "PS",
    gradient: "linear-gradient(135deg, #22C55E, #14B8A6)",
  },
  {
    quote: "Fastest turnaround we've seen. Brief to final delivery in under 48 hours.",
    name: "Marcus Lee",
    company: "Strata",
    initials: "ML",
    gradient: "linear-gradient(135deg, #3B82F6, #6366F1)",
  },
  {
    quote: "Our short-form content hit 14M views in 30 days after Jepy started editing for us.",
    name: "Sofia Martinez",
    company: "Halcyon",
    initials: "SM",
    gradient: "linear-gradient(135deg, #EC4899, #A855F7)",
  },
  {
    quote: "Premium quality from first frame to final color. Worth every dollar.",
    name: "Daniel Kim",
    company: "Pixelrun",
    initials: "DK",
    gradient: "linear-gradient(135deg, #EAB308, #F97316)",
  },
];

function Card({ r, index, visible }: { r: Review; index: number; visible: boolean }) {
  return (
    <div
      className="flex flex-col gap-4 h-full"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(0,255,0,0.2)",
        borderRadius: 12,
        padding: 24,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.5s ease ${index * 100}ms, transform 0.5s ease ${index * 100}ms, border-color 0.3s ease, box-shadow 0.3s ease`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(0,255,0,0.8)";
        e.currentTarget.style.boxShadow = "0 0 20px rgba(0,255,0,0.2)";
        e.currentTarget.style.transform = "translateY(0) scale(1.02)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(0,255,0,0.2)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0) scale(1)";
      }}
    >
      <p className="text-sm text-foreground/85 leading-relaxed">&ldquo;{r.quote}&rdquo;</p>
      <div
        className="mt-auto flex items-center"
        style={{ gap: 12, marginTop: 16 }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: r.gradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: "bold",
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {r.initials}
        </div>
        <div>
          <div className="text-sm font-bold text-white">{r.name}</div>
          <div className="text-xs text-muted-foreground">{r.company}</div>
        </div>
      </div>
    </div>
  );
}

function SummaryPill() {
  const avatars = ["#53FF2F", "#B8FF6A", "#8a8a8a", "#F7F7F7"];
  return (
    <div
      className="group inline-flex items-center gap-3 transition-all duration-300 hover:shadow-[0_0_24px_rgba(0,255,0,0.35)]"
      style={{
        background: "rgba(11,11,11,0.85)",
        border: "1px solid rgba(0,255,0,0.3)",
        borderRadius: 999,
        padding: "10px 24px",
      }}
    >
      <div className="flex -space-x-2">
        {avatars.map((c, i) => (
          <span
            key={i}
            className="inline-block h-6 w-6 rounded-full border-2"
            style={{ background: c, borderColor: "#0b0b0b" }}
          />
        ))}
      </div>
      <div className="flex gap-0.5 items-center">
        {Array.from({ length: 4 }).map((_, i) => (
          <Star key={i} size={12} fill="#FFD700" stroke="#FFD700" />
        ))}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
        >
          <defs>
            <linearGradient id="star5grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="90%" stopColor="#FFD700" />
              <stop offset="90%" stopColor="#FFD70033" />
              <stop offset="100%" stopColor="#FFD70033" />
            </linearGradient>
          </defs>
          <path
            d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.123 2.123 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.123 2.123 0 0 0 1.597-1.16z"
            fill="url(#star5grad)"
            stroke="#FFD700"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

      </div>
      <span className="text-sm font-bold text-white">4.9</span>
      <span className="text-sm text-muted-foreground">50+ Clients Worldwide</span>
      <ChevronRight size={14} className="text-muted-foreground" />
    </div>
  );
}

export function Reviews() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="reviews" className="relative py-32 md:py-40 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <h2
            className="font-display text-5xl md:text-7xl tracking-tighter text-center"
            style={{ marginBottom: 48, color: "#fff" }}
          >
            Don&rsquo;t Take{" "}
            <span style={{ color: "#00FF00" }} className="text-glow">
              Our Word
            </span>{" "}
            For It
          </h2>
        </Reveal>

        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch"
          style={{ gap: 24 }}
        >
          {REVIEWS.map((r, i) => (
            <Card key={i} r={r} index={i} visible={visible} />
          ))}
        </div>

        <div className="flex justify-center" style={{ marginTop: 40 }}>
          <SummaryPill />
        </div>
      </div>
    </section>
  );
}
