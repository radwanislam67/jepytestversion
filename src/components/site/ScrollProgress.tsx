import { useEffect, useRef } from "react";

export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? h.scrollTop / max : 0;
      if (ref.current) ref.current.style.transform = `scaleX(${p})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        zIndex: 9998,
        pointerEvents: "none",
      }}
    >
      <div
        ref={ref}
        style={{
          height: "100%",
          width: "100%",
          background: "#00FF00",
          boxShadow: "0 0 12px #00FF00",
          transform: "scaleX(0)",
          transformOrigin: "left",
          transition: "transform 80ms linear",
        }}
      />
    </div>
  );
}
