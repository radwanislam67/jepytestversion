import { useEffect, useRef, useState } from "react";
import { Star, ChevronRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

type Review = {
  quote: string;
  name: string;
  company: string;
  image: string;
};

const REVIEWS: Review[] = [
  {
    quote: "Jepy turned our raw footage into the most-watched video we've ever launched. Insane quality.",
    name: "Jake Morrison",
    company: "YouTube Creator · 280K Subscribers · USA",
    image: "https://cdn.jepystudio.com/clients/jake-morrison.webp",
  },
  {
    quote: "Their motion work feels cinematic, not just edited. We won't go anywhere else.",
    name: "Sophia Reeves",
    company: "Podcast Host & Educator · 95K Instagram · UK",
    image: "https://cdn.jepystudio.com/clients/sophia-reeves.webp",
  },
  {
    quote: "Every cut has purpose. Our retention jumped the week we switched to Jepy.",
    name: "Daniel Kwon",
    company: "SaaS Founder · Head of Content · San Francisco",
    image: "https://cdn.jepystudio.com/clients/daniel-kwon.webp",
  },
  {
    quote: "Fastest turnaround we've seen. Brief to final delivery in under 48 hours.",
    name: "Priya Nair",
    company: "Finance Creator · 430K YouTube · Canada",
    image: "https://cdn.jepystudio.com/clients/priya-nair.webp",
  },
  {
    quote: "Our short-form content hit 14M views in 30 days after Jepy started editing for us.",
    name: "Marcus Webb",
    company: "Real Estate Educator · 180K TikTok · Australia",
    image: "https://cdn.jepystudio.com/clients/marcus-webb.webp",
  },
  {
    quote: "Premium quality from first frame to final color. Worth every dollar.",
    name: "Lena Fischer",
    company: "Brand Strategist · Agency Owner · Germany",
    image: "https://cdn.jepystudio.com/clients/lena-fischer.webp",
  },
];

function Card({ r, index, visible }: { r: Review; index: number; visible: boolean }) {
  return (
    <div
      className="flex flex-col gap-4 h-full"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(83,255,47,0.28)",
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
        <span style={{ position: "relative", display: "inline-block", width: 12, height: 12 }}>
          <Star size={12} fill="#4B5563" stroke="#4B5563" style={{ position: "absolute", inset: 0 }} />
          <span style={{ position: "absolute", inset: 0, width: "60%", overflow: "hidden" }}>
            <Star size={12} fill="#FFD700" stroke="#FFD700" />
          </span>
        </span>
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
    <section id="reviews" className="relative py-16 md:py-20 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <h2
            className="font-display text-5xl md:text-7xl tracking-tighter text-center"
            style={{ marginBottom: 32, color: "#fff" }}
          >
            Don&rsquo;t Take{" "}
            <span style={{ color: "#00FF00" }} className="text-glow">
              Our Word
            </span>{" "}
            For It
          </h2>
        </Reveal>

        <div className="flex justify-center mb-12">
          <SummaryPill />
        </div>

        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch"
          style={{ gap: 24 }}
        >
          {REVIEWS.map((r, i) => (
            <Card key={i} r={r} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}

