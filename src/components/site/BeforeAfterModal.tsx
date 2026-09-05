import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { IpWatermark, PROTECTED_VIDEO_PROPS, VideoShield } from "@/components/site/VideoWatermark";
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
  color: "#a3e635",
  border: "1px solid #a3e635",
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

export function BeforeAfterModal({
  project,
  onClose,
}: {
  project: WorkProject;
  onClose: () => void;
}) {
  const beforeRef = useRef<HTMLVideoElement>(null);
  const afterRef = useRef<HTMLVideoElement>(null);
  const syncing = useRef(false);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [hoverAfter, setHoverAfter] = useState(false);
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState({ cur: 0, dur: 0 });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const b = beforeRef.current;
    const a = afterRef.current;
    if (!b || !a) return;

    const pair = (src: HTMLVideoElement, dst: HTMLVideoElement) => {
      const onPlay = () => {
        if (syncing.current) return;
        syncing.current = true;
        void dst.play().catch(() => {});
        syncing.current = false;
        setPlaying(true);
      };
      const onPause = () => {
        if (syncing.current) return;
        syncing.current = true;
        dst.pause();
        syncing.current = false;
        setPlaying(false);
      };
      const onSeeked = () => {
        if (syncing.current) return;
        syncing.current = true;
        dst.currentTime = src.currentTime;
        syncing.current = false;
      };
      src.addEventListener("play", onPlay);
      src.addEventListener("pause", onPause);
      src.addEventListener("seeked", onSeeked);
      return () => {
        src.removeEventListener("play", onPlay);
        src.removeEventListener("pause", onPause);
        src.removeEventListener("seeked", onSeeked);
      };
    };

    const c1 = pair(b, a);
    const c2 = pair(a, b);
    return () => {
      c1?.();
      c2?.();
    };
  }, []);

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
    const b = beforeRef.current;
    const a = afterRef.current;
    if (!b || !a) return;
    if (a.paused) {
      void b.play().catch(() => {});
      void a.play().catch(() => {});
      setPlaying(true);
    } else {
      b.pause();
      a.pause();
      setPlaying(false);
    }
  };

  const restart = () => {
    const b = beforeRef.current;
    const a = afterRef.current;
    if (!b || !a) return;
    syncing.current = true;
    b.currentTime = 0;
    a.currentTime = 0;
    syncing.current = false;
    void b.play().catch(() => {});
    void a.play().catch(() => {});
    setPlaying(true);
  };

  const seek = (pct: number) => {
    const b = beforeRef.current;
    const a = afterRef.current;
    if (!b || !a || !a.duration) return;
    const t = (pct / 100) * a.duration;
    syncing.current = true;
    b.currentTime = t;
    a.currentTime = t;
    syncing.current = false;
    setProgress(pct);
  };

  const toggleMute = () => {
    const a = afterRef.current;
    if (!a) return;
    a.muted = !a.muted;
    setMuted(a.muted);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      onClick={onClose}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.92)" }}
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

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2" style={{ gap: 12 }}>
          <div>
            <div
              className="relative aspect-video"
              style={{
                background: "#0d0d0d",
                border: "1px solid #222",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              <video
                ref={beforeRef}
                src={project.beforeUrl}
                autoPlay
                muted
                loop
                playsInline
                onClick={togglePlay}
                className="h-full w-full object-cover"
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
              className="relative aspect-video"
              onMouseEnter={() => setHoverAfter(true)}
              onMouseLeave={() => setHoverAfter(false)}
              style={{
                background: "#0d0d0d",
                border: "1px solid #222",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              <video
                ref={afterRef}
                src={project.afterUrl}
                autoPlay
                muted
                loop
                playsInline
                onClick={togglePlay}
                className="h-full w-full object-cover"
                {...PROTECTED_VIDEO_PROPS}
              />
              <VideoShield />
              <IpWatermark />
              <button
                type="button"
                onClick={toggleMute}
                className="absolute"
                style={{
                  bottom: 10,
                  right: 10,
                  zIndex: 10,
                  background: "rgba(0,0,0,0.7)",
                  border: "1px solid #444",
                  borderRadius: 8,
                  padding: "6px 10px",
                  color: "#fff",
                  fontSize: 11,
                  fontFamily: "ui-monospace, monospace",
                  opacity: hoverAfter ? 1 : 0,
                  transition: "opacity .2s",
                  pointerEvents: hoverAfter ? "auto" : "none",
                }}
              >
                {muted ? "🔊 UNMUTE" : "🔇 MUTE"}
              </button>
            </div>
            <div
              className="mt-2 text-center"
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: 10,
                color: "#a3e635",
                letterSpacing: 2,
              }}
            >
              AFTER
            </div>
          </div>
        </div>

        <div
          className="mt-4 flex items-center gap-3"
          style={{ background: "#0d0d0d", borderRadius: 8, padding: "12px 16px" }}
        >
          <button type="button" onClick={togglePlay} style={ctrlBtn} className="ba-ctrl" aria-label="Play or pause">
            {playing ? "⏸" : "▶"}
          </button>
          <button type="button" onClick={restart} style={ctrlBtn} className="ba-ctrl" aria-label="Restart">
            ↺
          </button>
          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={progress}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label="Seek"
            className="ba-range flex-1"
          />
          <span
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: 11,
              color: "#888",
              whiteSpace: "nowrap",
            }}
          >
            {fmt(time.cur)} / {fmt(time.dur)}
          </span>
        </div>
      </div>
    </div>
  );
}
