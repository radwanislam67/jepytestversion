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
    <section id="faq" className="relative py-32 md:py-40 scroll-mt-24">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <Reveal>
          <h2 className="font-display text-4xl md:text-6xl tracking-tighter text-center mb-14">
            Frequently Asked <span className="text-[var(--accent)] text-glow">Questions</span>
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((f, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-white/10"
              >
                <AccordionTrigger className="text-left text-base md:text-lg py-5 hover:text-[var(--accent)]">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70 leading-relaxed">
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
