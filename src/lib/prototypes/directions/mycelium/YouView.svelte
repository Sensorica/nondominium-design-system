<script lang="ts">
  // The You view (A.jsx `view === 'me'`): profile and roles, private receipts,
  // and your own traces.
  import { proto } from '../../store/store.svelte';
  import { plain } from '../../plain';
  import { AgentAvatar, modals } from '../../ui';
  import TraceRow from './TraceRow.svelte';

  let { decay }: { decay: number } = $props();

  const mine = $derived(proto.s.traces.filter((t) => t.agent === proto.me.id));
</script>

<div class="who">
  <AgentAvatar id={proto.me.id} size={52} ring />
  <h2>{proto.me.name}</h2>
</div>
<p class="lede">Roles: {proto.me.roles.map((r) => plain(r)).join(', ')}. Your traces live on your own source chain.</p>
<div class="btns">
  <button type="button" class="new" onclick={() => modals.open({ type: 'profile' })}>Edit profile &amp; roles</button>
  <button type="button" class="new new--ghost" onclick={() => modals.open({ type: 'receipts' })}>Reputation summary</button>
</div>

<section class="sec">
  <h3>Private participation receipts <span>{proto.s.receipts.length}</span></h3>
  {#each proto.s.receipts as r (r.id)}
    <div class="receipt">
      <span class="d"></span>
      <span>
        ◆ {r.text} · {proto.q.ndo(r.ndo)?.name ?? ''}
        {#if r.type}<em>{r.type}</em>{/if}
      </span>
      <span class="t">private</span>
    </div>
  {:else}
    <p class="empty">Pick up a “Needs hands” or “Needs eyes” signal to earn a receipt.</p>
  {/each}
</section>

<section class="sec">
  <h3>Your traces <span>{mine.length}</span></h3>
  {#each mine as t (t.id)}
    <TraceRow {t} {decay} showNdo />
  {:else}
    <p class="empty">Nothing yet. Every write you make leaves a trace here.</p>
  {/each}
</section>

<button type="button" class="new reset" onclick={() => proto.actions.reset()}>Reset prototype data</button>

<style>
  .who {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 6px;
  }
  h2 {
    font-size: 26px;
    margin: 0;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  .lede {
    color: var(--mute);
    font-size: 14px;
    margin: 0 0 18px;
  }
  .btns {
    display: flex;
    gap: 8px;
    margin: 4px 0 12px;
  }
  .new {
    font: 600 12px 'Instrument Sans', sans-serif;
    white-space: nowrap;
    padding: 8px 14px;
    border-radius: 999px;
    border: 0;
    background: var(--teal);
    color: #0b1113;
    cursor: pointer;
  }
  .new:hover {
    background: #5ad6ca;
  }
  /* The original inlines `background: transparent, border: 1px solid #2a4a4a`
     over the shared `.new` class for this one button (A.jsx `view === 'me'`);
     inline styles win the cascade even on :hover, so its background never
     changes. */
  .new--ghost {
    background: transparent;
    color: var(--teal);
    border: 1px solid #2a4a4a;
  }
  .new--ghost:hover {
    background: transparent;
  }
  .new:focus-visible {
    outline: none;
    box-shadow: var(--ndo-focus-ring);
  }
  .reset {
    margin-top: 20px;
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
  .receipt {
    display: grid;
    grid-template-columns: 10px 1fr auto;
    gap: 10px;
    font-size: 12px;
    padding: 6px 0;
  }
  .d {
    width: 6px;
    height: 6px;
    margin-top: 5px;
    border-radius: 50%;
    background: #8b5cf6;
  }
  em {
    display: block;
    font-style: normal;
    color: var(--dim);
  }
  .t {
    font-size: 11px;
    white-space: nowrap;
    color: var(--dim);
  }
  .empty {
    margin: 0;
    font-size: 12px;
    color: var(--dim);
    padding: 10px 0;
  }
</style>
