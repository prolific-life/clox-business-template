import './globals.css';
import type { Metadata } from 'next';
import {
  appName,
  appDescription,
} from '@/constants/app';
import DatadogInit from '@/components/DatadogInit';

export const metadata: Metadata = {
  title: appName,
  description: appDescription,
};

type RootLayoutProps = { children: React.ReactNode };

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="en">
    <body className="bg-neutral-0 text-neutral-900 antialiased">
      <DatadogInit />
      {children}
    </body>
  </html>
);

export default RootLayout;
