<script lang="ts">
  // The bench: the shared resource in the middle, wired to everything the hApp
  // attaches to it (its group listing, typed rules, items, requests and hard
  // links), plus one open socket to link another resource. Under it, the
  // 30-day activity chart.
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
    background-color: var(--ndo-color-bg-app);
    background-image:
      linear-gradient(var(--ndo-color-border) 1px, transparent 1px),
      linear-gradient(90deg, var(--ndo-color-border) 1px, transparent 1px);
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
  }
  .chip {
    flex-shrink: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: auto;
    font-family: var(--ndo-font-mono);
    font-size: 11px;
    padding: 4px 8px;
    background: rgb(var(--ndo-color-card-bg));
    border: 1px solid var(--ndo-color-border);
    border-radius: var(--ndo-radius-sm);
  }
  .btn.btn {
    flex-shrink: 0;
    font-family: var(--ndo-font-sans);
    font-size: 11px;
    font-weight: var(--ndo-weight-semibold);
    padding: 6px 10px;
    border: 1px solid rgb(var(--ndo-primary-600));
    border-radius: var(--ndo-radius-sm);
    background: rgb(var(--ndo-primary-600));
    color: rgb(var(--ndo-color-text-inverse));
    cursor: pointer;
    white-space: nowrap;
    transition: var(--ndo-transition-colors);
  }
  .btn.btn:hover {
    background: rgb(var(--ndo-primary-700));
    border-color: rgb(var(--ndo-primary-700));
  }
  .btn.btn:focus-visible,
  .lnk.lnk:focus-visible {
    outline: none;
    box-shadow: var(--ndo-focus-ring);
  }

  .diagram {
    position: absolute;
    left: 0;
    top: 60px;
    width: 100%;
    height: calc(100% - 196px);
    font-family: var(--ndo-font-mono);
  }

  .wires path {
    fill: none;
    stroke: rgb(var(--ndo-gray-700));
    stroke-width: 1.5;
  }
  .wires path.open {
    stroke: rgb(var(--ndo-gray-400));
    stroke-dasharray: 4 4;
  }
  .wires path.on {
    stroke: rgb(var(--ndo-primary-600));
    stroke-width: 2.5;
  }

  .core {
    fill: rgb(var(--ndo-color-card-bg));
    stroke: rgb(var(--ndo-gray-900));
    stroke-width: 2;
  }
  .core-inner {
    fill: none;
    stroke: rgb(var(--ndo-gray-200));
  }
  .core-kicker,
  .core-hash {
    font-size: 10px;
    fill: rgb(var(--ndo-gray-500));
  }
  .core-name {
    font-family: var(--ndo-font-sans);
    font-size: 14px;
    font-weight: var(--ndo-weight-bold);
    fill: rgb(var(--ndo-gray-900));
  }
  .pulse {
    fill: rgb(var(--ndo-green-600));
    animation: pulse 1.6s ease-in-out infinite;
  }
  .pulse.busy {
    fill: rgb(var(--ndo-amber-600));
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
    fill: rgb(var(--ndo-color-card-bg));
    stroke: rgb(var(--ndo-gray-900));
  }
  .socket circle {
    fill: rgb(var(--ndo-gray-900));
  }
  .socket .t {
    font-size: 11px;
    font-weight: var(--ndo-weight-bold);
    fill: rgb(var(--ndo-gray-900));
  }
  .socket .s {
    font-size: 11px;
    fill: rgb(var(--ndo-gray-500));
  }
  .socket:hover rect,
  .socket:focus-visible rect {
    stroke: rgb(var(--ndo-primary-600));
    stroke-width: 2;
  }
  .socket.on rect {
    fill: rgb(var(--ndo-primary-50));
    stroke: rgb(var(--ndo-primary-600));
  }
  .socket.on circle {
    fill: rgb(var(--ndo-primary-600));
  }
  .socket--open rect {
    fill: var(--ndo-color-surface);
    stroke: rgb(var(--ndo-gray-400));
    stroke-dasharray: 4 4;
  }
  .socket--open circle {
    fill: rgb(var(--ndo-color-card-bg));
    stroke: rgb(var(--ndo-gray-400));
  }
  .socket--open .t,
  .socket--open .s {
    fill: rgb(var(--ndo-gray-500));
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
    max-width: calc(100% - 40px);
    padding: 10px 14px;
    font-size: var(--ndo-text-xs);
    white-space: nowrap;
    background: rgb(var(--ndo-color-card-bg));
    border: 1.5px solid rgb(var(--ndo-gray-900));
    border-radius: var(--ndo-radius-md);
    box-shadow: 4px 4px 0 rgb(var(--ndo-gray-900));
  }
  .pop span {
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: var(--ndo-font-mono);
    font-size: 11px;
    color: var(--ndo-color-text-muted);
  }
  .pop code {
    font-family: var(--ndo-font-mono);
  }
  .lnk.lnk {
    padding: 0;
    border: none;
    background: none;
    font-family: var(--ndo-font-mono);
    font-size: 11px;
    color: var(--ndo-color-link);
    text-decoration: underline;
    cursor: pointer;
  }
</style>
