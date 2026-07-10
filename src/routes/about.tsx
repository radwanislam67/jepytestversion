import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Zap, Heart, Rocket } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";


export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About | Jepy" },
      {
        name: "description",
        content:
          "Jepy is a premium post-production studio crafting cinematic edits for creators, brands and SaaS.",
      },
      { property: "og:title", content: "About | Jepy" },
      {
        property: "og:description",
        content: "Inside the studio: mission, process and the people behind the craft.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function PhotoPlaceholder({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className="w-full"
      style={{
        aspectRatio: "1 / 1",
        objectFit: "cover",
        borderRadius: 12,
        border: "1px solid rgba(0,255,0,0.5)",
        boxShadow: "0 0 28px rgba(0,255,0,0.15)",
      }}
    />
  );
}

function SlideIn({
  from,
  delay = 0,
  children,
}: {
  from: "left" | "right";
  delay?: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            setV(true);
            io.unobserve(el);
          }
        }),
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{
        opacity: v ? 1 : 0,
        transform: v
          ? "translateX(0)"
          : `translateX(${from === "left" ? "-60px" : "60px"})`,
        transition: `opacity 800ms ease ${delay}ms, transform 800ms cubic-bezier(.2,.8,.2,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function ScrollIndicator() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        bottom: 32,
        left: "50%",
        transform: "translateX(-50%)",
        opacity: hidden ? 0 : 1,
        transition: "opacity 400ms ease",
        color: "#00FF00",
        fontSize: 24,
        animation: "bounce-down 2s ease-in-out infinite",
      }}
    >
      ↓
    </div>
  );
}

const VALUES = [
  {
    icon: Zap,
    title: "Results Over Aesthetics",
    body:
      "We don't make pretty videos. We make videos that work. Every cut has a reason. Every frame serves the result.",
  },
  {
    icon: Heart,
    title: "Client Obsessed",
    body:
      "We listen to your brief, then deliver something better. We don't stop until you're genuinely happy with the result. That's not a promise. It's our standard.",
  },
  {
    icon: Rocket,
    title: "Adapt & Evolve",
    body:
      "AI or manual, we use whatever gets the best result. Tools change. Our commitment to quality never does.",
  },
];

function ValueCard({
  v,
  i,
  visible,
}: {
  v: (typeof VALUES)[number];
  i: number;
  visible: boolean;
}) {
  const Icon = v.icon;
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(0,255,0,0.2)",
        borderRadius: 12,
        padding: 28,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.6s ease ${i * 150}ms, transform 0.6s ease ${i * 150}ms, border-color 0.3s ease, box-shadow 0.3s ease`,
        transformStyle: "preserve-3d",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform =
          "perspective(1000px) rotateX(3deg) rotateY(3deg)";
        e.currentTarget.style.borderColor = "rgba(0,255,0,0.8)";
        e.currentTarget.style.boxShadow = "0 0 24px rgba(0,255,0,0.15)";
        const ic = e.currentTarget.querySelector(".value-icon") as HTMLElement | null;
        if (ic) ic.style.transform = "scale(1.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "rgba(0,255,0,0.2)";
        e.currentTarget.style.boxShadow = "none";
        const ic = e.currentTarget.querySelector(".value-icon") as HTMLElement | null;
        if (ic) ic.style.transform = "scale(1)";
      }}
    >
      <div
        className="value-icon"
        style={{
          color: "#00FF00",
          marginBottom: 16,
          transition: "transform 0.3s ease",
          display: "inline-flex",
        }}
      >
        <Icon size={28} />
      </div>
      <h3 className="font-display text-2xl tracking-tight mb-2">{v.title}</h3>
      <p className="text-sm text-foreground/70 leading-relaxed">{v.body}</p>
    </div>
  );
}

function ValuesGrid() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.unobserve(el);
          }
        }),
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className="grid grid-cols-1 md:grid-cols-3"
      style={{ gap: 24 }}
    >
      {VALUES.map((v, i) => (
        <ValueCard key={v.title} v={v} i={i} visible={visible} />
      ))}
    </div>
  );
}

function StudioTile({
  area,
  label,
  src,
  delay,
}: {
  area: string;
  label: string;
  src: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            setV(true);
            io.unobserve(el);
          }
        }),
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{
        gridArea: area,
        position: "relative",
        overflow: "hidden",
        borderRadius: 12,
        border: "1px solid rgba(0,255,0,0.2)",
        minHeight: 220,
        opacity: v ? 1 : 0,
        transform: v ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms, border-color 0.3s ease`,
        background:
          "linear-gradient(135deg, rgba(0,255,0,0.12), rgba(0,0,0,0.85))",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(0,255,0,0.5)";
        const inner = e.currentTarget.querySelector(
          ".studio-inner",
        ) as HTMLElement | null;
        const overlay = e.currentTarget.querySelector(
          ".studio-overlay",
        ) as HTMLElement | null;
        if (inner) inner.style.transform = "scale(1.08)";
        if (overlay) overlay.style.opacity = "1";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(0,255,0,0.2)";
        const inner = e.currentTarget.querySelector(
          ".studio-inner",
        ) as HTMLElement | null;
        const overlay = e.currentTarget.querySelector(
          ".studio-overlay",
        ) as HTMLElement | null;
        if (inner) inner.style.transform = "scale(1)";
        if (overlay) overlay.style.opacity = "0";
      }}
    >
      <img
        className="studio-inner"
        src={src}
        alt={label}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 0.6s ease",
        }}
      />
      <div
        className="studio-overlay"
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,255,0,0.08)",
          opacity: 0,
          transition: "opacity 0.3s ease",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255,255,255,0.4)",
          fontSize: 12,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
}

const MILESTONES: { year: string; text: string; current?: boolean }[] = [
  { year: "2021", text: "Jepy founded." },
  { year: "2022", text: "Refining the craft." },
  { year: "2023", text: "500+ videos delivered." },
  { year: "2024", text: "40M+ views generated." },
  { year: "2025", text: "2,000+ videos. 70+ projects completed." },
  { year: "2026", text: "Still going.", current: true },
];

function Timeline() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            setActive(true);
            io.unobserve(el);
          }
        }),
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const drawMs = 1400;
  const perDot = drawMs / MILESTONES.length;
  const currentIdx = MILESTONES.findIndex((m) => m.current);
  const prevPct = ((currentIdx - 1 + 0.5) / MILESTONES.length) * 100;
  const currentPct = ((currentIdx + 0.5) / MILESTONES.length) * 100;
  const horizontalProgress = `linear-gradient(90deg, #4b5563 0%, #4b5563 ${prevPct}%, #22c55e ${currentPct}%, #22c55e 100%)`;
  const verticalProgress = `linear-gradient(180deg, #4b5563 0%, #4b5563 ${prevPct}%, #22c55e ${currentPct}%, #22c55e 100%)`;

  return (
    <section className="relative py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div
            style={{
              color: "#00FF00",
              fontSize: 12,
              letterSpacing: "0.18em",
              marginBottom: 16,
              textTransform: "uppercase",
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            Our Journey
          </div>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="font-display text-5xl md:text-7xl tracking-tighter text-center mb-16">
            Built <span className="text-[var(--accent)] text-glow">Over Time.</span>
          </h2>
        </Reveal>

        <div ref={ref}>
          {/* Desktop: horizontal */}
          <div className="hidden md:block relative" style={{ paddingTop: 110, paddingBottom: 20 }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 110,

                height: 2,
                background: "rgba(255,255,255,0.08)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 110,
                height: 2,
                width: "100%",
                background: horizontalProgress,
                boxShadow: "0 0 12px rgba(34,197,94,0.35)",
                transform: active ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "left",
                transition: `transform ${drawMs}ms cubic-bezier(.2,.8,.2,1)`,
              }}
            />
            <div className="relative grid" style={{ gridTemplateColumns: `repeat(${MILESTONES.length}, 1fr)`, marginTop: -8 }}>
              {MILESTONES.map((m, i) => {
                const dotDelay = i * perDot;
                const textDelay = dotDelay + 200;
                const isCurrent = !!m.current;
                const dotSize = isCurrent ? 16 : 8;
                return (
                  <div key={m.year} className="relative flex flex-col items-center text-center px-3">
                    {isCurrent && (
                      <div
                        style={{
                          opacity: active ? 1 : 0,
                          transform: active ? "translateY(0)" : "translateY(6px)",
                          transition: `opacity 400ms ease ${dotDelay}ms, transform 400ms ease ${dotDelay}ms`,
                          marginBottom: 14,
                          background: "#53FF2F",
                          color: "#050505",
                          boxShadow: "0 0 14px rgba(83,255,47,0.55)",
                        }}
                        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wider"
                      >
                        NOW
                      </div>

                    )}
                    <div
                      className={isCurrent ? "animate-pulse" : ""}
                      style={{
                        width: dotSize,
                        height: dotSize,
                        borderRadius: 999,
                        background: isCurrent ? "#22c55e" : "#6b7280",
                        boxShadow: isCurrent
                          ? "0 0 18px rgba(34,197,94,0.9), 0 0 36px rgba(34,197,94,0.5)"
                          : "none",
                        outline: isCurrent ? "2px solid rgba(34,197,94,0.3)" : "none",
                        outlineOffset: isCurrent ? 4 : 0,
                        opacity: active ? 1 : 0,
                        transform: active ? "scale(1)" : "scale(0.2)",
                        transition: `transform 500ms cubic-bezier(.34,1.56,.64,1) ${dotDelay}ms, opacity 300ms ease ${dotDelay}ms`,
                      }}
                    />
                    <div
                      style={{
                        marginTop: isCurrent ? 22 : 18,
                        opacity: active ? 1 : 0,
                        transform: active ? "translateY(0)" : "translateY(10px)",
                        transition: `opacity 500ms ease ${textDelay}ms, transform 500ms ease ${textDelay}ms`,
                      }}
                    >
                      <div
                        style={{
                          color: isCurrent ? "#53FF2F" : "#6b7280",
                          fontWeight: isCurrent ? 700 : 400,
                          fontSize: isCurrent ? 22 : 20,
                          filter: isCurrent ? "drop-shadow(0 0 10px rgba(83,255,47,0.7))" : "none",

                        }}
                      >
                        {m.year}
                      </div>
                      <div
                        className={
                          isCurrent
                            ? "text-base text-white font-medium mt-2 leading-relaxed"
                            : "text-sm text-foreground/70 mt-2 leading-relaxed"
                        }
                      >
                        {m.text}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile: vertical */}
          <div className="md:hidden relative" style={{ paddingLeft: 28 }}>
            <div
              style={{
                position: "absolute",
                left: 7,
                top: 0,
                bottom: 0,
                width: 2,
                background: "rgba(255,255,255,0.08)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 7,
                top: 0,
                width: 2,
                height: "100%",
                background: verticalProgress,
                boxShadow: "0 0 12px rgba(34,197,94,0.35)",
                transform: active ? "scaleY(1)" : "scaleY(0)",
                transformOrigin: "top",
                transition: `transform ${drawMs}ms cubic-bezier(.2,.8,.2,1)`,
              }}
            />
            {MILESTONES.map((m, i) => {
              const dotDelay = i * perDot;
              const textDelay = dotDelay + 200;
              const isCurrent = !!m.current;
              const dotSize = isCurrent ? 16 : 8;
              return (
                <div key={m.year} className="relative" style={{ paddingBottom: 32 }}>
                  <div
                    className={isCurrent ? "animate-pulse" : ""}
                    style={{
                      position: "absolute",
                      left: isCurrent ? -28 : -24,
                      top: 6,
                      width: dotSize,
                      height: dotSize,
                      borderRadius: 999,
                      background: isCurrent ? "#22c55e" : "#6b7280",
                      boxShadow: isCurrent
                        ? "0 0 18px rgba(34,197,94,0.9), 0 0 36px rgba(34,197,94,0.5)"
                        : "none",
                      outline: isCurrent ? "2px solid rgba(34,197,94,0.3)" : "none",
                      outlineOffset: isCurrent ? 4 : 0,
                      opacity: active ? 1 : 0,
                      transform: active ? "scale(1)" : "scale(0.2)",
                      transition: `transform 500ms cubic-bezier(.34,1.56,.64,1) ${dotDelay}ms, opacity 300ms ease ${dotDelay}ms`,
                    }}
                  />
                  <div
                    style={{
                      opacity: active ? 1 : 0,
                      transform: active ? "translateY(0)" : "translateY(10px)",
                      transition: `opacity 500ms ease ${textDelay}ms, transform 500ms ease ${textDelay}ms`,
                    }}
                  >
                    {isCurrent && (
                      <span
                        style={{ background: "#53FF2F", color: "#050505", boxShadow: "0 0 14px rgba(83,255,47,0.55)" }}
                        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wider mb-2"
                      >
                        NOW
                      </span>
                    )}
                    <div
                      style={{
                        color: isCurrent ? "#53FF2F" : "#6b7280",
                        fontWeight: isCurrent ? 700 : 400,
                        fontSize: isCurrent ? 20 : 18,
                        filter: isCurrent ? "drop-shadow(0 0 10px rgba(83,255,47,0.7))" : "none",
                      }}
                    >
                      {m.year}

                    </div>
                    <div
                      className={
                        isCurrent
                          ? "text-base text-white font-medium mt-1 leading-relaxed"
                          : "text-sm text-foreground/70 mt-1 leading-relaxed"
                      }
                    >
                      {m.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}


function About() {
  return (
    <>
      {/* HERO */}
      <section
        className="relative overflow-hidden"
        style={{ paddingTop: 120, paddingBottom: 48 }}
      >
        <div className="aurora" />
        <div className="relative z-10 mx-auto px-5 md:px-8 text-center" style={{ maxWidth: 680 }}>
          <Reveal>
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
              Our Story
            </div>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="font-display text-6xl md:text-8xl tracking-tighter">
              We Are <span className="text-[var(--accent)] text-glow">Jepy</span>
            </h1>
          </Reveal>
          <div
            className="mt-10 mx-auto text-left text-foreground/75 leading-relaxed"
            style={{ maxWidth: 680, fontSize: 18 }}
          >
            <Reveal delay={200}>
              <p className="mb-8">
                Every day, thousands of videos are uploaded, watched for three seconds, and forgotten. Brands lose customers they never knew they had. Creators lose audiences they worked years to build. Founders watch their best ideas go unnoticed, not because the world didn&rsquo;t care, but because the content didn&rsquo;t connect.
              </p>
            </Reveal>
            <Reveal delay={280}>
              <blockquote
                className="my-8 font-display tracking-tight text-[var(--accent)]"
                style={{
                  fontSize: "clamp(28px, 4vw, 32px)",
                  lineHeight: 1.15,
                  borderLeft: "3px solid var(--accent)",
                  paddingLeft: 20,
                }}
              >
                Three seconds. That&rsquo;s all you get.
              </blockquote>
            </Reveal>
            <Reveal delay={360}>
              <p className="mb-6">
                The wrong cut. The wrong pace. The wrong color. That&rsquo;s all it takes to lose someone forever.
              </p>
            </Reveal>
            <Reveal delay={420}>
              <p className="mb-6">
                We started Jepy because we&rsquo;ve seen what bad editing costs — not just in views, but in businesses. Every frame has potential. Every story deserves to be felt, not just seen.
              </p>
            </Reveal>
            <Reveal delay={480}>
              <p>
                That&rsquo;s the problem we solve. Every edit. Every client. Every time.
              </p>
            </Reveal>
          </div>
        </div>
      </section>


      {/* OUR JOURNEY TIMELINE */}
      <Timeline />

      {/* FOUNDERS */}
      <section className="relative py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <h2 className="font-display text-5xl md:text-7xl tracking-tighter text-center">
              The Obsessives <span className="text-[var(--accent)] text-glow">Behind Your Content</span>
            </h2>
          </Reveal>

          <div className="mt-20 grid gap-20">
            {/* Founder 1 — Sojol (photo LEFT, text RIGHT) */}
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
              <SlideIn from="left">
                <PhotoPlaceholder src="/images/sojol.webp" alt="Sojol Sheikh" />
              </SlideIn>
              <SlideIn from="right" delay={120}>
                <div>
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>
                    Sojol Sheikh
                  </h3>
                  <div style={{ fontSize: 14, color: "#00FF00", marginTop: 4 }}>
                    Co-Founder &amp; Creative Director
                  </div>
                  <p className="mt-6 text-foreground/75 leading-relaxed">
                    Sojol is the Co-Founder and Creative Director of Jepy. Every project that leaves the studio carries his fingerprint. He oversees editing, motion design and color with one standard in mind. If it does not feel cinematic and intentional, it is not ready. In a world where AI is changing how content is made, Sojol leads with the one thing technology cannot replicate. A genuine creative eye that knows what moves people and why. That instinct is what makes Jepy&rsquo;s work unmistakable.
                  </p>
                </div>
              </SlideIn>
            </div>

            {/* Founder 2 — Radwan (mobile: photo top / text bottom; desktop: text LEFT, photo RIGHT) */}
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
              <SlideIn from="right">
                <div className="md:order-2">
                  <PhotoPlaceholder src="/images/radwan.webp" alt="Radwan Islam" />
                </div>
              </SlideIn>
              <SlideIn from="left" delay={120}>
                <div className="md:order-1">
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>
                    Radwan Islam
                  </h3>
                  <div style={{ fontSize: 14, color: "#00FF00", marginTop: 4 }}>
                    Co-Founder &amp; Managing Director
                  </div>
                  <p className="mt-6 text-foreground/75 leading-relaxed">
                    Radwan is the Co-Founder and driving force behind Jepy. His passion for visual storytelling and sharp eye for detail shape every creative and business decision at the studio. As AI reshapes the content landscape, Radwan keeps Jepy ahead of the curve by combining human creative judgment with the best tools available to deliver work that no algorithm alone could produce.
                  </p>
                  <p className="mt-4 text-foreground/75 leading-relaxed">
                    For him, every frame should serve a purpose and every client deserves work that goes beyond the brief.
                  </p>
                </div>
              </SlideIn>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT DRIVES US */}
      <section className="relative py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <h2 className="font-display text-5xl md:text-7xl tracking-tighter text-center mb-16">
              What <span className="text-[var(--accent)] text-glow">Drives Us</span>
            </h2>
          </Reveal>
          <ValuesGrid />
        </div>
      </section>

      {/* OUR STUDIO */}
      <section className="relative py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <div
              style={{
                color: "#00FF00",
                fontSize: 12,
                letterSpacing: "0.1em",
                marginBottom: 16,
                textTransform: "uppercase",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              Behind the Scenes
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="font-display text-5xl md:text-7xl tracking-tighter text-center mb-16">
              Our <span className="text-[var(--accent)] text-glow">Studio</span>
            </h2>
          </Reveal>
          <div className="studio-grid" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="studio-img" style={{ height: 480, borderRadius: 12, overflow: "hidden" }}>
              <img
                src="https://cdn.jepystudio.com/office/new-office-setup-2026.webp"
                alt="Jepy Studio's new office setup in 2026 — full workspace view"
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s ease" }}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="studio-img" style={{ height: 320, borderRadius: 12, overflow: "hidden" }}>
                <img
                  src="https://cdn.jepystudio.com/office/office-setup-january-2026.webp"
                  alt="Jepy Studio office setup, January 2026"
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s ease" }}
                />
              </div>
              <div className="studio-img" style={{ height: 320, borderRadius: 12, overflow: "hidden" }}>
                <img
                  src="https://cdn.jepystudio.com/office/office-setup-2025.webp"
                  alt="Jepy Studio office setup in 2025"
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s ease" }}
                />
              </div>
            </div>
          </div>
          <style>{`
            .studio-img img:hover { transform: scale(1.03); }
            @media (max-width: 767px) {
              .studio-grid > div:first-child { height: 280px !important; }
              .studio-grid .studio-img { height: 200px !important; }
            }
          `}</style>

        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div
            className="relative overflow-hidden rounded-[36px] border border-[var(--accent)]/30 p-10 md:p-20 text-center"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(83,255,47,0.12), transparent 70%), #050505",
              boxShadow: "0 0 120px -20px rgba(83,255,47,0.35) inset",
            }}
          >
            <div className="aurora opacity-60" />
            <div className="relative">
              <Reveal>
                <h2 className="font-display text-5xl md:text-7xl tracking-tighter">
                  Ready to <span className="text-[var(--accent)] text-glow">Work With Us?</span>
                </h2>
              </Reveal>
              <Reveal delay={120}>
                <p className="mt-6 text-foreground/70 max-w-xl mx-auto">
                  Let&rsquo;s build something worth watching.
                </p>
              </Reveal>
              <Reveal delay={220}>
                <div className="mt-10">
                  <Link to="/contact" className="btn-primary">
                    Start Your Project <ArrowUpRight size={18} />
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
