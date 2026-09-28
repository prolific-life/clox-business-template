import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Input, Select, Textarea } from '@/components/ui/input';
import { Checkbox, RadioGroup, Switch } from '@/components/ui/choice';
import { Tabs } from '@/components/ui/tabs';
import { Accordion } from '@/components/ui/accordion';
import { AreaChart, Donut } from '@/components/ui/charts';
import { Counter, Marquee, SplitText } from '@/components/ui/reveal';
import { DataTable, StatCard } from '@/components/blocks/app';
import { Faq, Pricing } from '@/components/blocks/marketing';
import { Badge } from '@/components/ui/badge';
import { Reveal } from '@/components/ui/reveal';
import { Logo } from '@/components/ui/logo';

export type ComponentEntry = {
  name: string;
  description: string;
  render: () => React.ReactNode;
};

/**
 * The component gallery that drives /components and /component/[name]. ADD an
 * entry whenever you build a reusable component, so it renders in ISOLATION
 * (no app chrome, no auth) - the build screenshots these routes to review +
 * critique UI without loading the full app or logging in. See the
 * `screenshot-ui` skill. Keep each `render` self-contained (sample props).
 */
export const componentRegistry: ComponentEntry[] = [
  {
    name: 'button',
    description:
      'Action button - primary / secondary / outline / ghost / destructive',
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
    description: 'Text field - label, floating label, error, disabled',
    render: () => (
      <div className="flex w-full max-w-sm flex-col gap-3">
        <Input label="Email" placeholder="you@example.com" />
        <Input label="Name" floating />
        <Input label="Email" defaultValue="nope" error="Enter an email like name@company.com." />
        <Input label="Plan" placeholder="Disabled" disabled />
      </div>
    ),
  },
  {
    name: 'badge',
    description: 'Status / label - tones neutral, primary, success, warning, danger, accent',
    render: () => (
      <div className="flex flex-wrap gap-2">
        <Badge>Neutral</Badge>
        <Badge tone="primary">Primary</Badge>
        <Badge tone="success" dot>
          Paid
        </Badge>
        <Badge tone="warning" dot>
          Pending
        </Badge>
        <Badge tone="danger" dot>
          Overdue
        </Badge>
        <Badge tone="accent">New</Badge>
      </div>
    ),
  },
  {
    name: 'reveal',
    description:
      'Scroll-into-view entrance primitive - honors prefers-reduced-motion',
    render: () => (
      <div className="flex flex-col gap-3">
        <Reveal>
          <Card className="max-w-sm">
            <CardHeader>
              <CardTitle>Revealed on scroll</CardTitle>
              <CardDescription>Stagger siblings with delay.</CardDescription>
            </CardHeader>
          </Card>
        </Reveal>
        <Reveal delay={0.1}>
          <Card className="max-w-sm">
            <CardHeader>
              <CardTitle>Second card</CardTitle>
              <CardDescription>Enters just after the first.</CardDescription>
            </CardHeader>
          </Card>
        </Reveal>
      </div>
    ),
  },
  {
    name: 'logo',
    description:
      'The business mark - approval-seeded image, falls back to the wordmark',
    render: () => (
      <div className="flex flex-col items-start gap-4">
        <Logo />
        <Logo showWordmark={false} />
      </div>
    ),
  },
  {
    name: 'fields',
    description: 'Textarea + Select, styled by the input recipe',
    render: () => (
      <div className="grid w-full max-w-md gap-5">
        <Select
          label="Plan"
          defaultValue="team"
          options={[
            { value: 'solo', label: 'Solo' },
            { value: 'team', label: 'Team' },
          ]}
        />
        <Textarea label="Message" placeholder="Tell us about the project" hint="We reply within a day." />
      </div>
    ),
  },
  {
    name: 'choices',
    description: 'Checkbox, RadioGroup and Switch',
    render: () => (
      <div className="grid w-full max-w-md gap-5">
        <Checkbox label="Email me updates" defaultChecked />
        <RadioGroup
          name="freq"
          aria-label="How often"
          defaultValue="weekly"
          options={[
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' },
          ]}
        />
        <Switch label="Notifications" hint="Only for things that need you" defaultChecked />
      </div>
    ),
  },
  {
    name: 'tabs',
    description: 'Tabs with a gliding indicator (underline / pill / segmented recipe)',
    render: () => (
      <Tabs
        aria-label="Range"
        items={[
          { value: 'week', label: 'This week' },
          { value: 'month', label: 'This month' },
          { value: 'year', label: 'This year' },
        ]}
      />
    ),
  },
  {
    name: 'accordion',
    description: 'FAQ disclosure',
    render: () => (
      <Accordion
        defaultOpen={[0]}
        items={[
          { q: 'Can I change plans later?', a: 'Yes, any time.' },
          { q: 'Is there a free trial?', a: 'Fourteen days, no card needed.' },
        ]}
      />
    ),
  },
  {
    name: 'split-text',
    description: 'Masked word reveal for headlines, with an emphasis word',
    render: () => (
      <SplitText as="h1" immediate className="k-h1" text="Make every evening count" emphasis="count" />
    ),
  },
  {
    name: 'marquee',
    description: 'Infinite logo / word marquee',
    render: () => (
      <Marquee seconds={20}>
        {['Northwind', 'Halvern', 'Pinegrove', 'Cassia', 'Marrow'].map((n) => (
          <span key={n} className="k-h3">
            {n}
          </span>
        ))}
      </Marquee>
    ),
  },
  {
    name: 'stat',
    description: 'StatCard + counting number',
    render: () => (
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Revenue" value="$48,210" delta="+12.4%" up trend={[3, 4, 4, 6, 5, 7, 8, 9]} />
        <div className="k-card p-5">
          <Counter className="k-stat" value={98} suffix="%" />
        </div>
      </div>
    ),
  },
  {
    name: 'charts',
    description: 'AreaChart + Donut, theme colored, draw in on view',
    render: () => (
      <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
        <div className="k-card p-5">
          <AreaChart
            summary="Signups over twelve weeks"
            labels={['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12']}
            series={[{ name: 'Signups', points: [4, 6, 5, 8, 9, 8, 11, 13, 12, 15, 17, 19] }]}
          />
        </div>
        <div className="k-card grid place-items-center p-5">
          <Donut value={72} label="Goal" />
        </div>
      </div>
    ),
  },
  {
    name: 'data-table',
    description: 'DataTable with status badges (table recipe)',
    render: () => (
      <DataTable
        caption="Orders"
        columns={['Order', 'Customer', 'Status', 'Total']}
        rows={[
          ['#1042', 'Maya Okafor', 'Paid', '$240'],
          ['#1041', 'Leo Brandt', 'Pending', '$85'],
          ['#1040', 'Ana Ruiz', 'Paid', '$1,120'],
        ]}
        statusCol={2}
      />
    ),
  },
  {
    name: 'pricing',
    description: 'Pricing block with yearly switch and an inverted featured plan',
    render: () => (
      <Pricing
        title="Pick a plan"
        ctaHref="#"
        plans={[
          { name: 'Solo', price: 12, period: '/mo', blurb: 'For one person.', features: ['One workspace', 'Email support'], cta: 'Start free' },
          { name: 'Team', price: 29, period: '/mo', blurb: 'For small teams.', features: ['Five seats', 'Priority support'], cta: 'Start free', featured: true },
          { name: 'Business', price: 79, period: '/mo', blurb: 'For growing companies.', features: ['Unlimited seats', 'A named contact'], cta: 'Talk to us' },
        ]}
      />
    ),
  },
  {
    name: 'faq',
    description: 'FAQ block',
    render: () => (
      <Faq
        title="Good to know"
        items={[
          { q: 'How long does setup take?', a: 'About five minutes.' },
          { q: 'Can I cancel any time?', a: 'Yes, from settings, in one click.' },
        ]}
      />
    ),
  },
];

export const getComponent = (
  name: string,
): ComponentEntry | undefined =>
  componentRegistry.find((c) => c.name === name);
