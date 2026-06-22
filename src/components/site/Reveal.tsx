import { useEffect, useRef, type ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  y = 24,
  as: As = "div",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  as?: any;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = `translateY(${y}px)`;
    el.style.transition = `opacity 900ms cubic-bezier(.2,.8,.2,1) ${delay}ms, transform 900ms cubic-bezier(.2,.8,.2,1) ${delay}ms`;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay, y]);
  return (
    <As ref={ref} className={className}>
      {children}
    </As>
  );
}
