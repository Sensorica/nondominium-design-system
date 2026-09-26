<script lang="ts">
  // The side column (FnSide in B.jsx): signals left on this entry, a few from
  // elsewhere in the register, your private receipts, and the conductor line.
  import { proto } from '$lib/prototypes/store/store.svelte';
  import { ErrorNote, modals } from '$lib/prototypes/ui';
  import type { Signal } from '$lib/prototypes/store/logic';

  let { id }: { id: string | null } = $props();

  const n = $derived(proto.q.ndo(id));
  const here = $derived(n ? proto.q.signalsOf(n.id) : []);
  const elsewhere = $derived(n ? proto.signals.filter((g) => g.ndo !== n.id) : []);

  // The backend's refusal for the last pick-up of each signal, shown under it.
  let errors = $state<Record<string, string | null>>({});

  function pickUp(g: Signal) {
    const r = proto.actions.pickUp(g);
    errors = { ...errors, [g.id]: r.ok ? null : r.error };
  }
</script>

{#snippet receiptsLink()}
  <button type="button" class="rh" onclick={() => modals.open({ type: 'receipts' })}>Your receipts →</button>
{/snippet}

<aside class="side">
  {#if !n}
    <h3>Left here for you</h3>
    <div class="sub">{proto.signals.length} open signals across your groups.</div>
    <div class="receipts">
      {@render receiptsLink()}
      <div class="foot">{proto.s.receipts.length} private receipts.</div>
    </div>
  {:else}
    <h3>Left here for you</h3>
    <div class="sub">Open signals any qualified agent can take up.</div>
    {#each here as g (g.id)}
      <div class="note">
        <b>{g.title}</b>
        <small>{g.progress ? g.progress[0] + ' of ' + g.progress[1] + ' · ' : ''}{g.sub}</small>
        <button type="button" class="act" onclick={() => pickUp(g)}>{g.verb} →</button>
        <button type="button" class="why" onclick={() => modals.open({ type: 'why', sig: g, ndo: g.ndo })}>why?</button>
        <ErrorNote error={errors[g.id]} />
      </div>
    {:else}
      <div class="note"><small>Nothing left here. The entry is quiet.</small></div>
    {/each}

    <h3 class="gap">Elsewhere in the register</h3>
    <div class="sub">{elsewhere.length} other open signals</div>
    {#each elsewhere.slice(0, 3) as g (g.id)}
      <div class="note">
        <small>{proto.q.ndo(g.ndo)?.name}</small>
        <b>{g.title}</b>
        <button type="button" class="act" onclick={() => pickUp(g)}>{g.verb} →</button>
        <ErrorNote error={errors[g.id]} />
      </div>
    {/each}

    <div class="receipts">
      {@render receiptsLink()}
      <div class="sub">Private to your source chain.</div>
      {#each proto.s.receipts.slice(0, 4) as r (r.id)}
        <div class="sl">
          <span>◆ {r.text}</span>
          <span>{(proto.q.ndo(r.ndo)?.name ?? '').split(' ')[0]}</span>
        </div>
      {:else}
        <div class="foot">None yet.</div>
      {/each}
    </div>

    <div class="foot conductor">
      <button type="button" class="plain" class:offline={proto.s.offline} onclick={() => proto.actions.toggleOffline()}>
        {proto.s.offline ? '○ offline · writing locally' : '● 23 peers hold this entry'}
      </button>
      <button type="button" class="plain reset" onclick={() => proto.actions.reset()}>reset prototype</button>
    </div>
  {/if}
</aside>

<style>
  .side {
    min-height: 0;
    overflow: auto;
    padding: 30px 22px;
    border-left: 1px solid var(--fn-rule);
  }

  h3,
  .rh {
    margin: 0 0 4px;
    font-size: var(--ndo-text-lg);
    font-weight: var(--ndo-weight-medium);
  }
  .gap {
    margin-top: 26px;
  }
  .rh {
    display: block;
    padding: 0;
    border: 0;
    background: none;
    color: var(--fn-ink);
    font-family: inherit;
    cursor: pointer;
  }
  .rh:hover {
    color: var(--fn-teal);
  }
  .sub {
    margin-bottom: 10px;
    font-size: var(--ndo-text-xs);
    color: var(--fn-mute);
  }

  .note {
    padding: 12px 0;
    border-top: 1px solid var(--fn-rule);
  }
  .note b {
    display: block;
    font-size: 15px;
    font-weight: var(--ndo-weight-medium);
  }
  .note small {
    display: block;
    font-size: 11px;
    color: var(--fn-mute);
  }
  .act {
    display: inline-flex;
    margin-top: 8px;
    padding: 0;
    border: 0;
    border-bottom: 1px solid var(--fn-teal);
    background: none;
    color: var(--fn-teal);
    font-family: inherit;
    font-size: var(--ndo-text-xs);
    font-weight: var(--ndo-weight-medium);
    cursor: pointer;
  }
  .act:hover {
    color: var(--fn-ink);
    border-color: var(--fn-ink);
  }
  .why {
    margin-left: 10px;
    padding: 0;
    border: 0;
    background: none;
    color: var(--fn-mute);
    font-family: inherit;
    font-size: 11px;
    text-decoration: underline dotted;
    cursor: pointer;
  }

  .receipts {
    margin-top: 26px;
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

  .foot {
    font-size: 11px;
    line-height: 1.6;
    color: var(--fn-mute);
  }
  .conductor {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 24px;
    font-family: var(--ndo-font-mono);
  }
  .plain {
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
  }
  .plain.offline {
    color: var(--fn-rust);
  }
  .reset {
    text-decoration: underline;
  }

  button:focus-visible {
    outline: none;
    box-shadow: var(--ndo-focus-ring);
  }

  @media (max-width: 1180px) {
    .side {
      grid-column: 2;
      grid-row: 2;
      overflow: visible;
      padding: 24px 28px;
      border-top: 1px solid var(--fn-rule);
      border-left: 0;
    }
  }
</style>
