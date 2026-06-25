import { useEffect } from "react";
import { X } from "lucide-react";

export function VideoModal({
  open,
  onClose,
  youtubeId,
  title,
}: {
  open: boolean;
  onClose: () => void;
  youtubeId: string;
  title?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title ?? "Video"}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute top-5 right-5 inline-flex h-11 w-11 items-center justify-center rounded-full text-white"
        style={{ background: "rgba(255,255,255,0.08)" }}
      >
        <X size={20} />
      </button>
      <div
        className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden border border-[var(--accent)]/30"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: "0 0 80px -10px rgba(83,255,47,0.4)" }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={title ?? "Video"}
          className="h-full w-full"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    </div>
  );
}
