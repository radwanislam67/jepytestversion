import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";

export function ShowreelCTA() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 }, { once: true });
  return (
    <div
      ref={ref}
      className={`flex justify-center pt-6 pb-6 transition-all duration-700 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <Link
        to="/contact"
        className="group inline-flex items-center gap-1.5 rounded-full border border-[var(--accent)] px-4 py-1.5 text-[11px] md:text-xs font-medium uppercase tracking-[0.16em] text-[var(--accent)] transition-colors duration-300 hover:bg-[var(--accent)] hover:text-black"
      >
        Let's Make Yours
        <ArrowUpRight
          size={13}
          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </Link>
    </div>
  );
}
