<script lang="ts">
  // One source-chain entry on the canvas: 218 × 116, type row, title, up to
  // two badges, author and one line of context. Dashed while it has not
  // reached the conductor we look from.
  import { Avatar } from '$lib/prototypes/ui';
  import Badge from './Badge.svelte';
  import { LANE_COL, NH, NW, laneOf, tok, typeWord, type NodeView } from './model';

  interface Props {
    node: NodeView;
    x: number;
    y: number;
    dev: boolean;
    pending: boolean;
    viewFromConductor: boolean;
    on: boolean;
    dim: boolean;
    onclick: () => void;
  }

  let { node, x, y, dev, pending, viewFromConductor, on, dim, onclick }: Props = $props();

  const e = $derived(node.e);
  const flag = $derived(
    pending ? (dev ? (viewFromConductor ? 'arriving…' : 'gossiping') : 'syncing…') : e.private ? 'private' : e.updates.length ? (dev ? 'v' + (e.updates.length + 1) : 'updated') : ''
  );
</script>

<button
  type="button"
  class="card"
  class:card--pending={pending}
  class:card--on={on}
  class:card--dim={dim}
  data-node="1"
  style:left="{x}px"
  style:top="{y}px"
  style:width="{NW}px"
  style:height="{NH}px"
  {onclick}
>
  <span class="type">
    <span class="dot" style:background={tok(LANE_COL[laneOf(e)])}></span>
    {typeWord(e.type, dev)}
    {#if flag}<span class="flag" class:flag--pending={pending}>{flag}</span>{/if}
  </span>
  <span class="title">{node.title}</span>
  <span class="badges">
    {#each node.badges.slice(0, 2) as b, i (i)}
      <Badge variant={b.variant} label={b.label} />
    {/each}
  </span>
  <span class="foot">
    <Avatar id={node.author.id} name={node.author.name} size={18} />
    <span class="sub">{node.sub}</span>
  </span>
</button>

<style>
  .card.card {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    overflow: hidden;
    box-sizing: border-box;
    padding: 10px 12px;
    border-radius: var(--ndo-radius-lg);
    cursor: pointer;
    text-align: left;
    font-family: var(--ndo-font-sans);
    background: rgb(var(--ndo-color-card-bg));
    border: 1px solid rgb(var(--ndo-gray-200));
    box-shadow: var(--ndo-shadow-sm);
    transition:
      opacity 150ms ease,
      box-shadow 150ms ease;
  }
  .card--pending.card--pending {
    background: rgb(var(--ndo-color-card-bg) / 0.5);
    border: 1px dashed rgb(var(--ndo-gray-300));
    opacity: 0.7;
  }
  .card--on.card--on {
    box-shadow: 0 0 0 2px rgb(var(--ndo-blue-600));
  }
  .card--dim.card--dim {
    opacity: 0.35;
  }
  .card.card:focus-visible {
    outline: none;
    box-shadow: var(--ndo-focus-ring);
  }
  .type {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: var(--ndo-weight-semibold);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: rgb(var(--ndo-gray-500));
    white-space: nowrap;
  }
  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
    display: inline-block;
  }
  .flag {
    margin-left: auto;
    text-transform: none;
    letter-spacing: 0;
    font-weight: var(--ndo-weight-medium);
    font-family: var(--ndo-font-mono);
    color: rgb(var(--ndo-gray-400));
  }
  .flag--pending {
    color: rgb(var(--ndo-amber-700));
  }
  .title {
    display: block;
    font-size: 14px;
    font-weight: var(--ndo-weight-semibold);
    color: rgb(var(--ndo-gray-900));
    margin: 4px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .badges {
    display: flex;
    gap: 4px;
    overflow: hidden;
    height: 21px;
    min-width: 0;
  }
  .foot {
    display: flex;
    gap: 6px;
    align-items: center;
    font-size: 12px;
    color: rgb(var(--ndo-gray-500));
    margin-top: 6px;
    min-width: 0;
  }
  .sub {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
