<script lang="ts">
  // The graph canvas: eight ValueFlows lanes, one card per source-chain entry,
  // one arrow per reference. Drag to pan, wheel to scroll, Ctrl/Cmd+wheel to
  // zoom, Fit to frame everything. The lane header stays on top and jumps to
  // a lane when clicked.
  import { LANES } from './backend';
  import { LANE_COL, LW, MAX_ZOOM, MIN_ZOOM, NH, edgePath, isPending, laneOf, laneWord, tok, type Edge, type NodeView, type Persp, type View } from './model';
  import Card from './Card.svelte';

  interface Props {
    nodes: NodeView[];
    pos: Record<string, { x: number; y: number }>;
    edges: Edge[];
    linked: Set<string>;
    sel: string | null;
    persp: Persp;
    dev: boolean;
    view: View;
    el?: HTMLDivElement;
    sideClosed: boolean;
    showAgents: boolean;
    showStruct: boolean;
    onpick: (hash: string) => void;
    onbackground: () => void;
    ontoggleagents: () => void;
    ontogglestruct: () => void;
    onfit: () => void;
  }

  let {
    nodes,
    pos,
    edges,
    linked,
    sel,
    persp,
    dev,
    view = $bindable(),
    el = $bindable(),
    sideClosed,
    showAgents,
    showStruct,
    onpick,
    onbackground,
    ontoggleagents,
    ontogglestruct,
    onfit
  }: Props = $props();

  const width = LANES.length * LW;
  const maxY = $derived(Math.max(420, ...Object.values(pos).map((p) => p.y + NH + 40)));
  const counts = $derived.by(() => {
    const c: Record<string, number> = {};
    for (const n of nodes) {
      const l = laneOf(n.e);
      c[l] = (c[l] ?? 0) + 1;
    }
    return c;
  });

  function zoomAt(f: number, px: number, py: number) {
    const v = view;
    const k = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, v.k * f));
    const r = k / v.k;
    view = { k, x: px - (px - v.x) * r, y: py - (py - v.y) * r };
  }
  function zoomC(f: number) {
    if (el) zoomAt(f, el.clientWidth / 2, el.clientHeight / 2);
  }

  // Wheel: a non-passive listener, so the page itself never scrolls.
  $effect(() => {
    const node = el;
    if (!node) return;
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      const b = node.getBoundingClientRect();
      if (e.ctrlKey || e.metaKey) zoomAt(Math.exp(-Math.max(-50, Math.min(50, e.deltaY)) * 0.004), e.clientX - b.left, e.clientY - b.top);
      else view = { ...view, x: view.x - e.deltaX, y: view.y - e.deltaY };
    };
    node.addEventListener('wheel', wheel, { passive: false });
    return () => node.removeEventListener('wheel', wheel);
  });

  let g: { sx: number; sy: number; ox: number; oy: number; on: boolean; moved: boolean } | null = null;
  function down(e: PointerEvent) {
    if (e.button !== 0 || (e.target as Element).closest('[data-node]')) return;
    g = { sx: e.clientX, sy: e.clientY, ox: view.x, oy: view.y, on: true, moved: false };
    try {
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
    } catch {
      // Capture is a nicety; panning still works without it.
    }
  }
  function move(e: PointerEvent) {
    if (!g?.on) return;
    const dx = e.clientX - g.sx;
    const dy = e.clientY - g.sy;
    if (!g.moved && Math.hypot(dx, dy) < 4) return;
    g.moved = true;
    view = { ...view, x: g.ox + dx, y: g.oy + dy };
  }
  function up() {
    if (g?.on && !g.moved) onbackground();
    g = null;
  }

  function jump(i: number) {
    view = { ...view, x: 20 - i * LW * view.k };
  }

  function edgeColour(ed: Edge) {
    return ed.touch ? tok('blue-600') : ed.cat === 'flow' ? tok('gray-500') : ed.cat === 'agents' ? tok('violet-700') : tok('blue-600', 0.6);
  }
  function edgeOpacity(ed: Edge) {
    const pend = persp !== 'network' && (!byHash[ed.from]?.held[persp] || !byHash[ed.to]?.held[persp]);
    return pend ? 0.35 : sel && !ed.touch ? 0.18 : ed.cat === 'flow' ? 0.8 : 0.55;
  }
  const byHash = $derived(Object.fromEntries(nodes.map((n) => [n.e.hash, n.e])));
</script>

<div
  bind:this={el}
  class="canvas"
  role="application"
  aria-label="Flow graph"
  onpointerdown={down}
  onpointermove={move}
  onpointerup={up}
  onpointercancel={up}
  style:background-size="{20 * view.k}px {20 * view.k}px"
  style:background-position="{view.x}px {view.y}px"
>
  <div class="inner" style:transform="translate({view.x}px, {view.y}px) scale({view.k})">
    {#each LANES as l, i (l.id)}
      <div class="lane" class:lane--alt={i % 2 === 1} style:left="{i * LW}px" style:width="{LW - 8}px" style:height="{maxY + 8}px"></div>
    {/each}

    <svg class="edges" {width} height={maxY} aria-hidden="true">
      <defs>
        <marker id="f-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" style:fill={tok('gray-400')} />
        </marker>
      </defs>
      {#each edges as ed (ed.from + ed.f + ed.to)}
        {@const a = pos[ed.from]}
        {@const b = pos[ed.to]}
        {@const p = edgePath(a, b)}
        <g opacity={edgeOpacity(ed)}>
          <path
            d={p.d}
            fill="none"
            style:stroke={edgeColour(ed)}
            stroke-width={ed.touch ? 2 : ed.cat === 'flow' ? 1.5 : 1}
            stroke-dasharray={ed.cat === 'agents' ? '5 4' : ed.cat === 'structure' ? '2 4' : null}
            marker-end="url(#f-arr)"
          />
          {#if ed.touch || (ed.cat === 'flow' && !sel)}
            <text x={p.mx} y={p.my - 6} text-anchor="middle" class="edge-label" class:edge-label--on={ed.touch}>{ed.f}</text>
          {/if}
        </g>
      {/each}
    </svg>

    {#each nodes as n (n.e.hash)}
      {@const p = pos[n.e.hash]}
      <Card
        node={n}
        x={p.x}
        y={p.y}
        {dev}
        pending={isPending(n.e, persp)}
        viewFromConductor={persp !== 'network'}
        on={sel === n.e.hash}
        dim={!!sel && !linked.has(n.e.hash)}
        onclick={() => onpick(n.e.hash)}
      />
    {/each}
  </div>

  <div class="heads" data-node="1">
    {#each LANES as l, i (l.id)}
      <button
        type="button"
        class="head"
        title="Jump to this lane"
        style:left="{view.x + i * LW * view.k}px"
        style:width="{Math.max(40, (LW - 8) * view.k)}px"
        onclick={() => jump(i)}
      >
        <span class="dot" style:background={tok(LANE_COL[l.id])}></span>
        <span class="head__label">{laneWord(l.id, dev)}</span>
        <span class="head__n">{counts[l.id] ?? 0}</span>
      </button>
    {/each}
  </div>

  <div class="legend" data-node="1">
    <span>Links</span>
    <span class="legend__item legend__item--on"><span class="stroke stroke--flow"></span>Flow</span>
    <button type="button" class="legend__item" class:legend__item--on={showAgents} aria-pressed={showAgents} onclick={ontoggleagents}><span class="stroke stroke--agents"></span>Agents</button>
    <button type="button" class="legend__item" class:legend__item--on={showStruct} aria-pressed={showStruct} onclick={ontogglestruct}><span class="stroke stroke--struct"></span>Structure</button>
  </div>

  <div class="zoom" class:zoom--clear={sideClosed} data-node="1">
    <button type="button" class="zoom__btn" aria-label="Zoom out" onclick={() => zoomC(1 / 1.2)}>−</button>
    <span class="zoom__pct">{Math.round(view.k * 100)}%</span>
    <button type="button" class="zoom__btn" aria-label="Zoom in" onclick={() => zoomC(1.2)}>+</button>
    <button type="button" class="zoom__btn zoom__btn--fit" onclick={onfit}>Fit</button>
  </div>
</div>

<style>
  .canvas {
    position: relative;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    cursor: grab;
    touch-action: none;
    user-select: none;
    overscroll-behavior: none;
    background-color: rgb(var(--ndo-gray-100));
    background-image: radial-gradient(rgb(var(--ndo-gray-300)) 1px, transparent 1px);
  }
  .inner {
    position: absolute;
    left: 0;
    top: 0;
    transform-origin: 0 0;
  }
  .lane {
    position: absolute;
    top: -8px;
    border-radius: var(--ndo-radius-lg);
    background: transparent;
  }
  .lane--alt {
    background: rgb(var(--ndo-color-card-bg) / 0.45);
  }
  .edges {
    position: absolute;
    left: 0;
    top: 0;
    overflow: visible;
    pointer-events: none;
  }
  .edge-label {
    font-size: 11px;
    font-family: var(--ndo-font-mono);
    fill: rgb(var(--ndo-gray-500));
    paint-order: stroke;
    stroke: rgb(var(--ndo-gray-100));
    stroke-width: 4;
    stroke-linejoin: round;
  }
  .edge-label--on {
    fill: rgb(var(--ndo-blue-700));
  }

  .heads {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 44px;
    background: rgb(var(--ndo-color-card-bg) / 0.92);
    border-bottom: 1px solid rgb(var(--ndo-gray-200));
    overflow: hidden;
    cursor: default;
  }
  .head.head {
    position: absolute;
    top: 0;
    height: 44px;
    box-sizing: border-box;
    padding: 0 10px;
    display: flex;
    align-items: center;
    gap: 6px;
    border: 0;
    background: transparent;
    cursor: pointer;
    font-family: var(--ndo-font-sans);
    font-size: 11px;
    font-weight: var(--ndo-weight-semibold);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: rgb(var(--ndo-gray-600));
    white-space: nowrap;
    overflow: hidden;
    text-align: left;
  }
  .head.head:hover {
    color: rgb(var(--ndo-gray-900));
  }
  .head.head:focus-visible {
    outline: none;
    box-shadow: inset var(--ndo-focus-ring);
  }
  .head__label {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .head__n {
    font-family: var(--ndo-font-mono);
    font-weight: var(--ndo-weight-normal);
    letter-spacing: 0;
    color: rgb(var(--ndo-gray-400));
  }
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
    display: inline-block;
  }

  .legend {
    position: absolute;
    left: 12px;
    bottom: 12px;
    display: flex;
    align-items: center;
    gap: 4px;
    background: rgb(var(--ndo-color-card-bg));
    border: 1px solid rgb(var(--ndo-gray-200));
    border-radius: var(--ndo-radius-lg);
    box-shadow: var(--ndo-shadow-sm);
    padding: 4px 6px 4px 10px;
    font-family: var(--ndo-font-sans);
    font-size: 12px;
    color: rgb(var(--ndo-gray-500));
    cursor: default;
  }
  .legend__item,
  .legend__item.legend__item {
    display: flex;
    align-items: center;
    gap: 6px;
    border: 0;
    background: transparent;
    padding: 4px 8px;
    border-radius: var(--ndo-radius-sm);
    font: inherit;
    font-size: 12px;
    color: rgb(var(--ndo-gray-400));
    cursor: pointer;
  }
  span.legend__item {
    cursor: default;
  }
  .legend__item--on.legend__item--on {
    color: rgb(var(--ndo-gray-900));
  }
  .stroke {
    width: 14px;
    flex-shrink: 0;
  }
  .stroke--flow {
    height: 2px;
    background: rgb(var(--ndo-gray-500));
  }
  .stroke--agents {
    border-top: 2px dashed rgb(var(--ndo-violet-700));
  }
  .stroke--struct {
    border-top: 2px dotted rgb(var(--ndo-blue-600));
  }

  .zoom {
    position: absolute;
    right: 12px;
    bottom: 12px;
    display: flex;
    gap: 2px;
    background: rgb(var(--ndo-color-card-bg));
    border: 1px solid rgb(var(--ndo-gray-200));
    border-radius: var(--ndo-radius-lg);
    box-shadow: var(--ndo-shadow-sm);
    padding: 3px;
    cursor: default;
  }
  /* With the panel collapsed the canvas reaches the comments button; keep
     the zoom controls clear of it. */
  .zoom--clear {
    right: 64px;
  }
  .zoom__btn.zoom__btn {
    border: 0;
    background: transparent;
    min-width: 30px;
    height: 28px;
    border-radius: var(--ndo-radius-sm);
    cursor: pointer;
    font-family: var(--ndo-font-sans);
    font-size: 14px;
    color: rgb(var(--ndo-gray-700));
  }
  .zoom__btn--fit.zoom__btn--fit {
    min-width: 36px;
    font-size: 12px;
    font-weight: var(--ndo-weight-medium);
  }
  .zoom__btn.zoom__btn:hover {
    background: rgb(var(--ndo-gray-100));
  }
  .zoom__pct {
    min-width: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-family: var(--ndo-font-mono);
    color: rgb(var(--ndo-gray-500));
  }
</style>
