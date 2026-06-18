import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { componentRegistry, getComponent } from '@/lib/component-registry';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// Pre-render every registered component so the sandbox is static + fast to
// screenshot.
export const generateStaticParams = () =>
  componentRegistry.map((c) => ({ name: c.name }));

type Props = {
  params: Promise<{ name: string }>;
  searchParams: Promise<{ theme?: string }>;
};

// /component/[name] — renders ONE component in isolation: no app chrome, no
// auth, centered on the page background. `?theme=dark` applies the dark theme
// (so the build can screenshot both modes). This is what the screenshot-ui
// skill points Playwright at.
const ComponentSandbox = async ({ params, searchParams }: Props) => {
  const { name } = await params;
  const { theme } = await searchParams;
  const entry = getComponent(name);
  if (!entry) {
    notFound();
  }
  const dark = theme === 'dark';
  return (
    <main
      className={`${dark ? 'dark ' : ''}flex min-h-dvh items-center justify-center bg-background p-10`}
    >
      <div className="w-full max-w-3xl">{entry.render()}</div>
    </main>
  );
};

export default ComponentSandbox;
