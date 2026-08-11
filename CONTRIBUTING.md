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

## Adding a component

1. Put the Svelte component in `src/lib/components/shared/`.
2. Put anything with brand meaning — a variant, a state, a recipe — in `src/lib/styles/app.css` as an `.ndo-*` class. UnoCSS utilities are for layout in markup; they are not where a badge variant lives.
3. Never hardcode a colour, radius, or spacing value. Every one of them has a token.
4. Add a specimen to the matching `/playbook` page using `Specimen.svelte`: what it is for, the live thing, and the markup.

If the component also needs to be embeddable, add it to `registry/` as a custom element. Two constraints apply there and only there: no runes (use `export let`), and no UnoCSS classes (UnoCSS's stylesheet does not cross the shadow DOM — style through `var(--ndo-*)`).

## Adding a screen to the prototype

1. Create the route under `src/routes/app/(shell)/` or `src/routes/app/(gate)/`.
2. Add a URL function to `src/lib/paths.ts`.
3. Add a key to `SCREEN_KEY_TO_URL` in `src/lib/surface-keys.ts`, pointing at a representative record so the entry lands on a fully rendered page.
4. Add a label to `KEY_LABEL`, and the key to the right group in `SCREEN_MAP_GROUPS` in `src/lib/screen-map.svelte.ts`.
5. Bump `prototype-app.screens` in `SKILL.md`.

Steps 3 and 4 are what make the screen navigable and commentable. A screen without a key is invisible to the screen map and cannot hold a review thread.

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
bun run check    # svelte-check must be clean
bun run build    # the static build must succeed
```

## AI agents and SKILL.md

`SKILL.md` carries a `designsystem:` manifest declaring which capability packs this repo has, where the tokens and brand brief live, and what the host stack is. It is how an agent learns the repo's shape in one read. Keep it in step with reality: a pack listed there but absent from the filesystem is worse than no manifest at all.
