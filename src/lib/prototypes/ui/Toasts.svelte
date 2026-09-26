<script lang="ts">
  // The write lifecycle, one toast per write: saved on your device, sharing
  // with your groups (n of 23), shared and confirmed; or queued offline.
  // Sits above the comments button. Click a toast to dismiss it.
  import './proto.css';
  import { proto } from '../store/store.svelte';
  import { stageLabel, peersLabel, developer } from '../plain';

  const STEPS = ['signed', 'gossip', 'validated'] as const;
</script>

<div class="pu toasts" aria-live="polite">
  {#each proto.toasts as t (t.id)}
    <button type="button" class="toast" onclick={() => proto.dropToast(t.id)}>
      <strong>{t.title}</strong>
      <span class="bar">
        {#each STEPS as k, i (k)}
          <i class:done={t.stage !== 'queued' && i <= STEPS.indexOf(t.stage as (typeof STEPS)[number])} class:queued={t.stage === 'queued'}></i>
        {/each}
      </span>
      <span class="stage">
        {stageLabel(t.stage, $developer)}{t.stage === 'gossip' ? ' · ' + peersLabel(t.peers, $developer) : ''}
      </span>
    </button>
  {/each}
</div>

<style>
  .toasts {
    position: fixed;
    right: var(--proto-toasts-right, 24px);
    bottom: var(--proto-toasts-bottom, 88px);
    z-index: 60;
    width: 300px;
    max-width: calc(100vw - 32px);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .toast {
    text-align: left;
    font: inherit;
    border: 0;
    background: var(--proto-toast-bg, rgb(var(--ndo-gray-900)));
    color: var(--proto-toast-ink, rgb(255 255 255));
    border-radius: var(--_radius);
    padding: 11px 13px;
    font-size: 13px;
    box-shadow: var(--ndo-shadow-xl);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  strong {
    font-weight: 600;
  }
  .bar {
    display: flex;
    gap: 4px;
  }
  .bar i {
    flex: 1;
    height: 3px;
    border-radius: 2px;
    background: rgb(var(--ndo-gray-500) / 0.35);
    transition: background 300ms;
  }
  .bar i.done {
    background: var(--proto-progress, rgb(var(--ndo-teal-300)));
  }
  .bar i.queued {
    background: var(--proto-queued, rgb(var(--ndo-amber-600)));
  }
  .stage {
    font-size: 11px;
    opacity: 0.75;
  }
</style>
