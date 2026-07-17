import { useEffect, useState } from "react";
import { useInView } from "@/hooks/use-in-view";

type Props = {
  focused?: boolean;
  celebrate?: boolean;
  className?: string;
  size?: number;
};

/**
 * StudioAssistant — a decorative SVG "creative studio" character.
 * Purely CSS/inline-transform animated (no heavy libs, no video).
 * - Enters with fade + translateY when scrolled into view
 * - Idle: gentle breathing/float loop
 * - Focused: subtle head tilt (attention)
 * - Celebrate: short cheer, then returns to idle
 * Respects prefers-reduced-motion.
 */
export function StudioAssistant({
  focused = false,
  celebrate = false,
  className = "",
  size = 300,
}: Props) {
  const { ref, inView } = useInView<HTMLDivElement>(
    { threshold: 0.15, rootMargin: "80px" },
    { once: true },
  );
  const [cheer, setCheer] = useState(false);

  useEffect(() => {
    if (!celebrate) return;
    setCheer(true);
    const t = setTimeout(() => setCheer(false), 1600);
    return () => clearTimeout(t);
  }, [celebrate]);

  const w = size;
  const h = Math.round(size * 1.2);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`sa-root pointer-events-none select-none ${className}`}
      style={{
        width: w,
        height: h,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 700ms ease-out, transform 700ms cubic-bezier(.2,.7,.2,1)",
      }}
    >
      <div className={`sa-float ${cheer ? "sa-cheer" : ""}`} style={{ width: "100%", height: "100%" }}>
        <svg
          viewBox="0 0 300 360"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          role="presentation"
        >
          <defs>
            <radialGradient id="sa-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#53FF2F" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#53FF2F" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#53FF2F" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="sa-body" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a1a1a" />
              <stop offset="100%" stopColor="#0a0a0a" />
            </linearGradient>
            <linearGradient id="sa-head" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2a2a2a" />
              <stop offset="100%" stopColor="#111" />
            </linearGradient>
            <linearGradient id="sa-visor" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0f1a0f" />
              <stop offset="55%" stopColor="#0a0a0a" />
              <stop offset="100%" stopColor="#1a2a12" />
            </linearGradient>
            <linearGradient id="sa-accent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7CFF5A" />
              <stop offset="100%" stopColor="#53FF2F" />
            </linearGradient>
            <filter id="sa-soft" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.2" />
            </filter>
          </defs>

          {/* Ambient glow */}
          <ellipse cx="150" cy="180" rx="140" ry="150" fill="url(#sa-glow)" />

          {/* Ground shadow */}
          <ellipse cx="150" cy="332" rx="70" ry="8" fill="#000" opacity="0.55" />

          {/* ---------- BODY (leaning slightly right, arm resting) ---------- */}
          <g className="sa-body">
            {/* Back leg */}
            <path
              d="M132 260 Q128 300 138 328 L156 328 Q152 300 156 262 Z"
              fill="url(#sa-body)"
              stroke="#000"
              strokeWidth="1.2"
            />
            {/* Front leg (crossed, leaning pose) */}
            <path
              d="M158 258 Q182 292 176 328 L196 328 Q206 296 190 258 Z"
              fill="url(#sa-body)"
              stroke="#000"
              strokeWidth="1.2"
            />
            {/* Shoes with neon sole */}
            <rect x="132" y="322" width="30" height="10" rx="3" fill="#0a0a0a" stroke="#000" />
            <rect x="132" y="330" width="30" height="3" rx="1.5" fill="url(#sa-accent)" opacity="0.9" />
            <rect x="172" y="322" width="30" height="10" rx="3" fill="#0a0a0a" stroke="#000" />
            <rect x="172" y="330" width="30" height="3" rx="1.5" fill="url(#sa-accent)" opacity="0.9" />

            {/* Torso — hoodie */}
            <path
              d="M108 175
                 Q150 150 196 175
                 L206 262
                 Q150 282 100 262 Z"
              fill="url(#sa-body)"
              stroke="#1a1a1a"
              strokeWidth="1.2"
            />
            {/* Hoodie zipper */}
            <line x1="150" y1="168" x2="150" y2="258" stroke="#53FF2F" strokeWidth="1.4" opacity="0.85" />
            {/* Chest badge (green accent) */}
            <g transform="translate(174 202)">
              <rect x="-9" y="-9" width="18" height="18" rx="4" fill="url(#sa-accent)" />
              <path d="M-4 0 L-1 3 L4 -3" stroke="#0a0a0a" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>

            {/* Left arm — resting/leaning on form edge */}
            <g className="sa-arm-left">
              <path
                d="M110 188 Q78 210 72 258 Q70 274 84 276 Q98 276 104 262 Q118 232 128 210 Z"
                fill="url(#sa-body)"
                stroke="#1a1a1a"
                strokeWidth="1.2"
              />
              {/* Hand */}
              <circle cx="80" cy="272" r="10" fill="#e9e9e9" />
              <circle cx="80" cy="272" r="10" fill="#111" opacity="0.15" />
            </g>

            {/* Right arm — holding a clapperboard */}
            <g className="sa-arm-right">
              <path
                d="M192 186 Q220 200 226 232 Q228 246 218 250 Q206 252 200 240 Q188 214 178 200 Z"
                fill="url(#sa-body)"
                stroke="#1a1a1a"
                strokeWidth="1.2"
              />
              {/* Clapperboard */}
              <g transform="translate(214 236) rotate(-14)">
                <rect x="-22" y="-2" width="44" height="30" rx="3" fill="#111" stroke="#53FF2F" strokeWidth="1.2" />
                <rect x="-22" y="-10" width="44" height="10" rx="2" fill="#0a0a0a" stroke="#53FF2F" strokeWidth="1.2" />
                {/* Stripes */}
                <path d="M-20 -9 L-14 -1 M-10 -9 L-4 -1 M0 -9 L6 -1 M10 -9 L16 -1" stroke="#53FF2F" strokeWidth="1.2" />
                <text x="0" y="18" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="8" fill="#53FF2F">JEPY</text>
              </g>
            </g>
          </g>

          {/* ---------- HEAD (tilts on focus) ---------- */}
          <g
            className="sa-head"
            style={{
              transformOrigin: "150px 170px",
              transform: focused ? "rotate(-6deg) translateY(-2px)" : "rotate(0deg)",
              transition: "transform 500ms cubic-bezier(.2,.7,.2,1)",
            }}
          >
            {/* Neck */}
            <rect x="142" y="152" width="16" height="18" rx="4" fill="#0a0a0a" />
            {/* Head shell */}
            <path
              d="M96 96
                 Q96 56 150 56
                 Q204 56 204 96
                 L204 140
                 Q204 168 150 168
                 Q96 168 96 140 Z"
              fill="url(#sa-head)"
              stroke="#000"
              strokeWidth="1.4"
            />
            {/* Antenna */}
            <line x1="150" y1="56" x2="150" y2="40" stroke="#1a1a1a" strokeWidth="2" />
            <circle cx="150" cy="38" r="4" fill="url(#sa-accent)" />
            <circle cx="150" cy="38" r="7" fill="#53FF2F" opacity="0.25" filter="url(#sa-soft)" />

            {/* Visor face */}
            <rect x="112" y="92" width="76" height="40" rx="18" fill="url(#sa-visor)" stroke="#53FF2F" strokeWidth="1.2" opacity="0.98" />
            {/* Eyes */}
            <g className="sa-eyes">
              <circle cx="134" cy="112" r="4.5" fill="#7CFF5A" />
              <circle cx="166" cy="112" r="4.5" fill="#7CFF5A" />
              <circle cx="134" cy="112" r="9" fill="#53FF2F" opacity="0.18" />
              <circle cx="166" cy="112" r="9" fill="#53FF2F" opacity="0.18" />
            </g>
            {/* Smile */}
            <path d="M138 138 Q150 146 162 138" stroke="#53FF2F" strokeWidth="1.6" fill="none" strokeLinecap="round" />

            {/* Headphones */}
            <path d="M92 110 Q92 74 150 74 Q208 74 208 110" fill="none" stroke="#1a1a1a" strokeWidth="4" />
            <rect x="82" y="104" width="16" height="26" rx="5" fill="#111" stroke="#53FF2F" strokeWidth="1.2" />
            <rect x="202" y="104" width="16" height="26" rx="5" fill="#111" stroke="#53FF2F" strokeWidth="1.2" />

            {/* Cheek highlight */}
            <ellipse cx="118" cy="128" rx="4" ry="1.5" fill="#53FF2F" opacity="0.4" />
            <ellipse cx="182" cy="128" rx="4" ry="1.5" fill="#53FF2F" opacity="0.4" />
          </g>
        </svg>
      </div>

      <style>{`
        .sa-float {
          animation: sa-breathe 5.5s ease-in-out infinite;
          will-change: transform;
          transform-origin: 50% 90%;
        }
        @keyframes sa-breathe {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50%     { transform: translateY(-6px) rotate(0.4deg); }
        }
        .sa-cheer {
          animation: sa-cheer 1.5s cubic-bezier(.2,.7,.2,1) 1;
        }
        @keyframes sa-cheer {
          0%   { transform: translateY(0) rotate(0deg) scale(1); }
          20%  { transform: translateY(-18px) rotate(-6deg) scale(1.04); }
          45%  { transform: translateY(-10px) rotate(6deg) scale(1.03); }
          70%  { transform: translateY(-14px) rotate(-3deg) scale(1.02); }
          100% { transform: translateY(0) rotate(0deg) scale(1); }
        }
        .sa-eyes { animation: sa-blink 5s infinite; transform-origin: center; }
        @keyframes sa-blink {
          0%, 92%, 100% { transform: scaleY(1); }
          95%, 97%      { transform: scaleY(0.1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .sa-root { transition: none !important; opacity: 1 !important; transform: none !important; }
          .sa-float, .sa-cheer, .sa-eyes { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

export default StudioAssistant;
