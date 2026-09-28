import * as React from 'react';
import { cn } from '@/lib/cn';

/** Small primitives: Eyebrow, Avatar, Kbd, Progress, Divider, Texture. */

export const Eyebrow = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn('k-eyebrow', className)} {...props} />
);

export const Avatar = ({
  name,
  src,
  className,
}: {
  name: string;
  src?: string;
  className?: string;
}) => {
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <span className={cn('k-avatar', className)} aria-label={name} role="img">
      {src ? <img src={src} alt="" /> : initials}
    </span>
  );
};

export const Kbd = ({ children }: { children: React.ReactNode }) => (
  <kbd className="k-kbd">{children}</kbd>
);

export const Progress = ({
  value,
  label,
  className,
}: {
  value: number;
  label: string;
  className?: string;
}) => (
  <div
    className={cn('k-progress', className)}
    role="progressbar"
    aria-label={label}
    aria-valuenow={Math.round(value)}
    aria-valuemin={0}
    aria-valuemax={100}
  >
    <span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
  </div>
);

export const Divider = ({ className }: { className?: string }) => (
  <hr className={cn('k-divider', className)} />
);

/**
 * The page texture layer (grain). Render once near the root; whether it
 * shows is the design system's `texture` recipe (data-k-texture).
 */
export const Texture = () => <div className="k-texture" aria-hidden="true" />;
