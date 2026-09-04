import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { burstConfetti } from "../lib/confetti";

// "Shoot to Hire" — drag-and-release basketball mini game.

const W = 640;
const H = 420;
const BALL_R = 14;
const GROUND = H - 26;
const RIM_Y = 168;
const RIM_X1 = 496;
const RIM_X2 = 560;
const BOARD_X = 574;

export function HoopsGame({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [shots, setShots] = useState(0);
  const [streak, setStreak] = useState(0);
  const [banner, setBanner] = useState("Drag the ball, aim, release 🏀");

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const ball = { x: 110, y: GROUND - BALL_R, vx: 0, vy: 0, flying: false, scoredThisFlight: false, touchedRim: false };
    let dragging = false;
    let dragStart = { x: 0, y: 0 };
    let dragNow = { x: 0, y: 0 };
    let raf = 0;
    let resetTimer: ReturnType<typeof setTimeout> | null = null;

    const toCanvas = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
    };

    function resetBall() {
      ball.x = 110;
      ball.y = GROUND - BALL_R;
      ball.vx = 0;
      ball.vy = 0;
      ball.flying = false;
      ball.scoredThisFlight = false;
      ball.touchedRim = false;
    }

    function scheduleReset(ms: number) {
      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(resetBall, ms);
    }

    function collideRimPoint(px: number, py: number) {
      const dx = ball.x - px;
      const dy = ball.y - py;
      const d = Math.hypot(dx, dy);
      const min = BALL_R + 4;
      if (d < min && d > 0.001) {
        ball.touchedRim = true;
        const nx = dx / d;
        const ny = dy / d;
        ball.x = px + nx * min;
        ball.y = py + ny * min;
        const dot = ball.vx * nx + ball.vy * ny;
        ball.vx -= 1.6 * dot * nx;
        ball.vy -= 1.6 * dot * ny;
        ball.vx *= 0.75;
        ball.vy *= 0.75;
      }
    }

    function physics() {
      if (!ball.flying) return;
      const prevY = ball.y;
      ball.vy += 0.42;
      ball.x += ball.vx;
      ball.y += ball.vy;

      // walls
      if (ball.x < BALL_R) { ball.x = BALL_R; ball.vx *= -0.7; }
      // backboard
      if (ball.x > BOARD_X - BALL_R && ball.y > 100 && ball.y < RIM_Y + 40) {
        ball.x = BOARD_X - BALL_R;
        ball.vx *= -0.65;
        ball.touchedRim = true;
      }
      if (ball.x > W - BALL_R) { ball.x = W - BALL_R; ball.vx *= -0.7; }
      // rim ends
      collideRimPoint(RIM_X1, RIM_Y);
      collideRimPoint(RIM_X2, RIM_Y);
      // ground
      if (ball.y > GROUND - BALL_R) {
        ball.y = GROUND - BALL_R;
        ball.vy *= -0.55;
        ball.vx *= 0.85;
        if (Math.abs(ball.vy) < 1.2 && Math.abs(ball.vx) < 0.6) scheduleReset(500);
      }

      // score check: crossing rim line downward, inside the rim
      if (
        !ball.scoredThisFlight &&
        prevY < RIM_Y && ball.y >= RIM_Y &&
        ball.vy > 0 &&
        ball.x > RIM_X1 + BALL_R * 0.5 && ball.x < RIM_X2 - BALL_R * 0.5
      ) {
        ball.scoredThisFlight = true;
        const swish = !ball.touchedRim;
        setScore((s) => s + 1);
        setStreak((st) => {
          const ns = st + 1;
          if (ns >= 5) setBanner("🔥 5 in a row — you're hired material!");
          else setBanner(swish ? "SWISH! Nothing but net 💦" : "Bucket! 🏀");
          return ns;
        });
        const r = canvas.getBoundingClientRect();
        burstConfetti(r.left + ((RIM_X1 + RIM_X2) / 2 / W) * r.width, r.top + (RIM_Y / H) * r.height, 34);
        scheduleReset(900);
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // court floor
      ctx.fillStyle = "rgba(59,130,246,0.06)";
      ctx.fillRect(0, GROUND, W, H - GROUND);
      ctx.strokeStyle = "rgba(148,163,184,0.25)";
      ctx.beginPath();
      ctx.moveTo(0, GROUND);
      ctx.lineTo(W, GROUND);
      ctx.stroke();

      // backboard
      ctx.strokeStyle = "rgba(226,232,240,0.5)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(BOARD_X, 96);
      ctx.lineTo(BOARD_X, RIM_Y + 36);
      ctx.stroke();
      // pole
      ctx.strokeStyle = "rgba(100,116,139,0.4)";
      ctx.beginPath();
      ctx.moveTo(BOARD_X, RIM_Y + 36);
      ctx.lineTo(BOARD_X, GROUND);
      ctx.stroke();

      // rim
      ctx.strokeStyle = "#fb923c";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(RIM_X1, RIM_Y);
      ctx.lineTo(RIM_X2, RIM_Y);
      ctx.stroke();
      // net
      ctx.strokeStyle = "rgba(226,232,240,0.35)";
      ctx.lineWidth = 1.5;
      for (let i = 0; i <= 4; i++) {
        const x = RIM_X1 + ((RIM_X2 - RIM_X1) / 4) * i;
        ctx.beginPath();
        ctx.moveTo(x, RIM_Y);
        ctx.lineTo(RIM_X1 + (RIM_X2 - RIM_X1) / 2 + (x - RIM_X1 - (RIM_X2 - RIM_X1) / 2) * 0.4, RIM_Y + 34);
        ctx.stroke();
      }

      // aim guide
      if (dragging) {
        const vx = (dragStart.x - dragNow.x) / 7;
        const vy = (dragStart.y - dragNow.y) / 7;
        ctx.fillStyle = "rgba(34,211,238,0.7)";
        let gx = ball.x, gy = ball.y, gvx = vx, gvy = vy;
        for (let i = 0; i < 18; i++) {
          gvy += 0.42;
          gx += gvx;
          gy += gvy;
          if (i % 2 === 0) {
            ctx.beginPath();
            ctx.arc(gx, gy, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.strokeStyle = "rgba(148,163,184,0.4)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ball.x, ball.y);
        ctx.lineTo(dragNow.x, dragNow.y);
        ctx.stroke();
      }

      // ball
      const grad = ctx.createRadialGradient(ball.x - 5, ball.y - 5, 3, ball.x, ball.y, BALL_R);
      grad.addColorStop(0, "#fdba74");
      grad.addColorStop(1, "#ea580c");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.35)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
      ctx.moveTo(ball.x - BALL_R, ball.y);
      ctx.lineTo(ball.x + BALL_R, ball.y);
      ctx.moveTo(ball.x, ball.y - BALL_R);
      ctx.quadraticCurveTo(ball.x + 8, ball.y, ball.x, ball.y + BALL_R);
      ctx.stroke();
    }

    function loop() {
      physics();
      draw();
      raf = requestAnimationFrame(loop);
    }

    function onDown(e: PointerEvent) {
      const p = toCanvas(e);
      if (!ball.flying && Math.hypot(p.x - ball.x, p.y - ball.y) < 70) {
        dragging = true;
        dragStart = { x: ball.x, y: ball.y };
        dragNow = p;
        canvas.setPointerCapture(e.pointerId);
      }
    }
    function onMove(e: PointerEvent) {
      if (dragging) dragNow = toCanvas(e);
    }
    function onUp() {
      if (!dragging) return;
      dragging = false;
      const vx = (dragStart.x - dragNow.x) / 7;
      const vy = (dragStart.y - dragNow.y) / 7;
      if (Math.hypot(vx, vy) < 1.5) return; // too weak, ignore
      ball.vx = Math.max(-22, Math.min(22, vx));
      ball.vy = Math.max(-24, Math.min(24, vy));
      ball.flying = true;
      setShots((s) => s + 1);
      setBanner("");
      // missed flights break the streak on reset
      setTimeout(() => {
        if (!ball.scoredThisFlight) setStreak(0);
      }, 2600);
    }

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      if (resetTimer) clearTimeout(resetTimer);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 backdrop-blur-md bg-black/60" onMouseDown={onClose}>
      <div
        className="relative w-full max-w-2xl bg-[#0a0f1e] border border-white/10 rounded-[2rem] p-6 shadow-2xl animate-modalEnter"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-2xl font-black text-white">Shoot to Hire 🏀</h3>
            <p className="text-xs text-slate-400">Drag the ball back like a slingshot, release to shoot</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-black text-cyan-300">{score}<span className="text-slate-500 text-sm font-medium">/{shots}</span></div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500">Buckets{streak >= 2 ? ` · ${streak}🔥` : ""}</div>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X size={22} /></button>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="w-full rounded-2xl border border-white/10 bg-slate-950/80 touch-none"
        />

        <div className="h-6 mt-2 text-center text-sm font-bold text-cyan-300">{banner}</div>
      </div>
    </div>
  );
}
