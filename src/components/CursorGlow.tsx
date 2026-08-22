import { useEffect, useRef, useState } from "react";

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (!enabled) return;
    const glow = glowRef.current;
    const dot = dotRef.current;
    if (!glow || !dot) return;

    const target = { x: -400, y: -400 };
    const glowPos = { x: -400, y: -400 };
    const dotPos = { x: -400, y: -400 };
    let raf = 0;

    function onMove(e: MouseEvent) {
      target.x = e.clientX;
      target.y = e.clientY;
    }

    function tick() {
      glowPos.x += (target.x - glowPos.x) * 0.1;
      glowPos.y += (target.y - glowPos.y) * 0.1;
      dotPos.x += (target.x - dotPos.x) * 0.45;
      dotPos.y += (target.y - dotPos.y) * 0.45;
      glow!.style.transform = `translate3d(${glowPos.x - 160}px, ${glowPos.y - 160}px, 0)`;
      dot!.style.transform = `translate3d(${dotPos.x - 3}px, ${dotPos.y - 3}px, 0)`;
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="fixed inset-0 z-[250] pointer-events-none overflow-hidden" aria-hidden="true">
      <div
        ref={glowRef}
        className="absolute h-80 w-80 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.14) 0%, rgba(34,211,238,0.06) 40%, transparent 70%)",
          mixBlendMode: "screen",
        }}
      />
      <div
        ref={dotRef}
        className="absolute h-1.5 w-1.5 rounded-full bg-cyan-300"
        style={{ boxShadow: "0 0 10px 2px rgba(34,211,238,0.8)", mixBlendMode: "screen" }}
      />
    </div>
  );
}
