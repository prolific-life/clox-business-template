'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

/**
 * Tabs - a tablist whose indicator glides between tabs. Underline, pill
 * or segmented is the design system's `tabs` recipe (data-k-tabs).
 * Controlled or uncontrolled; render the panel yourself from `value`.
 *
 *   const [tab, setTab] = useState('week');
 *   <Tabs items={[{ value: 'week', label: 'This week' }, ...]}
 *         value={tab} onValueChange={setTab} />
 */

type TabsProps = {
  items: { value: string; label: React.ReactNode }[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  'aria-label'?: string;
};

export const Tabs = ({
  items,
  value,
  defaultValue,
  onValueChange,
  className,
  ...aria
}: TabsProps) => {
  const [local, setLocal] = React.useState(defaultValue ?? items[0]?.value);
  const current = value ?? local;
  const group = React.useId();
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const select = (v: string) => {
    setLocal(v);
    onValueChange?.(v);
  };

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (i + step + items.length) % items.length;
    refs.current[next]?.focus();
    select(items[next].value);
  };

  return (
    <div role="tablist" className={cn('k-tabs', className)} {...aria}>
      {items.map((item, i) => {
        const selected = item.value === current;
        return (
          <button
            key={item.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            type="button"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            className="k-tab"
            onClick={() => select(item.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {selected ? (
              <motion.span
                layoutId={`k-tab-${group}`}
                className="k-tab__ind"
                transition={{ type: 'spring', stiffness: 420, damping: 36 }}
              />
            ) : null}
            {item.label}
          </button>
        );
      })}
    </div>
  );
};
