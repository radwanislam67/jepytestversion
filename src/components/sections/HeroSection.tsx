import { ArrowUpRight, Play } from "lucide-react";
import { Particles } from "@/components/site/Particles";
import { Reveal } from "@/components/site/Reveal";
import { Magnetic } from "@/components/site/Magnetic";
import { scrollToSection } from "@/lib/scrollToSection";

const FLOATING = ["VIDEO EDITING", "MOTION DESIGN", "COMMERCIAL ADS", "SHORT FORM", "YOUTUBE EDITING", "COLOR GRADING"];

export function HeroSection() {
  return (
    <section id="home" className="relative min-h-[100svh] flex items-center overflow-hidden pt-32 pb-20">
      <div className="aurora" />
      <Particles count={36} />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#050505_85%)]" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8 w-full">
        <Reveal delay={100}>
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-foreground/70">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]" />
            Cinematic Post-Production Studio
          </div>
        </Reveal>
        <h1 className="mt-8 font-display text-[14vw] md:text-[10vw] leading-[0.92] tracking-[-0.04em]">
          <Reveal>Your Content,</Reveal>
          <Reveal delay={120}>
            <span className="text-[var(--accent)] text-glow">Elevated.</span>
          </Reveal>
        </h1>
        <Reveal delay={260}>
          <p className="mt-8 max-w-xl text-base md:text-lg text-foreground/70 leading-relaxed">
            We craft cinematic edits and visual experiences for creators, brands and SaaS companies that demand attention.
          </p>
        </Reveal>
        <Reveal delay={360}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Magnetic>
              <a href="#work" onClick={(e) => { e.preventDefault(); scrollToSection("work"); }} className="btn-primary">
                View Work <ArrowUpRight size={18} />
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection("contact"); }} className="btn-ghost">
                <Play size={16} /> Book A Call
              </a>
            </Magnetic>
          </div>
        </Reveal>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3 max-w-3xl">
          {FLOATING.map((w, i) => (
            <Reveal key={w} delay={500 + i * 70}>
              <div className="font-display text-xs md:text-sm tracking-[0.3em] text-foreground/40 hover:text-[var(--accent)] transition-colors">
                — {w}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] text-foreground/40 font-mono">
        Scroll
      </div>
    </section>
  );
}
