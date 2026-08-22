import { useEffect, useState } from "react";

export function Typewriter({ words }: { words: string[] }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIndex];
    let delay: number;

    if (!deleting && text === word) {
      delay = 2200; // pause on full word
    } else if (deleting && text === "") {
      delay = 300;
    } else {
      delay = deleting ? 35 : 65;
    }

    const timer = setTimeout(() => {
      if (!deleting && text === word) {
        setDeleting(true);
      } else if (deleting && text === "") {
        setDeleting(false);
        setWordIndex((i) => (i + 1) % words.length);
      } else {
        setText(word.slice(0, text.length + (deleting ? -1 : 1)));
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [text, deleting, wordIndex, words]);

  return (
    <span className="inline-flex items-baseline">
      <span>{text}</span>
      <span className="ml-1 w-[3px] h-[1.1em] bg-cyan-400 animate-blink self-center rounded-full" />
    </span>
  );
}
