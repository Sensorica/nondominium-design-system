<!-- Replica of docs/prototypes/original/ds/guidelines/colors-nature.html -->
<script lang="ts">
  const natures = [
    { label: 'Physical', bg: 'blue-100', fg: 'blue-700', v: 'blue-100 / 700' },
    { label: 'Digital', bg: 'purple-100', fg: 'purple-700', v: 'purple-100 / 700' },
    { label: 'Service', bg: 'orange-100', fg: 'orange-700', v: 'orange-100 / 700' },
    { label: 'Hybrid', bg: 'teal-100', fg: 'teal-700', v: 'teal-100 / 700' },
    { label: 'Information', bg: 'indigo-100', fg: 'indigo-700', v: 'indigo-100 / 700' }
  ];
</script>

<div class="sw">
  {#each natures as n (n.label)}
    <div class="s">
      <div
        class="c"
        style="background:rgb(var(--ndo-{n.bg}));color:rgb(var(--ndo-{n.fg}));display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:500"
      >
        {n.label}
      </div>
      <div class="v">{n.v}</div>
    </div>
  {/each}
</div>

<style>
  .sw { display: flex; gap: 8px; flex-wrap: wrap; }
  .s { width: 78px; }
  .c { height: 48px; border-radius: 6px; border: 1px solid rgb(0 0 0 / 0.06); }
  .v { font: 10px var(--ndo-font-mono); color: rgb(var(--ndo-gray-500)); }
</style>
