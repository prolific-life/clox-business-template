import './globals.css';
import './kit.css';
import type { Metadata } from 'next';
import { Fraunces, Hanken_Grotesk, JetBrains_Mono } from 'next/font/google';
import { appName, appDescription, appLogoPath } from '@/constants/app';
import DatadogInit from '@/components/DatadogInit';
import { Texture } from '@/components/ui/misc';
import { designAttributes } from '@/constants/design.config';

// Real type pairing, LOADED (never the system font). Rebrand per business
// by swapping these faces + the fallbacks in constants/branding/typography.ts
// in the same commit. See the Design Law in CLAUDE.md.
const display = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

const sans = Hanken_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

// Widen from the literal '' type pre-approval so .replace is callable
// (the v9 materializer rewrites appLogoPath to a real path).
const logoPath: string = appLogoPath;

export const metadata: Metadata = {
  title: appName,
  description: appDescription,
  // Favicon = the business's own logo (seeded at approval). Without
  // this the browser tab falls back to the Vercel default mark.
  ...(logoPath
    ? { icons: { icon: `/${logoPath.replace(/^\//, '')}` } }
    : {}),
};

type RootLayoutProps = { children: React.ReactNode };

const RootLayout = ({ children }: RootLayoutProps) => (
  // data-k-* attributes pick the prebuilt kit's recipes (buttons, fields,
  // cards, nav, texture...). Change them in constants/design.config.ts.
  <html
    lang="en"
    className={`${display.variable} ${sans.variable} ${mono.variable}`}
    {...designAttributes()}
  >
    <body className="k-root min-h-dvh bg-background font-sans text-foreground antialiased">
      {/* DO NOT REMOVE - boots Datadog RUM, which powers the Clox
          "Data & Analytics" tab (/app/business/<id>/data). See
          lib/datadog.ts + components/DatadogInit.tsx; guarded by
          __tests__/analytics-instrumentation.test.tsx. */}
      <DatadogInit />
      {children}
      <Texture />
    </body>
  </html>
);

export default RootLayout;
