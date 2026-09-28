<!--
  Replica of docs/prototypes/original/ds/guidelines/colors-regime.html.

  This card documents a per-regime dashed outline colour. Until 2026-09-28,
  neither this repo's ndo-badge `regime-*` variant (registry/ndo-badge.svelte)
  nor the shipped app's NdoCard.svelte (`border-dashed border-gray-400 ...
  text-gray-700`, uniform for every regime) actually rendered it. Soushi
  ratified Claude Design as this repo's fidelity source that evening, so
  registry/ndo-badge.svelte's `regime-*` variant now renders exactly this
  per-hue outline (see that file's own comment on the regime block). The
  shipped app's NdoCard.svelte is a separate codebase and still renders every
  regime uniformly gray; that disagreement is real but outside this repo.
-->
<script lang="ts">
  const regimes = [
    { label: 'Nondominium', fg: 'blue-700', v: 'blue-700' },
    { label: 'Commons', fg: 'cyan-700', v: 'cyan-700' },
    { label: 'Collective', fg: 'violet-700', v: 'violet-700' },
    { label: 'Pool', fg: 'teal-700', v: 'teal-700' },
    { label: 'CommonPool', fg: 'rose-700', v: 'rose-700' },
    { label: 'Private', fg: 'gray-700', v: 'gray-700' }
  ];
</script>

<div class="sw">
  {#each regimes as r (r.label)}
    <div class="s">
      <div
        class="c"
        style="background:#fff;border:1px dashed rgb(var(--ndo-{r.fg}));color:rgb(var(--ndo-{r.fg}));display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:500"
      >
        {r.label}
      </div>
      <div class="v">{r.v}</div>
    </div>
  {/each}
</div>

<style>
  .sw { display: flex; gap: 8px; flex-wrap: wrap; }
  .s { width: 78px; }
  .c { height: 48px; border-radius: 6px; border: 1px solid rgb(0 0 0 / 0.06); }
  .v { font: 10px var(--ndo-font-mono); color: rgb(var(--ndo-gray-500)); }
</style>
