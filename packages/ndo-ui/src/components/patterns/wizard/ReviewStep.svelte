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
</script>

<div class="space-y-4">
  <p class="text-sm text-gray-600">
    Review your choices. Items in the locked section cannot be changed after creation.
  </p>

  <section class="rounded-lg border border-amber-200 bg-amber-50/50 p-4">
    <h3 class="flex items-center gap-2 text-sm font-semibold text-amber-900">
      <span aria-hidden="true">🔒</span> Permanent identity (Layer 0)
    </h3>
    <dl class="mt-3 space-y-2 text-sm">
      <div class="flex justify-between gap-4">
        <dt class="text-gray-600">Name</dt>
        <dd class="font-medium text-gray-900">{kernel.name}</dd>
      </div>
      <div class="flex flex-wrap justify-end gap-1">
        <NdoBadge kind="lifecycle" value={kernel.lifecycle_stage} />
        <NdoBadge kind="nature" value={kernel.resource_nature} />
        <NdoBadge kind="regime" value={refinement.property_regime} />
      </div>
      {#if kernel.description.trim()}
        <div>
          <dt class="text-gray-600">Description</dt>
          <dd class="mt-1 text-gray-800">{kernel.description}</dd>
        </div>
      {/if}
      <div class="flex justify-between">
        <dt class="text-gray-600">Archetype</dt>
        <dd class="text-gray-900">{archetype.title}</dd>
      </div>
    </dl>
  </section>

  <section class="rounded-lg border border-gray-200 bg-white p-4">
    <h3 class="text-sm font-semibold text-gray-900">Evolvable classification</h3>
    <dl class="mt-3 space-y-2 text-sm">
      {#if refinement.rivalry}
        <div class="flex justify-between">
          <dt class="text-gray-600">Rivalry</dt>
          <dd>{refinement.rivalry}</dd>
        </div>
      {/if}
      {#if refinement.scope}
        <div class="flex justify-between">
          <dt class="text-gray-600">Scope</dt>
          <dd>{refinement.scope}</dd>
        </div>
      {/if}
      {#if refinement.regime_not_sure}
        <p class="text-xs text-amber-700">
          Property regime set provisionally — refine on the Specification tab.
        </p>
      {/if}
    </dl>
  </section>

  {#if archetype.isSourceNdo && refinement.source_profile}
    <section class="rounded-lg border border-teal-200 bg-teal-50/40 p-4">
      <h3 class="text-sm font-semibold text-teal-900">Source profile</h3>
      <dl class="mt-2 space-y-1 text-sm">
        <div class="flex justify-between">
          <dt class="text-gray-600">Type</dt>
          <dd>{refinement.source_profile.source_type}</dd>
        </div>
        <div class="flex justify-between">
          <dt class="text-gray-600">Regime state</dt>
          <dd>{refinement.source_profile.regime_state}</dd>
        </div>
        <div>
          <dt class="text-gray-600">Stewards</dt>
          <dd class="mt-1">{refinement.source_profile.stewarded_by.join(', ')}</dd>
        </div>
      </dl>
    </section>
  {/if}

  {#if implications.length}
    <section class="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <h3 class="text-sm font-semibold text-gray-900">What this means for governance</h3>
      <ul class="mt-2 space-y-1">
        {#each implications as line}
          <li class="text-sm text-gray-700">• {line}</li>
        {/each}
      </ul>
    </section>
  {/if}

  <p class="text-xs text-gray-500">
    Layer 1 specification and governance rules can be added from the NDO detail view after creation.
  </p>
</div>
