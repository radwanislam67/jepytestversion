import { useEffect } from "react";

/**
 * Clips that should only play their opening slice and then loop back to the start.
 * Finance Brand Film runs long past the usable cut, so it plays 0 → 24s on repeat.
 */
const OUT_AT: Record<string, number> = {
  "Hadia After.mp4": 24,
};

/** Where playback jumps back to the start, or undefined to play the whole clip. */
export function outAtFor(key: string): number | undefined {
  return OUT_AT[key];
}

/** The loop length for a clip — shorter than the file when it has a cut point. */
export function effectiveDuration(key: string, duration: number): number {
  const outAt = OUT_AT[key];
  if (!outAt || !Number.isFinite(duration) || duration <= 0) return duration;
  return Math.min(outAt, duration);
}

/** Keeps a plain <video> inside [0, outAt] for clips that carry a cut point. */
export function useClipWindow(videoRef: React.RefObject<HTMLVideoElement | null>, key: string) {
  useEffect(() => {
    const video = videoRef.current;
    const outAt = OUT_AT[key];
    if (!video || !outAt) return;
    const onTime = () => {
      if (video.currentTime >= outAt) video.currentTime = 0;
    };
    video.addEventListener("timeupdate", onTime);
    return () => video.removeEventListener("timeupdate", onTime);
  }, [videoRef, key]);
}
