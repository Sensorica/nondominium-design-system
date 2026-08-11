# ISA — Nondominium Design System

**Slug**: `nondominium-ds-rewrite`
**Started**: 2026-08-11
**Status**: in progress
**Reference standard**: `requests-offers-design-system` (hAppenings Community)

---

## Problem

The Nondominium design system is a token library with five playbook pages and five static
ui-kit pages. It has no machine-readable manifest, no routing discipline, no mock state, no
navigable prototype, no review channel, and no parity tracking against the app it serves.
An agent reading the repo cannot learn its shape in one read, and a reviewer cannot leave a
comment on a specific surface. The hAppenings design system solves all of these; this one
does not.

## Vision

A design system that is self-describing (a `designsystem:` manifest in `SKILL.md`), whose
every URL is produced by one module, whose prototype `/app` subtree renders every screen the
Nondominium hApp has, whose lifecycle and identity flows are driven by state machines that
mirror the Rust validation, and where every screen and scenario carries a threaded comment
channel. Eleven capability packs, matching the reference implementation pack for pack.

## Out of Scope

- Changing the Nondominium hApp itself (`../nondominium/ui`). This repo prototypes it, never
  edits it.
- Real Holochain calls. The prototype runs on mock state; no conductor, no DHT.
- Replacing the `ndo-*` custom-element registry. It stays, marked `active`, because external
  consumers embed the bundle.
- Migrating off UnoCSS. Production Nondominium is UnoCSS; the design system mirrors its source.

## Principles

- **Mirror the source stack.** The design system's styling layer follows `nondominium/ui`,
  not the reference implementation's file-level choices.
- **No hardcoded route segments.** Every URL comes from `src/lib/paths.ts`.
- **Domain semantics are visual semantics.** Lifecycle stage, resource nature, and property
  regime each own a color family and a badge variant. The token API encodes the ontology.
- **The prototype is the source of truth for screens.** Scenarios and playbook pages compose
  from it, never the reverse.
- **Nothing is done until it has been rendered.** Every surface is browser-verified.

## Constraints

- Static output only (`@sveltejs/adapter-static`), deployed to GitHub Pages under
  `/nondominium-design-system`.
- Registry components cannot use Svelte 5 runes (`customElement` compiler mode) and cannot
  use UnoCSS classes (shadow DOM). They style themselves through `--ndo-*` custom properties.
- Comments are browser-to-GitHub only. No server exists.
- The lifecycle state machine must not permit a transition the Rust integrity zome rejects.

## Goal

`nondominium-design-system` carries all eleven capability packs of the reference
implementation, declared in a `spec: 1` manifest, with every surface rendered and verified.

## Criteria

| # | Claim | Falsifier |
|---|---|---|
| 1 | `SKILL.md` carries a `designsystem:` manifest with `spec: 1` and eleven capability blocks | Manifest missing, or a declared pack has no files |
| 2 | `src/lib/paths.ts` is the only module containing route segment literals | `grep` finds a route string outside `paths.ts` |
| 3 | `README.md` carries all four brand-brief sections with caveats flagged | Any section absent, or a substitution unflagged |
| 4 | `static/tokens.css` defines a brand primary scale plus the semantic layer | A component hardcodes a hex value |
| 5 | Surface keys resolve every prototype screen and every scenario | A surface returns `''` from the resolver |
| 6 | Mock state is a module-level singleton; edits persist across navigations | A create in one screen is absent in the next |
| 7 | `/app` renders 27 keyed screens across the `shell` and `gate` groups | A screen-map entry 404s |
| 8 | The `lifecycle` machine permits exactly the transitions in `specifications.md §7.5` | A transition the Rust validation rejects is offered |
| 9 | The `joining` machine walks the three-level identity ladder of `requirements.md §4.5` | A level can be skipped |
| 10 | The `m` shortcut opens a screen map whose every entry navigates | An entry navigates nowhere |
| 11 | Every screen and scenario resolves a comment key; the drawer opens on `c` | A surface has no key, or the drawer fails to open |
| 12 | The static build deploys with a `404.html` SPA fallback for dynamic routes | A deep-linked `/app/ndo/[id]` reload 404s |
| 13 | Parity inventory maps every production route and component to a prototype surface | A production screen has no counterpart row |
| 14 | Every surface renders with zero console errors | Any console error at any surface |

## Test Strategy

- `bun run check` (svelte-check) clean.
- `bun run build` produces `build/` with every prerenderable route.
- Interceptor renders each surface, screenshots to `screenshots/`, console read per surface.
- Lifecycle machine transition table diffed against `specifications.md §7.5` by hand.

## Features

| Phase | Pack(s) | State |
|---|---|---|
| 0 | Baseline: ISA, review repo | done |
| 1 | Core: tokens, paths, shell, brand brief, manifest, LICENSE, CONTRIBUTING | done |
| 2 | SurfaceKeys, MockState | done |
| 3 | PrototypeApp (27 screens) | done |
| 4 | FlowGuards (joining, lifecycle) | done |
| 5 | ScreenMap | done |
| 6 | Playbook (7), Scenarios (6) | done |
| 7 | Review | done |
| 8 | StaticDeploy, Parity | done |
| 9 | Verify | done |

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | Keep UnoCSS rather than the reference's vanilla CSS | The design system mirrors its source stack; `nondominium/ui` is UnoCSS plus Melt |
| D2 | Registry stays `active`, not `legacy` | External consumers embed `bundle.js`; the reference marked its own legacy only because it stopped using it |
| D3 | Review backend is a dedicated private repo, `Sensorica/nondominium-design-review` | Matches the reference's isolation of review chatter from the product repo |
| D4 | NDO detail tabs become routes, not in-page tabs | Every surface must be deep-linkable and commentable |
| D5 | Route groups are `shell` and `gate` only | Nondominium has no admin panel |
| D6 | The surface-key resolver matches route SHAPES, not URL prefixes | The reference implementation's prefix rule fails here: `lobby` maps to `/app`, which prefixes every app path and would file every comment on the lobby thread |
| D7 | Button, tab and interactive-card rules double their class in `app.css` | Svelte compiles a page-level `a { color }` to `a.svelte-hash` (0,1,1), which beats a single class (0,1,0) and painted a primary button's label the same blue as its background |

## Parity inventory

Against `../nondominium/ui` at the revision read on 2026-08-11: 4 routes, 26 components.

| Production | Prototype surface |
|---|---|
| `routes/+page.svelte` (lobby) | `lobby` |
| `routes/group/[id]/+page.svelte` | `group-detail` |
| `routes/ndo/[id]/+page.svelte` | `ndo-detail` + six tab routes |
| `routes/ndo/new/+page.svelte` | `ndo-create` |
| `shell/AppShell.svelte` | `(shell)` layout |
| `shell/Sidebar.svelte` | `components/shared/Sidebar.svelte` |
| `HolochainProvider.svelte` | `connecting` |
| `lobby/LobbyView.svelte` | `lobby` |
| `lobby/NdoBrowser.svelte` | `lobby` filter panel and grid |
| `lobby/NdoCard.svelte` | `components/shared/NdoCard.svelte` |
| `lobby/GroupSidebar.svelte` | Sidebar groups section |
| `lobby/LobbyProfileBar.svelte` | Sidebar identity block |
| `lobby/ProfileSetupModal.svelte` | `profile-setup` |
| `lobby/UserProfileForm.svelte` | `profile-edit` |
| `group/GroupView.svelte` | `group-detail` |
| `group/MemberList.svelte` | `group-members` |
| `group/WorkLogFeed.svelte` | `group-work-log` |
| `group/SoftLinkList.svelte` | `group-links` |
| `group/GroupProfileModal.svelte` | `group-profile` |
| `group/NdoCreateModal.svelte` | `ndo-create` |
| `ndo/NdoView.svelte` | `ndo/[id]` layout |
| `ndo/NdoIdentityLayer.svelte` | identity panel in the `ndo/[id]` layout |
| `ndo/ActivityTab.svelte` | `ndo-activity` |
| `ndo/CompositionTab.svelte` | `ndo-composition` |
| `ndo/GovernanceTab.svelte` | `ndo-governance` |
| `ndo/ResourcesTab.svelte` | `ndo-resources` |
| `ndo/LifecycleTransitionModal.svelte` | `ndo-lifecycle` |
| `ndo/TransitionHistoryPanel.svelte` | `ndo-history` |
| `ndo/ForkNdoModal.svelte` | `ndo-fork` |
| `ndo/AssociateNdoModal.svelte` | `ndo-associate` |

Every production route and component has a counterpart. Eight prototype screens have
none, because production handles them inline or not at all: `profile-guard`,
`invite-landing`, `profile`, `agents`, `agent-profile`, `groups`, `group-create`,
`group-join`. Four of those are gates, which is exactly the class of screen this
kind of prototype exists to make reviewable.

**Drift to report upstream:** production renders NDO tabs as in-page state, so
its tab views are not deep-linkable. The prototype routes them (D4). That is a
proposal, not a mirror, and it is the one place the inventory deliberately
diverges.

## Phase 2 — pixel-perfect replica (2026-08-11)

The first pass built an interpretation of the app: my own components, my own
token layer, my own routes. Correct as a design system, useless as a record of
what exists. This phase replaced the prototype with a copy.

`src/lib/replica/` mirrors `../nondominium/ui/src/lib/components`. 17 of 24
components have byte-identical markup; all 24 emit an identical set of UnoCSS
classes, enforced by `bun run check:fidelity` and by a CI job that checks out
the app. The seven that differ do so only in wiring: hrefs go through `paths.ts`
because the site deploys under a sub-path, and modal / tab / panel state is read
from the query string so each is a linkable, commentable surface.

**Four defects found by rendering, none of which a type check or a build would
catch:**

1. **No utility CSS at all.** Nothing imported `virtual:uno.css`. Every page had
   correct markup and no styling.
2. **No effect ever ran under `/app`.** Melt's Dialog fires `onOpenChange(false)`
   while it initialises, before SvelteKit's router exists; the close handler
   called `replaceState`, which threw, and one unhandled throw during hydration
   aborts the effect flush for the whole tree. Screens painted; modals, tabs and
   store loads did nothing. Fixed by making every URL write idempotent
   (`src/lib/replica/url-state.svelte.ts`).
3. **The static fallback never hydrates.** With `ssr = false` plus `404.html`,
   app URLs client-render instead of hydrating and no effect is scheduled. Fixed
   by enumerating `entries()` for every dynamic route so all 22 prototype pages
   prerender.
4. **Two Svelte runtimes on every page.** `app.html` loaded the custom-element
   bundle globally. Now scoped to the playbook, which is the only place that
   demos the elements.

**Known gap:** `/app?profile=1` does not open the lobby profile modal. The app
mounts `ProfileSetupModal` twice (root layout and LobbyView); the prototype
keeps one, and the Melt dialog still does not open from a URL flag. Every other
prototype state renders. Tracked, not hidden.

## Changelog

- 2026-08-11 — ISA written; review repo `Sensorica/nondominium-design-review` created with Discussions enabled.
- 2026-08-11 — All eleven packs installed; two defects found and fixed in verification (D6, D7).

## Verification

Method: `bun run build` to a static artifact, served by `vite preview` at
`/nondominium-design-system`, driven through real Chrome via the Interceptor
extension. Every route was hard-navigated, so each one also exercises the
`404.html` SPA fallback.

| # | Verdict | Evidence |
|---|---|---|
| 1 | closed | `SKILL.md` frontmatter carries `spec: 1` and eleven capability blocks; each named module exists on disk |
| 2 | closed | `grep -rn "'/app" src --include=*.svelte` returns nothing outside `paths.ts` |
| 3 | closed | `README.md` carries CONTENT FUNDAMENTALS, VISUAL FOUNDATIONS, ICONOGRAPHY, Caveats; seven caveats flagged, including the inferred primary and the emoji brand mark |
| 4 | closed | `static/tokens.css` defines `--ndo-primary-50…900` plus the semantic and intent layers; no component carries a hex value |
| 5 | closed | Drawer label resolved correctly on non-representative ids: `/app/ndo/ndo9` → NDO identity panel, `/app/agents/ag5` → Agent profile, `/app/groups/gr2/members` → Group members, `/app/groups/gr3` → Group view, `/scenarios/agent-identity` → Agent identity scenario. Found and fixed the prefix-matching defect that broke this (D6) |
| 6 | closed | `appState` is a module-scope `$state` singleton; create, transition, join and associate all mutate it in place |
| 7 | closed | All 27 screens hard-navigated and rendered a heading; `/app/ndo/ndo10/lifecycle` correctly refuses at end of life |
| 8 | closed | From Development the screen offers exactly Prototype, Deprecated, EndOfLife; from EndOfLife, nothing. Matches `specifications.md` §7.5 |
| 9 | closed | Level-2 gate seeds from its URL: `/app/groups/gr1/profile` flipped the sidebar to "No Person entry yet" on cold load |
| 10 | closed | `m` opens the overlay; four groups render; the current screen is highlighted |
| 11 | closed | `c` opens the drawer on every keyed surface; the setup card names the Sensorica review repo. Posting is unverified — it needs a reviewer's own token, which this session does not have |
| 12 | closed | `/app/ndo/ndo1/governance` deep-linked and rendered on a cold load through `404.html` |
| 13 | closed | Parity inventory above: 4 routes and 26 components, all mapped |
| 14 | closed | Zero entries in the collected error and unhandled-rejection log across the exercised session |

**Two defects found and fixed during verification, not before it:**

- **D7, blue-on-blue.** Page-level `a { color }` rules in scoped style blocks
  outranked `.ndo-btn--primary`, so the Transition button rendered its label in
  the same blue as its background. Invisible, and invisible in exactly the place
  a reviewer would look first. Fixed by doubling the class in `app.css`.
- **D6, every comment on the wrong thread.** The reference implementation's
  longest-prefix resolver put `lobby` at `/app`, which prefixes every app path.
  A comment left on the lifecycle screen would have been filed under `lobby`.
  Fixed by matching route shapes with exact arity.

Both were only findable by rendering. Neither would have failed a type check or
a build.
