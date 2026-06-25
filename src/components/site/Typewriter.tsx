import { useEffect, useState } from "react";

const WORDS = [
  "Cinematic Edits",
  "Motion Graphics",
  "High-Converting Ads",
  "Viral Short-Form",
  "Channel-Growing Edits",
  "Cinematic Color Grading",
  "Hook-First Content",
  "Scroll-Stopping Reels",
];

const TYPE_MS = 70;
const DELETE_MS = 40;
const HOLD_MS = 1500;

export function Typewriter() {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = WORDS[i % WORDS.length];
    if (!deleting && text === word) {
      const t = setTimeout(() => setDeleting(true), HOLD_MS);
      return () => clearTimeout(t);
    }
    if (deleting && text === "") {
      setDeleting(false);
      setI((p) => (p + 1) % WORDS.length);
      return;
    }
    const t = setTimeout(
      () => {
        setText((cur) =>
          deleting ? word.slice(0, cur.length - 1) : word.slice(0, cur.length + 1),
        );
      },
      deleting ? DELETE_MS : TYPE_MS,
    );
    return () => clearTimeout(t);
  }, [text, deleting, i]);

  return (
    <span className="inline-flex items-baseline">
      <span className="text-[var(--accent)] text-glow">{text}</span>
      <span
        aria-hidden
        className="inline-block w-[2px] md:w-[3px] self-stretch ml-1 bg-[var(--accent)]"
        style={{ animation: "tw-blink 1s steps(2) infinite" }}
      />
    </span>
  );
}
