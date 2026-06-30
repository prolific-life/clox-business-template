import './globals.css';
import type { Metadata } from 'next';
import { Fraunces, Hanken_Grotesk, JetBrains_Mono } from 'next/font/google';
import { appName, appDescription, appLogoPath } from '@/constants/app';
import DatadogInit from '@/components/DatadogInit';

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
  <html
    lang="en"
    className={`${display.variable} ${sans.variable} ${mono.variable}`}
  >
    <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
      {/* DO NOT REMOVE - boots Datadog RUM, which powers the Clox
          "Data & Analytics" tab (/app/business/<id>/data). See
          lib/datadog.ts + components/DatadogInit.tsx; guarded by
          __tests__/analytics-instrumentation.test.tsx. */}
      <DatadogInit />
      {children}
    </body>
  </html>
);

export default RootLayout;
