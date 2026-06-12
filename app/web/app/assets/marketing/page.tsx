/**
 * /assets/marketing — gallery of published marketing creatives,
 * grouped by campaign. Driven by /assets/manifest.json (static),
 * so it renders on staging and every preview deploy.
 */

'use client';

import { useEffect, useState } from 'react';

interface AssetsManifest {
  marketing?: { campaign: string; images: string[] }[];
}

export default function MarketingAssetsPage() {
  const [manifest, setManifest] = useState<AssetsManifest | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    fetch('/assets/manifest.json')
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setManifest)
      .catch(() => setMissing(true));
  }, []);

  const groups = manifest?.marketing ?? [];

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '48px 24px',
        maxWidth: 1080,
        margin: '0 auto',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 4 }}>
        Marketing creatives
      </h1>
      <p style={{ opacity: 0.6, marginBottom: 32 }}>
        Generated campaign assets, grouped by campaign.
      </p>

      {(missing || groups.length === 0) && (
        <p style={{ opacity: 0.6 }}>
          No creatives published yet — they appear here as campaigns
          generate them.
        </p>
      )}

      {groups.map((g) => (
        <section key={g.campaign} style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, marginBottom: 12 }}>
            {g.campaign}
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 14,
            }}
          >
            {g.images.map((img) => {
              const src = `/assets/marketing/${g.campaign}/${img}`;
              return (
                <a key={img} href={src} target="_blank" rel="noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={img}
                    loading="lazy"
                    style={{
                      width: '100%',
                      aspectRatio: '1 / 1',
                      objectFit: 'cover',
                      borderRadius: 10,
                      border: '1px solid rgba(127,127,127,0.25)',
                      display: 'block',
                    }}
                  />
                </a>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}
