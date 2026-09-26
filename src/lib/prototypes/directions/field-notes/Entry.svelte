<script lang="ts">
  // The centre page for one NDO (FnEntry in B.jsx): its stamp, then four tabs.
  // The tab is the direction's view, so each one is a linkable surface.
  import { proto } from '$lib/prototypes/store/store.svelte';
  import { AgentAvatar, modals } from '$lib/prototypes/ui';
  import { plain, friendly, stageLabel, developer } from '$lib/prototypes/plain';
  import { fmtAgo, freshness, NO_ITEM_STAGES } from '$lib/prototypes/store/logic';
  import type { ViewOf } from '$lib/prototypes/directions';

  type Tab = ViewOf<'field-notes'>;

  let { id, view, onview }: { id: string | null; view: Tab; onview: (tab: Tab) => void } = $props();

  const TABS: [Tab, string][] = [
    ['trail', 'The trail'],
    ['rules', 'Rules & items'],
    ['requests', 'Requests'],
    ['linked', 'Linked']
  ];

  const n = $derived(proto.q.ndo(id));
  const traces = $derived(n ? proto.q.tracesOf(n.id) : []);
  const opener = $derived(n ? n.initiator || traces[traces.length - 1]?.agent : undefined);
  const rules = $derived(n ? (proto.s.rules[n.id] ?? []) : []);
  const items = $derived(n ? (proto.s.instances[n.id] ?? []) : []);
  const requests = $derived(n ? proto.q.commitmentsOf(n.id) : []);
  const links = $derived(n ? proto.q.hardLinksOf(n.id) : []);

  function when(ago: number, status: string): string {
    if (status !== 'validated') return stageLabel(status as Parameters<typeof stageLabel>[0], $developer);
    return ago < 1 ? 'just now' : fmtAgo(ago) + ' ago';
  }
</script>

<main class="page">
  {#if !n}
    <div class="kick">The register</div>
    <h1>{proto.s.ndos.length ? 'Pick an entry' : 'An empty register'}</h1>
    <p class="lede">
      {proto.s.ndos.length
        ? 'Choose an NDO from the index on the left.'
        : 'NDOs are scoped to groups. Open a new entry, or join a group with an invite link.'}
    </p>
    <div class="row">
      <button type="button" class="btn" onclick={() => modals.open({ type: 'create' })}>Open a new entry</button>
      <button type="button" class="btn" onclick={() => modals.open({ type: 'join' })}>→ Join group</button>
    </div>
  {:else}
    <div class="kick opened">
      <span>Entry № <span class="mono">{n.hash}</span> · opened by</span>
      {#if opener}
        <AgentAvatar id={opener} size={16} />
        <span>{proto.q.agent(opener)}</span>
      {/if}
    </div>
    <h1>{n.name}</h1>
    <p class="lede">{n.desc || 'No description yet.'}</p>

    <dl class="stamp">
      <div><dt>Stage</dt><dd>{plain(n.stage)}</dd></div>
      <div><dt>Ownership</dt><dd>{plain(n.regime)}</dd></div>
      <div><dt>Type</dt><dd>{plain(n.nature)}</dd></div>
      <div><dt>Use</dt><dd>{plain(n.rivalry)}</dd></div>
    </dl>

    <nav class="tabs" aria-label="Entry sections">
      {#each TABS as [k, label] (k)}
        <button type="button" class="tab" class:on={view === k} aria-current={view === k ? 'page' : undefined} onclick={() => onview(k)}>
          {label}
        </button>
      {/each}
      <span class="acts">
        <button type="button" class="act" onclick={() => modals.open({ type: 'note', ndo: n.id })}>Log work</button>
        <button type="button" class="act" onclick={() => modals.open({ type: 'advance', ndo: n.id })}>Turn the page (lifecycle)</button>
      </span>
    </nav>

    {#if view === 'trail'}
      <div class="trail">
        {#each traces as t (t.id)}
          {@const f = freshness(t.ago)}
          <div class="ev" class:fresh={f === 'fresh' || t.status !== 'validated'} style:opacity={f === 'cold' ? 0.5 : f === 'fading' ? 0.75 : 1}>
            <div>
              <h4><AgentAvatar id={t.agent} size={20} /><span>{proto.q.agent(t.agent)} {t.text}</span></h4>
              <span class="when">{when(t.ago, t.status)}{t.hops.length ? ' · reached you via ' + t.hops.join(' → ') : ''}</span>
            </div>
            <div>
              {#if t.note}
                <div class="margin">“{t.note}”<small>{proto.q.agent(t.agent)}, note on this trace</small></div>
              {/if}
            </div>
          </div>
        {:else}
          <p class="lede">No traces yet. Be the first to leave one.</p>
        {/each}
      </div>
    {:else if view === 'rules'}
      <div class="two">
        <section>
          <h3 class="h3">Rules in force</h3>
          {#each rules as [type, summary], i (i)}
            <div class="sl"><span>{plain(type)}</span><span>{plain(summary)}</span></div>
          {:else}
            <p class="foot">No governance rules. Default regime behaviour applies.</p>
          {/each}
        </section>
        <section>
          <h3 class="h3">Items</h3>
          {#each items as [label, state, holder], i (i)}
            <div class="sl"><span>{label}</span><span>{plain(state)} · {proto.q.agent(holder)}</span></div>
          {:else}
            <p class="foot">
              {NO_ITEM_STAGES.includes(n.stage) ? friendly('Instances cannot be added at stage ' + n.stage) : 'No items yet.'}
            </p>
          {/each}
        </section>
      </div>
      <div class="row">
        <button type="button" class="btn" onclick={() => modals.open({ type: 'rule', ndo: n.id })}>Add a rule</button>
        <button type="button" class="btn" onclick={() => modals.open({ type: 'resources', ndo: n.id })}>Items & holders</button>
      </div>
    {:else if view === 'requests'}
      <div>
        {#each requests as c (c.id)}
          <div class="sl" class:done={c.status !== 'open'}>
            <span>{plain(c.action)} · {proto.q.agent(c.provider)} → {proto.q.agent(c.receiver)}{c.note ? ' · ' + c.note : ''}</span>
            <span>{c.status === 'open' ? 'waiting' : 'done'}</span>
          </div>
        {:else}
          <p class="foot">No requests yet.</p>
        {/each}
        <div class="row">
          <button type="button" class="btn" onclick={() => modals.open({ type: 'commit', ndo: n.id })}>Ask to borrow or receive</button>
          <button type="button" class="btn" onclick={() => modals.open({ type: 'commitments', ndo: n.id })}>Mark done…</button>
        </div>
      </div>
    {:else}
      <div>
        {#each links as h, i (i)}
          {@const other = proto.q.ndo(h.from === n.id ? h.to : h.from)}
          <div class="sl">
            <span>{other?.name ?? ''}</span>
            <span>{plain(h.type)} · {h.from === n.id ? 'outgoing' : 'incoming'}</span>
          </div>
        {:else}
          <p class="foot">No hard links. Link a component, a source it derives from, or an NDO it supersedes.</p>
        {/each}
        <div class="row">
          <button type="button" class="btn" onclick={() => modals.open({ type: 'attach', ndo: n.id })}>Link to another NDO</button>
        </div>
      </div>
    {/if}
  {/if}
</main>

<style>
  .page {
    min-height: 0;
    overflow: auto;
    padding: 34px 52px;
  }

  .kick {
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--fn-mute);
  }
  .opened {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
  }
  .mono {
    font-family: var(--ndo-font-mono);
    letter-spacing: 0;
    text-transform: none;
  }

  h1 {
    margin: 10px 0 14px;
    font-size: 46px;
    font-weight: var(--ndo-weight-medium);
    line-height: 1.05;
    letter-spacing: -0.02em;
  }
  .lede {
    max-width: 600px;
    margin: 0 0 22px;
    font-size: var(--ndo-text-lg);
    font-style: italic;
    line-height: 1.45;
    color: var(--fn-ink2);
  }

  .stamp {
    display: flex;
    flex-wrap: wrap;
    max-width: 100%;
    width: fit-content;
    margin: 0 0 24px;
    border: 1.5px solid var(--fn-ink);
  }
  .stamp > div {
    flex: 1 1 auto;
    padding: 8px 14px;
    border-right: 1px solid var(--fn-ink);
  }
  .stamp > div:last-child {
    border-right: 0;
  }
  dt {
    font-size: 9px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--fn-mute);
  }
  dd {
    margin: 0;
    font-size: 15px;
    font-weight: var(--ndo-weight-medium);
  }

  .tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 18px;
    margin-bottom: 20px;
    border-bottom: 1px solid var(--fn-rule);
  }
  .tab,
  .act {
    margin-bottom: -1px;
    padding: 8px 0;
    border: 0;
    border-bottom: 2px solid transparent;
    background: none;
    font-family: inherit;
    font-size: 13px;
    white-space: nowrap;
    cursor: pointer;
  }
  .tab {
    color: var(--fn-mute);
  }
  .tab:hover {
    color: var(--fn-ink);
  }
  .tab.on {
    color: var(--fn-ink);
    border-bottom-color: var(--fn-ink);
    font-weight: var(--ndo-weight-semibold);
  }
  .acts {
    display: flex;
    flex-wrap: wrap;
    gap: 18px;
    margin-left: auto;
  }
  .act {
    color: var(--fn-teal);
  }
  .act:hover {
    color: var(--fn-ink);
  }

  .trail {
    position: relative;
    padding-left: 26px;
  }
  .trail::before {
    content: '';
    position: absolute;
    left: 6px;
    top: 6px;
    bottom: 6px;
    width: 1.5px;
    background: linear-gradient(var(--fn-ink), var(--fn-rule));
  }
  .ev {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 220px;
    gap: 24px;
    padding: 0 0 18px;
    transition: opacity 400ms;
  }
  .ev::before {
    content: '';
    position: absolute;
    left: -24px;
    top: 6px;
    width: 9px;
    height: 9px;
    border: 1.5px solid var(--fn-ink);
    border-radius: 50%;
    background: var(--fn-paper);
  }
  .ev.fresh::before {
    border-color: var(--fn-teal);
    background: var(--fn-teal);
  }
  h4 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-size: var(--ndo-text-base);
    font-weight: var(--ndo-weight-medium);
  }
  .when {
    font-size: 11px;
    color: var(--fn-mute);
  }
  .margin {
    padding-left: 10px;
    border-left: 1px solid var(--fn-rust);
    font-size: var(--ndo-text-sm);
    font-style: italic;
    line-height: 1.4;
    color: var(--fn-rust);
  }
  .margin small {
    display: block;
    margin-top: 2px;
    font-size: 11px;
    font-style: normal;
    color: var(--fn-mute);
  }

  .two {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }
  .h3 {
    margin: 0 0 8px;
    font-size: var(--ndo-text-lg);
    font-weight: var(--ndo-weight-medium);
  }
  .sl {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 7px 0;
    border-bottom: 1px dotted var(--fn-rule);
    font-size: 13px;
  }
  .sl span:last-child {
    color: var(--fn-mute);
    text-align: right;
  }
  .sl.done {
    opacity: 0.5;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 14px;
  }
  .btn {
    padding: 9px 14px;
    border: 0;
    border-radius: var(--ndo-radius-sm);
    background: rgb(var(--ndo-gray-900));
    color: rgb(255 255 255);
    font-family: inherit;
    font-size: 13px;
    font-weight: var(--ndo-weight-medium);
    white-space: nowrap;
    cursor: pointer;
  }
  .btn:hover {
    background: var(--fn-teal);
  }
  button:focus-visible {
    outline: none;
    box-shadow: var(--ndo-focus-ring);
  }

  .foot {
    font-size: 11px;
    line-height: 1.6;
    color: var(--fn-mute);
  }

  @media (max-width: 1180px) {
    .page {
      grid-column: 2;
      grid-row: 1;
      overflow: visible;
      padding: 28px;
    }
    h1 {
      font-size: 36px;
    }
    .ev,
    .two {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
