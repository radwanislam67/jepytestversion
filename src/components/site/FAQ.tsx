import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/site/Reveal";

const FAQS = [
  { q: "How fast can you deliver?", a: "Most projects delivered within 5 to 7 business days. Rush delivery available on request." },
  { q: "Do you work with small budgets?", a: "Yes. We started working with small creators and still do. Let us talk about what works for you." },
  { q: "What types of videos do you make?", a: "Short-form reels, YouTube edits, brand films, commercial ads, and motion graphics." },
  { q: "How many revisions do I get?", a: "Unlimited revisions until you are happy with the result." },
  { q: "How do we get started?", a: "Click Get Started, fill out the brief, and we will reply within 24 hours." },
];

export function FAQ() {
  return (
    <section id="faq" className="relative py-16 md:py-20 scroll-mt-24">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <Reveal>
          <h2 className="font-display text-4xl md:text-6xl tracking-tighter text-center mb-8">
            Frequently Asked <span className="text-[var(--accent)] text-glow">Questions</span>
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <Accordion type="single" collapsible className="w-full mt-8">
            {FAQS.map((f, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-b border-white/15 bg-white/[0.02] rounded-md px-4 mb-2 hover:bg-white/[0.04] transition-colors"
              >
                <AccordionTrigger className="text-left text-base md:text-lg py-5 text-foreground/90 hover:text-[var(--accent)] [&>svg]:text-foreground/60 [&>svg]:h-5 [&>svg]:w-5">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/75 leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <span className="text-foreground/70">Still have questions?</span>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.16em]"
              style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
            >
              Let&rsquo;s Talk <ArrowUpRight size={16} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
