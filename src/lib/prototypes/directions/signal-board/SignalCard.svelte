<script lang="ts">
  // One derived signal on the board (D.jsx SbCard). Clicking the card opens
  // its resource in the drawer; the verb button picks the signal up, which
  // runs the zome call the signal was derived from; the dashed footer asks
  // "why am I seeing this?". A failed pick-up shows the backend's error in
  // friendly words on the card itself.
  import { proto } from '$lib/prototypes/store/store.svelte';
  import type { Signal } from '$lib/prototypes/store/logic';
  import { ErrorNote, modals } from '$lib/prototypes/ui';
  import Strength from './Strength.svelte';

  interface Props {
    sig: Signal;
    /** Token name of the lane colour, e.g. '--ndo-amber-600'. */
    tone: string;
    onopen: (ndoId: string) => void;
  }

  let { sig, tone, onopen }: Props = $props();

  let error = $state<string | null>(null);

  const ndo = $derived(proto.q.ndo(sig.ndo));
  const cold = $derived(ndo?.stage === 'Hibernating' || sig.strength <= 1);
  const whyLabel = $derived(proto.dev ? (sig.why[1] ?? '').replace('← ', 'from ') + ' · why?' : 'Why am I seeing this?');

  function pickUp() {
    const r = proto.actions.pickUp(sig);
    error = r.ok ? null : r.error;
  }

  // The whole card opens the resource with a mouse; its controls keep their
  // own clicks, and the title is a real button for the keyboard.
  function onCardClick(e: MouseEvent) {
    if ((e.target as HTMLElement).closest('button, a, select, input')) return;
    onopen(sig.ndo);
  }
</script>

{#if ndo}
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
  <article class="card" class:cold style:--lane="var({cold ? '--ndo-gray-500' : tone})" onclick={onCardClick}>
    <div class="res">{ndo.name}</div>
    <h3><button type="button" class="open" onclick={() => onopen(sig.ndo)}>{sig.title}</button></h3>
    <p>{sig.progress ? sig.progress[0] + ' of ' + sig.progress[1] + ' · ' : ''}{sig.sub}</p>
    <div class="foot">
      <Strength n={sig.strength} />
      <button type="button" class="take" class:ghost={cold} onclick={pickUp}>{sig.verb}</button>
    </div>
    <ErrorNote {error} />
    <button type="button" class="why" onclick={() => modals.open({ type: 'why', sig, ndo: sig.ndo })}>{whyLabel}</button>
  </article>
{/if}

<style>
  .card {
    position: relative;
    border-radius: var(--ndo-radius-xl);
    padding: 14px;
    cursor: pointer;
    background: rgb(var(--lane) / 0.1);
    border: 1px solid rgb(var(--lane) / 0.18);
    transition:
      transform var(--ndo-duration-base) var(--ndo-easing),
      var(--ndo-transition-shadow);
    animation: in 350ms var(--ndo-easing);
  }
  .card:hover {
    transform: translateY(-2px);
    box-shadow: var(--ndo-shadow-lg);
  }
  .card.cold {
    background: rgb(var(--ndo-gray-500) / 0.08);
    border-color: var(--ndo-color-border);
  }
  @keyframes in {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
  }
  .res {
    font-family: var(--ndo-font-mono);
    font-size: 11px;
    font-weight: var(--ndo-weight-medium);
    color: var(--ndo-color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  h3 {
    margin: 6px 0;
    font-size: var(--ndo-text-lg);
    line-height: 1.2;
    font-weight: var(--ndo-weight-bold);
    letter-spacing: -0.01em;
  }
  .open {
    all: unset;
    cursor: pointer;
  }
  .open:focus-visible {
    border-radius: var(--ndo-radius-sm);
    box-shadow: var(--ndo-focus-ring);
  }
  p {
    margin: 0 0 12px;
    font-size: 13px;
    color: var(--ndo-color-text-secondary);
  }
  .foot {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .take {
    margin-left: auto;
  }
  .why {
    display: block;
    width: 100%;
    margin-top: 10px;
    padding: 8px 0 0;
    border: 0;
    border-top: 1px dashed rgb(var(--ndo-gray-500) / 0.35);
    background: none;
    text-align: left;
    font-family: var(--ndo-font-mono);
    font-size: var(--ndo-text-xs);
    color: var(--ndo-color-text-secondary);
    cursor: pointer;
  }
  .why:hover {
    color: var(--ndo-color-text-primary);
    text-decoration: underline;
  }
  .why:focus-visible {
    outline: none;
    box-shadow: var(--ndo-focus-ring);
  }
</style>
