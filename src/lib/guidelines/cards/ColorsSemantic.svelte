<!-- Replica of docs/prototypes/original/ds/guidelines/colors-semantic.html -->
<script lang="ts">
  const rows = [
    { swatch: 'gray-100', token: '--ndo-color-bg-app', family: 'gray-100' },
    { swatch: 'gray-50', token: '--ndo-color-surface', family: 'gray-50' },
    { swatch: 'gray-200', token: '--ndo-color-border', family: 'gray-200' },
    { swatch: 'gray-900', token: '--ndo-color-text-primary', family: 'gray-900' },
    { swatch: 'gray-600', token: '--ndo-color-text-secondary', family: 'gray-600' },
    { swatch: 'gray-500', token: '--ndo-color-text-muted', family: 'gray-500' },
    { swatch: 'gray-400', token: '--ndo-color-text-mono', family: 'gray-400' },
    { swatch: 'blue-600', token: '--ndo-color-link', family: 'blue-600' }
  ];
</script>

<div class="k-grid">
  {#each rows as row (row.token)}
    <div class="row">
      <span class="chip" style="background:rgb(var(--ndo-{row.swatch}))"></span>
      <span class="m tok">{row.token}</span>
      <span class="m">{row.family}</span>
    </div>
  {/each}
</div>

<style>
  .k-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px 24px; font-size: 13px; }
  .row { display: flex; align-items: center; gap: 8px; }
  .chip {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    border: 1px solid rgb(var(--ndo-gray-200));
    display: inline-block;
  }
  .m { font-family: var(--ndo-font-mono); font-size: 11px; color: rgb(var(--ndo-gray-500)); }
  .tok { color: rgb(var(--ndo-gray-800)); }
</style>
