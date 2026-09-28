<script lang="ts">
  // One recent trace in the "Just happened" column. It fades with age and,
  // until peers confirm it, shows the write lifecycle stage instead of a time.
  import { proto } from '$lib/prototypes/store/store.svelte';
  import { fmtAgo, freshness, type Trace } from '$lib/prototypes/store/logic';
  import { stageLabel } from '$lib/prototypes/plain';
  import { AgentAvatar } from '$lib/prototypes/ui';
  import { CARD_FADE, HAPPENED_BG } from './lanes';

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
    style:background={HAPPENED_BG}
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
    border: 0;
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
  .card:focus-visible {
    outline: 2px solid var(--blue);
    outline-offset: 2px;
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
  .head {
    display: flex;
    gap: 8px;
    align-items: flex-start;
    margin: 6px 0;
    font-size: 18px;
    line-height: 1.15;
    font-weight: 700;
    letter-spacing: -0.01em;
  }
  .meta {
    margin: 0 0 12px;
    font-size: 13px;
    color: var(--ink2);
  }
  .taken {
    font-size: 12px;
    font-weight: 600;
    color: #0f7d72;
  }
</style>
