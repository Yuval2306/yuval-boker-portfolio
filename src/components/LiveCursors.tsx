import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

// Real-time multiplayer cursors: every visitor sees the other visitors'
// cursors moving live (Supabase Realtime broadcast + presence).

type Cursor = { xf: number; y: number; color: string; ts: number };

const COLORS = ["#60a5fa", "#22d3ee", "#f472b6", "#4ade80", "#fbbf24", "#a78bfa"];

export function LiveCursors() {
  const [cursors, setCursors] = useState<Record<string, Cursor>>({});
  const [online, setOnline] = useState(1);
  const [enabled] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches
  );
  const scrollTick = useRef(0);
  const [, force] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const myId = Math.random().toString(36).slice(2, 8);
    const myColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    let lastSend = 0;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    try {
      channel = supabase.channel("live-cursors", {
        config: { broadcast: { self: false }, presence: { key: myId } },
      });

      channel
        .on("broadcast", { event: "cursor" }, ({ payload }) => {
          const p = payload as { id: string; xf: number; y: number; color: string };
          if (!p || p.id === myId) return;
          setCursors((prev) => ({ ...prev, [p.id]: { xf: p.xf, y: p.y, color: p.color, ts: Date.now() } }));
        })
        .on("presence", { event: "sync" }, () => {
          try {
            setOnline(Object.keys(channel!.presenceState()).length || 1);
          } catch { /* ignore */ }
        })
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            void channel!.track({ at: Date.now() });
          }
        });
    } catch {
      return; // realtime unavailable — feature silently off
    }

    function onMove(e: MouseEvent) {
      const now = Date.now();
      if (now - lastSend < 60 || !channel) return;
      lastSend = now;
      void channel.send({
        type: "broadcast",
        event: "cursor",
        payload: { id: myId, xf: e.clientX / window.innerWidth, y: e.clientY + window.scrollY, color: myColor },
      });
    }

    // prune stale cursors + rerender on scroll so ghosts stay in place
    const prune = setInterval(() => {
      const now = Date.now();
      setCursors((prev) => {
        const next: Record<string, Cursor> = {};
        let changed = false;
        for (const [id, c] of Object.entries(prev)) {
          if (now - c.ts < 6000) next[id] = c;
          else changed = true;
        }
        return changed ? next : prev;
      });
    }, 2000);

    function onScroll() {
      cancelAnimationFrame(scrollTick.current);
      scrollTick.current = requestAnimationFrame(() => force((v) => v + 1));
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearInterval(prune);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      if (channel) void supabase.removeChannel(channel);
    };
  }, [enabled]);

  if (!enabled) return null;

  const entries = Object.entries(cursors);

  return (
    <>
      {/* ghost cursors */}
      <div className="fixed inset-0 z-[230] pointer-events-none overflow-hidden" aria-hidden="true">
        {entries.map(([id, c]) => {
          const x = c.xf * window.innerWidth;
          const y = c.y - window.scrollY;
          if (y < -40 || y > window.innerHeight + 40) return null;
          return (
            <div
              key={id}
              className="absolute transition-transform duration-100 ease-out"
              style={{ transform: `translate(${x}px, ${y}px)` }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" style={{ filter: `drop-shadow(0 0 6px ${c.color})` }}>
                <path d="M4 2 L20 12 L12 13.5 L8.5 21 Z" fill={c.color} stroke="#0f172a" strokeWidth="1.5" />
              </svg>
              <span
                className="ml-3 px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-950 whitespace-nowrap"
                style={{ background: c.color }}
              >
                visitor
              </span>
            </div>
          );
        })}
      </div>

      {/* online badge */}
      {online > 1 && (
        <div className="fixed bottom-6 left-6 z-[90] flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-white/10 backdrop-blur-xl text-sm text-slate-200 shadow-lg">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
          </span>
          {online} viewing now
        </div>
      )}
    </>
  );
}
