# Nondominium — Design System

> **Status: alpha.** This repo is the design system and prototype playground for the Nondominium hApp. See [CONTRIBUTING.md](CONTRIBUTING.md).

A design system for **[Nondominium](https://github.com/Sensorica/nondominium)** — a Holochain application for resource governance without ownership, built on ValueFlows and the nondominium property regime, developed inside the [Sensorica](https://www.sensorica.co/) open value network.

The production app is SvelteKit 5 + UnoCSS + Melt UI over a three-zome Holochain DNA. This design system is a **SvelteKit static site** that mirrors and prototypes it.

---

## Getting started

### Prerequisites

- [**Bun**](https://bun.sh) — the package manager this repo uses. Never npm.

### Install and run

```bash
git clone git@github.com:Sensorica/nondominium-design-system.git
cd nondominium-design-system
bun install
bun run build:registry   # the custom-element bundle; the playbook needs it on disk
bun run dev
```

The dev server prints a local URL (default `http://localhost:5173`). `bun run dev` sets `DEV=true`, which serves the site at the domain root; the deployed build serves it under `/nondominium-design-system`.

### Where to look

| URL | What |
|-----|------|
| `/` | Hub — four doors into the system |
| `/tokens` | Every colour, type, spacing, radius and elevation token, rendered live |
| `/playbook` | Seven component categories with variants and recipes |
| `/scenarios` | Six composed pages showing how the pieces behave together |
| `/app` | The interactive prototype — 27 keyed screens, the whole app on mock state |

---

## Comments on screens and scenarios 💬

Every `/app/*` screen and every `/scenarios/*` page can receive threaded comments, hosted in a **private GitHub Discussions repo**. The site stays fully static: comments are stored on GitHub and read and written straight from the browser.

- Click the **💬 floating button** (bottom right) or press **`c`** to open the drawer.
- A thread is keyed to the surface you are viewing. Threads are created lazily — the first comment on a surface brings its thread into existence, so browsing leaves no trace.

### Commenting as a collaborator

You need a GitHub token from a member of the `Sensorica` organisation:

1. **Be a member.** Ask an org admin to add you to `Sensorica` with access to the private `nondominium-design-review` repo.
2. **Create a token.** GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens.
   - Resource owner: `Sensorica`
   - Repository access: only `nondominium-design-review`
   - Permissions: Repository permissions → **Discussions → Read and write**
3. **Paste it.** Click 💬 → paste → Connect. It is stored only in your browser's `localStorage` and sent directly to GitHub's API. There is no server.

See [`src/lib/comments/README.md`](src/lib/comments/README.md) for the full setup and privacy model.

---

## The screen map 🗺️

Inside `/app`, press **`m`**. Every keyed screen, grouped by route group, one click away. Screens are addressed by stable **surface keys** (`ndo-detail`, `group-members`) rather than URLs, and the same key files the comment thread.

---

## Commands

```bash
bun install              # Install dependencies
bun run dev              # Dev server at the domain root (DEV=true)
bun run build            # Registry bundle, then the static site → build/
bun run build:registry   # Just the ndo-* custom-element bundle
bun run preview          # Preview the production build
bun run check            # Type-check with svelte-check
```

---

## What is in this repo

```
nondominium-design-system/
├── src/
│   ├── lib/
│   │   ├── paths.ts                 # Centralized routing — every URL is produced here
│   │   ├── surface-keys.ts          # Screen and scenario keys, and the resolver
│   │   ├── screen-map.svelte.ts     # The 🗺️ catalogue and its open state
│   │   ├── state.svelte.ts          # Mock-state singleton (edits persist for a session)
│   │   ├── mock.ts                  # INITIAL_* seed data
│   │   ├── types.ts                 # Domain types, mirroring packages/shared-types
│   │   ├── ndo-ui.ts                # Domain value → visual vocabulary
│   │   ├── app-nav.ts               # Guard route keys ↔ URLs, inverse-consistent
│   │   ├── guards/                  # State machines: joining ladder, NDO lifecycle
│   │   ├── comments/                # 💬 GitHub Discussions client and state
│   │   ├── components/
│   │   │   ├── shared/              # Sidebar, NdoCard, NdoBadge, Chip, Field, …
│   │   │   └── comments/            # Drawer, list, compose, setup
│   │   └── styles/app.css           # The component layer, written against the tokens
│   └── routes/
│       ├── +layout.svelte           # Root: token sheet, DS chrome, comments host
│       ├── app/                     # The prototype — 27 keyed screens
│       │   ├── (shell)/             # Lobby, groups, NDOs, agents
│       │   └── (gate)/              # Connecting, profile setup, person gate, invite
│       ├── scenarios/               # Six composed showcase pages
│       ├── playbook/                # Seven component categories
│       └── tokens/                  # The live token sheet
├── registry/                        # ndo-* custom elements (Svelte customElement compiler)
├── static/tokens.css                # Every --ndo-* custom property
├── ISA.md                           # Ideal-state artifact: what "done" means here
├── SKILL.md                         # Machine-readable manifest for AI agents
├── CONTRIBUTING.md
└── README.md                        # This file, and the brand brief below
```

---

## The custom-element registry

`ndo-*` elements are the embeddable form of the system: Svelte compiled to custom elements, styled entirely through `--ndo-*` custom properties so they inherit tokens through the shadow DOM. Drop them into any framework or plain HTML.

```html
<link rel="stylesheet" href="https://…/tokens.css" />
<script type="module" src="https://…/registry/bundle.js"></script>

<ndo-badge variant="lifecycle-active" label="Active"></ndo-badge>
<ndo-button variant="primary">Create NDO</ndo-button>
<ndo-status-dot status="active" label="Active"></ndo-status-dot>
<ndo-card
  name="Community Solar Array"
  description="Shared photovoltaic infrastructure…"
  hash="uhC0kVX5k7dL2mPqR…"
  href="/ndo/uhC0kVX5…"
  badges="lifecycle-active:Active;regime-nondominium:Nondominium;nature-physical:Physical">
</ndo-card>
```

Full props for each element are in [`/playbook`](src/routes/playbook).

Two architectural notes, both non-obvious:

- **Two Vite configs.** Svelte's `customElement` compiler option is incompatible with SvelteKit's SSR and routing, so the registry builds through `vite.registry.config.ts` in library mode.
- **`export let`, not runes.** Svelte 5 runes are not supported in `customElement` compile mode. Registry components use the legacy syntax; the site layer uses runes normally.

---

## Deployment

The site builds to `build/` and deploys to **GitHub Pages** through `.github/workflows/deploy.yml` on every push to `master`. The SPA fallback is `404.html`, because GitHub Pages honours only a custom 404 page as its fallback — that is what serves the client-rendered `/app/ndo/[id]` routes on a deep-link reload.

---

## AI agents and SKILL.md

`SKILL.md` is a machine-readable manifest. Its `designsystem:` block declares which capability packs this repo carries, where the tokens and the brand brief live, and what the host stack is. An agent reading this repo learns its shape in one read. You do not need to edit it unless you are adding or removing a capability.

---

## CONTENT FUNDAMENTALS

Voice is **plain, precise and unhurried**. The subject matter is governance infrastructure for real economic relationships, and the writing earns trust by being exact rather than by being warm.

- **Pronouns:** "you" for the reader. "The network", "the group", "the agent" for the system. Never "we" as a marketing voice.
- **Casing:** Sentence case for headings, buttons and labels. Domain terms keep their capitals: **NDO**, **Nondominium**, **ValueFlows**, **Holochain**, **Person** entry, **EconomicEvent**, **PPR**. Lifecycle stages and property regimes are rendered exactly as the enum spells them — `EndOfLife`, `CommonPool` — because they are values, not prose.
- **Length:** Short. Headings under 6 words. Card descriptions one sentence. Empty states one sentence and, at most, one action.
- **Tone:** Explanatory, never promotional. Where a constraint exists, name it and say why:
  - "Permanent. This is how the network refers to it."
  - "The identity anchor stays as a permanent tombstone."
  - "Browsing needs no identity at all — you only commit one when you act."
  - "Deprecating without naming a successor would strand everything that depends on this object."
- **Refusals and gates** say what was being attempted and what is missing, never just "not allowed": "You were about to: create the NDO *Neighbourhood Battery*."
- **Nulls are shown, not hidden.** `no event hash yet` beats an invented hash. Where the MVP is incomplete, the UI says which phase closes it.
- **Emoji** are the icon system, used inline in headings, buttons, nav items and status: 🧿 NDO · 🏛️ lobby · 👥 group · 👤 agent · ➕ create · 🔄 transition · 🍴 fork · 🔗 link · ⚖️ governance · 📦 resources · 📈 activity · 🧩 composition · 🕓 history · 🗺️ screen map · 💬 comments · 🪪 identity · 🔑 invite · 🕶️ pseudonymous.
- **Domain words:** *NDO*, *lifecycle stage*, *property regime*, *resource nature*, *custodian*, *contribution*, *validation*, *agreement*, *benefit redistribution*, *group*, *network seed*, *clone cell*, *source chain*, *Person entry*, *soft link*, *hard link*, *commons*, *capture-resistant*.

---

## VISUAL FOUNDATIONS

The brand reads as **plain, structural, technical**. A grey canvas, white cards with hairline borders, one blue for action, and colour reserved almost entirely for domain meaning. There is no decorative colour anywhere: if something is coloured, it is telling you what kind of thing it is.

### Colour

- **Primary** blue `#2563eb` (`--ndo-primary-600`) — buttons, links, focus ring, active nav. Extracted from the production app, where blue-600/700 is by far the dominant action colour.
- **Canvas** grey — `--ndo-gray-100` page, white cards, `--ndo-gray-200` borders, `--ndo-gray-900` sidebar rail.
- **Domain colour is the point.** Three axes, each with its own family, defined once in `ndo-ui.ts` and rendered by one badge component:
  - **Lifecycle stage** runs cool → warm → red as the object matures: grey Ideation, indigo Specification and Development, amber Prototype, green Stable, teal Distributed, emerald Active, yellow Hibernating, orange Deprecated, red EndOfLife.
  - **Resource nature**: blue Physical, purple Digital, sky Service, teal Hybrid, indigo Information.
  - **Property regime**: grey Private, cyan Commons, emerald Nondominium, rose CommonPool.
- **Intent aliases** (`--ndo-intent-success|warning|danger|info`) exist so a component asks for meaning rather than a hue.
- Light mode is dominant. Dark mode is defined on `[data-theme="dark"]` and flips only the semantic layer; the numbered scales are absolute and never redefined.

### Type

- **System UI** for body and headings, **JetBrains Mono** (falling back through `ui-monospace`) for hashes, network seeds and surface keys. Both are what the production app ships.
- **Substitution flag:** the brand has no licensed typeface. `system-ui` is the codebase's own choice, carried over deliberately rather than substituted.
- Scale: 12 / 14 / 16 / 18 / 20 / 24 / 30px, with weights 400 / 500 / 600 / 700. Headings are semibold and short; the display size is used once per page.
- Hashes are **always** monospace and **always** truncated head-and-tail (`uhC0kVX5k7dL2m…9h`), so two hashes stay distinguishable at a glance. Full values are copyable, never displayed.

### Spacing

- 2 / 4 / 6 / 8 / 12 / 16 / 20 / 24 / 32 / 48px, exposed as `--ndo-spacing-*`.
- Content column: `max-width: 1200px`, 24px page padding, 24px between sections.
- Cards and panel bodies: 16px. Card grids: 16px gap, `minmax(280px, 1fr)`.

### Backgrounds

- **No illustrations, no patterns, no gradients** as decoration. The only gradient-like surface in the system is the benefit-redistribution bar, and it is data.
- White cards on a grey page. The sidebar rail is `--ndo-gray-900` with white text at 40–92% opacity depending on state.

### Animation

- Restrained: 100–150ms colour and shadow transitions on hover, nothing else. No parallax, no scroll effects, no bounce.
- The one animation in the system is the connecting screen's opacity pulse, because waiting is the only state that needs to look alive.
- `prefers-reduced-motion` collapses every duration to 0.01ms.

### Hover and press

- Buttons shift one step darker (`primary-600` → `primary-700`).
- Interactive cards lift from `shadow-sm` to `shadow-md` and take a `primary-300` border.
- Nav items go from 8% to 13% white overlay.
- Press state is the browser default. Focus is the one token `--ndo-focus-ring`, applied through `:focus-visible` to every link, button and input.

### Borders, shadows, radii

- **8px is the base radius** (`--ndo-radius-lg`): buttons, cards, inputs, panels. 12px for modals.
- **Pill radius is reserved** for badges, chips and status dots, so a badge can never be mistaken for a control. This is the inverse of the hAppenings system, deliberately.
- Borders are 1px, `--ndo-color-border`. Elevation is four steps and stays shallow; the deepest is the modal.

### Layout

- Two-column shell: a 240px sticky rail and a content column, collapsing to one column under 860px.
- Tabs are routes, not in-page state, so every section of an NDO is deep-linkable and independently commentable.
- Two layer-level surfaces are rendered once by the app layout: the confirm modal and the toast. No screen owns its own dialog.

### Transparency and blur

- Effectively unused. The sidebar's white overlays are the only alpha compositing in the system; there is no glass, no backdrop blur.

### Imagery

- **There is none.** No logo file, no photography, no illustration set. The brand mark is the emoji 🧿, used as the wordmark glyph and the favicon. Designs that need imagery will need user-supplied assets.

### Card (canonical recipe)

```html
<a class="ndo-card ndo-card--interactive" href="…">
  <div class="flex items-start justify-between gap-3">
    <h3 class="ndo-h3">Community Solar Array</h3>
    <span class="ndo-badge ndo-badge--lifecycle-active">⚡Active</span>
  </div>
  <p class="ndo-small mt-2 line-clamp-2">Shared photovoltaic infrastructure…</p>
  <div class="mt-3 flex flex-wrap gap-1.5">
    <span class="ndo-badge ndo-badge--regime-nondominium">🧿Nondominium</span>
    <span class="ndo-badge ndo-badge--nature-physical">🔩Physical</span>
  </div>
  <div class="mt-3 flex items-center justify-between gap-3">
    <span class="ndo-mono">uhC0kVX5…fG9h</span>
    <span class="ndo-small">Kesse Nyarko</span>
  </div>
</a>
```

---

## ICONOGRAPHY

There is **no icon font and no SVG icon set**. Icons are **emoji**, sized through the type scale. This is intentional and load-bearing: emoji survive being pasted into a GitHub Discussion, carry a name to a screen reader, and cost nothing to ship.

- **Domain vocabulary** is defined once in `src/lib/ndo-ui.ts` and never re-picked at a call site. Lifecycle: 💭 Ideation · 📐 Specification · 🔧 Development · 🧪 Prototype · ✅ Stable · 🌐 Distributed · ⚡ Active · 🌙 Hibernating · 📦 Deprecated · 🪦 EndOfLife. Nature: 🔩 Physical · 💾 Digital · 🛠️ Service · 🔗 Hybrid · 📚 Information. Regime: 🔒 Private · 🌱 Commons · 🧿 Nondominium · 🫧 CommonPool.
- **Status dots** are emoji: 🟢 active · 🟡 pending · ⚪ inactive · 🔴 error · 🟣 coming soon.
- **The brand mark** is 🧿 — a nazar. It is not a logo file; it is the wordmark glyph, chosen because the object it names is the thing the whole protocol is built to protect.
- **No Lucide, no Heroicons, no Material.** If a future surface needs a stricter set — a dense admin table, say — substituting Lucide at 1.5px stroke would be the recommendation, and it would be a flagged substitution.

---

## Caveats

- **Typeface is not substituted, and that is a decision.** The codebase ships `system-ui`; this system carries that forward rather than promoting a Google Font it does not use. If Sensorica adopts a licensed face, it belongs here.
- **The brand mark is an emoji.** There is no logo asset in either repo. 🧿 is a stand-in that happens to fit; a real mark would replace it.
- **The primary blue is inferred, not given.** It was extracted by frequency from the production UI, where nothing declares itself the brand colour. It is the right blue for what the app currently does; it is not a brand decision anyone has made.
- **`PropertyRegime` disagrees with itself across the codebase.** The Rust crate carries six variants; the UI package and this system carry four, after the design review that removed `Collective` and `Pool`. The badge registry still renders all six for data that predates that decision. Reconciling the two is tracked in the app repo, not here.
- **`ResourceNature` in code exceeds the specification.** `Service` and `Information` exist in the crate beyond the three variants in `ndo_prima_materia.md`; the forward-map variants `Space`, `Method` and `Currency` do not exist yet in either.
- **Transition events are null.** `NdoTransitionHistoryEvent.event_hash` is `null` throughout, because automatic `EconomicEvent` generation is backend Phase 2.3. The UI shows the null rather than hiding the column.
- **Lifecycle authorization is initiator-only.** Role-based authorization (REQ-NDO-LC-07) is deferred to the governance operator, so the prototype gates transitions on the initiator and says so on the screen.
- **The prototype is mock state.** No conductor, no DHT, no gossip. Everything that is eventually consistent in production is immediate here, which is exactly the property the group-collaboration scenario exists to discuss.
