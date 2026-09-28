'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Dialog - a centered modal over a blurred backdrop. Escape and a
 * backdrop click close it, focus moves in on open and back on close.
 *
 *   <Dialog open={open} onClose={() => setOpen(false)} title="Invite">
 *     ...
 *   </Dialog>
 */

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
};

export const Dialog = ({
  open,
  onClose,
  title,
  description,
  children,
}: DialogProps) => {
  const panel = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [open, onClose]);

  if (!mounted) return null;
  // Portal into the themed root when there is one, so the dialog keeps
  // the design system's tokens and recipes.
  const host =
    document.querySelector<HTMLElement>('[data-k-portal]') ?? document.body;
  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="k-dialog-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className="k-dialog outline-none"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 id={titleId} className="k-h4">
              {title}
            </h2>
            {description ? (
              <p className="k-body mt-2 text-sm">{description}</p>
            ) : null}
            {children ? <div className="mt-6">{children}</div> : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    host,
  );
};
