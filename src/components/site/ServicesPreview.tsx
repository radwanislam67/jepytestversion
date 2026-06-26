import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Film, Sparkles, Palette, Zap, Youtube, Megaphone } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

export const SERVICES = [
  { icon: Film, title: "Video Editing", desc: "Pacing, rhythm and storytelling crafted around your goal." },
  { icon: Sparkles, title: "Motion Design", desc: "Kinetic typography and animation that elevates every frame." },
  { icon: Palette, title: "Color Grading", desc: "Cinematic looks tailored to your brand and platform." },
  { icon: Zap, title: "Short Form Content", desc: "Hook-first edits engineered for retention and reach." },
  { icon: Youtube, title: "YouTube Editing", desc: "Long-form edits that grow channels and keep viewers." },
  { icon: Megaphone, title: "Commercial Ads", desc: "High-conversion ad creatives for paid and organic." },
];

export function ServicesPreview() {
  return (
    <section id="services" className="relative py-16 md:py-20 scroll-mt-24">
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
                className="group h-full rounded-2xl border border-white/10 p-7 transition-all duration-500 hover:border-[var(--accent)]/60 hover:-translate-y-1"
                style={{ background: "rgba(11,11,11,0.65)" }}
              >
                <div
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl mb-5"
                  style={{
                    background: "rgba(83,255,47,0.08)",
                    color: "var(--accent)",
                    border: "1px solid rgba(83,255,47,0.25)",
                  }}
                >
                  <s.icon size={20} />
                </div>
                <h3 className="font-display text-2xl tracking-tight mb-2">{s.title}</h3>
                <p className="text-sm text-foreground/70 leading-relaxed">{s.desc}</p>
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
