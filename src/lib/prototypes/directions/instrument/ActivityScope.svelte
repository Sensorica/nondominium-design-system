<script lang="ts">
  // The 30-day activity chart under the bench: one bar per trace kind per day,
  // oldest on the left, now on the right. Colours are C.jsx's own IN_COL map.
  import { proto } from '$lib/prototypes/store/store.svelte';
  import type { TraceKind } from '$lib/prototypes/store/logic';

  let { id }: { id: string } = $props();

  const DAYS = 30;
  const DAY = 1440;
  const WEEK = 7 * DAY;
  // plain.ts has no words for trace kinds, so the legend shows them raw, as
  // the handoff's InScope does.
  const KINDS = ['use', 'custody', 'cite', 'work'] as const;
  const COLOR: Record<(typeof KINDS)[number], string> = {
    use: '#119C8F',
    custody: '#2E5FD1',
    cite: '#7445E0',
    work: '#E0A21A'
  };
  const counts = (k: (typeof KINDS)[number], t: TraceKind) => t === k || (k === 'work' && t === 'note');

  const traces = $derived(proto.q.tracesOf(id));
  const week = $derived(traces.filter((t) => t.ago < WEEK).length);
  const bars = $derived(
    KINDS.flatMap((k, i) =>
      Array.from({ length: DAYS }, (_, d) => ({
        kind: k,
        x: d * 30 + i * 6 + 3,
        v: traces.filter((t) => counts(k, t.kind) && Math.floor(t.ago / DAY) === DAYS - 1 - d).length
      })).filter((b) => b.v > 0)
    )
  );
</script>

<section class="scope" aria-label="Activity over the last 30 days">
  <div class="h">
    <b>{proto.dev ? 'Trace scope · 30 days' : 'Activity · last 30 days'}</b>
    {#each KINDS as k (k)}
      <span><i style:background={COLOR[k]}></i>{k}</span>
    {/each}
    <span class="total">{week} traces / 7 d · {traces.length} total</span>
  </div>
  <svg viewBox="0 0 900 120" preserveAspectRatio="none" aria-hidden="true">
    <g class="grid">
      <line x1="0" y1="30" x2="900" y2="30" />
      <line x1="0" y1="60" x2="900" y2="60" />
      <line x1="0" y1="90" x2="900" y2="90" />
    </g>
    {#each bars as b (b.kind + b.x)}
      <rect style:fill={COLOR[b.kind]} x={b.x} y={116 - b.v * 26} width="5" height={b.v * 26} />
    {/each}
    <line class="now" x1="897" y1="0" x2="897" y2="120" />
  </svg>
  <div class="axis"><span>30 d ago</span><span>now</span></div>
</section>

<style>
  .scope {
    position: absolute;
    left: 20px;
    right: 20px;
    bottom: 12px;
    height: 112px;
    background: #fff;
    border: 1px solid var(--grid);
    border-radius: 6px;
    padding: 12px 14px;
  }
  .h {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 14px;
    margin-bottom: 6px;
    font-size: 12px;
  }
  .h span {
    font: 11px 'Space Mono', monospace;
    color: var(--mute);
    white-space: nowrap;
  }
  .h i {
    display: inline-block;
    width: 10px;
    height: 2px;
    margin-right: 5px;
    vertical-align: middle;
  }
  .total {
    margin-left: auto;
  }
  svg {
    display: block;
    width: 100%;
    height: 52px;
  }
  .grid line {
    stroke: var(--grid);
  }
  .now {
    stroke: var(--teal);
    stroke-dasharray: 2 3;
  }
  .axis {
    display: flex;
    justify-content: space-between;
    font: 10px 'Space Mono', monospace;
    color: var(--mute);
  }
</style>
