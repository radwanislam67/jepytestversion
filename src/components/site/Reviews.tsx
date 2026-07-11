import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

type Review = {
  image: string;
  quote: string;
  name: string;
  designation: string;
};

const REVIEWS: Review[] = [
  {
    image: "https://cdn.jepystudio.com/clients/jake-morrison.webp",
    quote:
      "Handed over my raw footage on Monday, got back a cinematic reel by Wednesday. These guys just get it.",
    name: "Jake Morrison",
    designation: "YouTube Creator · 280K Subscribers · USA",
  },
  {
    image: "https://cdn.jepystudio.com/clients/sophia-reeves.webp",
    quote:
      "The pacing, the cuts, the color — everything felt intentional. My audience noticed the upgrade immediately.",
    name: "Sophia Reeves",
    designation: "Podcast Host & Educator · 95K Instagram · UK",
  },
  {
    image: "https://cdn.jepystudio.com/clients/daniel-kwon.webp",
    quote:
      "We were spending 3 days per video. Now it's same-day turnaround. Jepy basically became our in-house team.",
    name: "Daniel Kwon",
    designation: "SaaS Founder · Head of Content · San Francisco",
  },
  {
    image: "https://cdn.jepystudio.com/clients/priya-nair.webp",
    quote:
      "I send assets, they send back magic. Zero back-and-forth, zero stress. Best decision for my channel.",
    name: "Priya Nair",
    designation: "Finance Creator · 430K YouTube · Canada",
  },
  {
    image: "https://cdn.jepystudio.com/clients/marcus-webb.webp",
    quote:
      "My reels used to get 2K views. First video Jepy edited hit 47K. The editing quality is just on another level.",
    name: "Marcus Webb",
    designation: "Real Estate Educator · 180K TikTok · Australia",
  },
  {
    image: "https://cdn.jepystudio.com/clients/lena-fischer.webp",
    quote:
      "We outsource all client video work to Jepy now. Consistent quality, fast delivery, no micromanaging needed.",
    name: "Lena Fischer",
    designation: "Brand Strategist · Agency Owner · Germany",
  },
];

function Card({ r, index, visible }: { r: Review; index: number; visible: boolean }) {
  return (
    <div
      className="flex flex-col gap-4 h-full rounded-xl p-6 transition-all duration-300"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(83,255,47,0.20)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.5s ease ${index * 100}ms, transform 0.5s ease ${index * 100}ms, border-color 0.3s ease, box-shadow 0.3s ease`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(83,255,47,0.7)";
        e.currentTarget.style.boxShadow = "0 0 24px rgba(83,255,47,0.18)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(83,255,47,0.20)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div className="flex items-center gap-3">
        <img
          src={r.image}
          alt={r.name}
          width={48}
          height={48}
          loading="lazy"
          decoding="async"
          className="h-12 w-12 rounded-full object-cover shrink-0"
        />
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={14} fill="#FFD700" stroke="#FFD700" />
          ))}
        </div>
      </div>

      <p className="text-sm text-foreground/85 leading-relaxed italic">
        &ldquo;{r.quote}&rdquo;
      </p>

      <div
        className="mt-auto pt-4"
        style={{ borderTop: "1px solid rgba(247,247,247,0.08)" }}
      >
        <div className="text-sm font-bold text-white">{r.name}</div>
        <div className="text-xs text-muted-foreground mt-1">{r.designation}</div>
      </div>
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
            style={{ marginBottom: 16, color: "#fff" }}
          >
            Don&rsquo;t Take{" "}
            <span style={{ color: "#00FF00" }} className="text-glow">
              Our Word
            </span>{" "}
            For It
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <p className="text-center text-base md:text-lg text-muted-foreground mb-12">
            Real creators and teams share their experience
          </p>
        </Reveal>

        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch gap-6"
        >
          {REVIEWS.map((r, i) => (
            <Card key={i} r={r} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
