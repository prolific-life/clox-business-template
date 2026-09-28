'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Toasts - short confirmations in the corner. Wrap the app (or a page)
 * in <ToastProvider> and call toast('Saved') from useToast().
 */

type Toast = { id: number; title: string; body?: string };

const ToastContext = React.createContext<{
  toast: (title: string, body?: string) => void;
}>({ toast: () => {} });

export const useToast = () => React.useContext(ToastContext);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const toast = React.useCallback((title: string, body?: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, title, body }]);
    window.setTimeout(
      () => setToasts((t) => t.filter((x) => x.id !== id)),
      3800,
    );
  }, []);
  const value = React.useMemo(() => ({ toast }), [toast]);
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="k-toast-region" role="status" aria-live="polite">
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              className="k-toast"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="mt-px flex-none"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <div>
                <div className="font-medium">{t.title}</div>
                {t.body ? <div className="opacity-70">{t.body}</div> : null}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
