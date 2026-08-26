import { useState } from "react";
import { BeforeAfterModal } from "@/components/site/BeforeAfterModal";
import type { WorkProject } from "@/components/site/work-data";

// TODO: swap with real URLs when ready
const VIDEO_CONFIG = [
  {
    title: "Northwave — Brand Film",
    tag: "COMMERCIAL",
    desc: "Cinematic brand story for a premium lifestyle label.",
    beforeUrl: "https://videos.jepystudio.com/Before.mp4",
    afterUrl: "https://videos.jepystudio.com/After.mp4",
  },
];

const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";

const badgeBase: React.CSSProperties = {
  position: "absolute",
  fontFamily: mono,
  fontSize: 8,
  borderRadius: 20,
  padding: "3px 9px",
  background: "rgba(0,0,0,0.6)",
  letterSpacing: "0.12em",
};

function PlayIcon({ color }: { color: string }) {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true">
      <path d="M1 1L11 7L1 13Z" fill={color} />
    </svg>
  );
}

function CardMeta({ title, sub }: { title: string; sub: string }) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        padding: "18px 10px 10px",
        background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
        borderRadius: "0 0 16px 16px",
      }}
    >
      <div style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>{title}</div>
      <div style={{ fontSize: 8, color: "#666", marginTop: 2 }}>{sub}</div>
    </div>
  );
}

export function HeroBeforeAfter() {
  const [open, setOpen] = useState(false);
  const cfg = VIDEO_CONFIG[0];

  const project: WorkProject = {
    id: "hero",
    title: cfg.title,
    tag: cfg.tag,
    desc: cfg.desc,
    beforeUrl: cfg.beforeUrl,
    afterUrl: cfg.afterUrl,
    showreelUrl: cfg.afterUrl,
  };

  return (
    <>
      <div className="hero-ba">
        {/* BEFORE card */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Open before and after for ${cfg.title}`}
          style={{
            position: "absolute",
            top: 8,
            left: 0,
            width: 140,
            height: 249,
            zIndex: 1,
            transform: "rotate(-5deg)",
            opacity: 0.65,
            filter: "grayscale(0.55) brightness(0.6)",
            background: "#151515",
            border: "1px solid #2a2a2a",
            borderRadius: 16,
            cursor: "pointer",
            padding: 0,
          }}
        >
          <span style={{ ...badgeBase, top: 8, left: 8, color: "#888", border: "1px solid #444" }}>
            BEFORE
          </span>
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "2px solid #555",
              background: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PlayIcon color="#888" />
          </span>
          <CardMeta title="Raw Footage" sub="Unedited · No grade" />
        </button>

        {/* AFTER card */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Open before and after for ${cfg.title}`}
          className="hero-ba-after"
          style={{
            position: "absolute",
            bottom: 20,
            right: 0,
            width: 148,
            height: 263,
            zIndex: 2,
            background: "#0d1a0d",
            border: "1.5px solid #7fff00",
            borderRadius: 16,
            boxShadow: "0 0 30px rgba(127,255,0,0.14)",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <span
            style={{
              position: "absolute",
              top: -12,
              right: -14,
              background: "#7fff00",
              color: "#000",
              fontFamily: mono,
              fontSize: 8,
              fontWeight: 700,
              borderRadius: 20,
              padding: "4px 9px",
              transform: "rotate(-4deg)",
              whiteSpace: "nowrap",
            }}
          >
            +12M VIEWS
          </span>
          <span
            style={{ ...badgeBase, top: 8, left: 8, color: "#7fff00", border: "1px solid #7fff00" }}
          >
            AFTER
          </span>
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "2px solid #7fff00",
              background: "rgba(127,255,0,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PlayIcon color="#7fff00" />
          </span>
          <CardMeta title="Final Edit" sub="Graded · Sound · Motion" />
        </button>

        {/* Arrow overlay */}
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

      {open && <BeforeAfterModal project={project} onClose={() => setOpen(false)} />}
    </>
  );
}
