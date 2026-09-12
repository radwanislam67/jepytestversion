export type WorkProject = {
  id: string;
  title: string;
  tag: string;
  desc: string;
  beforeKey: string;
  afterKey: string;
  /** Optional hand-made card thumbnail (R2 /thumb). Falls back to the clip's own poster. */
  thumb?: string;
};

/**
 * R2 serves these thumbnails with `Cache-Control: max-age=14400`, and Cloudflare's
 * edge then holds that copy for the whole window. Re-uploading a file to the same
 * path therefore keeps serving the OLD bytes for up to four hours — `cf-cache-status:
 * HIT`, R2 is never consulted, and a browser hard refresh cannot help because the
 * request never leaves the edge. A changed query string is a new cache key, so the
 * fresh object is fetched the moment this is bumped.
 *
 * Bump this whenever a thumbnail is re-uploaded to R2.
 */
export const THUMB_VERSION = "20260912a";

export const thumbUrl = (name: string) =>
  `https://cdn.jepystudio.com/thumb/${name}?v=${THUMB_VERSION}`;

export const WORK_PROJECTS: WorkProject[] = [
  {
    id: "p1",
    title: "Property Film",
    tag: "VIDEO EDITING",
    desc: "A cinematic real estate film built to sell the space.",
    beforeKey: "Aron Before.mp4",
    afterKey: "After Aron.mp4",
  },
  {
    id: "p2",
    title: "AI Video Generation Tutorial",
    tag: "MOTION DESIGN",
    desc: "Fast-paced tutorial on generating videos with AI.",
    beforeKey: "Car Before.mp4",
    afterKey: "Car After.mp4",
    thumb: thumbUrl("enzo.webp"),
  },
  {
    id: "p3",
    title: "Finance Brand Film",
    tag: "COMMERCIAL",
    desc: "Finance brand content cut for trust and retention.",
    beforeKey: "Hadia Before.mp4",
    afterKey: "Hadia After.mp4",
    thumb: thumbUrl("hedo.webp"),
  },
];
