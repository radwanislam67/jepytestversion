import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Play } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { VideoModal } from "@/components/site/VideoModal";

export const WORK_ITEMS = [
  { id: "p1", title: "Northwave — Brand Film", category: "Commercial Ads", youtubeId: "dQw4w9WgXcQ" },
  { id: "p2", title: "Lumen — Product Reel", category: "Motion Design", youtubeId: "dQw4w9WgXcQ" },
  { id: "p3", title: "Octave — Creator Series", category: "YouTube Editing", youtubeId: "dQw4w9WgXcQ" },
];

export function WorkPreview() {
  const [active, setActive] = useState<string | null>(null);
  const current = WORK_ITEMS.find((w) => w.id === active);

  return (
    <section id="work" className="relative py-32 md:py-40 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
            Featured Work
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-display text-5xl md:text-7xl tracking-tighter">
            Selected frames from <span className="text-[var(--accent)] text-glow">recent edits.</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {WORK_ITEMS.map((w, i) => (
            <Reveal key={w.id} delay={i * 120}>
              <button
                type="button"
                onClick={() => setActive(w.id)}
                className="group relative block w-full text-left aspect-video rounded-2xl overflow-hidden border border-white/10 transition-all duration-500 hover:scale-[1.02]"
                style={{
                  background:
                    "linear-gradient(135deg, #0a0a0a, #050505)",
                }}
              >
                <div
                  className="absolute inset-0 transition-all duration-500 group-hover:opacity-100 opacity-70"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(83,255,47,0.18), transparent 70%)",
                  }}
                />
                <div className="absolute inset-0 transition-shadow duration-500 group-hover:shadow-[0_0_60px_-10px_rgba(83,255,47,0.6)] group-hover:border-[var(--accent)]/60 border border-transparent rounded-2xl" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-14 w-14 rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                    <Play size={20} fill="currentColor" />
                  </div>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-5 flex items-end justify-between gap-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div>
                    <div className="text-base font-medium">{w.title}</div>
                  </div>
                  <span
                    className="text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border border-[var(--accent)]/40 text-[var(--accent)]"
                  >
                    {w.category}
                  </span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/work"
            className="inline-flex items-center gap-2 text-[var(--accent)] hover:underline"
          >
            View All Work <ArrowUpRight size={16} />
          </Link>
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
