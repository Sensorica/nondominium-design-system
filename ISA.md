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
| 7 | `/app` renders 28 keyed screens across the `shell` and `gate` groups | A screen-map entry 404s |
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
| 1 | Core: tokens, paths, shell, brand brief, manifest, LICENSE, CONTRIBUTING | pending |
| 2 | SurfaceKeys, MockState | pending |
| 3 | PrototypeApp | pending |
| 4 | FlowGuards | pending |
| 5 | ScreenMap | pending |
| 6 | Playbook, Scenarios | pending |
| 7 | Review | pending |
| 8 | StaticDeploy, Parity | pending |
| 9 | Verify | pending |

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | Keep UnoCSS rather than the reference's vanilla CSS | The design system mirrors its source stack; `nondominium/ui` is UnoCSS plus Melt |
| D2 | Registry stays `active`, not `legacy` | External consumers embed `bundle.js`; the reference marked its own legacy only because it stopped using it |
| D3 | Review backend is a dedicated private repo, `Sensorica/nondominium-design-review` | Matches the reference's isolation of review chatter from the product repo |
| D4 | NDO detail tabs become routes, not in-page tabs | Every surface must be deep-linkable and commentable |
| D5 | Route groups are `shell` and `gate` only | Nondominium has no admin panel |

## Changelog

- 2026-08-11 — ISA written; review repo created with Discussions enabled.

## Verification

_Filled by Phase 9. Each criterion closes on named tool evidence: screenshot path, command
output, or file diff._
