/**
 * /brand — the living brand guidelines page.
 *
 * Everything on this page is rendered PROGRAMMATICALLY from the design
 * tokens in `constants/branding/*` (colors, typography, spacing, radius,
 * shadows, buttons, inputs) and the identity in `constants/app.ts`. It
 * can never drift from the real system: change a token and this page
 * changes with it. Do NOT hardcode values here — if something needs to
 * look different, change the token (and the brand/visual-identity pillar
 * doc that decides it).
 *
 * The strategy layer lives in `brand/` (positioning / voice / visual
 * identity / story); `docs/branding/DESIGN_SYSTEM.md` documents the
 * implementation; this route is the rendered, shareable proof.
 */

import {
  colors,
  typography,
  spacing,
  radius,
  shadow,
  buttons,
  inputs,
} from '@/constants/branding';
import { appName, appTagline } from '@/constants/app';

export const metadata = {
  title: `Brand — ${appName}`,
  description: `${appName} brand guidelines: colors, typography, spacing, radius, components.`,
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

const ink = colors.neutral[900];
const inkSoft = colors.neutral[600];
const line = colors.neutral[200];
const paper = colors.neutral[0];

const SectionTitle = ({ n, title }: { n: string; title: string }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'baseline',
      gap: 12,
      borderBottom: `1px solid ${line}`,
      paddingBottom: 10,
      marginBottom: 22,
    }}
  >
    <span
      style={{
        fontFamily: typography.fontFamily.mono,
        fontSize: typography.scale.sm,
        color: inkSoft,
      }}
    >
      {n}
    </span>
    <h2
      style={{
        fontSize: typography.scale['2xl'],
        fontWeight: typography.weight.bold,
        margin: 0,
        color: ink,
      }}
    >
      {title}
    </h2>
  </div>
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

const Swatch = ({
  name,
  hex,
  large = false,
}: {
  name: string;
  hex: string;
  large?: boolean;
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <div
      style={{
        height: large ? 96 : 64,
        borderRadius: radius.md,
        background: hex,
        border: `1px solid ${line}`,
        boxShadow: shadow.sm,
      }}
    />
    <TokenLabel name={name} value={hex} />
  </div>
);

export default function BrandPage() {
  const section: React.CSSProperties = { marginBottom: 64 };
  const grid = (min: number): React.CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`,
    gap: 16,
  });

  return (
    <main
      style={{
        background: paper,
        color: ink,
        fontFamily: typography.fontFamily.sans,
        minHeight: '100vh',
      }}
    >
      <div style={{ maxWidth: 1040, margin: '0 auto', padding: '64px 24px' }}>
        {/* ── Hero ── */}
        <header style={{ marginBottom: 72 }}>
          <p
            style={{
              fontFamily: typography.fontFamily.mono,
              fontSize: typography.scale.sm,
              color: colorRef('brand.primary'),
              margin: 0,
            }}
          >
            Brand guidelines
          </p>
          <h1
            style={{
              fontSize: typography.scale['4xl'],
              fontWeight: typography.weight.bold,
              margin: '8px 0 6px',
            }}
          >
            {appName}
          </h1>
          <p
            style={{
              fontSize: typography.scale.lg,
              color: inkSoft,
              margin: 0,
              maxWidth: 640,
            }}
          >
            {appTagline}
          </p>
          <p
            style={{
              fontSize: typography.scale.sm,
              color: inkSoft,
              marginTop: 16,
            }}
          >
            Rendered live from <code>constants/branding</code> — this page
            updates the moment a token changes.
          </p>
        </header>

        {/* ── 01 Colors ── */}
        <section style={section}>
          <SectionTitle n="01" title="Colors" />
          <h3 style={{ fontSize: typography.scale.base, color: inkSoft }}>
            Brand
          </h3>
          <div style={grid(180)}>
            {Object.entries(colors.brand).map(([name, hex]) => (
              <Swatch key={name} name={`brand.${name}`} hex={hex} large />
            ))}
          </div>
          <h3
            style={{
              fontSize: typography.scale.base,
              color: inkSoft,
              marginTop: 28,
            }}
          >
            Neutral
          </h3>
          <div style={grid(120)}>
            {Object.entries(colors.neutral).map(([name, hex]) => (
              <Swatch key={name} name={`neutral.${name}`} hex={hex} />
            ))}
          </div>
          <h3
            style={{
              fontSize: typography.scale.base,
              color: inkSoft,
              marginTop: 28,
            }}
          >
            Semantic
          </h3>
          <div style={grid(140)}>
            {Object.entries(colors.semantic).map(([name, hex]) => (
              <Swatch key={name} name={`semantic.${name}`} hex={hex} />
            ))}
          </div>
        </section>

        {/* ── 02 Typography ── */}
        <section style={section}>
          <SectionTitle n="02" title="Typography" />
          <div style={grid(280)}>
            {Object.entries(typography.fontFamily).map(([name, stack]) => (
              <div
                key={name}
                style={{
                  border: `1px solid ${line}`,
                  borderRadius: radius.lg,
                  padding: 20,
                  boxShadow: shadow.sm,
                }}
              >
                <p
                  style={{
                    fontFamily: stack,
                    fontSize: typography.scale['3xl'],
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  Aa Bb Cc 123
                </p>
                <div style={{ marginTop: 10 }}>
                  <TokenLabel name={`fontFamily.${name}`} value={stack} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 32 }}>
            {Object.entries(typography.scale)
              .reverse()
              .map(([name, size]) => (
                <div
                  key={name}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 20,
                    padding: '10px 0',
                    borderBottom: `1px solid ${line}`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: typography.fontFamily.mono,
                      fontSize: typography.scale.xs,
                      color: inkSoft,
                      width: 72,
                      flexShrink: 0,
                    }}
                  >
                    {name} · {size}
                  </span>
                  <span style={{ fontSize: size, lineHeight: 1.25 }}>
                    The quick brown fox jumps over the lazy dog
                  </span>
                </div>
              ))}
          </div>

          <div style={{ display: 'flex', gap: 28, marginTop: 24 }}>
            {Object.entries(typography.weight).map(([name, w]) => (
              <span
                key={name}
                style={{ fontWeight: w, fontSize: typography.scale.xl }}
              >
                {name} {w}
              </span>
            ))}
          </div>
        </section>

        {/* ── 03 Spacing ── */}
        <section style={section}>
          <SectionTitle n="03" title="Spacing" />
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            {Object.entries(spacing).map(([name, value]) => (
              <div
                key={name}
                style={{ display: 'flex', alignItems: 'center', gap: 16 }}
              >
                <span
                  style={{
                    fontFamily: typography.fontFamily.mono,
                    fontSize: typography.scale.xs,
                    color: inkSoft,
                    width: 88,
                    flexShrink: 0,
                  }}
                >
                  {name} · {value}
                </span>
                <div
                  style={{
                    width: value,
                    minWidth: value === '0' ? 1 : undefined,
                    height: 16,
                    background: colorRef('brand.primary'),
                    borderRadius: radius.sm,
                    opacity: 0.85,
                  }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── 04 Radius ── */}
        <section style={section}>
          <SectionTitle n="04" title="Radius" />
          <div style={grid(140)}>
            {Object.entries(radius).map(([name, value]) => (
              <div
                key={name}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <div
                  style={{
                    height: 80,
                    borderRadius: value,
                    border: `2px solid ${colorRef('brand.primary')}`,
                    background: colors.neutral[100],
                  }}
                />
                <TokenLabel name={`radius.${name}`} value={value} />
              </div>
            ))}
          </div>
        </section>

        {/* ── 05 Shadows ── */}
        <section style={section}>
          <SectionTitle n="05" title="Shadows" />
          <div style={grid(180)}>
            {Object.entries(shadow).map(([name, value]) => (
              <div
                key={name}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    height: 80,
                    borderRadius: radius.md,
                    background: paper,
                    boxShadow: value,
                    border: `1px solid ${line}`,
                  }}
                />
                <TokenLabel name={`shadow.${name}`} value={value} />
              </div>
            ))}
          </div>
        </section>

        {/* ── 06 Components ── */}
        <section style={section}>
          <SectionTitle n="06" title="Components" />
          <h3 style={{ fontSize: typography.scale.base, color: inkSoft }}>
            Buttons
          </h3>
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

          <h3
            style={{
              fontSize: typography.scale.base,
              color: inkSoft,
              marginTop: 28,
            }}
          >
            Inputs
          </h3>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
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

        <footer
          style={{
            borderTop: `1px solid ${line}`,
            paddingTop: 18,
            fontSize: typography.scale.sm,
            color: inkSoft,
          }}
        >
          Strategy lives in <code>brand/</code> (positioning · voice ·
          visual identity · story). Tokens live in{' '}
          <code>constants/branding</code>. This page is generated from
          them — change the source, never this page.
        </footer>
      </div>
    </main>
  );
}
