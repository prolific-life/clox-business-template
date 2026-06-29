import { appTagline, appDescription } from '@/constants/app';
import { Logo } from '@/components/ui';

const Page = () => (
  <main className="min-h-screen flex items-center justify-center px-6">
    <div className="max-w-xl text-center space-y-4">
      <h1 className="flex justify-center">
        <Logo imgClassName="h-14" wordmarkClassName="text-4xl font-bold" />
      </h1>
      <p className="text-lg text-neutral-600">{appTagline}</p>
      <p className="text-sm text-neutral-500">
        {appDescription}
      </p>
      <div className="pt-6">
        <a
          href="/login"
          className="inline-flex items-center justify-center rounded-md border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-100"
        >
          Sign in
        </a>
      </div>
      <p className="text-xs text-neutral-400 pt-8">
        Edit{' '}
        <code className="font-mono">constants/app.ts</code>{' '}
        at the template root to change this page.
      </p>
    </div>
  </main>
);

export default Page;
