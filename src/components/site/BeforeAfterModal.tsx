import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Volume2, VolumeX, X } from "lucide-react";
import { IpWatermark, PROTECTED_VIDEO_PROPS, VideoShield } from "@/components/site/VideoWatermark";
import { VideoSkeleton } from "@/components/site/VideoSkeleton";
import { ratioFor, useProtectedVideo, warmVideos } from "@/hooks/useProtectedVideo";
import { useAudioBus } from "@/lib/audioBus";
import type { WorkProject } from "@/components/site/work-data";

const tagPill: React.CSSProperties = {
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: 9,
  color: "#30d94b",
  border: "1px solid #30d94b",
  borderRadius: 20,
  padding: "3px 10px",
  background: "rgba(0,0,0,0.5)",
  letterSpacing: "0.1em",
};

const ctrlBtn: React.CSSProperties = {
  background: "transparent",
  border: "1px solid #333",
  color: "#888",
  borderRadius: 8,
  width: 34,
  height: 30,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "color .2s, border-color .2s",
};

/** BEFORE / AFTER sits inside its frame as a small chip — the usual pattern for a
 *  comparison viewer, and it keeps the panel short enough to fit without scrolling. */
const labelChip = (after: boolean): React.CSSProperties => ({
  position: "absolute",
  top: 8,
  left: 8,
  zIndex: 6,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: 9,
  letterSpacing: "0.14em",
  lineHeight: 1,
  padding: "4px 9px",
  borderRadius: 999,
  color: after ? "#30d94b" : "#dcdcdc",
  background: "rgba(0,0,0,.55)",
  border: `1px solid ${after ? "rgba(48,217,75,.55)" : "rgba(255,255,255,.22)"}`,
  backdropFilter: "blur(6px)",
  pointerEvents: "none",
});

/** The clips are anamorphic, so each frame takes its own on-screen ratio — a hard-coded
 *  9:16 crops whichever clip is not 9:16. */
const portraitFrameStyle = (ratio: string): React.CSSProperties => ({
  aspectRatio: ratio,
  // Height lives in .ba-frame so it can shrink on phones.
  width: "auto",
  background: "#0d0d0d",
  border: "1px solid #222",
  borderRadius: 10,
});

export function BeforeAfterModal({
  project,
  onClose,
}: {
  project: WorkProject;
  onClose: () => void;
}) {
  const { videoRef: beforeRef, ready: beforeReady, progress: beforeProgress } = useProtectedVideo(project.beforeKey);
  const { videoRef: afterRef, ready: afterReady, progress: afterProgress } = useProtectedVideo(project.afterKey);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const audio = useAudioBus(afterRef, () => setMuted(true));

  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState({ cur: 0, dur: 0 });

  // Warm both keys as soon as the modal opens
  useEffect(() => {
    void warmVideos([project.beforeKey, project.afterKey]);
  }, [project.beforeKey, project.afterKey]);

  // Escape to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Opening sequence: once both ready → reset and play both (muted)
  useEffect(() => {
    if (!beforeReady || !afterReady) return;
    const b = beforeRef.current;
    const a = afterRef.current;
    if (!b || !a) return;
    b.currentTime = 0;
    a.currentTime = 0;
    void b.play().catch(() => {});
    void a.play().catch(() => {});
    setPlaying(true);
  }, [beforeReady, afterReady, beforeRef, afterRef]);

  // AFTER is the master clock. Mirror to BEFORE.
  useEffect(() => {
    if (!beforeReady || !afterReady) return;
    const b = beforeRef.current;
    const a = afterRef.current;
    if (!b || !a) return;

    let seekPending = false;
    const sharedDur = () => Math.min(b.duration || 0, a.duration || 0);

    const onMasterTimeUpdate = () => {
      if (!a || !b || seekPending) return;
      const dur = sharedDur();
      if (a.currentTime >= dur - 0.05) {
        // Reached end — restart BOTH together (one restart, never two loops)
        seekPending = true;
        b.currentTime = 0;
        a.currentTime = 0;
        void b.play().catch(() => {});
        void a.play().catch(() => {});
        requestAnimationFrame(() => { seekPending = false; });
        return;
      }
      if (Math.abs(b.currentTime - a.currentTime) > 0.12) {
        seekPending = true;
        b.currentTime = a.currentTime;
        requestAnimationFrame(() => { seekPending = false; });
      }
    };
    const onMasterEnded = () => {
      if (!a || !b) return;
      seekPending = true;
      b.currentTime = 0;
      a.currentTime = 0;
      void b.play().catch(() => {});
      void a.play().catch(() => {});
      requestAnimationFrame(() => { seekPending = false; });
    };
    const onMasterPlay = () => {
      if (!a || !b) return;
      void b.play().catch(() => {});
      setPlaying(true);
    };
    const onMasterPause = () => {
      if (!a || !b) return;
      b.pause();
      setPlaying(false);
    };

    a.addEventListener("timeupdate", onMasterTimeUpdate);
    a.addEventListener("ended", onMasterEnded);
    a.addEventListener("play", onMasterPlay);
    a.addEventListener("pause", onMasterPause);
    return () => {
      a.removeEventListener("timeupdate", onMasterTimeUpdate);
      a.removeEventListener("ended", onMasterEnded);
      a.removeEventListener("play", onMasterPlay);
      a.removeEventListener("pause", onMasterPause);
    };
  }, [beforeReady, afterReady, beforeRef, afterRef]);

  // Progress bar reads from master (after) only
  useEffect(() => {
    const id = setInterval(() => {
      const a = afterRef.current;
      if (!a || !a.duration) return;
      setProgress((a.currentTime / a.duration) * 100);
      setTime({ cur: a.currentTime, dur: a.duration });
    }, 250);
    return () => clearInterval(id);
  }, []);

  const togglePlay = () => {
    const a = afterRef.current;
    if (!a) return;
    if (a.paused) {
      void a.play().catch(() => {});
    } else {
      a.pause();
    }
  };

  const restart = () => {
    const a = afterRef.current;
    if (!a) return;
    a.currentTime = 0;
    void a.play().catch(() => {});
  };

  const seek = (pct: number) => {
    const a = afterRef.current;
    if (!a || !a.duration) return;
    a.currentTime = (pct / 100) * a.duration;
    // The master timeupdate handler will mirror to before
  };

  const toggleMute = () => {
    const a = afterRef.current;
    if (!a) return;
    const next = !a.muted;
    a.muted = next;
    setMuted(next);
    if (next) audio.release();
    else audio.claim();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      onClick={onClose}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.78)", backdropFilter: "blur(20px)" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full animate-[ba-in_.25s_cubic-bezier(0.175,0.885,0.32,1.275)] max-h-[92vh] overflow-y-auto"
        style={{
          background: "#111",
          border: "1px solid #2a2a2a",
          borderRadius: 16,
          maxWidth: 640,
          padding: 16,
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>{project.title}</span>
            <span style={tagPill}>{project.tag}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="ba-ctrl inline-flex items-center justify-center rounded-full"
            style={{ width: 28, height: 28, border: "1px solid #333", color: "#888" }}
          >
            <X size={14} />
          </button>
        </div>

        <div
          className="mt-3 flex flex-wrap items-start justify-center gap-3"
        >
          <div>
            <div
              className="ba-frame relative overflow-hidden"
              style={portraitFrameStyle(ratioFor(project.beforeKey) ?? "9 / 16")}
            >
              {!beforeReady && <VideoSkeleton progress={beforeProgress} />}
              <video
                ref={beforeRef}
                autoPlay
                muted
                playsInline
                onClick={togglePlay}
                className="h-full w-full object-cover"
                style={{ opacity: beforeReady ? 1 : 0, transition: "opacity 250ms ease" }}
                {...PROTECTED_VIDEO_PROPS}
              />
              <VideoShield />
              <IpWatermark />
              <span style={labelChip(false)}>BEFORE</span>
            </div>
          </div>

          <div>
            <div
              className="ba-frame relative overflow-hidden"
              style={portraitFrameStyle(ratioFor(project.afterKey) ?? "9 / 16")}
            >
              {!afterReady && <VideoSkeleton progress={afterProgress} />}
              <video
                ref={afterRef}
                autoPlay
                muted
                playsInline
                onClick={togglePlay}
                className="h-full w-full object-cover"
                style={{ opacity: afterReady ? 1 : 0, transition: "opacity 250ms ease" }}
                {...PROTECTED_VIDEO_PROPS}
              />
              <VideoShield />
              <IpWatermark />
              <span style={labelChip(true)}>AFTER</span>
            </div>
          </div>
        </div>

        {/* Sticky so it stays reachable, but it hugs its buttons instead of stretching
            across the whole panel — matches the /work viewer. */}
        <div className="sticky bottom-0 z-10 mt-2 flex justify-center">
          <div className="flex w-fit max-w-full flex-wrap items-center justify-center gap-0.5 rounded-full bg-black/70 px-2 py-1.5 ring-1 ring-white/15 backdrop-blur-md">
            <button
              type="button"
              onClick={toggleMute}
              className="ba-ctrl inline-flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/10"
              aria-label={muted ? "Unmute video" : "Mute video"}
              aria-pressed={!muted}
              title={muted ? "Unmute" : "Mute"}
            >
              {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
            </button>
            <button
              type="button"
              onClick={restart}
              className="ba-ctrl inline-flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/10"
              aria-label="Replay video"
              title="Replay"
            >
              <RotateCcw size={17} />
            </button>
            <button
              type="button"
              onClick={togglePlay}
              className="ba-ctrl inline-flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/10"
              aria-label={playing ? "Pause video" : "Play video"}
              title={playing ? "Pause" : "Play"}
            >
              {playing ? <Pause size={17} /> : <Play size={17} />}
            </button>
            <span className="mx-1 h-5 w-px bg-white/15" aria-hidden />
            <button
              type="button"
              onClick={onClose}
              className="ba-ctrl inline-flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/10"
              aria-label="Close video"
              title="Close"
            >
              <X size={17} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
