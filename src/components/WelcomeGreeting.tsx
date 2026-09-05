import { useEffect, useRef, useState } from "react";
import cues from "../data/welcomeCues.json";

// Spoken intro: a pre-recorded deep announcer voice (public/welcome.mp3)
// plays when the visitor enters (or on their first click/tap, since browsers
// block sound before a gesture) — once per session — with timed subtitles.
// The 🔊 button replays the intro anytime.

const GUARD_KEY = "welcomed-v5";

type Cue = { start: number; end: number; text: string };
const CUES = cues as Cue[];

function prettify(text: string) {
  return text.replace(/sudo R M dash R F/i, "sudo rm -rf /");
}

export function WelcomeGreeting() {
  const [subtitle, setSubtitle] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const audio = new Audio("/welcome.mp3");
    audio.preload = "auto";
    audio.volume = 1;
    audioRef.current = audio;

    let alreadyWelcomed = false;
    try {
      alreadyWelcomed = sessionStorage.getItem(GUARD_KEY) === "1";
    } catch { /* ignore */ }

    const onPlaying = () => {
      setPlaying(true);
      try {
        sessionStorage.setItem(GUARD_KEY, "1");
      } catch { /* ignore */ }
      removeGestureListeners();
    };
    const onTime = () => {
      const t = audio.currentTime;
      let current: Cue | null = null;
      for (const c of CUES) if (t >= c.start) current = c;
      setSubtitle(current && t <= current.end ? prettify(current.text) : null);
    };
    const onEnded = () => {
      setPlaying(false);
      setTimeout(() => setSubtitle(null), 500);
    };
    const onPause = () => setPlaying(false);

    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("pause", onPause);

    // must run synchronously inside the user gesture
    function attempt() {
      if (!audio.paused) return;
      audio.currentTime = 0;
      const p = audio.play();
      if (p && typeof p.catch === "function") p.catch(() => { /* blocked until a gesture — keep waiting */ });
    }

    function removeGestureListeners() {
      window.removeEventListener("pointerdown", attempt);
      window.removeEventListener("keydown", attempt);
      window.removeEventListener("touchstart", attempt);
    }

    if (!alreadyWelcomed) {
      attempt(); // browsers that allow autoplay play right away
      window.addEventListener("pointerdown", attempt);
      window.addEventListener("keydown", attempt);
      window.addEventListener("touchstart", attempt, { passive: true });
    }

    return () => {
      removeGestureListeners();
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("pause", onPause);
      audio.pause();
    };
  }, []);

  function toggleReplay() {
    const a = audioRef.current;
    if (!a) return;
    if (!a.paused) {
      a.pause();
      a.currentTime = 0;
      setSubtitle(null);
      return;
    }
    a.currentTime = 0;
    void a.play().catch(() => {});
  }

  return (
    <>
      <button
        onClick={toggleReplay}
        className={`fixed top-6 left-6 z-[95] h-12 w-12 rounded-full border backdrop-blur-xl text-xl leading-none transition-all hover:scale-110 ${
          playing
            ? "bg-cyan-500/20 border-cyan-400/50 shadow-[0_0_25px_rgba(34,211,238,0.4)]"
            : "bg-slate-900/70 border-white/15 hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(34,211,238,0.3)]"
        }`}
        title={playing ? "Stop intro" : "Play intro"}
        aria-label={playing ? "Stop welcome intro" : "Play welcome intro"}
      >
        {playing ? "⏹" : "🔊"}
      </button>

      {subtitle && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[260] pointer-events-none w-[min(92vw,44rem)] flex justify-center">
          <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-slate-900/90 border border-blue-500/30 backdrop-blur-xl shadow-[0_0_30px_rgba(59,130,246,0.25)]">
            <span className="flex gap-0.5 items-end h-4 shrink-0" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="w-1 rounded-full bg-cyan-400"
                  style={{ animation: `soundbar 0.8s ease-in-out ${i * 0.15}s infinite alternate`, height: "30%" }}
                />
              ))}
            </span>
            <span className="text-blue-100 font-medium text-center">{subtitle}</span>
          </div>
          <style>{`@keyframes soundbar { from { height: 25%; } to { height: 100%; } }`}</style>
        </div>
      )}
    </>
  );
}
