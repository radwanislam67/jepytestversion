import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const COLORS = [
  // RAW x3
  { fill: "#3a3a3a", glow: "rgba(255,69,0,0.4)" },
  { fill: "#3a3a3a", glow: "rgba(255,69,0,0.4)" },
  { fill: "#3a3a3a", glow: "rgba(255,69,0,0.4)" },
  // GRADED x3
  { fill: "#ffaa00", glow: "rgba(255,170,0,0.6)" },
  { fill: "#ffaa00", glow: "rgba(255,170,0,0.6)" },
  { fill: "#ffaa00", glow: "rgba(255,170,0,0.6)" },
  // CAPTIONED x3
  { fill: "#00ffff", glow: "rgba(0,255,255,0.7)" },
  { fill: "#00ffff", glow: "rgba(0,255,255,0.7)" },
  { fill: "#00ffff", glow: "rgba(0,255,255,0.7)" },
  // FINAL x3
  { fill: "#00ff41", glow: "rgba(0,255,65,1)" },
  { fill: "#00ff41", glow: "rgba(0,255,65,1)" },
  { fill: "#00ff41", glow: "rgba(0,255,65,1)" },
];

function FilmFrame({ fill, glow }: { fill: string; glow: string }) {
  return (
    <div
      className="relative"
      style={{
        width: 60,
        height: 80,
        border: "2px solid #000",
        borderRadius: 3,
        background: "rgba(255,255,255,0.04)",
        boxShadow: `0 0 10px ${glow}, inset 0 0 8px rgba(0,0,0,0.5)`,
        backdropFilter: "blur(2px)",
      }}
    >
      <div className="absolute left-0 right-0 top-0 flex justify-around px-[3px] pt-[2px]">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} style={{ width: 6, height: 4, background: "#000", borderRadius: 1 }} />
        ))}
      </div>
      <div className="absolute left-0 right-0 bottom-0 flex justify-around px-[3px] pb-[2px]">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} style={{ width: 6, height: 4, background: "#000", borderRadius: 1 }} />
        ))}
      </div>
      <div
        className="absolute inset-[10px] rounded-[2px]"
        style={{
          background: `linear-gradient(135deg, ${fill} 0%, rgba(0,0,0,0.3) 100%)`,
          opacity: 0.9,
        }}
      />
    </div>
  );
}

function FilmReel() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" style={{ filter: "drop-shadow(0 0 12px rgba(0,255,65,0.35))" }}>
      <circle cx="60" cy="60" r="58" fill="#2a2a2a" stroke="#1a1a1a" strokeWidth="2" />
      {Array.from({ length: 36 }).map((_, i) => {
        const a = (i / 36) * Math.PI * 2;
        const x1 = 60 + Math.cos(a) * 54;
        const y1 = 60 + Math.sin(a) * 54;
        const x2 = 60 + Math.cos(a) * 58;
        const y2 = 60 + Math.sin(a) * 58;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1a1a1a" strokeWidth="1" />;
      })}
      <circle cx="60" cy="60" r="48" fill="#1e1e1e" stroke="#333" strokeWidth="1" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        const x2 = 60 + Math.cos(a) * 44;
        const y2 = 60 + Math.sin(a) * 44;
        return <line key={i} x1="60" y1="60" x2={x2} y2={y2} stroke="#e0e0e0" strokeWidth="1.5" strokeLinecap="round" />;
      })}
      <circle cx="60" cy="60" r="14" fill="#00ff41" opacity="0.25" filter="blur(4px)" />
      <circle cx="60" cy="60" r="10" fill="#00ff41" />
      <circle cx="60" cy="60" r="4" fill="#0a0a0a" />
    </svg>
  );
}

function Crosshair({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12">
      <line x1="6" y1="0" x2="6" y2="12" stroke="#00ff41" strokeWidth="1" />
      <line x1="0" y1="6" x2="12" y2="6" stroke="#00ff41" strokeWidth="1" />
    </svg>
  );
}

export function FilmstripLoop() {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRefs = useRef<Array<HTMLDivElement | null>>([]);
  const tiltRef = useRef({ x: 0, y: 0 });
  const sceneRef = useRef<HTMLDivElement>(null);
  const [frameCount, setFrameCount] = useState(12);

  useEffect(() => {
    const update = () => setFrameCount(window.innerWidth < 768 ? 8 : 12);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const size = 340;
  const rx = 135;
  const ry = 150;

  useEffect(() => {
    if (reduce) {
      // Static layout
      for (let i = 0; i < frameCount; i++) {
        const el = frameRefs.current[i];
        if (!el) continue;
        const angle = (i / frameCount) * Math.PI * 2 - Math.PI / 2;
        const x = Math.cos(angle) * rx;
        const y = Math.sin(angle) * ry;
        el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        el.style.opacity = "0.9";
        el.style.filter = "";
      }
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = (now - start) / 1000;
      const phase = (t / 15) * Math.PI * 2; // 15s per loop
      for (let i = 0; i < frameCount; i++) {
        const el = frameRefs.current[i];
        if (!el) continue;
        const angle = (i / frameCount) * Math.PI * 2 - Math.PI / 2 + phase;
        const x = Math.cos(angle) * rx;
        const y = Math.sin(angle) * ry;
        // depth: top (sin=-1) sharp/large; bottom (sin=1) small/blurred
        const depth = (Math.sin(angle) + 1) / 2; // 0 top, 1 bottom
        const scale = 1.05 - depth * 0.5;
        const opacity = 1 - depth * 0.5;
        const blur = depth * 1.5;
        el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`;
        el.style.opacity = String(opacity);
        el.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "";
        el.style.zIndex = String(Math.round((1 - depth) * 100));
      }
      // parallax tilt
      if (sceneRef.current) {
        sceneRef.current.style.transform = `rotateY(${tiltRef.current.x}deg) rotateX(${-tiltRef.current.y}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, frameCount]);

  useEffect(() => {
    if (reduce) return;
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      if (window.innerWidth <= 1024) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const py = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      tiltRef.current = {
        x: Math.max(-1, Math.min(1, px)) * 3,
        y: Math.max(-1, Math.min(1, py)) * 3,
      };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduce]);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto"
      style={{ width: size, height: size, perspective: 1000 }}
      aria-hidden="true"
    >
      {/* Top-center crosshair */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ top: size / 2 - ry - 18, opacity: 0.5 }}
        animate={reduce ? undefined : { opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Crosshair size={14} />
      </motion.div>

      <div
        ref={sceneRef}
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d", willChange: "transform", transition: "transform 200ms ease-out" }}
      >
        {/* Central reel with wobble + spin */}
        <motion.div
          className="absolute left-1/2 top-1/2"
          style={{ marginLeft: -60, marginTop: -60, willChange: "transform" }}
          animate={reduce ? undefined : { rotateX: [0, 3, 0, -3, 0], rotateY: [0, -3, 0, 3, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{ willChange: "transform" }}
          >
            <FilmReel />
          </motion.div>
        </motion.div>

        {/* Center crosshair over reel */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ opacity: 0.5 }}
          animate={reduce ? undefined : { opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        >
          <Crosshair size={12} />
        </motion.div>

        {/* Filmstrip frames */}
        {Array.from({ length: frameCount }).map((_, i) => {
          const c = COLORS[i % COLORS.length];
          return (
            <div
              key={i}
              ref={(el) => {
                frameRefs.current[i] = el;
              }}
              className="absolute left-1/2 top-1/2"
              style={{ willChange: "transform, opacity, filter" }}
            >
              <FilmFrame fill={c.fill} glow={c.glow} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
