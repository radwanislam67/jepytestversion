import { useEffect, useState } from "react";
import { X, Loader2, ArrowUpRight } from "lucide-react";

type Props = {
  open: boolean;
  url: string;
  name?: string;
  email?: string;
  onClose: () => void;
};

const SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";
const CSS_HREF = "https://assets.calendly.com/assets/external/widget.css";

function ensureCalendlyAssets(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === "undefined") return resolve();
    // CSS
    if (!document.querySelector(`link[href="${CSS_HREF}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = CSS_HREF;
      document.head.appendChild(link);
    }
    // JS
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      if ((window as any).Calendly) return resolve();
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Calendly script failed")));
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Calendly script failed"));
    document.head.appendChild(script);
  });
}

export function CalendlyModal({ open, url, name, email, onClose }: Props) {
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const prefilledUrl = (() => {
    try {
      const u = new URL(url);
      if (name) u.searchParams.set("name", name);
      if (email) u.searchParams.set("email", email);
      return u.toString();
    } catch {
      return url;
    }
  })();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    const onMessage = (e: MessageEvent) => {
      const data = e.data;
      if (data && typeof data === "object" && (data as any).event === "calendly.event_scheduled") {
        setTimeout(() => { onClose(); }, 3500);
      }
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("message", onMessage);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("message", onMessage);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setFailed(false);
    let cancelled = false;
    ensureCalendlyAssets()
      .then(() => {
        if (cancelled) return;
        const container = document.getElementById("calendly-inline-target");
        const Cal = (window as any).Calendly;
        if (container && Cal?.initInlineWidget) {
          container.innerHTML = "";
          Cal.initInlineWidget({ url: prefilledUrl, parentElement: container });
          // Give widget a moment to render iframe
          setTimeout(() => { if (!cancelled) setLoading(false); }, 800);
        } else {
          setFailed(true);
          setLoading(false);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setFailed(true);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [open, prefilledUrl]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-stretch md:items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Book a Calendly meeting"
    >
      <div
        className="relative w-full md:max-w-[700px] md:mx-4 md:rounded-3xl bg-[#0a0a0a] border border-white/10 flex flex-col h-full md:h-[85vh] md:max-h-[820px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 px-4 md:px-6 py-3 border-b border-white/5 bg-[#0a0a0a]">
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-medium text-foreground/80 hover:text-[#53FF2F] transition-colors"
          >
            Skip / I&apos;ll book later
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="h-9 w-9 rounded-full flex items-center justify-center text-foreground/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative flex-1 bg-[#0a0a0a]">
          {loading && !failed && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 bg-[#0a0a0a]">
              <Loader2 size={28} className="animate-spin text-[#53FF2F]" />
              <p className="text-sm text-foreground/60">Loading calendar…</p>
            </div>
          )}
          {failed ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
              <p className="text-foreground/80">You can also book directly here:</p>
              <a
                href={prefilledUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#53FF2F] text-[#050505] font-semibold px-6 py-3 hover:brightness-110 transition"
              >
                Open Calendly <ArrowUpRight size={16} />
              </a>
            </div>
          ) : (
            <div
              id="calendly-inline-target"
              className="w-full h-full"
              style={{ minWidth: 320 }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
