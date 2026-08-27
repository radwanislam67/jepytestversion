import { useEffect, useRef, useState } from "react";

const VIDEO_HOST = "https://videos.jepystudio.com";

const XOR_KEY = new Uint8Array([0x4a,0x9f,0x21,0xd3,0x7c,0x05,0xe8,0xb2,0x66,0x1d,0xaa,0x38,0xf1,0x90,0x5e,0xc7]);

const MSE_MIME = 'video/mp4; codecs="avc1.640028"';

declare global { interface Window { __vp?: Record<string, Promise<ArrayBuffer>>; ManagedMediaSource?: typeof MediaSource; } }

async function fetchScrambled(key: string): Promise<ArrayBuffer> {

  const signRes = await fetch(`${VIDEO_HOST}/sign?key=${encodeURIComponent(key)}`);

  if (!signRes.ok) throw new Error(`sign failed: ${signRes.status}`);

  const { url } = await signRes.json();

  const res = await fetch(`${VIDEO_HOST}${url}`);

  if (!res.ok) throw new Error(`fetch failed: ${res.status}`);

  return res.arrayBuffer();

}

function descramble(buf: ArrayBuffer): Uint8Array {

  const src = new Uint8Array(buf); const out = new Uint8Array(src.length);

  for (let i = 0; i < src.length; i++) out[i] = src[i] ^ XOR_KEY[i % XOR_KEY.length];

  return out;

}

const bytesCache = new Map<string, Promise<Uint8Array>>();

function getBytes(key: string): Promise<Uint8Array> {

  let p = bytesCache.get(key);

  if (!p) {

    p = (async () => {

      let buf: ArrayBuffer;

      try { buf = window.__vp?.[key] ? await window.__vp[key] : await fetchScrambled(key); }

      catch { buf = await fetchScrambled(key); }

      return descramble(buf);

    })();

    bytesCache.set(key, p);

    p.catch(() => bytesCache.delete(key));

  }

  return p;

}

function pickMediaSource(): typeof MediaSource | undefined {

  if (typeof MediaSource !== "undefined" && MediaSource.isTypeSupported?.(MSE_MIME)) return MediaSource;

  if (window.ManagedMediaSource?.isTypeSupported?.(MSE_MIME)) return window.ManagedMediaSource;

  return undefined;

}

function attachViaMSE(video: HTMLVideoElement, key: string, MS: typeof MediaSource, onReady: () => void, onError: (e: unknown) => void): () => void {

  let cancelled = false;

  const ms = new MS();

  const url = URL.createObjectURL(ms);

  ms.addEventListener("sourceopen", async () => {

    URL.revokeObjectURL(url);

    try {

      const bytes = await getBytes(key);

      if (cancelled || ms.readyState !== "open") return;

      const sb = ms.addSourceBuffer(MSE_MIME);

      sb.addEventListener("updateend", () => { if (!cancelled && ms.readyState === "open") ms.endOfStream(); onReady(); }, { once: true });

      sb.appendBuffer(bytes as BufferSource);

    } catch (e) { onError(e); }

  }, { once: true });

  video.src = url;

  return () => { cancelled = true; video.removeAttribute("src"); video.load(); };

}

function attachViaBlob(video: HTMLVideoElement, key: string, onReady: () => void, onError: (e: unknown) => void): () => void {

  let cancelled = false; let blobUrl: string | null = null;

  getBytes(key).then((bytes) => {

    if (cancelled) return;

    blobUrl = URL.createObjectURL(new Blob([bytes as BlobPart], { type: "video/mp4" }));

    video.src = blobUrl; onReady();

  }).catch(onError);

  return () => { cancelled = true; video.removeAttribute("src"); video.load(); if (blobUrl) URL.revokeObjectURL(blobUrl); };

}

export function useProtectedVideo(key: string) {

  const videoRef = useRef<HTMLVideoElement>(null);

  const [ready, setReady] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const video = videoRef.current;

    if (!video) return;

    setReady(false); setError(null);

    const MS = pickMediaSource();

    const detach = MS ? attachViaMSE(video, key, MS, () => setReady(true), (e) => setError(String(e))) : attachViaBlob(video, key, () => setReady(true), (e) => setError(String(e)));

    return detach;

  }, [key]);

  return { videoRef, ready, error };

}
