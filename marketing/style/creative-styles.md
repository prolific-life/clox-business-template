# Creative styles

> Named visual styles for generated marketing images. The
> `generate-marketing-image` skill picks ONE per asset and renders it
> with the brand tokens from `docs/branding/DESIGN_SYSTEM.md` (palette,
> type direction, logo treatment). Styles are vibes to follow, not
> images to copy.

## Styles

### product-spotlight
Clean device/app screenshot composition on a brand-color gradient,
generous whitespace, one short headline in brand type. Use for:
feature announcements, launch posts.

### bold-statement
Full-bleed brand color, oversized typographic claim (≤7 words),
minimal supporting line. Use for: opinion posts, campaign heroes.

### story-photo
Photographic scene matching the audience's world (their desk, their
city, their moment-of-pain), subtle brand color grade, small logo
lockup. Use for: B2C lifestyle posts, testimonial frames.

### data-card
One stat as the hero, simple chart motif, brand palette. Use for:
results posts, sentiment/report shares.

## Rules
- Aspect ratios: X/LinkedIn feed 16:9 or 1:1; stories/reels 9:16;
  carousel slides 1:1.
- Logo: only the real `app/web/public/logo.*` — never a generated
  imitation. If the model draws text poorly, regenerate with the
  headline removed and rely on the post copy.
- Every generated asset lands in the campaign's `creatives/` with a
  one-line provenance note (style, model, prompt) beside it.
