<script lang="ts">
  // The field (A.jsx MyField + MyNode): NDO nodes that glow with recent
  // activity, joined by trails for use, citations and hard links. Heat decays
  // over the fade window the slider sets.
  import { proto } from '../../store/store.svelte';
  import { plain } from '../../plain';
  import { linkKey, uniqLinks } from '../../store/logic';
  import { fieldPositions, fieldViewBox, nodeRadius, trailPath, MODES, type Mode } from './field';

  interface Props {
    /** The selected NDO, if any. */
    sel: string | null;
    onselect: (id: string) => void;
    /** Fade window in days. */
    decay: number;
    mode: Mode;
    /** 'all' or a group id. */
    group: string;
  }

  let { sel, onselect, decay, mode, group }: Props = $props();

  const QUIET = ['Ideation', 'Hibernating', 'EndOfLife'];

  const placed = $derived(fieldPositions(proto.s.ndos));
  const nodes = $derived(placed.filter((n) => group === 'all' || n.group === group));
  const byId = $derived(new Map(nodes.map((n) => [n.id, n])));
  const viewBox = $derived(fieldViewBox(nodes));
  const kinds = $derived<readonly string[]>(MODES[mode]);

  // One trail per (from, to, kind): the store keeps links unique on that
  // triple, and uniqLinks here means a repeat that slipped in anyway draws
  // once instead of breaking the keyed list.
  const trails = $derived(
    uniqLinks(proto.s.links)
      .filter(([a, b, k]) => byId.has(a) && byId.has(b) && kinds.includes(k))
      .map((l) => {
        const [a, b, k] = l;
        return {
          key: linkKey(l),
          kind: k,
          d: trailPath(byId.get(a)!, byId.get(b)!),
          width: 1 + Math.min(5, (proto.q.heatOf(a, decay) + proto.q.heatOf(b, decay)) / 2.2),
          on: sel === a || sel === b
        };
      })
  );

  // A node pulses when it has a brand-new trace, or one of yours still on its
  // way to peers. Keyed on the newest such trace, so a new write replays it.
  const fresh = $derived.by(() => {
    const m: Record<string, string> = {};
    for (const t of proto.s.traces) {
      if ((t.ago === 0 || (t.mine && t.status !== 'validated')) && !(t.ndo in m)) m[t.ndo] = t.id;
    }
    return m;
  });

  const view = $derived(
    nodes.map((n) => {
      const h = proto.q.heatOf(n.id, decay);
      const r = nodeRadius(h);
      const sig = proto.q.signalsOf(n.id).length;
      return {
        n,
        h,
        r,
        sig,
        quiet: QUIET.includes(n.stage),
        ping: fresh[n.id],
        meta: plain(n.stage) + ' · ' + (sig ? sig + ' signal' + (sig > 1 ? 's' : '') : Math.round(h * 10) / 10 + ' heat')
      };
    })
  );

  function onkey(e: KeyboardEvent, id: string) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onselect(id);
    }
  }
</script>

<svg class="field" width="100%" height="100%" {viewBox} role="group" aria-label="Shared resources in the field">
  <g class="trails">
    {#each trails as t (t.key)}
      <path class="trail trail--{t.kind}" class:on={t.on} d={t.d} stroke-width={t.width} />
    {/each}
  </g>
  {#each view as v (v.n.id)}
    <g
      class="node stage-{v.n.stage}"
      class:quiet={v.quiet}
      role="button"
      tabindex="0"
      aria-label={v.n.name + ', ' + v.meta}
      aria-pressed={sel === v.n.id}
      onclick={() => onselect(v.n.id)}
      onkeydown={(e) => onkey(e, v.n.id)}
    >
      <circle class="glow" cx={v.n.x} cy={v.n.y} r={v.r * 4} style:opacity={Math.min(0.28, v.h * 0.07)} />
      {#if sel === v.n.id}
        <circle class="ring-sel" cx={v.n.x} cy={v.n.y} r={v.r + 16} />
      {/if}
      <circle class="core" cx={v.n.x} cy={v.n.y} r={v.r} />
      <circle class="halo" cx={v.n.x} cy={v.n.y} r={v.r + 9} />
      {#if v.ping}
        {#key v.ping}
          <circle class="ping" cx={v.n.x} cy={v.n.y} r={v.r} style:--grow={(v.r + 40) / v.r} />
        {/key}
      {/if}
      {#if v.sig > 0}
        <circle class="dot" cx={v.n.x + v.r * 0.75} cy={v.n.y - v.r * 0.75} r="5" />
      {/if}
      <text class="name" x={v.n.x} y={v.n.y + v.r + 24} text-anchor="middle">{v.n.name}</text>
      <text class="meta" class:meta--sig={v.sig > 0} x={v.n.x} y={v.n.y + v.r + 40} text-anchor="middle">{v.meta}</text>
    </g>
  {/each}
</svg>

<style>
  .field {
    position: absolute;
    inset: 0;
  }

  /* Trails: use and custody, citation, hard link. */
  .trails {
    fill: none;
    stroke-linecap: round;
  }
  .trail {
    opacity: 0.35;
    transition: opacity 500ms, stroke-width 500ms;
  }
  .trail.on {
    opacity: 0.85;
  }
  .trail--use {
    stroke: rgb(var(--ndo-brand-teal-300));
  }
  .trail--cite {
    stroke: rgb(var(--ndo-violet-300));
  }
  .trail--hard {
    stroke: rgb(var(--ndo-brand-blue-300));
    stroke-dasharray: 1 7;
  }

  /* Stage colour. Quiet stages (idea, paused, retired) draw a dashed ring. */
  .node {
    cursor: pointer;
    outline: none;
    --c: rgb(var(--ndo-gray-500));
  }
  .stage-Active,
  .stage-Stable {
    --c: rgb(var(--ndo-brand-teal-300));
  }
  .stage-Distributed,
  .stage-Deprecated {
    --c: rgb(var(--ndo-violet-300));
  }
  .stage-Prototype,
  .stage-Development {
    --c: rgb(var(--ndo-amber-600));
  }
  .stage-Specification {
    --c: rgb(var(--ndo-brand-blue-300));
  }
  .stage-EndOfLife {
    --c: rgb(var(--ndo-gray-600));
  }

  .glow {
    fill: var(--c);
    filter: blur(18px);
    transition: opacity 600ms, r 600ms;
  }
  .ring-sel {
    fill: none;
    stroke: rgb(var(--ndo-gray-50));
    stroke-opacity: 0.5;
    stroke-dasharray: 2 4;
  }
  .core {
    fill: rgb(var(--ndo-gray-950));
    stroke: var(--c);
    stroke-width: 2;
    transition: r 600ms;
  }
  .quiet .core {
    stroke-dasharray: 3 3;
  }
  .halo {
    fill: none;
    stroke: var(--c);
    stroke-opacity: 0.22;
    transition: r 600ms;
  }
  .node:focus-visible .halo {
    stroke: rgb(var(--ndo-gray-50));
    stroke-opacity: 0.9;
    stroke-width: 2;
  }

  /* A fresh trace: three expanding rings, replayed on every new write. */
  .ping {
    fill: none;
    stroke: rgb(var(--ndo-brand-teal-300));
    stroke-width: 2;
    vector-effect: non-scaling-stroke;
    transform-box: fill-box;
    transform-origin: center;
    opacity: 0;
    animation: ping 1.4s ease-out 3;
  }
  @keyframes ping {
    from {
      transform: scale(1);
      opacity: 1;
    }
    to {
      transform: scale(var(--grow));
      opacity: 0;
    }
  }

  /* An open signal on this resource. */
  .dot {
    fill: rgb(var(--ndo-amber-600));
    animation: blink 1.8s ease-in-out infinite;
  }
  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.35;
    }
  }

  text {
    font-family: var(--ndo-font-sans);
  }
  .name {
    font-size: 13px;
    font-weight: 600;
    fill: rgb(var(--ndo-gray-50));
  }
  .quiet .name {
    fill: rgb(var(--ndo-gray-400));
  }
  .meta {
    font-size: 11px;
    fill: rgb(var(--ndo-gray-400));
  }
  .meta--sig {
    fill: rgb(var(--ndo-amber-600));
  }
</style>
