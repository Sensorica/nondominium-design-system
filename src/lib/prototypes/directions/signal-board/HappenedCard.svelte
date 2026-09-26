<script lang="ts">
  // One recent trace in the "Just happened" column. It fades with age and,
  // until peers confirm it, shows the write lifecycle stage instead of a time.
  import { proto } from '$lib/prototypes/store/store.svelte';
  import { fmtAgo, freshness, type Trace } from '$lib/prototypes/store/logic';
  import { stageLabel } from '$lib/prototypes/plain';
  import { AgentAvatar } from '$lib/prototypes/ui';
  import { CARD_FADE, HAPPENED_TONE } from './lanes';

  let { t, onopen }: { t: Trace; onopen: (ndoId: string) => void } = $props();

  const ndo = $derived(proto.q.ndo(t.ndo));
  const when = $derived(
    t.status === 'validated' ? (t.ago < 1 ? 'just now' : fmtAgo(t.ago) + ' ago') : stageLabel(t.status, proto.dev)
  );
</script>

{#if ndo}
  <button
    type="button"
    class="card"
    style:--lane="var({HAPPENED_TONE})"
    style:opacity={CARD_FADE[freshness(t.ago)]}
    onclick={() => onopen(t.ndo)}
  >
    <span class="res">{ndo.name}</span>
    <span class="head">
      <AgentAvatar id={t.agent} size={22} />
      <span>{proto.q.agent(t.agent)} {t.text}</span>
    </span>
    <span class="meta">{when}{t.hops.length ? ' · via ' + t.hops.join(' → ') : ''}</span>
    {#if t.mine}<span class="taken">+1 trace on this resource</span>{/if}
  </button>
{/if}

<style>
  .card {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    text-align: left;
    font: inherit;
    color: inherit;
    border-radius: var(--ndo-radius-xl);
    padding: 14px;
    cursor: pointer;
    background: rgb(var(--lane) / 0.08);
    border: 1px solid rgb(var(--lane) / 0.16);
    transition:
      transform var(--ndo-duration-base) var(--ndo-easing),
      var(--ndo-transition-shadow),
      opacity 400ms var(--ndo-easing);
    animation: in 350ms var(--ndo-easing);
  }
  .card:hover {
    transform: translateY(-2px);
    box-shadow: var(--ndo-shadow-lg);
  }
  .card:focus-visible {
    outline: none;
    box-shadow: var(--ndo-focus-ring);
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
  .head {
    display: flex;
    gap: 8px;
    align-items: flex-start;
    margin: 6px 0;
    font-size: var(--ndo-text-base);
    line-height: 1.25;
    font-weight: var(--ndo-weight-bold);
  }
  .meta {
    font-size: 13px;
    color: var(--ndo-color-text-secondary);
  }
  .taken {
    margin-top: 8px;
    font-size: var(--ndo-text-xs);
    font-weight: var(--ndo-weight-semibold);
    color: rgb(var(--ndo-teal-700));
  }
</style>
