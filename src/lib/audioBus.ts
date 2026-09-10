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
