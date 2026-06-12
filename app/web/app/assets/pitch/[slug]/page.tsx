/**
 * /assets/pitch/[slug] — the deck previewer. Renders the published
 * slides.json as full-width brand-styled slides (the SAME source the
 * pptx is built from, so what you see here is what the .pptx says),
 * with a download link to deck.pptx. Pure static fetch — works on
 * staging and every per-project preview deploy, which is how the
 * Clox /pitch tab and project previews embed live deck progress.
 *
 * Layouts here mirror app/web/tools/build-deck.mjs — keep in sync.
 */

'use client';

import { use, useEffect, useState } from 'react';

interface DeckSlide {
  layout?: string;
  title?: string;
  subtitle?: string;
  bullets?: string[];
  stat?: string;
  statLabel?: string;
  image?: string;
  caption?: string;
}
interface DeckSpec {
  title?: string;
  updated?: string;
  theme?: Record<string, string>;
  slides?: DeckSlide[];
}

export default function DeckPreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const base = `/assets/pitch/${slug}`;
  const [spec, setSpec] = useState<DeckSpec | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    fetch(`${base}/slides.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setSpec)
      .catch(() => setMissing(true));
  }, [base]);

  const t = {
    bg: '#0E1116',
    surface: '#161B22',
    text: '#F0F3F6',
    muted: '#8B949E',
    accent: '#3FB6A8',
    font: 'system-ui, sans-serif',
    ...(spec?.theme ?? {}),
  };

  if (missing) {
    return (
      <main style={{ padding: 48, fontFamily: 'system-ui' }}>
        <p style={{ opacity: 0.6 }}>
          No deck published at {base}/slides.json yet.
        </p>
      </main>
    );
  }
  if (!spec) return null;

  return (
    <main
      style={{
        minHeight: '100vh',
        background: t.bg,
        color: t.text,
        fontFamily: t.font,
        padding: '24px 16px 64px',
      }}
    >
      {/* Deck header: title + pptx download. */}
      <div
        style={{
          maxWidth: 960,
          margin: '0 auto 20px',
          display: 'flex',
          alignItems: 'baseline',
          gap: 14,
          flexWrap: 'wrap',
        }}
      >
        <h1 style={{ fontSize: 20, margin: 0 }}>{spec.title || slug}</h1>
        {spec.updated ? (
          <span style={{ color: t.muted, fontSize: 13 }}>
            {spec.updated}
          </span>
        ) : null}
        <span style={{ flex: 1 }} />
        <a
          href={`${base}/deck.pptx`}
          download
          style={{
            color: t.accent,
            fontSize: 14,
            textDecoration: 'none',
            border: `1px solid ${t.accent}`,
            borderRadius: 999,
            padding: '4px 14px',
          }}
        >
          Download .pptx
        </a>
      </div>

      {/* Slides — 16:9 cards, one under the other. */}
      <div
        style={{
          maxWidth: 960,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        {(spec.slides ?? []).map((s, i) => {
          const layout = s.layout ?? 'bullets';
          const hero = layout === 'title' || layout === 'closing';
          return (
            <section
              key={i}
              style={{
                aspectRatio: '16 / 9',
                background: t.surface,
                borderRadius: 14,
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '5% 6%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: hero ? 'center' : 'flex-start',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 16,
                  color: t.muted,
                  fontSize: 12,
                }}
              >
                {i + 1}
              </span>

              <h2
                style={{
                  fontSize: hero ? 44 : 28,
                  margin: 0,
                  lineHeight: 1.15,
                }}
              >
                {s.title}
              </h2>
              {!hero && (
                <div
                  style={{
                    width: 56,
                    height: 4,
                    background: t.accent,
                    borderRadius: 2,
                    margin: '12px 0 18px',
                  }}
                />
              )}
              {s.subtitle ? (
                <p
                  style={{
                    color: t.accent,
                    fontSize: hero ? 22 : 16,
                    margin: hero ? '14px 0 0' : '0 0 12px',
                  }}
                >
                  {s.subtitle}
                </p>
              ) : null}

              <div
                style={{
                  display: 'flex',
                  gap: '6%',
                  flex: 1,
                  minHeight: 0,
                  marginTop: hero ? 18 : 0,
                }}
              >
                {layout === 'stat' && (
                  <div style={{ flexShrink: 0 }}>
                    <div
                      style={{
                        fontSize: 72,
                        fontWeight: 700,
                        color: t.accent,
                        lineHeight: 1,
                      }}
                    >
                      {s.stat}
                    </div>
                    {s.statLabel ? (
                      <div
                        style={{
                          color: t.muted,
                          fontSize: 15,
                          marginTop: 8,
                        }}
                      >
                        {s.statLabel}
                      </div>
                    ) : null}
                  </div>
                )}

                {s.bullets && s.bullets.length > 0 && (
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: 22,
                      fontSize: hero ? 16 : 18,
                      lineHeight: 1.7,
                      color: hero ? t.muted : t.text,
                      flex: 1,
                    }}
                  >
                    {s.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                )}

                {s.image ? (
                  <figure
                    style={{
                      flex: 1,
                      margin: 0,
                      minWidth: 0,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`${base}/${s.image}`}
                      alt={s.caption || s.title || ''}
                      style={{
                        flex: 1,
                        minHeight: 0,
                        objectFit: 'contain',
                        borderRadius: 8,
                      }}
                    />
                    {s.caption ? (
                      <figcaption
                        style={{
                          color: t.muted,
                          fontSize: 13,
                          textAlign: 'center',
                          marginTop: 8,
                        }}
                      >
                        {s.caption}
                      </figcaption>
                    ) : null}
                  </figure>
                ) : null}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
