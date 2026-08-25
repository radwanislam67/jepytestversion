// TODO: replace with Cloudflare R2 CDN URLs
export type WorkProject = {
  id: string;
  title: string;
  tag: string;
  desc: string;
  beforeUrl: string;
  afterUrl: string;
  showreelUrl: string;
};

export const WORK_PROJECTS: WorkProject[] = [
  {
    id: "p1",
    title: "Northwave — Brand Film",
    tag: "COMMERCIAL",
    desc: "Cinematic brand story for a premium lifestyle label.",
    beforeUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    afterUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    showreelUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "p2",
    title: "Lumen — Product Reel",
    tag: "MOTION DESIGN",
    desc: "High-energy product showcase with motion graphics.",
    beforeUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    afterUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    showreelUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "p3",
    title: "Octave — Creator Series",
    tag: "LONG FORM",
    desc: "Long-form series edited for retention.",
    beforeUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    afterUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    showreelUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
];
