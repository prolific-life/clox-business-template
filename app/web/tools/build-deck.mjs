/**
 * build-deck.mjs — render a published deck's slides.json into a real
 * PowerPoint file with pptxgenjs (pure JS — runs anywhere node runs,
 * including the operator's gateway host).
 *
 *   cd app/web
 *   node tools/build-deck.mjs public/assets/pitch/<slug>
 *
 * Reads  <dir>/slides.json   (schema: pitch/README.md)
 * Writes <dir>/deck.pptx
 *
 * Keep layouts in lockstep with the HTML renderer at
 * app/assets/pitch/[slug]/page.tsx — slides.json is the single
 * source; these are its two projections.
 */

import fs from 'node:fs';
import path from 'node:path';
import PptxGenJS from 'pptxgenjs';

const dir = process.argv[2];
if (!dir) {
  console.error('usage: node tools/build-deck.mjs <deck dir>');
  process.exit(1);
}
const specPath = path.join(dir, 'slides.json');
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
const theme = {
  bg: '#0E1116',
  surface: '#161B22',
  text: '#F0F3F6',
  muted: '#8B949E',
  accent: '#3FB6A8',
  font: 'Helvetica',
  ...(spec.theme ?? {}),
};
const hex = (c) => String(c).replace('#', '');

const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'WIDE', width: 13.33, height: 7.5 });
pptx.layout = 'WIDE';
pptx.title = spec.title ?? 'Deck';

const addBase = (slide) => {
  slide.background = { color: hex(theme.bg) };
};

const bulletOpts = {
  fontFace: theme.font,
  color: hex(theme.text),
  fontSize: 18,
  bullet: { characterCode: '2022', indent: 18 },
  lineSpacingMultiple: 1.35,
};

for (const s of spec.slides ?? []) {
  const slide = pptx.addSlide();
  addBase(slide);
  if (s.notes) slide.addNotes(s.notes);
  const layout = s.layout ?? 'bullets';

  if (layout === 'title' || layout === 'closing') {
    slide.addText(s.title ?? '', {
      x: 0.9, y: 2.4, w: 11.5, h: 1.4,
      fontFace: theme.font, fontSize: 54, bold: true,
      color: hex(theme.text),
    });
    if (s.subtitle) {
      slide.addText(s.subtitle, {
        x: 0.9, y: 3.9, w: 11.5, h: 0.8,
        fontFace: theme.font, fontSize: 24,
        color: hex(theme.accent),
      });
    }
    if (Array.isArray(s.bullets) && s.bullets.length) {
      slide.addText(s.bullets.map((b) => ({ text: b })), {
        x: 0.95, y: 4.9, w: 11.4, h: 1.9, ...bulletOpts,
        color: hex(theme.muted),
      });
    }
    continue;
  }

  // Shared header for content layouts.
  slide.addText(s.title ?? '', {
    x: 0.9, y: 0.55, w: 11.5, h: 0.9,
    fontFace: theme.font, fontSize: 32, bold: true,
    color: hex(theme.text),
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.93, y: 1.5, w: 1.1, h: 0.07,
    fill: { color: hex(theme.accent) }, line: { type: 'none' },
  });

  if (layout === 'stat') {
    slide.addText(s.stat ?? '', {
      x: 0.9, y: 2.3, w: 6.0, h: 1.8,
      fontFace: theme.font, fontSize: 88, bold: true,
      color: hex(theme.accent),
    });
    if (s.statLabel) {
      slide.addText(s.statLabel, {
        x: 0.95, y: 4.1, w: 6.0, h: 0.6,
        fontFace: theme.font, fontSize: 18,
        color: hex(theme.muted),
      });
    }
    if (Array.isArray(s.bullets) && s.bullets.length) {
      slide.addText(s.bullets.map((b) => ({ text: b })), {
        x: 7.3, y: 2.3, w: 5.1, h: 4.2, ...bulletOpts,
      });
    }
  } else if (layout === 'image') {
    if (s.image) {
      slide.addImage({
        path: path.join(dir, s.image),
        x: 0.9, y: 1.9, w: 11.5, h: 4.6,
        sizing: { type: 'contain', w: 11.5, h: 4.6 },
      });
    }
    if (s.caption) {
      slide.addText(s.caption, {
        x: 0.9, y: 6.7, w: 11.5, h: 0.5,
        fontFace: theme.font, fontSize: 14,
        color: hex(theme.muted), align: 'center',
      });
    }
  } else {
    // bullets (default)
    const bullets = Array.isArray(s.bullets) ? s.bullets : [];
    slide.addText(bullets.map((b) => ({ text: b })), {
      x: 0.95, y: 2.1, w: s.image ? 6.2 : 11.4, h: 4.6,
      ...bulletOpts, fontSize: 20,
    });
    if (s.image) {
      slide.addImage({
        path: path.join(dir, s.image),
        x: 7.5, y: 2.1, w: 4.9, h: 4.4,
        sizing: { type: 'contain', w: 4.9, h: 4.4 },
      });
    }
  }
}

const out = path.join(dir, 'deck.pptx');
await pptx.writeFile({ fileName: out });
console.log('WROTE', out, `(${(spec.slides ?? []).length} slides)`);
