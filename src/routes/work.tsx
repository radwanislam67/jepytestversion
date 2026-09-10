import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Pause, Play, RotateCcw, Volume2, VolumeX, X } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Stats } from "@/components/site/Stats";
import { CTASection } from "@/components/site/CTASection";
import { useProtectedVideo } from "@/hooks/useProtectedVideo";
import { PROTECTED_VIDEO_PROPS } from "@/components/site/VideoWatermark";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Work | Jepy" },
      { name: "description", content: "Selected edits, films and motion work from the Jepy studio." },
      { property: "og:title", content: "Work | Jepy" },
      { property: "og:description", content: "Every frame tells a story." },
    ],
  }),
  component: WorkPage,
});

const ITEMS = [
  { id: "w1", title: "Property Film", subtitle: "A cinematic real estate film built to sell the space.", category: "Video Editing", afterKey: "After Aron.mp4" },
  { id: "w2", title: "AI Video Generation Tutorial", subtitle: "Fast-paced tutorial on generating videos with AI.", category: "Motion Design", afterKey: "Car After.mp4" },
  { id: "w3", title: "Finance Brand Film", subtitle: "Finance brand content cut for trust and retention.", category: "Commercial", afterKey: "Hadia After.mp4" },
  { id: "w4", title: "AI Video Shorts", subtitle: "Short-form AI clips, cut to stop the scroll.", category: "Short Form", afterKey: "Cris Cordio.mp4" },
];

const FILTERS = ["All", "Video Editing", "Motion Design", "Commercial", "Short Form"] as const;

/** Hover-to-preview only makes sense on a real pointer; touch devices jump straight to the lightbox. */
function useCanHover() {
  const [canHover, setCanHover] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  return canHover;
}

function WorkCard({
  item,
  onOpen,
}: {
  item: (typeof ITEMS)[number];
  onOpen: (item: (typeof ITEMS)[number]) => void;
}) {
  const { videoRef, ready, poster } = useProtectedVideo(item.afterKey);
  const canHover = useCanHover();
  const [hovered, setHovered] = useState(false);

  // Everything stays paused until the pointer is over the card. Hover is a quiet,
  // muted preview; the real viewing happens in the lightbox.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (hovered && canHover) {
      v.muted = true;
      void v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [hovered, canHover, videoRef]);

  return (
    <div
      id={`work-card-${item.id}`}
      className="group relative block w-full text-left overflow-hidden transition-all duration-200"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.015))",
        border: hovered ? "1px solid rgba(48,217,75,.3)" : "1px solid rgba(255,255,255,.1)",
        borderRadius: "12px",
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,.06), 0 30px 60px -30px rgba(0,0,0,.8)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        type="button"
        onClick={() => onOpen(item)}
        aria-label={`Play ${item.title}`}
        className="relative block w-full overflow-hidden text-left"
        style={{ aspectRatio: "9 / 16", background: "#0d0d0d", borderRadius: "10px" }}
      >
        <span className="absolute top-3 left-3 z-10 text-xs uppercase tracking-[0.15em] px-2 py-1 rounded-full border border-[rgba(48,217,75,.35)] text-[#d8ffdf] bg-[rgba(20,20,20,.55)] backdrop-blur-sm">
          {item.category}
        </span>
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          poster={poster}
          className="h-full w-full object-cover"
          style={{ opacity: ready || poster ? 1 : 0, transition: "opacity 250ms ease" }}
          {...PROTECTED_VIDEO_PROPS}
        />
        {/* Play affordance — hidden while the hover preview is rolling */}
        <span
          aria-hidden
          className="absolute inset-0 z-[5] flex items-center justify-center transition-opacity duration-200"
          style={{ opacity: hovered && canHover ? 0 : 1 }}
        >
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-md ring-1 ring-white/20 transition-transform duration-200 group-hover:scale-105">
            <Play size={22} />
          </span>
        </span>
      </button>
      <div className="p-4">
        <div className="text-base font-medium text-white">{item.title}</div>
        <div className="text-sm text-[#a3a3a3] mt-1 line-clamp-1">{item.subtitle}</div>
      </div>
    </div>
  );
}

/**
 * Fullscreen viewer: the backdrop blurs, the card's video zooms up on its own and
 * loops. Controls are unmute / replay / pause, and closing returns to the card the
 * viewer came from.
 */
function VideoLightbox({
  item,
  onClose,
}: {
  item: (typeof ITEMS)[number];
  onClose: () => void;
}) {
  const { videoRef, ready, poster } = useProtectedVideo(item.afterKey);
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const closing = useRef(false);

  const requestClose = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    setEntered(false);
    window.setTimeout(() => {
      onClose();
      document
        .getElementById(`work-card-${item.id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 220);
  }, [item.id, onClose]);

  // Portal target is only available on the client.
  useEffect(() => {
    setMounted(true);
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Lock the page behind the overlay.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [requestClose]);

  // Keep the element in sync with the three controls.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = muted;
    if (paused) {
      v.pause();
    } else {
      void v.play().catch(() => {});
    }
  }, [ready, muted, paused, videoRef]);

  if (!mounted) return null;

  const replay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    setPaused(false);
    void v.play().catch(() => {});
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-xl transition-opacity duration-200"
        style={{ opacity: entered ? 1 : 0 }}
        onClick={requestClose}
      />

      <div
        className="relative z-10 flex max-h-full flex-col items-center gap-4"
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? "scale(1)" : "scale(.86)",
          transitionTimingFunction: "cubic-bezier(.22,1,.36,1)",
          transitionDuration: "450ms",
        }}
      >
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            background: "#0d0d0d",
            border: "1px solid rgba(48,217,75,.28)",
            boxShadow: "0 0 120px -30px rgba(48,217,75,.45), inset 0 1px 0 rgba(255,255,255,.06)",
            maxHeight: "86vh",
          }}
        >
          <video
            ref={videoRef}
            loop
            playsInline
            preload="auto"
            poster={poster}
            className="block object-contain"
            style={{ maxHeight: "86vh", maxWidth: "min(92vw, 720px)" }}
            {...PROTECTED_VIDEO_PROPS}
          />
        </div>

        <div className="flex items-center gap-2 rounded-full bg-black/60 px-2 py-2 ring-1 ring-white/15 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? "Unmute video" : "Mute video"}
            aria-pressed={!muted}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white/10"
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button
            type="button"
            onClick={replay}
            aria-label="Replay video"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white/10"
          >
            <RotateCcw size={18} />
          </button>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Play video" : "Pause video"}
            aria-pressed={paused}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white/10"
          >
            {paused ? <Play size={18} /> : <Pause size={18} />}
          </button>
          <span className="mx-1 h-6 w-px bg-white/15" aria-hidden />
          <button
            type="button"
            onClick={requestClose}
            aria-label="Close video"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function WorkPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [active, setActive] = useState<(typeof ITEMS)[number] | null>(null);
  const visible = useMemo(
    () => (filter === "All" ? ITEMS : ITEMS.filter((i) => i.category === filter)),
    [filter],
  );

  return (
    <>
      <section className="relative pt-32 md:pt-36 pb-16 md:pb-20 section-light">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <h1 className="font-display text-6xl md:text-8xl tracking-tighter text-center">
              Our <span className="text-[var(--accent)] text-glow">Work</span>
            </h1>
          </Reveal>

          <div className="mt-8">
            <Stats />
          </div>

          <div className="mt-4 mb-8 flex flex-wrap gap-3 justify-center">
            {FILTERS.map((f) => {
              const isActive = f === filter;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={
                    "rounded-full px-4 py-1.5 text-sm transition-all duration-200 border " +
                    (isActive
                      ? "bg-[rgba(48,217,75,.12)] text-[#d8ffdf] border-[rgba(48,217,75,.35)]"
                      : "text-foreground/55 border-white/10 hover:text-foreground hover:border-white/30")
                  }
                >
                  {f}
                </button>
              );
            })}
          </div>

          <div className="rounded-3xl border border-white/10 bg-[rgba(255,255,255,.02)] p-6 transition-opacity duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((w, i) => (
                <Reveal key={w.id} delay={i * 80}>
                  <WorkCard item={w} onOpen={setActive} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Reveal delay={100}>
        <p className="text-center text-foreground/55 text-sm py-12">
          Trusted by creators and teams worldwide.
        </p>
      </Reveal>
      <CTASection />

      {active && <VideoLightbox item={active} onClose={() => setActive(null)} />}
    </>
  );
}
