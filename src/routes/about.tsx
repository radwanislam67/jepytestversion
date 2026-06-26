import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Zap, Heart, Rocket } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";


export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Jepy" },
      {
        name: "description",
        content:
          "Jepy is a premium post-production studio crafting cinematic edits for creators, brands and SaaS.",
      },
      { property: "og:title", content: "About — Jepy" },
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
  delay,
}: {
  area: string;
  label: string;
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
      <div
        className="studio-inner"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 30% 40%, rgba(83,255,47,0.18), transparent 60%), #0a0a0a",
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

function About() {
  return (
    <>
      {/* HERO */}
      <section
        className="relative flex items-center justify-center"
        style={{ minHeight: "100svh", paddingTop: 120, paddingBottom: 80 }}
      >
        <div className="aurora" />
        <div className="relative z-10 mx-auto max-w-3xl px-5 md:px-8 text-center">
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
            className="mt-10 mx-auto text-foreground/70 leading-relaxed text-left md:text-center"
            style={{ maxWidth: 680 }}
          >
            <Reveal delay={200}>
              <p>
                Every day, thousands of videos are uploaded, watched for three seconds, and forgotten. Brands lose customers they never knew they had. Creators lose audiences they worked years to build. Founders watch their best ideas go unnoticed, not because the world didn&rsquo;t care, but because the content didn&rsquo;t connect.
              </p>
            </Reveal>
            <Reveal delay={280}>
              <p className="mt-6 font-display text-2xl md:text-3xl tracking-tight text-white">
                Three seconds.
                <br />
                <span className="text-[var(--accent)]">That&rsquo;s all you get.</span>
              </p>
            </Reveal>
            <Reveal delay={360}>
              <p className="mt-6">
                The wrong cut. The wrong pace. The wrong color. That&rsquo;s all it takes to lose someone forever.
              </p>
            </Reveal>
            <Reveal delay={420}>
              <p className="mt-6">
                We started Jepy because we&rsquo;ve seen what bad editing costs — not just in views, but in businesses. Every frame has potential. Every story deserves to be felt, not just seen.
              </p>
            </Reveal>
            <Reveal delay={480}>
              <p className="mt-6">
                That&rsquo;s the problem we solve. Every edit. Every client. Every time.
              </p>
            </Reveal>
          </div>
        </div>
        <ScrollIndicator />
      </section>

      {/* FOUNDERS */}
      <section className="relative py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <h2 className="font-display text-5xl md:text-7xl tracking-tighter text-center">
              The Obsessives <span className="text-[var(--accent)] text-glow">Behind Your Content</span>
            </h2>
          </Reveal>

          <div className="mt-20 grid gap-20">
            {/* Founder 1 */}
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
              <SlideIn from="left">
                <PhotoPlaceholder src="https://picsum.photos/seed/radwan/400/400" alt="Radwan Islam" />
              </SlideIn>
              <SlideIn from="right" delay={120}>
                <div>
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>
                    Radwan Islam
                  </h3>
                  <div style={{ fontSize: 14, color: "#00FF00", marginTop: 4 }}>
                    Co-Founder &amp; CEO
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

            {/* Founder 2 */}
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
              <SlideIn from="left" delay={120}>
                <div className="md:order-1 order-2">
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
              <SlideIn from="right">
                <PhotoPlaceholder src="https://picsum.photos/seed/sojol/400/400" alt="Sojol Sheikh" />
              </SlideIn>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT DRIVES US */}
      <section className="relative py-24 md:py-32">
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
      <section className="relative py-24 md:py-32">
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
          <div
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: "1fr",
              gridTemplateAreas: `"a" "b" "c" "d"`,
            }}
            className="studio-grid"
          >
            <StudioTile area="a" label="Studio Frame 01" delay={0} />
            <StudioTile area="b" label="Studio Frame 02" delay={150} />
            <StudioTile area="c" label="Studio Frame 03" delay={300} />
            <StudioTile area="d" label="Studio Frame 04" delay={450} />
          </div>
          <style>{`
            @media (min-width: 768px) {
              .studio-grid {
                grid-template-columns: 2fr 1fr !important;
                grid-template-areas:
                  "a b"
                  "c d" !important;
              }
              .studio-grid > *:nth-child(1),
              .studio-grid > *:nth-child(4) { min-height: 360px; }
              .studio-grid > *:nth-child(2),
              .studio-grid > *:nth-child(3) { min-height: 360px; }
              .studio-grid {
                grid-template-areas:
                  "a b"
                  "c d" !important;
              }
            }
          `}</style>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24">
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
