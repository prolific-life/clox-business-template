---
name: generate-marketing-image
description: >-
  Generate an on-brand marketing image (social creative, campaign
  hero, carousel slide) with Google's Gemini image models ("nano
  banana") via the REST API. Use whenever a post, campaign, or ad
  needs a visual. Reads the design system + creative styles first so
  output is on-brand, and saves into the campaign's creatives/.
---

# Generate a marketing image

## Inputs
- `purpose` — what the asset is for (post topic, campaign, channel).
- `style` — one of `marketing/style/creative-styles.md` (pick the
  best fit yourself if unspecified).
- `aspect` — `16:9` | `1:1` | `9:16` (default per channel rules in
  creative-styles.md).
- `outPath` — default `marketing/campaigns/<slug>/creatives/<n>-<slug>.png`.

## Steps
1. Read `docs/branding/DESIGN_SYSTEM.md` (palette hexes, type
   direction, logo treatment) + `marketing/style/creative-styles.md`
   (the named style's recipe). NEVER ask the model to draw the logo —
   composite the real `app/web/public/logo.*` later or omit.
2. Build ONE prompt: the style recipe + brand palette hexes + the
   subject + composition notes + "no text" (models render text
   poorly; let the post copy carry words) unless the style demands a
   short headline (≤7 words, spell it out exactly).
3. Generate. **Engine choice: Higgsfield first, Gemini fallback.**
   When `HIGGSFIELD_API_KEY` + `HIGGSFIELD_API_SECRET` are set in the
   environment, use Higgsfield (purpose-built for marketing
   creatives). REST base `https://platform.higgsfield.ai`, header
   `Authorization: Key $HIGGSFIELD_API_KEY:$HIGGSFIELD_API_SECRET`.
   Image generation via the Soul model:
   ```sh
   node -e '
   const auth="Key "+process.env.HIGGSFIELD_API_KEY+":"+process.env.HIGGSFIELD_API_SECRET;
   fetch("https://platform.higgsfield.ai/higgsfield-ai/soul/standard",{
     method:"POST",
     headers:{authorization:auth,"content-type":"application/json"},
     body:JSON.stringify({prompt:process.argv[1],
       aspect_ratio:process.argv[2]||"1:1",resolution:"720p"})
   }).then(r=>r.json()).then(d=>console.log(JSON.stringify(d)))
    .catch(e=>{console.error("FAIL",e.message);process.exit(1)});
   ' "<the prompt>" "<aspect>"
   ```
   Generation is async on their platform: the response carries a job
   id / status URL — poll it, then download the result image to
   `outPath` with another node fetch. Endpoint shapes evolve; when a
   call 404s, consult `https://docs.higgsfield.ai/docs/llms.txt` for
   the current API docs instead of guessing. Higgsfield calls are
   CREDIT-METERED on the user's account — generate deliberately,
   never loop retries more than twice.

   No Higgsfield keys (or hard failure after 2 tries) → Gemini with
   node. `GOOGLE_API_KEY` is in the environment; model default
   `gemini-3-pro-image`, fallback `gemini-2.5-flash-image` on error:
   ```sh
   node -e '
   const key=process.env.GOOGLE_API_KEY;
   const model=process.env.GEMINI_IMAGE_MODEL||"gemini-3-pro-image";
   const prompt=process.argv[1], out=process.argv[2];
   fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,{
     method:"POST",
     headers:{"x-goog-api-key":key,"content-type":"application/json"},
     body:JSON.stringify({contents:[{parts:[{text:prompt}]}],
       generationConfig:{responseModalities:["IMAGE"],
         imageConfig:{aspectRatio:process.argv[3]||"1:1"}}})
   }).then(r=>r.json()).then(d=>{
     const p=(((d.candidates||[])[0]||{}).content||{}).parts||[];
     const img=p.find(x=>x.inlineData&&x.inlineData.data);
     if(!img){console.error("NO_IMAGE",JSON.stringify(d).slice(0,300));process.exit(1)}
     require("fs").writeFileSync(out,Buffer.from(img.inlineData.data,"base64"));
     console.log("WROTE",out);
   }).catch(e=>{console.error("FAIL",e.message);process.exit(1)});
   ' "<the prompt>" "<outPath>" "<aspect>"
   ```
4. LOOK at the result (Read the png). Off-brand colors, garbled text,
   wrong composition → regenerate (≤2 retries, tightening the
   prompt). Then write a sibling `<name>.md` provenance note: style,
   model, prompt, date.
5. **Publish for review** (every generated creative the owner should
   see — not throwaway drafts): copy the file to
   `app/web/public/assets/marketing/<campaign>/<name>` and add it to
   the campaign's entry in `app/web/public/assets/manifest.json`
   (`marketing: [{campaign, images: […]}]`). The deployed app's
   `/assets/marketing` gallery renders from there. Commit + push so the
   public asset URL is live (`<STAGING_URL>/assets/marketing/<campaign>/<name>`).
6. **File a review card on the Home tab** — the owner reviews + approves
   every creative; do NOT auto-use a creative the owner hasn't seen.
   The OPERATOR files it (Claude Code sessions can't — they have no
   feedback tool); a session that generates a creative reports the
   published URL back so the operator files the card:
   ```sh
   clox-ws-client tool CreateFeedbackTool '{"workspaceId":"{{WORKSPACE_ID}}","type":"suggestion","title":"Review creative: <short label>","body":"A new <campaign> creative is ready to review.\n\nView + iterate it on the web: <STAGING_URL>/assets/marketing/<campaign>/<name>\n\nApprove → move to Done (I will use it in the campaign). Want changes → press Start to spin up a project and tell me what to tweak (style, copy, crop), and I will regenerate it.","imageUrl":"<STAGING_URL>/assets/marketing/<campaign>/<name>"}' --user-id {{OWNER_USER_ID}}
   ```
   `imageUrl` makes the card render the creative inline on the Home
   kanban. ONE card per creative (or one per small batch — dedupe via
   `ListFeedbackTool`; never refile for the same asset).
7. Commit the asset + provenance note (+ published copy + manifest).

## Failure modes
- `GOOGLE_API_KEY` unset or 403 → do NOT stall: note "creative
  skipped (no Gemini key)" in the campaign log, post text-only, and
  relay ONE line so the user can provision the key.
- Both models erroring → same degrade path; include the error line in
  the relay.

## Never
- Generate images of real people, competitor logos, or fake
  testimonials/screenshots.
- Invent brand colors — only DESIGN_SYSTEM.md hexes.
