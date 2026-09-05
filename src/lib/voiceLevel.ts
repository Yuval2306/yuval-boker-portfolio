// Live loudness of the narrator's voice (0..1), read by the 3D scene and the
// particle name so the visuals pulse with the speech.

export const voice = { level: 0 };

let ctx: AudioContext | null = null;
const attached = new WeakSet<HTMLAudioElement>();
let raf = 0;

// Must be called from inside a user gesture (AudioContext rules).
export function attachVoiceAnalyser(audio: HTMLAudioElement) {
  if (attached.has(audio)) {
    if (ctx && ctx.state === "suspended") void ctx.resume();
    return;
  }
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx = ctx ?? new AC();
    if (ctx.state === "suspended") void ctx.resume();

    const source = ctx.createMediaElementSource(audio);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.6;
    source.connect(analyser);
    analyser.connect(ctx.destination);
    attached.add(audio);

    const data = new Uint8Array(analyser.fftSize);
    let smooth = 0;

    const tick = () => {
      if (audio.paused || audio.ended) {
        smooth *= 0.85;
        voice.level = smooth < 0.01 ? 0 : smooth;
        if (voice.level === 0) {
          raf = 0;
          return;
        }
      } else {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);
        const target = Math.min(1, rms * 3.2);
        smooth += (target - smooth) * (target > smooth ? 0.5 : 0.15);
        voice.level = smooth;
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    audio.addEventListener("play", start);
    start();
  } catch {
    // analyser unavailable — visuals simply don't react
  }
}
