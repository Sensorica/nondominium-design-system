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
    /** Opens the resource in the field. */
    onopen?: (ndoId: string) => void;
  }

  let { g, showNdo = false, onopen }: Props = $props();

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
      {#if onopen}
        <button type="button" class="ndo" onclick={() => onopen(g.ndo)}>{ndoName}</button>
      {:else}
        <small class="ndo">{ndoName}</small>
      {/if}
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
    border: 1px solid rgb(var(--ndo-gray-800));
    border-radius: var(--ndo-radius-lg);
    background: rgb(var(--ndo-gray-950) / 0.6);
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
    --lane: rgb(var(--ndo-amber-600));
  }
  .lane-avail {
    --lane: rgb(var(--ndo-brand-teal-300));
  }
  .lane-eyes {
    --lane: rgb(var(--ndo-violet-300));
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
    color: rgb(var(--ndo-gray-400));
  }
  .ndo {
    display: block;
    font: inherit;
    font-size: 11px;
    color: rgb(var(--ndo-gray-500));
    background: none;
    border: 0;
    padding: 0;
    text-align: left;
  }
  button.ndo {
    cursor: pointer;
  }
  button.ndo:hover {
    color: rgb(var(--ndo-gray-50));
    text-decoration: underline;
  }
  .why {
    display: block;
    margin-top: 4px;
    padding: 0;
    border: 0;
    background: none;
    font: inherit;
    font-size: 11px;
    color: rgb(var(--ndo-brand-teal-300));
    cursor: pointer;
  }
  .why:hover {
    color: rgb(var(--ndo-gray-50));
    text-decoration: underline;
  }
  .act {
    margin-left: auto;
    align-self: center;
    font: inherit;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    padding: 6px 12px;
    border-radius: var(--ndo-radius-pill);
    border: 1px solid rgb(var(--ndo-brand-teal-700));
    background: transparent;
    color: rgb(var(--ndo-brand-teal-300));
    cursor: pointer;
    transition: var(--ndo-transition-colors);
  }
  .act:hover {
    background: rgb(var(--ndo-brand-teal-700) / 0.3);
  }
  .act:focus-visible,
  .why:focus-visible,
  button.ndo:focus-visible {
    outline: none;
    box-shadow: var(--ndo-focus-ring);
  }
</style>
