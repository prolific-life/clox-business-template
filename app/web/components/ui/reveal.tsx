'use client';

import * as React from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';

const EASE = [0.16, 1, 0.3, 1] as const;

type RevealProps = {
  children: React.ReactNode;
  /** Stagger sibling reveals by passing an increasing delay (seconds). */
  delay?: number;
  className?: string;
};

/**
 * Scroll-into-view entrance for blocks (cards, rows, images). For
 * headlines use <SplitText>, for media use <MediaReveal>: whole blocks
 * fading up is the generic look, masked lines and clip reveals are the
 * award-site look. Honors prefers-reduced-motion.
 */
export const Reveal = ({ children, delay = 0, className }: RevealProps) => {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
};

type SplitTextProps = {
  /** Plain text. Words in `emphasis` get the headline recipe's accent. */
  text: string;
  emphasis?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  className?: string;
  delay?: number;
  /** Animate on mount instead of on scroll (heroes). */
  immediate?: boolean;
};

/**
 * Masked word reveal, the signature move of the winners: each word rises
 * out of its own clip mask (yPercent 110 -> 0, 0.9s expo out, 45ms
 * stagger). Screen readers get the sentence once via aria-label.
 */
export const SplitText = ({
  text,
  emphasis,
  as = 'h2',
  className,
  delay = 0,
  immediate = false,
}: SplitTextProps) => {
  const ref = React.useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px' });
  const reduce = useReducedMotion();
  const show = immediate || inView;
  const emph = new Set(
    (emphasis ?? '')
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean),
  );
  const words = text.split(/\s+/).filter(Boolean);
  const Tag = as;
  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={className}
      aria-label={text}
    >
      {words.map((w, i) => {
        const bare = w.toLowerCase().replace(/[^\p{L}\p{N}'-]/gu, '');
        const word = emph.has(bare) ? <em className="k-em">{w}</em> : w;
        return (
          <React.Fragment key={i}>
            <span
              aria-hidden="true"
              style={{
                display: 'inline-block',
                overflow: 'clip',
                verticalAlign: 'top',
                paddingBottom: '0.1em',
                marginBottom: '-0.1em',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  transform:
                    reduce || show ? 'translateY(0)' : 'translateY(110%)',
                  transition: reduce
                    ? undefined
                    : `transform 900ms cubic-bezier(0.16,1,0.3,1) ${
                        delay + i * 0.045
                      }s`,
                }}
              >
                {word}
              </span>
            </span>
            {i < words.length - 1 ? ' ' : null}
          </React.Fragment>
        );
      })}
    </Tag>
  );
};

type MediaRevealProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Clip-path media reveal: the frame opens from the bottom while the image
 * or video inside settles from 1.25x. Wrap one <img> or <video>.
 */
export const MediaReveal = ({ children, className, style }: MediaRevealProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  return (
    <div
      ref={ref}
      className={cn('k-media k-reveal-media', className)}
      data-in={inView ? 'true' : 'false'}
      style={style}
    >
      {children}
    </div>
  );
};

type CounterProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
};

/** Counts up to `value` when scrolled into view (1.6s, expo out). */
export const Counter = ({
  value,
  prefix = '',
  suffix = '',
  decimals,
  className,
}: CounterProps) => {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const reduce = useReducedMotion();
  const places = decimals ?? (Number.isInteger(value) ? 0 : 1);
  const [shown, setShown] = React.useState(reduce ? value : 0);
  React.useEffect(() => {
    if (!inView || reduce) {
      if (reduce) setShown(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1600);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setShown(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, value]);
  return (
    <span ref={ref} className={className} aria-label={`${prefix}${value}${suffix}`}>
      {prefix}
      {shown.toLocaleString(undefined, {
        minimumFractionDigits: places,
        maximumFractionDigits: places,
      })}
      {suffix ? <span className="k-stat-affix">{suffix.trim()}</span> : null}
    </span>
  );
};

/** Infinite marquee (CSS only, pauses on hover). */
export const Marquee = ({
  children,
  reverse = false,
  seconds = 40,
  className,
}: {
  children: React.ReactNode;
  reverse?: boolean;
  seconds?: number;
  className?: string;
}) => (
  <div
    className={cn('k-marquee', className)}
    data-reverse={reverse ? 'true' : 'false'}
    style={{ ['--k-marquee-dur' as string]: `${seconds}s` }}
  >
    <div className="k-marquee__track">{children}</div>
    <div className="k-marquee__track" aria-hidden="true">
      {children}
    </div>
  </div>
);
