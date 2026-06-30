import { useEffect } from "react";

export function SmoothScroll() {
  useEffect(() => {
    let lenis: any;
    let raf = 0;
    let cancelled = false;
    (async () => {
      const Lenis = (await import("lenis")).default;
      if (cancelled) return;
      lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
      (window as any).__lenis = lenis;
      const loop = (t: number) => {
        lenis.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    })();
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      lenis?.destroy?.();
    };
  }, []);
  return null;
}
