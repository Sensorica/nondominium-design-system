<script lang="ts">
  // The bench: the shared resource in the middle, wired to everything the hApp
  // attaches to it (its group listing, typed rules, items, requests and hard
  // links), plus one open socket to link another resource. Under it, the
  // 30-day activity chart.
  //
  // Colours below are literal, from C.jsx's IN_COL/LED maps and its inline
  // SVG styles (ISA Phase 9 D8: A to E carry the handoff's own palette).
  import { proto } from '$lib/prototypes/store/store.svelte';
  import { plain } from '$lib/prototypes/plain';
  import { modals } from '$lib/prototypes/ui';
  import ActivityScope from './ActivityScope.svelte';

  let { id }: { id: string } = $props();

  interface Attached {
    id: string;
    type: string;
    label: string;
    by: string;
    entry: string;
  }

  const MAX = 11;
  const W = 980;
  const ROW = 110;

  const n = $derived(proto.q.ndo(id)!);
  const dev = $derived(proto.dev);
  const cut = (s: string, max: number) => (s.length > max ? s.slice(0, max - 1) + '…' : s);

  const all = $derived<Attached[]>([
    ...proto.s.groups
      .filter((g) => g.id === n.group)
      .map((g) => ({ id: 'g-' + g.id, type: dev ? 'NdoAnchor' : 'Group', label: g.name, by: n.initiator, entry: 'zome_group::create_ndo_anchor' })),
    ...(proto.s.rules[id] ?? []).map(([k, v, author], i) => ({
      id: 'r-' + i,
      type: dev ? k : 'Rule · ' + plain(k),
      label: plain(v),
      by: author || n.initiator,
      entry: 'create_governance_rule'
    })),
    ...(proto.s.instances[id] ?? []).map(([k, v, c], i) => ({
      id: 'i-' + i,
      type: dev ? 'EconomicResource' : 'Item',
      label: k + ' · ' + plain(v),
      by: c,
      entry: 'create_economic_resource'
    })),
    ...proto.q.commitmentsOf(id).map((c) => ({
      id: 'c-' + c.id,
      type: dev ? 'Commitment' : 'Request',
      label: plain(c.action) + ' · ' + (c.status === 'open' ? 'waiting' : 'done'),
      by: c.receiver,
      entry: 'propose_commitment'
    })),
    ...proto.q.hardLinksOf(id).map((h, i) => {
      const other = proto.q.ndo(h.from === id ? h.to : h.from);
      return {
        id: 'h-' + i,
        type: dev ? 'NdoHardLink' : 'Linked resource',
        label: plain(h.type) + (h.from === id ? ' → ' : ' ← ') + (other?.name ?? 'unknown'),
        by: n.initiator,
        entry: 'create_ndo_hard_link'
      };
    })
  ]);

  // Up to eleven attachments, then the open socket, alternating left and
  // right. The handoff fixed the canvas at 980 × 470, which cut off the top
  // and bottom rows once there were six; the height grows with the rows here.
  const sockets = $derived<(Attached | null)[]>([...all.slice(0, MAX), null]);
  const rows = $derived(Math.ceil(sockets.length / 2));
  const H = $derived(Math.max(470, rows * ROW + 40));
  const cx = W / 2;
  const cy = $derived(H / 2);
  const placed = $derived(
    sockets.map((l, i) => {
      const left = i % 2 === 0;
      const row = Math.floor(i / 2);
      return { l, left, x: left ? 60 : W - 230, y: cy + (row - (rows - 1) / 2) * ROW };
    })
  );

  // The picked attachment belongs to the NDO it was picked on, so switching
  // resources closes the popover without an effect.
  let picked = $state<{ ndo: string; id: string } | null>(null);
  const pick = $derived(picked?.ndo === id ? picked.id : null);
  const shown = $derived(pick ? all.find((l) => l.id === pick) : undefined);
  const toggle = (lid: string) => (picked = pick === lid ? null : { ndo: id, id: lid });

  const attach = () => modals.open({ type: 'attach', ndo: id });
  const onKey = (e: KeyboardEvent, run: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      run();
    }
  };

  const busy = $derived(proto.q.signalsOf(id).length > 0);
</script>

<main class="bench">
  <div class="hdr">
    <span class="chip">{all.length} things linked to this resource{all.length > MAX ? ' · showing ' + MAX : ''}</span>
    <button type="button" class="btn" onclick={attach}>+ Link resource</button>
    <button type="button" class="btn" onclick={() => modals.open({ type: 'rule', ndo: id })}>+ Rule</button>
    <button type="button" class="btn" onclick={() => modals.open({ type: 'resources', ndo: id })}>+ Item</button>
  </div>

  <svg class="diagram" viewBox="0 0 {W} {H}" role="group" aria-label="Everything linked to {n.name}">
    <g class="wires">
      {#each placed as { l, left, x, y } (l?.id ?? 'open')}
        <path
          d="M{left ? cx - 90 : cx + 90} {cy} H{left ? cx - 140 : cx + 140} V{y} H{left ? x + 170 : x}"
          class:open={!l}
          class:on={!!l && pick === l.id}
        />
      {/each}
    </g>

    <rect class="core" x={cx - 90} y={cy - 80} width="180" height="160" rx="10" />
    <rect class="core-inner" x={cx - 78} y={cy - 68} width="156" height="136" rx="6" />
    <text class="core-kicker" x={cx} y={cy - 22} text-anchor="middle">SHARED RESOURCE</text>
    <text class="core-name" x={cx} y={cy + 2} text-anchor="middle">{cut(n.name, 20)}</text>
    {#if dev}<text class="core-hash" x={cx} y={cy + 22} text-anchor="middle">{n.hash}</text>{/if}
    <circle class="pulse" class:busy cx={cx} cy={cy + 48} r="5">
      <title>{busy ? 'Needs attention' : 'Nothing waiting'}</title>
    </circle>

    {#each placed as { l, left, x, y } (l?.id ?? 'open')}
      {#if l}
        <g
          class="socket"
          class:on={pick === l.id}
          role="button"
          tabindex="0"
          aria-pressed={pick === l.id}
          aria-label="{l.type}: {l.label}"
          onclick={() => toggle(l.id)}
          onkeydown={(e) => onKey(e, () => toggle(l.id))}
        >
          <rect x={x} y={y - 24} width="170" height="48" rx="6" />
          <circle cx={left ? x + 170 : x} cy={y} r="5" />
          <text class="t" x={x + 14} y={y - 4}>{cut(l.type, 24)}</text>
          <text class="s" x={x + 14} y={y + 12}>{cut(l.label, 24)}</text>
        </g>
      {:else}
        <g
          class="socket socket--open"
          role="button"
          tabindex="0"
          aria-label="Open socket: link a resource"
          onclick={attach}
          onkeydown={(e) => onKey(e, attach)}
        >
          <rect x={x} y={y - 24} width="170" height="48" rx="6" />
          <circle cx={left ? x + 170 : x} cy={y} r="5" />
          <text class="t" x={x + 14} y={y - 4}>open socket</text>
          <text class="s" x={x + 14} y={y + 12}>link a resource</text>
        </g>
      {/if}
    {/each}
  </svg>

  {#if shown}
    <div class="pop" role="status">
      <b>{shown.type}</b>
      <span>{shown.label}</span>
      <span>by {proto.q.agent(shown.by)}{#if dev} · <code>{shown.entry}</code>{/if}</span>
      <button type="button" class="lnk" onclick={() => (picked = null)}>close</button>
    </div>
  {/if}

  <ActivityScope {id} />
</main>

<style>
  .bench {
    position: relative;
    overflow: hidden;
    background-color: var(--bg);
    background-image:
      linear-gradient(var(--grid) 1px, transparent 1px),
      linear-gradient(90deg, var(--grid) 1px, transparent 1px);
    background-size: 24px 24px;
  }

  .hdr {
    position: absolute;
    top: 14px;
    left: 20px;
    right: 20px;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
  .chip {
    margin-right: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font: 11px 'Space Mono', monospace;
    background: #fff;
    border: 1px solid var(--grid);
    padding: 4px 8px;
    border-radius: 4px;
  }
  .btn {
    flex-shrink: 0;
    font: 600 11px 'Space Grotesk', sans-serif;
    background: var(--ink);
    color: #fff;
    padding: 6px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    white-space: nowrap;
  }
  .btn:hover {
    background: var(--teal);
  }

  .diagram {
    position: absolute;
    left: 0;
    top: 60px;
    width: 100%;
    height: calc(100% - 196px);
  }
  /* svg text{font-family:'Space Mono'}: every label in the diagram, the
     resource's own name included, is set in the mono face. */
  .diagram :global(text) {
    font-family: 'Space Mono', monospace;
  }

  .wires :global(path) {
    fill: none;
    stroke: var(--ink);
    stroke-width: 1.5;
  }
  .wires :global(path.open) {
    stroke: var(--mute);
    stroke-dasharray: 4 4;
  }
  .wires :global(path.on) {
    stroke: var(--teal);
    stroke-width: 2.5;
  }

  .core {
    fill: #fff;
    stroke: var(--ink);
    stroke-width: 2;
  }
  .core-inner {
    fill: none;
    stroke: var(--grid);
  }
  .core-kicker,
  .core-hash {
    font-size: 10px;
    fill: var(--mute);
  }
  .core-name {
    font-size: 14px;
    font-weight: 700;
    fill: var(--ink);
  }
  .pulse {
    fill: var(--teal);
    animation: pulse 1.6s ease-in-out infinite;
  }
  .pulse.busy {
    fill: #e0a21a;
  }
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.3;
    }
  }

  .socket {
    cursor: pointer;
    outline: none;
  }
  .socket rect {
    fill: #fff;
    stroke: var(--ink);
  }
  .socket circle {
    fill: var(--ink);
  }
  .socket .t {
    font-size: 11px;
    font-weight: 700;
    fill: var(--ink);
  }
  .socket .s {
    font-size: 11px;
    fill: var(--mute);
  }
  .socket.on rect {
    fill: #e6f5f3;
  }
  .socket--open rect {
    fill: #f7f9f8;
    stroke: var(--mute);
    stroke-dasharray: 4 4;
  }
  .socket--open circle {
    fill: #fff;
    stroke: var(--mute);
  }
  .socket--open .t,
  .socket--open .s {
    fill: var(--mute);
  }

  .pop {
    position: absolute;
    left: 50%;
    top: 70px;
    transform: translateX(-50%);
    z-index: 3;
    display: flex;
    align-items: center;
    gap: 14px;
    background: #fff;
    border: 1.5px solid var(--ink);
    border-radius: 6px;
    padding: 10px 14px;
    font-size: 12px;
    box-shadow: 4px 4px 0 var(--ink);
    white-space: nowrap;
  }
  .pop span {
    color: var(--mute);
    font: 11px 'Space Mono', monospace;
  }
  .lnk {
    font: 11px 'Space Mono', monospace;
    color: var(--teal);
    cursor: pointer;
    text-decoration: underline;
    margin-left: 4px;
    padding: 0;
    border: none;
    background: none;
  }
</style>
