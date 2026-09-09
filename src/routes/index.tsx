import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Play } from "lucide-react";
import { Particles } from "@/components/site/Particles";
import { Reveal } from "@/components/site/Reveal";
import { Marquee } from "@/components/site/Marquee";
import { Magnetic } from "@/components/site/Magnetic";
import { Showreel } from "@/components/site/Showreel";
import { Stats } from "@/components/site/Stats";
import { WhatGoesIn } from "@/components/site/WhatGoesIn";
import { StackedWork } from "@/components/site/StackedWork";
import { ServicesPreview } from "@/components/site/ServicesPreview";
import { Pricing } from "@/components/site/Pricing";
import { Reviews } from "@/components/site/Reviews";
import { FAQ } from "@/components/site/FAQ";
import { CTASection } from "@/components/site/CTASection";
import { ShowreelCTA } from "@/components/site/ShowreelCTA";
import { Typewriter } from "@/components/site/Typewriter";
import { HowItWorks } from "@/components/site/HowItWorks";
import { AboutPreview } from "@/components/site/AboutPreview";
import { HeroBeforeAfter } from "@/components/site/HeroBeforeAfter";




export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jepy | Built Different" },
      { name: "description", content: "Cinematic edits, motion design and color for creators, brands and SaaS that demand attention." },
      { property: "og:title", content: "Jepy | Built Different" },
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
      <StackedWork />
      <HowItWorks />
      <Pricing />
      <Reviews />
      <AboutPreview />
      <FAQ />
      <CTASection />
    </>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden pt-36 md:pt-40 pb-12 md:pb-16">
      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8 w-full flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16">
        <div className="flex-1 min-w-0">
          <h1 className="font-display font-semibold text-[clamp(2.75rem,11vw,3.75rem)] md:text-[clamp(3rem,6.5vw,6.75rem)] leading-[0.95] tracking-[-0.04em]">
            <Reveal>Every Frame</Reveal>
            <Reveal delay={600} y={32}>
              <span>
                Has A{" "}
                <span
                  className="text-glow"
                  style={{
                    backgroundImage:
                      "linear-gradient(94deg, #ffffff 30%, #d8ffdf 55%, #30d94b 110%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  Purpose.
                </span>
              </span>
            </Reveal>
          </h1>
          <Reveal delay={260}>
            <p className="mt-8 max-w-xl text-base md:text-lg text-foreground/70 leading-relaxed break-words">
              Short-form, YouTube and brand content, edited with intentional pacing, sound and motion.
            </p>
          </Reveal>
          <Reveal delay={360}>
            <div className="mt-10 flex flex-wrap items-center gap-6">
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

        <HeroBeforeAfter />
      </div>
    </section>
  );
}
