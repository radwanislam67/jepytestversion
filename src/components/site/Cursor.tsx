import { useEffect, useRef } from "react";

export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;
    const el = ref.current;
    if (!el) return;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x, ty = y;
    let raf = 0;
    const move = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; };
    const enter = () => el.classList.add("is-hover");
    const leave = () => el.classList.remove("is-hover");
    const hide = () => el.classList.add("is-hidden");
    const show = () => el.classList.remove("is-hidden");
    const tick = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      el.style.transform = `translate(${x - 7}px, ${y - 7}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseleave", hide);
    window.addEventListener("mouseenter", show);
    const sel = "a, button, [role=button], input, textarea, .magnetic, [data-cursor=hover]";
    const bind = () => {
      document.querySelectorAll(sel).forEach((n) => {
        n.addEventListener("mouseenter", enter);
        n.addEventListener("mouseleave", leave);
      });
    };
    bind();
    const mo = new MutationObserver(bind);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", hide);
      window.removeEventListener("mouseenter", show);
      mo.disconnect();
    };
  }, []);
  return <div ref={ref} className="jepy-cursor" aria-hidden />;
}
