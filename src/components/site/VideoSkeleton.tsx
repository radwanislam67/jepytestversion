import type { CSSProperties } from "react";

interface VideoSkeletonProps {
  className?: string;
  progress?: number | null;
  label?: string;
  style?: CSSProperties;
}

export function VideoSkeleton({ className = "", progress, label, style }: VideoSkeletonProps) {
  return (
    <div className={`jepy-skeleton ${className}`} style={style}>
      <div className="jepy-skeleton-shimmer" />
      {progress != null && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 overflow-hidden">
          <div
            className="h-full bg-[#30d94b] transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
          />
        </div>
      )}
      {label && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-xs uppercase tracking-[0.18em] text-white/40"
            style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
          >
            {label}
          </span>
        </div>
      )}
    </div>
  );
}
