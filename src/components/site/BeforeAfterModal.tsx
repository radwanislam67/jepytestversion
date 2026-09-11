import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Volume2, VolumeX, X } from "lucide-react";
import { IpWatermark, PROTECTED_VIDEO_PROPS, VideoShield } from "@/components/site/VideoWatermark";
import { VideoSkeleton } from "@/components/site/VideoSkeleton";
import { ratioFor, useProtectedVideo, warmVideos } from "@/hooks/useProtectedVideo";
import { useAudioBus } from "@/lib/audioBus";
import type { WorkProject } from "@/components/site/work-data";

function fmt(t: number) {
  if (!isFinite(t) || t < 0) t = 0;
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

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

const pillBtn: React.CSSProperties = {
  background: "transparent",
  border: "none",
  color: "#e5e5e5",
  padding: "8px 10px",
  cursor: "pointer",
  transition: "color .2s, background .2s",
};

/** The clips are anamorphic, so each frame takes its own on-screen ratio — a hard-coded
 *  9:16 crops whichever clip is not 9:16. */
const portraitFrameStyle = (ratio: string): React.CSSProperties => ({
  aspectRatio: ratio,
  height: "min(62vh, 560px)",
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
          maxWidth: 900,
          padding: 24,
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
          className="mt-5 grid grid-cols-1 sm:grid-cols-2 justify-items-center"
          style={{ gap: 12 }}
        >
          <div>
            <div
              className="relative overflow-hidden"
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
            </div>
            <div
              className="mt-2 text-center"
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: 10,
                color: "#aaa",
                letterSpacing: 2,
              }}
            >
              BEFORE
            </div>
          </div>

          <div>
            <div
              className="relative overflow-hidden"
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
            </div>
            <div
              className="mt-2 text-center"
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: 10,
                color: "#30d94b",
                letterSpacing: 2,
              }}
            >
              AFTER
            </div>
          </div>
        </div>

        {/* Sticky, pill-shaped and always visible: on a phone this bar used to sit far
            below the fold, which made the transport controls unreachable. */}
        <div
          className="sticky bottom-0 mt-4 flex flex-wrap items-center gap-2"
          style={{
            background: "rgba(13,13,13,.94)",
            backdropFilter: "blur(12px)",
            border: "1px solid #262626",
            borderRadius: 999,
            padding: "8px 12px",
          }}
        >
          <button
            type="button"
            onClick={toggleMute}
            style={pillBtn}
            className="ba-ctrl inline-flex items-center gap-1.5 rounded-full"
            aria-label={muted ? "Unmute video" : "Mute video"}
            aria-pressed={!muted}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            <span style={{ fontSize: 11, fontFamily: "ui-monospace, monospace" }}>
              {muted ? "UNMUTE" : "MUTE"}
            </span>
          </button>
          <button
            type="button"
            onClick={togglePlay}
            style={pillBtn}
            className="ba-ctrl inline-flex items-center rounded-full"
            aria-label={playing ? "Pause video" : "Play video"}
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            type="button"
            onClick={restart}
            style={pillBtn}
            className="ba-ctrl inline-flex items-center rounded-full"
            aria-label="Replay video"
          >
            <RotateCcw size={16} />
          </button>
          <button
            type="button"
            onClick={onClose}
            style={pillBtn}
            className="ba-ctrl inline-flex items-center rounded-full"
            aria-label="Close video"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
