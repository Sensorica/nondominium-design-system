<script lang="ts">
  // One derived signal (A.jsx MySignal). Picking it up runs the zome call it
  // was derived from; a backend refusal shows under it in friendly words.
  import { proto } from '../../store/store.svelte';
  import type { Signal } from '../../store/logic';
  import { ErrorNote, modals } from '../../ui';

  interface Props {
    g: Signal;
    /** Show the resource's name above the title (the Signals view). */
    showNdo?: boolean;
  }

  let { g, showNdo = false }: Props = $props();

  let error = $state<string | null>(null);
  const ndoName = $derived(proto.q.ndo(g.ndo)?.name ?? '');

  function pickUp() {
    const r = proto.actions.pickUp(g);
    error = r.ok ? null : r.error;
  }
</script>

<div class="sig">
  <span class="pulse lane-{g.lane}"></span>
  <div class="body">
    {#if showNdo}
      <small class="ndo">{ndoName}</small>
    {/if}
    <b>{g.title}</b>
    <small>{g.progress ? g.progress[0] + ' of ' + g.progress[1] + ' · ' : ''}{g.sub}</small>
    <button type="button" class="why" onclick={() => modals.open({ type: 'why', sig: g, ndo: g.ndo })}>why am I seeing this?</button>
    <ErrorNote {error} />
  </div>
  <button type="button" class="act" onclick={pickUp}>{g.verb}</button>
</div>

<style>
  .sig {
    display: flex;
    gap: 10px;
    padding: 10px;
    margin-bottom: 8px;
    align-items: flex-start;
    border: 1px solid var(--line);
    border-radius: 10px;
    background: #0e1618;
  }
  .pulse {
    width: 10px;
    height: 10px;
    margin-top: 4px;
    flex-shrink: 0;
    border-radius: 50%;
    background: var(--lane);
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--lane) 14%, transparent);
  }
  .lane-hands {
    --lane: #f2b84b;
  }
  .lane-avail {
    --lane: #2ec4b6;
  }
  .lane-eyes {
    --lane: #8b5cf6;
  }
  .body {
    min-width: 0;
  }
  b {
    display: block;
    font-size: 13px;
    font-weight: 600;
  }
  small {
    font-size: 11px;
    color: var(--mute);
  }
  .ndo {
    display: block;
    color: var(--dim);
  }
  .why {
    display: block;
    margin-top: 4px;
    padding: 0;
    border: 0;
    background: none;
    font: inherit;
    font-size: 11px;
    color: var(--teal);
    cursor: pointer;
  }
  .why:hover {
    color: var(--ink);
    text-decoration: underline;
  }
  .act {
    margin-left: auto;
    align-self: center;
    font: 500 12px 'Instrument Sans', sans-serif;
    white-space: nowrap;
    padding: 6px 12px;
    border-radius: 999px;
    border: 1px solid #2a4a4a;
    background: transparent;
    color: var(--teal);
    cursor: pointer;
  }
  .act:hover {
    background: #12302e;
  }
  .act:focus-visible,
  .why:focus-visible {
    outline: none;
    box-shadow: var(--ndo-focus-ring);
  }
</style>
