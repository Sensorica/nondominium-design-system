<script lang="ts">
  // The spec sheet: the left column of C Instrument. Stage, ownership, type
  // and use; the rules; the items with their holders; what needs attention;
  // and the requests on this resource. Status LEDs use the design system's
  // lifecycle and operational-state colours (registry/ndo-badge.svelte).
  import { proto } from '$lib/prototypes/store/store.svelte';
  import type { Signal } from '$lib/prototypes/store/logic';
  import { plain } from '$lib/prototypes/plain';
  import { AgentAvatar, ErrorNote, modals } from '$lib/prototypes/ui';

  let { id }: { id: string } = $props();

  const n = $derived(proto.q.ndo(id)!);
  const rules = $derived(proto.s.rules[id] ?? []);
  const items = $derived(proto.s.instances[id] ?? []);
  const signals = $derived(proto.q.signalsOf(id));
  const requests = $derived(proto.q.commitmentsOf(id));
  const openRequests = $derived(requests.filter((c) => c.status === 'open').length);

  /** The last failed pick-up, shown under the list it came from. */
  let failed = $state<{ ndo: string; error: string } | null>(null);
  const error = $derived(failed?.ndo === id ? failed.error : null);

  function pickUp(sig: Signal) {
    const r = proto.actions.pickUp(sig);
    failed = r.ok ? null : { ndo: id, error: r.error };
  }
</script>

<aside class="spec">
  <p class="lbl">Shared resource</p>
  <h1>{n.name}</h1>
  {#if proto.dev}<p class="hash">#{n.hash}…</p>{/if}

  <table>
    <tbody>
      <tr>
        <td>stage</td>
        <td>
          <span class="led stage-{n.stage}"></span><b>{plain(n.stage)}</b>
          <button type="button" class="lnk" onclick={() => modals.open({ type: 'advance', ndo: id })}>change</button>
        </td>
      </tr>
      <tr><td>ownership</td><td><b>{plain(n.regime)}</b></td></tr>
      <tr><td>type</td><td><b>{plain(n.nature)}</b></td></tr>
      <tr><td>use</td><td>{plain(n.rivalry)}</td></tr>
    </tbody>
  </table>

  <p class="lbl">Rules</p>
  <table>
    <tbody>
      {#each rules as [type, summary], i (i)}
        <tr><td>{plain(type)}</td><td>{plain(summary)}</td></tr>
      {:else}
        <tr><td colspan="2" class="none">no rules yet</td></tr>
      {/each}
    </tbody>
  </table>
  <button type="button" class="lnk lnk--solo" onclick={() => modals.open({ type: 'rule', ndo: id })}>+ add rule</button>

  <p class="lbl lbl--gap">
    Items
    <button type="button" class="lnk" onclick={() => modals.open({ type: 'resources', ndo: id })}>who holds them</button>
  </p>
  {#each items as [label, state, holder], i (i)}
    <div class="inst">
      <span>
        {label}<br />
        <small class="holder"><AgentAvatar id={holder} size={14} />custodian {proto.q.agent(holder)}</small>
      </span>
      <small><span class="led op-{state}"></span>{plain(state)}</small>
    </div>
  {:else}
    <p class="hash">no items yet</p>
  {/each}

  <p class="lbl lbl--gap">Needs attention · {signals.length}</p>
  {#each signals as g (g.id)}
    <div class="sg">
      <div>
        <b>{g.title}</b>
        <small>
          {#if g.progress}{g.progress[0]}/{g.progress[1]} · {/if}
          <button type="button" class="lnk" onclick={() => modals.open({ type: 'why', sig: g, ndo: id })}>why?</button>
        </small>
      </div>
      <button type="button" class="btn btn--sm" onclick={() => pickUp(g)}>{g.verb}</button>
    </div>
  {/each}
  <ErrorNote {error} />

  <p class="lbl lbl--gap">Requests · {openRequests} open</p>
  {#each requests as c (c.id)}
    <div class="sg" class:sg--done={c.status !== 'open'}>
      <div>
        <b>{plain(c.action)}</b>
        <small>{proto.q.agent(c.provider)} → {proto.q.agent(c.receiver)} · {c.status === 'open' ? 'waiting' : 'done'}</small>
      </div>
      {#if c.status === 'open'}
        <button type="button" class="btn btn--sm" onclick={() => modals.open({ type: 'commitments', ndo: id })}>Mark done</button>
      {/if}
    </div>
  {/each}

  <div class="actions">
    <button type="button" class="btn btn--ghost" onclick={() => modals.open({ type: 'commit', ndo: id })}>Ask to borrow</button>
    <button type="button" class="btn btn--ghost" onclick={() => modals.open({ type: 'note', ndo: id })}>Log work</button>
  </div>
</aside>

<style>
  .spec {
    background: rgb(var(--ndo-color-card-bg));
    border-right: 1px solid var(--ndo-color-border);
    /* The bottom pad keeps the last buttons clear of the layout's exit chip. */
    padding: 18px 18px 64px;
    overflow: auto;
    font-size: var(--ndo-text-xs);
  }
  .lbl {
    margin: 0;
    font-family: var(--ndo-font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--ndo-color-text-muted);
  }
  .lbl--gap {
    margin: 16px 0 8px;
  }
  .lbl .lnk {
    text-transform: none;
    letter-spacing: 0;
  }
  h1 {
    margin: 6px 0 4px;
    font-size: 22px;
    line-height: 1.2;
    font-weight: var(--ndo-weight-semibold);
    letter-spacing: -0.01em;
  }
  .hash {
    margin: 0 0 16px;
    font-family: var(--ndo-font-mono);
    font-size: 11px;
    color: var(--ndo-color-text-muted);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0 12px;
  }
  td {
    padding: 7px 0;
    border-top: 1px solid var(--ndo-color-border);
    vertical-align: top;
  }
  td:first-child {
    width: 42%;
    font-family: var(--ndo-font-mono);
    font-size: 11px;
    color: var(--ndo-color-text-muted);
  }
  td.none {
    width: auto;
  }
  td b {
    font-weight: var(--ndo-weight-semibold);
  }

  .lnk.lnk {
    margin-left: 4px;
    padding: 0;
    border: none;
    background: none;
    font-family: var(--ndo-font-mono);
    font-size: 11px;
    color: var(--ndo-color-link);
    text-decoration: underline;
    cursor: pointer;
  }
  .lnk.lnk--solo {
    margin-left: 0;
  }
  .lnk.lnk:focus-visible,
  .btn.btn:focus-visible {
    outline: none;
    box-shadow: var(--ndo-focus-ring);
  }

  .inst {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 8px;
    padding: 8px 10px;
    margin-bottom: 6px;
    border: 1px solid var(--ndo-color-border);
    border-radius: var(--ndo-radius-sm);
  }
  .inst small {
    font-family: var(--ndo-font-mono);
    font-size: 11px;
    color: var(--ndo-color-text-muted);
    white-space: nowrap;
  }
  .holder {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 2px;
  }

  .sg {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 8px 10px;
    margin-bottom: 6px;
    border: 1px solid rgb(var(--ndo-amber-100));
    background: rgb(var(--ndo-amber-50));
    border-radius: var(--ndo-radius-sm);
  }
  .sg--done {
    border-color: var(--ndo-color-border);
    background: var(--ndo-color-surface);
  }
  .sg b {
    display: block;
    font-weight: var(--ndo-weight-semibold);
  }
  .sg small {
    font-family: var(--ndo-font-mono);
    font-size: 11px;
    color: var(--ndo-color-text-muted);
  }
  .sg .lnk.lnk {
    margin-left: 0;
  }
  .sg .btn {
    margin-left: auto;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 14px;
  }
  .btn.btn {
    font-family: var(--ndo-font-sans);
    font-size: var(--ndo-text-xs);
    font-weight: var(--ndo-weight-semibold);
    padding: 8px 12px;
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
  .btn.btn--sm {
    padding: 5px 9px;
    font-size: 11px;
  }
  .btn.btn--ghost {
    background: rgb(var(--ndo-color-card-bg));
    color: var(--ndo-color-text-primary);
    border-color: var(--ndo-color-border-strong);
  }
  .btn.btn--ghost:hover {
    background: var(--ndo-color-surface);
  }

  /* ── LEDs ── Lifecycle families and operational-state dots, both from the
     design system's badge variants. */
  .led {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 6px;
    background: rgb(var(--ndo-gray-400));
  }
  .stage-Ideation { background: rgb(var(--ndo-gray-500)); }
  .stage-Specification,
  .stage-Development { background: rgb(var(--ndo-indigo-700)); }
  .stage-Prototype { background: rgb(var(--ndo-amber-600)); }
  .stage-Stable { background: rgb(var(--ndo-green-600)); }
  .stage-Distributed { background: rgb(var(--ndo-teal-700)); }
  .stage-Active { background: rgb(var(--ndo-emerald-600)); }
  .stage-Hibernating { background: rgb(var(--ndo-yellow-700)); }
  .stage-Deprecated { background: rgb(var(--ndo-orange-600)); }
  .stage-EndOfLife { background: rgb(var(--ndo-red-600)); }

  .op-Available { background: rgb(var(--ndo-green-600)); }
  .op-Reserved { background: rgb(var(--ndo-blue-600)); }
  .op-InTransit { background: rgb(var(--ndo-indigo-700)); }
  .op-InStorage { background: rgb(var(--ndo-teal-700)); }
  .op-InMaintenance { background: rgb(var(--ndo-amber-600)); }
  .op-InUse { background: rgb(var(--ndo-violet-700)); }
  .op-PendingValidation { background: rgb(var(--ndo-gray-400)); }
</style>
