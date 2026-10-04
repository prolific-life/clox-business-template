'use client';

import * as React from 'react';

/**
 * UI sound - small interface sounds synthesized in the browser (no files,
 * nothing to license or host): a hover tick, a press, a soft whoosh for
 * transitions and a two-note chime for success. Award sites pair these
 * with motion so the interface feels physical.
 *
 * Sound is OFF until the visitor turns it on (UISoundToggle, or the kit's
 * SoundToggle calling setUISound(true)); the choice is remembered. Never
 * autoplay, never on inputs, and keep it quiet.
 *
 *   const sound = useUISound()
 *   <a onPointerEnter={sound.tick} onClick={sound.press}>Work</a>
 *   <ScreenWave play={n} onCovered={sound.whoosh} />
 */
type Sound = 'tick' | 'press' | 'whoosh' | 'chime';

const KEY = 'ui-sound';
let ctx: AudioContext | null = null;
let enabled = false;
const listeners = new Set<(on: boolean) => void>();

export const setUISound = (on: boolean) => {
  enabled = on;
  try {
    localStorage.setItem(KEY, on ? '1' : '0');
  } catch {
    // Private mode or storage blocked: the switch still works this visit.
  }
  if (on && !ctx) {
    const AC = window.AudioContext ?? (window as unknown as {
      webkitAudioContext?: typeof AudioContext;
    }).webkitAudioContext;
    ctx = AC ? new AC() : null;
  }
  void ctx?.resume();
  listeners.forEach((l) => l(on));
};

const play = (kind: Sound) => {
  if (!enabled || !ctx) return;
  const t = ctx.currentTime;
  const out = ctx.createGain();
  out.connect(ctx.destination);
  if (kind === 'tick' || kind === 'press') {
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(kind === 'tick' ? 2400 : 1200, t);
    o.frequency.exponentialRampToValueAtTime(kind === 'tick' ? 1800 : 600, t + 0.05);
    out.gain.setValueAtTime(kind === 'tick' ? 0.025 : 0.06, t);
    out.gain.exponentialRampToValueAtTime(0.0001, t + (kind === 'tick' ? 0.05 : 0.09));
    o.connect(out);
    o.start(t);
    o.stop(t + 0.1);
  } else if (kind === 'whoosh') {
    const len = Math.floor(ctx.sampleRate * 0.7);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = 0.8;
    bp.frequency.setValueAtTime(300, t);
    bp.frequency.exponentialRampToValueAtTime(2600, t + 0.35);
    bp.frequency.exponentialRampToValueAtTime(500, t + 0.7);
    out.gain.setValueAtTime(0.0001, t);
    out.gain.exponentialRampToValueAtTime(0.09, t + 0.2);
    out.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
    src.connect(bp);
    bp.connect(out);
    src.start(t);
  } else {
    [880, 1318.5].forEach((f, i) => {
      if (!ctx) return;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t + i * 0.09);
      g.gain.exponentialRampToValueAtTime(0.05, t + i * 0.09 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.09 + 0.5);
      o.connect(g);
      g.connect(out);
      out.gain.value = 1;
      o.start(t + i * 0.09);
      o.stop(t + i * 0.09 + 0.55);
    });
  }
};

export const useUISound = () => {
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    listeners.add(setOn);
    setOn(enabled);
    return () => {
      listeners.delete(setOn);
    };
  }, []);
  return React.useMemo(
    () => ({
      on,
      tick: () => play('tick'),
      press: () => play('press'),
      whoosh: () => play('whoosh'),
      chime: () => play('chime'),
    }),
    [on],
  );
};

/** The visitor's sound switch. Remembers the choice, but the first sound
 *  still waits for this click (browsers require a gesture). */
export const UISoundToggle = ({ className }: { className?: string }) => {
  const { on } = useUISound();
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => setUISound(!on)}
      className={
        className ??
        'k-eyebrow inline-flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0'
      }
    >
      <span className="inline-flex h-3 items-end gap-[2px]" aria-hidden="true">
        {[5, 9, 6, 11].map((h, i) => (
          <span
            key={i}
            style={{
              width: 2,
              height: on ? h : 3,
              background: 'currentColor',
              transition: 'height 200ms',
            }}
          />
        ))}
      </span>
      {on ? 'Sound on' : 'Sound off'}
    </button>
  );
};
