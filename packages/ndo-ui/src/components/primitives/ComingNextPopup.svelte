<script lang="ts">
  import { COMING_NEXT_STATUS, getComingNext } from '../../domain/coming-next.js';
  import Modal from './Modal.svelte';
  import NdoButton from './NdoButton.svelte';

  interface Props {
    /** Registry id (see domain/coming-next.ts). */
    featureId: string;
    onclose: () => void;
    /** Optional live shortcut related to the feature (e.g. "Create an NDO" for Offer). */
    actionLabel?: string;
    onaction?: () => void;
  }

  let { featureId, onclose, actionLabel, onaction }: Props = $props();

  const feature = $derived(getComingNext(featureId));
</script>

<Modal title={feature?.title ?? 'Coming next'} maxWidth="md">
  {#snippet children()}
    <div data-testid="coming-next-popup" data-feature={featureId} class="space-y-3">
      <span
        class="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700"
      >
        <span aria-hidden="true">{feature?.icon ?? '🚧'}</span>
        {COMING_NEXT_STATUS}
      </span>

      {#if feature}
        <p class="text-sm text-gray-700">{feature.summary}</p>
        {#if feature.details && feature.details.length > 0}
          <ul class="list-disc space-y-1 pl-5 text-sm text-gray-600">
            {#each feature.details as line (line)}
              <li>{line}</li>
            {/each}
          </ul>
        {/if}
        {#if feature.docRef}
          <p class="text-xs text-gray-400">
            Specified in <span class="font-mono">{feature.docRef}</span>
          </p>
        {/if}
      {:else}
        <p class="text-sm text-gray-700">This feature is under development and not available yet.</p>
      {/if}
    </div>
  {/snippet}
  {#snippet footer()}
    {#if actionLabel && onaction}
      <NdoButton
        onclick={() => {
          onclose();
          onaction?.();
        }}>{actionLabel}</NdoButton
      >
    {/if}
    <NdoButton variant="ghost" onclick={onclose}>Got it</NdoButton>
  {/snippet}
</Modal>
