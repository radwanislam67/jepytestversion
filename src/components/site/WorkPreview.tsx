import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Play } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { VideoModal } from "@/components/site/VideoModal";

export const WORK_ITEMS = [
  {
    id: "p1",
    title: "Northwave — Brand Film",
    subtitle: "Cinematic brand story for a premium lifestyle label.",
    category: "Commercial Ads",
    youtubeId: "dQw4w9WgXcQ",
    gradient: "linear-gradient(135deg, #1f2937, #030712)",
    thumbnail: "https://images.unsplash.com/photo-1536240478700-b869ad10e2ab?w=800",
  },
  {
    id: "p2",
    title: "Lumen — Product Reel",
    subtitle: "High-energy product showcase with motion graphics.",
    category: "Motion Design",
    youtubeId: "dQw4w9WgXcQ",
    gradient: "linear-gradient(135deg, #111827, rgba(5,46,22,0.2))",
  },
  {
    id: "p3",
    title: "Octave — Creator Series",
    subtitle: "Long-form YouTube series edited for retention.",
    category: "YouTube Editing",
    youtubeId: "dQw4w9WgXcQ",
    gradient: "linear-gradient(135deg, #1f2937, #111827)",
  },
];

export function WorkPreview() {
  const [active, setActive] = useState<string | null>(null);
  const current = WORK_ITEMS.find((w) => w.id === active);

  return (
    <section id="work" className="relative py-16 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--accent)] mb-4">
            Featured Work
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-display text-5xl md:text-7xl tracking-tighter text-left">
            Selected frames from <span className="text-[var(--accent)] text-glow">recent edits.</span>
          </h2>
        </Reveal>

        <div className="mt-16 rounded-3xl border border-gray-700/40 bg-gray-900/20 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WORK_ITEMS.map((w, i) => (
              <Reveal key={w.id} delay={i * 120}>
                <button
                  type="button"
                  onClick={() => setActive(w.id)}
                  className="group relative block w-full text-left rounded-2xl overflow-hidden border border-gray-700/50 transition-all duration-300 hover:scale-[1.02] hover:border-green-500/40 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]"
                >
                  <div
                    className="relative aspect-video"
                    style={
                      w.thumbnail
                        ? {
                            backgroundImage: `url(${w.thumbnail})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }
                        : { background: w.gradient }
                    }
                  >
                    {w.thumbnail && <div className="absolute inset-0 bg-black/40" />}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-10 w-10 rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] flex items-center justify-center transition-shadow duration-300 group-hover:shadow-[0_0_24px_rgba(83,255,47,0.7)]">
                        <Play size={14} fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-base font-medium text-white">{w.title}</div>
                      <div className="text-sm text-gray-400 mt-1">{w.subtitle}</div>
                    </div>
                    <span className="text-xs uppercase tracking-[0.15em] px-2 py-1 rounded-full border border-green-500/60 text-green-400 whitespace-nowrap">
                      {w.category}
                    </span>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
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
