<!-- Replica of docs/prototypes/original/ds/guidelines/radii.html -->
<script lang="ts">
  const radii = [
    { token: 'sm', label: 'radius-sm', v: '4px · badges, nav' },
    { token: 'md', label: 'radius-md', v: '6px · buttons, inputs' },
    { token: 'lg', label: 'radius-lg', v: '8px · cards, panels' },
    { token: 'xl', label: 'radius-xl', v: '12px · forms, opstate pill' }
  ];
</script>

<div class="row">
  {#each radii as r (r.token)}
    <div>
      <div class="box" style="border-radius:var(--ndo-radius-{r.token})"></div>
      <div class="n">{r.label}</div>
      <div class="v">{r.v}</div>
    </div>
  {/each}
</div>

<style>
  .row { display: flex; gap: 24px; }
  .box { width: 110px; height: 64px; border: 1px solid rgb(var(--ndo-gray-300)); background: rgb(var(--ndo-gray-50)); }
  .n { font-size: 11px; font-weight: 600; margin-top: 4px; color: rgb(var(--ndo-gray-800)); }
  .v { font: 10px var(--ndo-font-mono); color: rgb(var(--ndo-gray-500)); }
</style>
