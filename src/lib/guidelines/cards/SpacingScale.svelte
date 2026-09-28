<!-- Replica of docs/prototypes/original/ds/guidelines/spacing-scale.html -->
<script lang="ts">
  const steps = [
    { token: '0-5', px: '2px' },
    { token: '1', px: '4px' },
    { token: '1-5', px: '6px' },
    { token: '2', px: '8px' },
    { token: '3', px: '12px' },
    { token: '4', px: '16px' },
    { token: '6', px: '24px' },
    { token: '8', px: '32px' }
  ];
</script>

<div class="row">
  {#each steps as s (s.token)}
    <div class="col">
      <div class="sq" style="width:var(--ndo-spacing-{s.token});height:var(--ndo-spacing-{s.token})"></div>
      <div class="n">{s.px}</div>
      <div class="v">spacing-{s.token}</div>
    </div>
  {/each}
</div>

<style>
  .row { display: flex; align-items: flex-end; gap: 18px; }
  .col { text-align: center; }
  .sq { background: rgb(var(--ndo-blue-600)); margin: 0 auto; }
  .n { font-size: 11px; font-weight: 600; margin-top: 4px; color: rgb(var(--ndo-gray-800)); }
  .v { font: 10px var(--ndo-font-mono); color: rgb(var(--ndo-gray-500)); }
</style>
