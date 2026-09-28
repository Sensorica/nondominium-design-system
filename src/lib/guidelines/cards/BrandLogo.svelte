<!--
  Replica of docs/prototypes/original/ds/guidelines/brand-logo.html.

  The original card shows a 1024x1024 PNG
  (docs/prototypes/original/ds/assets/nondominium_logo.png). That exact file
  is already committed under src/, at
  src/lib/prototypes/directions/instrument/nondominium_logo.png — sha256
  identical (verified: 900cf2317dbe1235555029752dbd6aa128bf39a9c9ddf9622f2f9d737880b486
  on both sides), because A's own instrument direction imports it as its
  prototype logo (see App.svelte's `import logoMark from
  './nondominium_logo.png'`). Importing THAT copy here works under `vite dev`
  because it is under src/, inside SvelteKit's `server.fs.allow`; the
  original's own copy under docs/ is outside it and 403s (see
  BrandFavicon.svelte for the same constraint on the favicon, which has no
  such src/ copy to borrow). So this card now renders the identical bitmap the
  original does, not the repo's own static/assets/nondominium-logo.png
  (696x536, a different crop) used previously.
-->
<script lang="ts">
  import logo from '$lib/prototypes/directions/instrument/nondominium_logo.png';
</script>

<div class="row">
  <img src={logo} alt="" height="220" />
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
