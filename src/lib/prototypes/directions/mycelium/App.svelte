<script lang="ts">
  // Direction A · Mycelium (handoff A.jsx, "A Mycelium.html"). A dark trace
  // field built from design-system grays: a 64px rail (Field, Signals,
  // Traces, You), the field of NDO nodes, a 380px detail panel and a 36px
  // status bar. Contract: ../../README.md.
  //
  // What lives in the URL, so a reviewer can link it: the view (`?view=`),
  // the selected NDO (`?ndo=`) and the group scope (`?group=`). The fade
  // window and the trail mode are per-session controls and stay local.
  // Original webfonts, self-hosted (ISA Phase 9, D9): the handoff's
  // <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500">,
  // never fetched from Google Fonts at runtime.
  import '@fontsource/instrument-sans/400.css';
  import '@fontsource/instrument-sans/500.css';
  import '@fontsource/instrument-sans/600.css';
  import '@fontsource/instrument-sans/700.css';
  import '@fontsource/jetbrains-mono/400.css';
  import '@fontsource/jetbrains-mono/500.css';
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
        {#if view === 'signals'}
          <h2>Open signals</h2>
          <p class="lede">Derived from open commitments, resource states and governance rules across your groups. Picking one up runs the matching zome call.</p>
          {#each proto.signals as g (g.id)}
            <SignalCard {g} showNdo />
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
    <DetailPanel id={sel} {decay} onclose={closePanel} />
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
      {:else}
        Last trace reached you via Marco → FabLab node
      {/if}
    </span>
    <span class="mono dht">DHT ⟳ {proto.s.offline ? 'paused' : '98% consistent'}</span>
  </footer>

  <ModalHost />
  <Toasts />
  <Onboarding onndo={(id) => select(id)} ongroup={() => setGroup('all')} />
</div>

<style>
  /* Original palette and webfonts (ISA Phase 9, D8/D9), scoped to this
     direction's root: A Mycelium.html's :root block, verbatim. The shared UI
     kit (modals, menu, onboarding, toasts) is bridged onto the same values
     through --proto-* (see README's mapping table); its own hardcoded
     literals (--pl, PErr's #D8452F, FlowMenu's hover rgba) are matched here
     too, since they never varied by direction in the handoff. */
  .app {
    /* The original never sets a page line-height; the site's reset sets 1.5,
       which made every row of the field and panel taller than A Mycelium's. */
    line-height: normal;
    --bg: #0b1113;
    --bg2: #111a1d;
    --line: #1f2c30;
    --ink: #e6efee;
    --mute: #8ca3a2;
    --dim: #56706f;
    --teal: #2ec4b6;

    --proto-bg: var(--bg2);
    --proto-ink: var(--ink);
    --proto-muted: var(--mute);
    --proto-line: #2a3a3e;
    --proto-accent: var(--teal);
    --proto-accent-hover: #5ad6ca;
    --proto-accent-ink: var(--bg);
    --proto-radius: 14px;
    --proto-control-radius: 999px;
    --proto-field-radius: 8px;
    --proto-font: 'Instrument Sans', sans-serif;
    --proto-mono: 'JetBrains Mono', monospace;
    --proto-overlay: rgba(0, 0, 0, 0.45);
    --proto-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.5);
    --proto-danger: #d8452f;
    --proto-hover: rgba(127, 127, 127, 0.12);
    --proto-toast-bg: #131a1c;
    --proto-toast-ink: #fff;

    height: 100%;
    display: grid;
    grid-template-columns: 64px minmax(0, 1fr) 380px;
    grid-template-rows: minmax(0, 1fr) 36px;
    background: var(--bg);
    color: var(--ink);
    font-family: 'Instrument Sans', sans-serif;
    overflow: hidden;
  }
  .mono {
    font-family: 'JetBrains Mono', monospace;
  }

  /* ── Rail ── */
  .rail {
    grid-row: 1 / 3;
    border-right: 1px solid var(--line);
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
    border-radius: 10px;
    background: #f4f5f5;
    margin-bottom: 14px;
  }
  .ri {
    position: relative;
    width: 48px;
    padding: 8px 0;
    border-radius: 8px;
    text-align: center;
    font: inherit;
    font-size: 10px;
    color: var(--dim);
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
    color: var(--ink);
  }
  .ri.on {
    color: var(--teal);
    background: #12262a;
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
    background: #f2b84b;
    color: #0b1113;
    font-size: 9px;
    font-weight: 700;
    border-radius: 999px;
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
    background: var(--bg2);
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: 3px;
    font-size: 12px;
    color: var(--mute);
  }
  .seg--push {
    margin-left: auto;
  }
  .seg button {
    font: inherit;
    font-size: 12px;
    padding: 5px 12px;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: var(--mute);
    cursor: pointer;
    white-space: nowrap;
    transition: var(--ndo-transition-colors);
  }
  .seg button:hover {
    color: var(--ink);
  }
  .seg button.on {
    background: #1b3236;
    color: var(--teal);
  }
  .seg button:focus-visible,
  .new:focus-visible,
  .node:focus-visible {
    outline: none;
    box-shadow: var(--ndo-focus-ring);
  }
  .new {
    font: 600 12px 'Instrument Sans', sans-serif;
    background: var(--teal);
    color: #0b1113;
    border: 0;
    border-radius: 999px;
    padding: 8px 14px;
    cursor: pointer;
    white-space: nowrap;
    transition: var(--ndo-transition-colors);
  }
  .new:hover {
    background: #5ad6ca;
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
    color: var(--mute);
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
    background: var(--teal);
  }
  .k--cite {
    background: #8b5cf6;
  }
  .k--hard {
    background: repeating-linear-gradient(90deg, #4c7be0 0 2px, transparent 2px 8px);
  }
  .k--sig {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #f2b84b;
  }
  .decay {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 11px;
    color: var(--mute);
    white-space: nowrap;
  }
  .decay input {
    accent-color: var(--teal);
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
  .list h2 {
    font-size: 26px;
    margin: 0 0 6px;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  .lede {
    color: var(--mute);
    font-size: 14px;
    margin: 0 0 18px;
  }
  .empty {
    margin: 0;
    font-size: 12px;
    color: var(--dim);
    padding: 10px 0;
  }

  /* ── Empty panel ── */
  .panel-empty {
    border-left: 1px solid var(--line);
    background: var(--bg2);
    display: grid;
    place-items: center;
    padding: 22px;
    text-align: center;
  }

  /* ── Status bar ── */
  .status {
    grid-column: 2 / 4;
    border-top: 1px solid var(--line);
    display: flex;
    align-items: center;
    gap: 22px;
    /* The handoff's own rule is `padding: 0 20px`; this direction's status
       bar clears the exit chip (moved here, see the effect above) and the
       comments button (design-system chrome, ISA claim 41). */
    padding: 0 88px 0 228px;
    font-size: 11px;
    color: var(--mute);
    white-space: nowrap;
    overflow: hidden;
  }
  .node {
    font: inherit;
    color: inherit;
    background: none;
    border: 0;
    padding: 2px 4px;
    border-radius: 4px;
    cursor: pointer;
  }
  .node:hover {
    color: var(--ink);
  }
  .ok {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 6px;
    background: var(--teal);
  }
  .ok.off {
    background: #f2b84b;
  }
  .dht {
    margin-left: auto;
  }
</style>
