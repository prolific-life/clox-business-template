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
3. Generate. **Engine preference: Higgsfield → Gemini → OpenAI.**
   Higgsfield is PREFERRED when connected (purpose-built for marketing
   creatives); it's OPTIONAL, so any of the three produces a fine
   creative — only the order matters. Pick the first that's
   available:
   - `HIGGSFIELD_API_KEY` + `HIGGSFIELD_API_SECRET` set → Higgsfield
     (the operator's claude preamble exports them when the business
     has connected it). Use it.
   - else → Gemini (`GOOGLE_API_KEY`, the default fallback), or OpenAI
     gpt-image (`OPENAI_API_KEY`) if Gemini is unavailable / a call
     fails. Both are fine — no need to flag anything; Higgsfield just
     isn't connected.
   When Higgsfield IS the engine, call its Soul model: REST base `https://platform.higgsfield.ai`, header
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
5. **Host on Supabase Storage — do NOT commit the binary.** Generated
   images/videos go to the business's Supabase public bucket, never
   into git (committing them bloats the repo + every Vercel deploy).
   Two steps:
   a. Mint a signed upload URL (the operator runs this — it resolves
      the service key server-side):
      ```sh
      clox-ws-client tool CreateCreativeUploadURLTool '{"workspaceId":"{{WORKSPACE_ID}}","path":"<campaign-slug>/<filename>"}' --user-id {{OWNER_USER_ID}}
      # → {"uploadUrl":"https://…/storage/v1/object/upload/sign/…?token=…","publicUrl":"https://<ref>.supabase.co/storage/v1/object/public/creatives/…"}
      ```
   b. PUT the file bytes straight to `uploadUrl` (node — no auth header
      needed, token's in the URL; handles large videos):
      ```sh
      node -e '
      const fs=require("fs");
      const buf=fs.readFileSync(process.argv[2]);
      fetch(process.argv[1],{method:"PUT",headers:{"content-type":process.argv[3]},body:buf})
        .then(r=>console.log(r.status)).catch(e=>{console.error(e.message);process.exit(1)});
      ' "<uploadUrl>" "<local file>" "<image/png|video/mp4>"
      ```
   Then write a small COMMITTED sidecar (metadata only, tiny) at
   `marketing/campaigns/<slug>/creatives/<name>.json`:
   `{"name":"<name>","url":"<publicUrl>","kind":"image|video","prompt":"…","model":"…","createdAt":"<date>"}`.
   The Marketing tab + Preview-tab Marketing browser read these
   sidecars (NOT the binary). `git rm` any binary that slipped into
   `creatives/` or `app/web/public/assets/`. Commit the sidecar only.
6. **File a review card on the Home tab** — the owner reviews + approves
   every creative; do NOT auto-use one the owner hasn't seen. The
   OPERATOR files it (sessions report the publicUrl back):
   ```sh
   clox-ws-client tool CreateFeedbackTool '{"workspaceId":"{{WORKSPACE_ID}}","type":"suggestion","title":"Review creative: <short label>","body":"A new <campaign> creative is ready to review.\n\nView it: <publicUrl>\n\nApprove → move to Done (I will use it). Want changes → press Start and tell me what to tweak; I will regenerate.","imageUrl":"<publicUrl>"}' --user-id {{OWNER_USER_ID}}
   ```
   `imageUrl` = the Supabase publicUrl → the card shows the creative
   inline on the Home kanban. ONE card per creative; dedupe via
   `ListFeedbackTool`.
7. Commit ONLY the JSON sidecar (never the binary). Push.

## Failure modes
- `GOOGLE_API_KEY` unset or 403 → do NOT stall: note "creative
  skipped (no Gemini key)" in the campaign log, post text-only, and
  relay ONE line so the user can provision the key.
- Both models erroring → same degrade path; include the error line in
  the relay.

## People in creatives
Generic, fictional people are ALLOWED and expected — UGC creatives
live on them (a person filming a review, using the app, reacting). Aim
for a realistic but clearly non-identifiable individual that fits the
audience. What's forbidden: depicting a REAL, named, or recognizable
person — a celebrity, public figure, the founder/team, or any specific
real individual's likeness. When a spec names a real person, render a
generic stand-in instead and note it.

## Never
- Depict a real / named / recognizable individual (see above), use
  competitor logos, or fake testimonials/screenshots.
- Invent brand colors — only DESIGN_SYSTEM.md hexes.
