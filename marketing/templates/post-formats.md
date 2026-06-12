# Post formats

Skeletons `generate-social-post` / `repurpose-content` start from.
Mechanics come from `marketing/style/STYLE_GUIDE.md`; voice from
`docs/branding/identity.md`.

## X — single
1. Hook line (the claim or the pain, no preamble)
2. 1–3 lines of substance (the how / the number / the example)
3. CTA or open question (only when natural)

## X — thread (3–7 posts)
1. Hook + promise ("how we did X — in N steps")
2. One idea per post, each standalone-quotable
3. Last post: recap + ONE CTA

## LinkedIn
1. First 2 lines = the story tension (they decide "see more")
2. Short paragraphs, concrete numbers, one lesson
3. Question to the room OR quiet CTA

## Reddit
- Title: the specific question/result, zero clickbait
- Body: full value, steps included, affiliation disclosed at the
  bottom, product linked only if it directly answers

## Newsletter / email section
- Subject ≤50 chars; preview line completes it
- Hook (2 sentences) → 3–4 sections with subheads → one CTA
- Every section must earn its scroll: insight, example, action

## Post file frontmatter (campaigns/<slug>/posts/*.md)
```yaml
---
channel: x | linkedin | reddit | email
scheduledFor: YYYY-MM-DDTHH:MM
status: draft | posted | skipped
campaign: <slug>
creative: creatives/<file> | none
postedUrl: <filled after publish>
---
```
