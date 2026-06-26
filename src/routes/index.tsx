import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Play } from "lucide-react";
import { Particles } from "@/components/site/Particles";
import { Reveal } from "@/components/site/Reveal";
import { Marquee } from "@/components/site/Marquee";
import { Magnetic } from "@/components/site/Magnetic";
import { Showreel } from "@/components/site/Showreel";
import { Stats } from "@/components/site/Stats";
import { WhatGoesIn } from "@/components/site/WhatGoesIn";
import { WorkPreview } from "@/components/site/WorkPreview";
import { ServicesPreview } from "@/components/site/ServicesPreview";
import { Pricing } from "@/components/site/Pricing";
import { Reviews } from "@/components/site/Reviews";
import { FAQ } from "@/components/site/FAQ";
import { CTASection } from "@/components/site/CTASection";
import { ShowreelCTA } from "@/components/site/ShowreelCTA";
import { Typewriter } from "@/components/site/Typewriter";
import { HowItWorks } from "@/components/site/HowItWorks";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jepy — Your Content, Elevated." },
      { name: "description", content: "Cinematic edits, motion design and color for creators, brands and SaaS that demand attention." },
      { property: "og:title", content: "Jepy — Your Content, Elevated." },
      { property: "og:description", content: "Cinematic post-production for creators, brands and SaaS." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});



function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Showreel />
      <ShowreelCTA />
      <Stats />
      <WhatGoesIn />
      <ServicesPreview />
      <WorkPreview />
      <HowItWorks />
      <Pricing />
      <Reviews />
      <FAQ />
      <CTASection />
    </>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden pt-32 pb-20">
      <div className="aurora" />
      <Particles count={36} />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#050505_85%)]" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8 w-full">
        <h1 className="font-display text-[14vw] md:text-[10vw] leading-[0.92] tracking-[-0.04em]">
          <Reveal>Your Content,</Reveal>
          <Reveal delay={600} y={32}>
            <span className="text-[var(--accent)] text-glow">Elevated.</span>
          </Reveal>
        </h1>
        <Reveal delay={260}>
          <p className="mt-8 max-w-xl text-base md:text-lg text-foreground/70 leading-relaxed">
            Raw footage to high-converting content<br />
            for creators, brands, and SaaS teams worldwide.
          </p>
        </Reveal>
        <Reveal delay={360}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Magnetic>
              <Link to="/work" className="btn-primary">
                View Work <ArrowUpRight size={18} />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link to="/contact" className="btn-ghost">
                <Play size={16} /> Book A Call
              </Link>
            </Magnetic>
          </div>
        </Reveal>

        <Reveal delay={500}>
          <div className="mt-16 font-display text-2xl md:text-4xl tracking-tight text-foreground/90 min-h-[4.5rem] md:min-h-[5.5rem]">
            We craft <Typewriter />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
