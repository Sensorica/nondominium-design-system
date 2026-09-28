<!-- Replica of docs/prototypes/original/ds/guidelines/colors-lifecycle.html -->
<script lang="ts">
  const stages = [
    { label: 'Ideation', bg: 'gray-100', fg: 'gray-600', v: 'gray-100 / 600' },
    { label: 'Specification', bg: 'blue-50', fg: 'blue-600', v: 'blue-50 / 600' },
    { label: 'Development', bg: 'indigo-100', fg: 'indigo-700', v: 'indigo-100 / 700' },
    { label: 'Prototype', bg: 'amber-100', fg: 'amber-700', v: 'amber-100 / 700' },
    { label: 'Stable', bg: 'green-100', fg: 'green-700', v: 'green-100 / 700' },
    { label: 'Distributed', bg: 'teal-100', fg: 'teal-700', v: 'teal-100 / 700' },
    { label: 'Active', bg: 'emerald-100', fg: 'emerald-700', v: 'emerald-100 / 700' },
    { label: 'Hibernating', bg: 'yellow-100', fg: 'yellow-700', v: 'yellow-100 / 700' },
    { label: 'Deprecated', bg: 'orange-100', fg: 'orange-700', v: 'orange-100 / 700' },
    { label: 'EndOfLife', bg: 'red-100', fg: 'red-700', v: 'red-100 / 700' }
  ];
</script>

<div class="sw">
  {#each stages as stage (stage.label)}
    <div class="s">
      <div
        class="c"
        style="background:rgb(var(--ndo-{stage.bg}));color:rgb(var(--ndo-{stage.fg}));display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:500"
      >
        {stage.label}
      </div>
      <div class="v">{stage.v}</div>
    </div>
  {/each}
</div>

<style>
  .sw { display: flex; gap: 8px; flex-wrap: wrap; }
  .s { width: 78px; }
  .c { height: 48px; border-radius: 6px; border: 1px solid rgb(0 0 0 / 0.06); }
  .v { font: 10px var(--ndo-font-mono); color: rgb(var(--ndo-gray-500)); }
</style>
