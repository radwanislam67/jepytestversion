import { useEffect, useRef, useState } from "react";

const VIDEO_HOST = "https://videos.jepystudio.com";

const XOR_KEY = new Uint8Array([0x4a, 0x9f, 0x21, 0xd3, 0x7c, 0x05, 0xe8, 0xb2, 0x66, 0x1d, 0xaa, 0x38, 0xf1, 0x90, 0x5e, 0xc7]);

const MSE_MIME = 'video/mp4; codecs="avc1.4d001f, mp4a.40.2"';

declare global {
  interface Window {
    __vp?: Record<string, Promise<ArrayBuffer>>;
    ManagedMediaSource?: typeof MediaSource;
  }
}

const CONCURRENCY = 2;

interface CachedEntry {
  promise: Promise<Uint8Array>;
  receivedBytes: number;
  totalBytes: number | null;
}

const bytesCache = new Map<string, CachedEntry>();
const inFlight = new Set<string>();
const queue: Array<() => void> = [];
let activeCount = 0;

function yieldToMain(): Promise<void> {
  return new Promise((r) => setTimeout(r, 0));
}

async function fetchScrambled(
  key: string,
  onProgress: (received: number, total: number | null) => void,
): Promise<ArrayBuffer> {
  const signRes = await fetch(`${VIDEO_HOST}/sign?key=${encodeURIComponent(key)}`);
  if (!signRes.ok) throw new Error(`sign failed: ${signRes.status}`);
  const { url } = await signRes.json();
  const res = await fetch(`${VIDEO_HOST}${url}`);
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`);

  const totalHeader = res.headers.get("content-length");
  const totalBytes = totalHeader ? Number(totalHeader) : null;

  const reader = res.body!.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;
  let lastYield = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.byteLength;
    onProgress(received, totalBytes);
    if (received - lastYield >= 1024 * 1024) {
      lastYield = received;
      await yieldToMain();
    }
  }

  const out = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return out.buffer;
}

async function processKey(
  key: string,
  onProgress: (received: number, total: number | null) => void,
): Promise<Uint8Array> {
  let buf: ArrayBuffer | undefined;
  try {
    buf = window.__vp?.[key] ? await window.__vp[key] : undefined;
    if (!buf) buf = await fetchScrambled(key, onProgress);
  } catch {
    buf = await fetchScrambled(key, onProgress);
  }
  // The CDN no longer XORs the bytes and R2 holds plain mp4 files, so no descrambling is needed.
  return new Uint8Array(buf);
}

function enqueueFetch(key: string): CachedEntry {
  const entry: CachedEntry = {
    promise: null as unknown as Promise<Uint8Array>,
    receivedBytes: 0,
    totalBytes: null,
  };
  const promise = processKey(key, (received, total) => {
    entry.receivedBytes = received;
    entry.totalBytes = total;
  });
  promise.catch(() => bytesCache.delete(key));
  entry.promise = promise;
  bytesCache.set(key, entry);
  return entry;
}

function getOrEnqueue(key: string): CachedEntry {
  const existing = bytesCache.get(key);
  if (existing) return existing;
  return enqueueFetch(key);
}

function runJob(key: string): Promise<void> {
  if (inFlight.has(key)) return Promise.resolve();
  inFlight.add(key);
  const entry = getOrEnqueue(key);
  return entry.promise.then(
    () => { inFlight.delete(key); },
    () => { inFlight.delete(key); }
  );
}

function pump(): void {
  while (activeCount < CONCURRENCY && queue.length > 0) {
    const job = queue.shift();
    if (!job) break;
    activeCount++;
    job();
  }
}

function schedule(key: string): Promise<void> {
  return new Promise<void>((resolve) => {
    queue.push(() => {
      runJob(key).then(() => {
        activeCount--;
        resolve();
        pump();
      });
    });
    pump();
  });
}

/** Browser-only warm-up. Concurrency-capped (2), sequential priority order as
 *  given, dedupes against the cache and an in-flight set, never throws. */
export async function warmVideos(keys: string[]): Promise<void> {
  const unique = keys.filter((k, i) => keys.indexOf(k) === i);
  const promises = unique.map((k) => schedule(k));
  await Promise.allSettled(promises);
}

function attachViaBlob(
  video: HTMLVideoElement,
  key: string,
  onReady: () => void,
  onError: (e: unknown) => void,
): () => void {
  let cancelled = false;
  let blobUrl: string | null = null;
  let entry = bytesCache.get(key);
  if (!entry) entry = getOrEnqueue(key);

  const onLoadedData = () => {
    video.removeEventListener("loadeddata", onLoadedData);
    video.removeEventListener("error", onErrorOnce);
    if (!cancelled) onReady();
  };
  const onErrorOnce = (e: Event) => {
    video.removeEventListener("loadeddata", onLoadedData);
    video.removeEventListener("error", onErrorOnce);
    if (!cancelled) onError(e);
  };
  video.addEventListener("loadeddata", onLoadedData, { once: true });
  video.addEventListener("error", onErrorOnce, { once: true });

  entry.promise
    .then((bytes) => {
      if (cancelled) return;
      blobUrl = URL.createObjectURL(new Blob([bytes as BlobPart], { type: "video/mp4" }));
      video.src = blobUrl;
    })
    .catch((e) => {
      if (!cancelled) onError(e);
    });

  return () => {
    cancelled = true;
    video.removeEventListener("loadeddata", onLoadedData);
    video.removeEventListener("error", onErrorOnce);
    video.removeAttribute("src");
    video.load();
    if (blobUrl) URL.revokeObjectURL(blobUrl);
  };
}

export function useProtectedVideo(key: string) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    setReady(false);
    setError(null);
    setProgress(0);

    const detach = attachViaBlob(
      video,
      key,
      () => setReady(true),
      (e) => setError(String(e)),
    );

    // Poll cache progress while mounted
    const progressInterval = setInterval(() => {
      const entry = bytesCache.get(key);
      if (entry && entry.totalBytes) {
        setProgress(Math.min(1, entry.receivedBytes / entry.totalBytes));
      } else if (entry && entry.receivedBytes > 0) {
        // Indeterminate total — small progress based on bytes received
        setProgress(Math.min(0.9, entry.receivedBytes / (10 * 1024 * 1024)));
      }
    }, 200);

    return () => {
      clearInterval(progressInterval);
      detach();
    };
  }, [key]);

  return { videoRef, ready, error, progress };
}
