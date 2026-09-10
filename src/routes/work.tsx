import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Stats } from "@/components/site/Stats";
import { CTASection } from "@/components/site/CTASection";
import { useProtectedVideo } from "@/hooks/useProtectedVideo";
import { useInView } from "@/hooks/use-in-view";
import { PROTECTED_VIDEO_PROPS } from "@/components/site/VideoWatermark";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Work | Jepy" },
      { name: "description", content: "Selected edits, films and motion work from the Jepy studio." },
      { property: "og:title", content: "Work | Jepy" },
      { property: "og:description", content: "Every frame tells a story." },
    ],
  }),
  component: WorkPage,
});

const ITEMS = [
  { id: "w1", title: "Property Film", subtitle: "A cinematic real estate film built to sell the space.", category: "Video Editing", afterKey: "After Aron.mp4" },
  { id: "w2", title: "AI Video Generation Tutorial", subtitle: "Fast-paced tutorial on generating videos with AI.", category: "Motion Design", afterKey: "Car After.mp4" },
  { id: "w3", title: "Finance Brand Film", subtitle: "Finance brand content cut for trust and retention.", category: "Commercial", afterKey: "Hadia After.mp4" },
  { id: "w4", title: "AI Video Shorts", subtitle: "Short-form AI clips, cut to stop the scroll.", category: "Short Form", afterKey: "Cris Cordio.mp4" },
];

const FILTERS = ["All", "Video Editing", "Motion Design", "Commercial", "Short Form"] as const;

function WorkCard({ item }: { item: (typeof ITEMS)[number] }) {
  const { videoRef, ready } = useProtectedVideo(item.afterKey);
  const { ref: inViewRef, inView } = useInView<HTMLDivElement>({ threshold: 0.25 });
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView && ready) {
      void v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [inView, ready, videoRef]);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <div
      ref={inViewRef}
      className="group relative block w-full text-left overflow-hidden transition-all duration-200"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.015))",
        border: "1px solid rgba(255,255,255,.1)",
        borderRadius: "12px",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,.06), 0 30px 60px -30px rgba(0,0,0,.8)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.borderColor = "rgba(48,217,75,.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.borderColor = "rgba(255,255,255,.1)";
      }}
    >
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: "9 / 16", background: "#0d0d0d", borderRadius: "10px" }}
      >
        <span className="absolute top-3 left-3 z-10 text-xs uppercase tracking-[0.15em] px-2 py-1 rounded-full border border-[rgba(48,217,75,.35)] text-[#d8ffdf] bg-[rgba(20,20,20,.55)] backdrop-blur-sm">
          {item.category}
        </span>
        <video
          ref={videoRef}
          muted={muted}
          loop
          playsInline
          className="h-full w-full object-cover"
          {...PROTECTED_VIDEO_PROPS}
        />
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute video" : "Mute video"}
          aria-pressed={!muted}
          className="absolute bottom-3 right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-md ring-1 ring-white/15 hover:bg-black/70 transition"
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>
      <div className="p-4">
        <div className="text-base font-medium text-white">{item.title}</div>
        <div className="text-sm text-[#a3a3a3] mt-1 line-clamp-1">{item.subtitle}</div>
      </div>
    </div>
  );
}

function WorkPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const visible = useMemo(
    () => (filter === "All" ? ITEMS : ITEMS.filter((i) => i.category === filter)),
    [filter],
  );

  return (
    <>
      <section className="relative pt-32 md:pt-36 pb-16 md:pb-20 section-light">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <h1 className="font-display text-6xl md:text-8xl tracking-tighter text-center">
              Our <span className="text-[var(--accent)] text-glow">Work</span>
            </h1>
          </Reveal>

          <div className="mt-8">
            <Stats />
          </div>

          <div className="mt-4 mb-8 flex flex-wrap gap-3 justify-center">
            {FILTERS.map((f) => {
              const isActive = f === filter;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={
                    "rounded-full px-4 py-1.5 text-sm transition-all duration-200 border " +
                    (isActive
                      ? "bg-[rgba(48,217,75,.12)] text-[#d8ffdf] border-[rgba(48,217,75,.35)]"
                      : "text-foreground/55 border-white/10 hover:text-foreground hover:border-white/30")
                  }
                >
                  {f}
                </button>
              );
            })}
          </div>

          <div className="rounded-3xl border border-white/10 bg-[rgba(255,255,255,.02)] p-6 transition-opacity duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((w, i) => (
                <Reveal key={w.id} delay={i * 80}>
                  <WorkCard item={w} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Reveal delay={100}>
        <p className="text-center text-foreground/55 text-sm py-12">
          Trusted by creators and teams worldwide.
        </p>
      </Reveal>
      <CTASection />
    </>
  );
}
