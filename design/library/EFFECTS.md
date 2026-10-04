# Effects library: what makes award sites feel made

Taken apart from The Tie Break (Merci-Michel), Jesper Landberg and ten 2026
Awwwards Site of the Day / Month winners: their shaders, timings, easings and
sound triggers, read from the running sites. Frame captures are linked inline
(open them to see the effect mid-motion).

## Ready-made in this app

| Effect | Use | Component |
|---|---|---|
| Moment reveal from a point (Tie Break) | product/result reveal at a big moment | `PointReveal` (components/fx) |
| Wavefront scene change | swap hero scenes, chapter changes | `WaveReveal` |
| Full-screen liquid wipe | page or state transitions | `ScreenWave` |
| Horizontal ribbon gallery (Jesper) | work, products, features, steps | `HorizontalScroll` (bend) |
| Living shader background | hero, CTA band, sign-in panel | `ShaderGradient` |
| Liquid image hover | work grids, product shots | `DistortImage` |
| Magnetic buttons, custom cursor | primary CTAs, marketing layout | `Magnetic`, `Cursor` |
| Scramble / masked text | eyebrows, nav, numbers / headlines | `ScrambleText` / kit `SplitText` |
| Sticky stacking cards | process steps, case studies | `StackCards` |
| UI sound (ticks, whoosh, chime) | nav, CTAs, transitions | `useUISound`, `UISoundToggle` |
| Hero loop, ambient bed | every homepage | kit `HeroVideo`, `SoundToggle` |
| Masked media, counters, marquee, smooth scroll | everywhere on marketing pages | kit `MediaReveal`, `Counter`, `Marquee`, `SmoothScroll` |

Every page of a marketing site should use at least three of these, chosen for
the story (a sports brand reveals; a studio scrolls sideways; a fintech
counts). Product screens inside the app use motion sparingly (see APP_UI.md).
Everything here must keep its reduced-motion and touch fallbacks.


Researched 2026-10-03 from 12 live sites: the two owner favourites plus 10 Awwwards Sites of the Day/Month from June to October 2026. Every number below was read from the shipped JS, CSS, or GLSL unless it is marked *(inferred)*. The shaders were studied to learn the mechanics; the shipped implementations are this app's own (components/fx).

Target stack for generated sites: **Next.js 14 (App Router) + React 18 + Tailwind**. Default libraries:
- `gsap` (+ ScrollTrigger, SplitText, CustomEase; all free since 3.13)
- `lenis` (smooth scroll)
- `ogl` for 2D full-screen shader passes (about 30 KB)
- `three` + `@react-three/fiber` + `@react-three/drei` only when real 3D or a DOM-synced plane set is needed
- Web Audio (a ~60-line wrapper) or `howler` for sound

## Reference sites

| slug | site | award | what it's known for |
|---|---|---|---|
| tiebreak | thetiebreak.merci-michel.com (Merci-Michel) | SOTD 2026-09-25 | playable Pong; **screen-wave product reveal** on every point |
| jesper | jesperlandberg.com | SOTD 2026-09-29 | **infinite horizontal ribbon carousel that bends with scroll velocity**, black-hole cursor lens |
| butter | butter.video (ToyFight) | SOTD 2026-09-28 | R3F + Rapier physics keychain hero, SplitText reveals, custom eases |
| lisa | lisa.locomotive.ca (Locomotive) | SOTD 2026-09-16 | three.js TV-head with CRT glitch, voice-reactive LEDs, scramble text, sound |
| lamalama | lamalama.com | Site of the Month Jul 2026 | custom WebGL2 pixel/dither logo grid, noise-block page transitions (Swup) |
| floema | floema.com | Site of the Month May 2026 | worker-offscreen three.js image tunnel, leaf-shadow overlay, ambient sound beds |
| oryzo | oryzo.ai (Lusion) | Site of the Month Apr 2026 | scroll-scrubbed 3D product story, edge glow, fluid cursor, per-section post-processing |
| illoca | illoca.unseen.co (Unseen) | SOTD 2026-09-04 | riso two-ink toon shading, Theatre.js camera scrubbed by ScrollTrigger, diagonal scene cut |
| gilhuybrecht | gilhuybrecht.com | SOTD 2026-09-21 | DOM-to-WebGL planes, per-corner-staggered "bend flip" layout transitions, WebGL text, sound |
| cerebrium | cerebrium.ai | SOTD 2026-09-10 | click-and-hold hero flythrough, chromatic fisheye reveal, hex force-field, Swup + Locomotive v5 |
| usavionix | usavionix.com (basement.studio) | SOTD 2026-09-09 | scroll "autoplay" scenes, diagonal scan wipe, thermal window, flyable drone with engine audio |
| edolus | edolus.com (Vertex3D) | SOTD 2026-10-04 | PlayCanvas, scroll drives a 3D timeline, mosaic/chromatic transitions, 3-layer adaptive music |

---

## Effects (18)

Each entry lists: **Used by**, **Mechanics**, **Parameters**, **Libs**, **A11y fallback**, **Sketch**.

### 1. Shader wave/ripple reveal from a point ("screen wave")
- **Used by:** tiebreak (signature). Related: cerebrium's noisy-circle chromatic reveal, gilhuybrecht's mask wipes, lamalama's noise blobs.
- **Mechanics:**
  - A full-screen transparent plane shows the incoming image.
  - The mask is three concentric soft disks whose radii grow from an origin point. The origin is where the triggering event happened (ball exit, click position).
  - On each front, UVs are displaced radially by a damped sine. A white glow ring rides the front and fades out as progress reaches 1.
  - Meanwhile the image zooms from 3x to 1x.
  - The exit runs the same shader with the mask inverted, from the centre, faster.
- **Parameters (tiebreak, exact):**
  - `uProgress` goes 0 to 1 over **2100 ms easeOutCubic**. `uZoomProgress` goes 0 to 1 over **2200 ms easeOutCubic**, re-eased in shader with `1-(1-t)^3`, zoom 3 to 1.
  - Front offsets `(0, .035, .075)`, edge softness ±.02, ring widths `(.06, .015, .2)`, glow .35.
  - Ripple `sin((d-r)*35 - t*6) * exp(-|d-r| * 40/thickness)`, summed and scaled by `.04*4`, applied `*0.6` along the radial direction. Thickness is 2.5 on desktop and 1.5 in portrait.
  - Exit: `uInvert=1`, 1100 ms easeOutCubic, origin at the centre.
  - Choreography: camera shake 300 ms, then a whoosh SFX, then a **300 ms pause**, then the wave. The plane tilts ±3.5° toward the pointer with damping .08, at scale 1.048.
- **Libs:** OGL (one `Mesh` with a `Triangle` geometry) or R3F `<mesh>` with `shaderMaterial`. Drive the tween with `gsap.to(uniform, {value:1, duration:2.1, ease:"power3.out"})`. power3.out is the same as easeOutCubic.
- **A11y:** with reduced motion, crossfade the image over 300 ms with no displacement or zoom. Keep the SFX opt-in.
- **Sketch:** see our own implementation is `PointReveal` in components/fx.
```ts
// WaveReveal.tsx (OGL)
const prog = new Program(gl, { vertex: FULLSCREEN_VERT, fragment: WAVE_FRAG, transparent: true,
  uniforms: { uPicture:{value:tex}, uProgress:{value:0}, uZoomProgress:{value:0}, uOrigin:{value:[.5,.5]},
    uInvert:{value:0}, uTime:{value:0}, uRepeat:{value:[1,1]}, uOffset:{value:[0,0]},
    uResolution:{value:[w,h]}, uGlowColor:{value:[1,1,1]}, uThickness:{value:2.5}, uPortraitReach:{value:0} } });
export async function playIn(originUV:[number,number], texture:Texture) {
  Object.assign(prog.uniforms, {}); prog.uniforms.uPicture.value = texture; prog.uniforms.uOrigin.value = originUV;
  prog.uniforms.uInvert.value = 0; prog.uniforms.uProgress.value = 0; prog.uniforms.uZoomProgress.value = 0;
  sfx.play('whoosh'); await gsap.delayedCall(0.3, () => {});           // 300ms beat before the wave
  gsap.to(prog.uniforms.uZoomProgress, { value: 1, duration: 2.2, ease: 'power3.out' });
  return gsap.to(prog.uniforms.uProgress, { value: 1, duration: 2.1, ease: 'power3.out' }).then();
}
export const playOut = () => { prog.uniforms.uOrigin.value=[.5,.5]; prog.uniforms.uInvert.value=1; prog.uniforms.uProgress.value=0;
  return gsap.to(prog.uniforms.uProgress, { value: 1, duration: 1.1, ease: 'power3.out' }).then(); };
// rAF: uTime += dt; mesh.rotation.x/y = damp(pointer.y/x) * 3.5deg
```
- **Generalised use:** hero image swaps, product carousels ("next product" rings out from the click), section transitions, and "you won" moments.

### 2. Infinite horizontal ribbon gallery with velocity bend
- **Used by:** jesper (signature). Related: gilhuybrecht's speed-bend profile card, butter's pinned horizontal gallery, floema's endless tunnel.
- **Mechanics:**
  1. Virtual scroll: wheel deltaY and deltaX both feed a horizontal target.
  2. The target is soft-clamped to at most one viewport ahead of the current position with `tanh`.
  3. `current` lerps toward the target.
  4. DOM cards stay real links. They are translated and wrapped modulo the row width, so the loop is infinite.
  5. WebGL planes copy each card's rect every frame and are deformed in the vertex shader by a world-space depth S-curve plus velocity-driven "rear-up" and an edge twist.
  6. Video textures play on the cards.
- **Parameters (jesper):**
  - Wheel multiplier 1.25. Notched mouse wheels are smoothed x2 with per-frame ease .22. Touch x3.25, release fling x35.
  - Lerp **0.1 per 60fps frame**.
  - `vel = sign(t)*t²`, `t = tanh(Δ/550px)`.
  - Depth `D = W*0.2*(1+1.1*V)`. S-curve `mix(1-q², sin(πq), 1)*exp(-q²)`, span T 1.15, shift -0.2. Door lean `-0.12W`.
  - Resting bank -0.16 rad. Velocity twist **1.8 rad** at the edges (`smoothstep(.3,.9,|q|)`). Rear-up `y +0.1W·V`, `z +0.2W·V`.
  - Camera fov **75**, z 27.
  - Hover dent 0.1 with expo, 0.5 s.
  - Below 649 px the layout becomes a vertical column with no bend.
- **Simplified Clox version (no WebGL):**
  - A CSS 3D ribbon: `perspective: 1200px` on the track.
  - Each card gets `rotateY(k * normX) translateZ(-|normX|*D)` from its distance to the centre.
  - Add `skewX(vel*-8deg)` and `scale(1 - |vel|*.05)` on velocity.
  - This gets about 70% of the look for about 10% of the cost. Use the WebGL path for "premium" tier.
- **Libs:** Lenis is not needed. A 50-line virtual scroller is enough (or Lenis with `orientation:'horizontal'`, `gestureOrientation:'both'`). WebGL tier: R3F + drei `<View>`/`useTexture`/`useVideoTexture`, with each card mesh synced to its DOM rect.
- **A11y:** reduced motion gets native `overflow-x:auto` with `scroll-snap-type:x mandatory`, no bend and no inertia. Keep arrow, PageUp/PageDown and Space key handling (jesper: arrow = 100 px, page = 0.9 × viewport). The cards stay focusable anchors.
- **Sketch** (vertex shader in (studied shader, not shipped); minimal version below):
```ts
// useRibbonScroll.ts
const s = { t: 0, c: 0, v: 0 }; const W = () => innerWidth;
addEventListener('wheel', e => { e.preventDefault(); s.t += (e.deltaY + e.deltaX) * 1.25;
  const lead = s.t - s.c; s.t = s.c + Math.tanh(lead / W()) * W(); }, { passive: false });
gsap.ticker.add((_, dt) => { const r = Math.min(dt / 16.67, 2);
  s.c += (s.t - s.c) * 0.1 * r; const k = Math.tanh((s.t - s.c) / 550); s.v = k * Math.abs(k);
  cards.forEach(c => { let x = wrap(c.base - s.c, -c.w, total - c.w); c.el.style.transform = `translate3d(${x}px,0,0)`; c.sync(x) });
  uniforms.uVel.value = Math.min(1, Math.abs(s.v)); });
```
```glsl
// ribbon.vert (core of it)
uniform float uVel, uHalfW, uDepth; // uDepth = halfW*0.2*(1.+1.1*uVel)
vec4 w = modelMatrix * vec4(position,1.);
float q = w.x / uHalfW * 1.15 - 0.2;
w.z += uDepth * sin(3.14159*q) * exp(-q*q);                 // S-curve through depth
float m = smoothstep(.3,.9,abs(q)) * sign(q);
float a = -0.16 + 1.8 * uVel * m;                            // bank + velocity wring
w.yz = mat2(cos(a*.15),-sin(a*.15),sin(a*.15),cos(a*.15)) * w.yz; // roll (scaled; tune)
w.y += 0.1*uHalfW*uVel*step(q,0.); w.z += 0.2*uHalfW*uVel*step(q,0.); // rear-up on the left side
gl_Position = projectionMatrix * viewMatrix * w;
```

### 3. Pinned horizontal-scroll section (vertical scroll, sideways travel) with velocity skew
- **Used by:** butter (pinned gallery), jesper (fully horizontal), cerebrium/oryzo (pinned story sections).
- **Mechanics:** ScrollTrigger pins a section for `(trackWidth - viewport)` px of vertical scroll and scrubs `x` of the track. Lenis provides the velocity, which drives `skewX` and a subtle scale on the cards.
- **Parameters:** `scrub: 1` (about 1 s catch-up). Skew is clamped to `gsap.utils.clamp(-8, 8, velocity/300)` and set with `gsap.quickTo(el, "skewX", {duration:.5, ease:"power3"})`. Lenis settings: `lerp:.1` (butter default), `.15` (gilhuybrecht), `.06` (illoca, very floaty).
- **A11y:** reduced motion gets no pin. The section becomes a native horizontal scroller with scroll-snap.
```ts
const tl = gsap.to(track, { x: () => -(track.scrollWidth - innerWidth), ease: 'none',
  scrollTrigger: { trigger: section, pin: true, scrub: 1, end: () => '+=' + (track.scrollWidth - innerWidth), invalidateOnRefresh: true } });
const skew = gsap.quickTo(cards, 'skewX', { duration: .5, ease: 'power3' });
lenis.on('scroll', ({ velocity }) => skew(gsap.utils.clamp(-8, 8, velocity * -0.4)));
```

### 4. Cursor fluid / trail displacement field (ping-pong FBO)
- **Used by:** jesper (height field feeding the lens), lamalama (velocity field at viewport/36, splat .04, ~1.5 s fade, desktop only), lisa (64² trail fading 8%/frame), oryzo (curl-noise fluid at quarter resolution, push 25, dissipation .985), edolus (water ripple .985/frame), gilhuybrecht (saber burn).
- **Mechanics:**
  - A low-resolution float render target is updated each frame by `h = mix(c, avg4, diffuse) * decay + amp * gauss(uv - cursor, r)`.
  - The amplitude follows cursor speed.
  - A composite pass offsets the page or image UVs by the field's gradient. Optionally it adds RGB split along the gradient.
- **Parameters:**
  - Splat radius .03 to .05 of width.
  - Decay .96 to .985 per frame (about 1 to 1.5 s memory).
  - Amplitude `tanh(max(0, speed-.025)/.08)²` (jesper).
  - Resolution 1/4 of the viewport or `viewport/36` cells.
  - RGB split 0.002 to 0.006 UV.
- **Libs:** OGL `RenderTarget` ×2 with float or half-float type, or drei `useFBO`.
- **A11y:** off for reduced motion and on `(hover: none)` pointers. Pause when the tab is hidden.
- **Sketch:** (studied shader, not shipped) (sim), (studied shader, not shipped), (studied shader, not shipped). Composite:
```glsl
vec2 g = vec2(texture2D(uField, vUv+vec2(px.x,0)).r - texture2D(uField, vUv-vec2(px.x,0)).r,
              texture2D(uField, vUv+vec2(0,px.y)).r - texture2D(uField, vUv-vec2(0,px.y)).r);
vec2 uv = vUv - g * 0.08;
gl_FragColor = vec4(texture2D(uScene, uv + g*.004).r, texture2D(uScene, uv).g, texture2D(uScene, uv - g*.004).b, 1.);
```

### 5. WebGL image hover distortion and pixel/dither "develop"
- **Used by:** lamalama (images develop grey to pixel grid to photo in 1.25 s; mouse-down opens a noisy circle in 3.75 s power4.out), gilhuybrecht (hover dims siblings to 0.2), jesper (hover dent), cerebrium (hex trail).
- **Mechanics:** each `<img>` is mirrored by a WebGL plane synced to its rect (a DOM-GL sync layer). The fragment shader quantises UVs to a grid whose cell size tweens from large to 1 px. A noisy radial mask follows the pointer.
- **Parameters:** cell size 160 to 16 px over 3.75 s power3.in (lamalama loader). Pixelate to clear over 1.25 s. Hover radius .1 + noise .05 (illoca brush). Sibling dim 0.2 over 0.5 s expo.
- **Libs:** R3F + drei `<View>` (scissor-tracks DOM elements in one canvas). For a single hero, OGL is enough.
- **A11y:** plain `<img>` under the canvas is always present (alt text). With reduced motion the hover is a 150 ms opacity change.
```glsl
uniform float uCell; uniform vec2 uRes, uMouse; uniform float uHover;
vec2 cell = uCell / uRes; vec2 q = (floor(vUv / cell) + .5) * cell;
float m = smoothstep(.12, .0, distance(vUv*uRes/uRes.y, uMouse*uRes/uRes.y) + (snoise(vUv*8.)*.05)) * uHover;
vec3 pix = texture2D(uTex, q).rgb; vec3 sharp = texture2D(uTex, vUv).rgb;
gl_FragColor = vec4(mix(pix, sharp, max(m, step(uCell, 1.))), 1.);
```

### 6. Noise / gradient shader backgrounds and edge glow
- **Used by:**
  - oryzo: rainbow edge glow. Colours `#ff9cff #ff9638 #ffff22 #54ffff`, rotation `time*-5`, fades in over scroll 5.5 to 6 screens, plus a 2 s ripple from the scroll thumb.
  - floema: leaf-shadow overlay swaying with a damped spring to the cursor.
  - oryzo: dappled "gobo" light.
  - illoca: CSS grain overlay at .2.
  - edolus: film grain .04 at 24 fps.
  - lisa: background vignette.
- **Mechanics:** a full-screen fragment shader with fbm/simplex noise warped over time. Colour comes from a palette ramp, plus grain (hash over time, snapped to 24 fps so it reads as film). Edge glow is a signed distance to the screen rect, multiplied by an angular colour gradient that rotates over time.
- **Parameters:** time scale 0.05 to 0.15 (slow), grain amplitude .04 to .08 at 24 fps, edge-glow width 2 to 4 % of the short side.
- **Libs:** OGL (smallest). Pure CSS fallback: `conic-gradient` plus `filter: blur(40px)`.
- **A11y:** freeze `uTime` for reduced motion, render one frame, stop rAF.
- **Sketch:** (studied shader, not shipped), (studied shader, not shipped), (studied shader, not shipped).
```glsl
float e = min(min(vUv.x, 1.-vUv.x)*uAspect, min(vUv.y, 1.-vUv.y));      // distance to the edge
float ang = atan(vUv.y-.5, (vUv.x-.5)*uAspect) + uTime*-5.*0.0174533*10.;
vec3 c = palette(fract(ang/6.2831));                                    // 4-stop ramp
gl_FragColor = vec4(c, smoothstep(.035, 0., e) * uIntensity);
```

### 7. Masked / split text reveals (lines, words, chars), plus scramble and blur
- **Used by:** almost every site.
  - butter: words `yPercent 60→0`, 1 s, stagger .05, ease `outFast` = `cubic-bezier(0,0,0,1)`; lines .6 s, stagger .1.
  - lamalama: lines `expo.out` .85 s.
  - floema: words stagger .02.
  - gilhuybrecht: WebGL lines 1.5 s + .1 per line, `expo.out`.
  - oryzo: chars from 0.25ex and `blur(.1em)`, expoOut, scroll-scrubbed.
  - edolus: random-order chars from `blur(12px)`, 1.2 s expo.out, stagger .06.
  - cerebrium: random word order with flicker, hover scramble .5 s.
  - lisa: ScrambleText .25 s per char after a typewriter (stagger .02).
- **Mechanics:** SplitText with `mask:"lines"` (GSAP 3.13+ builds the overflow-clip wrappers), then tween `yPercent` from 100 to 0 per line or word on ScrollTrigger enter (`start:"top 85%"`, `once:true`).
- **Parameters (house defaults, from the consensus):** lines `yPercent:110→0`, 1.0 to 1.25 s, `expo.out` or `cubic-bezier(.19,1,.22,1)`, stagger .075 to .1. Chars: stagger .02 to .04. Blur variant: `filter: blur(12px)→0`, `opacity 0→1`, 1.2 s expo.out, `stagger:{each:.06, from:"random"}`.
- **A11y:** keep the real text in the DOM (SplitText adds `aria-label`). Reduced motion gets an opacity-only fade of .3 s or no animation. Never hide text when JS is disabled (start from the visible state and add a `.js-anim` class first).
```ts
useGSAP(() => { if (reduced) return;
  SplitText.create(ref.current, { type: 'lines,words', mask: 'lines', autoSplit: true, onSplit: (s) =>
    gsap.from(s.lines, { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: .08,
      scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true } }) }); }, []);
```

### 8. Magnetic buttons
- **Used by:** butter (cursor pill tilts up to ±12° as it moves), jesper (pills with an expo hover of .7 s in / .5 s out and a shader rim), cerebrium (ring cursor). The classic magnetic pull pattern is implied on CTAs *(inferred)*.
- **Mechanics:** inside a radius (about 1.5 × the button size), translate the button by `(pointer - centre) * strength` with `quickTo`. The inner label moves at 0.5 × that for parallax. Release with elastic.
- **Parameters:** strength .3 to .4, `quickTo duration .4 ease power3`, release `elastic.out(1,.4)` over .8 s.
- **A11y:** only for `(hover:hover) and (pointer:fine)` and no reduced motion. Never move the focus ring away from the element.
```ts
const xTo = gsap.quickTo(btn, 'x', { duration: .4, ease: 'power3' }), yTo = gsap.quickTo(btn, 'y', { duration: .4, ease: 'power3' });
btn.addEventListener('pointermove', e => { const r = btn.getBoundingClientRect();
  xTo((e.clientX - r.left - r.width/2) * .35); yTo((e.clientY - r.top - r.height/2) * .35); });
btn.addEventListener('pointerleave', () => gsap.to(btn, { x: 0, y: 0, duration: .8, ease: 'elastic.out(1,.4)' }));
```

### 9. Custom cursor (follower, contextual label, lens)
- **Used by:** butter ("Add butter" pill, tilts ±12° with velocity), jesper (black-hole lens post pass that shrinks near `[data-gl-shield]` buttons), cerebrium (ring fills over 9 s on click-and-hold), gilhuybrecht (3D lightsaber easter egg), edolus (cursor off at 768 px or narrower and on touch).
- **Mechanics:** a fixed element follows the pointer with a lerp. `data-cursor="label"` attributes swap its state (scale, text), and `mix-blend-mode: difference` keeps it visible on any background. Premium variant: a shader lens (jesper), a refractive disc in the post pass.
- **Parameters:** follower lerp .15 to .2 per frame (dot) and .08 (ring). State morph .35 s `expo.out`. Rotation `clamp(vx*.05, -12, 12)` degrees.
- **A11y:** never hide the native cursor on inputs or text. Disable on touch and when reduced motion is set. Hover labels are decorative (`aria-hidden`).
```ts
const pos = { x: 0, y: 0 }, tgt = { x: 0, y: 0 };
addEventListener('pointermove', e => { tgt.x = e.clientX; tgt.y = e.clientY; });
gsap.ticker.add(() => { const vx = tgt.x - pos.x; pos.x += vx*.18; pos.y += (tgt.y-pos.y)*.18;
  el.style.transform = `translate3d(${pos.x}px,${pos.y}px,0) rotate(${gsap.utils.clamp(-12,12,vx*.05)}deg)`; });
document.addEventListener('pointerover', e => { const t = (e.target as HTMLElement).closest('[data-cursor]');
  gsap.to(el, { scale: t ? 3 : 1, duration: .35, ease: 'expo.out' }); label.textContent = t?.getAttribute('data-cursor') ?? ''; });
```

### 10. Page transition wipe (route change)
- **Used by:**
  - lamalama: Swup. A noise-blob wipe of logo blocks in the next page's theme colour covers in .65 s `sine.out` and uncovers in .65 s `power4.out`, with a 0 to 100 counter.
  - floema: the old page drops `.625s expo.in`, the new page slides `1.25s expo.inOut`.
  - butter: white mask .45 s `power3.out` in, .5 s `power3.in` out.
  - cerebrium: Swup with a noisy circle and chromatic fisheye over 1.75 s power2.out.
  - jesper: shader wipe with refractive rims, and the card "flies" to the hero over 1 s with a custom bezier.
  - gilhuybrecht: .35 s mask fade.
  - edolus: .8 s chromatic diamond plus a 22-column mosaic.
- **Mechanics (Next.js App Router):**
  1. Intercept link clicks (a `TransitionLink` component, or the `next-view-transitions` package).
  2. Play the cover animation and `await` it.
  3. Call `router.push()`.
  4. In `template.tsx`, on mount, play the reveal.
  - Shader variant: run effect 1 or a noise-threshold wipe on a persistent fixed canvas that lives in `layout.tsx`.
- **Parameters:** cover .6 to .65 s (`sine.out`/`power3.out`), hold ≥ 1 frame until the new route has painted, reveal .65 to 1.25 s (`power4.out`/`expo.inOut`). Noise-wipe threshold `smoothstep(p-.1, p+.1, noise(uv*4)+uv.y*.5)`.
- **A11y:** reduced motion gets an instant swap or a 150 ms fade. Move focus to the new `<main>` heading and announce it via `aria-live` (route announcer).
```tsx
// TransitionLink.tsx
const onClick = async (e) => { e.preventDefault(); if (reduced) return router.push(href);
  await gsap.to(curtain, { scaleY: 1, transformOrigin: 'bottom', duration: .65, ease: 'sine.out' }); router.push(href); };
// app/template.tsx
useGSAP(() => { gsap.to(curtain, { scaleY: 0, transformOrigin: 'top', duration: .65, ease: 'power4.out', delay: .05 }); }, []);
```

### 11. Scroll-velocity marquee
- **Used by:** butter (logo marquee *(inferred)* and a colour cycle loop of 5 s whose speed follows scroll velocity), cerebrium (ribbons speed up on hover). Common pattern.
- **Mechanics:** an infinite `xPercent` loop with `gsap.to(track,{xPercent:-50, repeat:-1, ease:"none", duration:20})`. The timeline's `timeScale` follows Lenis velocity and its direction flips with scroll direction, then eases back to 1.
- **Parameters:** base 20 to 30 s per loop. `timeScale = 1 + |v|*.02`, clamped to 6, signed by direction. Return to base with `gsap.to(tl,{timeScale:dir, duration:.8, ease:"power2.out"})`.
- **A11y:** reduced motion makes it static (or very slow with no velocity coupling) and adds a pause button (WCAG 2.2.2 for content that moves for more than 5 s).
```ts
const tl = gsap.to(track, { xPercent: -50, ease: 'none', duration: 24, repeat: -1 });
lenis.on('scroll', ({ velocity, direction }) => { gsap.to(tl, { timeScale: direction * Math.min(6, 1 + Math.abs(velocity) * .02), duration: .2, overwrite: true });
  gsap.to(tl, { timeScale: direction, duration: .8, ease: 'power2.out', delay: .2 }); });
```

### 12. 3D tilt cards and paper "bend flip" (DOM-synced)
- **Used by:**
  - gilhuybrecht: tiles fly between layouts in 1.5 s with **per-corner stagger .225** so the card bends like paper, with fake shading. Exit .75 s `power3.inOut`. Profile card flips 180° per section and bends with velocity.
  - tiebreak: reveal plane tilts ±3.5° toward the pointer.
  - jesper: hover dent.
- **Mechanics:**
  - CSS tier: `rotateX/rotateY` from the pointer position, with `perspective(900px)`, a glare layer (`radial-gradient` at the pointer), and `translateZ` on the children for depth.
  - WebGL tier: a subdivided plane (32×32). Each vertex's progress is `clamp((p - delay(uv))/(1-maxDelay), 0, 1)`, where `delay = corner-weighted (uv.x*.6+uv.y*.4)*.225`. Add z lift `sin(π·localP)*bend`.
- **Parameters:** tilt max 8 to 12°, `quickTo .5 power3`. Glare opacity .15 to .25. Bend lift 0.1 to 0.2 × width. Flip duration 1.5 s, ease `power3.inOut`.
- **A11y:** no tilt for reduced motion or touch. Keep cards as links.
- **Sketch:** (studied shader, not shipped).
```glsl
uniform float uP; // 0..1
float d = (uv.x*.6 + (1.-uv.y)*.4) * .225;
float lp = clamp((uP - d) / (1. - .225), 0., 1.);
vec3 p = mix(uFrom, uTo, lp) + position * mix(uScaleFrom, uScaleTo, lp);
p.z += sin(3.14159*lp) * uBend;
```

### 13. UI sound design (hover ticks, transition whooshes, ambient bed with mute)
- **Used by:**
  - tiebreak: decoded SFX bank, one-shot per event. Wall hit, paddle hit, "fast" paddle hit after 6+ rallies, score player/opponent, reveal swell. Separate music bed. iOS unlock via a silent `data:audio/wav` played on the first click.
  - floema: Pizzicato, 7 mp3s (ambient beds plus a kingfisher one-shot). Unlocks on first tap, beds loop with 5 s crossfades, mute toggle, pauses on blur.
  - lisa: ambient loop starts on click. Voice lines go through an `AnalyserNode` (fft 256, read at 30 fps) driving LEDs. Music ducks to .1 under speech and returns to .5 over 2 s. Mute is persisted and audio stops on `visibilitychange`.
  - gilhuybrecht: persisted on/off, 1.5 s music crossfades, swing-speed-modulated hum, random one of two hit sounds per click.
  - edolus: 3 music layers re-mixed per scene with 1.2 s fades, about 12 event one-shots, a loop whose `playbackRate` goes up to 2x with scroll velocity.
  - usavionix: engine loops fade with key presses, pitch .85 to 1.25.
- **Mechanics:** one `AudioContext`, created and resumed only inside a user gesture (the "Enter / Sound on" click). A master `GainNode` feeds per-category gains (`music`, `sfx`, `ui`). Buffers are decoded once. One-shots are `createBufferSource()` with ±5% random `playbackRate` so repeated ticks don't machine-gun.
- **Parameters:** hover tick 20 to 40 ms, gain .15 to .25, throttled to 1 per 60 ms. Whoosh 400 to 900 ms, timed so its peak lands on the visual midpoint (tiebreak: whoosh, then a 300 ms beat, then the wave). Ambient bed gain .3 to .5, fade in 2 s, crossfade 1.5 to 5 s. Duck to .1 under voice. Scroll-coupled `playbackRate = 1 + min(1,|v|)`.
- **A11y / policy:**
  - **Never autoplay.** Default muted, with a visible persistent toggle (`aria-pressed`) and the choice saved in `localStorage`.
  - Suspend on `visibilitychange`.
  - Reduced motion does not imply mute, but whooshes tied to motion should be skipped when the motion is skipped.
```ts
// sound.ts
let ctx: AudioContext | null = null, master: GainNode; const bufs = new Map<string, AudioBuffer>();
export async function enable() { ctx ??= new AudioContext(); await ctx.resume(); master ??= ctx.createGain(); master.connect(ctx.destination);
  await Promise.all(Object.entries(SOUNDS).map(async ([k, url]) => bufs.set(k, await ctx!.decodeAudioData(await (await fetch(url)).arrayBuffer())))); }
let last = 0; export function play(k: string, { gain = .2, rate = 1, throttle = 0 } = {}) {
  if (!ctx || muted() || ctx.state !== 'running') return; const now = performance.now(); if (now - last < throttle) return; last = now;
  const s = ctx.createBufferSource(), g = ctx.createGain(); s.buffer = bufs.get(k)!; s.playbackRate.value = rate * (0.95 + Math.random()*.1);
  g.gain.value = gain; s.connect(g).connect(master); s.start(); }
export function bed(k: string) { /* loop=true, gain 0 → .4 via linearRampToValueAtTime over 2s */ }
document.addEventListener('visibilitychange', () => document.hidden ? ctx?.suspend() : ctx?.resume());
```

### 14. Scroll-scrubbed video / image sequence / 3D camera path
- **Used by:**
  - illoca: ScrollTrigger scrubs a linear tween between Theatre.js camera keyframes, plus a 49-frame image sequence.
  - oryzo: every animation is `fit(scrollOffset, a, b, from, to, ease)` per frame. A pre-baked 64-frame coaster flip at 1.25 speed.
  - edolus: about 24,000 px of wheel drives one progress through 7 scenes. Frame-rate-independent damping `1-(1-.1)^(60dt)`, snapping to keyframes after 0.15 s idle.
  - usavionix: "autoplay" scenes; any wheel tick plays to the scene end at 2000 px/s (about 2.25 s/scene).
- **Mechanics:**
  - Video: an all-keyframe encode (`-g 1`, or a short GOP of 2 to 5), with `video.currentTime = p*duration` in `onUpdate`.
  - Image sequence: draw to a `<canvas>` from preloaded WebP frames. This is smoother than video on Safari.
  - 3D: R3F `useScroll` or a ScrollTrigger progress feeding `camera.position.lerpVectors(...)` along a `CatmullRomCurve3`.
- **Parameters:** `scrub: 0.5 to 1`. Frame count 60 to 150 at 1440 px wide WebP q70. Damping `1-(1-.1)^(60*dt)`.
- **A11y:** reduced motion shows a poster frame and a static caption list. Preload progressively and show the first frame immediately.
```ts
const frames = await preload(n); const ctx2d = canvas.getContext('2d')!; const st = { f: 0 };
gsap.to(st, { f: n - 1, snap: 'f', ease: 'none', scrollTrigger: { trigger: section, start: 'top top', end: '+=300%', pin: true, scrub: .5 },
  onUpdate: () => ctx2d.drawImage(frames[st.f], 0, 0, canvas.width, canvas.height) });
```

### 15. Sticky stacking cards
- **Used by:** a common pattern in this cohort's case-study pages (cerebrium/gilhuybrecht sections) *(inferred from screenshots)*.
- **Mechanics:** each card is `position: sticky; top: calc(8vh + i*24px)`. As the next card arrives, ScrollTrigger scrubs the previous card's `scale` 1 to .92, `filter: brightness(.6)` and `rotateX(4deg)`.
- **Parameters:** scale step .04 per depth, brightness .6, scrub true, card offset 24 px.
- **A11y:** with reduced motion, sticky stays but no scale or dim (or the cards simply flow).
```ts
cards.forEach((c, i) => i < cards.length - 1 && gsap.to(c, { scale: .92, filter: 'brightness(.6)', ease: 'none',
  scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top 8%', scrub: true } }));
```

### 16. Diagonal / angled scene cut and scan wipe
- **Used by:**
  - illoca: the next scene is revealed by an edge whose angle eases from 10° to 0° with scroll.
  - usavionix: below a 225° diagonal, the photo becomes a dark dot grid ("scan"), easeInOutCubic. The loader uses the same wipe, .75 s linear.
  - lamalama: section edges dissolve into blocks.
- **Mechanics:** in the shader (or CSS `clip-path: polygon()`), `edge = dot(uv - .5, dir(angle)) - (p*2 - 1)*reach`, and the mask is `smoothstep(-soft, soft, edge)`. Optional noise jitter on the edge and a bright line at the edge.
- **Parameters:** angle 10° to 0°, softness .002 (crisp) to .05, edge line width 1 to 2 px, scrubbed.
- **Libs:** CSS `clip-path` + ScrollTrigger is enough for crisp cuts. Use a shader ((studied shader, not shipped), (studied shader, not shipped)) when the edge should glow or grid.
```ts
gsap.fromTo(next, { clipPath: 'polygon(0 100%,100% 82%,100% 100%,0 100%)' }, { clipPath: 'polygon(0 0,100% 0,100% 100%,0 100%)', ease: 'none',
  scrollTrigger: { trigger: section, start: 'top bottom', end: 'top top', scrub: true } });
```

### 17. Physics hero objects (draggable / swinging)
- **Used by:**
  - butter: R3F + Rapier keychain, six tags on rope joints. Angular damping 2.9, linear 2.3. Cursor repulsion radius 2, strength 4.4 with falloff. Intro: camera rises 1.5 s `elastic.out(1,1)`, gravity -0.25 then 1 so the tags float, then drop and swing. Glass tag ior 1.25 with chromatic .05.
  - cerebrium: springy cubes (stiffness 20/30, damping 3).
  - lisa: cables swing between cursor followers (lerp .04/.1/.02).
- **Libs:** `@react-three/rapier` + drei `MeshTransmissionMaterial`.
- **A11y:** reduced motion gives a static pose. Must not block scroll (canvas `pointer-events` only on the objects).

### 18. Odometer / rolling digits, counters, and preloaders
- **Used by:** tiebreak (MSDF score digits roll 00 to 01 before the reveal), jesper (SDF digit reels, `expo.out` with per-slot delay and motion blur along the roll), lamalama (0 to 100 counter during the transition), edolus (logo draws in a Web Worker, 1100 ms/letter, 220 ms stagger; then two black bands split over 1600 ms `cubic-bezier(.65,0,.35,1)`), oryzo (pie fill `cubic-bezier(.3,0,.66,-.3)` .5 s).
- **Mechanics (DOM):** each digit is a column of 0 to 9 inside `overflow:hidden`. Tween `yPercent = -digit*10` with `expo.out` 1.2 s, delay `i*.06` from the right.
- **A11y:** the real number goes in `aria-label`, and the columns are `aria-hidden`. Reduced motion sets the value instantly.

---

## Easing vocabulary (copy these into the generator's design tokens)

| name | value | seen at |
|---|---|---|
| expo.out | `cubic-bezier(.19,1,.22,1)` | floema, tiebreak CSS, almost every text reveal |
| outFast | `cubic-bezier(0,0,0,1)` | butter word reveals |
| butter out / in / inOut | `.2,.715,.205,.99` / `.815,.005,.81,.195` / `.835,.12,.225,.77` | butter |
| joe.in / joe.out / joe.inOut | `M0,0 C0.8,0 0.8,0.5 1,1` / `C0.2,0 0.1,1 1,1` / `C0.333,0 0,1 1,1` | illoca (default 0.8 s joe.out) |
| drawer | `cubic-bezier(.32,.72,0,1)` | cerebrium |
| back pop | `cubic-bezier(.175,.885,.32,1.275)` / `(.19,1.51,.29,.99)` | cerebrium / tiebreak |
| shake | `cubic-bezier(.36,.07,.19,.97)` | tiebreak |
| split bands | `cubic-bezier(.65,0,.35,1)` | edolus loader |
| easeOutCubic | `power3.out` | tiebreak wave 2.1 s / 1.1 s |

Duration bands seen across the 12 sites:
- Micro-hover: .35 to .5 s.
- Text and line reveals: .85 to 1.25 s.
- Page cover: .45 to .65 s; page reveal: .65 to 1.25 s.
- Hero/product reveals: 1.5 to 2.2 s.

Smooth scroll: Lenis lerp .1 (default) / .15 (snappier) / .06 (floaty). Several studios replace Lenis with a custom virtual scroll (jesper, oryzo, edolus) so the scroll position can drive WebGL directly.

## Cross-cutting implementation rules for Clox
1. **One persistent canvas** in `app/layout.tsx` (`position:fixed; inset:0; pointer-events:none`). Every WebGL effect registers with it: drei `<View>` or a small OGL scene registry. Never one canvas per component. This is what jesper, gilhuybrecht, butter, and cerebrium do.
2. **DOM is the source of truth.** WebGL planes mirror DOM rects every frame. Links, text, and alt stay in the DOM for SEO and accessibility (jesper, gilhuybrecht, lamalama).
3. **One ticker.** Use `gsap.ticker` with `lagSmoothing(0)` for Lenis, the R3F `frameloop="demand"` invalidate, and custom lerps. Frame-rate-independent damping: `x += (t-x)*(1-Math.pow(1-k, dt*60))`.
4. **Capability gate.** `const tier = reduced ? 0 : (!matchMedia('(hover:hover) and (pointer:fine)').matches || innerWidth < 768) ? 1 : 2`:
   - Tier 2 gets shaders, cursor effects, and sound.
   - Tier 1 gets CSS/GSAP only.
   - Tier 0 gets fades only.
   - jesper, gilhuybrecht, and lamalama all gate WebGL on desktop + fine pointer.
5. **Reduced motion is missing from most award sites.** Only tiebreak, butter (partially), lisa, and floema check it, and those checks are CSS-only. Clox should do better by default: a `useReducedMotion()` hook that every effect consumes.
6. **Audio is opt-in** behind an "Enter with sound / without" choice, the same pattern as tiebreak's "Start" and lisa's "[CLICK] TO START".

---

## Frames (open these to see each effect mid-motion)

Prefixes: `00_load` first seconds, `01_after_enter` after Start/Enter, `02_scroll*` mid-scroll, `03_scroll_*` settled, `10_wave_in`/`11_wave_out` the Tie Break reveal frame by frame, `11_flick`/`12_flick` Jesper's ribbon bending under a fast scroll, `13_hover` his cursor lens.


### tiebreak

[01_after_enter_0](https://www.clox.co/assets?path=design-library/fx/tiebreak/01_after_enter_0.jpg) [01_after_enter_2](https://www.clox.co/assets?path=design-library/fx/tiebreak/01_after_enter_2.jpg) [01_after_enter_4](https://www.clox.co/assets?path=design-library/fx/tiebreak/01_after_enter_4.jpg) [02_scroll0_motion1](https://www.clox.co/assets?path=design-library/fx/tiebreak/02_scroll0_motion1.jpg) [02_scroll0_motion2](https://www.clox.co/assets?path=design-library/fx/tiebreak/02_scroll0_motion2.jpg) [02_scroll0_motion3](https://www.clox.co/assets?path=design-library/fx/tiebreak/02_scroll0_motion3.jpg) [02_scroll1_motion0](https://www.clox.co/assets?path=design-library/fx/tiebreak/02_scroll1_motion0.jpg) [02_scroll1_motion1](https://www.clox.co/assets?path=design-library/fx/tiebreak/02_scroll1_motion1.jpg) [02_scroll1_motion2](https://www.clox.co/assets?path=design-library/fx/tiebreak/02_scroll1_motion2.jpg) [02_scroll1_motion3](https://www.clox.co/assets?path=design-library/fx/tiebreak/02_scroll1_motion3.jpg) [03_scroll_00](https://www.clox.co/assets?path=design-library/fx/tiebreak/03_scroll_00.jpg) [03_scroll_01](https://www.clox.co/assets?path=design-library/fx/tiebreak/03_scroll_01.jpg) [03_scroll_02](https://www.clox.co/assets?path=design-library/fx/tiebreak/03_scroll_02.jpg) [03_scroll_03](https://www.clox.co/assets?path=design-library/fx/tiebreak/03_scroll_03.jpg) [03_scroll_04](https://www.clox.co/assets?path=design-library/fx/tiebreak/03_scroll_04.jpg) [03_scroll_05](https://www.clox.co/assets?path=design-library/fx/tiebreak/03_scroll_05.jpg) [03_scroll_06](https://www.clox.co/assets?path=design-library/fx/tiebreak/03_scroll_06.jpg) [03_scroll_07](https://www.clox.co/assets?path=design-library/fx/tiebreak/03_scroll_07.jpg) [10_wave_in_00_0ms](https://www.clox.co/assets?path=design-library/fx/tiebreak/10_wave_in_00_0ms.jpg) [10_wave_in_01_115ms](https://www.clox.co/assets?path=design-library/fx/tiebreak/10_wave_in_01_115ms.jpg) [10_wave_in_02_243ms](https://www.clox.co/assets?path=design-library/fx/tiebreak/10_wave_in_02_243ms.jpg) [10_wave_in_03_365ms](https://www.clox.co/assets?path=design-library/fx/tiebreak/10_wave_in_03_365ms.jpg) [10_wave_in_04_480ms](https://www.clox.co/assets?path=design-library/fx/tiebreak/10_wave_in_04_480ms.jpg) [10_wave_in_05_591ms](https://www.clox.co/assets?path=design-library/fx/tiebreak/10_wave_in_05_591ms.jpg) [10_wave_in_06_712ms](https://www.clox.co/assets?path=design-library/fx/tiebreak/10_wave_in_06_712ms.jpg) [10_wave_in_07_834ms](https://www.clox.co/assets?path=design-library/fx/tiebreak/10_wave_in_07_834ms.jpg) [10_wave_in_08_953ms](https://www.clox.co/assets?path=design-library/fx/tiebreak/10_wave_in_08_953ms.jpg) [10_wave_in_09_1063ms](https://www.clox.co/assets?path=design-library/fx/tiebreak/10_wave_in_09_1063ms.jpg) [10_wave_in_10_1180ms](https://www.clox.co/assets?path=design-library/fx/tiebreak/10_wave_in_10_1180ms.jpg) [10_wave_in_11_1302ms](https://www.clox.co/assets?path=design-library/fx/tiebreak/10_wave_in_11_1302ms.jpg) [10_wave_in_12_1413ms](https://www.clox.co/assets?path=design-library/fx/tiebreak/10_wave_in_12_1413ms.jpg) [10_wave_in_13_1531ms](https://www.clox.co/assets?path=design-library/fx/tiebreak/10_wave_in_13_1531ms.jpg) [10_wave_in_14_1641ms](https://www.clox.co/assets?path=design-library/fx/tiebreak/10_wave_in_14_1641ms.jpg) [10_wave_in_15_1762ms](https://www.clox.co/assets?path=design-library/fx/tiebreak/10_wave_in_15_1762ms.jpg) [10_wave_in_16_1879ms](https://www.clox.co/assets?path=design-library/fx/tiebreak/10_wave_in_16_1879ms.jpg) [10_wave_in_17_1999ms](https://www.clox.co/assets?path=design-library/fx/tiebreak/10_wave_in_17_1999ms.jpg) [10_wave_in_18_2113ms](https://www.clox.co/assets?path=design-library/fx/tiebreak/10_wave_in_18_2113ms.jpg) [10_wave_in_19_2232ms](https://www.clox.co/assets?path=design-library/fx/tiebreak/10_wave_in_19_2232ms.jpg) [10_wave_in_20_2344ms](https://www.clox.co/assets?path=design-library/fx/tiebreak/10_wave_in_20_2344ms.jpg) [10_wave_in_21_2468ms](https://www.clox.co/assets?path=design-library/fx/tiebreak/10_wave_in_21_2468ms.jpg) [10_wave_in_22_2583ms](https://www.clox.co/assets?path=design-library/fx/tiebreak/10_wave_in_22_2583ms.jpg) [10_wave_in_23_2719ms](https://www.clox.co/assets?path=design-library/fx/tiebreak/10_wave_in_23_2719ms.jpg) [11_wave_out_00_0ms](https://www.clox.co/assets?path=design-library/fx/tiebreak/11_wave_out_00_0ms.jpg) [11_wave_out_01_111ms](https://www.clox.co/assets?path=design-library/fx/tiebreak/11_wave_out_01_111ms.jpg) [11_wave_out_02_213ms](https://www.clox.co/assets?path=design-library/fx/tiebreak/11_wave_out_02_213ms.jpg) [11_wave_out_03_330ms](https://www.clox.co/assets?path=design-library/fx/tiebreak/11_wave_out_03_330ms.jpg) [11_wave_out_04_447ms](https://www.clox.co/assets?path=design-library/fx/tiebreak/11_wave_out_04_447ms.jpg) [11_wave_out_05_550ms](https://www.clox.co/assets?path=design-library/fx/tiebreak/11_wave_out_05_550ms.jpg) [11_wave_out_06_661ms](https://www.clox.co/assets?path=design-library/fx/tiebreak/11_wave_out_06_661ms.jpg) [11_wave_out_07_810ms](https://www.clox.co/assets?path=design-library/fx/tiebreak/11_wave_out_07_810ms.jpg) [11_wave_out_08_928ms](https://www.clox.co/assets?path=design-library/fx/tiebreak/11_wave_out_08_928ms.jpg) [11_wave_out_09_1044ms](https://www.clox.co/assets?path=design-library/fx/tiebreak/11_wave_out_09_1044ms.jpg) [11_wave_out_10_1149ms](https://www.clox.co/assets?path=design-library/fx/tiebreak/11_wave_out_10_1149ms.jpg) [11_wave_out_11_1264ms](https://www.clox.co/assets?path=design-library/fx/tiebreak/11_wave_out_11_1264ms.jpg) [11_wave_out_12_1364ms](https://www.clox.co/assets?path=design-library/fx/tiebreak/11_wave_out_12_1364ms.jpg)


### jesper

[00_load_0](https://www.clox.co/assets?path=design-library/fx/jesper/00_load_0.jpg) [00_load_1](https://www.clox.co/assets?path=design-library/fx/jesper/00_load_1.jpg) [00_load_2](https://www.clox.co/assets?path=design-library/fx/jesper/00_load_2.jpg) [00_load_3](https://www.clox.co/assets?path=design-library/fx/jesper/00_load_3.jpg) [02_scroll0_motion0](https://www.clox.co/assets?path=design-library/fx/jesper/02_scroll0_motion0.jpg) [02_scroll0_motion1](https://www.clox.co/assets?path=design-library/fx/jesper/02_scroll0_motion1.jpg) [02_scroll0_motion2](https://www.clox.co/assets?path=design-library/fx/jesper/02_scroll0_motion2.jpg) [02_scroll0_motion3](https://www.clox.co/assets?path=design-library/fx/jesper/02_scroll0_motion3.jpg) [02_scroll1_motion0](https://www.clox.co/assets?path=design-library/fx/jesper/02_scroll1_motion0.jpg) [02_scroll1_motion1](https://www.clox.co/assets?path=design-library/fx/jesper/02_scroll1_motion1.jpg) [02_scroll1_motion2](https://www.clox.co/assets?path=design-library/fx/jesper/02_scroll1_motion2.jpg) [02_scroll1_motion3](https://www.clox.co/assets?path=design-library/fx/jesper/02_scroll1_motion3.jpg) [03_scroll_00](https://www.clox.co/assets?path=design-library/fx/jesper/03_scroll_00.jpg) [03_scroll_01](https://www.clox.co/assets?path=design-library/fx/jesper/03_scroll_01.jpg) [03_scroll_02](https://www.clox.co/assets?path=design-library/fx/jesper/03_scroll_02.jpg) [03_scroll_03](https://www.clox.co/assets?path=design-library/fx/jesper/03_scroll_03.jpg) [03_scroll_04](https://www.clox.co/assets?path=design-library/fx/jesper/03_scroll_04.jpg) [03_scroll_05](https://www.clox.co/assets?path=design-library/fx/jesper/03_scroll_05.jpg) [03_scroll_06](https://www.clox.co/assets?path=design-library/fx/jesper/03_scroll_06.jpg) [03_scroll_07](https://www.clox.co/assets?path=design-library/fx/jesper/03_scroll_07.jpg) [03_scroll_08](https://www.clox.co/assets?path=design-library/fx/jesper/03_scroll_08.jpg) [03_scroll_09](https://www.clox.co/assets?path=design-library/fx/jesper/03_scroll_09.jpg) [03_scroll_10](https://www.clox.co/assets?path=design-library/fx/jesper/03_scroll_10.jpg) [03_scroll_11](https://www.clox.co/assets?path=design-library/fx/jesper/03_scroll_11.jpg) [10_slowscroll_00_56ms](https://www.clox.co/assets?path=design-library/fx/jesper/10_slowscroll_00_56ms.jpg) [10_slowscroll_01_324ms](https://www.clox.co/assets?path=design-library/fx/jesper/10_slowscroll_01_324ms.jpg) [10_slowscroll_02_581ms](https://www.clox.co/assets?path=design-library/fx/jesper/10_slowscroll_02_581ms.jpg) [10_slowscroll_03_841ms](https://www.clox.co/assets?path=design-library/fx/jesper/10_slowscroll_03_841ms.jpg) [10_slowscroll_04_1108ms](https://www.clox.co/assets?path=design-library/fx/jesper/10_slowscroll_04_1108ms.jpg) [10_slowscroll_05_1360ms](https://www.clox.co/assets?path=design-library/fx/jesper/10_slowscroll_05_1360ms.jpg) [11_flick_fwd_00_3164ms](https://www.clox.co/assets?path=design-library/fx/jesper/11_flick_fwd_00_3164ms.jpg) [11_flick_fwd_01_3267ms](https://www.clox.co/assets?path=design-library/fx/jesper/11_flick_fwd_01_3267ms.jpg) [11_flick_fwd_02_3386ms](https://www.clox.co/assets?path=design-library/fx/jesper/11_flick_fwd_02_3386ms.jpg) [11_flick_fwd_03_3531ms](https://www.clox.co/assets?path=design-library/fx/jesper/11_flick_fwd_03_3531ms.jpg) [11_flick_fwd_04_3647ms](https://www.clox.co/assets?path=design-library/fx/jesper/11_flick_fwd_04_3647ms.jpg) [11_flick_fwd_05_3738ms](https://www.clox.co/assets?path=design-library/fx/jesper/11_flick_fwd_05_3738ms.jpg) [11_flick_fwd_06_3843ms](https://www.clox.co/assets?path=design-library/fx/jesper/11_flick_fwd_06_3843ms.jpg) [11_flick_fwd_07_3941ms](https://www.clox.co/assets?path=design-library/fx/jesper/11_flick_fwd_07_3941ms.jpg) [11_flick_fwd_08_4036ms](https://www.clox.co/assets?path=design-library/fx/jesper/11_flick_fwd_08_4036ms.jpg) [11_flick_fwd_09_4156ms](https://www.clox.co/assets?path=design-library/fx/jesper/11_flick_fwd_09_4156ms.jpg) [11_flick_fwd_10_4283ms](https://www.clox.co/assets?path=design-library/fx/jesper/11_flick_fwd_10_4283ms.jpg) [12_flick_back_00_6361ms](https://www.clox.co/assets?path=design-library/fx/jesper/12_flick_back_00_6361ms.jpg) [12_flick_back_01_6454ms](https://www.clox.co/assets?path=design-library/fx/jesper/12_flick_back_01_6454ms.jpg) [12_flick_back_02_6553ms](https://www.clox.co/assets?path=design-library/fx/jesper/12_flick_back_02_6553ms.jpg) [12_flick_back_03_6658ms](https://www.clox.co/assets?path=design-library/fx/jesper/12_flick_back_03_6658ms.jpg) [12_flick_back_04_6750ms](https://www.clox.co/assets?path=design-library/fx/jesper/12_flick_back_04_6750ms.jpg) [12_flick_back_05_6856ms](https://www.clox.co/assets?path=design-library/fx/jesper/12_flick_back_05_6856ms.jpg) [12_flick_back_06_6953ms](https://www.clox.co/assets?path=design-library/fx/jesper/12_flick_back_06_6953ms.jpg) [12_flick_back_07_7065ms](https://www.clox.co/assets?path=design-library/fx/jesper/12_flick_back_07_7065ms.jpg) [12_flick_back_08_7174ms](https://www.clox.co/assets?path=design-library/fx/jesper/12_flick_back_08_7174ms.jpg) [12_flick_back_09_7271ms](https://www.clox.co/assets?path=design-library/fx/jesper/12_flick_back_09_7271ms.jpg) [12_flick_back_10_7379ms](https://www.clox.co/assets?path=design-library/fx/jesper/12_flick_back_10_7379ms.jpg) [13_hover_center_00_7403ms](https://www.clox.co/assets?path=design-library/fx/jesper/13_hover_center_00_7403ms.jpg) [13_hover_center_01_7913ms](https://www.clox.co/assets?path=design-library/fx/jesper/13_hover_center_01_7913ms.jpg) [13_hover_center_02_8416ms](https://www.clox.co/assets?path=design-library/fx/jesper/13_hover_center_02_8416ms.jpg) [13_hover_center_03_8920ms](https://www.clox.co/assets?path=design-library/fx/jesper/13_hover_center_03_8920ms.jpg) [13_hover_center_04_9428ms](https://www.clox.co/assets?path=design-library/fx/jesper/13_hover_center_04_9428ms.jpg) [13_hover_center_05_9954ms](https://www.clox.co/assets?path=design-library/fx/jesper/13_hover_center_05_9954ms.jpg) [13_hover_center_06_10466ms](https://www.clox.co/assets?path=design-library/fx/jesper/13_hover_center_06_10466ms.jpg) [13_hover_center_07_10979ms](https://www.clox.co/assets?path=design-library/fx/jesper/13_hover_center_07_10979ms.jpg)


### butter

[00_load_0](https://www.clox.co/assets?path=design-library/fx/butter/00_load_0.jpg) [00_load_1](https://www.clox.co/assets?path=design-library/fx/butter/00_load_1.jpg) [00_load_2](https://www.clox.co/assets?path=design-library/fx/butter/00_load_2.jpg) [00_load_3](https://www.clox.co/assets?path=design-library/fx/butter/00_load_3.jpg) [02_scroll0_motion0](https://www.clox.co/assets?path=design-library/fx/butter/02_scroll0_motion0.jpg) [02_scroll0_motion1](https://www.clox.co/assets?path=design-library/fx/butter/02_scroll0_motion1.jpg) [02_scroll0_motion2](https://www.clox.co/assets?path=design-library/fx/butter/02_scroll0_motion2.jpg) [02_scroll0_motion3](https://www.clox.co/assets?path=design-library/fx/butter/02_scroll0_motion3.jpg) [02_scroll1_motion0](https://www.clox.co/assets?path=design-library/fx/butter/02_scroll1_motion0.jpg) [02_scroll1_motion1](https://www.clox.co/assets?path=design-library/fx/butter/02_scroll1_motion1.jpg) [02_scroll1_motion2](https://www.clox.co/assets?path=design-library/fx/butter/02_scroll1_motion2.jpg) [02_scroll1_motion3](https://www.clox.co/assets?path=design-library/fx/butter/02_scroll1_motion3.jpg) [03_scroll_00](https://www.clox.co/assets?path=design-library/fx/butter/03_scroll_00.jpg) [03_scroll_01](https://www.clox.co/assets?path=design-library/fx/butter/03_scroll_01.jpg) [03_scroll_02](https://www.clox.co/assets?path=design-library/fx/butter/03_scroll_02.jpg) [03_scroll_03](https://www.clox.co/assets?path=design-library/fx/butter/03_scroll_03.jpg) [03_scroll_04](https://www.clox.co/assets?path=design-library/fx/butter/03_scroll_04.jpg) [03_scroll_05](https://www.clox.co/assets?path=design-library/fx/butter/03_scroll_05.jpg) [03_scroll_06](https://www.clox.co/assets?path=design-library/fx/butter/03_scroll_06.jpg) [03_scroll_07](https://www.clox.co/assets?path=design-library/fx/butter/03_scroll_07.jpg) [03_scroll_08](https://www.clox.co/assets?path=design-library/fx/butter/03_scroll_08.jpg) [03_scroll_09](https://www.clox.co/assets?path=design-library/fx/butter/03_scroll_09.jpg)


### cerebrium

[00_load_0](https://www.clox.co/assets?path=design-library/fx/cerebrium/00_load_0.jpg) [00_load_1](https://www.clox.co/assets?path=design-library/fx/cerebrium/00_load_1.jpg) [00_load_3](https://www.clox.co/assets?path=design-library/fx/cerebrium/00_load_3.jpg) [02_scroll0_motion0](https://www.clox.co/assets?path=design-library/fx/cerebrium/02_scroll0_motion0.jpg) [02_scroll0_motion1](https://www.clox.co/assets?path=design-library/fx/cerebrium/02_scroll0_motion1.jpg) [02_scroll0_motion2](https://www.clox.co/assets?path=design-library/fx/cerebrium/02_scroll0_motion2.jpg) [02_scroll0_motion3](https://www.clox.co/assets?path=design-library/fx/cerebrium/02_scroll0_motion3.jpg) [02_scroll1_motion0](https://www.clox.co/assets?path=design-library/fx/cerebrium/02_scroll1_motion0.jpg) [02_scroll1_motion1](https://www.clox.co/assets?path=design-library/fx/cerebrium/02_scroll1_motion1.jpg) [02_scroll1_motion2](https://www.clox.co/assets?path=design-library/fx/cerebrium/02_scroll1_motion2.jpg) [02_scroll1_motion3](https://www.clox.co/assets?path=design-library/fx/cerebrium/02_scroll1_motion3.jpg) [03_scroll_00](https://www.clox.co/assets?path=design-library/fx/cerebrium/03_scroll_00.jpg) [03_scroll_01](https://www.clox.co/assets?path=design-library/fx/cerebrium/03_scroll_01.jpg) [03_scroll_02](https://www.clox.co/assets?path=design-library/fx/cerebrium/03_scroll_02.jpg) [03_scroll_03](https://www.clox.co/assets?path=design-library/fx/cerebrium/03_scroll_03.jpg) [03_scroll_04](https://www.clox.co/assets?path=design-library/fx/cerebrium/03_scroll_04.jpg) [03_scroll_05](https://www.clox.co/assets?path=design-library/fx/cerebrium/03_scroll_05.jpg) [03_scroll_06](https://www.clox.co/assets?path=design-library/fx/cerebrium/03_scroll_06.jpg) [03_scroll_07](https://www.clox.co/assets?path=design-library/fx/cerebrium/03_scroll_07.jpg) [03_scroll_08](https://www.clox.co/assets?path=design-library/fx/cerebrium/03_scroll_08.jpg) [03_scroll_09](https://www.clox.co/assets?path=design-library/fx/cerebrium/03_scroll_09.jpg)


### edolus

[00_load_0](https://www.clox.co/assets?path=design-library/fx/edolus/00_load_0.jpg) [00_load_1](https://www.clox.co/assets?path=design-library/fx/edolus/00_load_1.jpg) [00_load_2](https://www.clox.co/assets?path=design-library/fx/edolus/00_load_2.jpg) [00_load_3](https://www.clox.co/assets?path=design-library/fx/edolus/00_load_3.jpg) [02_scroll0_motion0](https://www.clox.co/assets?path=design-library/fx/edolus/02_scroll0_motion0.jpg) [02_scroll0_motion1](https://www.clox.co/assets?path=design-library/fx/edolus/02_scroll0_motion1.jpg) [02_scroll0_motion2](https://www.clox.co/assets?path=design-library/fx/edolus/02_scroll0_motion2.jpg) [02_scroll1_motion0](https://www.clox.co/assets?path=design-library/fx/edolus/02_scroll1_motion0.jpg) [02_scroll1_motion1](https://www.clox.co/assets?path=design-library/fx/edolus/02_scroll1_motion1.jpg) [02_scroll1_motion2](https://www.clox.co/assets?path=design-library/fx/edolus/02_scroll1_motion2.jpg) [02_scroll1_motion3](https://www.clox.co/assets?path=design-library/fx/edolus/02_scroll1_motion3.jpg) [03_scroll_00](https://www.clox.co/assets?path=design-library/fx/edolus/03_scroll_00.jpg) [03_scroll_01](https://www.clox.co/assets?path=design-library/fx/edolus/03_scroll_01.jpg) [03_scroll_02](https://www.clox.co/assets?path=design-library/fx/edolus/03_scroll_02.jpg) [03_scroll_03](https://www.clox.co/assets?path=design-library/fx/edolus/03_scroll_03.jpg) [03_scroll_04](https://www.clox.co/assets?path=design-library/fx/edolus/03_scroll_04.jpg) [03_scroll_05](https://www.clox.co/assets?path=design-library/fx/edolus/03_scroll_05.jpg) [03_scroll_06](https://www.clox.co/assets?path=design-library/fx/edolus/03_scroll_06.jpg) [03_scroll_07](https://www.clox.co/assets?path=design-library/fx/edolus/03_scroll_07.jpg) [03_scroll_08](https://www.clox.co/assets?path=design-library/fx/edolus/03_scroll_08.jpg) [03_scroll_09](https://www.clox.co/assets?path=design-library/fx/edolus/03_scroll_09.jpg)


### floema

[00_load_0](https://www.clox.co/assets?path=design-library/fx/floema/00_load_0.jpg) [00_load_1](https://www.clox.co/assets?path=design-library/fx/floema/00_load_1.jpg) [00_load_2](https://www.clox.co/assets?path=design-library/fx/floema/00_load_2.jpg) [00_load_3](https://www.clox.co/assets?path=design-library/fx/floema/00_load_3.jpg) [01_after_enter_0](https://www.clox.co/assets?path=design-library/fx/floema/01_after_enter_0.jpg) [01_after_enter_1](https://www.clox.co/assets?path=design-library/fx/floema/01_after_enter_1.jpg) [01_after_enter_2](https://www.clox.co/assets?path=design-library/fx/floema/01_after_enter_2.jpg) [01_after_enter_3](https://www.clox.co/assets?path=design-library/fx/floema/01_after_enter_3.jpg) [01_after_enter_4](https://www.clox.co/assets?path=design-library/fx/floema/01_after_enter_4.jpg) [02_scroll0_motion0](https://www.clox.co/assets?path=design-library/fx/floema/02_scroll0_motion0.jpg) [02_scroll0_motion1](https://www.clox.co/assets?path=design-library/fx/floema/02_scroll0_motion1.jpg) [02_scroll0_motion2](https://www.clox.co/assets?path=design-library/fx/floema/02_scroll0_motion2.jpg) [02_scroll0_motion3](https://www.clox.co/assets?path=design-library/fx/floema/02_scroll0_motion3.jpg) [02_scroll1_motion0](https://www.clox.co/assets?path=design-library/fx/floema/02_scroll1_motion0.jpg) [02_scroll1_motion1](https://www.clox.co/assets?path=design-library/fx/floema/02_scroll1_motion1.jpg) [02_scroll1_motion2](https://www.clox.co/assets?path=design-library/fx/floema/02_scroll1_motion2.jpg) [02_scroll1_motion3](https://www.clox.co/assets?path=design-library/fx/floema/02_scroll1_motion3.jpg) [03_scroll_00](https://www.clox.co/assets?path=design-library/fx/floema/03_scroll_00.jpg) [03_scroll_01](https://www.clox.co/assets?path=design-library/fx/floema/03_scroll_01.jpg) [03_scroll_02](https://www.clox.co/assets?path=design-library/fx/floema/03_scroll_02.jpg) [03_scroll_03](https://www.clox.co/assets?path=design-library/fx/floema/03_scroll_03.jpg) [03_scroll_04](https://www.clox.co/assets?path=design-library/fx/floema/03_scroll_04.jpg) [03_scroll_05](https://www.clox.co/assets?path=design-library/fx/floema/03_scroll_05.jpg) [03_scroll_06](https://www.clox.co/assets?path=design-library/fx/floema/03_scroll_06.jpg) [03_scroll_07](https://www.clox.co/assets?path=design-library/fx/floema/03_scroll_07.jpg) [03_scroll_08](https://www.clox.co/assets?path=design-library/fx/floema/03_scroll_08.jpg) [03_scroll_09](https://www.clox.co/assets?path=design-library/fx/floema/03_scroll_09.jpg)


### gilhuybrecht

[00_load_0](https://www.clox.co/assets?path=design-library/fx/gilhuybrecht/00_load_0.jpg) [00_load_1](https://www.clox.co/assets?path=design-library/fx/gilhuybrecht/00_load_1.jpg) [00_load_2](https://www.clox.co/assets?path=design-library/fx/gilhuybrecht/00_load_2.jpg) [00_load_3](https://www.clox.co/assets?path=design-library/fx/gilhuybrecht/00_load_3.jpg) [02_scroll0_motion0](https://www.clox.co/assets?path=design-library/fx/gilhuybrecht/02_scroll0_motion0.jpg) [02_scroll0_motion1](https://www.clox.co/assets?path=design-library/fx/gilhuybrecht/02_scroll0_motion1.jpg) [02_scroll0_motion2](https://www.clox.co/assets?path=design-library/fx/gilhuybrecht/02_scroll0_motion2.jpg) [02_scroll0_motion3](https://www.clox.co/assets?path=design-library/fx/gilhuybrecht/02_scroll0_motion3.jpg) [02_scroll1_motion0](https://www.clox.co/assets?path=design-library/fx/gilhuybrecht/02_scroll1_motion0.jpg) [02_scroll1_motion1](https://www.clox.co/assets?path=design-library/fx/gilhuybrecht/02_scroll1_motion1.jpg) [02_scroll1_motion2](https://www.clox.co/assets?path=design-library/fx/gilhuybrecht/02_scroll1_motion2.jpg) [02_scroll1_motion3](https://www.clox.co/assets?path=design-library/fx/gilhuybrecht/02_scroll1_motion3.jpg) [03_scroll_00](https://www.clox.co/assets?path=design-library/fx/gilhuybrecht/03_scroll_00.jpg) [03_scroll_01](https://www.clox.co/assets?path=design-library/fx/gilhuybrecht/03_scroll_01.jpg) [03_scroll_02](https://www.clox.co/assets?path=design-library/fx/gilhuybrecht/03_scroll_02.jpg) [03_scroll_03](https://www.clox.co/assets?path=design-library/fx/gilhuybrecht/03_scroll_03.jpg) [03_scroll_04](https://www.clox.co/assets?path=design-library/fx/gilhuybrecht/03_scroll_04.jpg) [03_scroll_05](https://www.clox.co/assets?path=design-library/fx/gilhuybrecht/03_scroll_05.jpg) [03_scroll_06](https://www.clox.co/assets?path=design-library/fx/gilhuybrecht/03_scroll_06.jpg) [03_scroll_07](https://www.clox.co/assets?path=design-library/fx/gilhuybrecht/03_scroll_07.jpg) [03_scroll_08](https://www.clox.co/assets?path=design-library/fx/gilhuybrecht/03_scroll_08.jpg) [03_scroll_09](https://www.clox.co/assets?path=design-library/fx/gilhuybrecht/03_scroll_09.jpg)


### illoca

[00_load_0](https://www.clox.co/assets?path=design-library/fx/illoca/00_load_0.jpg) [02_scroll0_motion0](https://www.clox.co/assets?path=design-library/fx/illoca/02_scroll0_motion0.jpg) [02_scroll0_motion1](https://www.clox.co/assets?path=design-library/fx/illoca/02_scroll0_motion1.jpg) [02_scroll0_motion2](https://www.clox.co/assets?path=design-library/fx/illoca/02_scroll0_motion2.jpg) [02_scroll0_motion3](https://www.clox.co/assets?path=design-library/fx/illoca/02_scroll0_motion3.jpg) [02_scroll1_motion0](https://www.clox.co/assets?path=design-library/fx/illoca/02_scroll1_motion0.jpg) [02_scroll1_motion1](https://www.clox.co/assets?path=design-library/fx/illoca/02_scroll1_motion1.jpg) [02_scroll1_motion2](https://www.clox.co/assets?path=design-library/fx/illoca/02_scroll1_motion2.jpg) [02_scroll1_motion3](https://www.clox.co/assets?path=design-library/fx/illoca/02_scroll1_motion3.jpg) [03_scroll_00](https://www.clox.co/assets?path=design-library/fx/illoca/03_scroll_00.jpg) [03_scroll_01](https://www.clox.co/assets?path=design-library/fx/illoca/03_scroll_01.jpg) [03_scroll_02](https://www.clox.co/assets?path=design-library/fx/illoca/03_scroll_02.jpg) [03_scroll_03](https://www.clox.co/assets?path=design-library/fx/illoca/03_scroll_03.jpg) [03_scroll_04](https://www.clox.co/assets?path=design-library/fx/illoca/03_scroll_04.jpg) [03_scroll_05](https://www.clox.co/assets?path=design-library/fx/illoca/03_scroll_05.jpg) [03_scroll_06](https://www.clox.co/assets?path=design-library/fx/illoca/03_scroll_06.jpg) [03_scroll_07](https://www.clox.co/assets?path=design-library/fx/illoca/03_scroll_07.jpg) [03_scroll_08](https://www.clox.co/assets?path=design-library/fx/illoca/03_scroll_08.jpg) [03_scroll_09](https://www.clox.co/assets?path=design-library/fx/illoca/03_scroll_09.jpg)


### lamalama

[00_load_0](https://www.clox.co/assets?path=design-library/fx/lamalama/00_load_0.jpg) [00_load_1](https://www.clox.co/assets?path=design-library/fx/lamalama/00_load_1.jpg) [00_load_2](https://www.clox.co/assets?path=design-library/fx/lamalama/00_load_2.jpg) [02_scroll0_motion0](https://www.clox.co/assets?path=design-library/fx/lamalama/02_scroll0_motion0.jpg) [02_scroll0_motion1](https://www.clox.co/assets?path=design-library/fx/lamalama/02_scroll0_motion1.jpg) [02_scroll0_motion2](https://www.clox.co/assets?path=design-library/fx/lamalama/02_scroll0_motion2.jpg) [02_scroll0_motion3](https://www.clox.co/assets?path=design-library/fx/lamalama/02_scroll0_motion3.jpg) [02_scroll1_motion0](https://www.clox.co/assets?path=design-library/fx/lamalama/02_scroll1_motion0.jpg) [02_scroll1_motion1](https://www.clox.co/assets?path=design-library/fx/lamalama/02_scroll1_motion1.jpg) [02_scroll1_motion2](https://www.clox.co/assets?path=design-library/fx/lamalama/02_scroll1_motion2.jpg) [02_scroll1_motion3](https://www.clox.co/assets?path=design-library/fx/lamalama/02_scroll1_motion3.jpg) [03_scroll_00](https://www.clox.co/assets?path=design-library/fx/lamalama/03_scroll_00.jpg) [03_scroll_01](https://www.clox.co/assets?path=design-library/fx/lamalama/03_scroll_01.jpg) [03_scroll_02](https://www.clox.co/assets?path=design-library/fx/lamalama/03_scroll_02.jpg) [03_scroll_03](https://www.clox.co/assets?path=design-library/fx/lamalama/03_scroll_03.jpg) [03_scroll_04](https://www.clox.co/assets?path=design-library/fx/lamalama/03_scroll_04.jpg) [03_scroll_05](https://www.clox.co/assets?path=design-library/fx/lamalama/03_scroll_05.jpg) [03_scroll_06](https://www.clox.co/assets?path=design-library/fx/lamalama/03_scroll_06.jpg) [03_scroll_07](https://www.clox.co/assets?path=design-library/fx/lamalama/03_scroll_07.jpg) [03_scroll_08](https://www.clox.co/assets?path=design-library/fx/lamalama/03_scroll_08.jpg) [03_scroll_09](https://www.clox.co/assets?path=design-library/fx/lamalama/03_scroll_09.jpg)


### lisa

[00_load_0](https://www.clox.co/assets?path=design-library/fx/lisa/00_load_0.jpg) [00_load_1](https://www.clox.co/assets?path=design-library/fx/lisa/00_load_1.jpg) [00_load_2](https://www.clox.co/assets?path=design-library/fx/lisa/00_load_2.jpg) [00_load_3](https://www.clox.co/assets?path=design-library/fx/lisa/00_load_3.jpg) [02_scroll0_motion0](https://www.clox.co/assets?path=design-library/fx/lisa/02_scroll0_motion0.jpg) [02_scroll0_motion1](https://www.clox.co/assets?path=design-library/fx/lisa/02_scroll0_motion1.jpg) [02_scroll0_motion2](https://www.clox.co/assets?path=design-library/fx/lisa/02_scroll0_motion2.jpg) [02_scroll0_motion3](https://www.clox.co/assets?path=design-library/fx/lisa/02_scroll0_motion3.jpg) [02_scroll1_motion0](https://www.clox.co/assets?path=design-library/fx/lisa/02_scroll1_motion0.jpg) [02_scroll1_motion1](https://www.clox.co/assets?path=design-library/fx/lisa/02_scroll1_motion1.jpg) [02_scroll1_motion2](https://www.clox.co/assets?path=design-library/fx/lisa/02_scroll1_motion2.jpg) [02_scroll1_motion3](https://www.clox.co/assets?path=design-library/fx/lisa/02_scroll1_motion3.jpg) [03_scroll_00](https://www.clox.co/assets?path=design-library/fx/lisa/03_scroll_00.jpg) [03_scroll_01](https://www.clox.co/assets?path=design-library/fx/lisa/03_scroll_01.jpg) [03_scroll_02](https://www.clox.co/assets?path=design-library/fx/lisa/03_scroll_02.jpg) [03_scroll_03](https://www.clox.co/assets?path=design-library/fx/lisa/03_scroll_03.jpg) [03_scroll_04](https://www.clox.co/assets?path=design-library/fx/lisa/03_scroll_04.jpg) [03_scroll_05](https://www.clox.co/assets?path=design-library/fx/lisa/03_scroll_05.jpg) [03_scroll_06](https://www.clox.co/assets?path=design-library/fx/lisa/03_scroll_06.jpg) [03_scroll_07](https://www.clox.co/assets?path=design-library/fx/lisa/03_scroll_07.jpg) [03_scroll_08](https://www.clox.co/assets?path=design-library/fx/lisa/03_scroll_08.jpg) [03_scroll_09](https://www.clox.co/assets?path=design-library/fx/lisa/03_scroll_09.jpg)


### oryzo

[00_load_0](https://www.clox.co/assets?path=design-library/fx/oryzo/00_load_0.jpg) [00_load_1](https://www.clox.co/assets?path=design-library/fx/oryzo/00_load_1.jpg) [02_scroll0_motion1](https://www.clox.co/assets?path=design-library/fx/oryzo/02_scroll0_motion1.jpg) [02_scroll0_motion2](https://www.clox.co/assets?path=design-library/fx/oryzo/02_scroll0_motion2.jpg) [02_scroll0_motion3](https://www.clox.co/assets?path=design-library/fx/oryzo/02_scroll0_motion3.jpg) [02_scroll1_motion0](https://www.clox.co/assets?path=design-library/fx/oryzo/02_scroll1_motion0.jpg) [02_scroll1_motion1](https://www.clox.co/assets?path=design-library/fx/oryzo/02_scroll1_motion1.jpg) [02_scroll1_motion2](https://www.clox.co/assets?path=design-library/fx/oryzo/02_scroll1_motion2.jpg) [02_scroll1_motion3](https://www.clox.co/assets?path=design-library/fx/oryzo/02_scroll1_motion3.jpg) [03_scroll_00](https://www.clox.co/assets?path=design-library/fx/oryzo/03_scroll_00.jpg) [03_scroll_01](https://www.clox.co/assets?path=design-library/fx/oryzo/03_scroll_01.jpg) [03_scroll_02](https://www.clox.co/assets?path=design-library/fx/oryzo/03_scroll_02.jpg) [03_scroll_03](https://www.clox.co/assets?path=design-library/fx/oryzo/03_scroll_03.jpg) [03_scroll_04](https://www.clox.co/assets?path=design-library/fx/oryzo/03_scroll_04.jpg) [03_scroll_05](https://www.clox.co/assets?path=design-library/fx/oryzo/03_scroll_05.jpg) [03_scroll_06](https://www.clox.co/assets?path=design-library/fx/oryzo/03_scroll_06.jpg) [03_scroll_07](https://www.clox.co/assets?path=design-library/fx/oryzo/03_scroll_07.jpg) [03_scroll_08](https://www.clox.co/assets?path=design-library/fx/oryzo/03_scroll_08.jpg) [03_scroll_09](https://www.clox.co/assets?path=design-library/fx/oryzo/03_scroll_09.jpg)


### usavionix

[00_load_0](https://www.clox.co/assets?path=design-library/fx/usavionix/00_load_0.jpg) [02_scroll0_motion1](https://www.clox.co/assets?path=design-library/fx/usavionix/02_scroll0_motion1.jpg) [02_scroll0_motion2](https://www.clox.co/assets?path=design-library/fx/usavionix/02_scroll0_motion2.jpg) [02_scroll0_motion3](https://www.clox.co/assets?path=design-library/fx/usavionix/02_scroll0_motion3.jpg) [02_scroll1_motion0](https://www.clox.co/assets?path=design-library/fx/usavionix/02_scroll1_motion0.jpg) [02_scroll1_motion1](https://www.clox.co/assets?path=design-library/fx/usavionix/02_scroll1_motion1.jpg) [02_scroll1_motion2](https://www.clox.co/assets?path=design-library/fx/usavionix/02_scroll1_motion2.jpg) [02_scroll1_motion3](https://www.clox.co/assets?path=design-library/fx/usavionix/02_scroll1_motion3.jpg) [03_scroll_00](https://www.clox.co/assets?path=design-library/fx/usavionix/03_scroll_00.jpg) [03_scroll_01](https://www.clox.co/assets?path=design-library/fx/usavionix/03_scroll_01.jpg) [03_scroll_02](https://www.clox.co/assets?path=design-library/fx/usavionix/03_scroll_02.jpg) [03_scroll_03](https://www.clox.co/assets?path=design-library/fx/usavionix/03_scroll_03.jpg) [03_scroll_04](https://www.clox.co/assets?path=design-library/fx/usavionix/03_scroll_04.jpg) [03_scroll_05](https://www.clox.co/assets?path=design-library/fx/usavionix/03_scroll_05.jpg) [03_scroll_06](https://www.clox.co/assets?path=design-library/fx/usavionix/03_scroll_06.jpg) [03_scroll_07](https://www.clox.co/assets?path=design-library/fx/usavionix/03_scroll_07.jpg) [03_scroll_08](https://www.clox.co/assets?path=design-library/fx/usavionix/03_scroll_08.jpg) [03_scroll_09](https://www.clox.co/assets?path=design-library/fx/usavionix/03_scroll_09.jpg)
