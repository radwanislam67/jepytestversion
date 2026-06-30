import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Jepy" },
      { name: "description", content: "How Jepy collects, uses, and protects your data." },
      { property: "og:title", content: "Privacy Policy | Jepy" },
      { property: "og:description", content: "How Jepy collects, uses, and protects your data." },
    ],
  }),
  component: PrivacyPolicyPage,
});

const SECTIONS = [
  {
    title: "What We Collect",
    body:
      "We collect your name, email address, and project details — nothing more than what the work requires. If you share footage or files with us, those are stored securely and used only for your project.",
  },
  {
    title: "How We Use It",
    body:
      "Your information helps us deliver your project, send updates, and improve how we work. That's it. We don't use it for anything you haven't agreed to.",
  },
  {
    title: "What We Don't Do",
    body:
      "We don't sell your data. We don't share it with third parties without your permission. We don't use it for ads. Full stop.",
  },
  {
    title: "Cookies",
    body:
      "We use basic analytics to understand how people use our site. No invasive tracking. No third-party ad cookies.",
  },
  {
    title: "Your Rights",
    body:
      "You can access, edit, or delete your data at any time. Just email us at hello@jepy.studio and we'll handle it promptly.",
  },
  {
    title: "Contact",
    body: "For any privacy questions: hello@jepy.studio",
  },
];

function PrivacyPolicyPage() {
  return (
    <div className="relative bg-[#050505] text-white">
      <section className="pt-36 pb-16 md:pt-44 md:pb-20">
        <div className="mx-auto max-w-3xl px-5 md:px-8 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--accent)] mb-5">
            Privacy Policy
          </div>
          <h1 className="font-display text-4xl md:text-6xl tracking-tight leading-[1.05]">
            Your data. Your trust. Our responsibility.
          </h1>
          <p className="mt-6 text-foreground/70 text-base md:text-lg">
            We keep it simple. We keep it honest.
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
        </div>
      </section>

      <section className="relative pb-16 md:pb-20">
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
              <h2 className="font-display text-5xl md:text-7xl tracking-tighter">
                Questions? <span className="text-[var(--accent)] text-glow">Let's talk.</span>
              </h2>
              <p className="mt-6 text-foreground/70 max-w-xl mx-auto">
                We're real people. Reach out anytime.
              </p>
              <div className="mt-10">
                <a
                  href="mailto:hello@jepy.studio"
                  className="btn-primary transition-transform duration-200 hover:scale-105"
                >
                  Email Us →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
