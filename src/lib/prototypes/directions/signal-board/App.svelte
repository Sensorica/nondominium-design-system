<script lang="ts">
  // D · Signal Board. A board of what needs doing, derived from the data and
  // never assigned by anyone: three lanes of signals (Needs hands, Available
  // now, Needs eyes) plus a "Just happened" column of recent traces. Group
  // scope chips narrow the board; a card opens its resource in a drawer.
  //
  // Views (contract: src/lib/prototypes/README.md):
  //   board    the default, bare URL; `?group=` pins the scope
  //   drawer   `?view=drawer&ndo=…` opens that resource over the board
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
  const recent = $derived(
    proto.s.traces
      .filter((t) => inScope(t.ndo) && t.ago < RECENT_MINUTES)
      .sort((a, b) => a.ago - b.ago)
      .slice(0, RECENT_MAX)
  );
</script>

<div class="sb">
  <header>
    <img class="mark" src={paths.logoMark()} alt="" width="36" height="36" />
    <h1>Signals</h1>
    <div class="scope">
      <GroupScope value={scope} onchange={setScope} allLabel="All my groups">
        {#snippet chip(c)}
          <button type="button" class="chip" class:on={c.on} aria-pressed={c.on} onclick={c.select}>{c.label}</button>
        {/snippet}
      </GroupScope>
    </div>
    <div class="adds">
      <button type="button" class="take ghost" onclick={() => modals.open({ type: 'create', after: setOpen })}>+ Add resource</button>
      <button type="button" class="take ghost" onclick={() => modals.open({ type: 'group', after: setScope })}>+ Group</button>
      <FlowMenu ndo={open} onOpen={setOpen} onGroup={setScope} />
    </div>
    <div class="me">
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
        <div class="ch"><span class="sw" style:background="rgb(var({l.tone}))"></span><b>{l.label}</b><span class="n">{l.list.length}</span></div>
        {#each l.list as g (g.id)}
          <SignalCard sig={g} tone={l.tone} onopen={setOpen} />
        {:else}
          <div class="empty">Nothing here right now.</div>
        {/each}
      </section>
    {/each}
    <section class="col" aria-label="Just happened">
      <div class="ch"><span class="sw" style:background="rgb(var({HAPPENED_TONE}))"></span><b>Just happened</b><span class="n">live</span></div>
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
  .sb {
    --proto-bg: rgb(var(--ndo-color-card-bg));
    --proto-radius: var(--ndo-radius-xl);
    height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    background: var(--ndo-color-bg-app);
    color: var(--ndo-color-text-primary);
    font-family: var(--ndo-font-sans);
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
    border-radius: var(--ndo-radius-md);
  }
  h1 {
    margin: 0;
    font-size: var(--ndo-text-3xl);
    font-weight: var(--ndo-weight-bold);
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
    font-weight: var(--ndo-weight-medium);
    padding: 6px 12px;
    border-radius: var(--ndo-radius-pill);
    border: 1px solid var(--ndo-color-border-strong);
    background: transparent;
    color: inherit;
    cursor: pointer;
    white-space: nowrap;
    transition: var(--ndo-transition-colors);
  }
  .chip:hover {
    border-color: var(--ndo-color-text-primary);
  }
  .chip.on {
    background: var(--ndo-color-text-primary);
    border-color: var(--ndo-color-text-primary);
    color: rgb(var(--ndo-color-text-inverse));
  }
  .chip:focus-visible {
    outline: none;
    box-shadow: var(--ndo-focus-ring);
  }
  /* The "+N more groups" select comes from the shared GroupScope. */
  .scope :global(select) {
    font-size: 13px;
    padding: 6px 10px;
    border-radius: var(--ndo-radius-pill);
    border: 1px dashed var(--ndo-color-border-strong);
  }
  .adds {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: 12px;
  }
  .me {
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
    color: var(--ndo-color-text-muted);
    cursor: pointer;
    border-radius: var(--ndo-radius-sm);
  }
  .meta:hover {
    color: var(--ndo-color-text-primary);
  }
  .meta:focus-visible {
    outline: none;
    box-shadow: var(--ndo-focus-ring);
  }
  .meta.offline {
    color: rgb(var(--ndo-amber-600));
  }
  .mono {
    font-family: var(--ndo-font-mono);
  }
  .who {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--ndo-color-text-primary);
  }
  .reset {
    text-decoration: underline;
  }

  .sub {
    margin: 0;
    padding: 0 28px 14px;
    max-width: 980px;
    font-size: 15px;
    color: var(--ndo-color-text-secondary);
  }

  /* ── Board: three derived lanes and the activity column ── */
  .board {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    align-items: start;
    gap: 14px;
    padding: 0 28px 72px;
  }
  .col {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 14px;
    background: rgb(var(--ndo-color-card-bg));
    border: 1px solid var(--ndo-color-border);
    border-radius: var(--ndo-radius-xl);
    box-shadow: var(--ndo-shadow-sm);
  }
  .ch {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 2px 4px 6px;
  }
  .ch b {
    font-size: 17px;
    font-weight: var(--ndo-weight-bold);
    letter-spacing: -0.01em;
    white-space: nowrap;
  }
  .ch .n {
    margin-left: auto;
    font-family: var(--ndo-font-mono);
    font-size: var(--ndo-text-xs);
    color: var(--ndo-color-text-muted);
  }
  .sw {
    width: 12px;
    height: 12px;
    border-radius: var(--ndo-radius-sm);
  }
  .empty {
    padding: 16px 6px;
    text-align: center;
    font-size: 13px;
    color: var(--ndo-color-text-muted);
    border: 1px dashed var(--ndo-color-border-strong);
    border-radius: var(--ndo-radius-xl);
  }

  /* ── Buttons shared by the header, the cards and the drawer ── */
  .sb :global(.take) {
    font: inherit;
    font-size: 13px;
    font-weight: var(--ndo-weight-semibold);
    line-height: 1.2;
    padding: 7px 12px;
    border-radius: var(--ndo-radius-md);
    border: 1px solid rgb(var(--ndo-blue-600));
    background: rgb(var(--ndo-blue-600));
    color: rgb(255 255 255);
    cursor: pointer;
    white-space: nowrap;
    transition: var(--ndo-transition-colors);
  }
  .sb :global(.take:hover) {
    background: rgb(var(--ndo-blue-700));
    border-color: rgb(var(--ndo-blue-700));
  }
  .sb :global(.take.ghost) {
    background: transparent;
    color: var(--ndo-color-text-primary);
    border-color: var(--ndo-color-border-strong);
  }
  .sb :global(.take.ghost:hover) {
    background: rgb(var(--ndo-gray-500) / 0.12);
    border-color: var(--ndo-color-text-primary);
  }
  .sb :global(.take:focus-visible) {
    outline: none;
    box-shadow: var(--ndo-focus-ring);
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
    .adds {
      margin-left: 0;
    }
  }
</style>
