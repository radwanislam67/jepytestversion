import { useEffect, useRef } from "react";

/**
 * Hexagonal codec-lattice visualization.
 * Canvas 2D with pseudo-3D perspective. No external deps.
 * Right-side hero decoration only — no text, no captions.
 */

type Hex = {
  q: number; // axial coord
  r: number;
  phase: number; // 0..1 offset in pipeline loop
};

const STATES = [
  { color: [42, 42, 42], glow: [255, 90, 40], op: 0.4 },     // RAW
  { color: [0, 153, 255], glow: [0, 153, 255], op: 0.6 },    // EDITED
  { color: [255, 170, 0], glow: [255, 170, 0], op: 0.75 },   // GRADED
  { color: [0, 255, 255], glow: [0, 255, 255], op: 0.85 },   // CAPTIONED
  { color: [0, 255, 65], glow: [0, 255, 65], op: 1.0 },      // FINAL
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function sampleState(t: number) {
  // t in [0,1) → interpolate through 5 states cyclically
  const scaled = t * STATES.length;
  const i = Math.floor(scaled) % STATES.length;
  const j = (i + 1) % STATES.length;
  const f = scaled - Math.floor(scaled);
  const a = STATES[i];
  const b = STATES[j];
  return {
    color: [
      lerp(a.color[0], b.color[0], f),
      lerp(a.color[1], b.color[1], f),
      lerp(a.color[2], b.color[2], f),
    ],
    glow: [
      lerp(a.glow[0], b.glow[0], f),
      lerp(a.glow[1], b.glow[1], f),
      lerp(a.glow[2], b.glow[2], f),
    ],
    op: lerp(a.op, b.op, f),
  };
}

function buildHexes(radius: number): Hex[] {
  const hexes: Hex[] = [];
  for (let q = -radius; q <= radius; q++) {
    for (let r = -radius; r <= radius; r++) {
      if (Math.abs(q + r) <= radius) {
        // phase based on horizontal position so waves flow left→right
        const norm = (q + radius) / (radius * 2);
        hexes.push({ q, r, phase: norm });
      }
    }
  }
  return hexes;
}

export function CodecVisualization() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const parent = canvas.parentElement!;
    const resize = () => {
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    // Choose lattice density based on size
    const isSmall = () => width < 260;
    let hexes = buildHexes(isSmall() ? 2 : 3);
    let hexSize = isSmall() ? 16 : 22; // px radius

    const rebuild = () => {
      hexes = buildHexes(isSmall() ? 2 : 3);
      hexSize = isSmall() ? 16 : 22;
    };
    const ro2 = new ResizeObserver(rebuild);
    ro2.observe(parent);

    const start = performance.now();

    const drawHex = (
      cx: number,
      cy: number,
      size: number,
      fill: string,
      stroke: string,
      glowColor: string,
      glowBlur: number,
    ) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i + Math.PI / 6;
        const x = cx + size * Math.cos(a);
        const y = cy + size * Math.sin(a);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.save();
      if (glowBlur > 0) {
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = glowBlur;
      }
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.restore();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = stroke;
      ctx.stroke();
    };

    const render = (now: number) => {
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // 3D-ish rotation params
      const rotY = reduced ? 0 : (t / 12) * Math.PI * 2;
      const rotZ = reduced ? 0 : Math.sin((t / 8) * Math.PI * 2) * (Math.PI / 18); // ±10°
      const tiltX = (25 * Math.PI) / 180;
      const perspective = 800;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosZ = Math.cos(rotZ);
      const sinZ = Math.sin(rotZ);
      const cosX = Math.cos(tiltX);
      const sinX = Math.sin(tiltX);

      // Pre-compute pixel positions with depth for sort
      const items = hexes.map((h) => {
        // hex → cartesian (pointy-top)
        const hx = hexSize * Math.sqrt(3) * (h.q + h.r / 2);
        const hy = hexSize * 1.5 * h.r;
        // rotate Z
        let x = hx * cosZ - hy * sinZ;
        let y = hx * sinZ + hy * cosZ;
        let z = 0;
        // rotate Y
        const x2 = x * cosY + z * sinY;
        const z2 = -x * sinY + z * cosY;
        x = x2;
        z = z2;
        // tilt X
        const y2 = y * cosX - z * sinX;
        const z3 = y * sinX + z * cosX;
        y = y2;
        z = z3;

        const scale = perspective / (perspective - z);
        const sx = cx + x * scale;
        const sy = cy + y * scale;
        return { h, sx, sy, scale, z };
      });

      // paint back-to-front
      items.sort((a, b) => a.z - b.z);

      // pipeline period ~10s per full cycle
      const cyclePos = (t / 10) % 1;

      for (const it of items) {
        const state = sampleState((cyclePos + it.h.phase) % 1);
        const [rC, gC, bC] = state.color;
        const [rG, gG, bG] = state.glow;
        const fill = `rgba(${rC | 0}, ${gC | 0}, ${bC | 0}, ${(state.op * 0.35).toFixed(3)})`;
        const stroke = `rgba(${rG | 0}, ${gG | 0}, ${bG | 0}, ${state.op.toFixed(3)})`;
        const glowC = `rgba(${rG | 0}, ${gG | 0}, ${bG | 0}, ${(state.op * 0.7).toFixed(3)})`;
        const glowBlur = 6 + state.op * 10;
        drawHex(it.sx, it.sy, hexSize * it.scale * 0.9, fill, stroke, glowC, reduced ? 0 : glowBlur);
      }

      // Scan lines
      if (!reduced) {
        const scanCount = 2;
        for (let i = 0; i < scanCount; i++) {
          const p = (((t / 6) + i / scanCount) % 1);
          const y = p * height;
          const grad = ctx.createLinearGradient(0, y - 20, 0, y + 20);
          grad.addColorStop(0, "rgba(0,255,65,0)");
          grad.addColorStop(0.5, "rgba(0,255,65,0.35)");
          grad.addColorStop(1, "rgba(0,255,65,0)");
          ctx.fillStyle = grad;
          ctx.fillRect(0, y - 20, width, 40);
        }

        // Data particles
        const pCount = width < 260 ? 0 : 8;
        for (let i = 0; i < pCount; i++) {
          const p = ((t * 0.15) + i / pCount) % 1;
          const px = p * width;
          const py = cy + Math.sin((t + i) * 1.2) * (height * 0.25);
          ctx.beginPath();
          ctx.fillStyle = "rgba(0,255,65,0.6)";
          ctx.shadowColor = "rgba(0,255,65,0.8)";
          ctx.shadowBlur = 8;
          ctx.arc(px, py, 1.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      if (!reduced) {
        rafRef.current = requestAnimationFrame(render);
      }
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      ro2.disconnect();
    };
  }, []);

  return (
    <div className="hero-codec" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
