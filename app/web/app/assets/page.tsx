/**
 * /assets — index of published agent-generated artifacts: pitch decks
 * and marketing creatives. Driven by /assets/manifest.json (a static
 * file the skills keep current), so this page works on every deploy
 * (staging + per-project previews) with zero server code.
 *
 * NOTE: public for now so preview panes can embed it; an admin gate
 * is a planned platform change. Don't publish secrets into /assets.
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface AssetsManifest {
  decks?: { slug: string; title?: string; updated?: string }[];
  marketing?: { campaign: string; images: string[] }[];
}

export default function AssetsIndexPage() {
  const [manifest, setManifest] = useState<AssetsManifest | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    fetch('/assets/manifest.json')
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setManifest)
      .catch(() => setMissing(true));
  }, []);

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '48px 24px',
        maxWidth: 880,
        margin: '0 auto',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 4 }}>Assets</h1>
      <p style={{ opacity: 0.6, marginBottom: 32 }}>
        Generated pitch decks and marketing creatives.
      </p>

      {missing && (
        <p style={{ opacity: 0.6 }}>
          Nothing published yet — decks and creatives appear here once
          the agent generates them.
        </p>
      )}

      {manifest?.decks && manifest.decks.length > 0 && (
        <section style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, marginBottom: 12 }}>Pitch decks</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {manifest.decks.map((d) => (
              <li key={d.slug} style={{ marginBottom: 8 }}>
                <Link
                  href={`/assets/pitch/${d.slug}`}
                  style={{ fontSize: 16 }}
                >
                  {d.title || d.slug}
                </Link>
                {d.updated ? (
                  <span
                    style={{
                      opacity: 0.5,
                      fontSize: 13,
                      marginLeft: 8,
                    }}
                  >
                    {d.updated}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {manifest?.marketing && manifest.marketing.length > 0 && (
        <section>
          <h2 style={{ fontSize: 18, marginBottom: 12 }}>
            Marketing creatives
          </h2>
          <p style={{ marginBottom: 8 }}>
            <Link href="/assets/marketing">Open the gallery</Link>
          </p>
        </section>
      )}
    </main>
  );
}
