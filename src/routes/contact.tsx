import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useId, useRef, useState } from "react";
import { Mail, MessageCircle, Calendar, Check, ArrowUpRight, Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
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

const CONTACT_ENDPOINT = "/api/public/contact";
const CALENDLY_URL = "https://calendly.com/your-handle/intro";
const WHATSAPP_URL = "https://wa.me/10000000000";
const EMAIL = "hello@jepy.studio";

const EMPTY_FORM = {
  name: "", email: "", company: "", budget: "", deadline: "",
  preferred_time: "", timezone: "", project_details: "", message: "",
} as const;

const REQUIRED = "This field is required";

const schema = z.object({
  name: z.string().trim().min(1, REQUIRED).min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().min(1, REQUIRED).email("Please enter a valid email address").max(255),
  company: z.string().trim().min(1, REQUIRED).max(150),
  budget: z.string().trim().min(1, REQUIRED).max(100),
  deadline: z.string().trim().min(1, REQUIRED),
  preferred_time: z.string().trim().min(1, REQUIRED).max(150),
  timezone: z.string().trim().min(1, REQUIRED).max(100),
  project_details: z.string().trim().min(1, REQUIRED).max(500),
  message: z.string().trim().min(1, REQUIRED).min(10, "Message must be at least 10 characters").max(2000),
});

type FormValues = z.infer<typeof schema>;
type Errors = Partial<Record<keyof FormValues, string>>;

const FIELD_ORDER: (keyof FormValues)[] = [
  "name", "email", "company", "budget", "deadline", "timezone", "preferred_time", "project_details", "message",
];

function Contact() {
  const [values, setValues] = useState<FormValues>({
    name: "", email: "", company: "", budget: "", deadline: "",
    preferred_time: "", timezone: "", project_details: "", message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setValues((v) => ({ ...v, timezone: tz || "Asia/Dhaka" }));
    } catch {
      setValues((v) => ({ ...v, timezone: "Asia/Dhaka" }));
    }
  }, []);

  const setField = (k: keyof FormValues, v: string) => {
    setValues((prev) => ({ ...prev, [k]: v }));
    if (touched[k]) validateField(k, v);
  };

  const validateField = (k: keyof FormValues, v: string) => {
    const result = schema.shape[k].safeParse(v);
    setErrors((prev) => ({ ...prev, [k]: result.success ? undefined : result.error.issues[0].message }));
  };

  const onBlur = (k: keyof FormValues) => {
    setTouched((p) => ({ ...p, [k]: true }));
    validateField(k, values[k] ?? "");
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    const result = schema.safeParse(values);
    if (!result.success) {
      const next: Errors = {};
      const allTouched: Partial<Record<keyof FormValues, boolean>> = {};
      result.error.issues.forEach((iss) => {
        const k = iss.path[0] as keyof FormValues;
        if (!next[k]) next[k] = iss.message;
      });
      FIELD_ORDER.forEach((k) => { allTouched[k] = true; });
      setErrors(next);
      setTouched(allTouched);
      const firstKey = FIELD_ORDER.find((k) => next[k]);
      if (firstKey && formRef.current) {
        const el = formRef.current.querySelector<HTMLElement>(`[name="${firstKey}"]`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        el?.focus({ preventScroll: true });
      }
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(result.data),
      });
      if (!res.ok) throw new Error("Submission failed");
      setValues({ ...EMPTY_FORM });
      setErrors({});
      setTouched({});
      setDone(true);
      toast.success("Thank you! We'll review your brief and get back to you soon.", { duration: 5000 });
      setTimeout(() => setDone(false), 5000);
    } catch {
      toast.error("Something went wrong. Please try again.", { duration: 5000 });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-28 md:pt-36 pb-12 md:pb-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">Contact</div>
        <Reveal>
          <h1 className="font-display text-5xl sm:text-6xl md:text-[8rem] leading-[0.95] tracking-tighter">
            Tell us<br /><span className="text-[var(--accent)] text-glow">the story.</span>
          </h1>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-6 md:mt-8 max-w-[600px] text-base text-foreground/70">
            Share your project brief, or book a 20-minute intro call. We reply within 24 hours, worldwide.
          </p>
        </Reveal>

        <div className="mt-10 md:mt-16 grid lg:grid-cols-[1fr_1.4fr] gap-6 md:gap-10">
          <Reveal>
            <aside className="space-y-4">
              <a href={CALENDLY_URL} target="_blank" rel="noreferrer" className="group flex items-start gap-4 rounded-3xl border border-white/5 bg-[var(--surface)] p-6 hover:border-[var(--accent)]/40 transition-colors">
                <div className="h-11 w-11 rounded-2xl glass flex items-center justify-center text-[var(--accent)]"><Calendar size={18} /></div>
                <div className="flex-1">
                  <div className="font-display text-xl">Book a call</div>
                  <div className="text-sm text-muted-foreground">Pick a time — auto-detects your timezone.</div>
                  {values.timezone && <div className="text-xs mt-1 text-[var(--accent)]/80 font-mono">{values.timezone}</div>}
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
            <div className="relative rounded-3xl md:rounded-[32px] border border-white/5 bg-[var(--surface)] p-6 md:p-10 overflow-hidden">
              <div className="aurora opacity-40" />
              <div className="relative">
                {done ? (
                  <div className="py-16 text-center" role="status" aria-live="polite">
                    <div className="mx-auto h-16 w-16 rounded-full glow-ring flex items-center justify-center text-[var(--accent)]"><Check size={26} /></div>
                    <h2 className="mt-6 font-display text-3xl md:text-4xl tracking-tight">Brief received.</h2>
                    <p className="mt-3 text-foreground/70">We&apos;ll reply within 24 hours. Cinematic things ahead.</p>
                  </div>
                ) : (
                  <form ref={formRef} onSubmit={onSubmit} noValidate aria-busy={submitting} className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
                    <Field label="Name" name="name" required value={values.name} error={errors.name} onChange={(e) => setField("name", e.target.value)} onBlur={() => onBlur("name")} autoComplete="name" />
                    <Field label="Email" type="email" name="email" required value={values.email} error={errors.email} onChange={(e) => setField("email", e.target.value)} onBlur={() => onBlur("email")} autoComplete="email" inputMode="email" />
                    <Field label="Company" name="company" required value={values.company} error={errors.company} onChange={(e) => setField("company", e.target.value)} onBlur={() => onBlur("company")} autoComplete="organization" />
                    <SelectField label="Budget" name="budget" required value={values.budget} error={errors.budget} onChange={(e) => setField("budget", e.target.value)} onBlur={() => onBlur("budget")} placeholder="Select a range" options={["Under $5k", "$5k - $20k", "$20k - $50k", "$50k - $100k", "$100k+"]} />
                    <Field label="Deadline" type="date" name="deadline" required value={values.deadline} error={errors.deadline} onChange={(e) => setField("deadline", e.target.value)} onBlur={() => onBlur("deadline")} />
                    <SelectField label="Preferred meeting time" name="preferred_time" required value={values.preferred_time ?? ""} error={errors.preferred_time} onChange={(e) => setField("preferred_time", e.target.value)} onBlur={() => onBlur("preferred_time")} placeholder="Select preferred time" options={["Weekday mornings", "Weekday afternoons", "Weekends", "ASAP"]} />
                    <ComboField label="Timezone" name="timezone" required value={values.timezone} error={errors.timezone} onChange={(e) => setField("timezone", e.target.value)} onBlur={() => onBlur("timezone")} placeholder="Search timezone…" options={["Asia/Dhaka","Asia/Kolkata","Asia/Bangkok","Asia/Singapore","America/New_York","America/Los_Angeles","Europe/London","Europe/Paris","Australia/Sydney"]} />
                    <Field label="Project details" name="project_details" placeholder="Short-form, brand film, motion…" required value={values.project_details} error={errors.project_details} onChange={(e) => setField("project_details", e.target.value)} onBlur={() => onBlur("project_details")} />
                    <TextareaField
                      label="Message"
                      name="message"
                      required
                      rows={5}
                      value={values.message}
                      error={errors.message}
                      onChange={(e) => setField("message", e.target.value)}
                      onBlur={() => onBlur("message")}
                      className="md:col-span-2"
                    />
                    <div className="md:col-span-2 flex flex-col gap-4 pt-2">
                      <p className="text-xs text-muted-foreground max-w-sm">By submitting, you agree to be contacted about your project. No spam, ever.</p>
                      <button
                        type="submit"
                        disabled={submitting}
                        aria-busy={submitting}
                        className="w-full h-12 px-6 py-3 inline-flex items-center justify-center gap-2 rounded-full bg-[#53FF2F] text-[#050505] font-semibold transition-all duration-200 hover:scale-105 hover:brightness-110 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#050505] focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {submitting ? (<><Loader2 size={16} className="animate-spin" aria-hidden="true" /> Sending...</>) : (<>Send Brief <ArrowUpRight size={16} aria-hidden="true" /></>)}
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

function Label({ children, required, htmlFor }: { children: React.ReactNode; required?: boolean; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-semibold text-[#f3f4f6] mb-2 inline-block">
      {children}
      {required && <span className="text-red-400 ml-1" aria-hidden="true">*</span>}
      {required && <span className="sr-only"> (required)</span>}
    </label>
  );
}

function ErrorText({ id, children }: { id: string; children: React.ReactNode }) {
  return <p id={id} role="alert" className="mt-1 text-xs text-red-400">{children}</p>;
}

const fieldBase = (error?: string) =>
  `w-full mt-2 h-11 rounded-2xl border-2 ${error ? "border-red-500" : "border-green-500"} bg-background px-4 py-2 text-base text-white placeholder:text-gray-400 outline-none focus:border-green-300 focus:ring-2 focus:ring-green-400 focus:outline-none transition-colors`;

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string };

function Field({ label, className, required, error, id, ...rest }: FieldProps) {
  const auto = useId();
  const inputId = id ?? auto;
  const errorId = `${inputId}-error`;
  return (
    <div>
      <Label required={required} htmlFor={inputId}>{label}</Label>
      <input
        {...rest}
        id={inputId}
        required={required}
        aria-required={required || undefined}
        aria-invalid={!!error || undefined}
        aria-describedby={error ? errorId : undefined}
        className={`${fieldBase(error)} ${className ?? ""}`}
      />
      {error && <ErrorText id={errorId}>{error}</ErrorText>}
    </div>
  );
}

type SelectFieldProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string; error?: string; options: string[]; placeholder?: string;
};

function SelectField({ label, required, error, options, placeholder, value, id, ...rest }: SelectFieldProps) {
  const auto = useId();
  const inputId = id ?? auto;
  const errorId = `${inputId}-error`;
  return (
    <div>
      <Label required={required} htmlFor={inputId}>{label}</Label>
      <select
        {...rest}
        id={inputId}
        required={required}
        aria-required={required || undefined}
        value={value}
        aria-invalid={!!error || undefined}
        aria-describedby={error ? errorId : undefined}
        className={`${fieldBase(error)} appearance-none pr-10 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2353FF2F%22 stroke-width=%222%22><polyline points=%226 9 12 15 18 9%22/></svg>')] bg-no-repeat bg-[right_1rem_center] ${!value ? "text-gray-400" : "text-white"}`}
      >
        <option value="" disabled className="text-gray-400 bg-background">{placeholder ?? "Select…"}</option>
        {options.map((o) => (
          <option key={o} value={o} className="text-white bg-background">{o}</option>
        ))}
      </select>
      {error && <ErrorText id={errorId}>{error}</ErrorText>}
    </div>
  );
}

type ComboFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string; error?: string; options: string[];
};

function ComboField({ label, required, error, options, name, id, ...rest }: ComboFieldProps) {
  const auto = useId();
  const inputId = id ?? auto;
  const listId = `${inputId}-list`;
  const errorId = `${inputId}-error`;
  return (
    <div>
      <Label required={required} htmlFor={inputId}>{label}</Label>
      <input
        {...rest}
        id={inputId}
        name={name}
        list={listId}
        required={required}
        aria-required={required || undefined}
        autoComplete="off"
        aria-invalid={!!error || undefined}
        aria-describedby={error ? errorId : undefined}
        className={fieldBase(error)}
      />
      <datalist id={listId}>
        {options.map((o) => <option key={o} value={o} />)}
      </datalist>
      {error && <ErrorText id={errorId}>{error}</ErrorText>}
    </div>
  );
}

type TextareaFieldProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string };

function TextareaField({ label, required, error, className, id, ...rest }: TextareaFieldProps) {
  const auto = useId();
  const inputId = id ?? auto;
  const errorId = `${inputId}-error`;
  return (
    <div className={className}>
      <Label required={required} htmlFor={inputId}>{label}</Label>
      <textarea
        {...rest}
        id={inputId}
        required={required}
        aria-required={required || undefined}
        aria-invalid={!!error || undefined}
        aria-describedby={error ? errorId : undefined}
        className={`w-full mt-2 min-h-24 resize-none rounded-2xl border-2 ${error ? "border-red-500" : "border-green-500"} bg-background px-4 py-2 text-base text-white placeholder:text-gray-400 outline-none focus:border-green-300 focus:ring-2 focus:ring-green-400 focus:outline-none transition-colors`}
      />
      {error && <ErrorText id={errorId}>{error}</ErrorText>}
    </div>
  );
}
