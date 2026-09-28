<!--
  Replica of docs/prototypes/original/ds/guidelines/brand-favicon.html —
  content and layout, not the exact bitmap.

  NOTE (report this, do not silently fix): same dev-server fs.allow problem as
  BrandLogo.svelte (see its comment) — the original's asset
  (docs/prototypes/original/ds/assets/favicon.svg, itself the stock SvelteKit
  Svelte-logo favicon) 403s under `vite dev` if imported directly from
  `docs/`. This repo's own shipped favicon, static/favicon.png (via
  paths.favicon()), is also a *different format*: a 256x256 raster PNG, not
  an SVG. Reported, not silently swapped for a matching SVG this repo does
  not have.
-->
<script lang="ts">
  import { paths } from '$lib/paths';
</script>

<div class="row">
  <img src={paths.favicon()} alt="" height="64" />
  <span class="m">ui/src/lib/assets/favicon.svg — framework default, not brand-specific</span>
</div>

<style>
  .row { display: flex; gap: 16px; align-items: center; }
  img { height: 64px; }
  .m { font-family: var(--ndo-font-mono); font-size: 11px; color: rgb(var(--ndo-gray-500)); }
</style>
