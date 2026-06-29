import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms-of-service")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Jepy" },
      { name: "description", content: "Clear terms for working with Jepy post-production." },
      { property: "og:title", content: "Terms of Service — Jepy" },
      { property: "og:description", content: "Clear terms for working with Jepy post-production." },
    ],
  }),
  component: TermsPage,
});

const SECTIONS = [
  {
    title: "What We Do (and Don't Do)",
    body:
      "Jepy is a post-production studio. We edit. We don't shoot. We work exclusively with footage, assets, and materials you provide. We do not offer filming, photography, voiceover recording, or creative concept development from scratch.\n\nWhat you bring: raw footage, existing assets, and a clear brief.\nWhat we deliver: edited, polished, publish-ready content.",
  },
  {
    title: "Payment",
    body:
      "Payment terms are agreed before work begins. We offer a 14-day satisfaction guarantee — if you're not happy within 14 days of delivery, we'll make it right or refund you. No hidden fees. No surprise charges.",
  },
  {
    title: "Your Content",
    body:
      "You own your footage and original assets. We own the edited output until final payment is received. Once payment clears, full ownership of the edited work transfers to you.",
  },
  {
    title: "Revisions",
    body:
      "Revision limits depend on your package. A revision means changes to the existing edit — not a new direction or concept. Unlimited revisions (where included) apply to the agreed scope of work.",
  },
  {
    title: "Confidentiality",
    body:
      "We don't share your project, footage, or any client information without your explicit permission. What's yours stays yours.",
  },
  {
    title: "Termination",
    body:
      "Either party can end the agreement with written notice. Work completed up to that point will be invoiced accordingly.",
  },
  {
    title: "Contact",
    body: "For any questions about these terms: hello@jepy.studio",
  },
];

function TermsPage() {
  return (
    <div className="relative bg-[#050505] text-white">
      <section className="pt-36 pb-16 md:pt-44 md:pb-20">
        <div className="mx-auto max-w-3xl px-5 md:px-8 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--accent)] mb-5">
            Terms of Service
          </div>
          <h1 className="font-display text-4xl md:text-6xl tracking-tight leading-[1.05]">
            Clear terms. No surprises.
          </h1>
          <p className="mt-6 text-foreground/70 text-base md:text-lg">
            We believe in straightforward agreements — for both sides.
          </p>
          <p className="mt-4 text-sm text-gray-500">Last updated: June 2026</p>
        </div>
      </section>

      <section className="pb-16 md:pb-20">
        <div className="mx-auto max-w-3xl px-5 md:px-8 space-y-5">
          {SECTIONS.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-gray-800 bg-white/[0.02] p-6 md:p-8"
            >
              <h2 className="text-white font-medium text-lg md:text-xl mb-3">{s.title}</h2>
              <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                {s.body}
              </p>
            </div>
          ))}

          <div className="pt-8 text-center">
            <p className="text-gray-400 text-sm">
              Questions?{" "}
              <a
                href="mailto:hello@jepy.studio"
                className="text-[var(--accent)] hover:underline"
              >
                Let's talk.
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
