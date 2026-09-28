'use client';

import * as React from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';

/**
 * HeroVideo - the AI-generated hero loop. Muted, looping, inline,
 * poster-first (the poster paints before a byte of video arrives), and
 * paused while off screen so it never burns battery below the fold.
 * Reduced motion shows the poster only.
 *
 * Generate the clip with GenerateSiteVideoTool (8s, no text in frame),
 * then pass its hosted URL. Always pass the poster.
 *
 *   <HeroVideo src={heroUrl} poster={posterUrl} className="absolute inset-0" />
 */
export const HeroVideo = ({
  src,
  webm,
  poster,
  className,
  rounded = false,
}: {
  src: string;
  webm?: string;
  poster: string;
  className?: string;
  rounded?: boolean;
}) => {
  const ref = React.useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  React.useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);
  if (reduce) {
    return (
      <img
        src={poster}
        alt=""
        className={cn('h-full w-full object-cover', rounded && 'rounded-[inherit]', className)}
      />
    );
  }
  return (
    <video
      ref={ref}
      className={cn('h-full w-full object-cover', className)}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
      aria-hidden="true"
    >
      {webm ? <source src={webm} type="video/webm" /> : null}
      <source src={src} type="video/mp4" />
    </video>
  );
};

/**
 * SoundToggle - optional ambient bed (an ElevenLabs sound generation) for
 * immersive heroes. Off until the visitor turns it on, never autoplays.
 */
export const SoundToggle = ({
  src,
  className,
}: {
  src: string;
  className?: string;
}) => {
  const audio = React.useRef<HTMLAudioElement>(null);
  const [on, setOn] = React.useState(false);
  const toggle = () => {
    const el = audio.current;
    if (!el) return;
    if (on) {
      el.pause();
    } else {
      el.volume = 0.5;
      el.play().catch(() => {});
    }
    setOn(!on);
  };
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      className={cn(
        'k-eyebrow inline-flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0',
        className,
      )}
    >
      <span className="inline-flex h-3 items-end gap-[2px]" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            style={{
              width: 2,
              height: on ? undefined : 3,
              background: 'currentColor',
              animation: on
                ? `k-eq 0.9s ${i * 0.12}s ease-in-out infinite alternate`
                : 'none',
            }}
          />
        ))}
      </span>
      {on ? 'Sound on' : 'Sound off'}
      <audio ref={audio} src={src} loop preload="none" />
      <style>{`@keyframes k-eq{from{height:3px}to{height:12px}}`}</style>
    </button>
  );
};
