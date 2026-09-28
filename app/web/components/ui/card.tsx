import * as React from 'react';
import { cn } from '@/lib/cn';

/**
 * Card - the kit's surface. Flat, outlined, elevated, glass or inset is
 * the design system's `card` recipe (data-k-card, app/kit.css).
 * `interactive` adds the lift-on-hover used for clickable tiles; `pad`
 * gives the standard fluid padding when you are not using the
 * Header/Content/Footer slots.
 */

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
  pad?: boolean;
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive, pad, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('k-card', className)}
      data-interactive={interactive ? 'true' : undefined}
      data-pad={pad ? 'true' : undefined}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col gap-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn('k-h4', className)} {...props} />
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm leading-relaxed text-muted-foreground', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';
