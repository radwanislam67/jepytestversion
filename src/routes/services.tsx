import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Check } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { SERVICES } from "@/components/site/ServicesPreview";

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

const DETAIL: Record<string, string[]> = {
  "Video Editing": ["Story-first cuts", "Rhythm & pacing", "Sound polish", "Up to 4K delivery"],
  "Motion Design": ["Kinetic typography", "Logo animation", "Custom transitions", "After Effects workflows"],
  "Color Grading": ["Custom LUTs", "Cinematic looks", "Skin tone protection", "HDR-ready delivery"],
  "Short Form Content": ["Hook engineering", "Captioning", "Platform-native ratios", "Batch production"],
  "YouTube Editing": ["Retention-driven cuts", "B-roll sourcing", "Thumbnail support", "Series consistency"],
  "Commercial Ads": ["Concept & script", "Performance edits", "Multiple variants", "A/B-ready exports"],
};

function ServicesPage() {
  return (
    <section className="relative pt-32 md:pt-36 pb-16 md:pb-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <h1 className="font-display text-6xl md:text-8xl tracking-tighter">
            What <span className="text-[var(--accent)] text-glow">We Do</span>
          </h1>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-5 text-foreground/70 text-lg max-w-2xl">
            End-to-end post production for the channels and screens that matter most.
          </p>
        </Reveal>

        <div className="mt-20 flex flex-col gap-16">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 60}>
              <div className="grid md:grid-cols-[1fr_2fr] gap-8 md:gap-16 items-start border-t border-white/10 pt-12">
                <div className="flex items-start gap-4">
                  <div
                    className="inline-flex h-14 w-14 items-center justify-center rounded-xl shrink-0"
                    style={{
                      background: "rgba(83,255,47,0.08)",
                      color: "var(--accent)",
                      border: "1px solid rgba(83,255,47,0.25)",
                    }}
                  >
                    <s.icon size={22} />
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl tracking-tight">{s.title}</h2>
                </div>
                <div>
                  <p className="text-foreground/80 text-lg leading-relaxed">{s.desc}</p>
                  <ul className="mt-6 grid sm:grid-cols-2 gap-3 text-sm text-foreground/85">
                    {(DETAIL[s.title] ?? []).map((d) => (
                      <li key={d} className="flex items-start gap-2">
                        <Check size={16} className="mt-0.5 text-[var(--accent)] shrink-0" /> {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-24 text-center">
          <Reveal>
            <h3 className="font-display text-4xl md:text-5xl tracking-tighter">
              Ready to <span className="text-[var(--accent)] text-glow">get started?</span>
            </h3>
          </Reveal>
          <Reveal delay={120}>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em]"
              style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
            >
              Get Started <ArrowUpRight size={16} />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
