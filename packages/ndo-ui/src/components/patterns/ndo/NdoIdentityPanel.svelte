<script lang="ts">
  import type { NdoDescriptor, NdoTransitionHistoryEvent } from '../../../domain/types.js';
  import {
    STAGE_IDENTITY_COLORS,
    REGIME_IDENTITY_COLORS,
    NATURE_IDENTITY_COLORS
  } from '../../../domain/variants.js';
  import type { LifecycleStage, PropertyRegime, ResourceNature } from '../../../domain/types.js';
  import { formatTimestamp, truncateHash } from '../../../domain/format.js';
  import { canTransition } from '../../../domain/lifecycle-transitions.js';

  interface Props {
    descriptor: NdoDescriptor | null;
    initiatorName?: string | null;
    initiatorHref?: string | null;
    transitionHistory?: NdoTransitionHistoryEvent[];
    isInitiator?: boolean;
    ontransitionclick?: () => void;
    onrefresh?: () => void;
  }

  let {
    descriptor,
    initiatorName = null,
    initiatorHref = null,
    transitionHistory = [],
    isInitiator = false,
    ontransitionclick,
    onrefresh
  }: Props = $props();

  function badgeClass(map: Record<string, string>, value: string | null): string {
    return value ? (map[value] ?? 'bg-gray-100 text-gray-600') : 'bg-gray-100 text-gray-400';
  }

  const formattedDate = $derived(formatTimestamp(descriptor?.created_at));
  const showTransition = $derived(
    isInitiator && descriptor != null && canTransition(descriptor.lifecycle_stage)
  );
</script>

<div class="border-b border-gray-100 bg-gray-50 px-6 py-4">
  {#if !descriptor}
    <div class="text-sm text-gray-400 italic">Loading Layer 0 identity…</div>
  {:else}
    <div class="flex flex-wrap items-start gap-4">
      <div class="flex flex-wrap items-center gap-2">
        {#if descriptor.lifecycle_stage}
          <span
            class="rounded px-2 py-0.5 text-xs font-semibold {badgeClass(STAGE_IDENTITY_COLORS, descriptor.lifecycle_stage)}"
          >
            {descriptor.lifecycle_stage}
          </span>
        {/if}
        {#if descriptor.property_regime}
          <span
            class="rounded border border-dashed px-2 py-0.5 text-xs font-medium {badgeClass(REGIME_IDENTITY_COLORS, descriptor.property_regime)}"
          >
            {descriptor.property_regime}
          </span>
        {/if}
        {#if descriptor.resource_nature}
          <span
            class="rounded px-2 py-0.5 text-xs font-medium {badgeClass(NATURE_IDENTITY_COLORS, descriptor.resource_nature)}"
          >
            {descriptor.resource_nature}
          </span>
        {/if}
      </div>

      <div class="ml-auto flex flex-wrap items-center gap-4 text-xs text-gray-500">
        {#if descriptor.initiator}
          <span>
            By
            {#if initiatorName && initiatorHref}
              <a href={initiatorHref} class="font-medium text-blue-600 hover:underline">{initiatorName}</a>
            {:else if initiatorName}
              <span class="font-medium text-gray-700">{initiatorName}</span>
            {:else}
              <span class="font-mono" title={descriptor.initiator}>{truncateHash(descriptor.initiator, 10)}</span>
            {/if}
          </span>
        {/if}
        {#if formattedDate}
          <span>{formattedDate}</span>
        {/if}

        {#if showTransition}
          <button
            type="button"
            onclick={() => ontransitionclick?.()}
            class="rounded border border-blue-300 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
          >
            {descriptor.lifecycle_stage === 'Active' ? 'Suspend (Hibernate) →' : 'Advance stage →'}
          </button>
        {/if}
      </div>
    </div>

    {#if descriptor.description}
      <p class="mt-2 text-sm text-gray-600">{descriptor.description}</p>
    {/if}

    {#if descriptor.lifecycle_stage === 'Hibernating' && descriptor.hibernation_origin}
      <div class="mt-2 flex items-center gap-2 rounded bg-yellow-50 px-3 py-1.5 text-xs text-yellow-700">
        <span class="font-medium">Hibernating</span>
        <span class="text-yellow-500">·</span>
        <span>Will resume from: <span class="font-semibold">{descriptor.hibernation_origin}</span></span>
      </div>
    {/if}

    {#if descriptor.lifecycle_stage === 'Deprecated' && descriptor.successor_ndo_hash}
      <div class="mt-2 flex items-center gap-2 rounded bg-orange-50 px-3 py-1.5 text-xs text-orange-700">
        <span class="font-medium">Deprecated</span>
        <span class="text-orange-400">·</span>
        <span>
          Succeeded by:
          <span class="font-mono">{truncateHash(descriptor.successor_ndo_hash, 12)}</span>
        </span>
      </div>
    {/if}

    {#if transitionHistory.length > 0}
      <details class="mt-3">
        <summary class="cursor-pointer text-xs font-medium text-gray-500 hover:text-gray-700">
          Transition history ({transitionHistory.length})
        </summary>
        <ul class="mt-2 space-y-1 text-xs text-gray-600">
          {#each transitionHistory as ev (ev.event_hash)}
            <li class="rounded border border-gray-200 bg-white px-2 py-1">
              {ev.from_stage} → {ev.to_stage}
              <span class="text-gray-400">· {formatTimestamp(ev.timestamp)}</span>
            </li>
          {/each}
        </ul>
      </details>
    {/if}
  {/if}
</div>
