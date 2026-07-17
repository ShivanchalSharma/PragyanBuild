import { useEffect, useState } from "react";

const DEFAULT_WORDS = [
  "EV-charging",
  "climate-tech",
  "agri-drone",
  "fintech",
  "deep-tech",
  "healthtech",
  "space-tech",
  "D2C",
];

/**
 * Types a founder idea, holds, deletes, and moves to the next — so the hero
 * headline reads "Your <idea> startup starts here." with a live, cycling idea.
 */
export function IdeaTypewriter({
  words = DEFAULT_WORDS,
  className = "",
}: {
  words?: string[];
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">("typing");

  useEffect(() => {
    const word = words[index];
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (text.length < word.length) {
        timeout = setTimeout(() => setText(word.slice(0, text.length + 1)), 75);
      } else {
        timeout = setTimeout(() => setPhase("deleting"), 1600);
      }
    } else if (phase === "deleting") {
      if (text.length > 0) {
        timeout = setTimeout(() => setText(word.slice(0, text.length - 1)), 38);
      } else {
        setIndex((p) => (p + 1) % words.length);
        setPhase("typing");
      }
    }

    return () => clearTimeout(timeout);
  }, [text, phase, index, words]);

  return (
    <span className={`inline-flex items-baseline ${className}`}>
      <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
        {text || "\u00A0"}
      </span>
      <span
        aria-hidden
        className="inline-block w-[3px] md:w-[4px] self-center bg-accent ml-1.5 animate-pulse-soft"
        style={{ height: "0.82em" }}
      />
    </span>
  );
}