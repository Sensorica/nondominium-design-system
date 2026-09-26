<script lang="ts">
  // "Why am I seeing this?" for a derived signal: in short, what you can do,
  // and the resource's rules. The technical chain only with Developer details.
  import Modal from './Modal.svelte';
  import { proto } from '../store/store.svelte';
  import type { Ndo, Signal, SignalKind } from '../store/logic';
  import { plain, developer } from '../plain';

  let { sig, ndo, onclose }: { sig: Signal; ndo: Ndo; onclose: () => void } = $props();

  const rules = $derived(proto.s.rules[ndo.id] ?? []);
  let tech = $state(false);

  const IN_SHORT: Record<SignalKind, string> = {
    fulfil: 'You are one of the two people in this request. Mark it done once the item has been handed over or used. You will both get a private receipt.',
    validate: 'New items and requests need a check from another member before they go ahead. Nobody can approve their own.',
    available: 'Your item has been approved. Make it available so others can ask to borrow it.',
    request: 'This item is free right now. You can ask the person holding it to borrow it. The rules of the resource apply.',
    maintain: 'This resource has a maintenance rule. Logging the work keeps everyone informed and earns you a receipt.'
  };
  const WHAT_TO_DO: Record<SignalKind, string> = {
    fulfil: 'Once it has happened, press the button on the card. You both get a private receipt.',
    validate: 'Check it, then approve. It goes ahead once enough members approve.',
    available: 'Make it available so others can ask to borrow it.',
    request: 'Ask the holder to borrow it. They will hand it over when it suits them.',
    maintain: 'Do the maintenance, then log the work.'
  };
</script>

<Modal title="Why am I seeing this?" sub={sig.title + ' · ' + ndo.name} {onclose} width={480}>
  <section>
    <p class="pu-sec">In short</p>
    <p class="lead">{IN_SHORT[sig.kind] ?? 'This comes from the current state of the resource and its rules.'}</p>
  </section>
  <section>
    <p class="pu-sec">What you can do</p>
    <p class="body">{WHAT_TO_DO[sig.kind]}</p>
  </section>
  {#if rules.length}
    <section>
      <p class="pu-sec">Rules of {ndo.name}</p>
      {#each rules as [k, v], i (i)}
        <div class="rule"><span>{plain(k)}</span><span class="pu-muted">{plain(v)}</span></div>
      {/each}
    </section>
  {/if}
  <p class="pu-muted">
    Nobody assigns tasks here. Suggestions come from the state of shared resources and their rules, not from a ranking or a
    central feed.
  </p>
  {#if $developer}
    <div>
      <button type="button" class="pu-link" onclick={() => (tech = !tech)}>{tech ? 'Hide' : 'Show'} technical details</button>
      {#if tech}
        <div class="chain pu-mono">
          {#each sig.why as w, i (i)}<div>{w}</div>{/each}
        </div>
      {/if}
    </div>
  {/if}
</Modal>

<style>
  section {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .lead {
    margin: 0;
    font-size: 15px;
    line-height: 1.55;
  }
  .body {
    margin: 0;
    font-size: 14px;
    line-height: 1.55;
  }
  .rule {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    font-size: 14px;
    border-bottom: 1px solid var(--_line);
    padding: 6px 0;
  }
  .rule span:last-child {
    text-align: right;
  }
  .chain {
    margin-top: 8px;
    font-size: 12px;
    line-height: 1.7;
    background: var(--_hover);
    padding: 12px;
    border-radius: var(--_field-radius);
  }
</style>
