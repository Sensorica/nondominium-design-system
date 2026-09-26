<svelte:options namespace="svg" />

<script lang="ts">
  // Level 2: the NDOs anchored in one group, on one ring, or two alternating
  // rings past 12. Click once to inspect (the card on the right), twice to
  // enter. The centre adds a resource.
  import { proto } from '$lib/prototypes/store/store.svelte';
  import { plain } from '$lib/prototypes/plain';
  import { ringPts, RING_COLOR, QUIET_STAGES, clip, activate } from './geometry';

  interface Props {
    gid: string;
    sel: string | null;
    onselect: (ndoId: string) => void;
    onenter: (ndoId: string) => void;
    oncreate: () => void;
  }

  let { gid, sel, onselect, onenter, oncreate }: Props = $props();

  const group = $derived(proto.q.group(gid));
  const nodes = $derived.by(() => {
    const nd = proto.s.ndos.filter((n) => n.group === gid);
    const two = nd.length > 12;
    const unit = ringPts(nd.length, 1);
    const k = Math.max(0.45, Math.min(1, 10 / Math.max(1, nd.length)));
    return nd.map((n, i) => {
      const R = two ? (i % 2 ? 300 : 185) : 230;
      const [ux, uy] = unit[i];
      const signals = proto.q.signalsOf(n.id).length;
      return {
        n,
        x: 480 + ux * R,
        y: 420 + uy * R,
        r: (26 + Math.min(30, proto.q.heatOf(n.id) * 8)) * k,
        quiet: QUIET_STAGES.includes(n.stage),
        signals,
        small: two
      };
    });
  });

  const pick = (id: string) => (sel === id ? onenter(id) : onselect(id));
</script>

<g>
  <circle class="field" cx="480" cy="420" r="340" />
  <text class="title" x="480" y="102" text-anchor="middle">
    {(group?.name ?? '').toUpperCase()} · {proto.dev ? 'GROUP DHT' : 'GROUP'}
  </text>
  {#each nodes as c (c.n.id)}
    <g
      class="ndo"
      class:on={sel === c.n.id}
      role="button"
      tabindex="0"
      aria-label={(sel === c.n.id ? 'Enter ' : 'Inspect ') + c.n.name}
      aria-pressed={sel === c.n.id}
      onclick={() => pick(c.n.id)}
      onkeydown={activate(() => pick(c.n.id))}
    >
      <circle class="body" class:quiet={c.quiet} cx={c.x} cy={c.y} r={c.r} />
      <circle
        class="core"
        cx={c.x}
        cy={c.y}
        r={c.r * 0.38}
        style:stroke={c.signals ? RING_COLOR.sig : RING_COLOR.rules}
      />
      <text
        class="label"
        x={c.x}
        y={c.y + c.r + 16}
        text-anchor="middle"
        font-size={c.small ? 10 : 12}
      >
        {clip(c.n.name, 20)}
      </text>
      <text
        class="sub"
        x={c.x}
        y={c.y + c.r + 29}
        text-anchor="middle"
        font-size={c.small ? 9 : 11}
      >
        {plain(c.n.stage)}{c.signals
          ? ' · ' + c.signals + ' signal' + (c.signals > 1 ? 's' : '')
          : ''}
      </text>
    </g>
  {/each}
  <g
    class="add"
    role="button"
    tabindex="0"
    aria-label="Add a shared resource"
    onclick={oncreate}
    onkeydown={activate(oncreate)}
  >
    <circle cx="480" cy="420" r="34" />
    <text x="480" y="425" text-anchor="middle">+ Resource</text>
  </g>
</g>

<style>
  .field {
    fill: rgb(var(--ndo-color-card-bg));
    stroke: var(--ndo-color-border);
  }
  .title {
    fill: var(--ndo-color-text-muted);
    font-size: 12px;
    font-weight: var(--ndo-weight-bold);
    letter-spacing: 1.5px;
  }
  .ndo,
  .add {
    cursor: pointer;
    outline: none;
  }
  .body {
    fill: var(--ndo-color-surface);
    stroke: var(--ndo-color-border);
    stroke-width: 1;
    transition: stroke var(--ndo-duration-fast);
  }
  .body.quiet {
    stroke-dasharray: 3 4;
  }
  .ndo:hover .body,
  .ndo:focus-visible .body {
    stroke: var(--ndo-color-text-secondary);
  }
  .ndo.on .body {
    fill: rgb(var(--ndo-teal-300) / 0.2);
    stroke: var(--ndo-color-text-primary);
    stroke-width: 2;
  }
  .core {
    fill: none;
    stroke-width: 3;
  }
  .label {
    fill: var(--ndo-color-text-primary);
    font-weight: var(--ndo-weight-bold);
  }
  .sub {
    fill: var(--ndo-color-text-muted);
  }
  .add circle {
    fill: rgb(var(--ndo-color-card-bg));
    stroke: var(--ndo-color-text-muted);
    stroke-dasharray: 3 4;
  }
  .add text {
    fill: var(--ndo-color-text-muted);
    font-size: 12px;
    font-weight: var(--ndo-weight-bold);
  }
  .add:hover circle,
  .add:focus-visible circle {
    stroke: var(--ndo-color-text-primary);
  }
</style>
