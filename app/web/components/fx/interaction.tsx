'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';
import { prefersReducedMotion } from './gl';

/**
 * Magnetic - wrap a button or link so it leans toward the cursor and
 * springs back. Keep it to one or two primary actions per page.
 *
 *   <Magnetic><Button>Start free</Button></Magnetic>
 */
export const Magnetic = ({
  children,
  strength = 0.35,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) => {
  const ref = React.useRef<HTMLSpanElement>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || window.matchMedia('(hover: none)').matches) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = (e.clientX - (r.left + r.width / 2)) * strength;
      ty = (e.clientY - (r.top + r.height / 2)) * strength;
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
    };
    const frame = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      el.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0)`;
      raf = requestAnimationFrame(frame);
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [strength]);
  return (
    <span ref={ref} className={cn('inline-block will-change-transform', className)}>
      {children}
    </span>
  );
};

/**
 * Cursor - a soft follower dot that grows over anything interactive and
 * shows a label over elements with data-cursor="View" (or any word). Mount
 * once in a marketing layout; it hides itself on touch and reduced motion
 * and never replaces the system cursor on inputs.
 */
export const Cursor = () => {
  const dot = React.useRef<HTMLDivElement>(null);
  const [label, setLabel] = React.useState('');
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    if (prefersReducedMotion() || window.matchMedia('(hover: none)').matches) return;
    setOn(true);
    let raf = 0;
    let x = -100;
    let y = -100;
    let tx = -100;
    let ty = -100;
    let scale = 1;
    let ts = 1;
    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const target = e.target instanceof Element ? e.target : null;
      const labelled = target?.closest<HTMLElement>('[data-cursor]');
      const interactive = target?.closest('a,button,[role="button"],label');
      setLabel(labelled?.dataset.cursor ?? '');
      ts = labelled ? 4.2 : interactive ? 2.2 : 1;
    };
    const frame = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      scale += (ts - scale) * 0.15;
      if (dot.current) {
        dot.current.style.transform =
          `translate3d(${x}px,${y}px,0) translate(-50%,-50%) scale(${scale.toFixed(3)})`;
      }
      raf = requestAnimationFrame(frame);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);
  if (!on) return null;
  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90] flex h-3 w-3 items-center justify-center rounded-full bg-foreground mix-blend-difference"
    >
      {label ? (
        <span className="text-[3px] font-medium uppercase tracking-wider text-background">
          {label}
        </span>
      ) : null}
    </div>
  );
};

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=?';

/**
 * ScrambleText - text that decodes into place when it enters the viewport
 * (and again on hover with `onHover`). Good for eyebrows, labels, numbers
 * and nav items; keep long headlines on SplitText.
 */
export const ScrambleText = ({
  text,
  className,
  duration = 900,
  onHover = false,
}: {
  text: string;
  className?: string;
  duration?: number;
  onHover?: boolean;
}) => {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [out, setOut] = React.useState(text);
  const run = React.useCallback(() => {
    if (prefersReducedMotion()) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const settled = Math.floor(p * text.length);
      setOut(
        text
          .split('')
          .map((ch, i) =>
            i < settled || ch === ' '
              ? ch
              : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          )
          .join(''),
      );
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [text, duration]);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        run();
        io.disconnect();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [run]);
  return (
    <span
      ref={ref}
      className={className}
      aria-label={text}
      onPointerEnter={onHover ? run : undefined}
    >
      <span aria-hidden="true">{out}</span>
    </span>
  );
};

/**
 * StackCards - panels that pin and stack as you scroll, each one scaling
 * back a little as the next slides over it. For process steps, features or
 * case studies told one at a time.
 */
export const StackCards = ({
  children,
  className,
  top = 96,
}: {
  children: React.ReactNode;
  className?: string;
  /** Sticky offset in px (clear the nav). */
  top?: number;
}) => {
  const list = React.Children.toArray(children);
  const refs = React.useRef<(HTMLDivElement | null)[]>([]);
  React.useEffect(() => {
    if (prefersReducedMotion()) return;
    let raf = 0;
    const frame = () => {
      refs.current.forEach((el, i) => {
        const next = refs.current[i + 1];
        if (!el || !next) return;
        const r = next.getBoundingClientRect();
        const overlap = Math.min(1, Math.max(0, 1 - (r.top - top) / window.innerHeight));
        el.style.transform = `scale(${(1 - overlap * 0.06).toFixed(4)})`;
        el.style.filter = `brightness(${(1 - overlap * 0.25).toFixed(3)})`;
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [top]);
  return (
    <div className={cn('relative', className)}>
      {list.map((child, i) => (
        <div
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="sticky origin-top will-change-transform"
          style={{ top: top + i * 14 }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};
