import { useEffect, useRef, useState } from "react";
import { useProtectedVideo } from "@/hooks/useProtectedVideo";
import { useAudioBus, useOffscreenSilence } from "@/lib/audioBus";

const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";

const protectedVideoProps = {
  controlsList: "nodownload",
  disablePictureInPicture: true,
  onContextMenu: (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  },
} as const;

function useClientIp() {
  const [ip, setIp] = useState("");
  useEffect(() => {
    let alive = true;
    fetch("https://api.ipify.org?format=json")
      .then((r) => r.json())
      .then((d) => {
        if (alive && d?.ip) setIp(String(d.ip));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  return ip;
}

function VideoWatermark({ enabled = true }: { enabled?: boolean }) {
  const ip = useClientIp();
  const [shift, setShift] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const id = setInterval(() => {
      setShift({
        x: (Math.random() * 2 - 1) * 3,
        y: (Math.random() * 2 - 1) * 3,
      });
    }, 6000);
    return () => clearInterval(id);
  }, []);

  if (!enabled || !ip) return null;

  const cells: React.ReactNode[] = [];
  for (let y = -80; y < 360; y += 70) {
    for (let x = -160; x < 400; x += 120) {
      cells.push(
        <span
          key={`${x}-${y}`}
          style={{
            position: "absolute",
            left: x,
            top: y,
            fontFamily: mono,
            fontSize: 11,
            color: "#ffffff",
            opacity: 0.07,
            textShadow: "0 0 4px rgba(0,0,0,0.8)",
            whiteSpace: "nowrap",
          }}
        >
          {ip}
        </span>,
      );
    }
  }

  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden"
      style={{ zIndex: 3, pointerEvents: "none" }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${shift.x}%, ${shift.y}%) rotate(-25deg)`,
          transition: "transform 1.2s ease",
        }}
      >
        {cells}
      </div>
    </div>
  );
}

export function HeroBeforeAfter() {
  const { videoRef: beforeVideoRef, ready: beforeReady } = useProtectedVideo("Before.mp4");
  const { videoRef: afterVideoRef, ready: afterReady } = useProtectedVideo("After.mp4");
  const rootRef = useRef<HTMLDivElement>(null);
  const [afterMuted, setAfterMuted] = useState(true);
  const audio = useAudioBus(afterVideoRef, () => setAfterMuted(true));

  // Pausing the AFTER clip pulls the BEFORE clip with it through the sync effect
  // below, so the pair never drifts apart while off screen.
  useOffscreenSilence(rootRef, afterVideoRef, () => {
    audio.release();
    setAfterMuted(true);
  });

  useEffect(() => {
    if (!beforeReady || !afterReady) return;
    const b = beforeVideoRef.current;
    const a = afterVideoRef.current;
    if (!b || !a) return;
    const onTimeUpdate = () => { if (isFinite(a.currentTime)) b.currentTime = a.currentTime; };
    const onPlay = () => { void b.play().catch(() => {}); };
    const onPause = () => { b.pause(); };
    a.addEventListener("timeupdate", onTimeUpdate);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    b.currentTime = 0;
    a.currentTime = 0;
    const tryPlay = () => {
      if (a.paused) void a.play().catch(() => {});
      if (b.paused) void b.play().catch(() => {});
    };
    tryPlay();
    const retry = window.setTimeout(tryPlay, 600);
    const onVisible = () => { if (!document.hidden) tryPlay(); };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    return () => {
      a.removeEventListener("timeupdate", onTimeUpdate);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      window.clearTimeout(retry);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, [beforeReady, afterReady, beforeVideoRef, afterVideoRef]);

  return (
    <div className="hero-ba" ref={rootRef}>
      {/* BEFORE card */}
      <div className="hero-ba-before">
        {!beforeReady && (
          <img
            src="/video-posters/before.webp"
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-fill"
          />
        )}
        <video
          ref={beforeVideoRef}
          muted
          loop
          playsInline
          preload="auto"
          poster="/video-posters/before.webp"
          className="relative z-[2] h-full w-full object-fill"
          style={{ opacity: beforeReady ? 1 : 0, transition: "opacity 250ms ease" }}
          {...protectedVideoProps}
        />
        <VideoWatermark enabled={beforeReady} />
      </div>

      {/* AFTER card */}
      <div className="hero-ba-after group">
        {!afterReady && (
          <img
            src="/video-posters/after.webp"
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-fill"
          />
        )}
        <video
          ref={afterVideoRef}
          muted
          loop
          playsInline
          preload="auto"
          poster="/video-posters/after.webp"
          className="relative z-[2] h-full w-full object-fill"
          style={{ opacity: afterReady ? 1 : 0, transition: "opacity 250ms ease" }}
          {...protectedVideoProps}
        />
        <VideoWatermark enabled={afterReady} />
        <button
          type="button"
          onClick={() => {
            const v = afterVideoRef.current;
            if (!v) return;
            const next = !v.muted;
            v.muted = next;
            setAfterMuted(next);
            if (next) audio.release();
            else audio.claim();
            // Unmuting restarts the pair so the audio is heard from the top.
            if (!next) {
              const b = beforeVideoRef.current;
              if (b) b.currentTime = 0;
              v.currentTime = 0;
              void v.play().catch(() => {});
            }
          }}
          aria-label={afterMuted ? "Unmute after video" : "Mute after video"}
          className="hero-ba-mute"
        >
          {afterMuted ? "🔇" : "🔊"}
        </button>
      </div>

      {/* Curved arrow overlay */}
      <svg
        viewBox="0 0 300 380"
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none" }}
      >
        <defs>
          <marker
            id="hero-ba-arrow"
            markerWidth="6"
            markerHeight="6"
            refX="5"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L6,3 L0,6 Z" fill="#30d94b" />
          </marker>
        </defs>
        <path
          d="M 132,38 C 200,20 260,60 212,115"
          fill="none"
          stroke="#30d94b"
          strokeWidth="1.8"
          strokeDasharray="6 5"
          opacity="0.75"
          markerEnd="url(#hero-ba-arrow)"
        />
      </svg>
    </div>
  );
}
