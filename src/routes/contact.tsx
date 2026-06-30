import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, MessageCircle, Calendar, Check, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | Jepy" },
      { name: "description", content: "Start a project with Jepy. Send a brief, book a call, or reach us on WhatsApp." },
      { property: "og:title", content: "Contact | Jepy" },
      { property: "og:description", content: "Start a project with Jepy." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

const FORMSPREE_ENDPOINT = "https://formspree.io/f/your-form-id";
const CALENDLY_URL = "https://calendly.com/your-handle/intro";
const WHATSAPP_URL = "https://wa.me/10000000000";
const EMAIL = "hello@jepy.studio";

function Contact() {
  const [tz, setTz] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try { setTz(Intl.DateTimeFormat().resolvedOptions().timeZone); } catch {}
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const data = new FormData(form);
    if ((data.get("_gotcha") as string)?.length) return;
    setSubmitting(true);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!res.ok) throw new Error("Submission failed");
      setDone(true);
      form.reset();
    } catch {
      setError("Could not send. Email us directly at " + EMAIL);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-32 md:pt-36 pb-16 md:pb-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">Contact</div>
        <Reveal>
          <h1 className="font-display text-6xl md:text-[8rem] leading-[0.95] tracking-tighter">
            Tell us<br /><span className="text-[var(--accent)] text-glow">the story.</span>
          </h1>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-8 max-w-xl text-foreground/70">
            Share your project brief, or book a 20-minute intro call. We reply within 24 hours, worldwide.
          </p>
        </Reveal>

        <div className="mt-16 grid lg:grid-cols-[1fr_1.4fr] gap-10">
          <Reveal>
            <aside className="space-y-4">
              <a href={CALENDLY_URL} target="_blank" rel="noreferrer" className="group flex items-start gap-4 rounded-3xl border border-white/5 bg-[var(--surface)] p-6 hover:border-[var(--accent)]/40 transition-colors">
                <div className="h-11 w-11 rounded-2xl glass flex items-center justify-center text-[var(--accent)]"><Calendar size={18} /></div>
                <div className="flex-1">
                  <div className="font-display text-xl">Book a call</div>
                  <div className="text-sm text-muted-foreground">Pick a time — auto-detects your timezone.</div>
                  {tz && <div className="text-xs mt-1 text-[var(--accent)]/80 font-mono">{tz}</div>}
                </div>
                <ArrowUpRight size={18} className="text-foreground/60 group-hover:text-[var(--accent)] transition-colors" />
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="group flex items-start gap-4 rounded-3xl border border-white/5 bg-[var(--surface)] p-6 hover:border-[var(--accent)]/40 transition-colors">
                <div className="h-11 w-11 rounded-2xl glass flex items-center justify-center text-[var(--accent)]"><MessageCircle size={18} /></div>
                <div className="flex-1">
                  <div className="font-display text-xl">WhatsApp</div>
                  <div className="text-sm text-muted-foreground">Quick questions, fast answers.</div>
                </div>
                <ArrowUpRight size={18} className="text-foreground/60 group-hover:text-[var(--accent)] transition-colors" />
              </a>
              <a href={`mailto:${EMAIL}`} className="group flex items-start gap-4 rounded-3xl border border-white/5 bg-[var(--surface)] p-6 hover:border-[var(--accent)]/40 transition-colors">
                <div className="h-11 w-11 rounded-2xl glass flex items-center justify-center text-[var(--accent)]"><Mail size={18} /></div>
                <div className="flex-1">
                  <div className="font-display text-xl">Email</div>
                  <div className="text-sm text-muted-foreground">{EMAIL}</div>
                </div>
                <ArrowUpRight size={18} className="text-foreground/60 group-hover:text-[var(--accent)] transition-colors" />
              </a>
            </aside>
          </Reveal>

          <Reveal delay={100}>
            <div className="relative rounded-[32px] border border-white/5 bg-[var(--surface)] p-8 md:p-10 overflow-hidden">
              <div className="aurora opacity-40" />
              <div className="relative">
                {done ? (
                  <div className="py-16 text-center">
                    <div className="mx-auto h-16 w-16 rounded-full glow-ring flex items-center justify-center text-[var(--accent)]"><Check size={26} /></div>
                    <h2 className="mt-6 font-display text-3xl md:text-4xl tracking-tight">Brief received.</h2>
                    <p className="mt-3 text-foreground/70">We&apos;ll reply within 24 hours. Cinematic things ahead.</p>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" />
                    <Field label="Name" name="name" required />
                    <Field label="Email" type="email" name="email" required />
                    <Field label="Company" name="company" required />
                    <Field label="Budget" name="budget" placeholder="e.g. $5k–$20k" required />
                    <Field label="Deadline" type="date" name="deadline" required />
                    <Field label="Preferred meeting time" name="preferred_time" placeholder="e.g. Weekday mornings" />
                    <Field label="Timezone" name="timezone" value={tz} onChange={(e) => setTz(e.target.value)} required />
                    <Field label="Project details" name="project_details" placeholder="Short-form, brand film, motion…" required />
                    <div className="md:col-span-2">
                      <Label required>Message</Label>
                      <textarea name="message" rows={5} required className="w-full mt-2 rounded-2xl border border-white/10 bg-background px-4 py-3 outline-none focus:border-[var(--accent)] transition-colors" />
                    </div>
                    {error && <div className="md:col-span-2 text-sm text-red-400">{error}</div>}
                    <div className="md:col-span-2 flex items-center justify-between gap-4 pt-2">
                      <p className="text-xs text-muted-foreground max-w-sm">By submitting, you agree to be contacted about your project. No spam, ever.</p>
                      <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
                        {submitting ? "Sending…" : "Send brief"} <ArrowUpRight size={16} />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-sm font-semibold text-[#f3f4f6] mb-2 inline-block">
      {children}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, className, required, ...rest } = props;
  return (
    <div>
      <Label required={required}>{label}</Label>
      <input
        {...rest}
        required={required}
        className={`w-full mt-2 rounded-2xl border border-white/10 bg-background px-4 py-3 outline-none focus:border-[var(--accent)] transition-colors ${className ?? ""}`}
      />
    </div>
  );
}
