---
name: analyze-reference-site
description: >-
  Reverse-engineer a reference website the user provides: map its
  pages, information architecture, user flows, components, and tech
  hints into an implementation plan for THIS app. Use when the user
  says "build something like <url>", "copy how X works", or shares a
  competitor to learn from. For pure VISUAL style use
  extract-design-system (run both for "make it look and work like X").
---

# Analyze a reference site

## Inputs
- `url` — the reference site.
- `focus` — whole product, or one flow/page (e.g. "their onboarding").

## Steps
1. Crawl the public surface, bounded: `curl -sL <url>` for the entry
   page; collect same-origin nav links; fetch the top ~10 pages that
   match the focus. Respect auth walls — analyze only what's public.
2. Per page, extract structure (not pixels): the section stack
   (hero / social proof / feature grid / CTA…), headings hierarchy,
   nav + footer contents, forms (fields, validation hints, CTAs),
   and interactive components (tabs, accordions, carousels, modals,
   tables, search).
3. Map the flows the focus implies: entry → activation steps → the
   conversion moment; what's gated vs public; empty/edge states the
   site handles visibly.
4. Tech hints (best-effort, from markup/headers only): framework
   fingerprints, analytics, payment/auth providers — useful for
   knowing what infra the experience implies.
5. Write `docs/engineering-plans/reference-<host>.md`:
   - **What they do well** (3–6 specifics worth stealing).
   - **Page + IA map**, **flow diagrams** (text arrows are fine).
   - **Component inventory** mapped to what we already have in
     `app/web/components/` vs what's missing.
   - **Implementation plan for THIS app**: phased, smallest shippable
     first, each phase tied to files/routes we'd touch.
6. If the user wants the build now: run spec-to-tasks on that plan
   and start phase 1 (extract-design-system first when the visual
   style should match too).
7. Commit (`docs: reference analysis of <host>`).

## Never
- Copy copy. Structure and patterns are learnable; their words,
  assets, and brand are not ours.
- Crawl past robots/auth or hammer the site — ≤15 fetches, one pass.
