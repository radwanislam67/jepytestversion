import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export const SHOWREEL_SRC = "https://www.w3schools.com/html/mov_bbb.mp4";

export function Showreel() {
  const sectionRef = useRef<HTMLElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    box.style.opacity = "0";
    box.style.transform = "translateY(60px) scale(0.95)";
    box.style.transition =
      "opacity 0.8s cubic-bezier(.2,.8,.2,1), transform 0.8s cubic-bezier(.2,.8,.2,1)";
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            box.style.opacity = "1";
            box.style.transform = "translateY(0) scale(1)";
            io.unobserve(box);
          }
        });
      },
      { threshold: 0.2 },
    );
    io.observe(box);
    return () => io.disconnect();
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
      className="relative w-full bg-background pt-16 md:pt-20 pb-0"
      aria-label="Showreel"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div
          ref={boxRef}
          className="relative mx-auto w-full overflow-hidden will-change-transform aspect-video max-h-[50vh] md:max-h-[70vh] rounded-2xl"
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
