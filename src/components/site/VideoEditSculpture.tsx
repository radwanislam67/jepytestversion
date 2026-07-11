import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Play } from "lucide-react";

/**
 * Abstract "Video Edit Sculpture" — pure CSS + inline SVG.
 * No external assets. Framer Motion for subtle floating + parallax tilt.
 */
export function VideoEditSculpture() {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // Mouse parallax (desktop only)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-1, 1], [6, -6]), { stiffness: 60, damping: 18 });
  const ry = useSpring(useTransform(mx, [-1, 1], [-14, -6]), { stiffness: 60, damping: 18 });

  const [enableTilt, setEnableTilt] = useState(false);
  useEffect(() => {
    if (reduce) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 768px)");
    const update = () => setEnableTilt(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [reduce]);

  useEffect(() => {
    if (!enableTilt) return;
    const el = wrapRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      mx.set(Math.max(-1, Math.min(1, nx)));
      my.set(Math.max(-1, Math.min(1, ny)));
    };
    const onLeave = () => {
      mx.set(0);
      my.set(0);
    };
    window.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [enableTilt, mx, my]);

  const float = reduce
    ? {}
    : { y: [0, -10, 0], transition: { duration: 9, repeat: Infinity, ease: "easeInOut" as const } };

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="relative mx-auto w-full max-w-[420px] aspect-[9/14] select-none"
      style={{ perspective: 1400 }}
    >
      {/* Ambient lime glow */}
      <div
        className="absolute -inset-16 rounded-full opacity-60 blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--accent) 22%, transparent), transparent 70%)",
        }}
      />

      <motion.div
        className="absolute inset-0"
        style={{
          transformStyle: "preserve-3d",
          rotateX: enableTilt ? rx : 4,
          rotateY: enableTilt ? ry : -10,
        }}
      >
        {/* Back glass layer */}
        <motion.div
          className="absolute left-[14%] top-[10%] w-[60%] aspect-[9/16] rounded-2xl"
          style={{
            transform: "translateZ(-90px) rotateZ(-6deg)",
            background:
              "linear-gradient(140deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))",
            border: "1px solid rgba(255,255,255,0.06)",
            backdropFilter: "blur(8px)",
          }}
          animate={reduce ? undefined : { y: [0, -6, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Mid glass layer */}
        <motion.div
          className="absolute left-[6%] top-[6%] w-[68%] aspect-[9/16] rounded-2xl"
          style={{
            transform: "translateZ(-45px) rotateZ(3deg)",
            background:
              "linear-gradient(160deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(10px)",
            boxShadow:
              "0 40px 80px -30px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.03)",
          }}
          animate={reduce ? undefined : { y: [0, 5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* PRIMARY FRAME */}
        <motion.div
          className="absolute left-1/2 top-[2%] w-[70%] aspect-[9/16] -translate-x-1/2 rounded-2xl overflow-hidden"
          style={{
            transform: "translateZ(30px)",
            background:
              "linear-gradient(160deg, rgba(20,20,20,0.85), rgba(8,8,8,0.9))",
            border: "1px solid color-mix(in oklab, var(--accent) 28%, rgba(255,255,255,0.06))",
            boxShadow:
              "0 0 0 1px color-mix(in oklab, var(--accent) 18%, transparent), 0 30px 90px -20px rgba(0,0,0,0.75), 0 0 60px -10px color-mix(in oklab, var(--accent) 35%, transparent)",
          }}
          animate={float}
        >
          {/* Grain */}
          <div
            className="absolute inset-0 opacity-[0.09] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.7 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
            }}
          />
          {/* Subtle vertical gradient wash */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, color-mix(in oklab, var(--accent) 6%, transparent) 55%, transparent 100%)",
            }}
          />

          {/* Corner trackers */}
          {[
            "top-3 left-3 border-t border-l",
            "top-3 right-3 border-t border-r",
            "bottom-3 left-3 border-b border-l",
            "bottom-3 right-3 border-b border-r",
          ].map((cls, i) => (
            <span
              key={i}
              className={`absolute h-4 w-4 ${cls}`}
              style={{ borderColor: "color-mix(in oklab, var(--accent) 75%, transparent)" }}
            />
          ))}

          {/* Play icon */}
          <div className="absolute inset-0 grid place-items-center">
            <div
              className="h-14 w-14 rounded-full grid place-items-center"
              style={{
                border: "1px solid color-mix(in oklab, var(--accent) 60%, transparent)",
                background: "rgba(0,0,0,0.35)",
                boxShadow: "0 0 24px color-mix(in oklab, var(--accent) 30%, transparent)",
              }}
            >
              <Play size={22} className="translate-x-[1px]" style={{ color: "var(--accent)" }} />
            </div>
          </div>

          {/* Scan line */}
          {!reduce && (
            <motion.div
              className="absolute left-0 right-0 h-px pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, transparent, color-mix(in oklab, var(--accent) 90%, transparent), transparent)",
                boxShadow: "0 0 10px color-mix(in oklab, var(--accent) 70%, transparent)",
              }}
              initial={{ top: "0%" }}
              animate={{ top: ["0%", "100%"] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
            />
          )}
        </motion.div>

        {/* TIMELINE PANEL */}
        <motion.div
          className="absolute left-[2%] right-[2%] bottom-[2%] rounded-xl p-3"
          style={{
            transform: "translateZ(70px)",
            background:
              "linear-gradient(180deg, rgba(16,16,16,0.85), rgba(10,10,10,0.9))",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow:
              "0 20px 50px -20px rgba(0,0,0,0.7), 0 0 24px -8px color-mix(in oklab, var(--accent) 25%, transparent)",
            backdropFilter: "blur(10px)",
          }}
          animate={reduce ? undefined : { y: [0, -4, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Waveform strip */}
          <svg viewBox="0 0 200 24" className="w-full h-6" preserveAspectRatio="none">
            <g stroke="color-mix(in oklab, var(--accent) 70%, transparent)" strokeWidth="1.2" strokeLinecap="round">
              {Array.from({ length: 60 }).map((_, i) => {
                const h = 4 + Math.abs(Math.sin(i * 0.7)) * 14 + Math.abs(Math.cos(i * 0.3)) * 4;
                return <line key={i} x1={i * 3.4 + 2} x2={i * 3.4 + 2} y1={12 - h / 2} y2={12 + h / 2} />;
              })}
            </g>
          </svg>

          {/* Clip blocks + cut markers */}
          <div className="relative mt-2 h-4">
            <div className="absolute inset-y-0 left-0 w-[28%] rounded-sm"
                 style={{ background: "color-mix(in oklab, var(--accent) 55%, transparent)" }} />
            <div className="absolute inset-y-0 left-[30%] w-[18%] rounded-sm"
                 style={{ background: "rgba(255,255,255,0.14)" }} />
            <div className="absolute inset-y-0 left-[50%] w-[22%] rounded-sm"
                 style={{ background: "color-mix(in oklab, var(--accent) 35%, transparent)" }} />
            <div className="absolute inset-y-0 left-[74%] w-[24%] rounded-sm"
                 style={{ background: "rgba(255,255,255,0.10)" }} />
            {[28, 48, 72].map((l) => (
              <span key={l} className="absolute top-[-3px] bottom-[-3px] w-px" style={{ left: `${l}%`, background: "rgba(255,255,255,0.5)" }} />
            ))}
            {/* Playhead */}
            <motion.span
              className="absolute -top-2 -bottom-2 w-px"
              style={{
                background: "var(--accent)",
                boxShadow: "0 0 8px var(--accent)",
              }}
              initial={{ left: "0%" }}
              animate={reduce ? { left: "40%" } : { left: ["0%", "100%"] }}
              transition={reduce ? undefined : { duration: 7, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </motion.div>

        {/* Floating waveform ribbon */}
        <motion.svg
          viewBox="0 0 160 40"
          className="absolute -left-6 top-[40%] w-32 opacity-80"
          style={{ transform: "translateZ(120px) rotate(-8deg)" }}
          animate={reduce ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M0 20 Q 20 0 40 20 T 80 20 T 120 20 T 160 20"
            fill="none"
            stroke="color-mix(in oklab, var(--accent) 80%, transparent)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M0 24 Q 20 8 40 24 T 80 24 T 120 24 T 160 24"
            fill="none"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </motion.svg>

        {/* Keyframe dots */}
        <motion.div
          className="absolute right-[-6px] top-[22%] flex flex-col gap-3"
          style={{ transform: "translateZ(100px)" }}
          animate={reduce ? undefined : { y: [0, -6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          {[0.9, 0.55, 0.3].map((o, i) => (
            <span
              key={i}
              className="h-2 w-2 rotate-45"
              style={{ background: "var(--accent)", opacity: o, boxShadow: "0 0 8px var(--accent)" }}
            />
          ))}
        </motion.div>

        {/* Light trail */}
        {!reduce && (
          <motion.div
            className="absolute left-[8%] bottom-[22%] h-px w-24 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, color-mix(in oklab, var(--accent) 90%, transparent), transparent)",
              transform: "translateZ(90px)",
              filter: "blur(0.5px)",
            }}
            animate={{ opacity: [0.2, 0.9, 0.2], x: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </motion.div>
    </div>
  );
}
