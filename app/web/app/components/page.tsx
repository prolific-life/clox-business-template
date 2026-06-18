import Link from 'next/link';
import type { Metadata } from 'next';
import { componentRegistry } from '@/lib/component-registry';

export const metadata: Metadata = {
  title: 'Components',
  robots: { index: false, follow: false },
};

// /components — the sandbox gallery. Lists every registered component; each
// links to /component/<name> where it renders in isolation. Used to review +
// screenshot UI without loading the full app or logging in.
const ComponentsGallery = () => (
  <main className="mx-auto max-w-3xl px-6 py-16">
    <h1 className="font-display text-4xl font-semibold tracking-tight">
      Components
    </h1>
    <p className="mt-2 text-muted-foreground">
      Sandbox gallery — each component rendered in isolation. Open one to
      review or screenshot it (add <code>?theme=dark</code> for dark mode).
    </p>
    <ul className="mt-8 grid gap-3">
      {componentRegistry.map((c) => (
        <li key={c.name}>
          <Link
            href={`/component/${c.name}`}
            className="block rounded-lg border border-border bg-card p-4 transition-colors hover:bg-secondary"
          >
            <div className="font-medium">{c.name}</div>
            <div className="text-sm text-muted-foreground">
              {c.description}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  </main>
);

export default ComponentsGallery;
