# Contributing to the Nondominium Design System

This repo is the design system and prototype playground for the [Nondominium](https://github.com/Sensorica/nondominium) hApp. It ships four things: the tokens, the component playbook, six composed scenarios, and a navigable prototype of every screen the app has.

## What is in this repo

See the tree in [README.md](README.md#what-is-in-this-repo). Two files are load-bearing and worth knowing before you touch anything:

- **`src/lib/paths.ts`** — every URL in the system is produced here. No component, page or module writes a route segment. A route restructure changes this file and nothing else.
- **`src/lib/surface-keys.ts`** — every commentable or navigable surface has a stable key. The screen map and the comment threads both resolve through it, so a URL change never orphans a review thread.

## Running locally

```bash
bun install
bun run build:registry   # the playbook loads static/registry/bundle.js from disk
bun run dev
```

`bun run dev` sets `DEV=true` and serves at the domain root. The deployed build serves under `/nondominium-design-system`, so if you are debugging a base-path problem, run `bun run build && bun run preview`.

## Adding a design token

1. Add the custom property to `static/tokens.css`. Colours are RGB triplets so they compose with alpha: `rgb(var(--ndo-primary-500) / 0.4)`.
2. Numbered scales are absolute and are never redefined in the dark-mode block. If a value should change with the theme, it belongs in the semantic layer.
3. Add it to `/tokens` so it is visible. That page reads the live properties rather than restating them, so most additions need only a new entry in the relevant array.

## The replica is a copy, not a design

`src/lib/replica/` mirrors `../nondominium/ui/src/lib/components`. Its value is that it renders what the app renders, which is a property that decays the moment either side changes.

**Do not improve a replica component.** If a pattern is wrong, change it in the app and re-copy it here. If you copy something new, copy the markup byte for byte and change only the script — imports, and mock data in place of the Effect services.

```bash
bun run check:fidelity          # sibling ../nondominium assumed
bun run check:fidelity -- --app /path/to/ui
```

The check compares the set of UnoCSS classes each component can emit, not the bytes: seven components legitimately differ in wiring (hrefs go through `paths.ts`, modal and tab state is read from the query string). A class difference is a visual difference, and it fails the build.

## Adding a state to the prototype

The prototype's routes mirror the app's, so a new *route* only appears here after it appears there. What you will add more often is a **state** of an existing route — a modal, a tab, a panel — which is a query param here and local component state in the app.

1. Add the state to the replica component, driven by `page.url.searchParams`.
2. Add a URL function to `src/lib/paths.ts`.
3. Add a shape to `SCREEN_SHAPE` in `src/lib/surface-keys.ts`, and a label to `KEY_LABEL`.
4. Add a representative URL to `SCREEN_KEY_TO_URL` and the key to a group in `SCREEN_MAP_GROUPS`.
5. Bump `prototype-app.screens` in `SKILL.md`.

Steps 3 and 4 are what make the state navigable and commentable. A state without a key is invisible to the screen map and cannot hold a review thread.

## Adding to the playbook

A playbook page documents a pattern that **exists in the app**. Show it with the app's own class string, cite the file it came from, and where the app is inconsistent, say so in the "Drift worth fixing" block rather than picking a winner. That block is the deliverable: it is the list a future refactor works from.

Never invent a component and document it as though the app had it.

## Adding a scenario

Same shape, with `SCENARIO_KEY` and `KEY_LABEL` instead, plus a `paths.scenario*` function and an entry in the scenario index. Bump `scenarios.count` in `SKILL.md`.

## Touching the lifecycle machine

`src/lib/guards/useLifecycleFlow.svelte.ts` mirrors the Rust integrity zome's transition table. If the prototype offers a transition the zome rejects, a reviewer can approve a flow that cannot ship — which is the single failure mode that file exists to prevent. Check `documentation/specifications/specifications.md` §7.5 in the app repo before changing it, and say in the PR which revision you checked against.

## Updating the README

The README is also the brand brief. Its four brand sections — **CONTENT FUNDAMENTALS**, **VISUAL FOUNDATIONS**, **ICONOGRAPHY**, **Caveats** — are read by AI agents through `SKILL.md`, so they need to stay accurate rather than aspirational. If you substitute something the brand does not actually own (a typeface, an icon set, a colour), flag it in **Caveats**.

## Design conventions

- 8px base radius. Pill radius only for badges, chips and status dots.
- Emoji are the icon system. Domain emoji come from `src/lib/ndo-ui.ts`, never picked at a call site.
- Tabs are routes, not in-page state.
- Show nulls. `no event hash yet` beats an invented hash.
- Sentence case, except domain enum values, which are rendered exactly as the enum spells them.

## Commits and PRs

Conventional Commits with a scope: `feat(playbook):`, `fix(tokens):`, `docs(readme):`, `refactor(paths):`. Branch prefixes follow the app repo: `feat/`, `fix/`, `refactor/`, `docs/`, `chore/`.

Before opening a PR:

```bash
bun run check    # svelte-check plus the replica fidelity check
bun run build    # the static build must succeed
```

## AI agents and SKILL.md

`SKILL.md` carries a `designsystem:` manifest declaring which capability packs this repo has, where the tokens and brand brief live, and what the host stack is. It is how an agent learns the repo's shape in one read. Keep it in step with reality: a pack listed there but absent from the filesystem is worse than no manifest at all.
