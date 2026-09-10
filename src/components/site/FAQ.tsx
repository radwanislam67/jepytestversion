import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/site/Reveal";

const FAQS = [
  { q: "How fast can you deliver?", a: "Most projects delivered within 5 to 7 business days. Rush delivery available on request." },
  { q: "Do you work with small budgets?", a: "Yes. We started working with small creators and still do. Let us talk about what works for you." },
  { q: "What types of videos do you make?", a: "Short-form reels, YouTube edits, brand films, commercial ads, and motion graphics." },
  { q: "How many revisions do I get?", a: "Unlimited revisions until you are happy with the result." },
  { q: "How do we get started?", a: "Click Get Started, fill out the brief, and we will reply within 24 hours." },
];

const TYPE_MS = 700;

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number>(0);
  const [typing, setTyping] = useState<boolean>(false);

  useEffect(() => {
    if (!typing) return;
    const t = setTimeout(() => setTyping(false), TYPE_MS);
    return () => clearTimeout(t);
  }, [typing]);

  const handleClick = (i: number) => {
    if (openIndex === i) {
      setOpenIndex(-1);
      setTyping(false);
    } else {
      setOpenIndex(i);
      setTyping(true);
    }
  };

  return (
    <section id="faq" className="relative py-16 md:py-20 scroll-mt-24 section-light">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <h2 className="font-display text-4xl md:text-6xl tracking-tighter text-center mb-8">
            Frequently Asked <span className="text-[var(--accent)] text-glow">Questions</span>
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <div className="faqwrap">
            {FAQS.map((f, i) => {
              const isOpen = openIndex === i;
              const id = `faq-a-${i}`;
              return (
                <div key={i} style={{ display: "contents" }}>
                  <div className="faq-q-row">
                    <button
                      type="button"
                      className="faq-q"
                      aria-expanded={isOpen}
                      aria-controls={id}
                      onClick={() => handleClick(i)}
                    >
                      {f.q}
                    </button>
                  </div>
                  <div
                    id={id}
                    role="region"
                    data-open={isOpen ? "1" : "0"}
                    className="fa"
                  >
                    <div>
                      {typing && isOpen ? (
                        <div className="faq-typing" aria-hidden="true">
                          <span />
                          <span />
                          <span />
                        </div>
                      ) : (
                        <div className="faq-a">
                          <p>{f.a}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
