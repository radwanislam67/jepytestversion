import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, Scissors, Wand2, Palette, Smartphone, Youtube, Megaphone, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { CTASection } from "@/components/site/CTASection";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Jepy" },
      { name: "description", content: "Video editing, motion design, color grading and more — engineered for retention and conversion." },
      { property: "og:title", content: "Services — Jepy" },
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
      <section className="relative pt-32 md:pt-36 pb-16 md:pb-20">
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
                  <span className="text-gray-400">
                    <span className="text-[var(--accent)] mr-1">✦</span>
                    {b}
                  </span>
                  {i < BADGES.length - 1 && (
                    <span className="hidden md:inline text-gray-700 mx-3">·</span>
                  )}
                </div>
              ))}
            </div>
          </Reveal>

          <div className="mt-16 rounded-3xl border border-gray-700/40 bg-gray-900/20 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SERVICES.map((s, i) => (
                <Reveal key={s.title} delay={i * 80}>
                  <div className="group flex h-full flex-col rounded-2xl border border-gray-800 bg-gray-900/50 p-6 transition-all duration-300 hover:border-gray-600 hover:scale-[1.02]">
                    <div
                      className="inline-flex h-12 w-12 items-center justify-center rounded-xl mb-4"
                      style={{
                        background: "rgba(83,255,47,0.08)",
                        color: "var(--accent)",
                        border: "1px solid rgba(83,255,47,0.25)",
                      }}
                    >
                      <s.icon size={22} />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">{s.title}</h3>
                    <p className="text-sm text-gray-400 mb-4">{s.desc}</p>
                    <ul className="flex flex-col gap-2 text-sm text-gray-500">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2">
                          <Check size={14} className="mt-0.5 text-[var(--accent)] shrink-0" /> {b}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto pt-4">
                      <Link
                        to="/work"
                        className="inline-flex items-center gap-1 text-sm text-green-400 hover:text-green-300 transition-colors"
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
      <CTASection />
      <div className="-mt-10 mb-16 text-center">
        <a href="/#pricing" className="btn-ghost">
          View Pricing →
        </a>
      </div>
    </>
  );
}
