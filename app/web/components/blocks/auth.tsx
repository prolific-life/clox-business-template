'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { HeroVideo } from '@/components/ui/media';
import type { HeroMedia } from './marketing';

/**
 * AuthSplit - the sign-in / sign-up layout: the form on one side, the
 * brand's generated media and a customer quote on the other. Put the
 * form (Input, Checkbox, Button from the kit) in `children`.
 */
export const AuthSplit = ({
  brand,
  title,
  sub,
  media,
  quote,
  quoteBy,
  children,
  footer,
}: {
  brand: React.ReactNode;
  title: string;
  sub: string;
  media: HeroMedia;
  quote?: string;
  quoteBy?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) => (
  <div className="grid min-h-[100svh] lg:grid-cols-2">
    <div className="flex flex-col px-[var(--k-gutter)] py-8">
      <div className="flex items-center justify-between">{brand}</div>
      <motion.div
        className="mx-auto my-auto w-full max-w-[420px] py-16"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      >
        <h1 className="k-h2">{title}</h1>
        <p className="k-body mt-3">{sub}</p>
        <div className="mt-10">{children}</div>
      </motion.div>
      {footer ? <div className="text-xs text-muted-foreground">{footer}</div> : null}
    </div>
    <div className="relative hidden p-3 lg:block">
      <motion.div
        className="k-media relative h-full"
        style={{ borderRadius: 'var(--k-radius-xl)' }}
        initial={{ clipPath: 'inset(0 0 0 100% round 32px)' }}
        animate={{ clipPath: 'inset(0 0 0 0% round 32px)' }}
        transition={{ duration: 1.4, ease: [0.87, 0, 0.13, 1] }}
      >
        {media.video && media.poster ? (
          <HeroVideo src={media.video} webm={media.webm} poster={media.poster} />
        ) : media.image ? (
          <img src={media.image} alt="" className="h-full w-full object-cover" />
        ) : null}
        {quote ? (
          <motion.figure
            className="absolute inset-x-6 bottom-6 m-0 rounded-[var(--k-radius-lg)] p-6"
            style={{
              background: 'var(--k-glass-bg)',
              border: '1px solid var(--k-glass-border)',
              backdropFilter: 'blur(var(--k-glass-blur)) saturate(1.6)',
              WebkitBackdropFilter: 'blur(var(--k-glass-blur)) saturate(1.6)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
          >
            <blockquote
              className="m-0 text-balance"
              style={{
                fontFamily: 'var(--k-font-display)',
                fontSize: 'clamp(1.25rem, 1rem + 0.8vw, 1.75rem)',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}
            >
              &ldquo;{quote}&rdquo;
            </blockquote>
            {quoteBy ? (
              <figcaption className="k-eyebrow mt-4 before:hidden">{quoteBy}</figcaption>
            ) : null}
          </motion.figure>
        ) : null}
      </motion.div>
    </div>
  </div>
);

/** "or" rule between social sign-in and the email form. */
export const OrDivider = ({ label = 'or' }: { label?: string }) => (
  <div className="my-6 flex items-center gap-4 text-xs text-muted-foreground">
    <span className="h-px flex-1 bg-border" />
    {label}
    <span className="h-px flex-1 bg-border" />
  </div>
);
