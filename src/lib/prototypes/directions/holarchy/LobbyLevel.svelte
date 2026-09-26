<svelte:options namespace="svg" />

<script lang="ts">
  // Level 1: every group you belong to, laid out on a grid that fits any N.
  // Each group is a circle with one dot per NDO; a dot grows with recent
  // activity and turns to the attention colour when the NDO has signals.
  import { proto } from '$lib/prototypes/store/store.svelte';
  import { ringPts, RING_COLOR, clip, activate } from './geometry';

  let { onenter }: { onenter: (groupId: string) => void } = $props();

  const W = 920;
  const H = 720;

  const layout = $derived.by(() => {
    const gs = proto.s.groups;
    const N = Math.max(1, gs.length);
    const cols = Math.ceil(Math.sqrt(N));
    const rows = Math.ceil(N / cols);
    const cw = W / cols;
    const chh = H / rows;
    const cell = Math.min(cw, chh);
    return gs.map((g, i) => {
      const nd = proto.s.ndos.filter((n) => n.group === g.id);
      const col = i % cols;
      const row = Math.floor(i / cols);
      const inRow = Math.min(cols, N - row * cols);
      const x = 40 + (W - inRow * cw) / 2 + cw * (col + 0.5);
      const y = 90 + (H - rows * chh) / 2 + chh * (row + 0.5);
      const r = Math.min(cell * 0.44, 90 + nd.length * 10);
      const fs = Math.max(11, Math.min(18, r / 6));
      const dot = Math.max(3, Math.min(12, r / 12));
      const dots = ringPts(nd.length, r * 0.66).map(([dx, dy], j) => ({
        id: nd[j].id,
        name: nd[j].name,
        x: x + dx,
        y: y + dy,
        r: dot + Math.min(dot, proto.q.heatOf(nd[j].id) * 2),
        attention: proto.q.signalsOf(nd[j].id).length > 0
      }));
      return { g, count: nd.length, x, y, r, fs, dots };
    });
  });
</script>

<g>
  {#each layout as c (c.g.id)}
    <g
      class="group"
      role="button"
      tabindex="0"
      aria-label="Open group {c.g.name}"
      onclick={() => onenter(c.g.id)}
      onkeydown={activate(() => onenter(c.g.id))}
    >
      <circle class="disc" cx={c.x} cy={c.y} r={c.r} />
      {#each c.dots as d (d.id)}
        <circle
          class="dot"
          cx={d.x}
          cy={d.y}
          r={d.r}
          style:stroke={d.attention ? RING_COLOR.sig : RING_COLOR.rules}
          ><title>{d.name}</title></circle
        >
      {/each}
      <text class="name" x={c.x} y={c.y - 4} text-anchor="middle" font-size={c.fs}
        >{clip(c.g.name, 22)}</text
      >
      <text
        class="count"
        x={c.x}
        y={c.y + c.fs}
        text-anchor="middle"
        font-size={Math.max(10, c.fs * 0.66)}
      >
        {c.count} NDO{c.count === 1 ? '' : 's'}
      </text>
    </g>
  {/each}
  {#if !layout.length}
    <text class="empty" x="480" y="420" text-anchor="middle"
      >No groups yet. Create one or join with an invite link.</text
    >
  {/if}
</g>

<style>
  .group {
    cursor: pointer;
    outline: none;
  }
  .disc {
    fill: rgb(var(--ndo-color-card-bg));
    stroke: var(--ndo-color-border);
    stroke-width: 2;
    transition: stroke var(--ndo-duration-fast);
  }
  .group:hover .disc,
  .group:focus-visible .disc {
    stroke: var(--ndo-color-text-secondary);
  }
  .dot {
    fill: var(--ndo-color-surface);
    stroke-width: 2;
  }
  .name {
    fill: var(--ndo-color-text-primary);
    font-weight: var(--ndo-weight-bold);
  }
  .count {
    fill: var(--ndo-color-text-muted);
  }
  .empty {
    fill: var(--ndo-color-text-muted);
    font-size: 14px;
  }
</style>
