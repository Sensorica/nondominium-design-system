<script lang="ts">
  // D · Signal Board. A board of what needs doing, derived from the data and
  // never assigned by anyone: three lanes of signals (Needs hands, Available
  // now, Needs eyes) plus a "Just happened" column of recent traces. Group
  // scope chips narrow the board; a card opens its resource in a drawer.
  //
  // Views (contract: src/lib/prototypes/README.md):
  //   board    the default, bare URL; `?group=` pins the scope
  //   drawer   `?view=drawer&ndo=…` opens that resource over the board
  // Original webfonts, self-hosted (ISA Phase 9, D9): the variable weight axis
  // of Bricolage Grotesque and DM Mono, exactly as the original's Google Fonts
  // link requested, never fetched from a CDN.
  import '@fontsource-variable/bricolage-grotesque/opsz.css';
  import '@fontsource/dm-mono';
  import { paths } from '$lib/paths';
  import { proto } from '$lib/prototypes/store/store.svelte';
  import { currentRecord, currentView, goView } from '$lib/prototypes/url.svelte';
  import { AgentAvatar, FlowMenu, GroupScope, ModalHost, Onboarding, Toasts, modals } from '$lib/prototypes/ui';
  import SignalCard from './SignalCard.svelte';
  import HappenedCard from './HappenedCard.svelte';
  import Drawer from './Drawer.svelte';
  import { HAPPENED_TONE, LANES, RECENT_MAX, RECENT_MINUTES } from './lanes';

  const view = $derived(currentView('signal-board'));
  const record = $derived(currentRecord());

  /** 'all', or a group this person belongs to. A stale `?group=` reads as all. */
  const scope = $derived(record.group && proto.q.group(record.group) ? record.group : 'all');
  /** The resource open in the drawer, if it still exists. */
  const open = $derived(view === 'drawer' && record.ndo && proto.q.ndo(record.ndo) ? record.ndo : null);

  const groupParam = (g: string) => (g === 'all' ? undefined : g);

  function setScope(g: string) {
    goView('signal-board', view, { group: groupParam(g), ndo: open ?? undefined }, { replace: true });
  }
  function setOpen(ndo: string) {
    goView('signal-board', 'drawer', { group: groupParam(scope), ndo });
  }
  function closeDrawer() {
    goView('signal-board', 'board', { group: groupParam(scope) });
  }

  // A drawer link to a resource that is gone (after starting over, say)
  // falls back to the board rather than showing it under the drawer's key.
  $effect(() => {
    if (view === 'drawer' && !open) goView('signal-board', 'board', { group: groupParam(scope) }, { replace: true });
  });

  const inScope = (ndoId: string) => {
    const n = proto.q.ndo(ndoId);
    return !!n && (scope === 'all' || n.group === scope);
  };

  const signals = $derived(proto.signals.filter((g) => inScope(g.ndo)));
  const lanes = $derived(
    LANES.map((l) => ({
      ...l,
      list: signals.filter((g) => g.lane === l.id).sort((a, b) => b.strength - a.strength)
    }))
  );
  // D.jsx does not sort this list: it filters and slices in the traces
  // array's own order (newest writes are prepended there, so a fresh trace
  // still surfaces first without an explicit sort here).
  const recent = $derived(
    proto.s.traces.filter((t) => inScope(t.ndo) && t.ago < RECENT_MINUTES).slice(0, RECENT_MAX)
  );
</script>

<div class="sb">
  <header>
    <img class="mark" src={paths.logoMark()} alt="" width="40" height="40" />
    <h1>Signals</h1>
    <div class="scope">
      <GroupScope value={scope} onchange={setScope} allLabel="All my groups">
        {#snippet chip(c)}
          <button type="button" class="chip" class:on={c.on} aria-pressed={c.on} onclick={c.select}>{c.label}</button>
        {/snippet}
      </GroupScope>
    </div>
    <button
      type="button"
      class="take ghost first"
      onclick={() => modals.open({ type: 'create', after: setOpen })}>+ Add resource</button
    >
    <button type="button" class="take ghost" onclick={() => modals.open({ type: 'group', after: setScope })}>+ Group</button>
    <FlowMenu ndo={open} onOpen={setOpen} onGroup={setScope} />
    <div class="k-me">
      <button
        type="button"
        class="meta mono"
        class:offline={proto.s.offline}
        title="Toggle offline"
        onclick={() => proto.actions.toggleOffline()}
      >
        {proto.s.offline ? '○ offline' : '● 23 peers'}
      </button>
      <button type="button" class="meta mono" onclick={() => modals.open({ type: 'receipts' })}>◆ {proto.s.receipts.length} receipts</button>
      <button type="button" class="meta who" onclick={() => modals.open({ type: 'profile' })}>
        <AgentAvatar id={proto.me.id} size={28} />{proto.me.name}
      </button>
      <button type="button" class="meta mono reset" title="Reload the example" onclick={() => proto.actions.reset()}>reset</button>
    </div>
  </header>

  <p class="sub">
    Signals are derived from entries on the DHT: open commitments, resource states and governance rules. Nobody assigns work here.
    Picking one up runs the matching zome call. Click a card to open its resource.
  </p>

  <div class="board">
    {#each lanes as l (l.id)}
      <section class="col" aria-label={l.label}>
        <div class="ch"><span class="sw" style:background={l.tone}></span><b>{l.label}</b><span class="n">{l.list.length}</span></div>
        {#each l.list as g (g.id)}
          <SignalCard sig={g} tone={l.tone} bg={l.bg} onopen={setOpen} />
        {:else}
          <div class="empty">Nothing here right now.</div>
        {/each}
      </section>
    {/each}
    <section class="col" aria-label="Just happened">
      <div class="ch"><span class="sw" style:background={HAPPENED_TONE}></span><b>Just happened</b><span class="n">live</span></div>
      {#each recent as t (t.id)}
        <HappenedCard {t} onopen={setOpen} />
      {:else}
        <div class="empty">Nothing yet. Traces show here as people act.</div>
      {/each}
    </section>
  </div>

  {#if open}
    <Drawer id={open} onclose={closeDrawer} />
  {/if}

  <ModalHost />
  <Toasts />
  <Onboarding onndo={setOpen} ongroup={() => setScope('all')} />
</div>

<style>
  /* Original D · Signal Board palette and webfonts (ISA Phase 9, D8/D9),
   * scoped to this direction's root. Values are the original stylesheet's
   * :root block, verbatim. The --proto-* lines are the mapping the shared UI
   * kit (modals, menu, onboarding, toasts) reads, so it renders like ui.jsx:
   * see src/lib/prototypes/README.md § Theming for the full table. */
  .sb {
    --bg: #fbfaf7;
    --ink: #101418;
    --ink2: #4b5258;
    --mute: #8a9096;
    --line: #e6e3dc;
    --teal: #1fb5a6;
    --tealbg: #d7f3ef;
    --blue: #3565da;
    --bluebg: #dde6fb;
    --violet: #7a4de3;
    --violetbg: #e9e1fb;
    --amber: #e7a117;
    --amberbg: #fbebc7;

    --proto-bg: #fff;
    --proto-ink: var(--ink);
    --proto-muted: var(--mute);
    --proto-line: var(--line);
    --proto-accent: var(--ink);
    --proto-accent-hover: var(--ink);
    --proto-accent-ink: #fff;
    --proto-radius: 18px;
    --proto-control-radius: 999px;
    --proto-field-radius: 8px;
    --proto-font: 'Bricolage Grotesque Variable', 'Bricolage Grotesque', sans-serif;
    --proto-mono: 'DM Mono', monospace;
    --proto-overlay: rgba(0, 0, 0, 0.45);
    --proto-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.5);
    --proto-danger: #d8452f;
    --proto-hover: rgba(127, 127, 127, 0.12);
    --proto-toast-bg: #131a1c;
    --proto-toast-ink: #fff;
    --proto-progress: #2ec4b6;
    --proto-queued: #e0a21a;
    --proto-toasts-right: 18px;
    --proto-toasts-bottom: 18px;

    /* The design system's global reset (UnoCSS's Tailwind preflight) sets
     * `html { line-height: 1.5 }`. The original page never set a line-height
     * at all, so its text wraps and stacks at the browser's natural metric
     * for this font. Restoring `normal` here, scoped to this direction's
     * root, is what makes every unspecified line-height below match the
     * original pixel for pixel instead of drifting taller line by line. */
    line-height: normal;
    height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    background: var(--bg);
    color: var(--ink);
    font-family: 'Bricolage Grotesque Variable', 'Bricolage Grotesque', sans-serif;
  }
  .sb :global(a) {
    color: var(--blue);
  }
  .sb :global(a:hover) {
    color: var(--ink);
  }

  /* ── Header ── */
  header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 18px 28px 10px;
    flex-wrap: wrap;
  }
  .mark {
    display: block;
    mix-blend-mode: multiply;
  }
  h1 {
    margin: 0;
    font-size: 34px;
    font-weight: 800;
    letter-spacing: -0.03em;
  }
  .scope {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-left: 18px;
    flex-wrap: wrap;
  }
  .chip {
    font: inherit;
    font-size: 13px;
    font-weight: 500;
    padding: 7px 12px;
    border-radius: 999px;
    border: 1.5px solid var(--line);
    background: transparent;
    color: inherit;
    cursor: pointer;
    white-space: nowrap;
  }
  .chip:hover {
    border-color: var(--ink);
  }
  .chip.on {
    background: var(--ink);
    border-color: var(--ink);
    color: #fff;
  }
  .chip:focus-visible {
    outline: 2px solid var(--blue);
    outline-offset: 2px;
  }
  /* The "+N more groups" select comes from the shared GroupScope. */
  .scope :global(select) {
    font: inherit;
    font-size: 12px;
    background: transparent;
    color: inherit;
    border: 0;
    padding: 4px 6px;
    cursor: pointer;
  }
  /* D.jsx's "+ Add resource" button carries an inline marginLeft:12 on top
   * of header's own 16px gap; this class is that same offset, scoped so it
   * never collides with a UnoCSS utility name (D12). */
  .first {
    margin-left: 12px;
  }
  .k-me {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 13px;
    white-space: nowrap;
  }
  .meta {
    font: inherit;
    font-size: 13px;
    border: 0;
    background: none;
    padding: 2px 0;
    color: var(--mute);
    cursor: pointer;
  }
  .meta:hover {
    color: var(--ink);
  }
  .meta:focus-visible {
    outline: 2px solid var(--blue);
    outline-offset: 2px;
  }
  .meta.offline {
    color: var(--amber);
  }
  .mono {
    font-family: 'DM Mono', monospace;
  }
  .who {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--ink);
  }
  .reset {
    text-decoration: underline;
  }

  .sub {
    margin: 0;
    padding: 0 28px 14px;
    max-width: 980px;
    font-size: 15px;
    color: var(--ink2);
  }

  /* ── Board: three derived lanes and the activity column ── */
  .board {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    /* No align-items: the original relies on Grid's default `stretch`, so a
     * lane with fewer cards still shows its full-height card outline. */
    gap: 14px;
    padding: 0 28px 72px;
  }
  .col {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 14px;
    background: #fff;
    border: 1.5px solid var(--line);
    border-radius: 18px;
  }
  .ch {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 2px 4px 6px;
  }
  .ch b {
    font-size: 17px;
    font-weight: 700;
    letter-spacing: -0.01em;
    white-space: nowrap;
  }
  .ch .n {
    margin-left: auto;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    font-weight: 500;
    color: var(--mute);
  }
  .sw {
    width: 12px;
    height: 12px;
    border-radius: 4px;
  }
  .empty {
    padding: 16px 6px;
    text-align: center;
    font-size: 13px;
    color: var(--mute);
    border: 1.5px dashed var(--line);
    border-radius: 14px;
  }

  /* ── Buttons shared by the header, the cards and the drawer ── */
  .sb :global(.take) {
    font: 700 13px 'Bricolage Grotesque Variable', 'Bricolage Grotesque', sans-serif;
    padding: 7px 12px;
    border-radius: 999px;
    background: var(--ink);
    color: #fff;
    border: 1.5px solid var(--ink);
    cursor: pointer;
    white-space: nowrap;
  }
  .sb :global(.take:hover) {
    background: var(--blue);
    border-color: var(--blue);
  }
  .sb :global(.take.ghost) {
    background: transparent;
    color: var(--ink);
    border-color: rgba(16, 20, 24, 0.25);
  }
  .sb :global(.take.ghost:hover) {
    border-color: var(--ink);
  }
  .sb :global(.take:focus-visible) {
    outline: 2px solid var(--blue);
    outline-offset: 2px;
  }

  @media (max-width: 1100px) {
    .board {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 640px) {
    header,
    .sub {
      padding-left: 16px;
      padding-right: 16px;
    }
    .board {
      grid-template-columns: minmax(0, 1fr);
      padding: 0 16px 72px;
    }
    .scope,
    .first {
      margin-left: 0;
    }
  }
</style>
