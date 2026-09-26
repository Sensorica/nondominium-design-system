<script lang="ts">
  // Direction A · Mycelium (handoff A.jsx, "A Mycelium.html"). A dark trace
  // field built from design-system grays: a 64px rail (Field, Signals,
  // Traces, You), the field of NDO nodes, a 380px detail panel and a 36px
  // status bar. Contract: ../../README.md.
  //
  // What lives in the URL, so a reviewer can link it: the view (`?view=`),
  // the selected NDO (`?ndo=`) and the group scope (`?group=`). The fade
  // window and the trail mode are per-session controls and stay local.
  import { paths } from '$lib/paths';
  import { directionBySlug, type ViewOf } from '../../directions';
  import { currentView, currentRecord, goView } from '../../url.svelte';
  import { proto } from '../../store/store.svelte';
  import { AgentAvatar, FlowMenu, GroupScope, ModalHost, Onboarding, Toasts, modals } from '../../ui';
  import FieldView from './FieldView.svelte';
  import DetailPanel from './DetailPanel.svelte';
  import SignalCard from './SignalCard.svelte';
  import TraceRow from './TraceRow.svelte';
  import YouView from './YouView.svelte';
  import { MODES, type Mode } from './field';

  type View = ViewOf<'mycelium'>;
  const SLUG = 'mycelium';
  const VIEWS = directionBySlug(SLUG)!.views;
  /** The handoff opens with the CNC machine selected. */
  const DEFAULT_NDO = 'sol';

  const view = $derived(currentView(SLUG));
  const rec = $derived(currentRecord());

  // Group scope: an unknown group (after starting over, say) reads as all.
  const group = $derived(rec.group && proto.q.group(rec.group) ? rec.group : 'all');

  // Selection: the URL wins; without one, the default NDO until closed.
  let closed = $state(false);
  const sel = $derived(rec.ndo ?? (closed ? null : DEFAULT_NDO));
  const selNdo = $derived(proto.q.ndo(sel));

  let decay = $state(14);
  let mode = $state<Mode>('Trails');

  function record(patch: { ndo?: string | null; group?: string | null } = {}) {
    const ndo = patch.ndo !== undefined ? patch.ndo : rec.ndo;
    const g = patch.group !== undefined ? patch.group : group;
    return { ...(g && g !== 'all' ? { group: g } : {}), ...(ndo ? { ndo } : {}) };
  }

  function select(id: string, to: View = 'field') {
    closed = false;
    goView(SLUG, to, record({ ndo: id }), { replace: to === view });
  }
  function closePanel() {
    closed = true;
    goView(SLUG, view, record({ ndo: null }), { replace: true });
  }
  function setGroup(g: string) {
    goView(SLUG, view, record({ group: g }), { replace: true });
  }

  const RAIL: Record<View, string> = { field: 'g', signals: 'g g--dashed', traces: 'g g--square', you: '' };

  const queued = $derived(proto.s.traces.filter((t) => t.status === 'queued').length);
  const lastPath = $derived(proto.s.traces.find((t) => t.hops.length)?.hops);

  // The layout's exit chip sits bottom left, where the rail's You item is.
  // Move it into the status bar, clear of the rail.
  $effect(() => {
    const root = document.documentElement.style;
    root.setProperty('--proto-exit-left', '76px');
    root.setProperty('--proto-exit-bottom', '3px');
    return () => {
      root.removeProperty('--proto-exit-left');
      root.removeProperty('--proto-exit-bottom');
    };
  });
</script>

<div class="app">
  <nav class="rail" aria-label="Views">
    <img class="logo" src={paths.logoMark()} alt="Nondominium" width="40" height="40" />
    {#each VIEWS as v (v.id)}
      {@const id = v.id as View}
      <button
        type="button"
        class="ri"
        class:on={view === id}
        class:ri--you={id === 'you'}
        onclick={() => goView(SLUG, id, record())}
        aria-current={view === id ? 'page' : undefined}
      >
        {#if id === 'you'}
          <AgentAvatar id={proto.me.id} size={22} ring={view === 'you'} />
        {:else}
          <span class={RAIL[id]}></span>
        {/if}
        {v.label}
        {#if id === 'signals'}<em class="cnt">{proto.signals.length}</em>{/if}
      </button>
    {/each}
  </nav>

  <main class="main">
    {#if view === 'field'}
      <FieldView {sel} onselect={(id) => select(id)} {decay} {mode} {group} />
      <div class="top">
        <div class="seg" role="group" aria-label="Group scope">
          <GroupScope value={group} onchange={setGroup}>
            {#snippet chip(c)}
              <button type="button" class:on={c.on} aria-pressed={c.on} onclick={c.select}>{c.label}</button>
            {/snippet}
          </GroupScope>
        </div>
        <div class="seg seg--push" role="group" aria-label="Which trails">
          {#each Object.keys(MODES) as k (k)}
            <button type="button" class:on={mode === k} aria-pressed={mode === k} onclick={() => (mode = k as Mode)}>{k}</button>
          {/each}
        </div>
        <div class="seg">
          <button type="button" onclick={() => modals.open({ type: 'group', after: setGroup })}>+ Group</button>
          <button type="button" onclick={() => modals.open({ type: 'join', after: setGroup })}>→ Join</button>
        </div>
        <FlowMenu ndo={sel} onOpen={(id) => select(id)} onGroup={setGroup} />
        <button type="button" class="new" onclick={() => modals.open({ type: 'create', after: (id) => select(id) })}>+ Declare NDO</button>
      </div>
      <div class="foot">
        <div class="legend">
          <span><i class="k k--use"></i>use &amp; custody</span>
          <span><i class="k k--cite"></i>citation</span>
          <span><i class="k k--hard"></i>hard link</span>
          <span><i class="k k--sig"></i>open signal</span>
        </div>
        <label class="decay">
          Trails fade over
          <input type="range" min="1" max="90" bind:value={decay} />
          <span class="mono">{decay} d</span>
        </label>
      </div>
    {:else}
      <div class="list">
        <div class="list__bar"><FlowMenu ndo={sel} onOpen={(id) => select(id)} onGroup={setGroup} /></div>
        {#if view === 'signals'}
          <h2>Open signals</h2>
          <p class="lede">Derived from open commitments, resource states and governance rules across your groups. Picking one up runs the matching zome call.</p>
          {#each proto.signals as g (g.id)}
            <SignalCard {g} showNdo onopen={(id) => select(id)} />
          {:else}
            <p class="empty">Nothing is asking for attention right now.</p>
          {/each}
        {:else if view === 'traces'}
          <h2>Traces reaching your node</h2>
          <p class="lede">Hover a trace to see the peer path it took. Opacity shows freshness at the current fade setting ({decay} d).</p>
          {#each proto.s.traces as t (t.id)}
            <TraceRow {t} {decay} showNdo />
          {:else}
            <p class="empty">No traces yet.</p>
          {/each}
        {:else}
          <YouView {decay} />
        {/if}
      </div>
    {/if}
  </main>

  {#if view === 'field' && sel && selNdo}
    <DetailPanel id={sel} {decay} onclose={closePanel} onopen={(id) => select(id)} />
  {:else}
    <aside class="panel-empty">
      <p class="empty">
        {proto.s.ndos.length
          ? 'Select an NDO in the field to see its traces, signals and links.'
          : 'No NDOs yet. NDOs are scoped to groups: declare one with + Declare NDO.'}
      </p>
    </aside>
  {/if}

  <footer class="status">
    <button type="button" class="node" onclick={() => proto.actions.toggleOffline()} title="Toggle to simulate going offline">
      <span class="ok" class:off={proto.s.offline}></span>Your node · {proto.s.offline ? 'offline, traces queue locally' : 'online'}
    </button>
    <span>{proto.s.offline ? 0 : 23} peers gossiping</span>
    <span>
      {#if queued}
        {queued} queued
      {:else if lastPath}
        Last trace reached you via {lastPath.join(' → ')}
      {:else}
        No traces have reached you yet
      {/if}
    </span>
    <span class="mono dht">DHT ⟳ {proto.s.offline ? 'paused' : '98% consistent'}</span>
  </footer>

  <ModalHost />
  <Toasts />
  <Onboarding onndo={(id) => select(id)} ongroup={() => setGroup('all')} />
</div>

<style>
  /* The dark ground is built from design-system grays; the accent is the
     brand teal. The --proto-* properties theme the shared kit (modals, menu,
     onboarding, toasts) to match. */
  .app {
    --proto-bg: rgb(var(--ndo-gray-900));
    --proto-ink: rgb(var(--ndo-gray-50));
    --proto-muted: rgb(var(--ndo-gray-400));
    --proto-line: rgb(var(--ndo-gray-700));
    --proto-accent: rgb(var(--ndo-brand-teal-300));
    --proto-accent-hover: rgb(var(--ndo-brand-teal-100));
    --proto-accent-ink: rgb(var(--ndo-gray-950));
    --proto-control-radius: var(--ndo-radius-pill);
    --proto-hover: rgb(var(--ndo-gray-50) / 0.08);
    --proto-overlay: rgb(var(--ndo-gray-950) / 0.7);
    --proto-danger: rgb(var(--ndo-red-200));
    --proto-toast-bg: rgb(var(--ndo-gray-800));
    --proto-toasts-bottom: 96px;

    height: 100%;
    display: grid;
    grid-template-columns: 64px minmax(0, 1fr) 380px;
    grid-template-rows: minmax(0, 1fr) 36px;
    background: rgb(var(--ndo-gray-950));
    color: rgb(var(--ndo-gray-50));
    font-family: var(--ndo-font-sans);
    overflow: hidden;
  }
  .mono {
    font-family: var(--ndo-font-mono);
  }

  /* ── Rail ── */
  .rail {
    grid-row: 1 / 3;
    border-right: 1px solid rgb(var(--ndo-gray-800));
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 14px 0;
    gap: 6px;
  }
  .logo {
    width: 40px;
    height: 40px;
    padding: 6px;
    box-sizing: border-box;
    border-radius: var(--ndo-radius-lg);
    background: rgb(var(--ndo-gray-50));
    margin-bottom: 14px;
  }
  .ri {
    position: relative;
    width: 48px;
    padding: 8px 0;
    border-radius: var(--ndo-radius-md);
    text-align: center;
    font: inherit;
    font-size: 10px;
    color: rgb(var(--ndo-gray-500));
    background: none;
    border: 0;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    transition: var(--ndo-transition-colors);
  }
  .ri:hover {
    color: rgb(var(--ndo-gray-50));
  }
  .ri.on {
    color: rgb(var(--ndo-brand-teal-300));
    background: rgb(var(--ndo-brand-teal-700) / 0.22);
  }
  .ri:focus-visible {
    outline: none;
    box-shadow: var(--ndo-focus-ring);
  }
  .ri--you {
    margin-top: auto;
  }
  .g {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 1.5px solid currentColor;
  }
  .g--dashed {
    border-style: dashed;
  }
  .g--square {
    border-radius: 3px;
  }
  .cnt {
    position: absolute;
    top: 2px;
    right: 4px;
    font-style: normal;
    background: rgb(var(--ndo-amber-600));
    color: rgb(var(--ndo-gray-950));
    font-size: 9px;
    font-weight: 700;
    border-radius: var(--ndo-radius-pill);
    padding: 1px 5px;
  }

  /* ── Field ── */
  .main {
    position: relative;
    overflow: hidden;
    min-height: 0;
  }
  .top {
    position: absolute;
    left: 24px;
    top: 18px;
    right: 24px;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  .seg {
    display: flex;
    align-items: center;
    background: rgb(var(--ndo-gray-900));
    border: 1px solid rgb(var(--ndo-gray-800));
    border-radius: var(--ndo-radius-pill);
    padding: 3px;
    font-size: 12px;
    color: rgb(var(--ndo-gray-400));
  }
  .seg--push {
    margin-left: auto;
  }
  .seg button {
    font: inherit;
    font-size: 12px;
    padding: 5px 12px;
    border: 0;
    border-radius: var(--ndo-radius-pill);
    background: transparent;
    color: rgb(var(--ndo-gray-400));
    cursor: pointer;
    white-space: nowrap;
    transition: var(--ndo-transition-colors);
  }
  .seg button:hover {
    color: rgb(var(--ndo-gray-50));
  }
  .seg button.on {
    background: rgb(var(--ndo-brand-teal-700) / 0.35);
    color: rgb(var(--ndo-brand-teal-300));
  }
  .seg button:focus-visible,
  .new:focus-visible,
  .node:focus-visible {
    outline: none;
    box-shadow: var(--ndo-focus-ring);
  }
  .new {
    font: inherit;
    font-size: 12px;
    font-weight: 600;
    background: rgb(var(--ndo-brand-teal-300));
    color: rgb(var(--ndo-gray-950));
    border: 0;
    border-radius: var(--ndo-radius-pill);
    padding: 8px 14px;
    cursor: pointer;
    white-space: nowrap;
    transition: var(--ndo-transition-colors);
  }
  .new:hover {
    background: rgb(var(--ndo-brand-teal-100));
  }

  .foot {
    position: absolute;
    left: 24px;
    right: 24px;
    bottom: 14px;
    z-index: 2;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px 24px;
  }
  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 18px;
    font-size: 11px;
    color: rgb(var(--ndo-gray-400));
  }
  .legend > span {
    white-space: nowrap;
  }
  .k {
    display: inline-block;
    width: 22px;
    height: 3px;
    border-radius: 2px;
    margin-right: 6px;
    vertical-align: middle;
  }
  .k--use {
    background: rgb(var(--ndo-brand-teal-300));
  }
  .k--cite {
    background: rgb(var(--ndo-violet-300));
  }
  .k--hard {
    background: repeating-linear-gradient(90deg, rgb(var(--ndo-brand-blue-300)) 0 2px, transparent 2px 8px);
  }
  .k--sig {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgb(var(--ndo-amber-600));
  }
  .decay {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 11px;
    color: rgb(var(--ndo-gray-400));
    white-space: nowrap;
  }
  .decay input {
    accent-color: rgb(var(--ndo-brand-teal-300));
    width: 140px;
  }

  /* ── List views ── */
  .list {
    position: absolute;
    inset: 0;
    overflow: auto;
    padding: 28px 36px;
    max-width: 760px;
  }
  .list__bar {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 8px;
  }
  .list h2 {
    font-size: 26px;
    margin: 0 0 6px;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  .lede {
    color: rgb(var(--ndo-gray-400));
    font-size: 14px;
    margin: 0 0 18px;
  }
  .empty {
    margin: 0;
    font-size: 12px;
    color: rgb(var(--ndo-gray-500));
    padding: 10px 0;
  }

  /* ── Empty panel ── */
  .panel-empty {
    border-left: 1px solid rgb(var(--ndo-gray-800));
    background: rgb(var(--ndo-gray-900));
    display: grid;
    place-items: center;
    padding: 22px;
    text-align: center;
  }

  /* ── Status bar ── */
  .status {
    grid-column: 2 / 4;
    border-top: 1px solid rgb(var(--ndo-gray-800));
    display: flex;
    align-items: center;
    gap: 22px;
    /* Left: clear of the exit chip. Right: clear of the comments button. */
    padding: 0 88px 0 228px;
    font-size: 11px;
    color: rgb(var(--ndo-gray-400));
    white-space: nowrap;
    overflow: hidden;
  }
  .node {
    font: inherit;
    color: inherit;
    background: none;
    border: 0;
    padding: 2px 4px;
    border-radius: var(--ndo-radius-sm);
    cursor: pointer;
  }
  .node:hover {
    color: rgb(var(--ndo-gray-50));
  }
  .ok {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 6px;
    background: rgb(var(--ndo-brand-teal-300));
  }
  .ok.off {
    background: rgb(var(--ndo-amber-600));
  }
  .dht {
    margin-left: auto;
  }
</style>
