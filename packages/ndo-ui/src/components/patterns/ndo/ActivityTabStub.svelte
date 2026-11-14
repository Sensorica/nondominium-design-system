<script lang="ts">
  import type { EconomicMode, ResourceNature } from '../../../domain/types.js';

  interface Props {
    economicMode?: EconomicMode | null;
    resourceNature?: ResourceNature | string | null;
    /** Dual-created EconomicResource action hash when known. */
    seededResourceHash?: string | null;
  }

  let {
    economicMode = null,
    resourceNature = null,
    seededResourceHash = null
  }: Props = $props();

  const digital = $derived(String(resourceNature ?? '') === 'Digital');
</script>

<div class="rounded-lg border border-dashed border-gray-300 bg-white p-6">
  <span class="mb-3 inline-block rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">Stub</span>
  <p class="text-sm text-gray-700">
    Activity tab — economic events linked to this NDO will appear here when wired to Holochain.
  </p>
  {#if digital}
    <p class="mt-3 text-xs text-gray-600">
      Digital NDOs are not inventoriable. Prefer Cite or Work (and similar) over Use/Consume stock
      flows; shelf-unit events need a Physical or Hybrid inventoriable resource.
    </p>
  {:else if economicMode}
    <p class="mt-3 text-xs text-gray-600">
      This NDO is inventoriable ({economicMode}). Commitments and events should target the seeded
      economic resource
      {#if seededResourceHash}
        (<span class="font-mono">{seededResourceHash.slice(0, 16)}…</span>)
      {:else}
        (dual-created at Layer 1 activation)
      {/if}
      — not a free-form multi-instance paste.
    </p>
  {/if}
  <p class="mt-3 text-xs text-gray-500">
    Fulfill is bilateral and once-only: the agent who wrote a commitment cannot initiate; the other
    party starts it and the author countersigns. After a Claim exists, Fulfill is replaced by Fulfilled.

  </p>
</div>
