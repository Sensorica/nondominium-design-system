<script lang="ts">
  // Copy of ui/src/lib/components/ndo/NdoIdentityLayer.svelte.
  //
  // Production resolves the initiator's display name by fetching every Person
  // entry and matching on the encoded key; the replica does the same match
  // against mock persons, so an initiator with no Person entry still falls
  // through to the truncated-key branch — which is a real state and one of the
  // reasons this screen is worth reviewing.
  import { paths } from '$lib/paths';
  import type { NdoDescriptor } from '../types';
  import { appContext, personService } from '../stores.svelte';
  import LifecycleTransitionModal from './LifecycleTransitionModal.svelte';
  import TransitionHistoryPanel from './TransitionHistoryPanel.svelte';

  interface Props {
    descriptor: NdoDescriptor | null;
    onrefresh?: () => void;
    /** Prototype-only: lets the route drive the modal so it is deep-linkable. */
    transitionOpen?: boolean;
    onTransitionOpenChange?: (open: boolean) => void;
  }

  let { descriptor, onrefresh, transitionOpen = false, onTransitionOpenChange }: Props = $props();

  let initiatorName = $state<string | null>(null);

  const showTransitionModal = $derived(transitionOpen);

  const lifecycleColorMap: Record<string, string> = {
    Ideation: 'bg-gray-100 text-gray-600',
    Specification: 'bg-blue-50 text-blue-600',
    Development: 'bg-indigo-100 text-indigo-700',
    Prototype: 'bg-amber-100 text-amber-700',
    Stable: 'bg-green-100 text-green-700',
    Distributed: 'bg-teal-100 text-teal-700',
    Active: 'bg-emerald-100 text-emerald-700',
    Hibernating: 'bg-yellow-100 text-yellow-700',
    Deprecated: 'bg-orange-100 text-orange-700',
    EndOfLife: 'bg-red-100 text-red-700'
  };

  const regimeColorMap: Record<string, string> = {
    Private: 'bg-gray-100 text-gray-600',
    Commons: 'bg-cyan-100 text-cyan-700',
    Nondominium: 'bg-emerald-100 text-emerald-700',
    CommonPool: 'bg-rose-100 text-rose-700'
  };

  const natureColorMap: Record<string, string> = {
    Physical: 'bg-blue-100 text-blue-700',
    Digital: 'bg-purple-100 text-purple-700',
    Service: 'bg-orange-100 text-orange-700',
    Hybrid: 'bg-teal-100 text-teal-700',
    Information: 'bg-indigo-100 text-indigo-700'
  };

  function badgeClass(map: Record<string, string>, value: string | null): string {
    return value ? (map[value] ?? 'bg-gray-100 text-gray-600') : 'bg-gray-100 text-gray-400';
  }

  const formattedDate = $derived(
    descriptor?.created_at ? new Date(descriptor.created_at / 1000).toLocaleString() : null
  );

  const isInitiator = $derived(
    descriptor?.initiator != null &&
      appContext.myAgentPubKey != null &&
      descriptor.initiator === appContext.myAgentPubKey
  );

  const canTransition = $derived(
    isInitiator && descriptor?.lifecycle_stage != null && descriptor.lifecycle_stage !== 'EndOfLife'
  );

  const ndoActionHash = $derived(descriptor?.hash ?? null);

  $effect(() => {
    if (!descriptor?.initiator) {
      initiatorName = null;
      return;
    }
    const initiatorB64 = descriptor.initiator;
    const match = personService.getAllPersons().find((p) => p.agent_pub_key === initiatorB64);
    initiatorName = match?.name ?? null;
  });
</script>

{#if showTransitionModal && descriptor}
  <LifecycleTransitionModal
    {descriptor}
    onclose={() => {
      onTransitionOpenChange?.(false);
    }}
    onadvanced={() => {
      onrefresh?.();
    }}
  />
{/if}

<div class="border-b border-gray-100 bg-gray-50 px-6 py-4">
  {#if !descriptor}
    <div class="text-sm text-gray-400 italic">Loading Layer 0 identity…</div>
  {:else}
    <div class="flex flex-wrap items-start gap-4">
      <!-- Badges row -->
      <div class="flex flex-wrap items-center gap-2">
        {#if descriptor.lifecycle_stage}
          <span
            class={`rounded px-2 py-0.5 text-xs font-semibold ${badgeClass(lifecycleColorMap, descriptor.lifecycle_stage)}`}
          >
            {descriptor.lifecycle_stage}
          </span>
        {/if}
        {#if descriptor.property_regime}
          <span
            class={`rounded border border-dashed px-2 py-0.5 text-xs font-medium ${badgeClass(regimeColorMap, descriptor.property_regime)}`}
          >
            {descriptor.property_regime}
          </span>
        {/if}
        {#if descriptor.resource_nature}
          <span
            class={`rounded px-2 py-0.5 text-xs font-medium ${badgeClass(natureColorMap, descriptor.resource_nature)}`}
          >
            {descriptor.resource_nature}
          </span>
        {/if}
      </div>

      <!-- Meta row -->
      <div class="ml-auto flex flex-wrap items-center gap-4 text-xs text-gray-500">
        {#if descriptor.initiator}
          <span>
            By
            {#if initiatorName}
              <a
                href={paths.agentProfile(descriptor.initiator)}
                class="font-medium text-blue-600 hover:underline">{initiatorName}</a
              >
            {:else}
              <span class="font-mono" title={descriptor.initiator}
                >{descriptor.initiator.slice(0, 10)}…</span
              >
            {/if}
          </span>
        {/if}
        {#if formattedDate}
          <span>{formattedDate}</span>
        {/if}

        {#if canTransition}
          <button
            type="button"
            onclick={() => {
              onTransitionOpenChange?.(true);
            }}
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

    <!-- Conditional state rows -->
    {#if descriptor.lifecycle_stage === 'Hibernating' && descriptor.hibernation_origin}
      <div
        class="mt-2 flex items-center gap-2 rounded bg-yellow-50 px-3 py-1.5 text-xs text-yellow-700"
      >
        <span class="font-medium">Hibernating</span>
        <span class="text-yellow-500">·</span>
        <span
          >Will resume from: <span class="font-semibold">{descriptor.hibernation_origin}</span
          ></span
        >
      </div>
    {/if}

    {#if descriptor.lifecycle_stage === 'Deprecated' && descriptor.successor_ndo_hash}
      <div
        class="mt-2 flex items-center gap-2 rounded bg-orange-50 px-3 py-1.5 text-xs text-orange-700"
      >
        <span class="font-medium">Deprecated</span>
        <span class="text-orange-400">·</span>
        <span
          >Succeeded by:
          <a
            href={paths.ndoDetail(descriptor.successor_ndo_hash)}
            class="font-mono underline hover:text-orange-900"
            >{descriptor.successor_ndo_hash.slice(0, 12)}…</a
          >
        </span>
      </div>
    {/if}

    <!-- Lifecycle history panel -->
    {#if ndoActionHash}
      <TransitionHistoryPanel ndoHash={ndoActionHash} />
    {/if}
  {/if}
</div>
