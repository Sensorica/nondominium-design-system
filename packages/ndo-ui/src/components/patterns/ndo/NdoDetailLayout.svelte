<script lang="ts">
  import type { NdoDescriptor, NdoTransitionHistoryEvent } from '../../../domain/types.js';
  import { truncateHash } from '../../../domain/format.js';
  import NdoIdentityPanel from './NdoIdentityPanel.svelte';
  import ForkNdoModal from './ForkNdoModal.svelte';
  import ResourcesTabStub from './ResourcesTabStub.svelte';
  import GovernanceTabStub from './GovernanceTabStub.svelte';
  import ActivityTabStub from './ActivityTabStub.svelte';
  import CompositionTabStub from './CompositionTabStub.svelte';
  import NdoButton from '../../primitives/NdoButton.svelte';

  type TabId = 'resources' | 'governance' | 'composition' | 'activity';

  interface Props {
    descriptor: NdoDescriptor | null;
    isLoading?: boolean;
    loadError?: string | null;
    initiatorName?: string | null;
    initiatorHref?: string | null;
    transitionHistory?: NdoTransitionHistoryEvent[];
    isInitiator?: boolean;
    showFork?: boolean;
    showAssociate?: boolean;
    showJoin?: boolean;
    onrefresh?: () => void;
    ontransitionclick?: () => void;
    onassociateclick?: () => void;
  }

  let {
    descriptor,
    isLoading = false,
    loadError = null,
    initiatorName = null,
    initiatorHref = null,
    transitionHistory = [],
    isInitiator = false,
    showFork = true,
    showAssociate = true,
    showJoin = true,
    onrefresh,
    ontransitionclick,
    onassociateclick
  }: Props = $props();

  let tab = $state<TabId>('resources');
  let showForkModal = $state(false);
  let showJoinSoon = $state(false);

  const tabs: { id: TabId; label: string }[] = [
    { id: 'resources', label: 'Resources' },
    { id: 'governance', label: 'Governance' },
    { id: 'composition', label: 'Composition' },
    { id: 'activity', label: 'Activity' }
  ];
</script>

{#if showForkModal && descriptor}
  <ForkNdoModal {descriptor} onclose={() => { showForkModal = false; }} />
{/if}

<div class="border-b border-gray-200 bg-white px-6 pt-4">
  <div class="flex items-start justify-between">
    <div>
      {#if isLoading}
        <div class="mb-1 h-6 w-40 animate-pulse rounded bg-gray-200"></div>
      {:else if loadError}
        <h1 class="text-xl font-bold text-red-600">Failed to load NDO</h1>
      {:else}
        <h1 class="text-xl font-bold text-gray-900">{descriptor?.name ?? 'NDO'}</h1>
      {/if}
      {#if descriptor?.hash}
        <p class="mt-1 font-mono text-xs text-gray-400">{truncateHash(descriptor.hash, 20)}</p>
      {/if}
    </div>
    <div class="ml-4 flex shrink-0 items-center gap-2">
      {#if showJoin}
        <div class="relative">
          <NdoButton variant="ghost" class="px-3 py-1.5 text-xs" onclick={() => { showJoinSoon = !showJoinSoon; }}>
            Join NDO
          </NdoButton>
          {#if showJoinSoon}
            <div class="absolute right-0 top-full z-10 mt-1 whitespace-nowrap rounded border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-500 shadow-md">
              Coming soon
            </div>
          {/if}
        </div>
      {/if}
      {#if showAssociate}
        <NdoButton variant="ghost" class="border-blue-300 text-blue-600 hover:bg-blue-50 px-3 py-1.5 text-xs" onclick={() => onassociateclick?.()}>
          Associate with a group
        </NdoButton>
      {/if}
      {#if showFork && descriptor}
        <NdoButton variant="ghost" class="px-3 py-1.5 text-xs" onclick={() => { showForkModal = true; }}>
          Fork this NDO
        </NdoButton>
      {/if}
    </div>
  </div>
  <nav class="mt-4 flex gap-2" aria-label="NDO sections">
    {#each tabs as t}
      <button
        type="button"
        class="rounded-t border border-b-0 px-3 py-2 text-sm font-medium transition-colors {tab === t.id
          ? 'border-gray-200 bg-gray-50 text-gray-900'
          : 'border-transparent text-gray-500 hover:text-gray-800'}"
        onclick={() => { tab = t.id; }}
      >
        {t.label}
      </button>
    {/each}
  </nav>
</div>

{#if loadError}
  <div class="mx-6 mt-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
    {loadError}
    <button type="button" onclick={() => onrefresh?.()} class="ml-3 underline hover:text-red-900">Retry</button>
  </div>
{/if}

{#if descriptor}
  <div class="mx-6 mt-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {#if descriptor.description}
        <div class="sm:col-span-2">
          <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">Description</p>
          <p class="mt-1 text-sm text-gray-800">{descriptor.description}</p>
        </div>
      {/if}
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">Property regime</p>
        <p class="mt-1 text-sm font-medium text-gray-800">{descriptor.property_regime ?? '—'}</p>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">Resource nature</p>
        <p class="mt-1 text-sm font-medium text-gray-800">{descriptor.resource_nature ?? '—'}</p>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-gray-400">Lifecycle stage</p>
        <p class="mt-1 text-sm font-medium text-gray-800">{descriptor.lifecycle_stage ?? '—'}</p>
      </div>
    </div>
  </div>
{/if}

<NdoIdentityPanel
  {descriptor}
  {initiatorName}
  {initiatorHref}
  {transitionHistory}
  {isInitiator}
  {ontransitionclick}
  {onrefresh}
/>

<div class="p-6">
  {#if tab === 'resources'}
    <ResourcesTabStub />
  {:else if tab === 'governance'}
    <GovernanceTabStub />
  {:else if tab === 'composition'}
    <CompositionTabStub />
  {:else}
    <ActivityTabStub />
  {/if}
</div>
