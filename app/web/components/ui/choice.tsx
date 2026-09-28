'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';

/**
 * Checkbox, Radio and Switch. Real <input>s (keyboard, forms and screen
 * readers work for free), drawn by app/kit.css. The checkbox corner and
 * switch shape follow the design system's recipes (data-k-check,
 * data-k-switch).
 *
 *   <Checkbox label="Remember me" defaultChecked />
 *   <Switch label="Email me a weekly summary" hint="Every Monday" />
 *   <RadioGroup name="plan" options={[...]} defaultValue="pro" />
 */

type ChoiceProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  containerClassName?: string;
};

const Choice = React.forwardRef<
  HTMLInputElement,
  ChoiceProps & { kind: 'checkbox' | 'radio' | 'switch' }
>(({ kind, label, hint, className, containerClassName, ...props }, ref) => {
  const input = (
    <input
      ref={ref}
      type={kind === 'radio' ? 'radio' : 'checkbox'}
      role={kind === 'switch' ? 'switch' : undefined}
      className={cn(
        kind === 'checkbox' ? 'k-check' : kind === 'radio' ? 'k-radio' : 'k-switch',
        className,
      )}
      {...props}
    />
  );
  if (!label) return input;
  return (
    <label
      className={cn(
        'k-choice',
        kind === 'switch' && 'w-full justify-between flex-row-reverse',
        containerClassName,
      )}
    >
      {input}
      <span className="k-choice__text">
        <span>{label}</span>
        {hint ? <span className="k-choice__hint">{hint}</span> : null}
      </span>
    </label>
  );
});
Choice.displayName = 'Choice';

export const Checkbox = React.forwardRef<HTMLInputElement, ChoiceProps>(
  (props, ref) => <Choice ref={ref} kind="checkbox" {...props} />,
);
Checkbox.displayName = 'Checkbox';

export const Radio = React.forwardRef<HTMLInputElement, ChoiceProps>(
  (props, ref) => <Choice ref={ref} kind="radio" {...props} />,
);
Radio.displayName = 'Radio';

export const Switch = React.forwardRef<HTMLInputElement, ChoiceProps>(
  (props, ref) => <Choice ref={ref} kind="switch" {...props} />,
);
Switch.displayName = 'Switch';

type RadioGroupProps = {
  name: string;
  options: { value: string; label: React.ReactNode; hint?: React.ReactNode }[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  'aria-label'?: string;
};

export const RadioGroup = ({
  name,
  options,
  defaultValue,
  value,
  onValueChange,
  className,
  ...aria
}: RadioGroupProps) => (
  <div role="radiogroup" className={cn('grid gap-3', className)} {...aria}>
    {options.map((o) => (
      <Radio
        key={o.value}
        name={name}
        value={o.value}
        label={o.label}
        hint={o.hint}
        defaultChecked={value === undefined ? o.value === defaultValue : undefined}
        checked={value === undefined ? undefined : value === o.value}
        onChange={() => onValueChange?.(o.value)}
      />
    ))}
  </div>
);
