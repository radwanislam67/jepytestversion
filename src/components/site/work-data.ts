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
    thumb: "https://cdn.jepystudio.com/thumb/enzo.webp",
  },
  {
    id: "p3",
    title: "Finance Brand Film",
    tag: "COMMERCIAL",
    desc: "Finance brand content cut for trust and retention.",
    beforeKey: "Hadia Before.mp4",
    afterKey: "Hadia After.mp4",
    thumb: "https://cdn.jepystudio.com/thumb/hedo.webp",
  },
];
