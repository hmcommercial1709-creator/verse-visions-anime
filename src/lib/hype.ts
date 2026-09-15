/**
 * Sound, haptics and the rules about when not to use them.
 *
 * Every effect is SYNTHESISED with the Web Audio API rather than loaded from
 * a file. Three short samples would be three network requests, a cache entry
 * each, and a first-play delay while they download — on a page whose whole
 * point is that the feedback is instant. An oscillator and a gain envelope
 * cost nothing, start in the same frame as the tap, and add zero bytes to the
 * bundle beyond this file.
 *
 * Three rules this holds to, which matter more than the effects themselves:
 *
 *  1. Silence by default on arrival. A content site that makes noise at
 *     someone who did not ask is hostile, and on a shared or quiet space it
 *     is worse than hostile. The AudioContext is not even constructed until
 *     the reader turns sound on, which is also what browser autoplay policy
 *     requires — so the honest behaviour and the enforced one agree.
 *  2. prefers-reduced-motion suppresses the particle burst. For some people
 *     this kind of motion is nausea, not delight.
 *  3. Haptics are feature-detected, never assumed. navigator.vibrate does not
 *     exist on iOS Safari at all, so a "tactile" promise there would simply
 *     be false; the code no-ops instead of pretending.
 */

export const SOUND_PREF_KEY = "gamecastle.sound.v1";

export type Cue = "pop" | "whoosh" | "boom";

let ctx: AudioContext | null = null;

/** True when the reader has explicitly switched sound on. */
export function soundEnabled(): boolean {
  try {
    return localStorage.getItem(SOUND_PREF_KEY) === "on";
  } catch {
    return false;
  }
}

export function setSoundEnabled(on: boolean): void {
  try {
    localStorage.setItem(SOUND_PREF_KEY, on ? "on" : "off");
  } catch {
    // The choice still holds for this page view.
  }
  if (!on && ctx) {
    void ctx.close().catch(() => undefined);
    ctx = null;
  }
}

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) {
    try {
      ctx = new Ctor();
    } catch {
      return null;
    }
  }
  // Safari suspends the context when it is created outside a gesture and
  // again when the tab is backgrounded; resuming is a no-op when running.
  if (ctx.state === "suspended") void ctx.resume().catch(() => undefined);
  return ctx;
}

/** A short burst of filtered noise — the body of a whoosh or an explosion. */
function noise(context: AudioContext, seconds: number): AudioBufferSourceNode {
  const frames = Math.max(1, Math.floor(context.sampleRate * seconds));
  const buffer = context.createBuffer(1, frames, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i += 1) {
    // Decaying white noise. The taper is what stops it sounding like static.
    data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
  }
  const source = context.createBufferSource();
  source.buffer = buffer;
  return source;
}

/**
 * Plays one cue. Silent, and free, when sound is off.
 *
 * Never throws: an audio failure must not take a button's click handler with
 * it, because the action the button performs matters and the sound does not.
 */
export function play(cue: Cue): void {
  if (!soundEnabled()) return;
  const context = audio();
  if (!context) return;

  try {
    const now = context.currentTime;
    const out = context.createGain();
    out.connect(context.destination);

    if (cue === "pop") {
      // A short sine blip with a fast pitch drop: the UI "tick".
      const osc = context.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.08);
      out.gain.setValueAtTime(0.0001, now);
      out.gain.exponentialRampToValueAtTime(0.22, now + 0.008);
      out.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      osc.connect(out);
      osc.start(now);
      osc.stop(now + 0.14);
      return;
    }

    if (cue === "whoosh") {
      // Band-passed noise sweeping upward: air moving past something.
      const source = noise(context, 0.38);
      const filter = context.createBiquadFilter();
      filter.type = "bandpass";
      filter.Q.value = 1.1;
      filter.frequency.setValueAtTime(320, now);
      filter.frequency.exponentialRampToValueAtTime(2600, now + 0.3);
      out.gain.setValueAtTime(0.0001, now);
      out.gain.exponentialRampToValueAtTime(0.2, now + 0.06);
      out.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
      source.connect(filter).connect(out);
      source.start(now);
      return;
    }

    // boom: a low sine drop for the chest, noise through a lowpass for the
    // crack. Either alone reads as a thud or a hiss; together they read as an
    // impact.
    const body = context.createOscillator();
    body.type = "sine";
    body.frequency.setValueAtTime(140, now);
    body.frequency.exponentialRampToValueAtTime(38, now + 0.5);
    const bodyGain = context.createGain();
    bodyGain.gain.setValueAtTime(0.0001, now);
    bodyGain.gain.exponentialRampToValueAtTime(0.5, now + 0.02);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    body.connect(bodyGain).connect(out);
    body.start(now);
    body.stop(now + 0.62);

    const crack = noise(context, 0.45);
    const lp = context.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(1800, now);
    lp.frequency.exponentialRampToValueAtTime(220, now + 0.4);
    const crackGain = context.createGain();
    crackGain.gain.setValueAtTime(0.35, now);
    crackGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
    crack.connect(lp).connect(crackGain).connect(out);
    crack.start(now);
  } catch {
    // A missing or throttled audio path is not worth breaking a click over.
  }
}

/** True when this device can actually vibrate. iOS Safari cannot. */
export function canVibrate(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.vibrate === "function";
}

/**
 * A short haptic tap. No-ops where unsupported rather than promising tactility
 * the device cannot deliver.
 */
export function buzz(pattern: number | number[] = 12): void {
  if (!canVibrate()) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    // Some browsers throw when the page is not visible.
  }
}

/** Whether motion effects are welcome here. */
export function motionAllowed(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  try {
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return true;
  }
}

/** One call for the three channels, so a button cannot wire up only some. */
export function feedback(cue: Cue, haptic: number | number[] = 12): void {
  play(cue);
  buzz(haptic);
}
