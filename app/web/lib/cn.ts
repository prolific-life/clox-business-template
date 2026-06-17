import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind class names, resolving conflicts so the last wins
 * (e.g. cn('px-2', cond && 'px-4') → 'px-4'). The standard utility every
 * components/ui primitive uses to accept a `className` override.
 */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
