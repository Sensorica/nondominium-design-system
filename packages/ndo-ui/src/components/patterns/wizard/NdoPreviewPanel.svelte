<script lang="ts">
  import NdoBadge from '../../primitives/NdoBadge.svelte';
  import { getArchetype } from '../../../domain/wizard-archetypes.js';
  import { getGovernanceImplications } from '../../../domain/wizard-questions.js';
  import type { WizardKernelState, WizardRefinementState } from '../../../domain/types.js';

  interface Props {
    kernel: WizardKernelState;
    refinement: WizardRefinementState;
  }

  let { kernel, refinement }: Props = $props();

  const archetype = $derived(getArchetype(kernel.archetype));
  const implications = $derived(getGovernanceImplications(refinement, kernel.resource_nature));
  const displayName = $derived(kernel.name.trim() || 'Untitled NDO');
</script>

<div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
  <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">Live preview</p>
  <h3 class="mt-2 text-base font-semibold text-gray-900">{displayName}</h3>
  {#if kernel.description.trim()}
    <p class="mt-1 text-xs text-gray-600 line-clamp-2">{kernel.description}</p>
  {/if}

  <div class="mt-3 flex flex-wrap gap-1.5">
    <NdoBadge kind="lifecycle" value={kernel.lifecycle_stage} />
    <NdoBadge kind="nature" value={kernel.resource_nature} />
    <NdoBadge kind="regime" value={refinement.property_regime} />
  </div>

  <div class="mt-3 rounded border border-amber-200 bg-amber-50/80 px-3 py-2">
    <p class="text-xs font-medium text-amber-900">
      🔒 Permanent identity — cannot change after creation
    </p>
    <p class="mt-1 text-xs text-amber-800">
      {archetype.title} · {kernel.tier} path
    </p>
  </div>

  {#if refinement.rivalry}
    <p class="mt-2 text-xs text-gray-600">
      <span class="font-medium">Rivalry:</span>
      {refinement.rivalry}
    </p>
  {/if}

  {#if archetype.isSourceNdo && refinement.source_profile}
    <div class="mt-2 rounded border border-teal-200 bg-teal-50/60 px-3 py-2">
      <p class="text-xs font-medium text-teal-900">
        Source-NDO · {refinement.source_profile.source_type}
      </p>
      <p class="text-xs text-teal-800">Regime state: {refinement.source_profile.regime_state}</p>
      {#if refinement.source_profile.stewarded_by.length}
        <p class="text-xs text-teal-800">
          Stewards: {refinement.source_profile.stewarded_by.join(', ')}
        </p>
      {/if}
    </div>
  {/if}

  {#if implications.length}
    <div class="mt-3">
      <p class="text-xs font-semibold text-gray-500">Governance implications</p>
      <ul class="mt-1 space-y-1">
        {#each implications as line}
          <li class="text-xs text-gray-600">• {line}</li>
        {/each}
      </ul>
    </div>
  {/if}
</div>
