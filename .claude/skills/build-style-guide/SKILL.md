---
name: build-style-guide
description: >-
  Analyze REAL writing samples (shipped posts, site copy, founder
  writing, the plan doc) and write mechanical writing rules another
  AI can follow into marketing/style/STYLE_GUIDE.md. Use when writing
  feels off-voice, when enough samples exist (5+), or on explicit
  request ("make our writing consistent").
---

# Build the writing style guide

## Steps
1. Collect samples: `marketing/campaigns/*/posts/*.md` with
   `status: posted`, `app/web` page copy, `docs/branding/identity.md`
   voice section, anything the user supplied. Need ≥5 substantial
   samples; with fewer, update only what the samples support and say
   so in the commit message.
2. Extract MECHANICS (not vibes) — for each, rule + a real example
   from the samples:
   - Sentence structure: length mix (% short/medium/long and what
     each is used for).
   - Vocabulary: complexity level, recurring words/phrases, banned
     words actually absent from good samples.
   - Tone markers: how confidence/humor/directness show up
     concretely.
   - Techniques: hooks used, list shapes, question frequency, CTA
     phrasing.
   - Per-channel deltas observed.
3. Rewrite `marketing/style/STYLE_GUIDE.md` keeping its section
   skeleton. Rules must be checkable ("max one rhetorical question
   per piece"), never aspirational mush ("be engaging").
4. Spot-check: rewrite one mediocre sample per the new guide; if the
   rewrite isn't clearly better, the rules are wrong — fix the rules,
   not the sample.
5. Commit. If voice itself (not mechanics) drifted from
   `docs/branding/identity.md`, flag it via refresh-marketing-plan
   instead of silently forking the voice here.
