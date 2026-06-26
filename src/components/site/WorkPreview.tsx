import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Play } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { VideoModal } from "@/components/site/VideoModal";

export const WORK_ITEMS = [
  { id: "p1", title: "Northwave — Brand Film", category: "Commercial Ads", youtubeId: "dQw4w9WgXcQ" },
  { id: "p2", title: "Lumen — Product Reel", category: "Motion Design", youtubeId: "dQw4w9WgXcQ" },
  { id: "p3", title: "Octave — Creator Series", category: "YouTube Editing", youtubeId: "dQw4w9WgXcQ" },
  { id: "p4", title: "Vanta — Short Form", category: "Short Form", youtubeId: "dQw4w9WgXcQ" },
];

export function WorkPreview() {
  const [active, setActive] = useState<string | null>(null);
  const current = WORK_ITEMS.find((w) => w.id === active);

  return (
    <section id="work" className="relative py-16 md:py-20 scroll-mt-24">
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

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          {WORK_ITEMS.map((w, i) => (
            <Reveal key={w.id} delay={i * 120}>
              <button
                type="button"
                onClick={() => setActive(w.id)}
                className="group relative block w-full text-left aspect-video rounded-2xl overflow-hidden border border-gray-800 transition-all duration-300 hover:scale-105 hover:border-[var(--accent)]/60 hover:shadow-[0_0_60px_-10px_rgba(83,255,47,0.5)]"
                style={{
                  background: "linear-gradient(135deg, #111827, #000000)",
                }}
              >
                <div
                  className="absolute inset-0 transition-opacity duration-500 opacity-60 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(83,255,47,0.15), transparent 70%)",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(83,255,47,0.8)]">
                    <Play size={18} fill="currentColor" />
                  </div>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-4 flex items-end justify-between gap-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="text-lg font-bold text-white">{w.title}</div>
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

        <div className="mt-8 text-center">
          <Link
            to="/work"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[var(--accent)] text-[var(--accent)] bg-transparent font-medium transition-colors duration-200 hover:bg-[var(--accent)] hover:text-black"
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
