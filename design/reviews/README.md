# Design review coverage

`coverage.json` is the weekly design review's memory of what it has already
looked at. Each entry records one product surface, the storyboard route it
was reviewed at, the date, and what the review filed against it.

The review reads this file first and picks the **least recently reviewed**
surfaces, so coverage rotates through the whole app instead of circling the
homepage. An empty file is the correct starting state for a new business.

Entry shape:

```json
{
  "surface": "Pricing page",
  "route": "/component/pricing",
  "reviewedAt": "2026-09-14",
  "filed": ["Make the pricing page lead with one plan"]
}
```

Written by the `review-product-design` skill. Nothing else should edit it.
