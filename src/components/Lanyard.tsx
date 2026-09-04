import { useEffect, useRef, useState } from "react";

// Employee badge hanging on a physical lanyard rope (verlet physics).
// Grab the card, swing it, let go. Desktop only, visible in the hero.

const SEGMENTS = 9;
const SEG_LEN = 30;
const CARD_W = 170;
const CARD_H = 230;

type Pt = { x: number; y: number; px: number; py: number };

export function Lanyard() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const check = () =>
      setEnabled(
        window.matchMedia("(pointer: fine)").matches &&
          window.innerWidth >= 1024 &&
          !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const wrap = wrapRef.current;
    const card = cardRef.current;
    const path = pathRef.current;
    if (!wrap || !card || !path) return;

    let anchorX = window.innerWidth * 0.84;
    const anchorY = -6;
    const pts: Pt[] = Array.from({ length: SEGMENTS }, (_, i) => ({
      x: anchorX,
      y: anchorY + i * SEG_LEN,
      px: anchorX,
      py: anchorY + i * SEG_LEN,
    }));

    let dragging = false;
    const mouse = { x: 0, y: 0 };
    let raf = 0;

    function step() {
      const last = pts[SEGMENTS - 1];

      // verlet integration
      for (let i = 1; i < SEGMENTS; i++) {
        const p = pts[i];
        if (dragging && i === SEGMENTS - 1) continue;
        const nx = p.x + (p.x - p.px) * 0.985;
        const ny = p.y + (p.y - p.py) * 0.985 + 0.9; // gravity
        p.px = p.x;
        p.py = p.y;
        p.x = nx;
        p.y = ny;
      }

      if (dragging) {
        last.px = last.x;
        last.py = last.y;
        last.x = mouse.x;
        last.y = mouse.y - CARD_H * 0.1;
      }

      // distance constraints
      for (let iter = 0; iter < 4; iter++) {
        pts[0].x = anchorX;
        pts[0].y = anchorY;
        for (let i = 0; i < SEGMENTS - 1; i++) {
          const a = pts[i];
          const b = pts[i + 1];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.max(0.001, Math.hypot(dx, dy));
          const diff = (dist - SEG_LEN) / dist;
          const ax = i === 0 ? 0 : 0.5;
          const bx = i === 0 ? 1 : 0.5;
          if (!(dragging && i + 1 === SEGMENTS - 1)) {
            b.x -= dx * diff * bx;
            b.y -= dy * diff * bx;
          }
          a.x += dx * diff * ax;
          a.y += dy * diff * ax;
        }
      }

      // draw rope
      let d = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < SEGMENTS; i++) d += ` L ${pts[i].x} ${pts[i].y}`;
      path!.setAttribute("d", d);

      // place card
      const prev = pts[SEGMENTS - 2];
      const dx = last.x - prev.x;
      const dy = last.y - prev.y;
      const rot = Math.atan2(-dx, dy) * (180 / Math.PI) * -1;
      card!.style.transform = `translate(${last.x - CARD_W / 2}px, ${last.y - 8}px) rotate(${rot}deg)`;

      raf = requestAnimationFrame(step);
    }

    function onDown(e: PointerEvent) {
      dragging = true;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      card!.style.cursor = "grabbing";
      e.preventDefault();
    }
    function onMove(e: PointerEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    function onUp() {
      dragging = false;
      if (card) card.style.cursor = "grab";
    }
    function onResize() {
      anchorX = window.innerWidth * 0.84;
    }
    function onScroll() {
      // badge lives in the hero — fade it out when scrolling past
      const gone = window.scrollY > window.innerHeight * 0.7;
      wrap!.style.opacity = gone ? "0" : "1";
      wrap!.style.pointerEvents = gone ? "none" : "";
      card!.style.pointerEvents = gone ? "none" : "auto";
    }

    card.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      card.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={wrapRef} className="fixed inset-0 z-[60] pointer-events-none transition-opacity duration-500">
      <svg className="absolute inset-0 w-full h-full">
        <path ref={pathRef} fill="none" stroke="url(#lanyardGrad)" strokeWidth="4" strokeLinecap="round" />
        <defs>
          <linearGradient id="lanyardGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
      </svg>

      <div
        ref={cardRef}
        className="absolute top-0 left-0 pointer-events-auto select-none"
        style={{ width: CARD_W, height: CARD_H, cursor: "grab", transformOrigin: "50% 0%", willChange: "transform" }}
        title="Grab me!"
      >
        <div className="w-full h-full rounded-2xl border border-white/15 bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
          {/* clip hole */}
          <div className="flex justify-center pt-2">
            <div className="h-2.5 w-10 rounded-full bg-slate-700/80 border border-white/10" />
          </div>
          <div className="flex flex-col items-center px-4 pt-3">
            <div className="h-20 w-20 rounded-xl overflow-hidden border border-white/15">
              <img src="/me.jpeg" alt="Yuval Boker" className="h-full w-full object-cover object-top" draggable={false} />
            </div>
            <div className="mt-3 text-white font-black tracking-tight text-base leading-none">YUVAL BOKER</div>
            <div className="mt-1 text-[10px] font-mono text-cyan-300 tracking-widest">FULL STACK ENGINEER</div>
            <div className="mt-0.5 text-[9px] text-slate-500 font-mono">ID: 2306 · EST. 2022</div>
          </div>
          {/* barcode */}
          <div className="mt-auto px-4 pb-3">
            <div className="h-7 w-full flex items-end gap-[2px] opacity-70">
              {Array.from({ length: 36 }, (_, i) => (
                <div
                  key={i}
                  className="bg-slate-300"
                  style={{ width: 2, height: `${35 + ((i * 37) % 60)}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
