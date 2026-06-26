import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Play } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { VideoModal } from "@/components/site/VideoModal";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Our Work — Jepy" },
      { name: "description", content: "Selected edits, films and motion work from the Jepy studio." },
      { property: "og:title", content: "Our Work — Jepy" },
      { property: "og:description", content: "Every frame tells a story." },
    ],
  }),
  component: WorkPage,
});

const ITEMS = [
  { id: "w1", title: "Northwave — Brand Film", category: "Commercial", youtubeId: "dQw4w9WgXcQ" },
  { id: "w2", title: "Lumen — Product Reel", category: "Motion Design", youtubeId: "dQw4w9WgXcQ" },
  { id: "w3", title: "Octave — Creator Series", category: "YouTube", youtubeId: "dQw4w9WgXcQ" },
  { id: "w4", title: "Strata — Shorts Sprint", category: "Short Form", youtubeId: "dQw4w9WgXcQ" },
  { id: "w5", title: "Halcyon — Launch Film", category: "Commercial", youtubeId: "dQw4w9WgXcQ" },
  { id: "w6", title: "Pixelrun — Promo", category: "Motion Design", youtubeId: "dQw4w9WgXcQ" },
];

function WorkPage() {
  const [active, setActive] = useState<string | null>(null);
  const current = ITEMS.find((i) => i.id === active);
  return (
    <section className="relative pt-32 md:pt-36 pb-16 md:pb-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <h1 className="font-display text-6xl md:text-8xl tracking-tighter">
            Our <span className="text-[var(--accent)] text-glow">Work</span>
          </h1>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-5 text-foreground/70 text-lg">Every frame tells a story.</p>
        </Reveal>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ITEMS.map((w, i) => (
            <Reveal key={w.id} delay={i * 80}>
              <button
                type="button"
                onClick={() => setActive(w.id)}
                className="group relative block w-full text-left aspect-video rounded-2xl overflow-hidden border border-white/10 transition-all duration-500 hover:scale-[1.02] hover:border-[var(--accent)]/60"
                style={{ background: "linear-gradient(135deg, #0a0a0a, #050505)" }}
              >
                <div
                  className="absolute inset-0 opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "radial-gradient(ellipse at center, rgba(83,255,47,0.18), transparent 70%)" }}
                />
                <div className="absolute inset-0 transition-shadow duration-500 group-hover:shadow-[0_0_60px_-10px_rgba(83,255,47,0.6)] rounded-2xl" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-14 w-14 rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                    <Play size={20} fill="currentColor" />
                  </div>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-5 flex items-end justify-between gap-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="text-base font-medium">{w.title}</div>
                  <span className="text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border border-[var(--accent)]/40 text-[var(--accent)]">
                    {w.category}
                  </span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
      <VideoModal
        open={!!current}
        onClose={() => setActive(null)}
        youtubeId={current?.youtubeId ?? ""}
        title={current?.title}
      />
    </section>
  );
}
