/**
 * Polymorphic 8-Bit / 16-Bit / Synthwave Sound FX Synthesizer using Web Audio API
 * Supports cosmetic soundpacks unlocked via the Shop & Locker:
 * - "default": Classic 8-bit arcade blips
 * - "soundpack-arcade-laser": Rapid laser sweeps & space blaster effects
 * - "soundpack-chiptune-8bit": NES square-wave arpeggio chiptunes
 * - "soundpack-synthwave-16bit": Rich FM brass & 16-bit arcade chords
 * - "soundpack-cosmic-ambient": Ethereal celestial chimes & sub-bass sweeps
 */

let audioCtx: AudioContext | null = null;
let soundMuted = false;
let activeSoundpack = "default";

// Initialize mute state & soundpack from localStorage if in browser
if (typeof window !== "undefined") {
  const savedMute = localStorage.getItem("hollow_sound_muted");
  if (savedMute !== null) {
    soundMuted = savedMute === "true";
  }
  const savedPack = localStorage.getItem("hollow_equipped_soundpack");
  if (savedPack) {
    activeSoundpack = savedPack;
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

export function getActiveSoundpack(): string {
  return activeSoundpack;
}

export function setActiveSoundpack(soundpackSlug: string): void {
  activeSoundpack = soundpackSlug || "default";
  if (typeof window !== "undefined") {
    localStorage.setItem("hollow_equipped_soundpack", activeSoundpack);
  }
}

/** Play short retro button click */
export function playClickSound(soundpack = activeSoundpack) {
  if (soundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  if (soundpack === "soundpack-arcade-laser") {
    // Laser click (pitch sweep down)
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.06);
    gain.gain.setValueAtTime(0.09, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  } else if (soundpack === "soundpack-synthwave-16bit") {
    // 16-bit punchy blip
    osc.type = "triangle";
    osc.frequency.setValueAtTime(540, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(270, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } else if (soundpack === "soundpack-cosmic-ambient") {
    // Celestial bell click
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } else {
    // Default 8-bit square click
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
}

/** Play correct answer / success chime */
export function playCorrectSound(soundpack = activeSoundpack) {
  if (soundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  if (soundpack === "soundpack-arcade-laser") {
    // Space victory sweep
    const notes = [440, 880, 1760];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.06;
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, startTime + 0.09);
      gain.gain.setValueAtTime(0.08, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.09);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.09);
    });
  } else if (soundpack === "soundpack-synthwave-16bit") {
    // FM synth triad
    const notes = [587.33, 739.99, 880]; // D5, F#5, A5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.05;
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.14);
    });
  } else if (soundpack === "soundpack-cosmic-ambient") {
    // Ethereal pentatonic shimmer
    const notes = [523.25, 659.25, 783.99, 987.77];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.05;
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.09, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.18);
    });
  } else {
    // Default 8-bit square chime
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
}

/** Play wrong move / fail sound */
export function playWrongSound(soundpack = activeSoundpack) {
  if (soundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  if (soundpack === "soundpack-cosmic-ambient") {
    osc.type = "sine";
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.14, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  } else {
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(90, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
  }

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.25);
}

/** Play victory fanfare */
export function playWinFanfare(soundpack = activeSoundpack) {
  if (soundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes =
    soundpack === "soundpack-synthwave-16bit"
      ? [440, 554.37, 659.25, 880, 1108.73] // A Major 16-bit
      : [523.25, 659.25, 783.99, 1046.5]; // C Major classic

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = ctx.currentTime + idx * 0.08;
    const duration = idx === notes.length - 1 ? 0.35 : 0.1;

    osc.type = soundpack === "soundpack-chiptune-8bit" ? "square" : "triangle";
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(0.12, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration);
  });
}

/** Play game start sound */
export function playGameStartSound(soundpack = activeSoundpack) {
  if (soundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = soundpack === "soundpack-arcade-laser" ? "sawtooth" : "sine";
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
export function playLevelUp(soundpack = activeSoundpack) {
  if (soundMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
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

/** Audition / Preview a specific soundpack */
export function previewSoundpack(soundpackSlug: string) {
  playCorrectSound(soundpackSlug);
  setTimeout(() => {
    playWinFanfare(soundpackSlug);
  }, 220);
}
