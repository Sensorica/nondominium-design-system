<script lang="ts">
  import type { NdoDescriptor } from '../../../domain/types.js';
  import Modal from '../../primitives/Modal.svelte';
  import NdoButton from '../../primitives/NdoButton.svelte';

  interface Props {
    descriptor: NdoDescriptor;
    onclose: () => void;
  }

  let { descriptor, onclose }: Props = $props();

  let copied = $state(false);

  async function copyInitiatorKey() {
    if (!descriptor.initiator) return;
    try {
      await navigator.clipboard.writeText(descriptor.initiator);
      copied = true;
      setTimeout(() => {
        copied = false;
      }, 2000);
    } catch {
      // clipboard not available
    }
  }
</script>

<Modal title="Fork this NDO" subtitle={descriptor.name} maxWidth="md">
  {#snippet children()}
    <div class="space-y-4">
      <div class="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <h3 class="mb-1 text-sm font-semibold text-amber-800">Fork friction — by design</h3>
        <p class="text-sm text-amber-700">
          Forking is intentionally non-trivial in Nondominium. The NDO model discourages gratuitous
          forks that fragment shared resource pools.
        </p>
      </div>

      <div class="space-y-2 text-sm text-gray-700">
        <p>
          <span class="font-medium">Step 1 — Negotiate:</span> Contact the NDO initiator and present
          your case for a fork.
        </p>
        <p>
          <span class="font-medium">Step 2 — Consensus:</span> A fork requires agreement from active
          participants, not just the initiator.
        </p>
        <p>
          <span class="font-medium text-gray-400">Step 3 — Unyt payment (future):</span>
          <span class="text-gray-400"> Post-MVP stake friction is not yet available.</span>
        </p>
      </div>

      <div class="rounded border border-gray-200 bg-gray-50 p-4">
        <p class="mb-2 text-sm font-medium text-gray-700">Contact the NDO initiator:</p>
        {#if descriptor.initiator}
          <div class="flex items-center gap-2">
            <code class="flex-1 truncate rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600">
              {descriptor.initiator}
            </code>
            <NdoButton variant="ghost" class="shrink-0 px-2.5 py-1 text-xs" onclick={copyInitiatorKey}>
              {copied ? '✓ Copied' : 'Copy'}
            </NdoButton>
          </div>
        {:else}
          <p class="text-xs text-gray-400 italic">Initiator not available.</p>
        {/if}
      </div>
    </div>
  {/snippet}
  {#snippet footer()}
    <NdoButton variant="ghost" onclick={onclose}>Close</NdoButton>
  {/snippet}
</Modal>
