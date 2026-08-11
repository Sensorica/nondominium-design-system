# Nondominium — Design System

> **Status: alpha.** The design system and prototype playground for the Nondominium hApp. See [CONTRIBUTING.md](CONTRIBUTING.md).

A design system for **[Nondominium](https://github.com/Sensorica/nondominium)** — a Holochain application for resource governance without ownership, built on ValueFlows and the nondominium property regime, developed inside the [Sensorica](https://www.sensorica.co/) open value network.

**This repo documents what the app actually looks like today, not an aspiration.** The prototype at `/app` is a replica: its components are copies of `../nondominium/ui/src/lib/components`, rendering the same markup and the same UnoCSS classes against mock data instead of a conductor. A check enforces that (`bun run check:fidelity`), and the playbook cites the file each pattern came from. When the app changes, this repo is wrong until someone re-copies it — deliberately, because a design system that drifts quietly is worse than none.

---

## Getting started

### Prerequisites

- [**Bun**](https://bun.sh). Never npm.
- The app checked out as a sibling (`../nondominium`) if you want the fidelity check to run.

### Install and run

```bash
git clone git@github.com:Sensorica/nondominium-design-system.git
cd nondominium-design-system
bun install
bun run build:registry   # the custom-element bundle; the playbook loads it from disk
bun run dev
```

`bun run dev` sets `DEV=true` and serves at the domain root. The deployed build serves under `/nondominium-design-system`.

### Where to look

| URL | What |
|-----|------|
| `/` | Hub |
| `/tokens` | The palette and scale the app uses, rendered live |
| `/patterns` | Seven categories of pattern the app writes today, each citing its source file |
| `/playbook`, `/ui-kit` | `@nondominium/ndo-ui`: component sheets, and screens composed from them |
| `/scenarios` | Six composed pages, each arguing one design question |
| `/app` | **The replica** — 39 keyed states of the real app, on mock data |

---

## The replica

`src/lib/replica/` mirrors `../nondominium/ui/src/lib/components` one for one:

```
replica/
├── shell/     AppShell, Sidebar
├── lobby/     LobbyView, LobbyProfileBar, NdoBrowser, NdoCard,
│              UserProfileForm, ProfileSetupModal
├── group/     GroupView, MemberList, SoftLinkList, WorkLogFeed,
│              NdoCreateModal, GroupProfileModal
├── ndo/       NdoView, NdoIdentityLayer, ResourcesTab, GovernanceTab,
│              ActivityTab, CompositionTab, TransitionHistoryPanel,
│              LifecycleTransitionModal, ForkNdoModal, AssociateNdoModal
├── types.ts   copied from packages/shared-types
├── mock.ts    seed data in the shapes the real stores emit
└── stores.svelte.ts   mock lobbyStore / groupStore / appContext, same API
```

Seventeen of the twenty-four have byte-identical markup. The other seven differ only in wiring, and only for two reasons:

1. **hrefs go through `src/lib/paths.ts`**, because this site deploys under a GitHub Pages sub-path and the prototype is mounted at `/app`.
2. **Modal, tab and panel state is read from the query string**, so each of those states is a URL a reviewer can link to and comment on. The app keeps them in local component state, which is right for the app and useless for a review tool.

Neither changes a class. `bun run check:fidelity` fails the build if any of them ever does.

### The states you cannot reach in a running app

Roughly half the screens the app implements are ones nobody can open on demand. A spinner shows for as long as the conductor takes. An error banner needs a broken conductor. The onboarding panel needs an agent with no groups, which you are exactly once. A not-found NDO needs a link that outlived its record. They ship, they go unreviewed, and they are usually where the rough edges are.

`?state=` picks which one the mock layer serves:

| Param | Renders |
|---|---|
| `loading` | the in-flight spinner on the lobby, a group, or an NDO |
| `error` | the load-failure banner and its Retry, with the app's own copy |
| `empty` | nothing in it yet: no NDOs, no members, no soft links, no work log |
| `onboarding` | first run, no groups — the dashed Create-or-join panel |
| `filtered` / `filtered-empty` | filters applied, with and without matches |
| `no-profile` | no Level 1 profile: the Set-up-profile call to action |
| `anonymous` | no agent key: which write actions survive, and which do not |

Four more are properties of a record rather than a route, so they are keyed to a hash: hibernating, deprecated with a successor, end of life, and every tab empty. `src/lib/records.ts` names them and says why each earns a key.

The replica components never see the param. They read `lobbyStore.isLoading` and `appContext.myAgentPubKey` exactly as they always have; the mock store decides what those mean. That is what lets the components stay copies rather than forks.

### What the replica does not have

No conductor, no DHT, no gossip. Everything eventually consistent in production is immediate here — which is exactly the gap the group-collaboration scenario exists to discuss.

### What the app has that this does not

- **`lobby/GroupSidebar.svelte` is orphaned.** Nothing imports it; `shell/Sidebar.svelte` superseded it and the two have drifted (different widths, different palettes, different copy for the same two buttons). Replicating dead code would misrepresent the app, so it is recorded here instead. Deleting it is a call for the team.
- **`HolochainProvider.svelte`** is replicated as `replica/ConnectionState.svelte`, which reproduces all three of its branches. It differs in one respect: the app's disconnected branch offers a Connect button when `autoConnect` is false, and the app always passes true, so that button is unreachable in production and is not shown here.

---

## Comments on screens and scenarios 💬

Every prototype state and every scenario can receive threaded comments, hosted in a **private GitHub Discussions repo**. The site stays fully static: comments are read and written straight from the browser.

- Click the floating button (bottom right) or press **`c`**.
- A thread is keyed to the surface you are viewing, not its URL, so a route change never orphans a review thread. Threads are created lazily — browsing leaves no trace.

You need a fine-grained GitHub token from a member of the `Sensorica` organisation, scoped to `nondominium-design-review` with **Discussions: Read and write**. It is stored only in your browser. See [`src/lib/comments/README.md`](src/lib/comments/README.md).

## The screen map 🗺️

Inside `/app`, press **`m`**: every keyed state, grouped, one click away — including the three connection states nobody can reach in a running app.

---

## Commands

```bash
bun install               # Install dependencies
bun run dev               # Dev server at the domain root
bun run build             # Registry bundle, then the static site → build/
bun run build:registry    # Just the ndo-* custom-element bundle
bun run preview           # Preview the production build
bun run check             # svelte-check + the fidelity check
bun run check:fidelity    # Compare the replica against ../nondominium/ui
```

---

## The custom-element registry

`ndo-*` elements are an **embeddable** layer: Svelte compiled to custom elements, styled entirely through `--ndo-*` custom properties so they inherit tokens through the shadow DOM. **The app does not use them.** They exist so the visual language can be dropped into a slide, a wiki page, or another framework.

```html
<link rel="stylesheet" href="https://…/tokens.css" />
<script type="module" src="https://…/registry/bundle.js"></script>

<ndo-badge variant="lifecycle-active" label="Active"></ndo-badge>
<ndo-button variant="primary">Create NDO</ndo-button>
<ndo-status-dot status="active" label="Active"></ndo-status-dot>
```

Two non-obvious constraints, both real: Svelte's `customElement` option is incompatible with SvelteKit's SSR, so the registry builds through its own `vite.registry.config.ts`; and runes are unsupported in that mode, so registry components use `export let`.

---

## Deployment

Builds to `build/`, deploys to GitHub Pages on every push to `master`. The SPA fallback is `404.html`, because Pages honours only a custom 404 page as its fallback, and that is what serves the client-rendered `/app/ndo/[hash]` routes on a deep-link reload.

---

## AI agents and SKILL.md

`SKILL.md` carries a `designsystem:` manifest declaring which capability packs this repo has, where the tokens and brand brief live, and what the host stack is. An agent reading this repo learns its shape in one read.

---

## CONTENT FUNDAMENTALS

Voice is **plain, technical and slightly terse**. Sentences state what a thing is. Nothing is sold.

- **Pronouns:** "you" and "your" for the reader's own things ("your groups", "How you appear in the Lobby"). The system is named, never personified.
- **Casing:** Sentence case throughout, including buttons ("Create NDO", "Copy invite link", "Set up your profile"). Domain terms keep their capitals: **NDO**, **Lobby**, **Group**, **Person**, **NondominiumIdentity**, **Layer 0**, **SoftLink**. Enum values render exactly as spelled: `EndOfLife`, `CommonPool`, `AccountableAgent`.
- **Length:** Short. Headings two to four words. Descriptions one sentence. Section subtitles one sentence ("All NDOs across your groups.").
- **Explanations sit under the control they explain**, as `text-xs text-gray-500`. The create form's regime and nature hints change with the selection; that is the app's only teaching surface and it is worth keeping.
- **Unbuilt things are named, with a citation.** "NDO member listing is not yet implemented on the DHT. See documentation/zomes/resource_zome.md § NDO membership (planned)." This is unusual and it is the best habit in the codebase.
- **Empty states state the fact, then the remedy**: "No NDOs yet. Create one inside a group to see it here."
- **Errors are plain**: "Group name is required.", "Invalid invite code.", "Could not refresh NDO details from the chain. Data shown may be cached."
- **Domain words:** *NDO*, *Lobby*, *group*, *network seed*, *invite link*, *lifecycle stage*, *property regime*, *resource nature*, *initiator*, *custodian*, *soft link*, *specification*, *economic resource*, *governance rule*, *Layer 0*.

---

## BRAND

There is one brand asset: the **Nondominium logo** — a linked-node monogram in teal, violet and blue over a near-black navy wordmark, at `static/assets/`.

| Asset | Use |
|---|---|
| `nondominium-logo.png` | The full lockup: mark plus wordmark. The hub's hero. |
| `nondominium-mark.png` | The mark alone, square. Rails, chips, anywhere the wordmark will not fit. |
| `favicon.png` | The mark at 256px. |

Both are white-keyed to transparency, so the mark sits correctly on the ink rail as well as on white.

Sampled from the file, and the only values in `tokens.css` that are a brand decision rather than a Tailwind default:

| Token | Value | Where it comes from |
|---|---|---|
| `--ndo-brand-teal-500` | `#14b8b8` | The mark's largest area, so it leads |
| `--ndo-brand-violet-500` | `#7048d8` | Upper-right node |
| `--ndo-brand-blue-500` | `#2f6bcc` | Lower-left node |
| `--ndo-brand-ink` | `#0b1a38` | The wordmark |
| `--ndo-brand-gradient` | teal → blue → violet, 135° | Repeats the mark's own left-to-right run |

**These dress the design system's own chrome and nothing else.** The rail is brand ink with a gradient hairline down its edge; the hub's cards carry the gradient on their top edge; the active nav item is marked in brand teal. Inside `/app` none of it appears, because the app has no brand layer and the replica must not invent one. The one exception is the chip at the bottom left, which is prototype chrome rather than app UI, and which exists because the design-system rail is hidden inside the prototype and the app has no link back out.

---

## VISUAL FOUNDATIONS

The app reads as **a plain, dense administrative interface**. Grey canvas, white cards, hairline borders, one blue for action, and colour used almost exclusively to carry domain meaning. There is no brand layer at all: no logo, no wordmark, no illustration, no icon set.

### Where the styling lives

Entirely in UnoCSS utility classes written inline. `app.css` is one line (the Tailwind reset) and `uno.config.ts` is `presetUno()` plus `presetIcons()`. There is no theme file, no token file, and no component library in the app. **Every value below is a Tailwind default**, and this repo's `static/tokens.css` documents them so the custom elements have something to inherit.

### Colour

- **Action** blue: `blue-600` fill with white text, `blue-700` on hover. `blue-300` borders and `blue-50` hovers for the secondary variant. `blue-500` for focus borders.
- **Canvas**: `gray-100` page, `gray-50` sidebar and table headers, white cards, `gray-200` borders, `gray-100` hairlines.
- **Text**: `gray-900` headings, `gray-800` values, `gray-700` labels, `gray-600` body, `gray-500` hints, `gray-400` monospace and italics.
- **Domain colour** is the only decorative colour, and it always uses a 100/700 pair: lifecycle stage (gray, blue, indigo, amber, green, teal, emerald, yellow, orange, red), resource nature (blue, purple, orange, teal, indigo), property regime (gray, cyan, emerald, rose).
- **Semantic**: `red-50/200/600/700` for errors, `amber-50/100/600/700/800` for "not built yet", `yellow-50/700` and `orange-50/700` for the hibernating and deprecated strips, `green-600` for a confirmed selection.
- No dark mode.

### Type

- **No font is declared anywhere.** The app inherits UnoCSS's Tailwind reset stack, and `font-mono` for hashes, ids and network seeds. Any typeface choice would be a new decision, not a documented one.
- Sizes: `text-xs` (12px) carries most of the interface, `text-sm` (14px) is body, `text-base` for tab-panel headings, `text-lg` for card titles and modal titles, `text-2xl` for page titles. Nothing larger exists.
- Weights: `font-medium` and `font-semibold` do nearly all the work; `font-bold` is reserved for page titles and the `+` / `→` glyphs.
- Uppercase `text-xs tracking-wide text-gray-400` is the section-label treatment: "GROUPS", "Optional fields", "Stage:", "DESCRIPTION".

### Spacing and density

- Page padding is `p-6`. Cards are `p-4`. Modal sections are `px-6 py-4`. The sidebar is `p-3`.
- Gaps are small: `gap-1` and `gap-1.5` inside a row of badges, `gap-2` between buttons, `gap-3` in a card grid.
- The interface is dense on purpose. A group row is 28px tall.

### Borders, radii, shadows

- `rounded` (4px) for buttons, inputs, badges and rows. `rounded-lg` (8px) for cards and panels. `rounded-xl` (12px) for modals. `rounded-t` for tabs. `rounded-full` appears exactly once, on the member role pill.
- Borders are 1px, `gray-200` or `gray-100`.
- **A dashed border means declarative rather than observed**: the property-regime badge, an empty list, an unbuilt feature, the onboarding card. It is the app's most distinctive convention and also its most overloaded, because "empty" and "unbuilt" look the same.
- `shadow-sm` on cards, `shadow-md` on card hover, `shadow-xl` on modals. The active sidebar item uses `shadow-sm` on white to read as raised.

### Motion

- Two transitions: `transition-colors` on anything interactive, `transition-shadow` on cards. Durations are Tailwind's default.
- `transition-opacity` reveals the copy-invite button on row hover.
- One animation: `animate-spin` on a bordered circle, and `animate-pulse` on a single title-width bar while an NDO loads.

### Layout

- `flex min-h-screen bg-gray-100`, a `w-52` sidebar, and a `min-w-0 flex-1 overflow-auto` main column. That is the whole frame.
- Card grids are `grid gap-3 sm:grid-cols-2 lg:grid-cols-3`.
- Modals are centred over `bg-black/40 backdrop-blur-sm`, with a header, a `max-h-[70vh]` scrolling body, and a right-aligned footer.

---

## ICONOGRAPHY

**There is no icon system.** `presetIcons()` is configured in `uno.config.ts` and never used. No SVG set, no icon font, and no emoji in the app proper.

What the app uses instead is a handful of **text glyphs**, styled as text:

- `+` for create, `→` for join, both `font-bold` inside a `flex items-center gap-1` button.
- `⎘` for copy invite link, becoming `✓` for two seconds after a successful copy.
- `⧉` for copy event hash, in the lifecycle history.
- `·` as a separator between an agent and a timestamp.

The one exception is `HolochainProvider.svelte`, which uses three large emoji for its connection states: ⚡ connecting, ❌ failed, 🔌 not connected. They appear at `text-6xl` and exist nowhere else in the app.

**Recommendation:** if a future surface needs icons, pick one set and introduce it deliberately. `presetIcons` is already installed, so `i-lucide-*` classes would work today with no new dependency. Adding icons piecemeal would produce a third convention alongside the glyphs and the emoji.

---

## Caveats

Everything below is a statement about the app, not about this repo.

- **The app has no brand layer.** There is a logo, and this repo uses it, but nothing in `ui/` references it: no logo, no wordmark, no typeface, no icon set. The app's palette is Tailwind's defaults. Bringing the brand into the product is an open decision, not something this repo should quietly assume.
- **The brand palette is sampled, not specified.** The five brand tokens come from reading pixels out of the logo file. If there is a brand guide with authoritative values, they should replace these.
- **The stage colour map is written out three times** and the three do not agree: `NdoBrowser` has ten colours with borders, `NdoIdentityLayer` has the same ten without borders, and `NdoCard` collapses all ten into green-or-grey. See `/playbook/badges`.
- **Two sidebars exist.** `shell/Sidebar.svelte` is mounted; `lobby/GroupSidebar.svelte` is unreferenced and differs in width, background and hover colour.
- **`/agent/<key>` does not exist.** `NdoIdentityLayer` links an initiator's name to it whenever a Person entry resolves. The prototype keeps the link and renders an explanation at that route rather than hiding the defect.
- **Dashed borders are overloaded** across "declarative", "empty" and "not built yet".
- **Two modal mechanisms.** The lobby profile modal is a native `<dialog>` driven by a Melt builder and traps focus; every other modal is a fixed div that does not. They look nearly identical.
- **`presetIcons` is configured and unused.**
- **Transition event hashes are real in the app and mocked here.** The prototype seeds plausible hashes so the history panel renders; the app shows whatever the zome returns.
- **The token file is this repo's invention.** The app has no design tokens. `static/tokens.css` exists to serve the custom elements and to give the values a name; it declares no `body` styles precisely so that including it cannot change how a page renders.
---

## Two component vocabularies, and why

This repo now holds both, and they are not the same thing. Keeping them apart is deliberate.

| | Subject | Where |
|---|---|---|
| **Patterns** | The classes the app writes inline **today**. Descriptive: change the app, then re-copy. | `/patterns`, `src/lib/replica/` |
| **ndo-ui library** | The component library the app is meant to **move to**. Prescriptive. | `/playbook`, `/ui-kit`, `packages/ndo-ui/` |

Both were called "playbook" before the two lines of work met, which is what collided in the merge. The rewrite's moved to `/patterns`; `@nondominium/ndo-ui` kept `/playbook`, because it was there first.

The open question is what happens when they disagree, and they already do: `packages/ndo-ui/src/domain/variants.ts` declares one canonical stage colour map, while the app still writes three that contradict each other. That is the library doing its job, and it is a decision for the team rather than something either side should settle alone.

## @nondominium/ndo-ui (Svelte 5 component library)

Presentational Svelte 5 components ported from the [nondominium hApp](https://github.com/Sensorica/nondominium) UI. No Holochain or Effect-TS dependencies — props and callbacks only.

```typescript
import {
  AppShell,
  Sidebar,
  LobbyView,
  NdoBrowser,
  NdoCard,
  GroupView,
  NdoDetailLayout,
  applyNdoFilters,
  MOCK_NDOS
} from '@nondominium/ndo-ui';
import '@nondominium/ndo-ui/styles/tokens.css';
```

**UI-kit demos** (hApp-fidelity scenarios with mock data):

| Route | hApp equivalent |
|---|---|
| `/ui-kit/browse` | Lobby + Sidebar + NdoBrowser |
| `/ui-kit/group` | GroupView |
| `/ui-kit/ndo-detail` | NdoView + NdoIdentityLayer |
| `/ui-kit/ndo-create` | NdoCreateModal |
| `/ui-kit/agent-profile` | UserProfileForm |

Domain color maps live in `packages/ndo-ui/src/domain/variants.ts` (single source of truth matching hApp `NdoBrowser.svelte` filter chips and `NdoCard.svelte` card badges).

Future hApp adoption: add `"@nondominium/ndo-ui": "workspace:*"` (monorepo) or publish to npm and replace inline UnoCSS in `nondominium/ui`.

See [docs/INTEGRATION.md](docs/INTEGRATION.md) for parallel development workflow, badge modes, and migration checklist.

