'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';

/**
 * Button - the kit's one action primitive.
 *
 * The hover mechanic (label roll, fill wipe, glass sweep, ...) is NOT a
 * prop: it is the design system's `button` recipe (design.config.ts ->
 * data-k-button on <html>, styled in app/kit.css), so every button in the
 * product moves the same way. Pick a variant for emphasis, a size for
 * density, and an optional trailing icon.
 *
 *   <Button>Start free</Button>
 *   <Button variant="outline" icon={<ArrowUpRight />}>See pricing</Button>
 *   <Button asChild><a href="/signup">Sign up</a></Button>
 */

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'inverse'
  | 'destructive'
  | 'link';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant | null;
  size?: ButtonSize | null;
  /** Trailing icon. Recipes animate it on hover. */
  icon?: React.ReactNode;
  /** Render the single child element (a link) as the button. */
  asChild?: boolean;
};

/** The label, twice, so recipes can roll between the copies. */
const Label = ({ children }: { children: React.ReactNode }) => (
  <span className="k-btn__label">
    <span>{children}</span>
    <span aria-hidden="true">{children}</span>
  </span>
);

const inner = (
  children: React.ReactNode,
  icon: React.ReactNode,
  size: ButtonSize,
) => {
  if (size === 'icon') {
    return <span className="k-btn__icon">{icon ?? children}</span>;
  }
  return (
    <>
      <Label>{children}</Label>
      {icon ? <span className="k-btn__icon">{icon}</span> : null}
    </>
  );
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      icon,
      asChild = false,
      children,
      type,
      ...props
    },
    ref,
  ) => {
    const v = variant ?? 'primary';
    const s = size ?? 'md';
    const shared = {
      className: cn('k-btn', className),
      'data-variant': v,
      'data-size': s,
    };
    if (asChild && React.isValidElement<{
      className?: string;
      children?: React.ReactNode;
    }>(children)) {
      return React.cloneElement(children, {
        ...props,
        ...shared,
        className: cn('k-btn', className, children.props.className),
        children: inner(children.props.children, icon, s),
      });
    }
    return (
      <button ref={ref} type={type ?? 'button'} {...props} {...shared}>
        {inner(children, icon, s)}
      </button>
    );
  },
);
Button.displayName = 'Button';

/**
 * Kept for older call sites that styled a link with
 * className={buttonVariants()}. Prefer <Button asChild>.
 */
export const buttonVariants = ({
  className,
}: {
  variant?: ButtonVariant | null;
  size?: ButtonSize | null;
  className?: string;
} = {}) => cn('k-btn', className);
