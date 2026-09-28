import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/cn';

/**
 * Badge - status and labels. `tone` sets the meaning; the shape (pill,
 * square, outline) is the design system's `badge` recipe (data-k-badge).
 * `dot` adds a leading status dot.
 *
 *   <Badge tone="success" dot>Paid</Badge>
 */

export type BadgeTone =
  | 'neutral'
  | 'primary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger';

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
  dot?: boolean;
  /** Older API: default | secondary | outline | accent. */
  variant?: 'default' | 'secondary' | 'outline' | 'accent' | null;
  asChild?: boolean;
};

const legacyTone = (variant: BadgeProps['variant']): BadgeTone => {
  if (variant === 'accent') return 'accent';
  if (variant === 'default') return 'primary';
  return 'neutral';
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { className, tone, dot, variant, asChild = false, children, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'span';
    const t = tone ?? legacyTone(variant);
    return (
      <Comp
        ref={ref}
        className={cn(
          'k-badge',
          variant === 'outline' && 'border-current bg-transparent',
          className,
        )}
        data-tone={t === 'neutral' ? undefined : t}
        {...props}
      >
        {dot && !asChild ? <span className="k-badge__dot" /> : null}
        {children}
      </Comp>
    );
  },
);
Badge.displayName = 'Badge';

/** Kept for older call sites. Prefer <Badge tone>. */
export const badgeVariants = ({
  className,
}: { variant?: BadgeProps['variant']; className?: string } = {}) =>
  cn('k-badge', className);
