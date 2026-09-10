import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import {
  ChevronDown,
  Scissors,
  Wand2,
  Palette,
  Smartphone,
  Youtube,
  Megaphone,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { CTASection } from "@/components/site/CTASection";
import { useProtectedVideo, warmVideos } from "@/hooks/useProtectedVideo";
import { VideoSkeleton } from "@/components/site/VideoSkeleton";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services | Jepy" },
      { name: "description", content: "Video editing, motion design, color grading and more — engineered for retention and conversion." },
      { property: "og:title", content: "Services | Jepy" },
      { property: "og:description", content: "What we do at Jepy." },
    ],
  }),
  component: ServicesPage,
});

type Service = {
  title: string;
  icon: LucideIcon;
  desc: string;
  bullets: string[];
  afterKey?: string;
};

const SERVICES: Service[] = [
  {
    title: "Video Editing",
    icon: Scissors,
    desc: "Pacing, rhythm and storytelling crafted around your goal.",
    bullets: ["Story-first cuts", "Rhythm & pacing", "Sound polish", "Up to 4K delivery"],
    afterKey: "After Aron.mp4",
  },
  {
    title: "Motion Design",
    icon: Wand2,
    desc: "Kinetic typography and animation that elevates every frame.",
    bullets: ["Kinetic typography", "Logo animation", "Custom transitions", "After Effects workflows"],
    afterKey: "Car After.mp4",
  },
  {
    title: "Color Grading",
    icon: Palette,
    desc: "Cinematic looks tailored to your brand and platform.",
    bullets: ["Custom LUTs", "Cinematic looks", "Skin tone protection", "HDR-ready delivery"],
  },
  {
    title: "Short Form Content",
    icon: Smartphone,
    desc: "Hook-first edits engineered for retention and reach.",
    bullets: ["Hook engineering", "Captioning", "Platform-native ratios", "Batch production"],
    afterKey: "Cris Cordio.mp4",
  },
  {
    title: "YouTube Editing",
    icon: Youtube,
    desc: "Long-form edits that grow channels and keep viewers.",
    bullets: ["Retention-driven cuts", "B-roll sourcing", "Thumbnail support", "Series consistency"],
  },
  {
    title: "Commercial Ads",
    icon: Megaphone,
    desc: "High-conversion ad creatives for paid and organic.",
    bullets: ["Concept & script", "Performance edits", "Multiple variants", "A/B-ready exports"],
    afterKey: "Hadia After.mp4",
  },
];

const BADGES = ["48h Turnaround", "Unlimited Revisions", "14-Day Guarantee", "Dedicated Editor"];

const SPAN_CLASSES = [
  "md:col-span-2 lg:col-span-2", // 0 — Video Editing
  "lg:row-span-2",                  // 1 — Motion Design
  "",                                 // 2 — Color Grading
  "",                                 // 3 — Short Form
  "",                                 // 4 — YouTube
  "md:col-span-2 lg:col-span-2", // 5 — Commercial Ads
];

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);
    const onChange = () => setReduced(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function ServiceVideoFrame({ videoKey, inView, label }: { videoKey: string; inView: boolean; label?: string }) {
  const { videoRef, ready } = useProtectedVideo(videoKey);
  const reducedMotion = usePrefersReducedMotion();
  const shouldPlay = inView && ready && !reducedMotion;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (shouldPlay) {
      void v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [shouldPlay, videoRef]);

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ aspectRatio: "9/16", height: 220, borderRadius: 10, background: "#0d0d0d" }}
    >
      {!ready && <VideoSkeleton className="absolute inset-0" />}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        className="h-full w-full object-cover"
        style={{ opacity: ready ? 1 : 0, transition: "opacity 250ms ease" }}
      />
      {label && (
        <div
          className="absolute bottom-2 left-2 right-2 text-[10px] uppercase tracking-[0.18em] text-white/45"
          style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
        >
          {label}
        </div>
      )}
    </div>
  );
}

function TileFallback() {
  return (
    <div
      className="relative overflow-hidden flex items-center justify-center"
      style={{
        aspectRatio: "9/16",
        height: 220,
        borderRadius: 10,
        background: "linear-gradient(180deg, rgba(48,217,75,.10), rgba(48,217,75,.02))",
        border: "1px solid rgba(48,217,75,.18)",
      }}
    >
      <span
        className="text-[10px] uppercase tracking-[0.22em] text-white/45"
        style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
      >
        Coming soon
      </span>
    </div>
  );
}

function ExpandControl({ open, onToggle, children }: { open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="inline-flex items-center gap-1 text-sm text-[#30d94b] hover:text-[#d8ffdf] transition-colors"
      >
        {open ? "Hide preview" : "See Examples"}
        <ChevronDown
          size={14}
          className="transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      <div
        className="overflow-hidden"
        style={{
          maxHeight: open ? 260 : 0,
          opacity: open ? 1 : 0,
          transition: "max-height 350ms cubic-bezier(.22,1,.36,1), opacity 350ms ease",
        }}
      >
        {children}
      </div>
    </>
  );
}

function ServiceCard({ s, i, wide }: { s: Service; i: number; wide: boolean }) {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const previewWrapRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [previewInView, setPreviewInView] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const number = String(i + 1).padStart(2, "0");
  const spanClass = SPAN_CLASSES[i] ?? "";
  const afterKey = s.afterKey;

  const onMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (spotlightRef.current) {
      spotlightRef.current.style.setProperty("--mx", `${x}px`);
      spotlightRef.current.style.setProperty("--my", `${y}px`);
    }
  };

  // Warm video on expand (non-wide) or on viewport approach (wide)
  useEffect(() => {
    if (!afterKey) return;
    if (!wide && open) void warmVideos([afterKey]);
  }, [open, afterKey, wide]);

  useEffect(() => {
    if (!wide || !afterKey) return;
    const el = previewWrapRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setPreviewInView(true);
      void warmVideos([afterKey]);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setPreviewInView(true);
            void warmVideos([afterKey]);
          }
        });
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [wide, afterKey]);

  return (
    <div
      onMouseMove={onMouseMove}
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 p-6 transition-all duration-300 hover:border-[rgba(48,217,75,0.35)] hover:-translate-y-0.5 ${spanClass}`}
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.015))",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,.06), 0 30px 60px -30px rgba(0,0,0,.8)",
      }}
    >
      {/* Cursor spotlight */}
      <div
        ref={spotlightRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background:
            "radial-gradient(320px circle at var(--mx) var(--my), rgba(48,217,75,0.07), transparent 60%)",
          transitionDuration: "300ms",
        }}
      />
      {/* Top green hairline */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(to right, rgba(48,217,75,0.45), rgba(48, 217, 75,0))",
        }}
      />
      {/* Category number top-right */}
      <span
        aria-hidden
        className="absolute top-3 right-4 transition-colors duration-300 group-hover:text-[var(--accent)]"
        style={{
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 11,
          letterSpacing: "0.18em",
          color: "rgba(255,255,255,.25)",
        }}
      >
        {number}
      </span>
      {/* Icon tile */}
      <div className="flex items-center gap-3 mb-2">
        <div
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 ease-out group-hover:scale-105"
          style={{
            background: "rgba(48,217,75,0.06)",
            color: "var(--accent)",
            border: "1px solid rgba(48,217,75,0.35)",
          }}
        >
          <s.icon size={18} />
        </div>
        <h3 className="text-lg font-medium text-white">{s.title}</h3>
      </div>
      <p className="text-sm text-[#a3a3a3] mb-4">{s.desc}</p>
      {/* Bullets as chips */}
      <ul className="flex flex-wrap gap-2 mb-4">
        {s.bullets.map((b) => (
          <li
            key={b}
            className="rounded-full border transition-colors duration-300 group-hover:border-[rgba(48,217,75,0.25)]"
            style={{
              padding: "4px 10px",
              fontSize: 12,
              color: "rgba(255,255,255,.65)",
              borderColor: "rgba(255,255,255,.12)",
            }}
          >
            {b}
          </li>
        ))}
      </ul>

      {/* Wide cards: persistent preview panel on the right at lg */}
      {wide && afterKey && (
        <>
          <div
            ref={previewWrapRef}
            className="mt-auto pt-4 hidden lg:grid"
            style={{ gridTemplateColumns: "1fr 220px", gap: 24, alignItems: "end" }}
          >
            <div className="flex items-end">
              <Link
                to="/work"
                className="inline-flex items-center gap-1 text-xs text-[#a3a3a3] hover:text-white transition-colors"
              >
                View all work →
              </Link>
            </div>
            <ServiceVideoFrame videoKey={afterKey} inView={previewInView} label={s.title} />
          </div>
          {/* On smaller screens where the lg grid is hidden, fall back to a simple link */}
          <div className="mt-auto pt-4 lg:hidden">
            <Link
              to="/work"
              className="inline-flex items-center gap-1 text-sm text-[#30d94b] hover:text-[#d8ffdf] transition-colors"
            >
              See Examples →
            </Link>
          </div>
        </>
      )}

      {/* Non-wide cards: expand control with preview strip */}
      {!wide && afterKey && (
        <div className="mt-auto pt-4">
          <ExpandControl open={open} onToggle={() => setOpen((v) => !v)}>
            <div className="pt-3 grid grid-cols-3 gap-3">
              {[0, 1, 2].map((k) => (
                <ServiceVideoFrame key={k} videoKey={afterKey} inView={open} label={s.title} />
              ))}
            </div>
            <div className="pt-3 text-right">
              <Link
                to="/work"
                className="inline-flex items-center gap-1 text-xs text-[#a3a3a3] hover:text-white transition-colors"
              >
                View all work →
              </Link>
            </div>
          </ExpandControl>
        </div>
      )}

      {/* Non-wide cards with no video: expand control with tile fallbacks */}
      {!wide && !afterKey && (
        <div className="mt-auto pt-4">
          <ExpandControl open={open} onToggle={() => setOpen((v) => !v)}>
            <div className="pt-3 grid grid-cols-2 gap-3">
              {[0, 1].map((k) => (
                <TileFallback key={k} />
              ))}
            </div>
            <div className="pt-3 text-right">
              <Link
                to="/work"
                className="inline-flex items-center gap-1 text-xs text-[#a3a3a3] hover:text-white transition-colors"
              >
                View all work →
              </Link>
            </div>
          </ExpandControl>
        </div>
      )}
    </div>
  );
}

function ServicesPage() {
  return (
    <>
      <section className="relative pt-32 md:pt-36 pb-16 md:pb-20 section-light">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <h1 className="font-display text-6xl md:text-8xl tracking-tighter text-center">
              What <span className="text-[var(--accent)] text-glow">We Do</span>
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-5 text-foreground/70 text-lg max-w-2xl mx-auto text-center">
              From raw footage to publish-ready — we handle everything.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-6 grid grid-cols-2 md:flex md:flex-wrap md:justify-center items-center gap-y-3 text-sm">
              {BADGES.map((b, i) => (
                <div key={b} className="flex items-center justify-center">
                  <span className="text-[#a3a3a3]">
                    <span className="text-[var(--accent)] mr-1">✦</span>
                    {b}
                  </span>
                  {i < BADGES.length - 1 && (
                    <span className="hidden md:inline text-white/20 mx-3">·</span>
                  )}
                </div>
              ))}
            </div>
          </Reveal>

          <div className="mt-16 rounded-3xl border border-white/10 bg-[rgba(255,255,255,.02)] p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SERVICES.map((s, i) => {
                const wide = i === 0 || i === 5;
                return (
                  <Reveal key={s.title} delay={i * 80}>
                    <ServiceCard s={s} i={i} wide={wide} />
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <div className="mb-8 text-center">
        <Link
          to="/pricing"
          preload="render"
          className="group inline-flex items-center gap-2 rounded-full border border-[var(--accent)] bg-transparent px-6 py-3.5 text-base font-semibold uppercase tracking-[0.16em] text-[var(--accent)] transition-all duration-300 hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] hover:scale-[1.03]"
        >
          View Pricing <span aria-hidden className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-[5px]">→</span>
        </Link>
      </div>
      <CTASection />
    </>
  );
}
