/**
 * design.config.ts - which recipe of the prebuilt kit this product uses.
 *
 * app/layout.tsx writes these onto <html> as data-k-* attributes and
 * app/kit.css styles every primitive (components/ui) and block
 * (components/blocks) from them. Changing one line here restyles every
 * button, field, card or nav in the product at once.
 *
 * When a design system is applied (GetDesignSystemTool), copy its `kit`
 * values here verbatim. Otherwise pick deliberately from the options
 * listed on each key; never leave a product on defaults without looking
 * at /components.
 */

export type DesignConfig = {
  /** Hover mechanic + shape of every Button. */
  button: 'roll' | 'fill' | 'sharp' | 'glass' | 'soft' | 'arrow';
  input: 'outlined' | 'filled' | 'underline' | 'glass';
  card: 'flat' | 'outlined' | 'elevated' | 'glass' | 'inset';
  /** Marketing nav: floating glass pill, full-width bar, or mono split. */
  nav: 'pill' | 'bar' | 'split';
  /** Hero archetype for the homepage (components/blocks/hero.tsx). */
  hero: 'editorial' | 'center' | 'split' | 'immersive';
  /** How the emphasized headline word is set. */
  headline: 'tight' | 'serif-mix' | 'upper' | 'gradient';
  texture: 'none' | 'grain' | 'grid' | 'dots' | 'glow';
  /** mono = buttons, tags, nav and table heads in uppercase mono. */
  chrome: 'sans' | 'mono';
  switch: 'ios' | 'square';
  check: 'square' | 'rounded' | 'circle';
  tabs: 'underline' | 'pill' | 'segmented';
  table: 'lined' | 'zebra' | 'card-rows' | 'borderless';
  badge: 'pill' | 'square' | 'outline' | 'dot';
  /** Display face weight. The winners set display type at 400-500. */
  displayWeight: number;
};

export const design: DesignConfig = {
  button: 'roll',
  input: 'outlined',
  card: 'outlined',
  nav: 'pill',
  hero: 'editorial',
  headline: 'serif-mix',
  texture: 'grain',
  chrome: 'mono',
  switch: 'ios',
  check: 'rounded',
  tabs: 'pill',
  table: 'lined',
  badge: 'pill',
  displayWeight: 400,
};

/** The <html> attributes for a config. */
export const designAttributes = (d: DesignConfig = design) => ({
  'data-k-button': d.button,
  'data-k-input': d.input,
  'data-k-card': d.card,
  'data-k-nav': d.nav,
  'data-k-headline': d.headline,
  'data-k-texture': d.texture,
  'data-k-chrome': d.chrome,
  'data-k-switch': d.switch,
  'data-k-check': d.check,
  'data-k-tabs': d.tabs,
  'data-k-table': d.table,
  'data-k-badge': d.badge,
});
