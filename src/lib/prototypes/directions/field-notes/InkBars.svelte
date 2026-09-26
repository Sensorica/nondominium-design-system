<script lang="ts">
  // Seven ink bars: traces per 4 days over the last four weeks, newest on the
  // right (FnInk in B.jsx).
  import type { Trace } from '$lib/prototypes/store/logic';

  let { traces }: { traces: Trace[] } = $props();

  const bars = $derived(
    Array.from({ length: 7 }, (_, i) => traces.filter((t) => Math.floor(t.ago / 1440 / 4) === 6 - i).length)
  );
  const max = $derived(Math.max(1, ...bars));
</script>

<span class="ink" aria-hidden="true">
  {#each bars as v, i (i)}
    <i style:height="{Math.max(3, (v / max) * 100)}%" style:opacity={v ? 1 : 0.25}></i>
  {/each}
</span>

<style>
  .ink {
    grid-row: 1 / 3;
    grid-column: 2;
    align-self: center;
    display: flex;
    gap: 1.5px;
    align-items: flex-end;
    height: 22px;
  }
  i {
    display: block;
    width: 2px;
    border-radius: 1px;
    background: var(--fn-ink2);
  }
</style>
