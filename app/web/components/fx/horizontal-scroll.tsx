'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';
import { prefersReducedMotion } from './gl';

/**
 * HorizontalScroll - the pinned horizontal gallery: the section sticks to
 * the viewport while vertical scrolling drives a track sideways, items
 * lean with the scroll speed (velocity skew) and images drift inside their
 * frames (parallax), so the motion feels physical rather than scripted.
 * The portfolio-site signature; also a strong way to walk through features,
 * work, products or steps.
 *
 * Children are the panels; size them yourself (e.g. w-[70vw] md:w-[38vw]).
 * Put `data-parallax` on an <img> inside a panel to let it drift. Touch
 * devices and reduced motion get a native horizontal scroller instead.
 *
 *   <HorizontalScroll>
 *     {work.map((w) => (
 *       <article key={w.id} className="w-[72vw] md:w-[36vw] shrink-0">
 *         <div className="overflow-hidden aspect-[4/5]">
 *           <img data-parallax src={w.image} className="h-full w-[120%] max-w-none object-cover" />
 *         </div>
 *       </article>
 *     ))}
 *   </HorizontalScroll>
 */
export const HorizontalScroll = ({
  children,
  className,
  gap = 'gap-6 md:gap-10',
  padding = 'px-6 md:px-16',
  heading,
  bend = true,
}: {
  children: React.ReactNode;
  className?: string;
  gap?: string;
  padding?: string;
  /** Optional fixed heading shown while the track scrolls. */
  heading?: React.ReactNode;
  /** Bend the row into a ribbon with scroll speed: outer panels twist
   *  toward the viewer, like the portfolio-site signature. */
  bend?: boolean;
}) => {
  const section = React.useRef<HTMLElement>(null);
  const track = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState<number | null>(null);
  const [native, setNative] = React.useState(false);

  React.useEffect(() => {
    const touch = window.matchMedia('(hover: none)').matches;
    if (touch || prefersReducedMotion()) {
      setNative(true);
      return;
    }
    const sec = section.current;
    const tr = track.current;
    if (!sec || !tr) return;

    const measure = () => {
      const distance = tr.scrollWidth - window.innerWidth;
      setHeight(window.innerHeight + Math.max(0, distance));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(tr);
    window.addEventListener('resize', measure);

    let raf = 0;
    let x = 0;
    let skew = 0;
    let lastY = window.scrollY;
    const frame = () => {
      const rect = sec.getBoundingClientRect();
      const distance = tr.scrollWidth - window.innerWidth;
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(1, distance)));
      const target = -progress * distance;
      x += (target - x) * 0.12;
      const vy = window.scrollY - lastY;
      lastY = window.scrollY;
      skew += (Math.max(-8, Math.min(8, vy * 0.25)) - skew) * 0.1;
      tr.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
      tr.querySelectorAll<HTMLElement>(':scope > *').forEach((panel) => {
        if (!bend) {
          panel.style.transform = `skewX(${(-skew).toFixed(2)}deg)`;
          return;
        }
        const r = panel.getBoundingClientRect();
        const off = (r.left + r.width / 2) / window.innerWidth - 0.5;
        const twist = off * skew * 6;
        const lift = Math.abs(off) * Math.abs(skew) * 18;
        panel.style.transform =
          `perspective(1400px) translateZ(${lift.toFixed(1)}px) ` +
          `rotateY(${(-twist).toFixed(2)}deg) skewX(${(-skew * 0.4).toFixed(2)}deg)`;
      });
      tr.querySelectorAll<HTMLElement>('[data-parallax]').forEach((img) => {
        const r = img.parentElement?.getBoundingClientRect();
        if (!r) return;
        const center = (r.left + r.width / 2) / window.innerWidth - 0.5;
        img.style.transform = `translate3d(${(-center * 12).toFixed(2)}%,0,0)`;
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [bend]);

  if (native) {
    return (
      <section className={cn('relative', className)}>
        {heading ? <div className={padding}>{heading}</div> : null}
        <div
          className={cn(
            'scrollbar-hidden flex snap-x snap-mandatory overflow-x-auto py-8',
            gap,
            padding,
          )}
        >
          {React.Children.map(children, (child) => (
            <div className="shrink-0 snap-start">{child}</div>
          ))}
        </div>
      </section>
    );
  }
  return (
    <section
      ref={section}
      className={cn('relative', className)}
      style={{ height: height ?? '100vh' }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        {heading ? <div className={cn('mb-8', padding)}>{heading}</div> : null}
        <div
          ref={track}
          className={cn('flex w-max items-center will-change-transform', gap, padding)}
        >
          {children}
        </div>
      </div>
    </section>
  );
};
