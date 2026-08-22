import { useEffect, useRef, useState } from "react";
import { projects } from "../data/projects";

type Line = { type: "cmd" | "out"; text: string };

const SKILLS_LINE =
  "Python · C++ · TypeScript · Node.js · React · SQL · MongoDB · AWS · Docker · Linux · System Design · LLMs & AI Agents";

function run(raw: string): { out: string[]; action?: "clear" | "open-github" | "open-linkedin" | "open-cv" } {
  const cmd = raw.trim().toLowerCase();
  switch (cmd) {
    case "help":
      return {
        out: [
          "Available commands:",
          "  about        who is this guy?",
          "  onezero      what I do at my day job",
          "  skills       tech stack",
          "  projects     featured work",
          "  experience   professional journey",
          "  education    degrees & programs",
          "  neofetch     system info, dev edition",
          "  contact      how to reach me",
          "  github       open my GitHub",
          "  linkedin     open my LinkedIn",
          "  cv           request my CV by email",
          "  whoami       identity check",
          "  clear        clear the terminal",
          "",
          "  ...and maybe a hidden one or two. Try your luck.",
        ],
      };
    case "onezero":
    case "work":
    case "job":
      return {
        out: [
          "Full Stack Engineer @ Onezero Software Engineering (July 2026 - present)",
          "",
          "  • End-to-end features across web & mobile — React, Node.js, TypeScript, Python",
          "  • Production systems on MongoDB + AWS",
          "  • AI integrations: prompt design, agent workflows, model-driven features",
          "  • Working directly with clients — requirements → working software",
        ],
      };
    case "education":
      return {
        out: [
          "→ B.Sc. Computer Science — Tel-Hai College (2022-2025)",
          "→ Excellenteam Excellence Program — Startup Nation Central (Aug-Sep 2025)",
          "   intensive C++/Python on Linux · projects with Google, NVIDIA & Check Point engineers",
          "→ Certifications: Excellenteam in Academia · Hack the Future",
        ],
      };
    case "neofetch":
      return {
        out: [
          "  ██╗   ██╗██████╗    yuval@onezero",
          "  ╚██╗ ██╔╝██╔══██╗   ─────────────────────────────",
          "   ╚████╔╝ ██████╔╝   Role:    Full Stack Engineer",
          "    ╚██╔╝  ██╔══██╗   Stack:   React · Node · TS · Python · C++",
          "     ██║   ██████╔╝   Cloud:   AWS · MongoDB",
          "     ╚═╝   ╚═════╝    AI:      LLM APIs · agent workflows",
          "                      Degree:  B.Sc. CS, Tel-Hai (2022-2025)",
          "                      Uptime:  shipping code since 2022",
          "                      Fuel:    coffee ☕ + basketball 🏀",
        ],
      };
    case "about":
      return {
        out: [
          "Yuval Boker — Software Engineer @ Onezero (Full Stack, Backend & AI).",
          "B.Sc. Computer Science (Tel-Hai) · Excellenteam Excellence Program alumnus.",
          "Presented end-to-end projects to engineers from Google, NVIDIA & Check Point.",
          "Loves: clean code, hard problems, basketball, and shipping things that work.",
        ],
      };
    case "skills":
      return { out: [SKILLS_LINE, "", "Run 'projects' to see them in action."] };
    case "projects": {
      const featured = projects.filter((p) => p.featured);
      return {
        out: [
          `${featured.length} featured projects:`,
          ...featured.map((p, i) => `  ${String(i + 1).padStart(2, "0")}. ${p.title}`),
          "",
          "Scroll down to explore them — or type 'github'.",
        ],
      };
    }
    case "experience":
      return {
        out: [
          "→ Full Stack Engineer @ Onezero (2026-present) — web, mobile & AI integrations",
          "→ Excellenteam Excellence Program — intensive C++/Python engineering (2025)",
          "→ Teaching Assistant, Probability — Tel-Hai (Jan-Aug 2025)",
          "→ B.Sc. Computer Science — Tel-Hai (2022-2025)",
          "→ IDF Recruits Commander (2018-2021)",
        ],
      };
    case "contact":
      return {
        out: [
          "email:    yuvalboker588@gmail.com",
          "phone:    +972-52-7968511",
          "github:   github.com/Yuval2306",
          "linkedin: linkedin.com/in/yuval-boker-43792537b",
        ],
      };
    case "whoami":
      return { out: ["visitor (soon-to-be: yuval's teammate?)"] };
    case "github":
      return { out: ["Opening GitHub..."], action: "open-github" };
    case "linkedin":
      return { out: ["Opening LinkedIn..."], action: "open-linkedin" };
    case "cv":
      return { out: ["Opening email — request the CV directly from Yuval..."], action: "open-cv" };
    case "clear":
      return { out: [], action: "clear" };
    case "sudo hire-yuval":
      return {
        out: [
          "[sudo] password for visitor: ********",
          "Permission granted ✔",
          "Initializing onboarding sequence...",
          "  ✔ Motivation module ......... loaded",
          "  ✔ Clean-code engine ......... loaded",
          "  ✔ Team-player protocol ...... loaded",
          "SUCCESS: Yuval is ready to join your team. HR has been notified 😉",
        ],
      };
    case "sudo":
      return { out: ["usage: sudo hire-yuval"] };
    case "coffee":
      return { out: ["☕ Brewing... done. Productivity +40%."] };
    case "ls":
      return { out: ["onezero/  projects/  skills/  education/  experience/  contact.txt  easter_eggs/"] };
    case "exit":
      return { out: ["There is no escape. You've already scrolled this far 😉"] };
    case "":
      return { out: [] };
    default:
      return { out: [`command not found: ${cmd} — try 'help'`] };
  }
}

export function Terminal() {
  const [lines, setLines] = useState<Line[]>([
    { type: "out", text: "Welcome to yuval.sh — Software Engineer @ Onezero | Full Stack, Backend & AI." },
    { type: "out", text: "Type 'help' to get started." },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  function submit() {
    const raw = input;
    const { out, action } = run(raw);

    if (action === "clear") {
      setLines([]);
    } else {
      setLines((prev) => [
        ...prev,
        { type: "cmd", text: raw },
        ...out.map((t): Line => ({ type: "out", text: t })),
      ]);
    }

    if (action === "open-github") window.open("https://github.com/Yuval2306", "_blank", "noopener,noreferrer");
    if (action === "open-linkedin") window.open("https://www.linkedin.com/in/yuval-boker-43792537b/", "_blank", "noopener,noreferrer");
    if (action === "open-cv") window.location.href = `mailto:yuvalboker588@gmail.com?subject=${encodeURIComponent("CV Request — Yuval Boker")}&body=${encodeURIComponent("Hi Yuval,\n\nWe would be happy to receive your CV.\n\nBest regards,")}`;

    if (raw.trim()) {
      setHistory((h) => [raw, ...h]);
    }
    setHistIdx(-1);
    setInput("");
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") submit();
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, history.length - 1);
      if (history[next] !== undefined) {
        setHistIdx(next);
        setInput(history[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = histIdx - 1;
      setHistIdx(next);
      setInput(next >= 0 ? history[next] : "");
    }
  }

  return (
    <div
      className="rounded-3xl border border-white/10 bg-[#0a0f1e]/90 backdrop-blur-xl overflow-hidden shadow-[0_0_60px_rgba(59,130,246,0.12)] hover:border-blue-500/30 transition-colors duration-500"
      onClick={() => inputRef.current?.focus()}
    >
      {/* title bar */}
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/10 bg-white/[0.03]">
        <span className="h-3 w-3 rounded-full bg-rose-500/80" />
        <span className="h-3 w-3 rounded-full bg-amber-400/80" />
        <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
        <span className="ml-3 text-xs text-slate-400 font-mono">visitor@yuval-portfolio: ~</span>
      </div>

      {/* body */}
      <div ref={bodyRef} className="p-5 h-72 overflow-y-auto custom-scrollbar font-mono text-sm leading-relaxed cursor-text">
        {lines.map((l, i) =>
          l.type === "cmd" ? (
            <div key={i} className="text-slate-200">
              <span className="text-emerald-400">➜</span> <span className="text-cyan-400">~</span>{" "}
              <span>{l.text}</span>
            </div>
          ) : (
            <div key={i} className="text-slate-400 whitespace-pre-wrap">{l.text}</div>
          )
        )}
        <div className="flex items-center text-slate-200">
          <span className="text-emerald-400">➜</span>&nbsp;<span className="text-cyan-400">~</span>&nbsp;
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            className="flex-1 bg-transparent outline-none border-none text-slate-100 font-mono text-sm caret-cyan-400"
            spellCheck={false}
            autoComplete="off"
            aria-label="Terminal input"
            placeholder="type 'help'..."
          />
        </div>
      </div>
    </div>
  );
}
