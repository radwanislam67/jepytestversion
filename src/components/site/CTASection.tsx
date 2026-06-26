import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Magnetic } from "@/components/site/Magnetic";

export function CTASection() {
  return (
    <section className="relative py-32">
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
                Ready to Elevate <br />
                <span className="text-[var(--accent)] text-glow">Your Content?</span>
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-6 text-foreground/70 max-w-xl mx-auto">
                Let&apos;s build something worth watching.
              </p>
            </Reveal>
            <Reveal delay={220}>
              <div className="mt-10">
                <Magnetic>
                  <Link to="/contact" className="btn-primary">
                    Start Your Project <ArrowUpRight size={18} />
                  </Link>
                </Magnetic>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
