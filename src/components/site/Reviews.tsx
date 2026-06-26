import { Star, ChevronRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

function SummaryPill() {
  const avatars = ["#53FF2F", "#B8FF6A", "#8a8a8a", "#F7F7F7"];
  return (
    <div
      className="group inline-flex items-center gap-3 rounded-full transition-all duration-300 hover:shadow-[0_0_24px_color-mix(in_oklab,var(--accent)_45%,transparent)]"
      style={{
        background: "rgba(11,11,11,0.85)",
        border: "1px solid color-mix(in oklab, var(--accent) 35%, transparent)",
        padding: "10px 20px",
      }}
    >
      <div className="flex -space-x-2">
        {avatars.map((c, i) => (
          <span
            key={i}
            className="inline-block h-6 w-6 rounded-full border-2"
            style={{ background: c, borderColor: "#0b0b0b" }}
          />
        ))}
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={12} fill="#FFD700" stroke="#FFD700" />
        ))}
      </div>
      <span className="text-sm font-bold text-foreground">4.9</span>
      <span className="text-sm text-muted-foreground">50+ Clients Worldwide</span>
      <ChevronRight size={14} className="text-muted-foreground" />
    </div>
  );
}

const REVIEWS = [
  { quote: "Jepy turned six hours of raw footage into the most-watched launch film we've ever shipped.", name: "Amelia Reyes", company: "Northwave" },
  { quote: "Their color and motion work feels like cinema, not content. We won't edit anywhere else.", name: "Hiroshi Tanaka", company: "Lumen Labs" },
  { quote: "Every cut has intent. Our retention curves changed the week we started working with them.", name: "Priya Sharma", company: "Octave" },
  { quote: "Insanely fast turnaround without ever sacrificing quality. They get the brief instantly.", name: "Marcus Lee", company: "Strata" },
  { quote: "The hooks they craft made our short-form take off. 14M views in 30 days.", name: "Sofia Martinez", company: "Halcyon" },
  { quote: "From storyboard to final color, it just felt premium. Worth every dollar.", name: "Daniel Kim", company: "Pixelrun" },
];

function Card({ r }: { r: (typeof REVIEWS)[number] }) {
  return (
    <div
      className="shrink-0 rounded-xl border border-[var(--accent)]/30 p-6 mx-3 flex flex-col gap-4"
      style={{
        minWidth: "320px",
        maxWidth: "360px",
        background: "rgba(11,11,11,0.8)",
      }}
    >
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={14} fill="#FFD700" stroke="#FFD700" />
        ))}
      </div>
      <p className="text-sm text-foreground/85 leading-relaxed">&ldquo;{r.quote}&rdquo;</p>
      <div className="mt-auto">
        <div className="text-sm font-medium">{r.name}</div>
        <div className="text-xs text-muted-foreground">{r.company}</div>
      </div>
    </div>
  );
}

export function Reviews() {
  const row = [...REVIEWS, ...REVIEWS];
  return (
    <section id="reviews" className="relative py-32 md:py-40 scroll-mt-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 md:px-8 mb-14 text-center">
        <Reveal>
          <h2 className="font-display text-5xl md:text-7xl tracking-tighter">
            What <span className="text-[var(--accent)] text-glow">Clients Say</span>
          </h2>
        </Reveal>
      </div>
      <div className="relative">
        <div
          className="flex will-change-transform"
          style={{ animation: "marquee-left 50s linear infinite" }}
        >
          {row.map((r, i) => (
            <Card key={i} r={r} />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent" />
      </div>
    </section>
  );
}
