import { useEffect, useRef, useState } from "react";

const BEFORE_URL = "https://videos.jepystudio.com/Before.mp4";
const AFTER_URL = "https://videos.jepystudio.com/After.mp4";

const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";

const badgeBase: React.CSSProperties = {
  position: "absolute",
  top: 10,
  left: 10,
  zIndex: 2,
  fontFamily: mono,
  fontSize: 8,
  borderRadius: 20,
  padding: "3px 9px",
  background: "rgba(0,0,0,0.6)",
  letterSpacing: "0.12em",
};

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

export function HeroBeforeAfter() {
  const beforeVideoRef = useRef<HTMLVideoElement>(null);
  const afterVideoRef = useRef<HTMLVideoElement>(null);
  const [afterMuted, setAfterMuted] = useState(true);

  useEffect(() => {
    const b = beforeVideoRef.current;
    const a = afterVideoRef.current;
    if (!b || !a) return;

    b.currentTime = 0;
    a.currentTime = 0;
    void b.play().catch(() => {});
    void a.play().catch(() => {});

    const onTimeUpdate = () => {
      if (isFinite(a.currentTime)) {
        b.currentTime = a.currentTime;
      }
    };
    a.addEventListener("timeupdate", onTimeUpdate);
    return () => {
      a.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, []);

  const toggleAfterMute = () => {
    const v = afterVideoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setAfterMuted(v.muted);
  };

  return (
    <div className="hero-ba">
      {/* BEFORE card */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 0,
          width: 140,
          height: 249,
          zIndex: 1,
          transform: "rotate(-5deg)",
          opacity: 0.8,
          filter: "grayscale(0.55) brightness(0.6)",
          background: "#151515",
          border: "1px solid #2a2a2a",
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <video
          ref={beforeVideoRef}
          src={BEFORE_URL}
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
          {...protectedVideoProps}
        />
        <VideoWatermark />
      </div>

      {/* AFTER card */}
      <div
        className="hero-ba-after group"
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 148,
          height: 263,
          zIndex: 2,
          background: "#0d1a0d",
          border: "1.5px solid #7fff00",
          borderRadius: 16,
          boxShadow: "0 0 30px rgba(127,255,0,0.14)",
          overflow: "hidden",
        }}
      >
        <video
          ref={afterVideoRef}
          src={AFTER_URL}
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
          {...protectedVideoProps}
        />
        <VideoWatermark />
        <button
          type="button"
          onClick={toggleAfterMute}
          aria-label={afterMuted ? "Unmute after video" : "Mute after video"}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{
            position: "absolute",
            bottom: 10,
            right: 10,
            zIndex: 3,
            background: "rgba(0,0,0,0.7)",
            border: "1px solid #444",
            borderRadius: 8,
            padding: "6px 10px",
            color: "#ffffff",
            fontFamily: mono,
            fontSize: 11,
          }}
        >
          {afterMuted ? "Unmute" : "Mute"}
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
