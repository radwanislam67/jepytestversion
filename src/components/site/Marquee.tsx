const ROW_1 = ["OCTAVE", "PIXELRUN", "FORMA", "HALCYON", "VANTA", "LUMEN", "STRATA"];

function Row({ items, dir }: { items: string[]; dir: "left" | "right" }) {
  const seq = [...items, ...items, ...items, ...items];
  return (
    <div className="relative overflow-hidden py-4 group">
      <div
        className="flex gap-10 whitespace-nowrap will-change-transform"
        style={{
          animation: `${dir === "left" ? "marquee-left" : "marquee-right"} 38s linear infinite`,
        }}
      >
        {seq.map((c, i) => (
          <div
            key={i}
            className="flex items-center gap-10 font-display text-xl md:text-3xl uppercase"
            style={{
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            <span>{c}</span>
            <span style={{ color: "var(--accent)" }}>✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Marquee() {
  return (
    <section
      className="relative border-y border-white/5 py-6 marquee-pauseable"
    >
      <Row items={ROW_1} dir="left" />
      
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent" />
    </section>
  );
}
