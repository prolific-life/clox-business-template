'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';
import {
  createQuad,
  cssColor,
  expoInOut,
  prefersReducedMotion,
  type QuadGL,
} from './gl';

/**
 * WaveReveal - the "screen wave" reveal: a liquid wavefront sweeps across
 * the frame, the image bends along the edge as it passes, a thin glow line
 * in the brand accent rides the front, and the next image is left behind
 * it. The signature move of sports and product sites that reveal a product
 * at a big moment (a point won, a chapter changed, a price shown).
 *
 * Bump `play` (any changing number) to run it from `from` to `to`; the
 * wave then rests on `to`. Use `direction` up | down | radial (radial
 * starts at `origin`, 0..1 in the frame). Reduced motion cross-fades.
 *
 *   const [n, setN] = useState(0)
 *   <WaveReveal from={a} to={b} play={n} className="aspect-[16/9]" />
 */
const FRAG = `
uniform sampler2D uFrom;
uniform sampler2D uTo;
uniform vec2 uRes;
uniform vec2 uFromSize;
uniform vec2 uToSize;
uniform float uP;
uniform float uT;
uniform float uDir;
uniform vec2 uOrigin;
uniform vec3 uGlow;
varying vec2 vUv;

vec2 cover(vec2 uv, vec2 img) {
  float rs = uRes.x / uRes.y;
  float ri = img.x / img.y;
  vec2 s = rs > ri ? vec2(1.0, ri / rs) : vec2(rs / ri, 1.0);
  return (uv - 0.5) * s + 0.5;
}

void main() {
  vec2 uv = vUv;
  float aspect = uRes.x / uRes.y;
  float along;
  float across;
  if (uDir < 0.5) { along = uv.y; across = uv.x; }
  else if (uDir < 1.5) { along = 1.0 - uv.y; across = uv.x; }
  else {
    vec2 q = (uv - uOrigin) * vec2(aspect, 1.0);
    along = length(q) / 1.6;
    across = atan(q.y, q.x) / 6.2831 + 0.5;
  }
  float wave = sin(across * 11.0 + uT * 3.2) * 0.035
             + sin(across * 23.0 - uT * 5.1) * 0.014
             + sin(across * 5.0 + uT * 1.3) * 0.02;
  float front = uP * 1.35 - 0.15 + wave * sin(uP * 3.14159);
  float d = along - front;
  float band = exp(-abs(d) * 18.0) * sin(uP * 3.14159);
  vec2 n = uDir < 1.5 ? vec2(0.0, uDir < 0.5 ? 1.0 : -1.0)
                      : normalize((uv - uOrigin) + 1e-4);
  vec2 disp = n * band * 0.07;
  float revealed = smoothstep(0.012, -0.012, d);
  vec2 fa = cover(uv + disp, uFromSize);
  vec2 ta = cover(uv - disp * 0.6, uToSize);
  float ca = band * 0.012;
  vec3 from = vec3(
    texture2D(uFrom, fa + vec2(ca, 0.0)).r,
    texture2D(uFrom, fa).g,
    texture2D(uFrom, fa - vec2(ca, 0.0)).b);
  vec3 to = vec3(
    texture2D(uTo, ta - vec2(ca, 0.0)).r,
    texture2D(uTo, ta).g,
    texture2D(uTo, ta + vec2(ca, 0.0)).b);
  vec3 col = mix(from, to, revealed);
  float line = exp(-abs(d) * 140.0) * sin(uP * 3.14159);
  col += uGlow * (line * 0.9 + band * 0.18);
  gl_FragColor = vec4(col, 1.0);
}
`;

export const WaveReveal = ({
  from,
  to,
  play,
  duration = 1.6,
  direction = 'up',
  origin = [0.5, 0.5],
  glow = 'hsl(var(--primary))',
  className,
  alt = '',
}: {
  from: string;
  to: string;
  play: number;
  duration?: number;
  direction?: 'up' | 'down' | 'radial';
  origin?: [number, number];
  glow?: string;
  className?: string;
  alt?: string;
}) => {
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const quad = React.useRef<QuadGL | null>(null);
  const tex = React.useRef<{ from?: { tex: WebGLTexture; w: number; h: number };
    to?: { tex: WebGLTexture; w: number; h: number } }>({});
  const [fallback, setFallback] = React.useState(false);
  const [shown, setShown] = React.useState(from);
  const first = React.useRef(true);

  React.useEffect(() => {
    const el = canvas.current;
    if (!el || prefersReducedMotion()) {
      setFallback(true);
      return;
    }
    const q = createQuad(el, FRAG);
    if (!q) {
      setFallback(true);
      return;
    }
    quad.current = q;
    return () => {
      q.destroy();
      quad.current = null;
    };
  }, []);

  React.useEffect(() => {
    const q = quad.current;
    if (!q) {
      setShown(first.current ? from : to);
      first.current = false;
      return;
    }
    let raf = 0;
    let cancelled = false;
    const dir = direction === 'up' ? 0 : direction === 'down' ? 1 : 2;
    const glowRgb = canvas.current ? cssColor(canvas.current, glow) : [1, 1, 1];
    const run = async () => {
      const [a, b] = await Promise.all([q.texture(from), q.texture(to)]);
      if (cancelled) return;
      tex.current = { from: a, to: b };
      const start = performance.now();
      const animate = first.current && play === 0;
      first.current = false;
      const frame = (now: number) => {
        if (cancelled) return;
        const [w, h] = q.size();
        const raw = animate ? 0 : Math.min(1, (now - start) / (duration * 1000));
        q.set('uFrom', a.tex);
        q.set('uTo', b.tex);
        q.set('uRes', [w, h]);
        q.set('uFromSize', [a.w, a.h]);
        q.set('uToSize', [b.w, b.h]);
        q.set('uP', expoInOut(raw));
        q.set('uT', now / 1000);
        q.set('uDir', dir);
        q.set('uOrigin', origin);
        q.set('uGlow', [glowRgb[0], glowRgb[1], glowRgb[2]]);
        q.draw();
        if (raw < 1) raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    };
    run().catch(() => setFallback(true));
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
    // play is the trigger; the rest are read when it fires.
  }, [play, from, to]);

  if (fallback) {
    return (
      <div className={cn('relative overflow-hidden', className)}>
        <img
          src={shown}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
        />
      </div>
    );
  }
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <canvas
        ref={canvas}
        role="img"
        aria-label={alt}
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
};

/**
 * ScreenWave - a full-screen liquid wipe in the brand color for big
 * moments and page transitions: the wave floods the screen, `onCovered`
 * fires (swap the content there), then it drains off the other edge.
 * Bump `play` to run it. Pointer-transparent; reduced motion skips it and
 * calls onCovered straight away.
 */
const WIPE = `
uniform vec2 uRes;
uniform float uIn;
uniform float uOut;
uniform float uT;
uniform vec3 uColor;
uniform vec3 uEdge;
varying vec2 vUv;
void main() {
  float x = vUv.x;
  float w = sin(x * 9.0 + uT * 3.0) * 0.045 + sin(x * 21.0 - uT * 4.4) * 0.018;
  float fin = uIn * 1.3 - 0.15 + w;
  float fout = uOut * 1.3 - 0.15 - w;
  float cover = smoothstep(0.004, -0.004, vUv.y - fin)
              * smoothstep(-0.004, 0.004, vUv.y - fout);
  float edge = exp(-abs(vUv.y - fin) * 120.0) * (1.0 - uOut)
             + exp(-abs(vUv.y - fout) * 120.0) * uOut;
  vec3 col = mix(uColor, uEdge, clamp(edge, 0.0, 1.0));
  gl_FragColor = vec4(col, max(cover, edge * 0.8));
}
`;

export const ScreenWave = ({
  play,
  color = 'hsl(var(--primary))',
  edge = 'hsl(var(--primary-foreground))',
  duration = 1.1,
  onCovered,
  onDone,
}: {
  play: number;
  color?: string;
  edge?: string;
  duration?: number;
  onCovered?: () => void;
  onDone?: () => void;
}) => {
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const [active, setActive] = React.useState(false);
  const mounted = React.useRef(false);

  React.useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (prefersReducedMotion()) {
      onCovered?.();
      onDone?.();
      return;
    }
    setActive(true);
  }, [play]);

  React.useEffect(() => {
    if (!active) return;
    const el = canvas.current;
    const q = el ? createQuad(el, WIPE) : null;
    if (!el || !q) {
      onCovered?.();
      onDone?.();
      setActive(false);
      return;
    }
    const c = cssColor(el, color);
    const e = cssColor(el, edge);
    const start = performance.now();
    let covered = false;
    let raf = 0;
    const frame = (now: number) => {
      const t = (now - start) / (duration * 1000);
      const pin = expoInOut(Math.min(1, t));
      const pout = expoInOut(Math.min(1, Math.max(0, t - 1.05)));
      if (!covered && t >= 1) {
        covered = true;
        onCovered?.();
      }
      const [w, h] = q.size();
      q.set('uRes', [w, h]);
      q.set('uIn', pin);
      q.set('uOut', pout);
      q.set('uT', now / 1000);
      q.set('uColor', c);
      q.set('uEdge', e);
      q.draw();
      if (t < 2.1) raf = requestAnimationFrame(frame);
      else {
        q.destroy();
        setActive(false);
        onDone?.();
      }
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  if (!active) return null;
  return (
    <canvas
      ref={canvas}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] h-full w-full"
    />
  );
};

/**
 * PointReveal - the "moment" reveal: when something happens at a point on
 * screen (a point won, a button pressed, a product chosen), a soft
 * three-step circle grows out from that point over the live page with a
 * rippling edge and a light ring, and the picture inside zooms down from
 * 3x to 1x as it opens. It rests full screen until `hide` is bumped, then
 * closes back toward the centre. Transparent outside the circle, so the
 * page stays visible around it.
 *
 * Choreography the award sites use: shake the scene 300ms (`shake`
 * targets an element), play the whoosh, wait 300ms, then open over 2.1s
 * with an ease-out; close over 1.1s.
 *
 *   <PointReveal picture={product} show={n} origin={[x, y]} shake={sceneRef} />
 */
const POINT = `
uniform sampler2D uPic;
uniform vec2 uRes;
uniform vec2 uSize;
uniform vec2 uOrigin;
uniform float uP;
uniform float uZ;
uniform float uClose;
uniform float uT;
uniform vec3 uGlow;
varying vec2 vUv;
vec2 cover(vec2 uv) {
  float rs = uRes.x / uRes.y;
  float ri = uSize.x / uSize.y;
  vec2 s = rs > ri ? vec2(1.0, ri / rs) : vec2(rs / ri, 1.0);
  return (uv - 0.5) * s + 0.5;
}
float soft(float d, float r) { return smoothstep(r + 0.025, r - 0.025, d); }
void main() {
  float aspect = uRes.x / uRes.y;
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);
  vec2 o = (uOrigin - 0.5) * vec2(aspect, 1.0);
  float d = length(p - o);
  float reach = length(vec2(aspect, 1.0)) + 0.35;
  float base = uP * reach;
  float r1 = base;
  float r2 = base - 0.04;
  float r3 = base - 0.09;
  float inside = (soft(d, r1) + soft(d, r2) + soft(d, r3)) / 3.0;
  float mask = mix(inside, 1.0 - inside, uClose);
  float k = 30.0;
  float w = 0.0;
  w += sin((d - r1) * 32.0 - uT * 6.5) * exp(-abs(d - r1) * k);
  w += sin((d - r2) * 32.0 - uT * 6.5) * exp(-abs(d - r2) * k);
  w += sin((d - r3) * 32.0 - uT * 6.5) * exp(-abs(d - r3) * k);
  float zoom = mix(3.0, 1.0, 1.0 - pow(1.0 - uZ, 3.0));
  vec2 dir = normalize(p - o + 1e-4) / vec2(aspect, 1.0);
  vec2 uv = (vUv - 0.5) / zoom + 0.5 + dir * w * 0.09;
  vec3 pic = texture2D(uPic, cover(uv)).rgb;
  float live = smoothstep(0.0, 0.08, uP) * (1.0 - uP);
  float ring = exp(-abs(d - r1) / 0.035) + exp(-abs(d - r2) / 0.01)
             + exp(-abs(d - r3) / 0.09) * 0.5;
  vec3 glow = uGlow * clamp(ring, 0.0, 1.0) * live * 0.26;
  gl_FragColor = vec4(pic * mask + glow, max(mask, length(glow)));
}
`;

const easeOutCubic = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);

export const PointReveal = ({
  picture,
  show,
  hide = 0,
  origin = [0.5, 0.5],
  glow = 'hsl(0 0% 100%)',
  shake,
  onWhoosh,
  className = 'pointer-events-none fixed inset-0 z-[80] h-full w-full',
}: {
  picture: string;
  /** Bump to open from `origin` (0..1, y up from the bottom). */
  show: number;
  /** Bump to close toward the centre. */
  hide?: number;
  origin?: [number, number];
  glow?: string;
  /** Element to shake for 300ms before the reveal. */
  shake?: React.RefObject<HTMLElement | null>;
  /** Called when the moment starts, e.g. useUISound().whoosh. */
  onWhoosh?: () => void;
  className?: string;
}) => {
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const quad = React.useRef<QuadGL | null>(null);
  const img = React.useRef<{ tex: WebGLTexture; w: number; h: number } | null>(null);
  const state = React.useRef({ open: 0, zoom: 0, close: 0, closing: false });
  const raf = React.useRef(0);
  const [visible, setVisible] = React.useState(false);

  const render = React.useCallback((now: number) => {
    const q = quad.current;
    const pic = img.current;
    const el = canvas.current;
    if (!q || !pic || !el) return;
    const s = state.current;
    const [w, h] = q.size();
    q.set('uPic', pic.tex);
    q.set('uRes', [w, h]);
    q.set('uSize', [pic.w, pic.h]);
    q.set('uOrigin', s.closing ? [0.5, 0.5] : origin);
    q.set('uP', s.closing ? s.close : s.open);
    q.set('uZ', s.zoom);
    q.set('uClose', s.closing ? 1 : 0);
    q.set('uT', now / 1000);
    q.set('uGlow', cssColor(el, glow));
    q.draw();
  }, [origin, glow]);

  React.useEffect(() => {
    if (!show) return;
    setVisible(true);
    let cancelled = false;
    const start = async () => {
      const el = canvas.current;
      if (!el) return;
      if (!quad.current) {
        quad.current = createQuad(el, POINT);
        if (!quad.current) return;
      }
      img.current = await quad.current.texture(picture);
      if (cancelled) return;
      onWhoosh?.();
      const target = shake?.current;
      if (target && !prefersReducedMotion()) {
        target.animate(
          [0, 1, 2, 3, 4, 5].map((i) => ({
            transform: i === 5 ? 'none'
              : `translate(${(Math.random() - 0.5) * 10}px, ${(Math.random() - 0.5) * 10}px)`,
          })),
          { duration: 300, easing: 'linear' },
        );
      }
      const delay = prefersReducedMotion() ? 0 : 300;
      const t0 = performance.now() + delay;
      state.current = { open: 0, zoom: 0, close: 0, closing: false };
      const frame = (now: number) => {
        if (cancelled) return;
        const t = Math.max(0, now - t0);
        const reduce = prefersReducedMotion();
        state.current.open = reduce ? 1 : easeOutCubic(t / 2100);
        state.current.zoom = reduce ? 1 : easeOutCubic(t / 2200);
        render(now);
        if (state.current.open < 1 || state.current.zoom < 1) {
          raf.current = requestAnimationFrame(frame);
        }
      };
      raf.current = requestAnimationFrame(frame);
    };
    start().catch(() => setVisible(false));
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf.current);
    };
  }, [show]);

  React.useEffect(() => {
    if (!hide || !quad.current) return;
    const t0 = performance.now();
    state.current.closing = true;
    const frame = (now: number) => {
      state.current.close = prefersReducedMotion() ? 1 : easeOutCubic((now - t0) / 1100);
      render(now);
      if (state.current.close < 1) raf.current = requestAnimationFrame(frame);
      else setVisible(false);
    };
    raf.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf.current);
  }, [hide]);

  React.useEffect(() => () => quad.current?.destroy(), []);

  return (
    <canvas
      ref={canvas}
      aria-hidden="true"
      className={className}
      style={{ visibility: visible ? 'visible' : 'hidden' }}
    />
  );
};
