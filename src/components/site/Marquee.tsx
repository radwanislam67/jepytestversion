const CLIENTS = ["NORTHWAVE", "STRATA", "LUMEN", "OCTAVE", "PIXELRUN", "FORMA", "HALCYON", "VANTA", "ATELIER", "MERIDIAN"];

export function Marquee() {
  const row = [...CLIENTS, ...CLIENTS];
  return (
    <div className="relative overflow-hidden py-10 border-y border-white/5">
      <div className="marquee-track flex gap-16 whitespace-nowrap will-change-transform">
        {row.map((c, i) => (
          <div key={i} className="font-display text-2xl md:text-4xl tracking-[0.2em] text-foreground/40 hover:text-foreground transition-colors">
            {c}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
