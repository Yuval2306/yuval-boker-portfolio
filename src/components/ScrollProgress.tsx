import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? h.scrollTop / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] h-[3px] bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 shadow-[0_0_12px_rgba(34,211,238,0.7)]"
        style={{ width: `${progress * 100}%`, transition: "width 0.1s linear" }}
      />
    </div>
  );
}
