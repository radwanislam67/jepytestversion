import { useEffect, useRef, useState } from "react";
import { useProtectedVideo } from "@/hooks/useProtectedVideo";

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

function VideoWatermark() {
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

function CardFallback({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(140deg,#141414,#0a0a0a)]"
      style={{ zIndex: 1 }}
    />
  );
}

export function HeroBeforeAfter() {
  const { videoRef: beforeVideoRef, ready: beforeReady } = useProtectedVideo("Before.mp4");
  const { videoRef: afterVideoRef, ready: afterReady } = useProtectedVideo("After.mp4");
  const [afterMuted, setAfterMuted] = useState(true);

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
    void Promise.all([b.play(), a.play()]).catch(() => {});
    return () => {
      a.removeEventListener("timeupdate", onTimeUpdate);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
    };
  }, [beforeReady, afterReady, beforeVideoRef, afterVideoRef]);

  return (
    <div className="hero-ba">
      {/* BEFORE card */}
      <div className="hero-ba-before">
        <CardFallback show={!beforeReady} />
        <video
          ref={beforeVideoRef}
          muted
          loop
          playsInline
          className="relative z-[2] h-full w-full object-cover"
          {...protectedVideoProps}
        />
        <VideoWatermark />
      </div>

      {/* AFTER card */}
      <div className="hero-ba-after group">
        <CardFallback show={!afterReady} />
        <video
          ref={afterVideoRef}
          autoPlay
          muted
          loop
          playsInline
          className="relative z-[2] h-full w-full object-cover"
          {...protectedVideoProps}
        />
        <VideoWatermark />
        <button
          type="button"
          onClick={() => {
            if (afterVideoRef.current) {
              afterVideoRef.current.muted = !afterVideoRef.current.muted;
              setAfterMuted(afterVideoRef.current.muted);
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
            <path d="M0,0 L6,3 L0,6 Z" fill="#7fff00" />
          </marker>
        </defs>
        <path
          d="M 132,38 C 200,20 260,60 212,115"
          fill="none"
          stroke="#7fff00"
          strokeWidth="1.8"
          strokeDasharray="6 5"
          opacity="0.75"
          markerEnd="url(#hero-ba-arrow)"
        />
      </svg>
    </div>
  );
}
