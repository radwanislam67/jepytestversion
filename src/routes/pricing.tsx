import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { Pricing } from "@/components/site/Pricing";
import { FAQ } from "@/components/site/FAQ";
import { CTASection } from "@/components/site/CTASection";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Jepy" },
      { name: "description", content: "Transparent pricing. Flexible for every budget." },
      { property: "og:title", content: "Pricing — Jepy" },
      { property: "og:description", content: "Transparent pricing. Flexible for every budget." },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <>
      <section className="relative pt-32 md:pt-36 pb-8 md:pb-12">
        <div className="mx-auto max-w-7xl px-5 md:px-8 text-center">
          <Reveal>
            <div className="text-xs uppercase tracking-[0.3em] text-[var(--accent)] mb-4">
              Pricing
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display text-6xl md:text-8xl tracking-tighter">
              Transparent <span className="text-[var(--accent)] text-glow">Pricing.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-5 text-foreground/70 text-lg max-w-2xl mx-auto">
              Flexible for every budget.
            </p>
          </Reveal>
        </div>
      </section>
      <Pricing />
      <FAQ />
      <CTASection />
    </>
  );
}
