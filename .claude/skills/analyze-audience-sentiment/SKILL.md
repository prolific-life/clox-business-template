---
name: analyze-audience-sentiment
description: >-
  Gather real audience comments/reviews about our space (or a
  provided set) and produce a sentiment analysis: per-comment
  sentiment, recurring pains/desires, psychological triggers, and
  actionable recommendations. Updates marketing/context/audience.md.
  Use before a campaign, when engagement drops, or on request.
---

# Analyze audience sentiment

## Inputs
- `subject` — brand/product/category/competitor to research (default:
  our category + main competitor).
- `comments` — optional: user-provided list. Otherwise gather via web
  research: reviews, Reddit threads, X replies, community posts from
  the watering holes in `marketing/context/audience.md`. Need 15+
  REAL comments; never fabricate or paraphrase-invent quotes.

## Steps
1. Collect comments with source links. Quote verbatim, short.
2. Per comment: sentiment (positive/negative/neutral + strength
   1–10) and the driver behind it (relief, frustration, skepticism,
   aspiration…).
3. Synthesize: recurring topics, top 3 pains in THEIR words, top 3
   desires, the psychological triggers that move them, and what
   brands in this space should address / emphasize / avoid.
4. Write `marketing/campaigns/<slug>/research.md` (when run for a
   campaign) or `marketing/context/sentiment-<date>.md` (standalone),
   ending with 3–5 ACTIONS (angles to use, objections to pre-empt,
   words to adopt/avoid).
5. Fold durable patterns into `marketing/context/audience.md`
   (segments' pains/triggers/objections) — dated, with links.
6. Commit; one-line relay if findings change the current campaign's
   direction.
