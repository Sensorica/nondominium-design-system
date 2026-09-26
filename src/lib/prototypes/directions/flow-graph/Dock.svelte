<script lang="ts">
  // The bottom bar: the Activity feed of zome calls (collapsed by default) and
  // each conductor's online / offline toggle.
  import { Avatar } from '$lib/prototypes/ui';
  import { friendly } from '$lib/prototypes/plain';
  import { CONDUCTORS } from './backend';
  import { aname, callPhrase, hhmm, short, type Ctx } from './model';

  interface Props {
    ctx: Ctx;
    open: boolean;
    height?: number;
    ontoggle: () => void;
  }

  let { ctx, open, height = $bindable(0), ontoggle }: Props = $props();

  const dev = $derived(ctx.dev);
  const s = $derived(ctx.B.state);
  const who = (a: string) => aname(ctx.B, a);

  const rows = $derived(
    s.log.slice(0, 60).map((r) => ({
      id: r.id,
      as: r.as,
      call: dev ? r.zome + '::' + r.fn : who(r.as) + ' · ' + callPhrase(r.fn),
      detail: r.ok
        ? dev
          ? r.queued
            ? 'committed offline · gossip queued'
            : 'committed · gossiping'
          : r.queued
            ? 'saved offline, will sync later'
            : 'saved and shared'
        : dev
          ? (r.error ?? '')
          : (friendly(r.error, { stripCallPrefix: true }) ?? ''),
      ok: !!r.ok,
      hash: r.hash ? short(r.hash) : 'none',
      time: hhmm(r.ts),
      status: r.ok ? (dev ? 'Ok' : '✓') : dev ? 'Err' : '⚠'
    }))
  );
</script>

<div class="dock" bind:clientHeight={height}>
  <div class="bar">
    <span class="title">{dev ? 'Conductor calls' : 'Activity'}</span>
    <span>{s.log.length} this session</span>
    <span class="grow"></span>
    {#each Object.keys(CONDUCTORS) as a (a)}
      {@const on = s.online[a]}
      <button type="button" class="cond" title="Toggle this conductor's network connection" aria-pressed={on} onclick={() => ctx.B.setOnline(a, !on)}>
        <span class="dot" class:dot--on={on}></span>{who(a)} :{CONDUCTORS[a].port} · {on ? 'online' : 'offline'}
      </button>
    {/each}
    <button type="button" class="toggle" aria-expanded={open} onclick={ontoggle}>{open ? 'Hide activity' : 'Show activity'}</button>
  </div>
  {#if open}
    <div class="log">
      {#each rows as r (r.id)}
        <div class="row">
          <Avatar id={CONDUCTORS[r.as]?.pubkey ?? r.as} name={who(r.as)} size={18} />
          <span class="mono call">{r.call}</span>
          <span class="detail" class:detail--err={!r.ok}>{r.detail}</span>
          <span class="mono muted">{r.hash}</span>
          <span class="mono muted">{r.time}</span>
          <span class="status" class:status--err={!r.ok}>{r.status}</span>
        </div>
      {/each}
      {#if !rows.length}
        <div class="empty">No calls yet. Pick an entry and run a zome call.</div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .dock {
    background: rgb(var(--ndo-color-card-bg));
    border-top: 1px solid rgb(var(--ndo-gray-200));
    font-family: var(--ndo-font-sans);
  }
  .bar {
    display: flex;
    align-items: center;
    gap: 12px;
    /* Right padding keeps the toggles clear of the comments button. */
    padding: 6px 88px 6px 16px;
    font-size: 12px;
    color: rgb(var(--ndo-gray-500));
    min-width: 0;
  }
  .title {
    font-weight: var(--ndo-weight-semibold);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .grow {
    flex: 1;
  }
  .cond.cond {
    display: flex;
    align-items: center;
    gap: 6px;
    border: 1px solid rgb(var(--ndo-gray-200));
    background: rgb(var(--ndo-color-card-bg));
    border-radius: var(--ndo-radius-md);
    padding: 2px 8px;
    font: inherit;
    font-size: 12px;
    color: rgb(var(--ndo-gray-600));
    cursor: pointer;
    white-space: nowrap;
  }
  .cond.cond:hover {
    background: rgb(var(--ndo-gray-50));
  }
  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
    background: rgb(var(--ndo-amber-600));
  }
  .dot--on {
    background: rgb(var(--ndo-green-700));
  }
  .toggle.toggle {
    border: 0;
    background: none;
    padding: 0;
    font: inherit;
    font-size: 12px;
    color: rgb(var(--ndo-blue-600));
    cursor: pointer;
    white-space: nowrap;
  }
  .toggle.toggle:hover {
    color: rgb(var(--ndo-blue-700));
    text-decoration: underline;
  }
  .cond.cond:focus-visible,
  .toggle.toggle:focus-visible {
    outline: none;
    box-shadow: var(--ndo-focus-ring);
  }
  .log {
    height: 120px;
    overflow: auto;
    border-top: 1px solid rgb(var(--ndo-gray-100));
  }
  .row {
    display: grid;
    grid-template-columns: 22px minmax(0, 1.3fr) minmax(0, 1.6fr) 120px 64px 44px;
    gap: 12px;
    align-items: center;
    padding: 5px 88px 5px 16px;
    border-bottom: 1px solid rgb(var(--ndo-gray-100));
    font-size: 12px;
  }
  .mono {
    font-family: var(--ndo-font-mono);
  }
  .muted {
    color: rgb(var(--ndo-gray-400));
  }
  .call {
    color: rgb(var(--ndo-gray-900));
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .detail {
    color: rgb(var(--ndo-gray-500));
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .detail--err {
    color: rgb(var(--ndo-red-700));
  }
  .status {
    font-size: 11px;
    font-weight: var(--ndo-weight-semibold);
    text-align: center;
    border-radius: var(--ndo-radius-sm);
    padding: 1px 0;
    background: rgb(var(--ndo-green-100));
    color: rgb(var(--ndo-green-700));
  }
  .status--err {
    background: rgb(var(--ndo-red-100));
    color: rgb(var(--ndo-red-700));
  }
  .empty {
    padding: 16px;
    font-size: 12px;
    color: rgb(var(--ndo-gray-500));
    font-style: italic;
  }
</style>
