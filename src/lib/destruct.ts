// Easter egg: `sudo rm -rf /` in the terminal makes the whole site collapse
// with gravity, then "restore from git backup".

let running = false;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type PieceState = {
  el: HTMLElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  vr: number;
  rot: number;
  delay: number;
  top: number;
};

export async function selfDestruct() {
  if (running) return;
  running = true;

  try {
    const pieces = [...document.querySelectorAll<HTMLElement>("[data-fall]")];
    const vh = window.innerHeight;

    const states: PieceState[] = pieces.map((el) => {
      const r = el.getBoundingClientRect();
      return {
        el,
        x: 0,
        y: 0,
        vx: (Math.random() - 0.5) * 7,
        vy: -(2 + Math.random() * 5),
        vr: (Math.random() - 0.5) * 12,
        rot: 0,
        delay: Math.random() * 500,
        top: r.top,
      };
    });

    // fall
    const t0 = performance.now();
    await new Promise<void>((res) => {
      function tick(t: number) {
        let alive = false;
        for (const s of states) {
          if (t - t0 < s.delay) {
            alive = true;
            continue;
          }
          s.vy += 0.6;
          s.x += s.vx;
          s.y += s.vy;
          s.rot += s.vr;
          if (s.top + s.y < vh + 400) alive = true;
          s.el.style.setProperty("transition", "none", "important");
          s.el.style.setProperty(
            "transform",
            `translate(${s.x}px, ${s.y}px) rotate(${s.rot}deg)`,
            "important"
          );
        }
        if (alive && t - t0 < 3200) requestAnimationFrame(tick);
        else res();
      }
      requestAnimationFrame(tick);
    });

    // fake wipe overlay
    const ov = document.createElement("div");
    ov.style.cssText =
      "position:fixed;inset:0;z-index:600;background:rgba(2,6,23,0.97);display:flex;align-items:center;justify-content:center;font-family:ui-monospace,Consolas,monospace;font-size:16px;padding:24px;";
    ov.innerHTML = `<div style="min-width:320px">
      <div style="color:#4ade80">$ sudo rm -rf /</div>
      <div style="color:#94a3b8;margin-top:8px">deleting portfolio... <span id="__dp" style="color:#f87171">0%</span></div>
      <div id="__dmsg" style="margin-top:16px;color:#e2e8f0;opacity:0;transition:opacity 0.5s"></div>
    </div>`;
    document.body.appendChild(ov);

    const dp = ov.querySelector("#__dp") as HTMLElement;
    for (let p = 0; p <= 100; p += 4) {
      dp.textContent = `${p}%`;
      await sleep(35);
    }

    const msg = ov.querySelector("#__dmsg") as HTMLElement;
    msg.innerHTML = `Nice try 😉 Everything I build is backed up.<br/><span style="color:#22d3ee">restoring from origin/main...</span>`;
    msg.style.opacity = "1";
    await sleep(1600);
    ov.remove();

    // restore — everything springs back
    for (const s of states) {
      s.el.style.setProperty("transition", "transform 0.9s cubic-bezier(0.22,1,0.36,1)", "important");
      s.el.style.setProperty("transform", "translate(0px, 0px) rotate(0deg)", "important");
    }
    await sleep(1000);
    for (const s of states) {
      s.el.style.removeProperty("transform");
      s.el.style.removeProperty("transition");
    }
  } finally {
    running = false;
  }
}
