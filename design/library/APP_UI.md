# App UI library: how the best real products are built

Measured from Linear, Attio, Things, Midday, Stripe, Vercel, Cal.com, Supabase,
Tremor and shadcn (live DOM measurements, open-source code and screenshots),
October 2026. Every screenshot below opens in a browser or in your image
reader (download it with node fetch, then Read it). Use them: LOOK at the
exemplar for the screen you are building before you build it, and match its
structure, sizes, density and restraint in this app's own tokens.

Never copy a reference's logo, wordmark, product name or copy. AGPL code
(Midday, Dub) is for studying numbers only; MIT/Apache code may be adapted.


Built 2026-10-03 for the Clox app builder. Every rule here is backed by (a) a screenshot in `shots/`, (b) live computed-style measurements taken with headless Chromium in `measurements (not shipped) *.json`, or (c) source code in `src/` (path + license given). Numbers are CSS px at 1x.

Legend for evidence tags: **[M]** measured from live DOM (getComputedStyle), **[C]** read from source code, **[S]** read off a screenshot.

---

## 0. Global rules for product UI (read this first)

These are the rules every generated app screen must pass. They are the overlap of Linear, Midday, Attio, Things, Supabase, cal.com, Tremor and shadcn, not opinions.

### 0.1 Type scale for apps (not marketing pages)

| Role | Size / line-height / weight | Evidence |
|---|---|---|
| Page title (H1 inside an app) | **20px/28px 600** (Tremor, cal.com booker), **24px/32px 600-700, tracking -0.025em** (shadcn-admin, tasks). Never above 30px. | [M] tremor-overview, cal-booker, shadcn-admin-dash |
| Topbar title (when the header carries the title) | 16px/24px 500 | [M] shadcn dashboard-01 |
| Section / card title | 16px 600 (shadcn Card), 14px 600-700 (Tremor KPI), 18px 500 (settings section) | [C] |
| Body / table cells / nav items / buttons | **14px/20px**, 400 body, 500 for labels and buttons | [M] every app measured: 14px is 60-80% of all text nodes |
| Meta / secondary / badges / group labels | **12px/16px**, 400-500, muted color | [M] |
| Micro (axis ticks, tag chips, tooltip) | 10-11px, only for chart ticks and chips | [C] midday |
| KPI value | 20-30px, 500-600, `tabular-nums` | [C] shadcn section-cards 24px -> 30px at >=250px card; Tremor 20px; Midday 20px (small) / 30px (chart card) |
| Hero numbers on a single-object detail (balance, amount) | 32-38px, may use a display serif | [C] midday sheet amount 36px serif; [S] Dribbble finance-app-01 balance ~32px |

Rules:
- **Max heading size in an app view: 30px.** 24px is the common default. A 48px+ headline is a marketing-page pattern and is the number-one tell of AI-generated "app" UI.
- **Only 3-4 sizes per screen.** Measured text-size histograms: shadcn dashboard-01 uses 14/12/16/30; Tremor overview uses 12/14/16/20; cal.com booker uses 14/16/12/20. That is it.
- **Weights: 400, 500, 600 only.** 700 for an H1 at most. Supabase uses 450 for body via a variable font [M].
- **Negative tracking only on 20px+**: -0.025em (shadcn-admin H1 `-0.6px` at 24px [M]; Supabase H1 `-0.7px` at 28px [M]). Never letter-space body text.
- **Numbers**: `font-variant-numeric: tabular-nums` on any column, KPI, timer or price; right-align numeric table columns.
- Fonts in the wild: Inter (Tremor, shadcn-admin, Supabase), Geist (shadcn v4, Tremor planner), Hedvig Letters Sans + Serif (Midday), Cal Sans for display (cal.com). One sans for UI; an optional display/serif face reserved for a greeting or hero number only.

### 0.2 Density and spacing

- **4px base grid.** Gaps that actually occur: 4 (between nav items), 8 (icon-to-label, inside controls), 12 (between small cards), 16 (card grid gap, page gutter mobile), 24 (card padding, page gutter desktop, section gap), 32-48 (between major sections).
- **Control heights**: 32px compact (nav item, sm button, toolbar input, table toolbar), 36px default (button, input), 40px large. [M] shadcn nav 32h, inputs 32-36h; Tremor nav 32h; cal.com buttons 36h; Supabase inputs 34h, buttons 42h on an auth page.
- **Table row height**: 39-57px. Dense data (Tremor details 39px [M], Midday transactions 45px [C]); comfortable (shadcn tasks 49px [M], dashboard-01 53px [M], Tremor planner 57px [M]). Header row 37-49px, 12-14px 500-600.
- **Page padding**: 16px mobile; 24px tablet; 24-40px desktop. [M] shadcn-admin `main` pad 24/16; Tremor 40px sides at lg; Midday 32px at md.
- **Card padding**: 20-24px. [M] shadcn Card 24px; [C] Midday small card 20px.

### 0.3 Surfaces, borders, color

- **Default surface is flat, not carded.** Linear, Attio, Things, Tremor overview and the tasks table put content directly on the page and separate it with 1px rules and whitespace. Cards are for KPI tiles, settings sections and grouped widgets, not for every element. [S] linear-app-crop, attio-app-crop, things-app-crop; [C] Tremor KPIs have no card box at all (56px gap instead).
- **Borders are 1px and very light**: light mode ≈ `oklch(0.92 0 0)` / `#e5e7eb` / `#e6e6e6` [M]; dark mode is **white at 10% alpha** (`oklch(1 0 0 / 10%)`) not a solid gray [C shadcn]. Supabase uses `oklch(0.1 0 34 / 0.146)` i.e. ~15% black [M].
- **Shadows are almost absent**: `shadow-xs` on inputs/outline buttons, `shadow-sm` on cards (often transparent in practice: measured card box-shadow was 0 on shadcn), real shadows only on popovers, menus, dialogs, tooltips. Midday uses zero shadows outside drag. [M][C]
- **Radius scale**: 6-8px for controls, 10-14px for cards, full for pills/avatars. [M] shadcn controls r8, cards r14; Tremor r6; cal.com buttons r10, day cells r8. Pick one scale and keep it; Midday deliberately uses 0px everywhere (a valid stylistic choice, not a mix).
- **Neutral base + one accent.** Color is reserved for meaning: status (green/amber/red/blue), the primary action, the active nav item, and data series. Tremor: indigo-600 active nav text only, no background [C]. Midday: monochrome charts, green only for positive money [C].
- **Text tiers**: foreground (≈ #0a0a0a / oklch .145), muted (≈ oklch .556 / #6b7280 / #606060), and placeholder/disabled. Two greys max for text.
  cal.com and dub both ship four named text tiers, worth copying as tokens: emphasis (#070A0D / #171717) for titles, default (#3C3F44 / #404040) for body, subtle (#6B7280 / #737373) for secondary, muted (#9CA3AF / #A3A3A3) for placeholder/disabled. Backgrounds likewise: default #FFF, muted #F6F7F9 / #FAFAFA (sidebar, footers), subtle #EDEFF2 / #F5F5F5 (hover), emphasis #E5E7EB / #E5E5E5 (active nav). Borders: subtle #E5E7EB for dividers, default #D1D5DB for inputs. [C] [cal.com/packages/config/theme/tokens.css](https://github.com/calcom/cal.com/blob/main/packages/config/theme/tokens.css), [dub/packages/tailwind-config/themes.css](https://github.com/dubinc/dub/blob/main/packages/tailwind-config/themes.css)
- **Overlays**: modals 448-560px wide, r16; dark scrim `neutral-800/70` (cal.com) or a light frosted scrim `neutral-100/50 + blur` (dub). On mobile, modals become bottom drawers with a 48x4px grab handle (dub).
- **Dark mode**: background oklch .145 (≈ #0a0a0a), card .205, muted .269, borders white/10, inputs white/15. Never pure black + mid grey cards.

### 0.4 Layout and alignment

- **App shell**: left sidebar 240-288px (256px is the modal value), or a 48-70px icon rail. Top bar 48-64px. [M] shadcn 256/288, Tremor 288, planner 255, Midday rail 70 -> 240.
- **Content width**: full-bleed for tables and dashboards; cap forms/settings at 576-800px; cap reading/chat at 640-720px. [C] shadcn-admin settings form `max-w-xl` 576px; Midday settings 800px, chat 680px.
- **Everything aligns to one left edge** per column: page title, toolbar, table first column, card left edges. Measure: Tremor title, filters and KPI grid share the same x.
- **One primary action per view**, top-right of the page header (or bottom-fixed on mobile). All other actions are secondary/outline/ghost. [S] shadcn-admin "Download", tasks "Create", Tremor settings "Save settings".
- **Responsive**: sidebar becomes a Sheet below 768px; KPI grid 1 -> 2 -> 4 columns; tables become lists or scroll horizontally inside their container (never the page).

### 0.5 The anti-pattern list (reject a generated screen if it has any of these)

1. Marketing-sized headings (40-64px) inside an app view, or a centered hero block above a dashboard.
2. Every element wrapped in its own bordered, shadowed, rounded card ("card soup"); cards nested in cards.
3. Washed-out grey on grey: muted text (<4.5:1) on a tinted card on a tinted page. Keep page background white/near-white (or near-black), text at full foreground for primary content.
4. Floating action buttons that overlap list content or text (seen in multiple Dribbble shots, e.g. [finance-app-01-...jpg](https://www.clox.co/assets?path=design-library/app/dribbble/finance-app-01-...jpg) third phone, `habit-tracker-02-...png` first phone). Reserve bottom padding equal to FAB height + 16px or put the action in the header.
5. More than one filled/primary button in a view.
6. Gradient or saturated fills on large surfaces (KPI tiles in purple gradients, rainbow charts). Use neutral surfaces and at most one accent hue + status colors.
7. Icons in colored circles on every row "for decoration". Icons in nav and list rows are 16-20px, monochrome muted.
8. Inconsistent radius (pill buttons + square inputs + 24px cards on one screen).
9. Numbers without tabular figures; numeric columns left-aligned; amounts without currency formatting.
10. Fake data that looks fake: "Lorem", "$0", round numbers everywhere. Use realistic, varied values.
11. Emoji as icons in production UI chrome.
12. Placeholder text used as labels (labels must be visible above the input).
13. Text over busy imagery without a scrim.
14. Horizontal page scroll on mobile; tables that overflow the viewport rather than their own container.

---

## Evidence index

### Screenshots (all under `shots/`)

- `saas/` real products: `linear-desktop.png`, `linear-mobile.png`, `linear-desktop-tall.png`, **`linear-app-crop.png`** (Linear issue view + agent chat panel, dark), `linear-method-*`, `linear-insights-mobile.png`, `vercel-desktop.png`, `vercel-mobile.png`, `vercel-observability-*`, `stripe-desktop.png`, `stripe-mobile.png`, `stripe-dashboard-docs-desktop.png`, `raycast-*`, `notion-*`, `attio-desktop.png`, `attio-mobile.png`, `attio-desktop-tall.png`, **`attio-app-crop.png`** (Attio app sidebar + table), `mercury-*`, `ramp-*`, `calcom-*`, **`calcom-demo-desktop.png` / `calcom-demo-mobile.png`** (live booker: month grid + slots), `dub-*`, `dub-app-crop.png`, `resend-mobile.png`, `midday-*`, **`midday-app-crop.png`** (Midday overview: greeting + 8 widget cards + composer), `supabase-*`, **`supabase-dashboard-desktop.png`** (real sign-in), `shadcn-dashboard-*`, `shadcn-tasks-*`, `shadcn-blocks-*`, `shadcn-admin-*`, `tremor-dashboard-*` (live overview).
- `consumer/`: `arc-*`, `fabulous-*`, `headspace-*` + `headspace-app-crop.png`, `oura-*`, `reflect-*` + `reflect-app-crop.png` (daily note + calendar), `strava-*` + `strava-app-crop.png` (in-app insight cards), **`things-*` + `things-app-crop.png`** (Things on iPhone/iPad/Mac/Watch), `opal-*`, `dayone-mobile.png` (Day One desktop was a bot challenge; skipped).
- `oss-blocks/` live renders of OSS apps (desktop + mobile each): `shadcn-dashboard-01`, `shadcn-sidebar-07` (collapsible icon sidebar), `shadcn-sidebar-09` (mail list-detail), `shadcn-sidebar-15` (sidebar + right calendar rail), `shadcn-login-03`, `shadcn-login-04`, `shadcn-signup-02`, `shadcn-charts`, `shadcn-admin-tasks`, `shadcn-admin-settings`, `shadcn-admin-chats`, `shadcn-admin-signin`, `tremor-dashboard-details` (dense table), `tremor-dashboard-settings`, `tremor-planner` (grouped table + KPI strip).
- `dribbble/` 36 shot images (index with title, author, URL in `dribbble/index.json`). Standouts referenced below:
  - `finance-app-01-26959975` AI Finance App (Morph Studio): balance card, insights, tab bar.
  - `finance-app-07-27612446` Sikka (dark finance, keypad, transactions).
  - `fitness-app-01-22946165` Fitness App Concept (Sans Brothers): home, workout timer, stats.
  - `fitness-app-07-26453132` AI Health & Fitness (calorie, analytics bars, rings).
  - `habit-tracker-01-19538423` Habits tracker (quan): dark, week strip, streak number.
  - `habit-tracker-02-26089992` Habit Tracker (Budiarti R.): day strip, routine list, new-habit form, progress bars.
  - `habit-tracker-04-26805906` Health & Habit Tracker: trends, bars, mood chips.
  - `habit-tracker-07-27144746` AI Habit Tracker & Streak (Juice Lab): streak flame + week dots.
  - `journal-app-02-17505005` Journals (Patrick): calendar strip + entry list + editor.
  - `journal-app-03-22104973` Journal for Therapy (Victoria Aleksandrova): mood check-in, emotion chips, mood calendar.
  - `journal-app-06-27035792` Luma Emotional Journal (Humbleteam).
  - `meditation-app-04-27644027` AI meditation (LazyInterface): editorial serif + list.
  - `meditation-app-07-18441740` Yoga and Meditation (tubik).
  - `saas-dashboard-01-26723736` Finexy, `saas-dashboard-02-25270785` Spendly-style payments, `saas-dashboard-03-26758172` Foudora (sidebar 220px + KPI + charts + bill list), `saas-dashboard-06-26629031` Sugar CRM kanban.
  - Treat Dribbble as **aesthetic** reference (palette, mood, composition). Many shots fail real-app constraints (tiny 9-10px text, FABs over content, decorative charts). Use the measured OSS/real-app rules for sizes.

### Live measurements (`measurements (not shipped) `)

`shadcn-dashboard-01`, `shadcn-sidebar-07`, `shadcn-login-03`, `shadcn-admin-{dash,tasks,settings,chats,mobile}`, `tremor-{overview,details,settings,planner}`, `cal-booker`, `cal-booker-mobile`, `supabase-signin`. Script: `measure.js` (Playwright + getComputedStyle: text-size histogram, border colors, h1-h3, nav items, buttons, inputs, th, row heights, sidebar/header boxes, main padding, card styles).

### Cloned source (`src/`)

| Repo | License | Use |
|---|---|---|
| `shadcn-ui` (apps/v4/registry/new-york-v4) | **MIT** | Copy freely |
| `shadcn-admin` (satnaing) | **MIT** | Copy freely |
| `next-shadcn-dashboard-starter` (Kiranism) | **MIT** | Copy freely |
| `tremor-dashboard` (tremorlabs/template-dashboard-oss) | **Apache-2.0** | Copy with notice |
| `tremor-planner` (tremorlabs/template-planner) | **MIT** | Copy freely |
| `cal.com` (packages/ui, packages/features/bookings, apps/web/modules, packages/config) | **MIT** (no `ee/` dirs in this sparse checkout; any `ee/` dirs upstream are commercial) | Copy non-ee freely |
| `midday` (apps/dashboard, packages/ui) | **AGPL-3.0** | Study numbers only, do not copy code into Clox output |
| `dub` (packages/ui, apps/web/ui, apps/web/app/app.dub.co) | **AGPL-3.0** outside `(ee)`; `(ee)` dirs (incl. all workspace settings pages) are commercial | Study numbers only |

---

## 1. App shell + navigation

**Exemplars**
- Linear: [linear-app-crop.jpg](https://www.clox.co/assets?path=design-library/app/saas/linear-app-crop.jpg) [S] dark sidebar ~220px, items ~28px, 13px labels, muted section labels ("Workspace", "Favorites"), no icons in color.
- Attio: [attio-app-crop.jpg](https://www.clox.co/assets?path=design-library/app/saas/attio-app-crop.jpg) [S] workspace switcher on top, Quick actions + search row, 14px nav items with 16px outline icons, collapsible groups ("Favorites", "Records").
- shadcn dashboard-01 / sidebar-07: [shadcn-dashboard-01-desktop.jpg](https://www.clox.co/assets?path=design-library/app/oss-blocks/shadcn-dashboard-01-desktop.jpg), `shadcn-sidebar-07-desktop.png`.
- Tremor dashboard: [tremor-dashboard-desktop.jpg](https://www.clox.co/assets?path=design-library/app/saas/tremor-dashboard-desktop.jpg).
- Midday (icon rail): [midday-app-crop.jpg](https://www.clox.co/assets?path=design-library/app/saas/midday-app-crop.jpg).

**Rules**
- Sidebar width: **256px** default (shadcn `SIDEBAR_WIDTH = 16rem`) [C]; 288px with roomier padding (Tremor, dashboard-01) [M]; collapsed icon mode **48px** (shadcn) or **70px** rail that expands to 240px on hover (Midday) [C]. Mobile: Sheet 288px (shadcn) / 75% max 384px (Midday) below 768px.
- Nav item: **32px tall**, padding 8px (6px 8px in Tremor), 8-10px icon-label gap, **16px icon**, **14px/20px**, weight 400-500, radius 6-8px [M shadcn 32h r8 pad8; Tremor 32h r6 pad 6/8]. Items 2-4px apart.
- Active item: subtle fill (`sidebar-accent` ≈ oklch .97) + weight 500 (shadcn), or accent-colored text with no fill (Tremor indigo-600), or fill + 1px border (Midday #f7f7f7 / #e6e6e6). Never a saturated filled pill.
- Group label: 12px 500, muted (foreground/70), 32px tall row (shadcn) or 24px line-height (Tremor); groups separated by 16-40px.
- Top of sidebar: workspace/team switcher, 48px tall row (`SidebarMenuButton size=lg`) with a 32px square logo tile, name 14px 600 + plan 12px muted. Bottom: user row, 32px avatar, name + email 12px, chevron.
- Top bar: **48px** (dashboard-01: trigger + 16px separator + 16px/500 title) or **64px** (shadcn-admin, Tremor mobile, planner with breadcrumbs) [M]. 1px bottom border; blur only when content scrolls under it.
- Inset variant: content panel with 8px margin, 14px radius, shadow-sm, on the sidebar-tinted background (shadcn `variant="inset"`).
- Mobile: top bar 56-64px with menu button left, title, one action right; or bottom tab bar (see section 13).

**Mistakes to avoid**: sidebar wider than 300px; 40px+ tall nav items with 16px text (feels like a marketing menu); colored icon tiles per nav item; active state as a saturated gradient pill; duplicating nav in both sidebar and top tabs.

**Source**
- [shadcn-ui/apps/v4/registry/new-york-v4/ui/sidebar.tsx](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/sidebar.tsx) (MIT): width constants, menu button sizes, collapsible icon mode, mobile Sheet, Cmd+B.
- [shadcn-ui/apps/v4/registry/new-york-v4/blocks/sidebar-07/](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/blocks/sidebar-07/) (collapsible icon), `blocks/dashboard-01/components/{app-sidebar,site-header,nav-main,nav-user}.tsx` (MIT).
- [tremor-dashboard/src/components/ui/navigation/](https://github.com/tremorlabs/template-dashboard-oss/blob/main/src/components/ui/navigation/){sidebar.tsx,SidebarWorkspacesDropdown.tsx,UserProfile.tsx}` (Apache-2.0).
- [tremor-planner/src/components/ui/navigation/AppSidebar.tsx](https://github.com/tremorlabs/template-planner/blob/main/src/components/ui/navigation/AppSidebar.tsx) (MIT): tree sub-nav with 1px guide line.
- [midday/apps/dashboard/src/components/](https://github.com/midday-ai/midday/blob/main/apps/dashboard/src/components/){sidebar.tsx,main-menu.tsx}` (AGPL, study only): hover-expanding rail with icons fixed in place.
- - [cal.com/apps/web/modules/shell/](https://github.com/calcom/cal.com/blob/main/apps/web/modules/shell/){SideBar,Shell,TopNav}.tsx`, `navigation/{Navigation,NavigationItem}.tsx` (MIT): 56px icon sidebar at md, **224px** at lg, bg #F6F7F9; nav item 32px, 14px 500, 16px icon, r6, active `bg-emphasis` #E5E7EB; page header title Cal Sans 20px/28 600 + 14px subtitle, CTA right; main padding 8/16/24px, no max-width (an anti-pattern on wide screens); **mobile bottom bar ~64px, 4 items (Event Types, Bookings, Availability, More), 20px icon + 12px 500 label, blurred translucent bg**; mobile primary action = 56px round FAB at bottom 80px / right 16px.
- [dub/apps/web/ui/layout/](https://github.com/dubinc/dub/blob/main/apps/web/ui/layout/){main-nav.tsx,sidebar/sidebar-nav.tsx,page-width-wrapper.tsx}` (AGPL, study only): two-level sidebar = 64px icon rail (44px items, 20px icons, active = white tile) + 240px panel (bg neutral-100, title 18px 600, items 32px, 14px, active `blue-100/50` + blue-600 text); app content in a white r12 card inset 8px on a neutral-200 page; page header 48px mobile / 64px sm+, title 18px 600; content max-width 1280px with 12/24px padding; optional 340px right side panel docked when container >= 960px.

---

## 2. Dashboard overview

**Exemplars**
- Midday overview: [midday-app-crop.jpg](https://www.clox.co/assets?path=design-library/app/saas/midday-app-crop.jpg) [S]: serif greeting "Morning Viktor" + one muted sentence, a 4x2 grid of square bordered widget cards (label 12px, one-line insight, sparkline or value), then quick-action chips and an "I want to..." composer. No hero, no gradients.
- Tremor overview: [tremor-dashboard-desktop.jpg](https://www.clox.co/assets?path=design-library/app/saas/tremor-dashboard-desktop.jpg): "Current billing cycle" KPI strip with progress bars, then "Overview" with a sticky date-range filter bar and small line-chart tiles.
- shadcn dashboard-01: [shadcn-dashboard-01-desktop.jpg](https://www.clox.co/assets?path=design-library/app/oss-blocks/shadcn-dashboard-01-desktop.jpg): 4 KPI cards, 1 wide area chart with range toggle, 1 table with tabs.
- Dribbble `saas-dashboard-03-26758172` (Foudora): good composition (2 summary charts on top, cash-flow + upcoming bills), but note small text.

**Rules**
- Order: (1) page header (title 20-24px + optional one-line muted context + date range + one primary action), (2) KPI row of 3-4, (3) one primary chart full width or 2/3 + 1/3 split, (4) a list/table of recent items. That is the whole page.
- Grid: 12 columns, gap 16-24px (shadcn 16px, Midday 24px [C]). KPI row 1 col mobile, 2 at ~576px, 4 at ~1024px.
- Vertical rhythm between blocks 16-24px (shadcn `gap-4 md:gap-6`).
- Greeting is optional and small: Midday uses a 38px serif greeting but nothing else that large on the page; plain apps use the 20-24px page title.
- Content max width: dashboards are full width; Midday's AI-style overview caps at 768px centered.

**Mistakes**: a welcome hero with illustration; 6+ KPI tiles; every chart in a different color; KPI cards with icons in colored circles stealing attention from the number; charts with no range selector or units.

**Source**: [shadcn-ui/apps/v4/registry/new-york-v4/blocks/dashboard-01/](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/blocks/dashboard-01/) (MIT); [tremor-dashboard/src/app/(main)/overview/page.tsx](https://github.com/tremorlabs/template-dashboard-oss/blob/main/src/app/(main)/overview/page.tsx) + [tremor-dashboard/src/components/ui/overview/](https://github.com/tremorlabs/template-dashboard-oss/blob/main/src/components/ui/overview/)*` (Apache-2.0); [midday/apps/dashboard/src/components/widgets/](https://github.com/midday-ai/midday/blob/main/apps/dashboard/src/components/widgets/)*` (AGPL, study only).

---

## 3. KPI / stat tiles

**Exemplars**: shadcn section cards ([shadcn-dashboard-01-desktop.jpg](https://www.clox.co/assets?path=design-library/app/oss-blocks/shadcn-dashboard-01-desktop.jpg)), Tremor no-box KPIs ([tremor-dashboard-desktop.jpg](https://www.clox.co/assets?path=design-library/app/saas/tremor-dashboard-desktop.jpg)), Midday widget cards ([midday-app-crop.jpg](https://www.clox.co/assets?path=design-library/app/saas/midday-app-crop.jpg)), Tremor planner inline KPI strip with signal bars ([tremor-planner-desktop.jpg](https://www.clox.co/assets?path=design-library/app/oss-blocks/tremor-planner-desktop.jpg)), Vercel usage rows ([vercel-observability-desktop.jpg](https://www.clox.co/assets?path=design-library/app/saas/vercel-observability-desktop.jpg)).

**Anatomy (shadcn, MIT, measured)**
- Card r14px, 1px border, padding 24px, internal gap 24px; label 14px muted; **value 24px 600 tabular-nums -> 30px when card >= 250px wide**; delta as an outline badge (12px 500, `+12.5%` with trend icon) top-right; footer 2 lines 14px: first 500 with icon, second muted.
- Optional surface: `bg-gradient-to-t from-primary/5 to-card` in light; flat in dark.

**Alternatives**
- Tremor: no card; title 14px 700, change badge (`+12.3%`, 1 decimal, explicit sign), value 20px 400, "from $X" 14px gray-500; grid gap 56px; optional 6-8px progress bar under the value with "used / of total" [C].
- Midday: square bordered tile, padding 20px, min-height 110px, label 12px muted, value 20px 500, one-line plain-English insight ("Your burn rate is $2,346 & your current runway is 9 months"), whole tile clickable to a filtered view [C][S].
- Planner: inline row, label 14px gray-500, value 18px 600 + "450/752" muted, 3-bar signal (4x14px bars, 2px gap, red <0.3, orange <0.7, emerald) [C].

**Rules**: 3-4 tiles; the number is the largest thing; one delta per tile with sign + period ("vs last month"); green/red only on the delta, not on the tile; tabular figures; values formatted ($45,231.89, 1,234, 4.5%).

**Mistakes**: icon in a colored circle as the visual anchor; giant 48px numbers; delta with no comparison period; color-filled tiles; sparkline with axes.

**Source**: [shadcn-ui/apps/v4/registry/new-york-v4/blocks/dashboard-01/components/section-cards.tsx](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/blocks/dashboard-01/components/section-cards.tsx) (MIT); [tremor-dashboard/src/components/ui/overview/](https://github.com/tremorlabs/template-dashboard-oss/blob/main/src/components/ui/overview/) + [tremor-dashboard/src/components/](https://github.com/tremorlabs/template-dashboard-oss/blob/main/src/components/){Badge,ProgressBar}.tsx` (Apache-2.0); [tremor-planner/src/components/ui/homepage/MetricsCards.tsx](https://github.com/tremorlabs/template-planner/blob/main/src/components/ui/homepage/MetricsCards.tsx) (MIT).

---

## 4. Charts

**Exemplars**: shadcn charts gallery [shadcn-charts-desktop.jpg](https://www.clox.co/assets?path=design-library/app/oss-blocks/shadcn-charts-desktop.jpg); dashboard-01 area chart; Tremor small line charts [tremor-dashboard-desktop.jpg](https://www.clox.co/assets?path=design-library/app/saas/tremor-dashboard-desktop.jpg); Midday monochrome bars (in `midday-app-crop.png` widgets); Vercel observability line [vercel-observability-desktop.jpg](https://www.clox.co/assets?path=design-library/app/saas/vercel-observability-desktop.jpg); Linear insights ([linear-desktop-tall.jpg](https://www.clox.co/assets?path=design-library/app/saas/linear-desktop-tall.jpg), lower sections).

**Rules**
- Height: 240-320px for a primary chart (shadcn 250px, planner 240px, Midday 320px); 120-130px for tile charts (Tremor 128px) [C].
- Grid: horizontal lines only, 1px at border color 50% (shadcn `stroke-border/50`) or dashed 3 3 (Midday). No vertical grid, no axis lines, no tick marks [C].
- Ticks: 10-12px muted; tickMargin 8; minTickGap 32; show first/last x labels only on small tiles.
- Series color: one accent for the current period, a 30% grey for the comparison period (Midday `#6666664d`), dashed 1px for averages. Up to 5 series via `--chart-1..5`; never more than 5 hues.
- Lines 2px; bars with 4px top radius; area fill gradient opacity 0.8 -> 0.1.
- Tooltip: min-width 128px, r8, 1px border, bg = background, padding 6x10, 12px text, values mono/tabular, 10px color swatch, shadow-xl [C].
- Always include: title, current value, period selector (7d / 30d / 3m toggle that collapses to a Select on narrow widths), units.
- Disable entry animation for data-heavy dashboards (Midday) or keep it < 300ms.

**Mistakes**: rainbow categorical palettes for one metric; 3D/donut overload; legends that duplicate axis labels; charts in a card in a card; neon glow lines on dark (common on Dribbble, `saas-dashboard-07`).

**Source**: [shadcn-ui/apps/v4/registry/new-york-v4/ui/chart.tsx](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/chart.tsx), `.../charts/*` (71 examples), `.../blocks/dashboard-01/components/chart-area-interactive.tsx` (MIT); [tremor-dashboard/src/components/LineChart.tsx](https://github.com/tremorlabs/template-dashboard-oss/blob/main/src/components/LineChart.tsx), [tremor-dashboard/src/lib/chartUtils.ts](https://github.com/tremorlabs/template-dashboard-oss/blob/main/src/lib/chartUtils.ts) (Apache-2.0); [midday/apps/dashboard/src/components/charts/base-charts.tsx](https://github.com/midday-ai/midday/blob/main/apps/dashboard/src/components/charts/base-charts.tsx) (AGPL, study only).

---

## 5. Data table / list

**Exemplars**: shadcn tasks [shadcn-admin-tasks-desktop.jpg](https://www.clox.co/assets?path=design-library/app/oss-blocks/shadcn-admin-tasks-desktop.jpg), [shadcn-tasks-desktop.jpg](https://www.clox.co/assets?path=design-library/app/saas/shadcn-tasks-desktop.jpg); Tremor details (dense) [tremor-dashboard-details-desktop.jpg](https://www.clox.co/assets?path=design-library/app/oss-blocks/tremor-dashboard-details-desktop.jpg); Tremor planner grouped [tremor-planner-desktop.jpg](https://www.clox.co/assets?path=design-library/app/oss-blocks/tremor-planner-desktop.jpg); Attio records [attio-app-crop.jpg](https://www.clox.co/assets?path=design-library/app/saas/attio-app-crop.jpg).

**Measured**
| App | Header | Row | Cell text | Notes |
|---|---|---|---|---|
| Tremor details [M] | 37px, 12px/600 | **39px** | 14px | status pills, mini bar gauge, 30px toolbar buttons |
| Midday transactions [C] | 45px sticky | **45px** | 14px, pad 8/16 | sticky checkbox/date/description columns, vertical cell dividers |
| shadcn tasks [M] | 40px, 14px/500 | **49px** | 14px, pad 8 | faceted filters, 32px toolbar, pagination |
| shadcn dashboard-01 [M] | 40px | 53px | 14px | drag handle, inline edit, sticky muted header |
| Tremor planner [M] | 45-49px, 14px/600 | 57px | 14px | grouped rows with gray-50 group header + count |

**Rules**
- Toolbar above table: search input 32px (150-256px wide), faceted filter buttons (outline, dashed border, show selected values as small badges), view/column toggle right, primary action ("Create", "Add") far right. Filter state visible.
- Header: 12-14px, 500-600, muted or foreground, no uppercase shouting (12px uppercase with +0.05em tracking only if 11-12px).
- Rows: 1px bottom border, hover `muted/50`, selected `muted`; first column is the identity (name/title, 500), secondary info muted 12-14px.
- Numbers right-aligned + tabular; dates in a consistent short format; status as small pill (12px, dot or ring-inset tint: 50-bg / 800-text / 600-ring at 30%).
- Pagination: "x of y selected" left, rows-per-page select (32px), page x of y, 4 icon buttons (32px).
- Empty filter result: a single 96px row "No results." plus clear-filters link.
- Mobile: table becomes a stacked list (title + 2 meta lines + trailing value) or scrolls horizontally inside its own container.

**Mistakes**: zebra striping + borders + card per row; 64px+ rows with tiny text; ALL CAPS bold headers; actions as 4 visible colored buttons per row (use a 32px kebab menu); status as saturated filled chips.

Note: the open-source Tremor dashboard repo ships Details and Settings as upsell placeholders; the screenshots/measurements above come from the live (paid) template at dashboard.tremor.so, so take numbers from the screenshots, code from the planner.

**Source**: [shadcn-ui/apps/v4/registry/new-york-v4/ui/table.tsx](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/table.tsx), [shadcn-ui/apps/v4/app/(app)/examples/tasks/components/](https://github.com/shadcn-ui/ui/blob/main/apps/v4/app/(app)/examples/tasks/components/)*` (data-table, toolbar, faceted-filter, pagination, view-options) (MIT); [shadcn-admin/src/components/data-table/](https://github.com/satnaing/shadcn-admin/blob/main/src/components/data-table/)*` incl. `bulk-actions.tsx` (MIT); [tremor-planner/src/components/Table.tsx](https://github.com/tremorlabs/template-planner/blob/main/src/components/Table.tsx), [tremor-planner/src/app/quotes/overview/page.tsx](https://github.com/tremorlabs/template-planner/blob/main/src/app/quotes/overview/page.tsx) (MIT); [midday/apps/dashboard/src/components/tables/transactions/](https://github.com/midday-ai/midday/blob/main/apps/dashboard/src/components/tables/transactions/)*` (AGPL, study only).
- [cal.com/apps/web/modules/event-types/views/event-types-listing-view.tsx](https://github.com/calcom/cal.com/blob/main/apps/web/modules/event-types/views/event-types-listing-view.tsx) (MIT): **one bordered container (r6) with divided rows, not a card per row**; row padding 16px (16/24 at sm), hover `bg-cal-muted`; title 14px 600 + muted slug; description 14px muted, 3-line clamp, max 650px; metadata badges (duration, price) with icons, 8px gap; right side: visibility switch + a joined icon-button group (preview, copy link, ...) ; mobile collapses actions into one menu.
- [dub/packages/ui/src/card-list/](https://github.com/dubinc/dub/blob/main/packages/ui/src/card-list/)*`, [dub/apps/web/ui/links/link-card.tsx](https://github.com/dubinc/dub/blob/main/apps/web/ui/links/link-card.tsx) (AGPL, study only): two densities: `compact` (joined rows, ~52px, only first/last rounded r12, hover neutral-50) and `loose` (separate r12 cards, 16px gap, ~80px, hover shadow `0 2px 4px #222A350d`); favicon 20/24px; trailing metric badge (clicks) + kebab menu with 36px items.

---

## 6. List-detail split

**Exemplars**: shadcn sidebar-09 mail [shadcn-sidebar-09-desktop.jpg](https://www.clox.co/assets?path=design-library/app/oss-blocks/shadcn-sidebar-09-desktop.jpg); shadcn-admin chats [shadcn-admin-chats-desktop.jpg](https://www.clox.co/assets?path=design-library/app/oss-blocks/shadcn-admin-chats-desktop.jpg); Things Mac (sidebar + list) [things-app-crop.jpg](https://www.clox.co/assets?path=design-library/app/consumer/things-app-crop.jpg); Linear issue + side panel [linear-app-crop.jpg](https://www.clox.co/assets?path=design-library/app/saas/linear-app-crop.jpg); Reflect daily note + calendar rail [reflect-app-crop.jpg](https://www.clox.co/assets?path=design-library/app/consumer/reflect-app-crop.jpg).

**Rules**
- Three panes max: nav (48-256px) | list (300-360px) | detail (flex). shadcn sidebar-09: 49px icon rail + list column, 350px total [C]. shadcn-admin chats list 224/288/320px at sm/lg/2xl with 24px gap [C].
- List row: padding 16px, bottom border; line 1 = title 14px 500 + right-aligned 12px date/time; line 2-3 = 12-14px muted preview clamped to 2 lines. Selected row = muted fill, not a colored bar plus fill plus border.
- Detail header sticky, 48-64px, with breadcrumb/title + actions (icon buttons 32px).
- Alternatively detail opens as a right Sheet: 520px max (Midday), 384px default (shadcn Sheet), with 24px padding, meta row 12px muted, title, big value, 2-column field grid gap 16px [C].
- On mobile the list is the screen; tapping pushes the detail (never show both).

**Mistakes**: list rows that are cards with shadows; detail pane with its own giant header; unread state only by color (add weight 600 or a 6-8px dot).

**Source**: [shadcn-ui/apps/v4/registry/new-york-v4/blocks/sidebar-09/components/app-sidebar.tsx](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/blocks/sidebar-09/components/app-sidebar.tsx) (MIT); [shadcn-admin/src/features/chats/index.tsx](https://github.com/satnaing/shadcn-admin/blob/main/src/features/chats/index.tsx) (MIT); [shadcn-ui/apps/v4/registry/new-york-v4/ui/sheet.tsx](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/sheet.tsx) (MIT); [midday/apps/dashboard/src/components/transaction-details.tsx](https://github.com/midday-ai/midday/blob/main/apps/dashboard/src/components/transaction-details.tsx) + `packages/ui/src/components/sheet.tsx` (AGPL, study only).

---

## 7. Detail page

**Exemplars**: Linear issue ([linear-app-crop.jpg](https://www.clox.co/assets?path=design-library/app/saas/linear-app-crop.jpg)): title 18-20px 600, description 14px, "Activity" section header 14px 600, activity rows 13px with 16px avatar, properties in a right column of label/value pairs. Midday transaction sheet (code). Things project ("Prepare Presentation" in [things-app-crop.jpg](https://www.clox.co/assets?path=design-library/app/consumer/things-app-crop.jpg)): title 18px with progress pie, one-line notes, grouped checklists with blue 12px section headings.

**Rules**
- Main column 640-760px of readable content + optional right properties rail 240-280px (label 12px muted, value 14px, 32px rows).
- Title 20-24px 600; metadata row under the title in 12-14px muted (status pill, owner avatar 20px, date).
- Sections separated by 24-32px + 14px 600 section titles, not by cards.
- Primary action in the header right; destructive actions in an overflow menu.
- Activity/comments at the bottom: 32px avatar, name 14px 500 + time 12px muted, body 14px.

**Mistakes**: tabs for 2 short sections; key fields hidden in a modal; the hero number buried.

**Source**: [shadcn-ui/apps/v4/registry/new-york-v4/ui/item.tsx](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/item.tsx) (MIT); [next-shadcn-dashboard-starter/src/features/products/](https://github.com/Kiranism/next-shadcn-dashboard-starter/blob/main/src/features/products/) (MIT, product view form). [cal.com/packages/ui](https://github.com/calcom/cal.com/blob/main/packages/ui) Sheet (MIT): floating sheet inset 16px top/bottom, 8px right, max 512px, r12, padding 24px, title 20px 600, label/value rows 14px, footer `bg-muted` with top border and right-aligned actions. dub `page-content-with-side-panel.tsx` (AGPL, study only): 340px right panel, header 48/64px with 18px 600 title, body muted bg, padding 24px, gap 16px.

---

## 8. Settings

**Exemplars**: shadcn-admin settings [shadcn-admin-settings-desktop.jpg](https://www.clox.co/assets?path=design-library/app/oss-blocks/shadcn-admin-settings-desktop.jpg); Tremor settings (live paid template) [tremor-dashboard-settings-desktop.jpg](https://www.clox.co/assets?path=design-library/app/oss-blocks/tremor-dashboard-settings-desktop.jpg); Midday settings (code: stacked section cards).

**Two proven layouts**
1. **Left subnav + form** (shadcn-admin [M][C]): page H1 24px/700 (30px on settings at md) + 16px muted subtitle + separator; subnav ~20% width (182px measured), items 36px ghost buttons, 18px icons; 48px gap; form max-width **576px**; section title 18px 500 + 14px muted description + separator; fields 32px apart; label 14px 500, 8px to control; inputs 36px.
2. **Stacked section cards** (Midday, also Vercel/dub style): single column max 800px; tabs on top (14px, 24px apart, underline active); each setting = card (padding 24px) with title 18px, description 14px muted, control (input max 300px), footer with top border: 12px muted hint left + Save button right. 48px between cards [C].
3. **Two-column rows** (Tremor live [S][M]): left column title 16px 600 + 14px description, right column the form grid (2 columns of inputs 38px); H2 per section 16px/600; "Save settings" primary at the end of each section.

**Rules**: one Save per section (or autosave with toast), destructive zone last with red outline button, toggles as rows (label + description left, switch right, 56-64px rows divided by 1px).

**Mistakes**: one giant form with a single save at the bottom; settings in a modal; switches without descriptions; danger button filled red next to Save.

**Source**: [shadcn-admin/src/features/settings/](https://github.com/satnaing/shadcn-admin/blob/main/src/features/settings/){index.tsx,components/sidebar-nav.tsx,components/content-section.tsx,profile/profile-form.tsx}` (MIT); [shadcn-ui/apps/v4/registry/new-york-v4/ui/field.tsx](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/field.tsx) (MIT). [cal.com/packages/ui](https://github.com/calcom/cal.com/blob/main/packages/ui) `SettingsToggle` (MIT): bordered r8 row, padding 24/16-24px, title 16px 600, description 14px, switch right, 24px between rows; newer `Section`: muted outer (r16, p16) wrapping a white inner card (r12, p12). [dub/packages/ui/src/form.tsx](https://github.com/dubinc/dub/blob/main/packages/ui/src/form.tsx) (AGPL, study only): **the canonical "settings card"**: r12, 1px neutral-200 border, body padding 24px, title 16px 600, description 14px neutral-500, input max 448px ~38px, footer `bg-neutral-50` with top border, 20/12px padding, helper text left + Save right.

---

## 9. Auth / sign-in

**Exemplars**: Supabase [supabase-dashboard-desktop.jpg](https://www.clox.co/assets?path=design-library/app/saas/supabase-dashboard-desktop.jpg) [M]; shadcn login-03 / login-04 / signup-02 `shots/oss-blocks/shadcn-login-0{3,4}-desktop.png`, `shadcn-signup-02-desktop.png`; shadcn-admin sign-in [shadcn-admin-signin-desktop.jpg](https://www.clox.co/assets?path=design-library/app/oss-blocks/shadcn-admin-signin-desktop.jpg); cal.com sign-up hero [calcom-desktop.jpg](https://www.clox.co/assets?path=design-library/app/saas/calcom-desktop.jpg).

**Measured**
- Supabase: split screen; form column 561px wide (padding 64/20/32) on left, testimonial quote on right in 28px; H1 "Welcome back" **28px/600 tracking -0.7px**; subtitle 14px muted; 3 OAuth buttons stacked full width (GitHub / ChatGPT / SSO) **42px, r10**; "or" divider; Email + Password inputs **34px, 13px text, r8**; "Forgot password?" link right of label; primary green Sign in full width; "Don't have an account? Sign up" 13px; legal 12px muted.
- shadcn login-03: card **max-width 384px**, r14, padding 24, CardTitle 20px 600, inputs and buttons **36px r8**, field group gap 28px, label-to-input 12px, OAuth buttons full-width outline above an "Or continue with" divider; muted page background behind the card.
- shadcn login-04: 896px two-column card, image right half; 3-up icon-only OAuth buttons.

**Rules**: logo 24-32px top; H1 20-28px; one primary button; OAuth first if offered; labels visible; password reveal toggle; error text 14px destructive under field; legal 12px muted centered. Mobile: same column, 16-24px gutters, inputs 16px font (avoid iOS zoom).

**Mistakes**: full-screen gradient behind the form; two primary buttons (Sign in + Sign up both filled); placeholder-as-label; social buttons in brand colors of mixed heights.

**Source**: [shadcn-ui/apps/v4/registry/new-york-v4/blocks/](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/blocks/){login-01..05,signup-01..05}/` (MIT); [shadcn-admin/src/features/auth/](https://github.com/satnaing/shadcn-admin/blob/main/src/features/auth/) (MIT). [cal.com/apps/web/modules/auth/login-view.tsx](https://github.com/calcom/cal.com/blob/main/apps/web/modules/auth/login-view.tsx) (MIT): card max 448px, r12, 1px subtle border, padding 40px, shadow-sm on a faint grid-pattern page; wordmark 20px; subtitle 14px muted + 32px gap; Google (primary) then Microsoft (outline) stacked 8px apart with a "Last used" tag; "or" divider 24px margin; fields 24px apart; full-width Continue. dub login (AGPL, study only): form column max 384px, heading 20px 600 centered, 40px secondary "Continue with Google", "OR" separator 12px uppercase; marketing panel right 440-595px.

---

## 10. Onboarding

**Exemplars**: cal.com getting-started (code, see below); Supabase/Linear style single-question steps; Dribbble `habit-tracker-02-26089992` "New habit" sheet (name, goal, repeat days as 7 circular toggles, reminder switch, one primary Save); `journal-app-03-22104973` "What emotions do you feel right now?" chip picker with one dark "next" button.

**Rules**
- One question per step; centered column 400-600px; step indicator (n of m, or thin segmented bar 2-4px tall) at top; Back (ghost) + Continue (primary) at the bottom; Skip as a text link.
- Title 20-24px 600; helper 14px muted; choice chips 32-36px tall, 14px, pill or r8, selected = filled foreground.
- Show progress, prefill with smart defaults, finish on a populated (not empty) home.

**Mistakes**: 5+ carousel slides of marketing copy before the app; giant illustrations pushing the input below the fold; asking for things the app could infer.

**Source**: - [cal.com/apps/web/modules/onboarding/components/](https://github.com/calcom/cal.com/blob/main/apps/web/modules/onboarding/components/){OnboardingLayout,OnboardingCard}.tsx` (MIT): muted page, 20px logo, card max 532px (at xl a 1130x690 two-column card: 40% form / live preview), r16, padding 48/40; title Cal Sans 20px 600; subtitle 14px muted; frosted sticky footer for Back/Continue; **step dots under the card: current 6px foreground, done 4px subtle, upcoming 4px muted 50%, 4px gap**.
- Older cal.com `getting-started/[[...step]]` (MIT): 520-600px column, title 28px, "Step X of Y" 12px + segmented 4px bars, step body on a muted r-card with 32px padding.
- dub onboarding steps (AGPL, study only): centered column max 430px (640 on welcome), optional 12px pill above a 20px 600 centered title, 16px muted balanced description, "I'll do this later" escape link, 1s slide-up fade on enter, no numbered steps (welcome, products, workspace, domain, plan, program, success).

---

## 11. Empty states

**Exemplars**: shadcn-admin chats empty thread ([shadcn-admin-chats-desktop.jpg](https://www.clox.co/assets?path=design-library/app/oss-blocks/shadcn-admin-chats-desktop.jpg): 64px round icon frame, "Your messages" 20px 600, one line, "Send message" primary); shadcn `Empty` component; Midday table empty states (code).

**Rules**
- Centered in the region it replaces (not the page), 96-160px top margin in a table area.
- Icon 24px in a 40-48px muted tile/circle (shadcn: 40px r10 `bg-muted` with 24px icon) [C]; optional dashed 1px border container r10, padding 24-48px.
- Title 16-18px 500-600; description 14px muted, max-width 384px, says what will appear here and why; **one** CTA that creates the first item (outline or primary), optional secondary link.
- Copy pattern (Midday): "No transactions / Connect your bank account to automatically import transactions... / [Add account]"; filtered-empty: "No results / Try another search, or adjusting the filters / [Clear filters]".
- Distinguish first-run empty vs filtered-empty vs all-done ("All done / Everything is exported").

**Mistakes**: 200px illustrations; jokes instead of next steps; empty state + skeleton + toast at once; CTA that doesn't create anything.

**Source**: [shadcn-ui/apps/v4/registry/new-york-v4/ui/empty.tsx](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/empty.tsx) (MIT); [next-shadcn-dashboard-starter/src/features/notifications/components/notification-center.tsx](https://github.com/Kiranism/next-shadcn-dashboard-starter/blob/main/src/features/notifications/components/notification-center.tsx) (MIT, 32px muted icon + 14px line); [midday/apps/dashboard/src/components/tables/core/empty-states.tsx](https://github.com/midday-ai/midday/blob/main/apps/dashboard/src/components/tables/core/empty-states.tsx) (AGPL, study copy only). [cal.com/packages/ui/components/empty-screen/EmptyScreen.tsx](https://github.com/calcom/cal.com/blob/main/packages/ui/components/empty-screen/EmptyScreen.tsx) (MIT): dashed border r8, padding 28px (80px at lg), 72px circle with a 40px thin-stroke icon, heading 20px display, description 14px/24 max 420px, one button 32px below. [dub/packages/ui/src/empty-state.tsx](https://github.com/dubinc/dub/blob/main/packages/ui/src/empty-state.tsx) (AGPL, study only): 64px r16 bordered tile with a 24px icon, title 16px 500, description 14px muted max 384px balanced, "Learn more" link; `apps/web/ui/shared/animated-empty-state.tsx` shows a looping preview of what the list will look like (nice for first-run). Copy: "No customers yet" (first run) vs "No customers found" (filtered).

---

## 12. Composer / editor (journal, notes, chat input)

**Exemplars**: Midday "I want to..." composer ([midday-app-crop.jpg](https://www.clox.co/assets?path=design-library/app/saas/midday-app-crop.jpg)): suggestion rows above a bordered input, toolbar icons left, square send button right; Linear agent panel reply box ([linear-app-crop.jpg](https://www.clox.co/assets?path=design-library/app/saas/linear-app-crop.jpg)): "Reply..." with Skills menu + attach + send; Reflect daily note ([reflect-app-crop.jpg](https://www.clox.co/assets?path=design-library/app/consumer/reflect-app-crop.jpg)): date heading, bullet body, calendar rail right; shadcn-admin chat composer; Dribbble `journal-app-02-17505005` (calendar strip + entries + full-page editor), `journal-app-01-25514838` (voice capture + entry list).

**Rules (chat/AI input)**
- Max width 640-720px centered (Midday 680px [C]); min height 52px, max 150-200px then scroll; 14-16px text, 22-24px line height; padding 16px top/sides, 10-12px bottom.
- Toolbar row inside the box: 24-32px icon buttons with 16px icons in muted color (attach, mention, tools) left; send button right (32px, primary, disabled until text).
- Suggestions as 12-14px chips/rows above the input, not floating over content; disclaimer 11-12px muted below.
- Bottom-docked with a gradient fade, and the scroll area gets bottom padding equal to the composer height so the last message is never hidden.

**Rules (journal/notes editor)**
- Writing column 640-720px, body 16-17px/1.6, title 24-28px 600 (or display serif) as a borderless input; date/meta 12-13px muted above the title.
- No borders around the editor; formatting toolbar appears on selection or as a slim 36-40px bar; autosave indicator ("Saved") 12px muted instead of a Save button.
- Mood/tag pickers as chips under the title (Dribbble journal-03), not modals.

**Mistakes**: textarea with a visible resize handle and 1px grey box inside a card; send button floating over the last line; 12px body text for journaling; toolbar with 15 always-visible buttons.

**Source**: [next-shadcn-dashboard-starter/src/features/chat/components/message-composer.tsx](https://github.com/Kiranism/next-shadcn-dashboard-starter/blob/main/src/features/chat/components/message-composer.tsx) (MIT: r16-24 box, 12px padding, min-h 48-64px, 32-40px round icon buttons, prompt chips); [shadcn-admin/src/features/chats/index.tsx](https://github.com/satnaing/shadcn-admin/blob/main/src/features/chats/index.tsx) (MIT); [midday/apps/dashboard/src/components/chat/chat-input.tsx](https://github.com/midday-ai/midday/blob/main/apps/dashboard/src/components/chat/chat-input.tsx) (AGPL, study only).

---

## 13. Calendar / streak / habit views

**Exemplars**: cal.com booker [calcom-demo-desktop.jpg](https://www.clox.co/assets?path=design-library/app/saas/calcom-demo-desktop.jpg), `calcom-demo-mobile.png` [M]; shadcn sidebar-15 calendar rail [shadcn-sidebar-15-desktop.jpg](https://www.clox.co/assets?path=design-library/app/oss-blocks/shadcn-sidebar-15-desktop.jpg); Reflect calendar rail; Dribbble `habit-tracker-02-26089992` (week strip + routine list), `habit-tracker-01-19538423` (dark streak count), `habit-tracker-07-27144746` (streak flame + 7 day dots), `journal-app-03-22104973` (mood calendar of emoji dots), `fitness-app-07-26453132` (rings + bars).

**Measured / rules**
- cal.com booker: 3 columns (event info | month grid | time slots); **day cells 59px desktop / 47px mobile square, r8, 14px 500**; available days filled light grey, selected day filled black; weekday headers 12px uppercase muted; **time-slot buttons 36px, r10, 14px 500**, full column width, 1px border; month title 16px 600 with prev/next 32px ghost icons; 12h/24h toggle [M].
- shadcn calendar: `--cell-size` 32px, caption 32px 14px 500, weekdays 12.8px muted, today = accent fill, selected = primary fill r8 [C].
- Week strip (mobile habit/journal): 7 equal columns, weekday 11-12px muted above a 32-40px circle date, today = filled foreground, completed = accent dot below.
- Streak: one big number 32-48px (the single allowed large figure on the screen) + label 12-14px muted ("day streak") + 7-dot row; completed = accent, missed = muted outline, future = faint.
- Habit rows: 56-64px, check circle 24px left, title 14-16px 500, meta 12px muted ("Streak 3 days"), time/duration right. Checking = strike/opacity change + accent fill, not a confetti modal.
- Heatmap (contribution style): 10-12px squares, 2-3px gap, 4-5 steps of one hue.

**Mistakes**: 7 different colors for 7 habits; emoji as the only status signal; month grids with 24px cells on desktop; a FAB over the last habit row.

**Source**: [shadcn-ui/apps/v4/registry/new-york-v4/ui/calendar.tsx](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/calendar.tsx), `blocks/sidebar-15/` (MIT). [cal.com/packages/features/bookings/Booker/config.ts](https://github.com/calcom/cal.com/blob/main/packages/features/bookings/Booker/config.ts), [cal.com/apps/web/modules/bookings/components/](https://github.com/calcom/cal.com/blob/main/apps/web/modules/bookings/components/){Booker,AvailableTimes}.tsx` (MIT): columns info 240-280px | calendar 480px | slots 240-280px, min height 450px, r6 border; slot buttons full width, min 36px, 8px apart, hover/selected = brand border; no-slots = muted box with 16px icon + muted text; width transitions 300ms honoring reduced motion. Palette tokens for data viz: 7 hues (pink, violet, indigo, emerald, yellow, orange, red) each with a subtle partner.

---

## 14. Mobile tab-bar app home

**Exemplars**: Things iPhone [things-app-crop.jpg](https://www.clox.co/assets?path=design-library/app/consumer/things-app-crop.jpg) (Today list: section headers with icons, checkbox rows, blue FAB bottom-right *with* list padding); Dribbble `finance-app-01-26959975` (Home/Analytics/Wallet/Profile tab bar), `fitness-app-01-22946165`, `habit-tracker-02-26089992`, `meditation-app-06-27411557`, `finance-app-07-27612446` (dark); Strava in-app cards [strava-app-crop.jpg](https://www.clox.co/assets?path=design-library/app/consumer/strava-app-crop.jpg); Headspace app list [headspace-app-crop.jpg](https://www.clox.co/assets?path=design-library/app/consumer/headspace-app-crop.jpg).

**Rules**
- Tab bar: 3-5 tabs, 49pt (iOS) + safe area (34pt) ≈ 83px total; 24-28px icons, 10-11px labels, active = accent/foreground, inactive = muted; no more than one "center action" special button.
- Top of home: large title 28-34px bold (iOS large-title convention; this is the one place >24px is native) or greeting 20-24px + avatar 32-40px right. Date/context 13-14px muted above.
- Then: one summary module (balance/progress/today) at 100% width, r16-24, padding 16-20px; then a short "Today"/"Recent" list with "See all" 13-14px link right of the section title (17-20px 600).
- Screen gutters 16-20px; section spacing 24-32px; list rows 56-72px; tap targets >= 44px.
- Bottom content padding >= tab bar height + 16px (+ FAB height if any).

**Mistakes**: 6+ tabs; hamburger + tab bar; tiny 9px tab labels (common on Dribbble); horizontally-scrolling card rails as the main content; FAB covering the last row; status bar content clipped.

**Source**: No web OSS equivalent; for RN use Expo Router Tabs. For web mobile, [shadcn-ui/apps/v4/registry/new-york-v4/ui/sidebar.tsx](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/sidebar.tsx) (Sheet below 768px). cal.com `MobileNavigation` in [cal.com/apps/web/modules/shell/navigation/Navigation.tsx](https://github.com/calcom/cal.com/blob/main/apps/web/modules/shell/navigation/Navigation.tsx) (MIT): the cleanest web reference for a bottom tab bar: 4 items (last = "More"), 20px icon + 4px + 12px 500 label, active = emphasis text color only, translucent blurred background with top border, safe-area inset; note its own bug: the 48px content spacer is shorter than the ~64px bar, so the last row hides behind it. **Always pad content by the full bar height.**

---

## 15. Mobile list + detail

**Exemplars**: cal.com booker mobile [calcom-demo-mobile.jpg](https://www.clox.co/assets?path=design-library/app/saas/calcom-demo-mobile.jpg) (stacked: info, grid, slots); shadcn-admin mobile [shadcn-admin-tasks-mobile.jpg](https://www.clox.co/assets?path=design-library/app/oss-blocks/shadcn-admin-tasks-mobile.jpg), [shadcn-admin-mobile.jpg](https://www.clox.co/assets?path=design-library/app/saas/shadcn-admin-mobile.jpg) (KPI cards stack 1-col, header 64px); Things iPhone list; Dribbble `finance-app-07` transaction list, `journal-app-02` entry list -> entry.

**Rules**
- List: full-bleed rows (no card per row) or a single inset grouped container r12-16; row 56-72px, leading 32-40px avatar/icon, title 15-16px 500, subtitle 13-14px muted, trailing value right-aligned tabular (amount) or chevron; 1px separators inset to the text start.
- Group by date with sticky 13px 600 muted headers ("Today", "Yesterday").
- Detail: push navigation with back chevron + title 17px 600 centered (iOS) or left (Android); hero value 32-40px; then key/value rows 44-52px; primary action bottom-docked full width (48-52px, r12) above safe area.
- Search as a 36-40px field under the title; filters as a horizontally scrolling chip row (32px chips).

**Mistakes**: desktop tables squeezed to 390px; modal-on-modal; detail as a bottom sheet that covers the whole screen without a grabber; tiny 12px list titles.

---

## 16. Notifications / activity feed

**Exemplars**: Linear activity in issue ([linear-app-crop.jpg](https://www.clox.co/assets?path=design-library/app/saas/linear-app-crop.jpg): 13-14px rows with 16px avatar/icon, actor name 500, action muted, relative time "2 min ago" muted); Midday notification center (code); next-shadcn starter notification center (code).

**Rules**
- Bell: 32px ghost icon button; unread = 6-8px dot (Midday #FFD02B) or count badge 16px min, 10px text (starter) [C].
- Popover 380-400px wide, max-height ~400-535px scroll; header row 14px 600 "Notifications" + "Mark all read" 12px ghost; tabs Inbox/Archive optional [C].
- Item: padding 12px, gap 12-16px, 32-36px round icon/avatar, text 14px (500 when unread), time 12px muted; dividers between items [C].
- Activity feed in a detail page: vertical list, 8-12px between events, system events in muted 13px with a 16px icon, human comments as 14px body under name + time; group consecutive system events.
- Toasts: bottom-right desktop / top on mobile, 360-420px wide, title 14px 500 + description 13-14px muted, one action, auto-dismiss 4-6s.
- Empty: muted 32px icon at 40% + "No notifications yet" 14px muted, 48px vertical padding [C].

**Mistakes**: red badge counts on everything; notification rows as tall cards with shadows; absolute timestamps with seconds.

**Source**: [next-shadcn-dashboard-starter/src/features/notifications/components/](https://github.com/Kiranism/next-shadcn-dashboard-starter/blob/main/src/features/notifications/components/){notification-center.tsx,notifications-page.tsx}` (MIT); [midday/apps/dashboard/src/components/notification-center/](https://github.com/midday-ai/midday/blob/main/apps/dashboard/src/components/notification-center/)*` (AGPL, study only). [cal.com/packages/ui/components/toast/showToast.tsx](https://github.com/calcom/cal.com/blob/main/packages/ui/components/toast/showToast.tsx) (MIT): bottom-center toasts, 6s, r8, subtle border + low shadow, padding 12/10, 14px 600, max 384px, 16px icon + close; inverted in dark mode. dub activity log [dub/apps/web/ui/activity-logs/](https://github.com/dubinc/dub/blob/main/apps/web/ui/activity-logs/)*` (AGPL, study only): timeline with 24px icon circles joined by a 1px neutral-200 line, 12px icon gap, 16-24px between entries, value chips r8 neutral-100 14px 500.

---

## 17. Component quick reference (copy these numbers)

| Component | Spec | Source |
|---|---|---|
| Button | xs 24 / sm 32 / default 36 / lg 40px; r8; 14px 500; px 16 (12 with icon); 16px icon; gap 8; focus ring 3px ring/50 | shadcn `ui/button.tsx` (MIT) |
| Icon button | 32 or 36px square, ghost | shadcn |
| Input / Select | 36px (32 compact), px 12, r8, 1px `--input`, shadow-xs; 16px font on mobile, 14px md+ | shadcn `ui/input.tsx` |
| Badge | 12px 500, px 8 py 2, r-full or r6; status tint = 50 bg / 800 text / ring 600@30% | shadcn `ui/badge.tsx`, Tremor `Badge.tsx` (Apache-2.0) |
| Card | r14, 1px border, py 24, gap 24, px 24, title 16px 600, desc 14px muted | shadcn `ui/card.tsx` |
| Dialog | max-w 512px, p 24, gap 16, r8-10 | shadcn `ui/dialog.tsx` |
| Sheet | right, 384px (sm) to 520px | shadcn `ui/sheet.tsx`; Midday |
| Tabs | list 36px, padding 3px, r10; trigger 14px 500 | shadcn `ui/tabs.tsx` |
| Switch | 32 x 18px | shadcn `ui/switch.tsx` |
| Tooltip | 12px, px 12 py 6, r6, inverted colors | shadcn `ui/tooltip.tsx` |
| Avatar | 32px default; 20-24px in lists/activity; 40px in profile rows | shadcn |
| Progress bar | 6-8px tall, r-full, track = 100-200 shade of same hue | Tremor `ProgressBar.tsx` |

### Color tokens (shadcn-admin [shadcn-admin/src/styles/theme.css](https://github.com/satnaing/shadcn-admin/blob/main/src/styles/theme.css), MIT)

| Token | Light | Dark |
|---|---|---|
| background | oklch(1 0 0) | oklch(0.145 0 0) |
| foreground | oklch(0.145 0 0) | oklch(0.985 0 0) |
| card | oklch(1 0 0) | oklch(0.205 0 0) |
| muted / secondary | oklch(0.97 0 0) | oklch(0.269 0 0) |
| muted-foreground | oklch(0.556 0 0) | oklch(0.708 0 0) |
| border / input | oklch(0.922 0 0) | oklch(1 0 0 / 10%) / 15% |
| destructive | oklch(0.577 0.245 27.3) | oklch(0.704 0.191 22.2) |
| radius | 0.625rem = 10px (sm 6, md 8, lg 10, xl 14) | |
