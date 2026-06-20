/**
 * /brand — the living brand-guidelines BOOK.
 *
 * Modeled on an editorial brand book (cover → about & values → logo →
 * color → typography → system → components → applications), rendered
 * PROGRAMMATICALLY from the design tokens in `constants/branding/*`
 * (colors, typography, spacing, radius, shadows, buttons, inputs,
 * story) and the identity in `constants/app.ts`. It can never drift
 * from the real system: change a token and this page changes with it.
 * Do NOT hardcode values here — if something needs to look different,
 * change the token (and the brand pillar doc that decides it).
 *
 * Strategy lives in `brand/` (positioning / voice / visual identity /
 * story); narrative excerpts deployed here come from
 * `constants/branding/story.ts`, kept in lockstep with those pillars.
 */

import {
  colors,
  typography,
  spacing,
  radius,
  shadow,
  buttons,
  inputs,
  story,
} from '@/constants/branding';
import {
  appName,
  appTagline,
  appDescription,
  appLogoPath,
} from '@/constants/app';

export const metadata = {
  title: `Brand Guidelines — ${appName}`,
  description: `${appName} brand book: values, logo, color, typography, system, applications.`,
};

/** Resolve a "group.key" token ref ("brand.primary") to its hex. */
const colorRef = (ref: string): string => {
  if (ref === 'transparent') return 'transparent';
  const [group, key] = ref.split('.');
  const groups: Record<string, Record<string, string>> = {
    brand: { ...colors.brand },
    neutral: Object.fromEntries(
      Object.entries(colors.neutral).map(([k, v]) => [String(k), v]),
    ),
    semantic: { ...colors.semantic },
  };
  return groups[group]?.[key] ?? ref;
};

// Widen the literal-typed constant ('' narrows to never inside truthy
// branches) — at runtime the operator fills it with a real path.
const logoPath: string = appLogoPath;

const ink = colors.neutral[900];
const inkSoft = colors.neutral[600];
const line = colors.neutral[200];
const paper = colors.neutral[0];
const primary = colors.brand.primary;

/** Editorial chapter header: mono number + rule + big title. */
const Chapter = ({
  n,
  title,
  sub,
}: {
  n: string;
  title: string;
  sub?: string;
}) => (
  <header style={{ marginBottom: 36 }}>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        marginBottom: 14,
      }}
    >
      <span
        style={{
          fontFamily: typography.fontFamily.mono,
          fontSize: typography.scale.sm,
          color: primary,
        }}
      >
        {n}
      </span>
      <div style={{ flex: 1, height: 1, background: line }} />
      <span
        style={{
          fontFamily: typography.fontFamily.mono,
          fontSize: typography.scale.xs,
          color: inkSoft,
        }}
      >
        {appName} — Brand Guidelines
      </span>
    </div>
    <h2
      style={{
        fontSize: typography.scale['3xl'],
        fontWeight: typography.weight.bold,
        margin: 0,
        color: ink,
        letterSpacing: '-0.02em',
      }}
    >
      {title}
    </h2>
    {sub ? (
      <p
        style={{
          fontSize: typography.scale.base,
          color: inkSoft,
          margin: '8px 0 0',
          maxWidth: 560,
          lineHeight: 1.6,
        }}
      >
        {sub}
      </p>
    ) : null}
  </header>
);

const TokenLabel = ({ name, value }: { name: string; value: string }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      fontFamily: typography.fontFamily.mono,
    }}
  >
    <span style={{ fontSize: typography.scale.sm, color: ink }}>{name}</span>
    <span style={{ fontSize: typography.scale.xs, color: inkSoft }}>
      {value}
    </span>
  </div>
);

/** Pick black/white text for a hex background (relative luminance). */
const onColor = (hex: string): string => {
  const h = hex.replace('#', '');
  if (h.length !== 6) return '#ffffff';
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 150 ? ink : '#ffffff';
};

export default function BrandPage() {
  const section: React.CSSProperties = { marginBottom: 88 };
  const grid = (min: number): React.CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`,
    gap: 16,
  });
  const hierarchy: {
    label: string;
    family: string;
    size: string;
    weight: number;
    sample: string;
  }[] = [
    {
      label: 'Heading',
      family: typography.fontFamily.sans,
      size: typography.scale['4xl'],
      weight: typography.weight.bold,
      sample: 'Build something worth a brand.',
    },
    {
      label: 'Subheading',
      family: typography.fontFamily.sans,
      size: typography.scale['2xl'],
      weight: typography.weight.medium,
      sample: 'A system, not a style — used the same way every time.',
    },
    {
      label: 'Body',
      family: typography.fontFamily.sans,
      size: typography.scale.base,
      weight: typography.weight.regular,
      sample:
        'Body copy carries the voice: plain, specific, and consistent ' +
        'enough that a paragraph with the name removed is still ' +
        'recognizably ours.',
    },
    {
      label: 'Caption / mono',
      family: typography.fontFamily.mono,
      size: typography.scale.sm,
      weight: typography.weight.regular,
      sample: 'Labels, code, tokens — the quiet utility layer.',
    },
  ];

  return (
    <main
      style={{
        background: paper,
        color: ink,
        fontFamily: typography.fontFamily.sans,
        minHeight: '100vh',
      }}
    >
      {/* The book scrolls without a visible scrollbar — it's framed
          inside the platform's Branding page (and the bar adds nothing
          on a guidelines page viewed directly either). */}
      <style>{`
        html { scrollbar-width: none; -ms-overflow-style: none; }
        html::-webkit-scrollbar { display: none; }
      `}</style>
      {/* ── Cover ─────────────────────────────────────────────── */}
      <section
        style={{
          background: primary,
          color: onColor(primary),
          padding: '96px 24px',
        }}
      >
        <div style={{ maxWidth: 1040, margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: `1px solid ${onColor(primary)}33`,
              paddingBottom: 14,
              marginBottom: 72,
              fontFamily: typography.fontFamily.mono,
              fontSize: typography.scale.xs,
            }}
          >
            <span>{appName}</span>
            <span>Brand Guidelines — living edition</span>
          </div>
          <h1
            style={{
              fontSize: 'clamp(3rem, 8vw, 5.5rem)',
              fontWeight: typography.weight.bold,
              lineHeight: 1.02,
              letterSpacing: '-0.03em',
              margin: 0,
            }}
          >
            Brand
            <br />
            Guidelines
          </h1>
          <p
            style={{
              fontSize: typography.scale.lg,
              opacity: 0.85,
              maxWidth: 520,
              marginTop: 28,
              lineHeight: 1.55,
            }}
          >
            {appTagline}
          </p>
          <p
            style={{
              fontFamily: typography.fontFamily.mono,
              fontSize: typography.scale.xs,
              opacity: 0.7,
              marginTop: 56,
            }}
          >
            Rendered live from constants/branding — change a token, change
            the book.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 1040, margin: '0 auto', padding: '88px 24px' }}>
        {/* ── 01 About & values ─────────────────────────────────── */}
        <section style={section}>
          <Chapter n="01" title="About & values" sub={appDescription} />
          <blockquote
            style={{
              borderLeft: `3px solid ${primary}`,
              margin: '0 0 32px',
              padding: '6px 0 6px 22px',
              fontSize: typography.scale.xl,
              lineHeight: 1.45,
              fontWeight: typography.weight.medium,
              maxWidth: 720,
            }}
          >
            “{story.positioningLine}”
          </blockquote>
          <div style={grid(260)}>
            {story.values.map((v, i) => (
              <div
                key={v}
                style={{
                  border: `1px solid ${line}`,
                  borderRadius: radius.lg,
                  padding: 22,
                  boxShadow: shadow.sm,
                }}
              >
                <span
                  style={{
                    fontFamily: typography.fontFamily.mono,
                    fontSize: typography.scale.xs,
                    color: primary,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p
                  style={{
                    fontSize: typography.scale.lg,
                    fontWeight: typography.weight.medium,
                    margin: '10px 0 0',
                    lineHeight: 1.4,
                  }}
                >
                  {v}
                </p>
              </div>
            ))}
          </div>
          <p
            style={{
              fontSize: typography.scale.base,
              color: inkSoft,
              maxWidth: 680,
              lineHeight: 1.65,
              marginTop: 28,
            }}
          >
            {story.storyExcerpt}
          </p>
        </section>

        {/* ── 02 Logo ──────────────────────────────────────────── */}
        <section style={section}>
          <Chapter
            n="02"
            title="Logo"
            sub="The mark, its breathing room, and where it lives."
          />
          <div style={grid(300)}>
            <div
              style={{
                border: `1px solid ${line}`,
                borderRadius: radius.lg,
                background: paper,
                height: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: shadow.sm,
              }}
            >
              {logoPath ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/${logoPath.replace(/^\//, '')}`}
                  alt={`${appName} logo`}
                  style={{ maxHeight: 96, maxWidth: '70%' }}
                />
              ) : (
                <span
                  style={{
                    fontSize: typography.scale['3xl'],
                    fontWeight: typography.weight.bold,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {appName}
                </span>
              )}
            </div>
            <div
              style={{
                borderRadius: radius.lg,
                background: primary,
                height: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: onColor(primary),
              }}
            >
              {logoPath ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/${logoPath.replace(/^\//, '')}`}
                  alt={`${appName} logo on brand`}
                  style={{ maxHeight: 96, maxWidth: '70%' }}
                />
              ) : (
                <span
                  style={{
                    fontSize: typography.scale['3xl'],
                    fontWeight: typography.weight.bold,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {appName}
                </span>
              )}
            </div>
          </div>
          <p
            style={{
              fontSize: typography.scale.sm,
              color: inkSoft,
              marginTop: 16,
              maxWidth: 640,
              lineHeight: 1.6,
            }}
          >
            Clear-space: keep at least the height of the mark’s tallest
            letter (X-height rule) free on every side. Never stretch,
            recolor outside the palette, or set the mark on low-contrast
            imagery.
            {logoPath
              ? ''
              : ' A drawn mark hasn’t shipped yet — the wordmark above is the interim logo.'}
          </p>
        </section>

        {/* ── 03 Color ─────────────────────────────────────────── */}
        <section style={section}>
          <Chapter
            n="03"
            title="Color"
            sub="Every color has a meaning and a rule for when it shows up — a system, not a swatch list. The rules live in brand/visual-identity."
          />
          {/* Brand colors: tall editorial columns with codes. */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${
                Object.keys(colors.brand).length
              }, 1fr)`,
              borderRadius: radius.lg,
              overflow: 'hidden',
              border: `1px solid ${line}`,
            }}
          >
            {Object.entries(colors.brand).map(([name, hex]) => (
              <div
                key={name}
                style={{
                  background: hex,
                  color: onColor(hex),
                  minHeight: 260,
                  padding: 18,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  gap: 4,
                  fontFamily: typography.fontFamily.mono,
                }}
              >
                <span
                  style={{
                    fontSize: typography.scale.base,
                    fontWeight: typography.weight.medium,
                  }}
                >
                  {name}
                </span>
                <span style={{ fontSize: typography.scale.sm, opacity: 0.85 }}>
                  {hex.toUpperCase()}
                </span>
              </div>
            ))}
          </div>

          <h3
            style={{
              fontSize: typography.scale.base,
              color: inkSoft,
              margin: '30px 0 12px',
            }}
          >
            Neutral
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${
                Object.keys(colors.neutral).length
              }, 1fr)`,
              borderRadius: radius.md,
              overflow: 'hidden',
              border: `1px solid ${line}`,
            }}
          >
            {Object.entries(colors.neutral).map(([name, hex]) => (
              <div
                key={name}
                style={{
                  background: hex,
                  color: onColor(hex),
                  height: 88,
                  padding: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  fontFamily: typography.fontFamily.mono,
                  fontSize: typography.scale.xs,
                }}
              >
                <span>{name}</span>
                <span style={{ opacity: 0.75 }}>{hex.toUpperCase()}</span>
              </div>
            ))}
          </div>

          <h3
            style={{
              fontSize: typography.scale.base,
              color: inkSoft,
              margin: '30px 0 12px',
            }}
          >
            Semantic
          </h3>
          <div style={grid(160)}>
            {Object.entries(colors.semantic).map(([name, hex]) => (
              <div
                key={name}
                style={{ display: 'flex', alignItems: 'center', gap: 12 }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: radius.full,
                    background: hex,
                    border: `1px solid ${line}`,
                    flexShrink: 0,
                  }}
                />
                <TokenLabel name={name} value={hex.toUpperCase()} />
              </div>
            ))}
          </div>
        </section>

        {/* ── 04 Typography ───────────────────────────────────── */}
        <section style={section}>
          <Chapter
            n="04"
            title="Typography"
            sub="The hierarchy reads the same on every surface."
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              border: `1px solid ${line}`,
              borderRadius: radius.lg,
              overflow: 'hidden',
            }}
          >
            {hierarchy.map((h) => (
              <div
                key={h.label}
                style={{
                  display: 'flex',
                  gap: 24,
                  alignItems: 'baseline',
                  padding: '22px 22px',
                  borderBottom: `1px solid ${line}`,
                }}
              >
                <span
                  style={{
                    fontFamily: typography.fontFamily.mono,
                    fontSize: typography.scale.xs,
                    color: inkSoft,
                    width: 120,
                    flexShrink: 0,
                  }}
                >
                  {h.label}
                  <br />
                  {h.size} / {h.weight}
                </span>
                <span
                  style={{
                    fontFamily: h.family,
                    fontSize: h.size,
                    fontWeight: h.weight,
                    lineHeight: 1.25,
                  }}
                >
                  {h.sample}
                </span>
              </div>
            ))}
            <div
              style={{
                display: 'flex',
                gap: 28,
                padding: '16px 22px',
                fontFamily: typography.fontFamily.mono,
                fontSize: typography.scale.xs,
                color: inkSoft,
              }}
            >
              {Object.entries(typography.fontFamily).map(([name, stack]) => {
                // Show the human-readable face name, not the leading CSS var
                // (the stacks lead with var(--font-*) which next/font injects).
                const label =
                  stack
                    .split(',')
                    .map((s) => s.trim())
                    .find((s) => !s.startsWith('var(')) ?? stack;
                return (
                  <span key={name}>
                    {name}: {label.replace(/"/g, '')}
                  </span>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: 26 }}>
            {Object.entries(typography.scale)
              .reverse()
              .map(([name, size]) => (
                <div
                  key={name}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 20,
                    padding: '8px 0',
                    borderBottom: `1px solid ${line}`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: typography.fontFamily.mono,
                      fontSize: typography.scale.xs,
                      color: inkSoft,
                      width: 96,
                      flexShrink: 0,
                    }}
                  >
                    {name} · {size}
                  </span>
                  <span style={{ fontSize: size, lineHeight: 1.2 }}>
                    The quick brown fox
                  </span>
                </div>
              ))}
          </div>
        </section>

        {/* ── 05 System ───────────────────────────────────────── */}
        <section style={section}>
          <Chapter
            n="05"
            title="System"
            sub="Spacing, radius, and elevation — the invisible grid everything sits on."
          />
          <div style={grid(300)}>
            <div>
              <h3 style={{ fontSize: typography.scale.base, color: inkSoft }}>
                Spacing
              </h3>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
              >
                {Object.entries(spacing).map(([name, value]) => (
                  <div
                    key={name}
                    style={{ display: 'flex', alignItems: 'center', gap: 12 }}
                  >
                    <span
                      style={{
                        fontFamily: typography.fontFamily.mono,
                        fontSize: typography.scale.xs,
                        color: inkSoft,
                        width: 76,
                        flexShrink: 0,
                      }}
                    >
                      {name} · {value}
                    </span>
                    <div
                      style={{
                        width: value,
                        minWidth: value === '0' ? 1 : undefined,
                        height: 14,
                        background: primary,
                        borderRadius: radius.sm,
                        opacity: 0.85,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: typography.scale.base, color: inkSoft }}>
                Radius
              </h3>
              <div style={grid(110)}>
                {Object.entries(radius).map(([name, value]) => (
                  <div
                    key={name}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                    }}
                  >
                    <div
                      style={{
                        height: 64,
                        borderRadius: value,
                        border: `2px solid ${primary}`,
                        background: colors.neutral[100],
                      }}
                    />
                    <TokenLabel name={name} value={value} />
                  </div>
                ))}
              </div>
              <h3
                style={{
                  fontSize: typography.scale.base,
                  color: inkSoft,
                  marginTop: 24,
                }}
              >
                Shadows
              </h3>
              <div style={grid(110)}>
                {Object.entries(shadow).map(([name, value]) => (
                  <div
                    key={name}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                    }}
                  >
                    <div
                      style={{
                        height: 64,
                        borderRadius: radius.md,
                        background: paper,
                        boxShadow: value,
                        border: `1px solid ${line}`,
                      }}
                    />
                    <TokenLabel name={name} value={name} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 06 Components ───────────────────────────────────── */}
        <section style={section}>
          <Chapter
            n="06"
            title="Components"
            sub="The tokens, assembled — buttons and inputs as they ship."
          />
          <div
            style={{
              display: 'flex',
              gap: 14,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {Object.entries(buttons.variants).map(([variant, v]) =>
              Object.entries(buttons.sizes).map(([size, s]) => (
                <button
                  key={`${variant}-${size}`}
                  type="button"
                  style={{
                    background: colorRef(v.bg),
                    color: colorRef(v.fg),
                    border:
                      v.bg === 'transparent'
                        ? `1px solid ${line}`
                        : '1px solid transparent',
                    borderRadius: radius.md,
                    padding: `${spacing[s.paddingY]} ${spacing[s.paddingX]}`,
                    fontSize: typography.scale[s.fontSize],
                    fontWeight: typography.weight.medium,
                    fontFamily: typography.fontFamily.sans,
                    cursor: 'pointer',
                  }}
                >
                  {variant} / {size}
                </button>
              )),
            )}
          </div>
          <div
            style={{
              display: 'flex',
              gap: 14,
              flexWrap: 'wrap',
              marginTop: 20,
            }}
          >
            {Object.entries(inputs.variants).map(([variant, v]) => (
              <input
                key={variant}
                readOnly
                value={`${variant} input`}
                style={{
                  background: colorRef(v.bg),
                  color: colorRef(v.fg),
                  border: `1px solid ${colorRef(v.border)}`,
                  borderRadius: radius.md,
                  padding: `${spacing[inputs.sizes.md.paddingY]} ${spacing[inputs.sizes.md.paddingX]}`,
                  fontSize: typography.scale[inputs.sizes.md.fontSize],
                  fontFamily: typography.fontFamily.sans,
                  outline: 'none',
                  minWidth: 220,
                }}
              />
            ))}
          </div>
        </section>

        {/* ── 07 Applications ─────────────────────────────────── */}
        <section style={section}>
          <Chapter
            n="07"
            title="Applications"
            sub="The same brand wearing different clothes — every surface pulls from the pillars above."
          />
          <div style={grid(300)}>
            {/* Business card — front. */}
            <div
              style={{
                aspectRatio: '1.75',
                borderRadius: radius.lg,
                background: primary,
                color: onColor(primary),
                padding: 22,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: shadow.lg,
              }}
            >
              <span
                style={{
                  fontWeight: typography.weight.bold,
                  fontSize: typography.scale.lg,
                  letterSpacing: '-0.01em',
                }}
              >
                {appName}
              </span>
              <span
                style={{
                  fontFamily: typography.fontFamily.mono,
                  fontSize: typography.scale.xs,
                  opacity: 0.8,
                }}
              >
                {appTagline}
              </span>
            </div>
            {/* Business card — back. */}
            <div
              style={{
                aspectRatio: '1.75',
                borderRadius: radius.lg,
                background: paper,
                border: `1px solid ${line}`,
                padding: 22,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: shadow.md,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: radius.full,
                  background: primary,
                }}
              />
              <div
                style={{
                  fontFamily: typography.fontFamily.mono,
                  fontSize: typography.scale.xs,
                  color: inkSoft,
                }}
              >
                hello@{appName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com
              </div>
            </div>
            {/* Social tile. */}
            <div
              style={{
                aspectRatio: '1',
                borderRadius: radius.lg,
                background: colors.neutral[100],
                border: `1px solid ${line}`,
                padding: 22,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: shadow.sm,
              }}
            >
              <span
                style={{
                  fontSize: typography.scale['2xl'],
                  fontWeight: typography.weight.bold,
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                }}
              >
                {story.positioningLine.length > 80
                  ? `${story.positioningLine.slice(0, 80)}…`
                  : story.positioningLine}
              </span>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: typography.fontFamily.mono,
                    fontSize: typography.scale.xs,
                    color: inkSoft,
                  }}
                >
                  @{appName.toLowerCase().replace(/[^a-z0-9]/g, '')}
                </span>
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: radius.full,
                    background: primary,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <footer
          style={{
            borderTop: `1px solid ${line}`,
            paddingTop: 18,
            fontSize: typography.scale.sm,
            color: inkSoft,
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <span>
            Strategy: <code>brand/</code> · Tokens:{' '}
            <code>constants/branding</code> — change the source, never this
            page.
          </span>
          <span style={{ fontFamily: typography.fontFamily.mono }}>
            {appName} · living edition
          </span>
        </footer>
      </div>
    </main>
  );
}
