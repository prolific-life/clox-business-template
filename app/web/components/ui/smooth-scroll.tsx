'use client';

import * as React from 'react';
import Lenis from 'lenis';

/**
 * SmoothScroll - Lenis inertia scrolling (12 of 16 award winners ship it).
 * Mount once in a marketing layout, never inside the signed-in app where
 * native scrolling is expected. Skips itself for reduced motion and
 * touch devices.
 */
export const SmoothScroll = () => {
  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;
    const lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1 });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
  return null;
};
