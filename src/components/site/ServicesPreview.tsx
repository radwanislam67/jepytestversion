import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Film, Sparkles, Palette, Zap, Youtube, Megaphone } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

export const SERVICES = [
  {
    icon: Film,
    title: "Video Editing",
    desc: "Pacing, rhythm and storytelling crafted around your goal.",
    bullets: ["Story-first cuts", "Rhythm & pacing", "Sound polish", "Up to 4K delivery"],
  },
  {
    icon: Sparkles,
    title: "Motion Design",
    desc: "Kinetic typography and animation that elevates every frame.",
    bullets: ["Kinetic typography", "Logo animation", "Custom transitions", "After Effects workflows"],
  },
  {
    icon: Palette,
    title: "Color Grading",
    desc: "Cinematic looks tailored to your brand and platform.",
    bullets: ["Custom LUTs", "Cinematic looks", "Skin tone protection", "HDR-ready delivery"],
  },
  {
    icon: Zap,
    title: "Short Form Content",
    desc: "Hook-first edits engineered for retention and reach.",
    bullets: ["Hook engineering", "Captioning", "Platform-native ratios", "Batch production"],
  },
  {
    icon: Youtube,
    title: "YouTube Editing",
    desc: "Long-form edits that grow channels and keep viewers.",
    bullets: ["Retention-driven cuts", "B-roll sourcing", "Thumbnail support", "Series consistency"],
  },
  {
    icon: Megaphone,
    title: "Commercial Ads",
    desc: "High-conversion ad creatives for paid and organic.",
    bullets: ["Concept & script", "Performance edits", "Multiple variants", "A/B-ready exports"],
  },
];

/** Same card language as the services page: number, icon tile, chips, and a way through. */
export function ServicesPreview() {
  return (
    <section id="services" className="relative py-16 md:py-20 scroll-mt-24 section-light">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <h2 className="font-display text-5xl md:text-7xl tracking-tighter text-center">
            What <span className="text-[var(--accent)] text-glow">We Do</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 80}>
              <div
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 p-6 transition-all duration-300 hover:border-[rgba(48,217,75,0.35)] hover:-translate-y-0.5"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.015))",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,.06), 0 30px 60px -30px rgba(0,0,0,.8)",
                }}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px"
                  style={{
                    background:
                      "linear-gradient(to right, rgba(48,217,75,0.45), rgba(48,217,75,0))",
                  }}
                />
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
                  {String(i + 1).padStart(2, "0")}
                </span>

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

              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[var(--accent)] text-[var(--accent)] bg-transparent font-medium transition-colors duration-200 hover:bg-[var(--accent)] hover:text-black"
          >
            View All Services <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
