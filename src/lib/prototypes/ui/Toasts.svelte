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
    right: var(--proto-toasts-right, 18px);
    bottom: var(--proto-toasts-bottom, 18px);
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
    /* ui.jsx PToasts' borderRadius: 12 and boxShadow are fixed literals, not
     * pv.r or a themed shadow: every direction shows the same values. */
    border-radius: 12px;
    padding: 11px 13px;
    font-size: 13px;
    box-shadow: 0 12px 30px -10px rgba(0, 0, 0, 0.45);
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
    /* The three progress-segment colours are ui.jsx literals (idle, done,
     * queued), fixed regardless of direction. */
    background: rgba(127, 127, 127, 0.35);
    transition: background 300ms;
  }
  .bar i.done {
    background: #2ec4b6;
  }
  .bar i.queued {
    background: #e0a21a;
  }
  .stage {
    font-size: 11px;
    opacity: 0.75;
  }
</style>
