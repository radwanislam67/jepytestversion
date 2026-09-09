import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, Scissors, Wand2, Palette, Smartphone, Youtube, Megaphone, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { CTASection } from "@/components/site/CTASection";

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
};

const SERVICES: Service[] = [
  {
    title: "Video Editing",
    icon: Scissors,
    desc: "Pacing, rhythm and storytelling crafted around your goal.",
    bullets: ["Story-first cuts", "Rhythm & pacing", "Sound polish", "Up to 4K delivery"],
  },
  {
    title: "Motion Design",
    icon: Wand2,
    desc: "Kinetic typography and animation that elevates every frame.",
    bullets: ["Kinetic typography", "Logo animation", "Custom transitions", "After Effects workflows"],
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
  },
];

const BADGES = ["48h Turnaround", "Unlimited Revisions", "14-Day Guarantee", "Dedicated Editor"];

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
              {SERVICES.map((s, i) => (
                <Reveal key={s.title} delay={i * 80}>
                  <div
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 p-6 transition-all duration-300 hover:border-[rgba(48, 217, 75,0.6)] hover:-translate-y-0.5 hover:scale-[1.02]"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.015))",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,.06), 0 30px 60px -30px rgba(0,0,0,.8)",
                    }}
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 top-0 h-[2px]"
                      style={{
                        background:
                          "linear-gradient(to right, rgba(48, 217, 75,0.9), rgba(48, 217, 75,0))",
                      }}
                    />
                    <div
                      className="inline-flex h-12 w-12 items-center justify-center rounded-xl mb-4 transition-transform duration-200 ease-out group-hover:scale-110"
                      style={{
                        background: "rgba(48, 217, 75,0.08)",
                        color: "var(--accent)",
                        border: "1px solid rgba(48, 217, 75,0.25)",
                        boxShadow: "0 0 20px rgba(48, 217, 75,0.3)",
                      }}
                    >
                      <s.icon size={22} />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">{s.title}</h3>
                    <p className="text-sm text-[#a3a3a3] mb-4">{s.desc}</p>
                    <ul className="flex flex-col gap-2 text-sm text-foreground/70">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2">
                          <Check size={14} className="mt-0.5 text-[var(--accent)] shrink-0" /> {b}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto pt-4">
                      <Link
                        to="/work"
                        className="inline-flex items-center gap-1 text-sm text-[#30d94b] hover:text-[#d8ffdf] transition-colors"
                      >
                        See Examples <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </div>
                </Reveal>
              ))}
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
