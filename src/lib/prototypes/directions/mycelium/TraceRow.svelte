<script lang="ts">
  // One trace (A.jsx MyTrace). Opacity shows freshness at the current fade
  // window; hovering shows the peer path it took to reach you.
  import { proto } from '../../store/store.svelte';
  import { fmtAgo, freshness, type Trace } from '../../store/logic';
  import { plain } from '../../plain';
  import { AgentAvatar } from '../../ui';

  interface Props {
    t: Trace;
    decay: number;
    /** Show which resource the trace is on (the Traces and You views). */
    showNdo?: boolean;
  }

  let { t, decay, showNdo = false }: Props = $props();

  const OPACITY = { fresh: 1, warm: 0.85, fading: 0.6, cold: 0.35 } as const;
  const opacity = $derived(OPACITY[freshness(t.ago, decay)]);
  const hops = $derived(t.hops.length ? 'reached you via ' + t.hops.join(' → ') : undefined);
</script>

<div class="trace" style:opacity title={hops}>
  <span class="d" class:queued={t.status === 'queued'}></span>
  <span class="what">
    <AgentAvatar id={t.agent} size={16} />
    <b>{proto.q.agent(t.agent)}</b>
    {t.text}{#if showNdo}<span class="on"> · {proto.q.ndo(t.ndo)?.name}</span>{/if}
    {#if t.note}<em>“{t.note}”</em>{/if}
  </span>
  {#if t.status !== 'validated'}
    <span class="t st" class:queued={t.status === 'queued'}>{plain(t.status)}</span>
  {:else}
    <span class="t">{fmtAgo(t.ago)}</span>
  {/if}
</div>

<style>
  .trace {
    display: grid;
    grid-template-columns: 10px 1fr auto;
    gap: 10px;
    padding: 6px 0;
    font-size: 12px;
    transition: opacity 400ms;
  }
  .d {
    width: 6px;
    height: 6px;
    margin-top: 5px;
    border-radius: 50%;
    background: rgb(var(--ndo-brand-teal-300));
  }
  .d.queued {
    background: rgb(var(--ndo-amber-600));
  }
  .on {
    color: rgb(var(--ndo-gray-500));
  }
  em {
    display: block;
    margin-top: 2px;
    color: rgb(var(--ndo-gray-400));
  }
  .t {
    font-size: 11px;
    white-space: nowrap;
    color: rgb(var(--ndo-gray-500));
  }
  .st {
    font-family: var(--ndo-font-mono);
    font-size: 10px;
    color: rgb(var(--ndo-brand-teal-300));
  }
  .st.queued {
    color: rgb(var(--ndo-amber-600));
  }
</style>
