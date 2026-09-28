# Nondominium Design System

Design guide for **Nondominium** — a ValueFlows-compliant, agent-centric resource-sharing hApp built on Holochain by the **Sensorica** open value network. Nondominium lets any agent create and govern *Nondominium Objects* (NDOs): resources that are organization-agnostic, uncapturable, and governed by embedded rules, peer validation and Private Participation Receipts rather than by a platform.

Product structure is a fractal holarchy: **Lobby → Group → NDO**. The lobby lists every NDO across your groups; each group is its own DHT with members, NDOs and invite links; each NDO has a Layer 0 identity (lifecycle, nature, regime), Layer 1 governance (typed rules, rivalry, spec scope) and Layer 2 operations (economic resources, events, operational state).

There is one product surface: the **Nondominium web app** (SvelteKit + UnoCSS, runs against a local Holochain conductor).

## Sources
- GitHub: https://github.com/Sensorica/nondominium-design-system — tokens (`static/tokens.css`), custom-element registry (`registry/ndo-*.svelte`), playbook + UI-kit scenario routes.
- GitHub: https://github.com/Sensorica/nondominium — the hApp; UI in `ui/src/lib/components/{shell,lobby,group,ndo}`, logo at `nondominium_logo.png`.
- Local mount used for this build: `Sensorica/nondominium-design-system`, `Sensorica/nondominium`.
- Related: https://www.sensorica.co/ventures/infrastructure/nondominium · https://valueflo.ws/

Explore those repos further (especially `ui/src/lib/components/ndo/*` and the DS `scenarios/` routes) for screens not recreated here.

## Index
- `styles.css` — entry point; `@import`s only.
- `tokens/` — `colors.css` (verbatim DS palette), `app-extended.css` (extra Tailwind shades the live app uses: `-300` chip borders, `sky` for Public), `typography.css`, `spacing.css` (spacing, radii, shadows, motion), `base.css`.
- `components/` — `badge/Badge`, `button/Button`, `card/Card`, `status/StatusDot` (each with `.d.ts`, `.prompt.md`, card HTML).
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand).
- `ui_kits/app/` — exhaustive interactive recreation of the web app: every live screen, modal and state, plus the DS repo's prototype screens. A kit-only **Screens ▾** jumper lists them all. See `ui_kits/app/README.md` for the component → file coverage map.
- `assets/` — `nondominium_logo.png`, `favicon.svg`.
- `thumbnail.html`, `SKILL.md`, `github.md`.

## Components
The source registry defines exactly four custom elements; they are recreated 1:1 as React:
- **Badge** (`<ndo-badge>`) — 40 domain variants across lifecycle / nature / regime / rule / rivalry / scope / opstate / special.
- **Button** (`<ndo-button>`) — primary, ghost, destructive; disabled; `href` renders a link.
- **Card** (`<ndo-card>`) — NDO summary card with badges string `"variant:label;…"`.
- **StatusDot** (`<ndo-status-dot>`) — active, inactive, pending, coming-soon.

The **App shell** (13rem sidebar + fluid main) is a CSS recipe in the source, not a component — documented in `guidelines/layout-shell.html` and implemented in `ui_kits/app/Shell.jsx`.

Intentional additions: none. `BADGE_VARIANTS` (style map) is exported from Badge for reuse in filter chips.

## CONTENT FUNDAMENTALS
- **Voice:** plain, technical, matter-of-fact. Copy explains the data model rather than selling it: "Joining an NDO records your participation on the DHT. This is distinct from associating the NDO with a group (a curated short list for group members)."
- **Domain vocabulary is kept verbatim** and in PascalCase where it's an enum: `Nondominium`, `CommonPool`, `EndOfLife`, `AccessRequirement`, `transfer_custody`. Holochain/ValueFlows terms (DHT, action hash, agent, conductor, EconomicResource, AccountableAgent) appear unexplained.
- **Casing:** Sentence case for headings and buttons ("Browse NDOs", "NDO browser", "Copy invite link", "Associate with a group", "Fork this NDO"). Some form labels use Title Case ("Property Regime", "Resource Nature"). Section/meta labels are UPPERCASE tracked ("GROUPS", "PROPERTY REGIME", "STAGE:").
- **Person:** second person, sparing — "Browse NDOs on your conductor.", "You have joined this NDO.", "Set up your profile". No "we".
- **States:** progress uses an ellipsis: "Loading NDOs…", "Joining…", "Creating…". Errors are short and actionable: "Invalid invite code.", "Could not load members. They may not have reached this node yet."
- **Empty states** explain why: "NDOs are scoped to groups. Start by creating a group or pasting an invite link."
- **Glyphs as affordances:** `+ New Group`, `→ Join Group`, `← Sensorica`, `Advance stage →`, `⎘` copy, `✓` copied, `⚠` warnings, `·` meta separator, `—` for missing values and in option descriptions ("Ideation — concept declared, not yet specified").
- **Emoji:** the DS prototype create form uses a few (🔵 💡 ✅ 🔗) in hints; the shipping app doesn't. Avoid them by default.
- **Hashes** are always shown truncated in mono: `#uhC0kVX5k7dL…`, `uhCAk2vMp8…`.

## VISUAL FOUNDATIONS
- **Overall vibe:** utilitarian Tailwind-default admin UI. Gray-100 app ground, white cards, gray-50 sidebars/strips, a single blue for action. Color is spent almost entirely on **meaning** (badges); chrome stays neutral.
- **Color:** Tailwind default palette as RGB triplets (`rgb(var(--ndo-blue-600) / .12)`). Blue-600 primary / blue-700 hover; red-700 destructive/error; amber for pending/warnings. Every domain concept owns a hue — see `guidelines/colors-*.html` and the vocabulary map in `tokens/colors.css`. There's no semantic token layer over the concept colors, on purpose: one place to change each concept's color.
- **Shape encodes layer:** filled tint = Layer 0 classification; dashed outline = property regime; 3px solid left edge + mono = Layer 1 rule; pill + leading dot = Layer 2 operational state. Keep this grammar.
- **Type:** system-ui sans, ui-monospace for hashes/rule payloads. Scale 12/14/16/18/20/24. Titles bold (24 page, 20 NDO), section headers semibold 18, body 14 in gray-600, meta 12 in gray-500/400. No display face, no italics except empty/loading hints.
- **Spacing:** Tailwind 4px steps (2, 4, 6, 8, 12, 16, 24, 32). Page padding 24px; card padding 16px (detail card 20px); list gaps 8px; grid gaps 12px.
- **Backgrounds:** flat. No imagery, gradients, textures or illustrations in the app.
- **Borders:** 1px gray-200 everywhere; gray-100 for internal dividers; gray-300 for ghost buttons, inputs and dashed empty states.
- **Corner radii:** 4px (badges, nav items, small buttons), 6px (buttons, inputs, list items), 8px (cards, panels), 12px (form cards, opstate pills). Member role tags and regime chips are full pills.
- **Cards:** white, 1px gray-200, 8px radius, `shadow-sm`; hover → `shadow-md` (the only hover change). No colored left borders on cards.
- **Shadows:** very soft (5–8% black). sm for resting cards and the active sidebar item, md for hover/success, lg reserved.
- **Hover:** background tint (gray-50/100, blue-50) or one step darker (blue-600 → 700); filter chips go 60% → 100% opacity; text links underline. **Press:** no shrink or special press state. **Selected:** 2px ring in currentColor with 1px offset (filter chips); white + shadow-sm (sidebar); gray-50 tab with border sides (tabs).
- **Focus:** border blue-600 + 3px blue-600/12% ring.
- **Motion:** 150ms ease on colors, shadows, opacity only. Spinner (`animate-spin`) and skeleton pulse (`animate-pulse`) for loading. No entrance animations.
- **Transparency/blur:** none beyond alpha tints; no backdrop blur.
- **Layout:** full-height flex shell — 13rem fixed sidebar, main is `min-w-0 flex-1 overflow-auto`. NDO detail stacks white header+tabs → detail card → gray-50 identity strip → tab body. Forms center at `max-width: 42rem`.
- **Disabled:** 50% opacity, `not-allowed`.

## ICONOGRAPHY
- The app has **no icon set**: no icon font, no SVG sprite, no PNG icons. UnoCSS `presetIcons` is configured in the DS repo but unused in any shipped component.
- Affordances use **Unicode glyphs inline with text**: `+`, `→`, `←`, `⎘`, `✓`, `⚠`, `·`, `—`. Status is conveyed with colored dots (`StatusDot`, opstate badge dot), not icons.
- Emoji: absent from the live app; present only in the DS create-form prototype hints. Don't add them.
- If a future design needs icons, flag it and propose one (e.g. Lucide at 1.5px stroke to match the thin system type); don't assume.

## Brand assets
- `assets/nondominium_logo.png` — 1024² raster on an off-white ground: teal/blue/violet link-chain "N" above a navy "Nondominium" wordmark. No SVG or transparent version was found. It appears in the repo README only; the app chrome shows no logo (the DS shell preview uses a text "NDO" in blue-700 bold caps).
- `assets/favicon.svg` — framework default favicon shipped in `ui/`, not brand-specific.

## Fonts
No webfonts are shipped by the source; both `--ndo-font-sans` and `--ndo-font-mono` are system stacks. The source mono stack also names `'JetBrains Mono'`; it was removed here because no font file is available.
