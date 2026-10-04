'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';
import { createQuad, cssColor, loopWhileVisible, prefersReducedMotion } from './gl';

/**
 * ShaderGradient - a living background: domain-warped noise flowing through
 * the brand colors, with a soft light that follows the cursor. Use behind a
 * hero, a CTA band or a sign-in panel instead of a flat fill or a static
 * gradient. Colors default to the theme tokens, so a design system swap
 * re-tints it. Reduced motion renders one still frame.
 *
 *   <section className="relative">
 *     <ShaderGradient className="absolute inset-0 -z-10" />
 *     ...
 *   </section>
 */
const FRAG = `
uniform vec2 uRes;
uniform float uT;
uniform vec2 uMouse;
uniform vec3 uA;
uniform vec3 uB;
uniform vec3 uC;
uniform vec3 uBg;
uniform float uGrain;
varying vec2 vUv;

vec3 hash3(vec2 p) {
  vec3 q = vec3(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)),
                dot(p, vec2(419.2, 371.9)));
  return fract(sin(q) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash3(i).x;
  float b = hash3(i + vec2(1.0, 0.0)).x;
  float c = hash3(i + vec2(0.0, 1.0)).x;
  float d = hash3(i + vec2(1.0, 1.0)).x;
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
  return v;
}
void main() {
  vec2 uv = vUv;
  vec2 p = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0) * 1.6;
  float t = uT * 0.06;
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p + 3.0 * q + vec2(1.7, 9.2) + t * 1.3),
                fbm(p + 3.0 * q + vec2(8.3, 2.8) - t));
  float f = fbm(p + 3.0 * r);
  vec3 col = mix(uBg, uA, smoothstep(0.15, 0.75, f));
  col = mix(col, uB, smoothstep(0.35, 0.95, length(q)) * 0.65);
  col = mix(col, uC, smoothstep(0.55, 1.0, r.x) * 0.45);
  vec2 m = (uMouse - 0.5) * vec2(uRes.x / uRes.y, 1.0) * 1.6;
  col += uA * 0.18 * exp(-length(p - m) * 2.2);
  float g = fract(sin(dot(uv * uRes + uT, vec2(12.9898, 78.233))) * 43758.5453);
  col += (g - 0.5) * uGrain;
  gl_FragColor = vec4(col, 1.0);
}
`;

export const ShaderGradient = ({
  className,
  colors = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--secondary))'],
  background = 'hsl(var(--background))',
  speed = 1,
  grain = 0.035,
}: {
  className?: string;
  colors?: [string, string, string];
  background?: string;
  speed?: number;
  grain?: number;
}) => {
  const canvas = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const q = createQuad(el, FRAG, 1.25);
    if (!q) return;
    const a = cssColor(el, colors[0]);
    const b = cssColor(el, colors[1]);
    const c = cssColor(el, colors[2]);
    const bg = cssColor(el, background);
    const mouse: [number, number] = [0.5, 0.5];
    const target: [number, number] = [0.5, 0.5];
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target[0] = (e.clientX - r.left) / r.width;
      target[1] = 1 - (e.clientY - r.top) / r.height;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    const draw = (t: number) => {
      mouse[0] += (target[0] - mouse[0]) * 0.05;
      mouse[1] += (target[1] - mouse[1]) * 0.05;
      const [w, h] = q.size();
      q.set('uRes', [w, h]);
      q.set('uT', t * speed);
      q.set('uMouse', mouse);
      q.set('uA', a);
      q.set('uB', b);
      q.set('uC', c);
      q.set('uBg', bg);
      q.set('uGrain', grain);
      q.draw();
    };
    let stop = () => {};
    if (prefersReducedMotion()) draw(12);
    else stop = loopWhileVisible(el, draw);
    return () => {
      stop();
      window.removeEventListener('pointermove', onMove);
      q.destroy();
    };
  }, []);
  return (
    <canvas
      ref={canvas}
      aria-hidden="true"
      className={cn('pointer-events-none h-full w-full', className)}
    />
  );
};
