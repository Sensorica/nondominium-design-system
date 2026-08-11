<script lang="ts">
  import type { ActiveFilters, NdoDescriptor } from '../../../domain/types.js';
  import NdoBrowser from './NdoBrowser.svelte';

  interface Props {
    descriptors: NdoDescriptor[];
    activeFilters?: ActiveFilters;
    isLoading?: boolean;
    errorMessage?: string | null;
    agentName?: string | null;
    ndoHref?: (hash: string) => string;
    onfilterchange?: (partial: Partial<ActiveFilters>) => void;
    onclearfilters?: () => void;
  }

  let {
    descriptors,
    activeFilters,
    isLoading = false,
    errorMessage = null,
    agentName = null,
    ndoHref,
    onfilterchange,
    onclearfilters
  }: Props = $props();
</script>

<div class="flex min-h-full flex-col p-6">
  <header class="mb-6">
    <h1 class="text-2xl font-bold text-gray-900">Browse NDOs</h1>
    <p class="mt-1 text-gray-600">All NDOs across your groups.</p>
    {#if agentName}
      <p class="mt-2 text-sm text-gray-500">
        Agent: <span class="font-medium text-gray-800">{agentName}</span>
      </p>
    {/if}
  </header>

  <NdoBrowser
    {descriptors}
    {activeFilters}
    {isLoading}
    {errorMessage}
    {ndoHref}
    {onfilterchange}
    {onclearfilters}
  />
</div>
