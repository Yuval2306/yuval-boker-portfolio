import { useEffect, useRef, useState } from "react";

type Particle = {
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
};

const COLORS = ["#ffffff", "#e0f2fe", "#bfdbfe", "#93c5fd", "#60a5fa", "#38bdf8"];

export function ParticleName({ text = "YUVAL BOKER" }: { text?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (reduced) return;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let particles: Particle[] = [];
    let raf = 0;
    let W = 0;
    let H = 0;
    const mouse = { x: -9999, y: -9999 };
    const REPEL = 90;

    function build() {
      W = wrap!.clientWidth;

      // pick a font size, then shrink it until the rendered text truly fits (italic overhang included)
      const off = document.createElement("canvas");
      const octx = off.getContext("2d")!;
      const setFont = (size: number) => {
        octx.font = `italic 900 ${size}px Inter, "Segoe UI", system-ui, sans-serif`;
      };
      let fs = Math.min(150, W / (text.length * 0.5));
      setFont(fs);
      const fitWidth = W * 0.9; // side margin so nothing touches the edges
      const measured = octx.measureText(text).width;
      if (measured > fitWidth) {
        fs = fs * (fitWidth / measured);
      }
      fs = Math.max(36, fs);

      H = Math.round(fs * 1.6);
      canvas!.width = Math.round(W * DPR);
      canvas!.height = Math.round(H * DPR);
      canvas!.style.width = `${W}px`;
      canvas!.style.height = `${H}px`;

      off.width = W;
      off.height = H;
      setFont(fs); // canvas resize resets the context state
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.fillStyle = "#fff";
      octx.fillText(text, W / 2, H / 2);

      const data = octx.getImageData(0, 0, W, H).data;
      const gap = Math.max(2, Math.round(fs / 48));
      particles = [];
      for (let y = 0; y < H; y += gap) {
        for (let x = 0; x < W; x += gap) {
          if (data[(y * W + x) * 4 + 3] > 128) {
            const t = x / W;
            const ci = Math.min(COLORS.length - 1, Math.floor(t * COLORS.length + (Math.random() - 0.5)));
            particles.push({
              x: Math.random() * W,
              y: Math.random() * H,
              ox: x,
              oy: y,
              vx: 0,
              vy: 0,
              size: Math.random() * 1.4 + 1.4,
              color: COLORS[Math.max(0, ci)],
            });
          }
        }
      }
    }

    function tick() {
      ctx!.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx!.globalCompositeOperation = "source-over";
      ctx!.clearRect(0, 0, W, H);
      ctx!.globalCompositeOperation = "lighter"; // overlapping particles add up to a glow
      for (const p of particles) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < REPEL * REPEL && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const f = ((REPEL - d) / REPEL) * 6;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }
        p.vx += (p.ox - p.x) * 0.055;
        p.vy += (p.oy - p.y) * 0.055;
        p.vx *= 0.82;
        p.vy *= 0.82;
        p.x += p.vx;
        p.y += p.vy;

        ctx!.fillStyle = p.color;
        ctx!.fillRect(p.x, p.y, p.size, p.size);
      }
      raf = requestAnimationFrame(tick);
    }

    function onMove(e: MouseEvent) {
      const r = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    }
    function onLeaveWindow() {
      mouse.x = -9999;
      mouse.y = -9999;
    }
    function onResize() {
      build();
    }

    build();
    raf = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseout", onLeaveWindow);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeaveWindow);
      window.removeEventListener("resize", onResize);
    };
  }, [text, reduced]);

  if (reduced) {
    return (
      <h1 className="text-6xl md:text-9xl font-black tracking-tighter bg-gradient-to-r from-white via-blue-100 to-blue-400 bg-clip-text text-transparent italic">
        {text}
      </h1>
    );
  }

  return (
    <div ref={wrapRef} className="w-full max-w-5xl mx-auto">
      <canvas ref={canvasRef} className="block mx-auto" aria-hidden="true" />
      <h1 className="sr-only">{text}</h1>
    </div>
  );
}
