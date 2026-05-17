// Tiny WebAudio sound engine — no external assets required.
// Generates 8-bit-style chiptune SFX + a soft looping background melody.

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let bgmGain: GainNode | null = null;
let bgmTimer: number | null = null;
let bgmStarted = false;
let muted = false;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext })
        .AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.4;
    masterGain.connect(ctx.destination);
    bgmGain = ctx.createGain();
    bgmGain.gain.value = 0.08;
    bgmGain.connect(masterGain);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function blip(
  freq: number,
  dur: number,
  type: OscillatorType = "square",
  vol = 0.25,
  slideTo?: number,
  target: GainNode | null = null,
) {
  if (muted) return;
  const c = getCtx();
  if (!c || !masterGain) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, c.currentTime + dur);
  g.gain.setValueAtTime(vol, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  osc.connect(g);
  g.connect(target ?? masterGain);
  osc.start();
  osc.stop(c.currentTime + dur + 0.02);
}

export const sfx = {
  click: () => blip(620, 0.08, "square", 0.18),
  hover: () => blip(880, 0.04, "triangle", 0.08),
  correct: () => {
    blip(659, 0.1, "square", 0.22);
    setTimeout(() => blip(784, 0.1, "square", 0.22), 90);
    setTimeout(() => blip(988, 0.18, "square", 0.22), 180);
  },
  wrong: () => {
    blip(220, 0.18, "square", 0.22, 110);
    setTimeout(() => blip(180, 0.22, "sawtooth", 0.18, 90), 120);
  },
  win: () => {
    const notes = [523, 659, 784, 1047, 1319];
    notes.forEach((n, i) => setTimeout(() => blip(n, 0.18, "square", 0.25), i * 110));
    setTimeout(() => blip(1568, 0.5, "triangle", 0.3), notes.length * 110);
  },
  type: () => blip(1400 + Math.random() * 200, 0.015, "square", 0.04),
  open: () => {
    blip(440, 0.12, "triangle", 0.18);
    setTimeout(() => blip(660, 0.18, "triangle", 0.18), 80);
  },
};

// ── Background music ─────────────────────────────────────────────
// Soft pixel-romantic loop in C major — gentle plucks.
const MELODY: Array<[number, number]> = [
  [523, 0.4], [659, 0.4], [784, 0.4], [659, 0.4],
  [587, 0.4], [698, 0.4], [880, 0.6], [0, 0.2],
  [784, 0.4], [659, 0.4], [523, 0.4], [587, 0.4],
  [494, 0.4], [523, 0.4], [659, 0.8], [0, 0.2],
];

function playMelodyOnce(onDone: () => void) {
  if (!bgmGain) return;
  let t = 0;
  for (const [freq, dur] of MELODY) {
    if (freq > 0) {
      setTimeout(() => blip(freq, dur * 0.9, "triangle", 0.5, undefined, bgmGain), t * 1000);
      // soft octave below for warmth
      setTimeout(() => blip(freq / 2, dur * 0.9, "sine", 0.35, undefined, bgmGain), t * 1000);
    }
    t += dur;
  }
  bgmTimer = window.setTimeout(onDone, t * 1000);
}

export function startBgm() {
  if (bgmStarted || muted) return;
  if (!getCtx()) return;
  bgmStarted = true;
  const loop = () => {
    if (!bgmStarted) return;
    playMelodyOnce(loop);
  };
  loop();
}

export function stopBgm() {
  bgmStarted = false;
  if (bgmTimer) {
    clearTimeout(bgmTimer);
    bgmTimer = null;
  }
}

// ── Closing/letter music — slower, softer, lullaby-like ───────────
const CLOSING: Array<[number, number]> = [
  [523, 0.7], [659, 0.7], [784, 0.9], [659, 0.5],
  [587, 0.7], [698, 0.9], [880, 1.1], [0, 0.3],
  [784, 0.7], [698, 0.7], [659, 0.9], [523, 1.2], [0, 0.4],
];

let closingTimer: number | null = null;
let closingPlaying = false;

export function startClosingMusic() {
  if (closingPlaying || muted) return;
  if (!getCtx() || !bgmGain) return;
  stopBgm();
  closingPlaying = true;
  const loop = () => {
    if (!closingPlaying || !bgmGain) return;
    let t = 0;
    for (const [freq, dur] of CLOSING) {
      if (freq > 0) {
        setTimeout(() => blip(freq, dur * 0.95, "sine", 0.4, undefined, bgmGain), t * 1000);
        setTimeout(() => blip(freq / 2, dur * 0.95, "triangle", 0.22, undefined, bgmGain), t * 1000);
      }
      t += dur;
    }
    closingTimer = window.setTimeout(loop, t * 1000);
  };
  loop();
}

export function stopClosingMusic() {
  closingPlaying = false;
  if (closingTimer) {
    clearTimeout(closingTimer);
    closingTimer = null;
  }
}

export function setMuted(m: boolean) {
  muted = m;
  if (m) {
    stopBgm();
    stopClosingMusic();
  }
}

export function isMuted() {
  return muted;
}
