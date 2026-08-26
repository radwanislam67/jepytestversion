import { useEffect, useState } from "react";

const VIDEO_HOST = "https://videos.jepystudio.com";

const XOR_KEY = new Uint8Array([
  0x4a, 0x9f, 0x21, 0xd3, 0x7c, 0x05, 0xe8, 0xb2,
  0x66, 0x1d, 0xaa, 0x38, 0xf1, 0x90, 0x5e, 0xc7,
]);

const cache = new Map<string, string>();

async function loadVideo(key: string): Promise<string> {
  if (cache.has(key)) return cache.get(key)!;

  const signRes = await fetch(`${VIDEO_HOST}/sign?key=${encodeURIComponent(key)}`);
  if (!signRes.ok) throw new Error(`sign failed: ${signRes.status}`);
  const { url } = await signRes.json();

  const res = await fetch(`${VIDEO_HOST}${url}`);
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
  const buf = new Uint8Array(await res.arrayBuffer());

  for (let i = 0; i < buf.length; i++) buf[i] ^= XOR_KEY[i % XOR_KEY.length];

  const blobUrl = URL.createObjectURL(new Blob([buf], { type: "video/mp4" }));
  cache.set(key, blobUrl);
  return blobUrl;
}

export function useProtectedVideo(key: string) {
  const [src, setSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    loadVideo(key)
      .then((u) => alive && setSrc(u))
      .catch((e) => alive && setError(String(e)));
    return () => { alive = false; };
  }, [key]);

  return { src, error };
}
