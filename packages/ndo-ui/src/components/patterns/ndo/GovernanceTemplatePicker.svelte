<script lang="ts">
  import { getGovernanceTemplatesForNdo } from '../../../domain/governance-templates.js';
  import type {
    EconomicMode,
    GovernanceRuleTemplate,
    NdoDescriptor,
    UseKind
  } from '../../../domain/types.js';
  import NdoButton from '../../primitives/NdoButton.svelte';

  interface Props {
    descriptor: NdoDescriptor;
    selectedRuleIds?: string[];
    economicMode?: EconomicMode | null;
    useKind?: UseKind | null;
    maxConcurrentUsers?: number | null;
    onchange?: (ruleIds: string[]) => void;
  }

  let {
    descriptor,
    selectedRuleIds = [],
    economicMode = null,
    useKind = null,
    maxConcurrentUsers = null,
    onchange
  }: Props = $props();

  const isSourceNdo = $derived(
    descriptor.ndo_archetype === 'source_ndo' ||
      (descriptor.property_regime === 'Nondominium' && !!descriptor.source_profile)
  );

  const resolvedMode = $derived(economicMode ?? descriptor.economic_mode ?? null);
  const resolvedUseKind = $derived(useKind ?? descriptor.use_kind ?? null);

  const recommended = $derived(
    getGovernanceTemplatesForNdo({
      regime: (descriptor.property_regime ??
        'Commons') as import('../../../domain/types.js').PropertyRegime,
      nature: (descriptor.resource_nature ??
        'Physical') as import('../../../domain/types.js').ResourceNature,
      isSourceNdo,
      economicMode: resolvedMode,
      useKind: resolvedUseKind,
      maxConcurrentUsers
    })
  );

  function toggleRule(template: GovernanceRuleTemplate) {
    const next = selectedRuleIds.includes(template.id)
      ? selectedRuleIds.filter((id) => id !== template.id)
      : [...selectedRuleIds, template.id];
    selectedRuleIds = next;
    onchange?.(next);
  }

  function acceptAllRecommended() {
    onchange?.(recommended.map((t) => t.id));
  }

  const modeLabel = $derived(
    isSourceNdo
      ? 'Source stewardship'
      : resolvedMode === 'consume'
        ? 'Consume (batch)'
        : resolvedMode === 'use' && resolvedUseKind === 'capacity'
          ? 'Use (capacity)'
          : resolvedMode === 'use'
            ? 'Use (unit)'
            : `${descriptor.property_regime} × ${descriptor.resource_nature}`
  );
</script>

<div class="space-y-4">
  <div class="flex flex-wrap items-center justify-between gap-2">
    <p class="text-sm text-gray-600">
      Recommended rules for {modeLabel}. Each rule includes a rationale so you know what it does.
    </p>
    <NdoButton variant="ghost" class="text-xs" onclick={acceptAllRecommended}>
      Accept all recommended
    </NdoButton>
  </div>

  <div class="space-y-3">
    {#each recommended as template}
      <label
        class="flex cursor-pointer gap-3 rounded-lg border p-4 transition-colors {selectedRuleIds.includes(
          template.id
        )
          ? 'border-blue-500 bg-blue-50/50'
          : 'border-gray-200 hover:border-gray-300'}"
      >
        <input
          type="checkbox"
          class="mt-1"
          checked={selectedRuleIds.includes(template.id)}
          onchange={() => toggleRule(template)}
        />
        <div class="min-w-0 flex-1">
          <p class="text-sm font-semibold text-gray-900">{template.label}</p>
          <p class="mt-1 text-xs text-gray-500">{template.rule_type}</p>
          <p class="mt-2 text-sm text-gray-700">{template.rationale}</p>
          {#if template.enforced_by}
            <p class="mt-1 text-xs text-gray-500">Enforced by: {template.enforced_by}</p>
          {/if}
        </div>
      </label>
    {/each}
  </div>

  {#if selectedRuleIds.length === 0}
    <p class="text-xs text-amber-700">
      No rules selected — the NDO will rely on default network governance until rules are attached.
    </p>
  {/if}
</div>
