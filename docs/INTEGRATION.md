# Integrating @nondominium/ndo-ui

This document describes how to develop UI in parallel in the design-system repo and adopt components in the nondominium hApp.

## Two delivery layers

| Layer | Package | Use when |
|-------|---------|----------|
| **Svelte 5 library** | `@nondominium/ndo-ui` | hApp routes, SvelteKit apps, runes + UnoCSS |
| **Custom elements** | `static/registry/bundle.js` | Plain HTML, non-Svelte embeds, docs |

Domain color maps live in `packages/ndo-ui/src/domain/variants.ts` — the single source of truth matching hApp `NdoBrowser.svelte` (filter chips) and `NdoCard.svelte` (card badges).

## Parallel development workflow

1. **Prototype in design-system** — change components under `packages/ndo-ui/`, verify in `/ui-kit/*` routes and `/playbook/*` pages.
2. **Run checks** — `bun run build:all` (check + registry + static site).
3. **Bump semver** — patch for class tweaks, minor for new exports, major for breaking prop renames.
4. **Adopt in hApp** — wire dependency (see below), replace inline maps, keep Effect stores and zome services in the hApp.

## hApp adoption (Phase 6)

When ready to consume the library from [nondominium](https://github.com/Sensorica/nondominium):

### Option A — Monorepo workspace

Add the design-system repo as a sibling and reference it from `ui/package.json`:

```json
{
  "dependencies": {
    "@nondominium/ndo-ui": "workspace:*"
  }
}
```

Configure Vite alias in `ui/vite.config.ts` if not using a root workspace.

### Option B — npm publish

Publish `@nondominium/ndo-ui` and pin a semver range in the hApp.

### Migration sequence

1. Import tokens once in `ui/src/app.css`:

   ```css
   @import '@nondominium/ndo-ui/styles/tokens.css';
   ```

2. Replace duplicated color maps in `NdoBrowser.svelte`, `NdoCard.svelte`, `NdoIdentityLayer.svelte` with `NdoBadge` or helpers from `domain/variants.ts`.

3. Swap presentational shells: `AppShell`, `Sidebar`, `NdoBrowser`, modals — pass Holochain navigation and store data via props/callbacks.

4. Remove orphaned `GroupSidebar.svelte` after `Sidebar` parity is confirmed.

**Keep in the hApp:** `HolochainProvider`, Effect-TS services, Svelte stores, localStorage persistence, zome calls.

## Badge variant modes

| Mode | hApp reference | Visual |
|------|----------------|--------|
| `filter` | `NdoBrowser.svelte` | Per-stage/nature/regime colors, dashed regime borders |
| `identity` | `NdoIdentityLayer.svelte` | Full colors, no filter ring |
| `card-lifecycle` | `NdoCard.svelte` | Green set vs gray only |
| `card-regime` | `NdoCard.svelte` | Plain dashed gray border |

MVP property regimes in the hApp UI: **Private, Commons, Nondominium, CommonPool** (4 values). The CE registry also documents Collective and Pool for forward compatibility.

## Verification checklist

Before merging DS changes intended for hApp adoption:

- [ ] UI-kit routes match hApp layout at 1280px (Lobby, Group, NDO detail, Create modal, Profile)
- [ ] Filter chips: multi-select OR within dimension, AND across dimensions, Clear filters
- [ ] Card badges use simplified lifecycle + gray dashed regime
- [ ] Modals use `bg-black/40 backdrop-blur-sm` overlay
- [ ] `bun run check` and `bun run build:all` pass

## Related paths

- hApp components: `nondominium/ui/src/lib/components/`
- Shared types: `nondominium/packages/shared-types/src/resource.types.ts`
- UI requirements: `nondominium/documentation/requirements/ui_design.md`
