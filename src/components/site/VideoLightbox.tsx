import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Pause, Play, RotateCcw, Volume2, VolumeX, X } from "lucide-react";
import { useProtectedVideo } from "@/hooks/useProtectedVideo";
import { useAudioBus } from "@/lib/audioBus";
import { PROTECTED_VIDEO_PROPS } from "@/components/site/VideoWatermark";

export interface LightboxItem {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  afterKey: string;
  /** When present the viewer gets a BEFORE / AFTER switch. */
  beforeKey?: string;
}

/**
 * Fullscreen video viewer: the page blurs behind it, one clip plays on its own and
 * loops, and a floating pill bar carries mute / replay / pause / close. Every control
 * is always visible and always inside the viewport — including on phones, where the
 * old inline transport bar used to sit far below the fold.
 */
export function VideoLightbox({ item, onClose }: { item: LightboxItem; onClose: () => void }) {
  // The portal (and therefore the <video>) only exists on the client, so mount the
  // stage in a second pass — the hook binds its ref in an effect and would otherwise
  // see a null element and never attach a source.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <LightboxStage item={item} onClose={onClose} />;
}

function LightboxStage({ item, onClose }: { item: LightboxItem; onClose: () => void }) {
  const [side, setSide] = useState<"after" | "before">("after");
  const activeKey = side === "before" && item.beforeKey ? item.beforeKey : item.afterKey;

  const { videoRef, ready, poster } = useProtectedVideo(activeKey);
  const [entered, setEntered] = useState(false);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const closing = useRef(false);

  const audio = useAudioBus(videoRef, () => setMuted(true));

  const requestClose = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    setEntered(false);
    window.setTimeout(onClose, 200);
  }, [onClose]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

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

  // Keep the element in step with the controls, and restart when the side flips.
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

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    if (!paused) void v.play().catch(() => {});
    // Only on side change — muted/paused are handled by the effect above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey]);

  const replay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    setPaused(false);
    void v.play().catch(() => {});
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !v.muted;
    v.muted = next;
    setMuted(next);
    if (next) audio.release();
    else audio.claim();
  };

  const hasBeforeAfter = Boolean(item.beforeKey);

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center gap-3 p-3 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-xl transition-opacity duration-200"
        style={{ opacity: entered ? 1 : 0 }}
        onClick={requestClose}
      />

      <div
        className="relative z-10 flex min-h-0 w-full flex-1 flex-col items-center justify-center gap-3"
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? "scale(1)" : "scale(.88)",
          transitionTimingFunction: "cubic-bezier(.22,1,.36,1)",
          transitionProperty: "opacity, transform",
          transitionDuration: "420ms",
        }}
      >
        <div
          className="relative min-h-0 overflow-hidden rounded-2xl"
          style={{
            background: "#0d0d0d",
            border: "1px solid rgba(48,217,75,.28)",
            boxShadow: "0 0 120px -30px rgba(48,217,75,.45), inset 0 1px 0 rgba(255,255,255,.06)",
          }}
        >
          <video
            ref={videoRef}
            loop
            playsInline
            preload="auto"
            poster={poster}
            className="block object-contain"
            style={{ maxHeight: "calc(100svh - 140px)", maxWidth: "min(94vw, 760px)" }}
            {...PROTECTED_VIDEO_PROPS}
          />
        </div>

        <div className="flex max-w-full flex-wrap items-center justify-center gap-1 rounded-full bg-black/65 px-2 py-2 ring-1 ring-white/15 backdrop-blur-md">
          {hasBeforeAfter && (
            <>
              <button
                type="button"
                onClick={() => setSide((s) => (s === "before" ? "after" : "before"))}
                aria-label={side === "before" ? "Show the edited version" : "Show the original version"}
                className="mr-1 inline-flex items-center rounded-full border border-[rgba(48,217,75,.45)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#d8ffdf] transition hover:bg-white/10"
              >
                {side === "before" ? "Before" : "After"}
              </button>
              <span className="mx-1 h-6 w-px bg-white/15" aria-hidden />
            </>
          )}
          <button
            type="button"
            onClick={toggleMute}
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

        {item.subtitle && (
          <p className="max-w-lg text-center text-xs text-white/60">{item.subtitle}</p>
        )}
      </div>
    </div>,
    document.body,
  );
}
