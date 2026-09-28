<!--
  Replica of docs/prototypes/original/ds/guidelines/colors-regime.html.

  NOTE (report this, do not silently fix): this card documents a per-regime
  dashed outline colour that neither this repo's ndo-badge `regime-*` variant
  (registry/ndo-badge.svelte, always dashed gray-400 / gray-700, colour lives
  only in the `-filter` variants) nor the shipped app's NdoCard.svelte
  (`border-dashed border-gray-400 ... text-gray-700`, uniform for every
  regime) actually renders. See the report for the full comparison.
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
