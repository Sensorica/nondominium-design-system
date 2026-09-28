<!--
  Replica of docs/prototypes/original/ds/guidelines/brand-logo.html — content
  and layout, not the exact bitmap.

  NOTE (report this, do not silently fix): the original card shows a 1024x1024
  PNG (docs/prototypes/original/ds/assets/nondominium_logo.png) that does not
  exist anywhere in this repo. Importing it directly as a Vite asset (the
  pattern src/lib/prototypes/directions/instrument/App.svelte uses for a
  prototype logo) builds fine but 403s under `vite dev`: SvelteKit's dev
  server restricts `server.fs.allow` to src/, .svelte-kit/ and node_modules/,
  and `docs/` is outside it in every mode this repo runs (changing
  `vite.config.ts` is outside this builder's ownership). Since the compare
  instrument's port side runs against the dev server, that 403 would show up
  as a broken image and two console errors on every run, not as a passing
  card with a footnote. So this card renders on the repo's OWN brand asset,
  `static/assets/nondominium-logo.png` (via paths.logo()), which is a
  different file: 696x536 versus 1024x1024, a different crop, no visible
  off-white background inset. The resulting pixel mismatch is real and
  reported, not hidden by a raised threshold on a broken image.
-->
<script lang="ts">
  import { paths } from '$lib/paths';
</script>

<div class="row">
  <img src={paths.logo()} alt="" height="220" />
  <div class="copy">
    Raster PNG (1024²) with light off-white background. Used in the repo README at 200px width. Teal
    → blue → violet link-chain "N". In-app chrome does <b>not</b> show the logo.
  </div>
</div>

<style>
  .row { display: flex; gap: 24px; align-items: center; }
  img { height: 220px; }
  .copy { font-size: 13px; color: rgb(var(--ndo-gray-600)); max-width: 300px; }
</style>
