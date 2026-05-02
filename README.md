# Nondominium Design System

Design token library and web component registry for the [Nondominium](https://github.com/Sensorica/nondominium) hApp — a Holochain-based resource sharing platform built on ValueFlows and the nondominium property regime.

## Overview

This project provides two things:

1. **`ndo-*` custom elements** — a small set of Svelte-compiled web components that can be dropped into any framework or plain HTML file
2. **A static documentation site** — playbook (per-component showcase) and UI-kit (full scenario views) built with SvelteKit

The visual language encodes Nondominium domain concepts directly into the token and component API: lifecycle stages, resource natures, and property regimes each have their own colors and badge variants.

## Stack

| Layer | Technology |
|---|---|
| Documentation site | SvelteKit 2 + Svelte 5 |
| Atomic CSS (site layer) | UnoCSS `presetUno` |
| Interactive primitives | Melt UI |
| Custom elements | Svelte `customElement` compiler |
| Design tokens | CSS custom properties (RGB triplets) |
| Hosting | `@sveltejs/adapter-static` |

## Custom Elements

Include the bundle in any HTML page, then use the elements as plain HTML:

```html
<link rel="stylesheet" href="https://cdn.example.com/tokens.css" />
<script type="module" src="https://cdn.example.com/registry/bundle.js"></script>

<ndo-badge variant="lifecycle-active" label="Active"></ndo-badge>
<ndo-badge variant="nature-physical" label="Physical"></ndo-badge>
<ndo-badge variant="regime-nondominium" label="Nondominium"></ndo-badge>

<ndo-button variant="primary">Create NDO</ndo-button>

<ndo-card
  name="Community Solar Array"
  description="Shared photovoltaic infrastructure..."
  hash="uhC0kVX5k7dL2mPqR..."
  href="/ndo/uhC0kVX5..."
  badges="lifecycle-active:Active;regime-nondominium:Nondominium;nature-physical:Physical">
</ndo-card>

<ndo-status-dot status="active" label="Active"></ndo-status-dot>
```

### Component API

**`<ndo-badge>`**

| Prop | Type | Default |
|---|---|---|
| `variant` | See variants below | `neutral` |
| `label` | `string` | `''` |

Lifecycle variants: `lifecycle-ideation`, `lifecycle-specification`, `lifecycle-development`, `lifecycle-prototype`, `lifecycle-stable`, `lifecycle-distributed`, `lifecycle-active`, `lifecycle-hibernating`, `lifecycle-deprecated`, `lifecycle-end-of-life`

Nature variants: `nature-physical`, `nature-digital`, `nature-service`, `nature-hybrid`, `nature-information`

Regime variants: `regime-nondominium`, `regime-commons`, `regime-collective`, `regime-pool`, `regime-common-pool`, `regime-private`

Special: `coming-soon`, `neutral`

---

**`<ndo-button>`**

| Prop | Type | Default |
|---|---|---|
| `variant` | `primary` \| `ghost` \| `destructive` | `primary` |
| `disabled` | `boolean` | `false` |
| `href` | `string` | `''` (renders `<button>`) |
| `type` | `button` \| `submit` \| `reset` | `button` |

---

**`<ndo-card>`**

| Prop | Type | Default |
|---|---|---|
| `name` | `string` | `''` |
| `description` | `string` | `''` |
| `hash` | `string` | `''` |
| `href` | `string` | `#` |
| `badges` | `string` | `''` |

`badges` format: `"variant:label;variant:label;..."` — e.g. `"lifecycle-active:Active;nature-physical:Physical"`

---

**`<ndo-status-dot>`**

| Prop | Type | Default |
|---|---|---|
| `status` | `active` \| `inactive` \| `pending` \| `coming-soon` | `pending` |
| `label` | `string` | `''` |

## Design Tokens

All tokens are CSS custom properties on `:root` in `static/tokens.css`. They use RGB triplets to enable alpha composability:

```css
/* Usage */
background: rgb(var(--ndo-emerald-100));
color: rgb(var(--ndo-emerald-700));
border-color: rgb(var(--ndo-gray-200) / 0.5);  /* with alpha */
```

Token groups: `--ndo-gray-*`, `--ndo-green-*`, `--ndo-emerald-*`, `--ndo-blue-*`, `--ndo-purple-*`, `--ndo-teal-*`, `--ndo-indigo-*`, `--ndo-amber-*`, `--ndo-orange-*`, `--ndo-red-*`, `--ndo-cyan-*`, `--ndo-violet-*`, `--ndo-rose-*`, `--ndo-yellow-*`

Semantic tokens: `--ndo-color-bg-app`, `--ndo-color-surface`, `--ndo-color-border`, `--ndo-color-text-primary`, `--ndo-color-text-secondary`, `--ndo-color-text-muted`, `--ndo-color-text-mono`

Typography: `--ndo-font-sans`, `--ndo-font-mono`, `--ndo-text-xs/sm/base/lg/xl/2xl`, `--ndo-weight-medium/semibold/bold`

Spacing: `--ndo-spacing-0-5` through `--ndo-spacing-8`

Radii: `--ndo-radius-sm/md/lg/xl` · Shadows: `--ndo-shadow-sm/md/lg`

## Development

```bash
bun install

# Documentation site (localhost:5173)
bun run dev

# Build custom element bundle → static/registry/bundle.js
bun run build:registry

# Build everything (registry first, then static site)
bun run build:all

# Preview static build
bun run preview
```

> **Note**: Run `bun run build:registry` before `bun run dev` on a fresh clone. The dev server serves `static/registry/bundle.js` from the filesystem — it must exist for the custom elements to render in the playbook.

## Project Structure

```
nondominium-design-system/
├── registry/                 # Custom element sources (Svelte + customElement compiler)
│   ├── index.ts
│   ├── ndo-badge.svelte
│   ├── ndo-button.svelte
│   ├── ndo-card.svelte
│   └── ndo-status-dot.svelte
├── src/routes/
│   ├── +page.svelte          # Token showcase (colors, type, spacing, shadows)
│   ├── playbook/             # Per-component documentation
│   │   ├── badge/
│   │   ├── button/
│   │   ├── card/
│   │   ├── shell/
│   │   └── status/
│   └── ui-kit/               # Full-page scenario views
│       ├── browse/           # Lobby scenario (NdoBrowser + GroupSidebar)
│       └── ndo-detail/       # NDO detail with tab navigation
├── static/
│   ├── tokens.css            # All --ndo-* CSS custom properties
│   └── registry/bundle.js   # Built output (gitignored)
├── vite.config.ts            # SvelteKit site (UnoCSS + sveltekit)
└── vite.registry.config.ts   # CE bundle (Svelte customElement + lib mode)
```

## Architecture Notes

**Why two Vite configs?** Svelte's `customElement` compiler option is incompatible with SvelteKit's SSR/routing. The registry uses a separate `vite.registry.config.ts` that compiles only `registry/**/*.svelte` as custom elements and outputs a single ESM bundle.

**Why `export let` in registry files?** Svelte 5 runes (`$props()`) are not compatible with `customElement` compiler mode. Registry components use the legacy `export let` syntax. Runes are used normally in the SvelteKit site layer.

**Why CSS custom properties in registry components?** UnoCSS generates a global stylesheet that does not penetrate shadow DOM. Registry components style themselves exclusively via `var(--ndo-*)` tokens, which inherit through shadow DOM boundaries. No UnoCSS classes appear inside `registry/*.svelte`.

## Related

- [nondominium](https://github.com/Sensorica/nondominium) — the hApp this design system serves
- [Sensorica](https://www.sensorica.co/) — the open value network behind this project
- [ValueFlows](https://valueflo.ws/) — the economic ontology standard used by nondominium

## License

Apache-2.0
