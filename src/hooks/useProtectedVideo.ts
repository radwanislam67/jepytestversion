import { useEffect, useRef, useState } from "react";

const VIDEO_HOST = "https://videos.jepystudio.com";

/** Static poster frames generated from the videos with ffmpeg (see public/video-posters). */
const POSTERS: Record<string, string> = {
  "Showreel.mp4": "showreel",
  "Before.mp4": "before",
  "After.mp4": "after",
  "Aron Before.mp4": "aron-before",
  "After Aron.mp4": "after-aron",
  "Car Before.mp4": "car-before",
  "Car After.mp4": "car-after",
  "Hadia Before.mp4": "hadia-before",
  "Hadia After.mp4": "hadia-after",
  "Cris Cordio.mp4": "cris-cordio",
};

export function posterFor(key: string): string | undefined {
  const slug = POSTERS[key];
  return slug ? `/video-posters/${slug}.webp` : undefined;
}

/**
 * On-screen width / height of each clip, i.e. AFTER its pixel aspect ratio is applied.
 * These are anamorphic files: Car After.mp4 is coded 1080x720 but renders 1080x1920, so
 * a container that hard-codes 9:16 crops whichever clip does not happen to be 9:16.
 * Sizing every frame from this map keeps the crop at zero.
 */
const RATIOS: Record<string, number> = {
  "Showreel.mp4": 1280 / 830,
  "Before.mp4": 120 / 179,
  "After.mp4": 9 / 16,
  "Aron Before.mp4": 360 / 640,
  "After Aron.mp4": 406 / 720,
  "Car Before.mp4": 270 / 403,
  "Car After.mp4": 1080 / 1920,
  "Hadia Before.mp4": 120 / 211,
  "Hadia After.mp4": 720 / 1280,
  "Cris Cordio.mp4": 1080 / 1732,
};

export function ratioFor(key: string): string | undefined {
  const ratio = RATIOS[key];
  return ratio ? String(ratio) : undefined;
}

interface SignedEntry {
  url: string;
  expiresAt: number;
}

const signCache = new Map<string, SignedEntry>();
const pendingSigns = new Map<string, Promise<SignedEntry>>();

/** The Worker's token path is /a/<base64("key|epochSeconds")>.<sig>, so the expiry
 *  can be read straight off the token. Falls back to a conservative TTL. */
function expiryFromToken(tokenUrl: string): number {
  try {
    const payload = tokenUrl.split("/").filter(Boolean)[1]?.split(".")[0];
    if (!payload) throw new Error("no payload");
    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
    const epoch = Number(decoded.split("|")[1]);
    if (Number.isFinite(epoch) && epoch > 0) return epoch * 1000;
  } catch {
    /* fall through to the conservative default */
  }
  return Date.now() + 45 * 60 * 1000;
}

/**
 * Resolve a short-lived signed URL for a video key.
 * Cached until it is within a minute of expiring, so a mounted video and a
 * warm-up request share one signature.
 */
export async function signedUrlFor(key: string, force = false): Promise<string> {
  const cached = signCache.get(key);
  if (!force && cached && cached.expiresAt - Date.now() > 60_000) return cached.url;

  if (!force) {
    const pending = pendingSigns.get(key);
    if (pending) return (await pending).url;
  }

  const task = (async (): Promise<SignedEntry> => {
    const res = await fetch(`${VIDEO_HOST}/sign?key=${encodeURIComponent(key)}`);
    if (!res.ok) throw new Error(`sign failed: ${res.status}`);
    const { url } = (await res.json()) as { url?: string };
    if (!url) throw new Error("sign response had no url");
    const entry: SignedEntry = {
      url: `${VIDEO_HOST}${url}`,
      expiresAt: expiryFromToken(url),
    };
    signCache.set(key, entry);
    return entry;
  })();

  pendingSigns.set(key, task);
  try {
    const entry = await task;
    return entry.url;
  } finally {
    pendingSigns.delete(key);
  }
}

/**
 * Warm the signature (and the TLS connection) for videos we expect to need soon.
 * A one-byte ranged GET is enough to open the connection and prime the edge.
 * Never throws.
 */
export async function warmVideos(keys: string[]): Promise<void> {
  const unique = keys.filter((k, i) => keys.indexOf(k) === i);
  await Promise.allSettled(
    unique.map(async (key) => {
      const url = await signedUrlFor(key);
      await fetch(url, { headers: { Range: "bytes=0-1" } }).then((r) => r.arrayBuffer());
    }),
  );
}

/**
 * Point a <video> straight at the CDN's signed URL so the browser streams it with
 * Range requests and can start playing after a few kilobytes — no full download,
 * no blob URL.
 */
export function useProtectedVideo(key: string) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    let reSigned = false;

    setReady(false);
    setError(null);
    setProgress(0);

    const onLoaded = () => {
      if (!cancelled) setReady(true);
    };

    const onProgress = () => {
      if (cancelled) return;
      const duration = video.duration;
      if (!Number.isFinite(duration) || duration <= 0 || video.buffered.length === 0) return;
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      setProgress(Math.min(1, bufferedEnd / duration));
    };

    const onError = () => {
      if (cancelled) return;
      // The signature may simply have expired — re-sign once before giving up.
      if (!reSigned) {
        reSigned = true;
        const at = video.currentTime;
        void signedUrlFor(key, true)
          .then((url) => {
            if (cancelled) return;
            video.src = url;
            video.load();
            if (at > 0) video.currentTime = at;
          })
          .catch(() => {
            if (!cancelled) setError("video unavailable");
          });
        return;
      }
      setError("video failed to load");
    };

    video.addEventListener("loadeddata", onLoaded);
    video.addEventListener("progress", onProgress);
    video.addEventListener("error", onError);

    void signedUrlFor(key)
      .then((url) => {
        if (cancelled) return;
        if (video.src === url) return;
        video.src = url;
        video.load();
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(String(e));
      });

    return () => {
      cancelled = true;
      video.removeEventListener("loadeddata", onLoaded);
      video.removeEventListener("progress", onProgress);
      video.removeEventListener("error", onError);
      video.removeAttribute("src");
      video.load();
    };
  }, [key]);

  return { videoRef, ready, error, progress, poster: posterFor(key) };
}
