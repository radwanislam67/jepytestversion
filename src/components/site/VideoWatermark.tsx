import { useEffect, useState } from "react";

/** Shared props to apply to every <video> element for download protection. */
export const PROTECTED_VIDEO_PROPS = {
  controlsList: "nodownload",
  disablePictureInPicture: true,
  onContextMenu: (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  },
} as const;

/** Transparent anti-drag / anti-download overlay. */
export function VideoShield() {
  return (
    <div
      aria-hidden
      className="absolute inset-0"
      style={{ zIndex: 2, background: "transparent", pointerEvents: "none" }}
    />
  );
}

export function useClientIp() {
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

/** Diagonal repeating IP watermark grid that drifts every 6s. */
export function IpWatermark({ enabled = true }: { enabled?: boolean } = {}) {
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
  for (let y = -80; y < 800; y += 80) {
    for (let x = -160; x < 1200; x += 160) {
      cells.push(
        <span
          key={`${x}-${y}`}
          style={{
            position: "absolute",
            left: x,
            top: y,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 13,
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
