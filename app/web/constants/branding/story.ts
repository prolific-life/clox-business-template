/**
 * Brand narrative tokens — the words the /brand guidelines book renders
 * alongside the visual system. Filled by the operator during the
 * first-wake bootstrap FROM the brand pillar docs (brand/positioning/ +
 * brand/story/): these are deployable excerpts of those pillars, kept in
 * lockstep with them (pillar changes, this changes, same commit).
 */

export const story = {
  /** One sharp positioning line (brand/positioning — specific and
   *  pointed, never "we help X do Y"). */
  positioningLine:
    'Replace with the positioning statement from brand/positioning.',
  /** 3-5 brand values — the beliefs every surface repeats
   *  (brand/positioning "what we stand for" + brand/story "what we
   *  believe now"). */
  values: [
    'Replace with value one',
    'Replace with value two',
    'Replace with value three',
  ],
  /** A short story excerpt — the through-line that makes a stranger
   *  care (brand/story): why this exists, in 2-3 sentences. */
  storyExcerpt:
    'Replace with 2-3 sentences from brand/story: why this business ' +
    'exists and what it believes.',
} as const;
