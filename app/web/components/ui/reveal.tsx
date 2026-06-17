'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type RevealProps = {
  children: React.ReactNode;
  /** Stagger sibling reveals by passing an increasing delay (seconds). */
  delay?: number;
  className?: string;
};

/**
 * Scroll-into-view entrance — the default "purposeful motion" primitive.
 * Honors prefers-reduced-motion (renders static, no animation). Wrap
 * sections, cards, or hero content; stagger with `delay`.
 */
export const Reveal = ({ children, delay = 0, className }: RevealProps) => {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
};
