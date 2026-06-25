import { useEffect, useRef } from "react";

export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;
    const el = ref.current;
    if (!el) return;

    const move = (e: MouseEvent) => {
      el.style.transform = `translate(${e.clientX - 7}px, ${e.clientY - 7}px)`;
    };
    const enter = () => el.classList.add("is-hover");
    const leave = () => el.classList.remove("is-hover");
    const hide = () => el.classList.add("is-hidden");
    const show = () => el.classList.remove("is-hidden");

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseout", (e) => {
      if (!e.relatedTarget) hide();
    });
    window.addEventListener("mouseover", show);

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
      window.removeEventListener("mousemove", move);
      mo.disconnect();
    };
  }, []);
  return <div ref={ref} className="jepy-cursor" aria-hidden />;
}
