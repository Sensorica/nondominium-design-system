<script lang="ts">
  // The 380px detail panel (A.jsx MyPanel): title, badges, 28-day activity
  // bars, the actions, signals on this resource, its traces and its linked
  // resources.
  import { proto } from '../../store/store.svelte';
  import { plain } from '../../plain';
  import { modals } from '../../ui';
  import SignalCard from './SignalCard.svelte';
  import TraceRow from './TraceRow.svelte';
  import { activityBars } from './field';

  interface Props {
    id: string;
    decay: number;
    onclose: () => void;
  }

  let { id, decay, onclose }: Props = $props();

  const n = $derived(proto.q.ndo(id)!);
  const traces = $derived(proto.q.tracesOf(id));
  const signals = $derived(proto.q.signalsOf(id));
  const links = $derived(proto.q.hardLinksOf(id));
  const openRequests = $derived(proto.q.commitmentsOf(id).filter((c) => c.status === 'open').length);
  const bars = $derived(activityBars(traces));
  const peak = $derived(Math.max(1, ...bars));

  const other = (h: { from: string; to: string }) => (h.from === id ? h.to : h.from);
</script>

<aside class="panel" aria-label={n.name}>
  <div class="head">
    <div class="kick">Shared resource{proto.dev ? ' · ' + n.hash : ''}</div>
    <button type="button" class="x" onclick={onclose} aria-label="Close">✕</button>
  </div>
  <h1>{n.name}</h1>
  <div class="tags">
    <span class="tag tag--stage">{plain(n.stage)}</span>
    <span class="tag tag--regime">{plain(n.regime)}</span>
    <span class="tag">{plain(n.nature)}</span>
    <span class="tag">{plain(n.rivalry)}</span>
  </div>
  {#if n.desc}<p class="desc">{n.desc}</p>{/if}

  <div class="kick">Trail strength · 28 days</div>
  <div class="strength" role="img" aria-label="{traces.length} traces over the last 28 days, oldest on the left">
    {#each bars as b, i (i)}
      <span style:height="{Math.max(6, (b / peak) * 100)}%" style:opacity={b ? 0.4 + i / 22 : 0.12}></span>
    {/each}
  </div>
  <div class="row"><span>fading</span><span>fresh</span></div>

  <div class="acts">
    <button type="button" onclick={() => modals.open({ type: 'note', ndo: id })}>Log work</button>
    <button type="button" onclick={() => modals.open({ type: 'advance', ndo: id })}>Lifecycle</button>
    <button type="button" onclick={() => modals.open({ type: 'resources', ndo: id })}>Items &amp; holders</button>
    <button type="button" onclick={() => modals.open({ type: 'commitments', ndo: id })}>Requests · {openRequests}</button>
    <button type="button" onclick={() => modals.open({ type: 'rule', ndo: id })}>+ Rule</button>
  </div>

  <section class="sec">
    <h3>Signals on this resource <span>{signals.length} open</span></h3>
    {#each signals as g (g.id)}
      <SignalCard {g} />
    {:else}
      <p class="empty">No open signals. The resource is quiet.</p>
    {/each}
  </section>

  <section class="sec">
    <h3>Traces <span>{traces.length}</span></h3>
    {#each traces.slice(0, 8) as t (t.id)}
      <TraceRow {t} {decay} />
    {:else}
      <p class="empty">No traces yet.</p>
    {/each}
  </section>

  <section class="sec">
    <h3>Linked resources <span>{links.length}</span></h3>
    <div class="slots">
      {#each links as h, i (i)}
        <span class="slot">{plain(h.type)} {h.from === id ? '→' : '←'} {proto.q.ndo(other(h))?.name ?? ''}</span>
      {/each}
      <button type="button" class="slot slot--add" onclick={() => modals.open({ type: 'attach', ndo: id })}>+ link resource</button>
    </div>
  </section>
</aside>

<style>
  .panel {
    border-left: 1px solid var(--line);
    background: var(--bg2);
    overflow: auto;
    padding: 22px;
    min-height: 0;
  }
  .head {
    display: flex;
    align-items: center;
  }
  .kick {
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--dim);
  }
  .x {
    margin-left: auto;
    background: none;
    border: 0;
    color: var(--dim);
    cursor: pointer;
    font-size: 14px;
  }
  .x:hover {
    color: var(--ink);
  }
  h1 {
    font-size: 24px;
    line-height: 1.15;
    margin: 6px 0 10px;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  /* A.jsx's own .tag / .tag.l / .tag.r, verbatim: filled teal tint for the
     Layer 0 stage, dashed blue outline for the ownership model, plain
     outline for the rest. */
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 12px;
  }
  .tag {
    font-size: 11px;
    padding: 3px 8px;
    border-radius: 999px;
    border: 1px solid var(--line);
    color: var(--mute);
    white-space: nowrap;
  }
  .tag--stage {
    color: var(--teal);
    border-color: #1f4a47;
    background: #0f2826;
  }
  .tag--regime {
    border-style: dashed;
    color: #8fb0ff;
    border-color: #35508a;
  }
  .desc {
    font-size: 13px;
    color: var(--mute);
    margin: 0 0 14px;
    line-height: 1.5;
  }

  .strength {
    display: flex;
    align-items: flex-end;
    gap: 3px;
    height: 36px;
    margin: 6px 0 4px;
  }
  .strength span {
    flex: 1;
    background: var(--teal);
    border-radius: 2px 2px 0 0;
    transition: height 500ms;
  }
  .row {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: var(--dim);
  }

  .acts {
    display: flex;
    gap: 8px;
    margin-top: 16px;
    flex-wrap: wrap;
  }
  .acts button {
    font: 500 12px 'Instrument Sans', sans-serif;
    white-space: nowrap;
    padding: 6px 12px;
    border-radius: 999px;
    border: 1px solid #2a4a4a;
    background: transparent;
    color: var(--teal);
    cursor: pointer;
  }
  .acts button:hover {
    background: #12302e;
  }

  .sec {
    margin-top: 20px;
  }
  h3 {
    font-size: 12px;
    font-weight: 600;
    margin: 0 0 10px;
    color: var(--mute);
    display: flex;
    justify-content: space-between;
  }
  .empty {
    margin: 0;
    font-size: 12px;
    color: var(--dim);
    padding: 10px 0;
  }

  .slots {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .slot {
    font: inherit;
    font-size: 11px;
    padding: 5px 9px;
    border-radius: 6px;
    background: #0e1618;
    border: 1px solid var(--line);
    color: var(--mute);
    text-align: left;
  }
  .slot--add {
    border-style: dashed;
    color: var(--dim);
  }
  .slot--add:hover {
    color: var(--teal);
    border-color: var(--teal);
  }
  button:focus-visible {
    outline: none;
    box-shadow: var(--ndo-focus-ring);
  }
</style>
