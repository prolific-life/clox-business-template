import './globals.css';
import type { Metadata } from 'next';
import { Fraunces, Hanken_Grotesk, JetBrains_Mono } from 'next/font/google';
import { appName, appDescription } from '@/constants/app';
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

export const metadata: Metadata = {
  title: appName,
  description: appDescription,
};

type RootLayoutProps = { children: React.ReactNode };

const RootLayout = ({ children }: RootLayoutProps) => (
  <html
    lang="en"
    className={`${display.variable} ${sans.variable} ${mono.variable}`}
  >
    <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
      <DatadogInit />
      {children}
    </body>
  </html>
);

export default RootLayout;
