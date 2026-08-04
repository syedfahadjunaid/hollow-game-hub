/**
 * 8-Bit Retro Sound FX Synthesizer using Web Audio API
 */

let audioCtx: AudioContext | null = null;
let soundMuted = false;

// Initialize mute state from localStorage if in browser
if (typeof window !== "undefined") {
  const saved = localStorage.getItem("hollow_sound_muted");
  if (saved !== null) {
    soundMuted = saved === "true";
  }
}

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isSoundMuted(): boolean {
  return soundMuted;
}

export function setSoundMuted(muted: boolean): void {
  soundMuted = muted;
  if (typeof window !== "undefined") {
    localStorage.setItem("hollow_sound_muted", String(muted));
  }
}

export function toggleSoundMute(): boolean {
  const next = !soundMuted;
  setSoundMuted(next);
  return next;
}

/** Play short retro button click */
export function playClickSound() {
  if (soundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "square";
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.05);

  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.05);
}

/** Play correct answer / success chime */
export function playCorrectSound() {
  if (soundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = ctx.currentTime + idx * 0.07;

    osc.type = "square";
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.09, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.1);
  });
}

/** Play wrong move / fail sound */
export function playWrongSound() {
  if (soundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(180, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(90, ctx.currentTime + 0.2);

  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.2);
}

/** Play victory / match win fanfare */
export function playWinFanfare() {
  if (soundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = ctx.currentTime + idx * 0.09;
    const duration = idx === notes.length - 1 ? 0.3 : 0.1;

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.12, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  });
}

/** Play game start power-up sound */
export function playGameStartSound() {
  if (soundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(220, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.25);

  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.25);
}

/** Play energetic level-up ascending scale */
export function playLevelUp() {
  if (soundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51]; // A4, C#5, E5, A5, C#6, E6
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = ctx.currentTime + idx * 0.06;
    const duration = idx === notes.length - 1 ? 0.35 : 0.08;

    osc.type = "square";
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.1, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  });
}

/** Play tab switch sound */
export function playTabSound() {
  if (soundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(450, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);

  gain.gain.setValueAtTime(0.05, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.04);
}
