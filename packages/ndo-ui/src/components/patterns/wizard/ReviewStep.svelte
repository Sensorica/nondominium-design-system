<script lang="ts">
  import NdoBadge from '../../primitives/NdoBadge.svelte';
  import { getArchetype } from '../../../domain/wizard-archetypes.js';
  import { getGovernanceImplications, subtractionOption } from '../../../domain/wizard-questions.js';
  import { getTemplateById } from '../../../domain/governance-templates.js';
  import { SOURCE_TYPE_OPTIONS } from '../../../domain/spec-profiles.js';
  import { recommendedGovernanceRuleIds } from '../../../domain/wizard-state.js';
  import type { WizardKernelState, WizardRefinementState } from '../../../domain/types.js';

  interface Props {
    kernel: WizardKernelState;
    refinement: WizardRefinementState;
  }

  let { kernel, refinement }: Props = $props();

  const archetype = $derived(getArchetype(kernel.archetype));
  const implications = $derived(getGovernanceImplications(refinement, kernel.resource_nature));
  const recommendedIds = $derived(recommendedGovernanceRuleIds(kernel, refinement));
  const recommendedLabels = $derived(
    recommendedIds.map((id) => getTemplateById(id)?.label ?? id)
  );
  const sourceTypeLabel = $derived(
    SOURCE_TYPE_OPTIONS.find((option) => option.id === refinement.source_profile?.source_type)?.label ??
      refinement.source_profile?.source_type
  );
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
      {#if kernel.economic_mode}
        <div class="flex justify-between">
          <dt class="text-gray-600">Interaction</dt>
          <dd class="text-right">
            {kernel.economic_mode === 'consume'
              ? 'Consume (batch)'
              : kernel.use_kind === 'capacity'
                ? 'Use — capacity'
                : 'Use — unit'}
          </dd>
        </div>
      {/if}
      {#if kernel.economic_mode === 'consume'}
        <div class="flex justify-between">
          <dt class="text-gray-600">Initial stock</dt>
          <dd>
            {kernel.initial_quantity}
            {kernel.default_unit}
            {#if kernel.identification_pattern}
              · {kernel.identification_pattern}
            {/if}
          </dd>
        </div>
      {/if}
      {#if kernel.economic_mode === 'use' && kernel.use_kind === 'capacity' && kernel.max_concurrent_users != null}
        <div class="flex justify-between">
          <dt class="text-gray-600">Capacity</dt>
          <dd>{kernel.max_concurrent_users} concurrent</dd>
        </div>
      {/if}
      {#if kernel.unique_id?.trim()}
        <div class="flex justify-between">
          <dt class="text-gray-600">Unique ID</dt>
          <dd>{kernel.unique_id}</dd>
        </div>
      {/if}
      {#if refinement.subtraction}
        <div class="flex justify-between">
          <dt class="text-gray-600">Use runs out</dt>
          <dd>{subtractionOption(refinement.subtraction)?.label}</dd>
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
          <dd>{sourceTypeLabel}</dd>
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

  {#if recommendedLabels.length}
    <section class="rounded-lg border border-blue-100 bg-blue-50/40 p-4">
      <h3 class="text-sm font-semibold text-blue-900">Recommended rules (preselected)</h3>
      <ul class="mt-2 space-y-1">
        {#each recommendedLabels as label}
          <li class="text-sm text-blue-900">• {label}</li>
        {/each}
      </ul>
      <p class="mt-2 text-xs text-blue-800">
        You can accept, drop, or add rules on the Governance tab after creation.
      </p>
    </section>
  {/if}

  <p class="text-xs text-gray-500">
    Layer 1 specification and governance rules can be refined from the NDO detail view after creation.
  </p>
</div>
