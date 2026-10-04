'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';
import { createQuad, prefersReducedMotion } from './gl';

/**
 * DistortImage - an image that ripples like liquid under the cursor: a
 * radial wave spreads from the pointer, with a hint of chromatic split at
 * the crest, and settles when the pointer leaves. For work grids, product
 * shots and editorial images where a plain zoom-on-hover is too ordinary.
 * Touch and reduced motion get the plain image.
 *
 *   <DistortImage src={shot} alt="Studio" className="aspect-[4/5]" />
 */
const FRAG = `
uniform sampler2D uImg;
uniform vec2 uRes;
uniform vec2 uSize;
uniform vec2 uMouse;
uniform float uHover;
uniform float uT;
varying vec2 vUv;
vec2 cover(vec2 uv) {
  float rs = uRes.x / uRes.y;
  float ri = uSize.x / uSize.y;
  vec2 s = rs > ri ? vec2(1.0, ri / rs) : vec2(rs / ri, 1.0);
  return (uv - 0.5) * s + 0.5;
}
void main() {
  vec2 uv = vUv;
  vec2 d = (uv - uMouse) * vec2(uRes.x / uRes.y, 1.0);
  float dist = length(d);
  float ripple = sin(dist * 38.0 - uT * 7.0) * exp(-dist * 6.0) * uHover;
  vec2 offset = normalize(d + 1e-4) * ripple * 0.018;
  vec2 c = cover(uv + offset);
  float ca = abs(ripple) * 0.006;
  vec3 col = vec3(texture2D(uImg, c + vec2(ca, 0.0)).r,
                  texture2D(uImg, c).g,
                  texture2D(uImg, c - vec2(ca, 0.0)).b);
  gl_FragColor = vec4(col, 1.0);
}
`;

export const DistortImage = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
  const wrap = React.useRef<HTMLDivElement>(null);
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const [gl, setGl] = React.useState(false);

  React.useEffect(() => {
    const el = canvas.current;
    const box = wrap.current;
    if (!el || !box) return;
    if (prefersReducedMotion() || window.matchMedia('(hover: none)').matches) return;
    const q = createQuad(el, FRAG);
    if (!q) return;
    let raf = 0;
    let cancelled = false;
    let hover = 0;
    let target = 0;
    const mouse: [number, number] = [0.5, 0.5];
    const onMove = (e: PointerEvent) => {
      const r = box.getBoundingClientRect();
      mouse[0] = (e.clientX - r.left) / r.width;
      mouse[1] = 1 - (e.clientY - r.top) / r.height;
      target = 1;
    };
    const onLeave = () => {
      target = 0;
    };
    box.addEventListener('pointermove', onMove);
    box.addEventListener('pointerleave', onLeave);
    q.texture(src)
      .then((img) => {
        if (cancelled) return;
        setGl(true);
        const frame = (now: number) => {
          hover += (target - hover) * 0.06;
          const [w, h] = q.size();
          q.set('uImg', img.tex);
          q.set('uRes', [w, h]);
          q.set('uSize', [img.w, img.h]);
          q.set('uMouse', mouse);
          q.set('uHover', hover);
          q.set('uT', now / 1000);
          q.draw();
          raf = requestAnimationFrame(frame);
        };
        raf = requestAnimationFrame(frame);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      box.removeEventListener('pointermove', onMove);
      box.removeEventListener('pointerleave', onLeave);
      q.destroy();
    };
  }, [src]);

  return (
    <div ref={wrap} className={cn('relative overflow-hidden', className)}>
      <img
        src={src}
        alt={alt}
        className={cn(
          'absolute inset-0 h-full w-full object-cover transition-opacity duration-300',
          gl && 'opacity-0',
        )}
      />
      <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 h-full w-full" />
    </div>
  );
};
