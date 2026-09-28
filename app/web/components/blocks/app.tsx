'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';
import { Avatar } from '@/components/ui/misc';
import { Badge, type BadgeTone } from '@/components/ui/badge';
import { Sparkline } from '@/components/ui/charts';

/**
 * Signed-in app blocks: AppShell (sidebar or top bar, from the design
 * system's navigation pattern), PageHeader, StatCard, DataTable and
 * ActivityFeed. Product surfaces are calm: hairlines, one accent,
 * tabular numbers, no decoration competing with the data.
 */

export type NavItem = {
  label: string;
  icon?: React.ReactNode;
  href?: string;
  active?: boolean;
  onSelect?: () => void;
};

export const AppShell = ({
  layout,
  brand,
  nav,
  user,
  search,
  actions,
  children,
}: {
  layout: 'sidebar' | 'topbar';
  brand: React.ReactNode;
  nav: NavItem[];
  user: { name: string; email: string };
  search?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) => {
  const item = (n: NavItem, compact = false) => (
    <a
      key={n.label}
      href={n.href ?? '#'}
      onClick={(e) => {
        if (n.onSelect) {
          e.preventDefault();
          n.onSelect();
        }
      }}
      aria-current={n.active ? 'page' : undefined}
      className={cn(
        'flex items-center gap-3 rounded-[var(--k-radius-md)] text-[0.9rem] no-underline transition-colors duration-300',
        compact ? 'px-3 py-2' : 'px-3 py-2.5',
        n.active
          ? 'bg-foreground/[0.07] font-medium text-foreground'
          : 'text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground',
      )}
    >
      {n.icon ? <span className="flex h-[18px] w-[18px] items-center justify-center [&>svg]:h-[18px] [&>svg]:w-[18px]">{n.icon}</span> : null}
      {n.label}
    </a>
  );

  if (layout === 'topbar') {
    return (
      <div className="min-h-[100svh]">
        <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-6 px-[var(--k-gutter)]">
            <div className="flex-none">{brand}</div>
            <nav className="hidden items-center gap-1 lg:flex" aria-label="App">
              {nav.map((n) => item(n, true))}
            </nav>
            <div className="ml-auto flex items-center gap-3">
              {search ? <div className="hidden w-64 md:block">{search}</div> : null}
              {actions}
              <Avatar name={user.name} />
            </div>
          </div>
        </header>
        <main className="px-[var(--k-gutter)] py-8">{children}</main>
      </div>
    );
  }

  return (
    <div className="grid min-h-[100svh] lg:grid-cols-[264px_1fr]">
      <aside className="sticky top-0 hidden h-[100svh] flex-col border-r border-border bg-card/40 p-4 lg:flex">
        <div className="px-2 py-3">{brand}</div>
        <nav className="mt-6 grid gap-1" aria-label="App">
          {nav.map((n) => item(n))}
        </nav>
        <div className="mt-auto flex items-center gap-3 rounded-[var(--k-radius-md)] border border-border p-3">
          <Avatar name={user.name} />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{user.name}</div>
            <div className="truncate text-xs text-muted-foreground">{user.email}</div>
          </div>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-[var(--k-gutter)] backdrop-blur-xl">
          <div className="lg:hidden">{brand}</div>
          {search ? <div className="hidden w-80 md:block">{search}</div> : null}
          <div className="ml-auto flex items-center gap-3">{actions}</div>
        </header>
        <main className="px-[var(--k-gutter)] py-8">{children}</main>
      </div>
    </div>
  );
};

export const PageHeader = ({
  title,
  sub,
  actions,
}: {
  title: string;
  sub?: string;
  actions?: React.ReactNode;
}) => (
  <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 className="k-h3">{title}</h1>
      {sub ? <p className="k-body mt-2 text-[0.95rem]">{sub}</p> : null}
    </div>
    {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
  </div>
);

export const StatCard = ({
  label,
  value,
  delta,
  up,
  trend,
}: {
  label: string;
  value: string;
  delta: string;
  up: boolean;
  trend: number[];
}) => (
  <div className="k-card p-5">
    <div className="flex items-start justify-between gap-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <Badge tone={up ? 'success' : 'danger'}>
        {up ? '↑' : '↓'} {delta.replace(/^[+-]/, '')}
      </Badge>
    </div>
    <div className="mt-4 flex items-end justify-between gap-3">
      <span
        className="k-tabular"
        style={{
          fontFamily: 'var(--k-font-display)',
          fontWeight: 'var(--k-display-weight)',
          fontSize: 'clamp(1.75rem, 1.4rem + 1vw, 2.375rem)',
          letterSpacing: '-0.035em',
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      <Sparkline points={trend} up={up} />
    </div>
  </div>
);

export const DataTable = ({
  columns,
  rows,
  statusCol,
  toneFor,
  caption,
}: {
  columns: string[];
  rows: string[][];
  statusCol?: number;
  toneFor?: (status: string) => BadgeTone;
  caption: string;
}) => (
  <div className="overflow-x-auto">
    <table className="k-table">
      <caption className="sr-only">{caption}</caption>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c} scope="col">
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, ri) => (
          <tr key={ri}>
            {r.map((cell, ci) => (
              <td key={ci} className={ci === 0 ? 'font-medium' : 'text-muted-foreground'}>
                {ci === statusCol ? (
                  <Badge tone={toneFor?.(cell) ?? 'neutral'} dot>
                    {cell}
                  </Badge>
                ) : (
                  cell
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const ActivityFeed = ({
  items,
}: {
  items: { who: string; what: string; when: string }[];
}) => (
  <ol className="relative m-0 grid gap-5 p-0">
    {items.map((a, i) => (
      <li key={i} className="flex list-none gap-3">
        <Avatar name={a.who} className="!h-8 !w-8 !text-[0.7rem]" />
        <div className="min-w-0 text-sm">
          <p className="m-0 leading-snug">
            <span className="font-medium">{a.who}</span>{' '}
            <span className="text-muted-foreground">{a.what}</span>
          </p>
          <p className="k-mono m-0 mt-1 text-[0.7rem] text-muted-foreground">{a.when}</p>
        </div>
      </li>
    ))}
  </ol>
);
