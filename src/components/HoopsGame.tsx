import { useEffect, useRef, useState } from "react";
import { X, Play, RotateCcw, Timer, Trophy } from "lucide-react";
import { burstConfetti } from "../lib/confetti";

// "Shoot to Hire" — a real 2-minute timed basketball game.
// Rapid fire: a fresh ball is always waiting at the spawn point.

const W = 640;
const H = 420;
const BALL_R = 14;
const GROUND = H - 26;
const SPAWN_X = 110;
const SPAWN_Y = GROUND - BALL_R;
const RIM_Y = 168;
const RIM_X1 = 496;
const RIM_X2 = 560;
const BOARD_X = 574;
const GAME_SECONDS = 120;

type Phase = "idle" | "playing" | "over";

type Ball = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  scored: boolean;
  touchedRim: boolean;
  born: number;
  dead: boolean;
};

function readBest(): number {
  try {
    return Number(localStorage.getItem("hoops-best") || 0);
  } catch {
    return 0;
  }
}

function writeBest(v: number) {
  try {
    localStorage.setItem("hoops-best", String(v));
  } catch { /* ignore */ }
}

export function HoopsGame({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [shots, setShots] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS);
  const [best, setBest] = useState(readBest);
  const [banner, setBanner] = useState("");
  const phaseRef = useRef<Phase>("idle");
  phaseRef.current = phase;
  const scoreRef = useRef(0);
  scoreRef.current = score;

  // countdown
  useEffect(() => {
    if (phase !== "playing") return;
    const iv = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(iv);
          setPhase("over");
          setBest((b) => {
            const nb = Math.max(b, scoreRef.current);
            if (nb > b) writeBest(nb);
            return nb;
          });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [phase]);

  function startGame() {
    setScore(0);
    setShots(0);
    setTimeLeft(GAME_SECONDS);
    setBanner("");
    setPhase("playing");
  }

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let balls: Ball[] = [];
    let dragging = false;
    let dragNow = { x: SPAWN_X, y: SPAWN_Y };
    let raf = 0;

    const toCanvas = (clientX: number, clientY: number) => {
      const r = canvas.getBoundingClientRect();
      return { x: ((clientX - r.left) / r.width) * W, y: ((clientY - r.top) / r.height) * H };
    };

    function throwVelocity() {
      // flick style: the ball flies in the direction you drag
      const vx = (dragNow.x - SPAWN_X) / 6.5;
      const vy = (dragNow.y - SPAWN_Y) / 6.5;
      return {
        vx: Math.max(-24, Math.min(24, vx)),
        vy: Math.max(-26, Math.min(26, vy)),
      };
    }

    function collideRimPoint(b: Ball, px: number, py: number) {
      const dx = b.x - px;
      const dy = b.y - py;
      const d = Math.hypot(dx, dy);
      const min = BALL_R + 4;
      if (d < min && d > 0.001) {
        b.touchedRim = true;
        const nx = dx / d;
        const ny = dy / d;
        b.x = px + nx * min;
        b.y = py + ny * min;
        const dot = b.vx * nx + b.vy * ny;
        b.vx -= 1.6 * dot * nx;
        b.vy -= 1.6 * dot * ny;
        b.vx *= 0.75;
        b.vy *= 0.75;
      }
    }

    function physics() {
      const now = performance.now();
      for (const b of balls) {
        if (b.dead) continue;
        const prevY = b.y;
        b.vy += 0.42;
        b.x += b.vx;
        b.y += b.vy;

        if (b.x < BALL_R) { b.x = BALL_R; b.vx *= -0.7; }
        if (b.x > BOARD_X - BALL_R && b.y > 100 && b.y < RIM_Y + 40) {
          b.x = BOARD_X - BALL_R;
          b.vx *= -0.65;
          b.touchedRim = true;
        }
        if (b.x > W - BALL_R) { b.x = W - BALL_R; b.vx *= -0.7; }
        collideRimPoint(b, RIM_X1, RIM_Y);
        collideRimPoint(b, RIM_X2, RIM_Y);
        if (b.y > GROUND - BALL_R) {
          b.y = GROUND - BALL_R;
          b.vy *= -0.55;
          b.vx *= 0.85;
          if (Math.abs(b.vy) < 1.2 && Math.abs(b.vx) < 0.6) b.dead = true;
        }
        if (now - b.born > 7000) b.dead = true;

        if (
          !b.scored &&
          prevY < RIM_Y && b.y >= RIM_Y &&
          b.vy > 0 &&
          b.x > RIM_X1 + BALL_R * 0.5 && b.x < RIM_X2 - BALL_R * 0.5
        ) {
          b.scored = true;
          const swish = !b.touchedRim;
          setScore((s) => s + (swish ? 3 : 2));
          setBanner(swish ? "SWISH! +3 💦" : "Bucket! +2 🏀");
          const r = canvas.getBoundingClientRect();
          burstConfetti(r.left + ((RIM_X1 + RIM_X2) / 2 / W) * r.width, r.top + (RIM_Y / H) * r.height, 30);
        }
      }
      balls = balls.filter((b) => !b.dead);
    }

    function drawBall(x: number, y: number, alpha = 1) {
      ctx.save();
      ctx.globalAlpha = alpha;
      const grad = ctx.createRadialGradient(x - 5, y - 5, 3, x, y, BALL_R);
      grad.addColorStop(0, "#fdba74");
      grad.addColorStop(1, "#ea580c");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, BALL_R, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.35)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x, y, BALL_R, 0, Math.PI * 2);
      ctx.moveTo(x - BALL_R, y);
      ctx.lineTo(x + BALL_R, y);
      ctx.moveTo(x, y - BALL_R);
      ctx.quadraticCurveTo(x + 8, y, x, y + BALL_R);
      ctx.stroke();
      ctx.restore();
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // floor
      ctx.fillStyle = "rgba(59,130,246,0.06)";
      ctx.fillRect(0, GROUND, W, H - GROUND);
      ctx.strokeStyle = "rgba(148,163,184,0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, GROUND);
      ctx.lineTo(W, GROUND);
      ctx.stroke();

      // backboard + pole
      ctx.strokeStyle = "rgba(226,232,240,0.5)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(BOARD_X, 96);
      ctx.lineTo(BOARD_X, RIM_Y + 36);
      ctx.stroke();
      ctx.strokeStyle = "rgba(100,116,139,0.4)";
      ctx.beginPath();
      ctx.moveTo(BOARD_X, RIM_Y + 36);
      ctx.lineTo(BOARD_X, GROUND);
      ctx.stroke();

      // rim + net
      ctx.strokeStyle = "#fb923c";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(RIM_X1, RIM_Y);
      ctx.lineTo(RIM_X2, RIM_Y);
      ctx.stroke();
      ctx.strokeStyle = "rgba(226,232,240,0.35)";
      ctx.lineWidth = 1.5;
      for (let i = 0; i <= 4; i++) {
        const x = RIM_X1 + ((RIM_X2 - RIM_X1) / 4) * i;
        ctx.beginPath();
        ctx.moveTo(x, RIM_Y);
        ctx.lineTo(RIM_X1 + (RIM_X2 - RIM_X1) / 2 + (x - RIM_X1 - (RIM_X2 - RIM_X1) / 2) * 0.4, RIM_Y + 34);
        ctx.stroke();
      }

      // aim guide — dots trace the exact arc the ball will fly
      if (dragging) {
        const { vx, vy } = throwVelocity();
        let gx = SPAWN_X, gy = SPAWN_Y, gvx = vx, gvy = vy;
        for (let i = 0; i < 34; i++) {
          gvy += 0.42;
          gx += gvx;
          gy += gvy;
          if (gy > GROUND) break;
          if (i % 2 === 0) {
            ctx.fillStyle = `rgba(34,211,238,${Math.max(0.15, 0.8 - i * 0.02)})`;
            ctx.beginPath();
            ctx.arc(gx, gy, 3.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // flying balls
      for (const b of balls) drawBall(b.x, b.y);

      // spawn ball — always ready
      drawBall(SPAWN_X, SPAWN_Y, dragging ? 0.5 : 1);
      if (!dragging && phaseRef.current === "playing") {
        ctx.strokeStyle = "rgba(34,211,238,0.35)";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(SPAWN_X, SPAWN_Y, BALL_R + 7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    function loop() {
      physics();
      draw();
      raf = requestAnimationFrame(loop);
    }

    function onDown(e: PointerEvent) {
      if (phaseRef.current !== "playing") return;
      const p = toCanvas(e.clientX, e.clientY);
      if (Math.hypot(p.x - SPAWN_X, p.y - SPAWN_Y) < 90) {
        dragging = true;
        dragNow = p;
        e.preventDefault();
      }
    }
    // move/up live on WINDOW so a fast drag outside the canvas still tracks & releases
    function onMove(e: PointerEvent) {
      if (dragging) dragNow = toCanvas(e.clientX, e.clientY);
    }
    function onUp() {
      if (!dragging) return;
      dragging = false;
      const { vx, vy } = throwVelocity();
      if (Math.hypot(vx, vy) < 1.5) return;
      balls.push({ x: SPAWN_X, y: SPAWN_Y, vx, vy, scored: false, touchedRim: false, born: performance.now(), dead: false });
      setShots((s) => s + 1);
      setBanner("");
    }

    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  const mm = Math.floor(timeLeft / 60);
  const ss = String(timeLeft % 60).padStart(2, "0");
  const accuracy = shots > 0 ? Math.round((score / (shots * 3)) * 100) : 0;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 backdrop-blur-md bg-black/60" onMouseDown={onClose}>
      <div
        className="relative w-full max-w-2xl bg-[#0a0f1e] border border-white/10 rounded-[2rem] p-6 shadow-2xl animate-modalEnter"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* scoreboard */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-black text-white">Shoot to Hire 🏀</h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-4 px-5 py-2 rounded-2xl bg-slate-950/80 border border-white/10 font-mono">
              <div className="text-center">
                <div className={`text-2xl font-black ${timeLeft <= 10 && phase === "playing" ? "text-rose-400 animate-pulse" : "text-white"}`}>
                  {mm}:{ss}
                </div>
                <div className="text-[9px] uppercase tracking-widest text-slate-500 flex items-center gap-1 justify-center"><Timer size={9} /> Time</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <div className="text-2xl font-black text-cyan-300">{score}</div>
                <div className="text-[9px] uppercase tracking-widest text-slate-500">Points</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <div className="text-2xl font-black text-amber-300">{best}</div>
                <div className="text-[9px] uppercase tracking-widest text-slate-500 flex items-center gap-1 justify-center"><Trophy size={9} /> Best</div>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X size={22} /></button>
          </div>
        </div>

        <div className="relative">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 touch-none select-none"
          />

          {/* start overlay */}
          {phase === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-slate-950/80 backdrop-blur-sm">
              <div className="text-5xl mb-4">🏀</div>
              <h4 className="text-2xl font-black text-white mb-2">2 minutes. Unlimited shots.</h4>
              <p className="text-slate-400 text-sm mb-1">Drag from the ball toward the hoop — the dots show your arc. Release to shoot!</p>
              <p className="text-slate-500 text-xs mb-6">Clean shot (swish) = 3 pts · Off the rim/board = 2 pts</p>
              <button
                onClick={startGame}
                className="flex items-center gap-2 px-8 py-3 rounded-full bg-orange-500 hover:bg-orange-400 text-white font-black text-lg hover:scale-105 transition-all shadow-[0_0_30px_rgba(249,115,22,0.4)]"
              >
                <Play size={20} /> START GAME
              </button>
            </div>
          )}

          {/* game over overlay */}
          {phase === "over" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-slate-950/85 backdrop-blur-sm">
              <div className="text-4xl mb-2">⏱</div>
              <h4 className="text-3xl font-black text-white mb-1">Time's up!</h4>
              <div className="text-5xl font-black text-cyan-300 my-3">{score} pts</div>
              <p className="text-slate-400 text-sm mb-1">{shots} shots · {accuracy}% efficiency{score >= best && score > 0 ? " · 🏆 NEW RECORD" : ""}</p>
              <p className="text-slate-300 font-bold mb-6">
                {score >= 40 ? "🔥 NBA material. Also: hired." : score >= 20 ? "Solid game! Imagine what we'd build together." : score > 0 ? "Not bad! Debugging takes practice too 😉" : "Airball... but hey, my code always hits 😄"}
              </p>
              <button
                onClick={startGame}
                className="flex items-center gap-2 px-8 py-3 rounded-full bg-orange-500 hover:bg-orange-400 text-white font-black hover:scale-105 transition-all shadow-[0_0_30px_rgba(249,115,22,0.4)]"
              >
                <RotateCcw size={18} /> PLAY AGAIN
              </button>
            </div>
          )}
        </div>

        <div className="h-6 mt-2 text-center text-sm font-bold text-cyan-300">{banner}</div>
      </div>
    </div>
  );
}
