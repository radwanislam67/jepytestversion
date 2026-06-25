import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";

export function ShowreelCTA() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 }, { once: true });
  return (
    <div
      ref={ref}
      className={`flex justify-center py-12 md:py-16 transition-all duration-700 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <Link
        to="/contact"
        className="group inline-flex items-center gap-2 rounded-full border border-[var(--accent)] px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)] transition-colors duration-300 hover:bg-[var(--accent)] hover:text-black"
      >
        Let's Make Yours
        <ArrowUpRight
          size={18}
          className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
        />
      </Link>
    </div>
  );
}
