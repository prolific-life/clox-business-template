'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';

/**
 * Field primitives: Input, Textarea, Select. The look (outlined, filled,
 * underline, glass) is the design system's `input` recipe
 * (data-k-input on <html>, app/kit.css). Give every field a visible
 * label; `floating` moves the label inside the field and lifts it on
 * focus, the way most award-winning forms do.
 *
 *   <Input label="Work email" type="email" placeholder="you@studio.com" />
 *   <Input label="Search" icon={<Search />} />
 *   <Textarea label="Tell us about the project" floating />
 */

type FieldChrome = {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  /** Shows the hint as an error and marks the field invalid. */
  error?: React.ReactNode;
  floating?: boolean;
  /** Leading icon inside the field. */
  icon?: React.ReactNode;
  containerClassName?: string;
};

const useFieldIds = (id?: string) => {
  const auto = React.useId();
  const fieldId = id ?? auto;
  return { fieldId, hintId: `${fieldId}-hint` };
};

type FieldShellProps = FieldChrome & {
  fieldId: string;
  hintId: string;
  filled: boolean;
  area?: boolean;
  children: React.ReactNode;
};

const FieldShell = ({
  label,
  hint,
  error,
  floating,
  icon,
  containerClassName,
  fieldId,
  hintId,
  filled,
  area,
  children,
}: FieldShellProps) => {
  const message = error ?? hint;
  const labelEl = label ? (
    <label className="k-label" htmlFor={fieldId} data-area={area}>
      {label}
    </label>
  ) : null;
  return (
    <div
      className={cn('k-field', containerClassName)}
      data-floating={floating ? 'true' : 'false'}
      data-filled={filled ? 'true' : 'false'}
      data-invalid={error ? 'true' : 'false'}
      data-has-hint={message ? 'true' : 'false'}
    >
      {!floating && labelEl}
      <div className="k-input-wrap">
        {icon ? <span className="k-input-affix">{icon}</span> : null}
        {children}
        {floating && labelEl}
      </div>
      {message ? (
        <span className="k-hint" id={hintId}>
          {message}
        </span>
      ) : null}
    </div>
  );
};

const useFilled = (
  value: unknown,
  defaultValue: unknown,
): [boolean, (e: { target: { value: string } }) => void] => {
  const [local, setLocal] = React.useState(
    Boolean(defaultValue !== undefined && String(defaultValue).length),
  );
  const controlled = value !== undefined && value !== null;
  const filled = controlled ? String(value).length > 0 : local;
  return [filled, (e) => setLocal(e.target.value.length > 0)];
};

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  FieldChrome;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      hint,
      error,
      floating,
      icon,
      containerClassName,
      id,
      onChange,
      placeholder,
      ...props
    },
    ref,
  ) => {
    const { fieldId, hintId } = useFieldIds(id);
    const [filled, track] = useFilled(props.value, props.defaultValue);
    return (
      <FieldShell
        {...{ label, hint, error, floating, icon, containerClassName }}
        fieldId={fieldId}
        hintId={hintId}
        filled={filled}
      >
        <input
          ref={ref}
          id={fieldId}
          className={cn('k-input', className)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? hintId : undefined}
          placeholder={floating ? ' ' : placeholder}
          onChange={(e) => {
            track(e);
            onChange?.(e);
          }}
          {...props}
        />
      </FieldShell>
    );
  },
);
Input.displayName = 'Input';

export type TextareaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & FieldChrome;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      hint,
      error,
      floating,
      containerClassName,
      id,
      onChange,
      placeholder,
      rows = 4,
      ...props
    },
    ref,
  ) => {
    const { fieldId, hintId } = useFieldIds(id);
    const [filled, track] = useFilled(props.value, props.defaultValue);
    return (
      <FieldShell
        {...{ label, hint, error, floating, containerClassName }}
        fieldId={fieldId}
        hintId={hintId}
        filled={filled}
        area
      >
        <textarea
          ref={ref}
          id={fieldId}
          rows={rows}
          className={cn('k-input', className)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? hintId : undefined}
          placeholder={floating ? ' ' : placeholder}
          onChange={(e) => {
            track(e);
            onChange?.(e);
          }}
          {...props}
        />
      </FieldShell>
    );
  },
);
Textarea.displayName = 'Textarea';

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> &
  Omit<FieldChrome, 'floating'> & {
    options: { value: string; label: string }[];
  };

/** Native select, styled: keyboard, screen readers and mobile pickers work. */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      hint,
      error,
      icon,
      containerClassName,
      id,
      options,
      ...props
    },
    ref,
  ) => {
    const { fieldId, hintId } = useFieldIds(id);
    return (
      <FieldShell
        {...{ label, hint, error, icon, containerClassName }}
        fieldId={fieldId}
        hintId={hintId}
        filled
      >
        <select
          ref={ref}
          id={fieldId}
          className={cn('k-input', className)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? hintId : undefined}
          {...props}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </FieldShell>
    );
  },
);
Select.displayName = 'Select';
