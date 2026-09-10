import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { IpWatermark, PROTECTED_VIDEO_PROPS, VideoShield } from "@/components/site/VideoWatermark";
import { useProtectedVideo } from "@/hooks/useProtectedVideo";
import { useAudioBus } from "@/lib/audioBus";

export function Showreel() {
  const sectionRef = useRef<HTMLElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const { videoRef, ready } = useProtectedVideo("Showreel.mp4");
  const [muted, setMuted] = useState(true);
  const audio = useAudioBus(videoRef, () => setMuted(true));
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
    const next = !v.muted;
    v.muted = next;
    setMuted(next);
    if (next) audio.release();
    else audio.claim();
    // Unmuting restarts the reel so the sound is heard from the top.
    if (!next) {
      v.currentTime = 0;
      void v.play().catch(() => {});
    }
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
          className="relative mx-auto w-full overflow-hidden will-change-transform aspect-video rounded-2xl"
          style={{
            border: "1px solid rgba(48,217,75,.22)",
            boxShadow:
              "0 0 90px -30px rgba(48,217,75,.5), inset 0 1px 0 rgba(255,255,255,.06)",
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/video-posters/showreel.webp"
            className="h-full w-full object-cover will-change-transform"
            style={{
              opacity: ready ? 1 : 0,
              transform: ready ? "scale(1)" : "scale(1.06)",
              transition: "opacity 400ms ease, transform 1.6s cubic-bezier(.22,1,.36,1)",
            }}
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
