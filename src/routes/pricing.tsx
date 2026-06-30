import { createFileRoute } from "@tanstack/react-router";
import { Pricing } from "@/components/site/Pricing";
import { CTASection } from "@/components/site/CTASection";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing | Jepy" },
      { name: "description", content: "Transparent pricing. Flexible for every budget." },
      { property: "og:title", content: "Pricing | Jepy" },
      { property: "og:description", content: "Transparent pricing. Flexible for every budget." },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <div className="pt-32 md:pt-36">
      <Pricing />
      <CTASection />
    </div>
  );
}
