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
    /** Original lane colour, e.g. 'var(--amber)'. */
    tone: string;
    /** Original lane background tint, e.g. 'var(--amberbg)'. */
    bg: string;
    onopen: (ndoId: string) => void;
  }

  let { sig, tone, bg, onopen }: Props = $props();

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
  <article
    class="card"
    class:cold
    style:background={cold ? '#F4F2EE' : bg}
    onclick={onCardClick}
  >
    <div class="res">{ndo.name}</div>
    <h3><button type="button" class="open" onclick={() => onopen(sig.ndo)}>{sig.title}</button></h3>
    <p>{sig.progress ? sig.progress[0] + ' of ' + sig.progress[1] + ' · ' : ''}{sig.sub}</p>
    <div class="foot">
      <Strength n={sig.strength} color={cold ? 'var(--mute)' : tone} />
      <button type="button" class="take" class:ghost={cold} onclick={pickUp}>{sig.verb}</button>
    </div>
    <ErrorNote {error} />
    <button type="button" class="why" onclick={() => modals.open({ type: 'why', sig, ndo: sig.ndo })}>{whyLabel}</button>
  </article>
{/if}

<style>
  .card {
    position: relative;
    border-radius: 14px;
    padding: 14px;
    cursor: pointer;
    transition:
      transform 150ms ease,
      box-shadow 150ms ease,
      opacity 400ms;
    animation: in 350ms ease;
  }
  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px -10px rgba(16, 20, 24, 0.25);
  }
  @keyframes in {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
  }
  .res {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    color: var(--ink2);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  h3 {
    margin: 6px 0;
    font-size: 18px;
    line-height: 1.15;
    font-weight: 700;
    letter-spacing: -0.01em;
  }
  .open {
    all: unset;
    cursor: pointer;
  }
  .open:focus-visible {
    border-radius: 4px;
    outline: 2px solid var(--blue);
    outline-offset: 2px;
  }
  p {
    margin: 0 0 12px;
    font-size: 13px;
    color: var(--ink2);
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
    border-top: 1px dashed rgba(16, 20, 24, 0.18);
    background: none;
    text-align: left;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: var(--ink2);
    cursor: pointer;
  }
  .why:hover {
    color: var(--ink);
    text-decoration: underline;
  }
  .why:focus-visible {
    outline: 2px solid var(--blue);
    outline-offset: 2px;
  }
</style>
