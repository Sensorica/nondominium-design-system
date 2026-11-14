<script lang="ts">
  import { deriveNdoUiProfile } from '../../../domain/ndo-ui-profile.js';
  import type {
    EconomicMode,
    GovernanceRuleTemplate,
    NdoDescriptor,
    UseKind
  } from '../../../domain/types.js';
  import NdoButton from '../../primitives/NdoButton.svelte';
  import SoonBadge from '../../primitives/SoonBadge.svelte';

  interface Props {
    descriptor: NdoDescriptor;
    selectedRuleIds?: string[];
    /**
     * Template ids already attached as governance rules — shown as Applied,
     * not selectable, and excluded from Accept all / Apply.
     */
    appliedRuleIds?: readonly string[] | Set<string> | null;
    economicMode?: EconomicMode | null;
    useKind?: UseKind | null;
    maxConcurrentUsers?: number | null;
    /**
     * When set, only these template ids are selectable/applyable. Others show
     * a Soon badge (schema not wired in the host yet).
     */
    creatableRuleIds?: readonly string[] | Set<string> | null;
    onchange?: (ruleIds: string[]) => void;
  }

  let {
    descriptor,
    selectedRuleIds = [],
    appliedRuleIds = null,
    economicMode = null,
    useKind = null,
    maxConcurrentUsers = null,
    creatableRuleIds = null,
    onchange
  }: Props = $props();

  const isSourceNdo = $derived(
    descriptor.ndo_archetype === 'source_ndo' ||
      (descriptor.property_regime === 'Nondominium' && !!descriptor.source_profile)
  );

  const resolvedMode = $derived(economicMode ?? descriptor.economic_mode ?? null);
  const resolvedUseKind = $derived(useKind ?? descriptor.use_kind ?? null);

  const profile = $derived(
    deriveNdoUiProfile({
      resourceNature: descriptor.resource_nature,
      propertyRegime: descriptor.property_regime,
      economicMode: resolvedMode,
      useKind: resolvedUseKind,
      isSource: isSourceNdo,
      maxConcurrentUsers,
      creatableRuleIds,
      appliedRuleIds
    })
  );

  const recommended = $derived(profile.governance.recommended);
  const applyableIdSet = $derived(new Set(profile.governance.applyableIds));
  const appliedIdSet = $derived(new Set(profile.governance.appliedIds));
  const creatableIdSet = $derived(new Set(profile.governance.creatableIds));

  function isCreatable(id: string): boolean {
    // Host maturity null ⇒ creatableIds === all recommended (profile expands them).
    return creatableRuleIds == null || creatableIdSet.has(id);
  }

  function isApplied(id: string): boolean {
    return appliedIdSet.has(id);
  }

  const applyableRecommended = $derived(
    recommended.filter((t) => applyableIdSet.has(t.id))
  );

  function toggleRule(template: GovernanceRuleTemplate) {
    if (!isCreatable(template.id) || isApplied(template.id)) return;
    const next = selectedRuleIds.includes(template.id)
      ? selectedRuleIds.filter((id) => id !== template.id)
      : [...selectedRuleIds, template.id];
    onchange?.(next);
  }

  function acceptAllRecommended() {
    onchange?.(applyableRecommended.map((t) => t.id));
  }

  const modeLabel = $derived(
    profile.isSource
      ? 'Source stewardship'
      : profile.economicFork === 'consume'
        ? 'Consume (batch)'
        : profile.economicFork === 'use_capacity'
          ? 'Use (capacity)'
          : profile.economicFork === 'use_unit'
            ? 'Use (unit)'
            : `${descriptor.property_regime} × ${descriptor.resource_nature}`
  );
</script>

<div class="space-y-4">
  <div class="flex flex-wrap items-center justify-between gap-2">
    <p class="text-sm text-gray-600">
      Recommended rules for {modeLabel}. Each rule includes a rationale so you know what it does.
    </p>
    <NdoButton
      variant="ghost"
      class="text-xs"
      disabled={applyableRecommended.length === 0}
      onclick={acceptAllRecommended}
    >
      Accept all recommended
    </NdoButton>
  </div>

  {#if recommended.length === 0}
    <p class="text-xs text-amber-700">
      No recommended templates for this classification — use Custom rule to add one.
    </p>
  {:else if applyableRecommended.length === 0 && creatableRuleIds != null && profile.governance.creatableIds.length === 0}
    <p class="text-xs text-amber-700">
      Recommended templates for this NDO are not creatable yet (Soon). Use Custom rule to attach a
      typed rule now.
    </p>
  {/if}

  <div class="space-y-3">
    {#each recommended as template}
      {@const creatable = isCreatable(template.id)}
      {@const applied = isApplied(template.id)}
      {@const selected = !applied && selectedRuleIds.includes(template.id)}
      <label
        class="flex gap-3 rounded-lg border p-4 transition-colors {applied
          ? 'cursor-default border-emerald-200 bg-emerald-50/40'
          : creatable
            ? 'cursor-pointer'
            : 'cursor-not-allowed opacity-75'} {!applied && selected
          ? 'border-blue-500 bg-blue-50/50'
          : !applied
            ? 'border-gray-200 hover:border-gray-300'
            : ''}"
      >
        <input
          type="checkbox"
          class="mt-1"
          checked={applied || selected}
          disabled={!creatable || applied}
          onclick={(e) => {
            e.preventDefault();
            toggleRule(template);
          }}
        />
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <p class="text-sm font-semibold text-gray-900">{template.label}</p>
            {#if applied}
              <span
                class="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-800"
              >
                Applied
              </span>
            {:else if !creatable}
              <SoonBadge />
            {/if}
          </div>
          <p class="mt-1 text-xs text-gray-500">{template.rule_type}</p>
          <p class="mt-2 text-sm text-gray-700">{template.rationale}</p>
          {#if template.enforced_by}
            <p class="mt-1 text-xs text-gray-500">Enforced by: {template.enforced_by}</p>
          {/if}
          {#if applied}
            <p class="mt-1 text-xs text-emerald-800">
              Already attached — re-applying would create a duplicate.
            </p>
          {:else if !creatable}
            <p class="mt-1 text-xs text-amber-700">Not applyable in this build — schema still landing.</p>
          {/if}
        </div>
      </label>
    {/each}
  </div>

  {#if selectedRuleIds.length === 0 && applyableRecommended.length > 0}
    <p class="text-xs text-amber-700">
      No rules selected — the NDO will rely on default network governance until rules are attached.
    </p>
  {:else if applyableRecommended.length === 0 && recommended.some((t) => isApplied(t.id))}
    <p class="text-xs text-emerald-800">
      All creatable recommended templates are already applied.
    </p>
  {/if}
</div>
