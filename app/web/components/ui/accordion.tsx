'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';

/**
 * Accordion - FAQ-style disclosure. Large display-face questions, a
 * round +/- that inverts when open, and a height transition driven by
 * grid rows (no measuring). One item open at a time unless `multiple`.
 */

type AccordionProps = {
  items: { q: React.ReactNode; a: React.ReactNode }[];
  multiple?: boolean;
  defaultOpen?: number[];
  className?: string;
};

export const Accordion = ({
  items,
  multiple = false,
  defaultOpen = [],
  className,
}: AccordionProps) => {
  const [open, setOpen] = React.useState<number[]>(defaultOpen);
  const base = React.useId();
  const toggle = (i: number) =>
    setOpen((prev) => {
      if (prev.includes(i)) return prev.filter((x) => x !== i);
      return multiple ? [...prev, i] : [i];
    });

  return (
    <div className={cn('k-acc', className)}>
      {items.map((item, i) => {
        const isOpen = open.includes(i);
        const panelId = `${base}-p${i}`;
        return (
          <div key={i} className="k-acc__item" data-open={isOpen}>
            <button
              type="button"
              className="k-acc__trigger"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(i)}
            >
              <span>{item.q}</span>
              <span className="k-acc__icon" aria-hidden="true" />
            </button>
            <div
              id={panelId}
              role="region"
              className="k-acc__panel"
              inert={!isOpen}
            >
              <div>
                <p>{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
