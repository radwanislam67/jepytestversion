import { useEffect, useRef, useId } from "react";

/**
 * Only one video on the page may be audible at a time.
 *
 * Every player registers its element; whoever unmutes claims the bus and every
 * other registered element is muted straight away. That stops a showreel that is
 * already unmuted from talking over a card the visitor just opened.
 */

type Listener = (ownerId: string | null) => void;

const elements = new Map<string, HTMLVideoElement>();
const listeners = new Set<Listener>();
let ownerId: string | null = null;

export function registerVideo(id: string, el: HTMLVideoElement): void {
  elements.set(id, el);
}

export function unregisterVideo(id: string): void {
  elements.delete(id);
  if (ownerId === id) ownerId = null;
}

export function claimAudio(id: string): void {
  ownerId = id;
  elements.forEach((el, key) => {
    if (key !== id) el.muted = true;
  });
  listeners.forEach((l) => l(ownerId));
}

export function releaseAudio(id: string): void {
  if (ownerId !== id) return;
  ownerId = null;
  listeners.forEach((l) => l(ownerId));
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Wire a player into the bus. `onMutedByOther` fires when another player takes
 * the audio so the component can flip its own mute button back.
 */
export function useAudioBus(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  onMutedByOther: () => void,
) {
  const id = useId();
  const callbackRef = useRef(onMutedByOther);
  callbackRef.current = onMutedByOther;

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    registerVideo(id, el);
    const unsubscribe = subscribe((owner) => {
      if (owner && owner !== id) callbackRef.current();
    });
    return () => {
      unsubscribe();
      unregisterVideo(id);
    };
  }, [id, videoRef]);

  return {
    claim: () => claimAudio(id),
    release: () => releaseAudio(id),
  };
}

/**
 * Silence and pause a video as soon as its section leaves the viewport, and pick it
 * up again when the section comes back.
 *
 * The bus above only arbitrates *which* video may be audible — it never reacts to
 * scrolling, so a hero clip or showreel the visitor had unmuted kept talking while
 * they read the rest of the page. `onSilenced` is where the caller flips its own
 * mute state and hands the bus back.
 */
export function useOffscreenSilence(
  containerRef: React.RefObject<HTMLElement | null>,
  videoRef: React.RefObject<HTMLVideoElement | null>,
  onSilenced: () => void,
) {
  const callbackRef = useRef(onSilenced);
  callbackRef.current = onSilenced;

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    // The negative margin leaves only the middle 50% of the viewport as the "really
    // on screen" zone, so a section that is merely peeking in does not toggle the
    // sound on and off as the visitor scrolls past it.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // These clips are decorative and carry no pause control of their own, so
            // resuming on entry is always right. They stay muted: the visitor's
            // unmute was tied to the moment they were watching.
            void video.play().catch(() => {});
            return;
          }
          if (!video.muted) {
            video.muted = true;
            callbackRef.current();
          }
          video.pause();
        });
      },
      { threshold: 0, rootMargin: "-25% 0px -25% 0px" },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef, videoRef]);
}
