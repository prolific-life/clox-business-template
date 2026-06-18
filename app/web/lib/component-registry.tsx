import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export type ComponentEntry = {
  name: string;
  description: string;
  render: () => React.ReactNode;
};

/**
 * The component gallery that drives /components and /component/[name]. ADD an
 * entry whenever you build a reusable component, so it renders in ISOLATION
 * (no app chrome, no auth) — the build screenshots these routes to review +
 * critique UI without loading the full app or logging in. See the
 * `screenshot-ui` skill. Keep each `render` self-contained (sample props).
 */
export const componentRegistry: ComponentEntry[] = [
  {
    name: 'button',
    description:
      'Action button — primary / secondary / outline / ghost / destructive',
    render: () => (
      <div className="flex flex-wrap items-center gap-3">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Delete</Button>
      </div>
    ),
  },
  {
    name: 'card',
    description: 'Surface card with header, description, and body',
    render: () => (
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>Weekly report</CardTitle>
          <CardDescription>Your numbers at a glance.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Revenue is up 12% week over week.
        </CardContent>
      </Card>
    ),
  },
  {
    name: 'input',
    description: 'Text field — default, filled, disabled',
    render: () => (
      <div className="flex w-full max-w-sm flex-col gap-3">
        <Input placeholder="you@example.com" />
        <Input defaultValue="Filled value" />
        <Input placeholder="Disabled" disabled />
      </div>
    ),
  },
  {
    name: 'badge',
    description: 'Status / label pill — default / secondary / outline / accent',
    render: () => (
      <div className="flex flex-wrap gap-2">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="accent">Accent</Badge>
      </div>
    ),
  },
];

export const getComponent = (
  name: string,
): ComponentEntry | undefined =>
  componentRegistry.find((c) => c.name === name);
