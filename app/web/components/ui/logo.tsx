import { cn } from '@/lib/cn';
import { appName, appLogoPath } from '@/constants/app';

type LogoProps = {
  /** Extra classes on the wrapper. */
  className?: string;
  /** Extra classes on the logo image. */
  imgClassName?: string;
  /** Extra classes on the wordmark text. */
  wordmarkClassName?: string;
  /** Render the `appName` wordmark next to/instead of the image. */
  showWordmark?: boolean;
};

/**
 * The single source of truth for the business mark. Renders the
 * approval-seeded logo (`appLogoPath` in constants/app.ts → served from
 * app/web/public) when present, falling back to the `appName` wordmark in
 * the display font. EVERY surface — landing, login, the logged-in app —
 * must use this so the brand is identical everywhere; never hand-render a
 * header from `appName` text or hardcode a logo path.
 */
export const Logo = ({
  className,
  imgClassName,
  wordmarkClassName,
  showWordmark = true,
}: LogoProps) => {
  // Widen from the literal '' type the constant carries pre-approval, so
  // .replace is callable (the materializer rewrites it to a real path).
  const logoPath: string = appLogoPath;
  const src = logoPath ? `/${logoPath.replace(/^\//, '')}` : '';
  // Nothing to draw (no image AND wordmark suppressed) → render nothing,
  // so callers' wrappers don't leave an empty gap.
  if (!src && !showWordmark) {
    return null;
  }
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`${appName} logo`}
          className={cn('h-8 w-auto', imgClassName)}
        />
      ) : null}
      {showWordmark ? (
        <span
          className={cn(
            'font-display text-lg font-semibold tracking-tight',
            wordmarkClassName,
          )}
        >
          {appName}
        </span>
      ) : null}
    </span>
  );
};
