import { useEffect, useRef, useState } from "react";
import cues from "../data/welcomeCues.json";
import { attachVoiceAnalyser } from "../lib/voiceLevel";
import { companySlug, getCompanyFromUrl } from "../lib/company";

// Spoken intro: a pre-recorded deep announcer voice (public/welcome.mp3)
// plays when the visitor enters (or on their first click/tap, since browsers
// block sound before a gesture) — once per session — with timed subtitles.
// With ?for=Company in the URL, a personalized clip ("Welcome, Wix team...")
// plays first, then the regular narration continues. 🔊 replays anytime.

const GUARD_KEY = "welcomed-v6";
const MAIN_SKIP_AFTER_COMPANY = 4.0; // main narration's own "Welcome..." sentence ends here

type Cue = { start: number; end: number; text: string };
const CUES = cues as Cue[];

function prettify(text: string) {
  return text.replace(/sudo R M dash R F/i, "sudo rm -rf /");
}

export function WelcomeGreeting() {
  const [subtitle, setSubtitle] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const mainRef = useRef<HTMLAudioElement | null>(null);
  const companyRef = useRef<HTMLAudioElement | null>(null);
  const companyNameRef = useRef<string | null>(null);
  const companyFailedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const main = new Audio("/welcome.mp3");
    main.preload = "auto";
    main.volume = 1;
    mainRef.current = main;

    // personalized clip, if this is a company link and the clip exists
    const company = getCompanyFromUrl();
    companyNameRef.current = company;
    let companyAudio: HTMLAudioElement | null = null;
    if (company) {
      companyAudio = new Audio(`/intro/${companySlug(company)}.mp3`);
      companyAudio.preload = "auto";
      companyAudio.volume = 1;
      companyAudio.addEventListener("error", () => { companyFailedRef.current = true; });
      companyRef.current = companyAudio;
    }

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
    const onMainTime = () => {
      const t = main.currentTime;
      let current: Cue | null = null;
      for (const c of CUES) if (t >= c.start) current = c;
      setSubtitle(current && t <= current.end ? prettify(current.text) : null);
    };
    const onEnded = () => {
      setPlaying(false);
      setTimeout(() => setSubtitle(null), 500);
    };
    const onPause = () => setPlaying(false);

    main.addEventListener("playing", onPlaying);
    main.addEventListener("timeupdate", onMainTime);
    main.addEventListener("ended", onEnded);
    main.addEventListener("pause", onPause);

    // company clip → then the main narration continues (skipping its own "Welcome" line)
    const onCompanyEnded = () => {
      main.currentTime = MAIN_SKIP_AFTER_COMPANY;
      const p = main.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          // continuation blocked (company clip autoplayed with no gesture yet):
          // resume the main narration on the visitor's next interaction
          const resume = () => {
            window.removeEventListener("pointerdown", resume);
            window.removeEventListener("keydown", resume);
            window.removeEventListener("touchstart", resume);
            if (main.paused) {
              main.currentTime = MAIN_SKIP_AFTER_COMPANY;
              void main.play().catch(() => {});
            }
          };
          window.addEventListener("pointerdown", resume);
          window.addEventListener("keydown", resume);
          window.addEventListener("touchstart", resume, { passive: true });
        });
      }
    };
    if (companyAudio) {
      companyAudio.addEventListener("playing", () => {
        setPlaying(true);
        setSubtitle(`Welcome, ${company} team... to the portfolio of Yuval Boker.`);
        try {
          sessionStorage.setItem(GUARD_KEY, "1");
        } catch { /* ignore */ }
        removeGestureListeners();
      });
      companyAudio.addEventListener("ended", onCompanyEnded);
      companyAudio.addEventListener("pause", () => { if (main.paused) setPlaying(false); });
    }

    // must run synchronously inside the user gesture
    function attempt(fromGesture: boolean) {
      if (fromGesture) {
        attachVoiceAnalyser(main); // lets the 3D scene pulse with the voice
        if (companyAudio) attachVoiceAnalyser(companyAudio);
      }
      if (!main.paused || (companyAudio && !companyAudio.paused)) return;
      if (companyAudio && !companyFailedRef.current) {
        companyAudio.currentTime = 0;
        const p = companyAudio.play();
        if (p && typeof p.catch === "function") {
          p.catch((e: unknown) => {
            // NotAllowed = wait for a gesture; anything else (bad file) = use the main narration
            if (!(e instanceof DOMException && e.name === "NotAllowedError")) {
              companyFailedRef.current = true;
              attempt(fromGesture);
            }
          });
        }
        return;
      }
      main.currentTime = 0;
      const p = main.play();
      if (p && typeof p.catch === "function") p.catch(() => { /* blocked until a gesture — keep waiting */ });
    }
    const gestureAttempt = () => attempt(true);

    function removeGestureListeners() {
      window.removeEventListener("pointerdown", gestureAttempt);
      window.removeEventListener("keydown", gestureAttempt);
      window.removeEventListener("touchstart", gestureAttempt);
    }

    if (!alreadyWelcomed) {
      attempt(false); // browsers that allow autoplay play right away
      window.addEventListener("pointerdown", gestureAttempt);
      window.addEventListener("keydown", gestureAttempt);
      window.addEventListener("touchstart", gestureAttempt, { passive: true });
    }

    return () => {
      removeGestureListeners();
      main.removeEventListener("playing", onPlaying);
      main.removeEventListener("timeupdate", onMainTime);
      main.removeEventListener("ended", onEnded);
      main.removeEventListener("pause", onPause);
      main.pause();
      if (companyAudio) {
        companyAudio.removeEventListener("ended", onCompanyEnded);
        companyAudio.pause();
      }
    };
  }, []);

  function toggleReplay() {
    const main = mainRef.current;
    const company = companyRef.current;
    if (!main) return;
    const anyPlaying = !main.paused || (company && !company.paused);
    if (anyPlaying) {
      main.pause();
      main.currentTime = 0;
      if (company) {
        company.pause();
        company.currentTime = 0;
      }
      setPlaying(false);
      setSubtitle(null);
      return;
    }
    attachVoiceAnalyser(main);
    if (company) attachVoiceAnalyser(company);
    if (company && !companyFailedRef.current) {
      company.currentTime = 0;
      void company.play().catch(() => {});
      return;
    }
    main.currentTime = 0;
    void main.play().catch(() => {});
  }

  return (
    <>
      <button
        onClick={toggleReplay}
        onPointerDown={(e) => e.stopPropagation()}
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
