import { useInView } from "@/hooks/use-in-view";

type Item = {
  type: "logo" | "avatar";
  src: string;
  alt: string;
  name: string;
};

const ITEMS: Item[] = [
  { type: "logo", src: "https://cdn.jepystudio.com/clients/riverside-logo.webp", alt: "Riverside.fm", name: "Riverside.fm" },
  { type: "logo", src: "https://cdn.jepystudio.com/clients/descript-logo.webp", alt: "Descript", name: "Descript" },
  { type: "logo", src: "https://cdn.jepystudio.com/clients/beehiiv-logo.webp", alt: "Beehiiv", name: "Beehiiv" },
  { type: "avatar", src: "https://cdn.jepystudio.com/clients/nate-herk-avatar.webp", alt: "Nate Herk", name: "Nate Herk" },
  { type: "avatar", src: "https://cdn.jepystudio.com/clients/rj-talks-avatar.webp", alt: "RJ Talks", name: "RJ Talks" },
  { type: "avatar", src: "https://cdn.jepystudio.com/clients/camille-adrian-avatar.webp", alt: "Camille Adrian", name: "Camille Adrian" },
  { type: "avatar", src: "https://cdn.jepystudio.com/clients/peter-mckinnon-avatar.webp", alt: "Peter McKinnon", name: "Peter McKinnon" },
  { type: "avatar", src: "https://cdn.jepystudio.com/clients/matt-davella-avatar.webp", alt: "Matt D'Avella", name: "Matt D'Avella" },
];

function Row({ items, active }: { items: Item[]; active: boolean }) {
  const seq = [...items, ...items];
  return (
    <div className="relative overflow-hidden py-4 group">
      <div
        className="flex items-center w-max will-change-transform"
        style={{
          animation: `marquee-left 20s linear infinite`,
          animationPlayState: active ? "running" : "paused",
        }}
      >
        {seq.map((item, i) => (
          <div key={i} className="flex items-center shrink-0">
            <div className="flex items-center gap-3 px-12">
              {item.type === "logo" ? (
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                  width={44}
                  height={44}
                  className="h-11 w-11 object-contain shrink-0 rounded-lg"
                />
              ) : (
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full object-cover shrink-0"
                />
              )}
              <span className="font-semibold text-lg text-white/80 whitespace-nowrap">{item.name}</span>
            </div>
            <span aria-hidden className="h-4 w-px bg-white/15" />
          </div>
        ))}
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
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent" />
    </section>
  );
}
