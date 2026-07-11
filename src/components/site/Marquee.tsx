import { useInView } from "@/hooks/use-in-view";

type Item =
  | { type: "logo"; src: string; alt: string }
  | { type: "avatar"; src: string; alt: string };

const ITEMS: Item[] = [
  { type: "logo", src: "https://cdn.jepystudio.com/clients/riverside-logo.webp", alt: "Riverside.fm" },
  { type: "avatar", src: "https://cdn.jepystudio.com/clients/nate-herk-avatar.webp", alt: "Nate Herk" },
  { type: "logo", src: "https://cdn.jepystudio.com/clients/descript-logo.webp", alt: "Descript" },
  { type: "avatar", src: "https://cdn.jepystudio.com/clients/rj-talks-avatar.webp", alt: "RJ Talks" },
  { type: "logo", src: "https://cdn.jepystudio.com/clients/beehiiv-logo.webp", alt: "Beehiiv" },
  { type: "avatar", src: "https://cdn.jepystudio.com/clients/camille-adrian-avatar.webp", alt: "Camille Adrian" },
  { type: "avatar", src: "https://cdn.jepystudio.com/clients/peter-mckinnon-avatar.webp", alt: "Peter McKinnon" },
  { type: "avatar", src: "https://cdn.jepystudio.com/clients/matt-davella-avatar.webp", alt: "Matt D'Avella" },
];

function Row({ items, active }: { items: Item[]; active: boolean }) {
  const seq = [...items, ...items];
  return (
    <div className="relative overflow-hidden py-4 group">
      <div
        className="flex items-center gap-12 md:gap-16 whitespace-nowrap will-change-transform"
        style={{
          animation: `marquee-left 38s linear infinite`,
          animationPlayState: active ? "running" : "paused",
        }}
      >
        {seq.map((item, i) =>
          item.type === "logo" ? (
            <img
              key={i}
              src={item.src}
              alt={item.alt}
              loading="lazy"
              decoding="async"
              width={120}
              height={40}
              className="h-8 md:h-10 w-[120px] object-contain opacity-70 hover:opacity-100 transition-opacity shrink-0"
            />
          ) : (
            <img
              key={i}
              src={item.src}
              alt={item.alt}
              loading="lazy"
              decoding="async"
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover opacity-80 hover:opacity-100 transition-opacity shrink-0"
            />
          )
        )}
      </div>
    </div>
  );
}

export function Marquee() {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0, rootMargin: "100px" });
  return (
    <section
      ref={ref}
      className="relative border-y border-white/5 pt-8 md:pt-12 pb-10 md:pb-12 marquee-pauseable"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8 mb-6">
        <span className="text-[11px] uppercase tracking-[0.28em] text-white/40">
          <span style={{ color: "var(--accent)" }}>✦</span> Trusted by creators & teams worldwide
        </span>
      </div>
      <Row items={ITEMS} active={inView} />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent" />
    </section>
  );
}
