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
      {/* Perforations */}
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
      {/* Inner glass */}
      <div
        className="absolute inset-[10px] rounded-[2px]"
        style={{
          background: `linear-gradient(135deg, ${fill} 0%, rgba(0,0,0,0.3) 100%)`,
          opacity: 0.85,
        }}
      />
    </div>
  );
}

function FilmReel() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" style={{ filter: "drop-shadow(0 0 12px rgba(0,255,65,0.35))" }}>
      {/* Outer ring */}
      <circle cx="60" cy="60" r="58" fill="#2a2a2a" stroke="#1a1a1a" strokeWidth="2" />
      {/* Ridges */}
      {Array.from({ length: 36 }).map((_, i) => {
        const a = (i / 36) * Math.PI * 2;
        const x1 = 60 + Math.cos(a) * 54;
        const y1 = 60 + Math.sin(a) * 54;
        const x2 = 60 + Math.cos(a) * 58;
        const y2 = 60 + Math.sin(a) * 58;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1a1a1a" strokeWidth="1" />;
      })}
      {/* Inner disc */}
      <circle cx="60" cy="60" r="48" fill="#1e1e1e" stroke="#333" strokeWidth="1" />
      {/* Spokes */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        const x2 = 60 + Math.cos(a) * 44;
        const y2 = 60 + Math.sin(a) * 44;
        return <line key={i} x1="60" y1="60" x2={x2} y2={y2} stroke="#e0e0e0" strokeWidth="1.5" strokeLinecap="round" />;
      })}
      {/* Center hub glow */}
      <circle cx="60" cy="60" r="14" fill="#00ff41" opacity="0.25" filter="blur(4px)" />
      <circle cx="60" cy="60" r="10" fill="#00ff41" />
      <circle cx="60" cy="60" r="4" fill="#0a0a0a" />
    </svg>
  );
}

function Crosshair({ size = 12, opacity = 0.5 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" style={{ opacity }}>
      <line x1="6" y1="0" x2="6" y2="12" stroke="#00ff41" strokeWidth="1" />
      <line x1="0" y1="6" x2="12" y2="6" stroke="#00ff41" strokeWidth="1" />
    </svg>
  );
}

export function FilmstripLoop() {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [frameCount, setFrameCount] = useState(12);

  useEffect(() => {
    const update = () => setFrameCount(window.innerWidth < 768 ? 8 : 12);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (reduce) return;
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      if (window.innerWidth <= 1024) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const py = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      setTilt({ x: Math.max(-1, Math.min(1, px)) * 3, y: Math.max(-1, Math.min(1, py)) * 3 });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduce]);

  const size = 340; // composition box
  const rx = 135; // oval radii
  const ry = 150;

  const frames = Array.from({ length: frameCount }).map((_, i) => COLORS[i % COLORS.length]);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto"
      style={{ width: size, height: size, perspective: 1000 }}
      aria-hidden="true"
    >
      {/* Top-center crosshair (focus point) */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ top: size / 2 - ry - 18 }}
        animate={reduce ? undefined : { opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Crosshair size={14} opacity={1} />
      </motion.div>

      {/* Reel + filmstrip inner scene with parallax tilt */}
      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: tilt.x, rotateX: -tilt.y }}
        transition={{ type: "spring", stiffness: 60, damping: 15 }}
      >
        {/* Central reel with wobble */}
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
          animate={reduce ? undefined : { opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        >
          <Crosshair size={12} opacity={1} />
        </motion.div>

        {/* Rotating filmstrip container */}
        <motion.div
          className="absolute inset-0"
          style={{ willChange: "transform" }}
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          {frames.map((c, i) => {
            const angle = (i / frameCount) * Math.PI * 2 - Math.PI / 2; // start at top
            const x = Math.cos(angle) * rx;
            const y = Math.sin(angle) * ry;
            // Depth: top (angle=-PI/2, sin=-1) sharp; bottom (sin=1) blurred
            const t = (Math.sin(angle) + 1) / 2; // 0 top → 1 bottom
            const scale = 1.05 - t * 0.5; // 1.05 → 0.55
            const opacity = 1 - t * 0.5; // 1 → 0.5
            const blur = t * 1.5;
            return (
              <div
                key={i}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                  willChange: "transform",
                }}
              >
                {/* Counter-rotate so frames stay upright while parent spins */}
                <motion.div
                  animate={reduce ? undefined : { rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  style={{
                    transform: `scale(${scale})`,
                    opacity,
                    filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
                    willChange: "transform, opacity, filter",
                  }}
                >
                  <FilmFrame fill={c.fill} glow={c.glow} />
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
}
