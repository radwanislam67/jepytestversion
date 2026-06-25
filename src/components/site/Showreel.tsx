import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export const SHOWREEL_SRC = "https://www.w3schools.com/html/mov_bbb.mp4";

export function Showreel() {
  const sectionRef = useRef<HTMLElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const section = sectionRef.current;
    const box = boxRef.current;
    if (!section || !box) return;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
      const scale = 1 - p * 0.15;
      const radius = 16 + p * 16;
      box.style.transform = `scale(${scale})`;
      box.style.borderRadius = `${radius}px`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-background py-16 md:py-24"
      aria-label="Showreel"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div
          ref={boxRef}
          className="relative mx-auto w-full overflow-hidden will-change-transform aspect-video max-h-[50vh] md:max-h-[70vh]"
          style={{ transition: "border-radius 200ms ease", borderRadius: 16 }}
        >
          <video
            ref={videoRef}
            src={SHOWREEL_SRC}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-2">
            <div
              className="text-xs md:text-sm uppercase tracking-[0.4em] text-white/85"
              style={{ animation: "fade-in 1.6s ease both" }}
            >
              Our Showreel
            </div>
            <div
              className="text-[var(--accent)] text-2xl"
              style={{ animation: "arrow-pulse 1.8s ease-in-out infinite" }}
              aria-hidden
            >
              ↓
            </div>
          </div>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Unmute video" : "Mute video"}
            aria-pressed={!muted}
            className="absolute bottom-4 right-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-md ring-1 ring-white/15 hover:bg-black/70 transition"
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>
    </section>
  );
}
