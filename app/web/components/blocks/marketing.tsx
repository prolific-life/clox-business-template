'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion } from '@/components/ui/accordion';
import { HeroVideo, SoundToggle } from '@/components/ui/media';
import {
  Counter,
  Marquee,
  MediaReveal,
  Reveal,
  SplitText,
} from '@/components/ui/reveal';
import { Switch } from '@/components/ui/choice';

/**
 * Marketing blocks: whole homepage sections, composed from the kit.
 * Build a landing page by stacking these with your own copy and media:
 *
 *   <SiteNav ... /> <Hero ... /> <LogoMarquee ... /> <FeatureGrid ... />
 *   <Showcase ... /> <Stats ... /> <Testimonials ... /> <Pricing ... />
 *   <Faq ... /> <CtaBand ... /> <SiteFooter ... />
 *
 * Every block reads the design system's recipes, so the same page reads
 * as a different product under a different system.
 */

const ArrowIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

export type Link = { label: string; href: string };
export type HeroMedia = {
  video?: string;
  webm?: string;
  poster?: string;
  image?: string;
  sound?: string;
};

/* ------------------------------------------------------------------ */

export const SiteNav = ({
  brand,
  links,
  cta,
  secondary,
}: {
  brand: React.ReactNode;
  links: Link[];
  cta: Link;
  secondary?: Link;
}) => {
  const [scrolled, setScrolled] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      setHidden(y > 240 && y > last);
      last = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <>
      <header
        className="k-nav"
        data-scrolled={scrolled || undefined}
        data-hidden={hidden && !open ? 'true' : undefined}
      >
        <div className="k-container">
          <div className="k-nav__inner">
            <a
              href={links[0]?.href.startsWith('#') ? '#top' : '/'}
              className="flex items-center gap-2 font-medium text-foreground no-underline"
              style={{ fontFamily: 'var(--k-font-display)', fontSize: '1.2rem', letterSpacing: '-0.03em' }}
            >
              {brand}
            </a>
            <nav className="k-nav__links hidden md:flex" aria-label="Main">
              {links.map((l) => (
                <a key={l.href} href={l.href} className="k-nav__link">
                  {l.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              {secondary ? (
                <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
                  <a href={secondary.href}>{secondary.label}</a>
                </Button>
              ) : null}
              <Button asChild size="sm" className="hidden sm:inline-flex">
                <a href={cta.href}>{cta.label}</a>
              </Button>
              <button
                type="button"
                className="k-btn md:hidden"
                data-variant="ghost"
                data-size="icon"
                aria-expanded={open}
                aria-label={open ? 'Close menu' : 'Open menu'}
                onClick={() => setOpen(!open)}
              >
                <span className="relative block h-3 w-5" aria-hidden="true">
                  <span
                    className="absolute left-0 right-0 h-[1.5px] bg-current transition-transform duration-500"
                    style={{ top: open ? 5 : 0, transform: open ? 'rotate(45deg)' : 'none' }}
                  />
                  <span
                    className="absolute left-0 right-0 h-[1.5px] bg-current transition-transform duration-500"
                    style={{ top: open ? 5 : 10, transform: open ? 'rotate(-45deg)' : 'none' }}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {open ? (
          <motion.div
            className="k-menu md:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.8, ease: [0.87, 0, 0.13, 1] }}
          >
            {[...links, cta].map((l, i) => (
              <motion.a
                key={l.href + i}
                href={l.href}
                onClick={() => setOpen(false)}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 + i * 0.06, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                {l.label}
              </motion.a>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};

/* ------------------------------------------------------------------ */

type HeroProps = {
  variant: 'editorial' | 'center' | 'split' | 'immersive';
  eyebrow?: string;
  title: string;
  emphasis?: string;
  sub: string;
  primary: Link;
  secondary?: Link;
  media: HeroMedia;
  /** Small caption for the media corner, e.g. "Filmed with AI, 0:08". */
  caption?: string;
};

const HeroMediaEl = ({ media, className }: { media: HeroMedia; className?: string }) =>
  media.video && media.poster ? (
    <HeroVideo src={media.video} webm={media.webm} poster={media.poster} className={className} />
  ) : media.image ? (
    <img src={media.image} alt="" className={cn('h-full w-full object-cover', className)} />
  ) : null;

const HeroActions = ({ primary, secondary }: Pick<HeroProps, 'primary' | 'secondary'>) => (
  <div className="flex flex-wrap items-center gap-3">
    <Button asChild size="lg" icon={<ArrowIcon />}>
      <a href={primary.href}>{primary.label}</a>
    </Button>
    {secondary ? (
      <Button asChild size="lg" variant="outline">
        <a href={secondary.href}>{secondary.label}</a>
      </Button>
    ) : null}
  </div>
);

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const, delay },
});

export const Hero = (p: HeroProps) => {
  if (p.variant === 'immersive') {
    return (
      <section id="top" className="k-hero-full relative flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <HeroMediaEl media={p.media} />
          <div className="k-scrim absolute inset-0" />
        </div>
        <div className="k-container relative pb-[clamp(2rem,5vw,4.5rem)] pt-40">
          <div className="grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-9">
              {p.eyebrow ? (
                <motion.div {...fadeUp(0.1)} className="mb-6">
                  <span className="k-eyebrow">{p.eyebrow}</span>
                </motion.div>
              ) : null}
              <SplitText as="h1" immediate className="k-display" text={p.title} emphasis={p.emphasis} delay={0.15} />
            </div>
            <motion.div {...fadeUp(0.6)} className="flex flex-col gap-6 lg:col-span-3">
              <p className="k-body text-foreground/80">{p.sub}</p>
              <HeroActions primary={p.primary} secondary={p.secondary} />
            </motion.div>
          </div>
          <motion.div
            {...fadeUp(0.9)}
            className="mt-12 flex items-center justify-between border-t border-foreground/15 pt-5"
          >
            <span className="k-eyebrow">{p.caption ?? 'Scroll to explore'}</span>
            {p.media.sound ? <SoundToggle src={p.media.sound} /> : null}
          </motion.div>
        </div>
      </section>
    );
  }

  if (p.variant === 'center') {
    return (
      <section id="top" className="relative overflow-hidden pt-[clamp(8rem,14vw,12rem)]">
        <div className="k-container text-center">
          {p.eyebrow ? (
            <motion.div {...fadeUp(0.05)} className="mb-7 flex justify-center">
              <span className="k-eyebrow">{p.eyebrow}</span>
            </motion.div>
          ) : null}
          <SplitText
            as="h1"
            immediate
            className="k-h1 mx-auto max-w-[14ch]"
            text={p.title}
            emphasis={p.emphasis}
            delay={0.1}
          />
          <motion.p {...fadeUp(0.5)} className="k-lead mx-auto mt-7">
            {p.sub}
          </motion.p>
          <motion.div {...fadeUp(0.65)} className="mt-9 flex justify-center">
            <HeroActions primary={p.primary} secondary={p.secondary} />
          </motion.div>
        </div>
        <div className="k-container mt-[clamp(3rem,7vw,6rem)]">
          <motion.div
            initial={{ clipPath: 'inset(18% 8% 0% 8% round 32px)', scale: 1.04 }}
            animate={{ clipPath: 'inset(0% 0% 0% 0% round 24px)', scale: 1 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            className="k-media relative aspect-[16/8.5]"
          >
            <HeroMediaEl media={p.media} />
            {p.media.sound ? (
              <div className="absolute bottom-5 left-5 rounded-full bg-background/70 px-4 py-2 backdrop-blur-md">
                <SoundToggle src={p.media.sound} />
              </div>
            ) : null}
          </motion.div>
        </div>
      </section>
    );
  }

  if (p.variant === 'split') {
    return (
      <section id="top" className="relative pt-[clamp(7rem,11vw,10rem)]">
        <div className="k-container grid items-center gap-[clamp(2.5rem,5vw,5rem)] lg:grid-cols-12">
          <div className="lg:col-span-6">
            {p.eyebrow ? (
              <motion.div {...fadeUp(0.05)} className="mb-7">
                <span className="k-eyebrow">{p.eyebrow}</span>
              </motion.div>
            ) : null}
            <SplitText as="h1" immediate className="k-h1" text={p.title} emphasis={p.emphasis} delay={0.1} />
            <motion.p {...fadeUp(0.5)} className="k-lead mt-7">
              {p.sub}
            </motion.p>
            <motion.div {...fadeUp(0.65)} className="mt-9">
              <HeroActions primary={p.primary} secondary={p.secondary} />
            </motion.div>
          </div>
          <div className="lg:col-span-6">
            <motion.div
              initial={{ clipPath: 'inset(100% 0 0 0 round 28px)' }}
              animate={{ clipPath: 'inset(0% 0 0 0 round 28px)' }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="k-media relative aspect-[4/5] lg:aspect-[5/6]"
            >
              <motion.div
                className="h-full w-full"
                initial={{ scale: 1.25 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              >
                <HeroMediaEl media={p.media} />
              </motion.div>
              {p.caption || p.media.sound ? (
                <div className="absolute inset-x-5 bottom-5 flex items-center justify-between rounded-full bg-background/70 px-4 py-2 backdrop-blur-md">
                  <span className="k-eyebrow">{p.caption}</span>
                  {p.media.sound ? <SoundToggle src={p.media.sound} /> : null}
                </div>
              ) : null}
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  // editorial: a typographic wall, then a full-width media band.
  return (
    <section id="top" className="relative pt-[clamp(8rem,13vw,11rem)]">
      <div className="k-container">
        <div className="mb-10 flex items-center justify-between gap-6">
          {p.eyebrow ? (
            <motion.span {...fadeUp(0.05)} className="k-eyebrow">
              {p.eyebrow}
            </motion.span>
          ) : null}
          {p.media.sound ? (
            <motion.div {...fadeUp(0.1)}>
              <SoundToggle src={p.media.sound} />
            </motion.div>
          ) : null}
        </div>
        <SplitText as="h1" immediate className="k-display" text={p.title} emphasis={p.emphasis} delay={0.1} />
        <div className="mt-[clamp(2rem,4vw,3.5rem)] grid gap-8 border-t border-foreground/15 pt-8 md:grid-cols-12">
          <motion.p {...fadeUp(0.55)} className="k-lead md:col-span-5">
            {p.sub}
          </motion.p>
          <motion.div {...fadeUp(0.7)} className="md:col-span-7 md:flex md:justify-end">
            <HeroActions primary={p.primary} secondary={p.secondary} />
          </motion.div>
        </div>
      </div>
      <div className="mt-[clamp(3rem,6vw,5rem)] px-[var(--k-gutter)]">
        <MediaReveal className="aspect-[16/9] md:aspect-[21/9]">
          <HeroMediaEl media={p.media} />
        </MediaReveal>
        {p.caption ? (
          <div className="k-container mt-4 flex justify-between px-0">
            <span className="k-eyebrow">{p.caption}</span>
          </div>
        ) : null}
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */

export const SectionHead = ({
  eyebrow,
  title,
  emphasis,
  sub,
  align = 'left',
  className,
}: {
  eyebrow?: string;
  title: string;
  emphasis?: string;
  sub?: string;
  align?: 'left' | 'center';
  className?: string;
}) => (
  <div
    className={cn(
      'mb-[clamp(2.5rem,5vw,4.5rem)] grid gap-6',
      align === 'center' ? 'justify-items-center text-center' : 'md:grid-cols-12',
      className,
    )}
  >
    <div className={align === 'center' ? '' : 'md:col-span-7'}>
      {eyebrow ? (
        <Reveal className="mb-5">
          <span className="k-eyebrow">{eyebrow}</span>
        </Reveal>
      ) : null}
      <SplitText
        as="h2"
        className={cn('k-h2', align === 'center' && 'mx-auto max-w-[18ch]')}
        text={title}
        emphasis={emphasis}
      />
    </div>
    {sub ? (
      <Reveal
        delay={0.15}
        className={cn(align === 'center' ? '' : 'md:col-span-4 md:col-start-9 md:self-end')}
      >
        <p className={cn('k-body', align === 'center' && 'mx-auto max-w-[52ch]')}>{sub}</p>
      </Reveal>
    ) : null}
  </div>
);

export const LogoMarquee = ({ label, names }: { label: string; names: string[] }) => (
  <section className="border-y border-border py-10">
    <div className="k-container mb-6">
      <span className="k-eyebrow">{label}</span>
    </div>
    <Marquee seconds={36}>
      {names.map((n) => (
        <span
          key={n}
          className="whitespace-nowrap text-foreground/55"
          style={{
            fontFamily: 'var(--k-font-display)',
            fontSize: 'clamp(1.5rem, 1.1rem + 1.6vw, 2.5rem)',
            letterSpacing: '-0.035em',
            fontWeight: 'var(--k-display-weight)',
          }}
        >
          {n}
        </span>
      ))}
    </Marquee>
  </section>
);

export const FeatureGrid = ({
  eyebrow,
  title,
  emphasis,
  sub,
  items,
  id,
}: {
  eyebrow?: string;
  title: string;
  emphasis?: string;
  sub?: string;
  items: { title: string; body: string; icon?: React.ReactNode }[];
  id?: string;
}) => (
  <section id={id} className="k-section">
    <div className="k-container">
      <SectionHead eyebrow={eyebrow} title={title} emphasis={emphasis} sub={sub} />
      <div className="grid border-l border-t border-border sm:grid-cols-2 lg:grid-cols-3">
        {items.map((f, i) => (
          <Reveal key={f.title} delay={(i % 3) * 0.1}>
            <div className="group relative flex h-full flex-col gap-10 border-b border-r border-border p-[clamp(1.5rem,2.4vw,2.5rem)] transition-colors duration-500 hover:bg-foreground/[0.025]">
              <div className="flex items-start justify-between">
                <span className="k-eyebrow !text-foreground/40 before:hidden">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {f.icon ? (
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-border text-primary transition-transform duration-700 [transition-timing-function:var(--k-ease-out)] group-hover:-rotate-12 group-hover:scale-110">
                    {f.icon}
                  </span>
                ) : null}
              </div>
              <div className="mt-auto">
                <h3 className="k-h4 mb-3">{f.title}</h3>
                <p className="k-body text-[0.95rem]">{f.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export const Showcase = ({
  eyebrow,
  title,
  body,
  bullets,
  media,
  id,
  reverse = false,
}: {
  eyebrow?: string;
  title: string;
  body: string;
  bullets: string[];
  media: React.ReactNode;
  id?: string;
  reverse?: boolean;
}) => (
  <section id={id} className="k-section">
    <div className="k-container grid items-start gap-[clamp(2.5rem,6vw,6rem)] lg:grid-cols-12">
      <div className={cn('lg:sticky lg:top-32 lg:col-span-5', reverse && 'lg:order-2 lg:col-start-8')}>
        {eyebrow ? (
          <Reveal className="mb-5">
            <span className="k-eyebrow">{eyebrow}</span>
          </Reveal>
        ) : null}
        <SplitText as="h2" className="k-h2" text={title} />
        <Reveal delay={0.15}>
          <p className="k-body mt-6 max-w-[44ch]">{body}</p>
        </Reveal>
        <ul className="mt-8 grid gap-0 border-t border-border p-0">
          {bullets.map((b, i) => (
            <Reveal key={b} delay={0.2 + i * 0.08}>
              <li className="flex items-center gap-4 border-b border-border py-4 text-[0.95rem]">
                <span className="k-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                {b}
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
      <div className={cn('lg:col-span-7', reverse && 'lg:order-1 lg:col-start-1')}>{media}</div>
    </div>
  </section>
);

export const Stats = ({
  items,
  className,
}: {
  items: { value: number; prefix?: string; suffix?: string; label: string }[];
  className?: string;
}) => (
  <section className={cn('k-section k-invert', className)}>
    <div className="k-container grid gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((s, i) => (
        <Reveal key={s.label} delay={i * 0.1}>
          <div className="border-t border-foreground/20 pr-6 pt-6">
            <Counter className="k-stat block" value={s.value} prefix={s.prefix} suffix={s.suffix} />
            <p className="k-eyebrow mt-5 before:hidden">{s.label}</p>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

export const Testimonials = ({
  eyebrow,
  items,
}: {
  eyebrow?: string;
  items: { quote: string; name: string; role: string }[];
}) => {
  const [i, setI] = React.useState(0);
  const t = items[i];
  return (
    <section className="k-section">
      <div className="k-container">
        <div className="mb-10 flex items-center justify-between">
          {eyebrow ? <span className="k-eyebrow">{eyebrow}</span> : <span />}
          <div className="flex gap-2">
            {items.map((_, n) => (
              <button
                key={n}
                type="button"
                aria-label={`Show quote ${n + 1}`}
                aria-pressed={n === i}
                onClick={() => setI(n)}
                className="h-2 cursor-pointer rounded-full border-0 transition-all duration-500"
                style={{
                  width: n === i ? 28 : 8,
                  background: n === i ? 'hsl(var(--foreground))' : 'hsl(var(--foreground) / 0.2)',
                }}
              />
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.figure
            key={i}
            className="m-0"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <blockquote
              className="m-0 max-w-[26ch] text-balance"
              style={{
                fontFamily: 'var(--k-font-display)',
                fontWeight: 'var(--k-display-weight)',
                fontSize: 'clamp(1.875rem, 1.24rem + 2.61vw, 4rem)',
                lineHeight: 1.08,
                letterSpacing: '-0.03em',
              }}
            >
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-10 flex items-center gap-4">
              <span className="k-avatar">{t.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}</span>
              <span>
                <span className="block font-medium">{t.name}</span>
                <span className="k-eyebrow mt-1 before:hidden">{t.role}</span>
              </span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>
    </section>
  );
};

export type Plan = {
  name: string;
  price: number;
  period: string;
  blurb: string;
  features: string[];
  cta: string;
  featured?: boolean;
};

export const Pricing = ({
  eyebrow,
  title,
  emphasis,
  plans,
  ctaHref,
  id,
}: {
  eyebrow?: string;
  title: string;
  emphasis?: string;
  plans: Plan[];
  ctaHref: string;
  id?: string;
}) => {
  const [yearly, setYearly] = React.useState(false);
  return (
    <section id={id} className="k-section">
      <div className="k-container">
        <SectionHead eyebrow={eyebrow} title={title} emphasis={emphasis} />
        <div className="mb-8 flex items-center gap-3">
          <Switch
            checked={yearly}
            onChange={(e) => setYearly(e.target.checked)}
            aria-label="Pay yearly"
          />
          <span className="text-sm">Pay yearly</span>
          <Badge tone="primary">2 months free</Badge>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map((p, i) => {
            const price = yearly ? Math.round((p.price * 10) / 12) : p.price;
            return (
              <Reveal key={p.name} delay={i * 0.1}>
                <div
                  className={cn(
                    'k-card flex h-full flex-col p-[clamp(1.5rem,2.4vw,2.25rem)]',
                    p.featured && 'k-invert',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="k-eyebrow before:hidden">{p.name}</span>
                    {p.featured ? <Badge tone="primary">Most picked</Badge> : null}
                  </div>
                  <div className="mt-8 flex items-baseline gap-1">
                    <span className="k-stat" style={{ fontSize: 'clamp(3rem, 2.4rem + 2vw, 4.5rem)' }}>
                      ${price}
                    </span>
                    <span className="text-muted-foreground">{p.period}</span>
                  </div>
                  <p className="k-body mt-3 text-[0.95rem]">{p.blurb}</p>
                  <ul className="my-8 grid gap-0 border-t border-border p-0">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-3 border-b border-border py-3 text-[0.925rem]">
                        <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 flex-none text-primary" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button asChild variant={p.featured ? 'primary' : 'outline'} className="mt-auto w-full">
                    <a href={ctaHref}>{p.cta}</a>
                  </Button>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const Faq = ({
  eyebrow,
  title,
  items,
  id,
}: {
  eyebrow?: string;
  title: string;
  items: { q: string; a: string }[];
  id?: string;
}) => (
  <section id={id} className="k-section">
    <div className="k-container grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-4">
        {eyebrow ? <span className="k-eyebrow mb-5 inline-flex">{eyebrow}</span> : null}
        <SplitText as="h2" className="k-h2" text={title} />
      </div>
      <div className="lg:col-span-7 lg:col-start-6">
        <Accordion items={items} defaultOpen={[0]} />
      </div>
    </div>
  </section>
);

export const CtaBand = ({
  title,
  emphasis,
  sub,
  cta,
  media,
}: {
  title: string;
  emphasis?: string;
  sub: string;
  cta: Link;
  media?: HeroMedia;
}) => (
  <section className="px-[var(--k-gutter)] pb-[var(--k-gutter)]">
    <div className="k-invert relative overflow-hidden rounded-[var(--k-radius-xl)]">
      {media ? (
        <div className="absolute inset-0">
          <HeroMediaEl media={media} />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(70% 70% at 50% 50%, hsl(var(--background) / 0.78), hsl(var(--background) / 0.35))',
            }}
          />
        </div>
      ) : null}
      <div className="relative px-[var(--k-gutter)] py-[clamp(5rem,10vw,9rem)] text-center">
        <SplitText as="h2" className="k-h1 mx-auto max-w-[16ch]" text={title} emphasis={emphasis} />
        <Reveal delay={0.2}>
          <p className="k-lead mx-auto mt-6">{sub}</p>
        </Reveal>
        <Reveal delay={0.3} className="mt-9 flex justify-center">
          <Button asChild size="lg" icon={<ArrowIcon />}>
            <a href={cta.href}>{cta.label}</a>
          </Button>
        </Reveal>
      </div>
    </div>
  </section>
);

export const SiteFooter = ({
  name,
  columns,
  note,
}: {
  name: string;
  columns: { title: string; links: Link[] }[];
  note: string;
}) => (
  <footer className="overflow-hidden pt-[clamp(4rem,8vw,7rem)]">
    <div className="k-container grid gap-10 md:grid-cols-12">
      <div className="md:col-span-4">
        <p className="k-body max-w-[32ch]">{note}</p>
      </div>
      {columns.map((c) => (
        <div key={c.title} className="md:col-span-2">
          <p className="k-eyebrow mb-5 before:hidden">{c.title}</p>
          <ul className="grid gap-3 p-0">
            {c.links.map((l) => (
              <li key={l.label} className="list-none">
                <a href={l.href} className="k-link text-[0.95rem]" data-underline="hover">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="mt-[clamp(3rem,7vw,6rem)] flex justify-center">
      <p className="k-wordmark translate-y-[0.14em]" aria-hidden="true">
        {name}
      </p>
    </div>
  </footer>
);
