import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { IpWatermark, PROTECTED_VIDEO_PROPS, VideoShield } from "@/components/site/VideoWatermark";
import { VideoSkeleton } from "@/components/site/VideoSkeleton";
import { useProtectedVideo } from "@/hooks/useProtectedVideo";

export function Showreel() {
  const sectionRef = useRef<HTMLElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const { videoRef, ready, progress } = useProtectedVideo("Showreel.mp4");
  const [muted, setMuted] = useState(true);
  useEffect(() => {
    const v = videoRef.current;
    if (!ready || !v) return;
    v.muted = muted;
    void v.play().catch(() => {});
  }, [ready, muted]);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      box.style.opacity = "1";
      box.style.transform = "translateY(0) scale(1)";
      return;
    }
    box.style.opacity = "0";
    box.style.transform = "translateY(56px) scale(.94)";
    box.style.transition = "opacity 0.9s ease, transform 1s cubic-bezier(.22,.9,.25,1)";
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
      className="relative w-full pt-16 md:pt-20 pb-0 section-light"
      aria-label="Showreel"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div
          ref={boxRef}
          className="relative mx-auto w-full overflow-hidden will-change-transform aspect-video max-h-[50vh] md:max-h-[70vh] rounded-2xl"
          style={{
            border: "1px solid rgba(48,217,75,.22)",
            boxShadow:
              "0 0 90px -30px rgba(48,217,75,.5), inset 0 1px 0 rgba(255,255,255,.06)",
          }}
        >
          {!ready && <VideoSkeleton progress={progress} />}
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
            style={{ opacity: ready ? 1 : 0, transition: "opacity 250ms ease" }}
            {...PROTECTED_VIDEO_PROPS}
          />
          <VideoShield />
          <IpWatermark enabled={false} />
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
