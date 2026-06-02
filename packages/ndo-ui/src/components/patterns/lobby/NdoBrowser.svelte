<script lang="ts">
  import type { ActiveFilters, LifecycleStage, NdoDescriptor, PropertyRegime, ResourceNature } from '../../../domain/types.js';
  import {
    ALL_LIFECYCLE_STAGES,
    ALL_RESOURCE_NATURES,
    MVP_REGIMES
  } from '../../../domain/enums.js';
  import {
    STAGE_FILTER_COLORS,
    NATURE_COLORS,
    REGIME_FILTER_COLORS
  } from '../../../domain/variants.js';
  import { hasActiveFilters } from '../../../domain/filter-logic.js';
  import NdoCard from '../../primitives/NdoCard.svelte';

  interface Props {
    descriptors: NdoDescriptor[];
    isLoading?: boolean;
    errorMessage?: string | null;
    activeFilters?: ActiveFilters;
    ndoHref?: (hash: string) => string;
    onfilterchange?: (partial: Partial<ActiveFilters>) => void;
    onclearfilters?: () => void;
  }

  let {
    descriptors,
    isLoading = false,
    errorMessage = null,
    activeFilters = { stages: [], natures: [], regimes: [] },
    ndoHref = (hash) => `/ndo/${encodeURIComponent(hash)}`,
    onfilterchange,
    onclearfilters
  }: Props = $props();

  function toggleStage(s: LifecycleStage) {
    const current = activeFilters.stages;
    const next = current.includes(s) ? current.filter((x) => x !== s) : [...current, s];
    onfilterchange?.({ stages: next });
  }

  function toggleNature(n: ResourceNature) {
    const current = activeFilters.natures;
    const next = current.includes(n) ? current.filter((x) => x !== n) : [...current, n];
    onfilterchange?.({ natures: next });
  }

  function toggleRegime(r: PropertyRegime) {
    const current = activeFilters.regimes;
    const next = current.includes(r) ? current.filter((x) => x !== r) : [...current, r];
    onfilterchange?.({ regimes: next });
  }

  const filtersActive = $derived(hasActiveFilters(activeFilters));
</script>

<section class="rounded-lg border border-gray-200 bg-white shadow-sm">
  <div class="border-b border-gray-100 px-4 py-3">
    <div class="flex flex-wrap items-center gap-1.5">
      <span class="mr-1 text-xs font-semibold text-gray-500 uppercase">Stage:</span>
      {#each ALL_LIFECYCLE_STAGES as s}
        <button
          type="button"
          onclick={() => toggleStage(s)}
          class="rounded border px-2 py-0.5 text-xs font-medium transition-opacity {STAGE_FILTER_COLORS[s]} {activeFilters.stages.includes(s)
            ? 'ring-2 ring-offset-1 ring-current'
            : 'opacity-60 hover:opacity-100'}"
        >
          {s}
        </button>
      {/each}
    </div>

    <div class="mt-2 flex flex-wrap items-center gap-1.5">
      <span class="mr-1 text-xs font-semibold text-gray-500 uppercase">Nature:</span>
      {#each ALL_RESOURCE_NATURES as n}
        <button
          type="button"
          onclick={() => toggleNature(n)}
          class="rounded border px-2 py-0.5 text-xs font-medium transition-opacity {NATURE_COLORS[n]} {activeFilters.natures.includes(n)
            ? 'ring-2 ring-offset-1 ring-current'
            : 'opacity-60 hover:opacity-100'}"
        >
          {n}
        </button>
      {/each}
    </div>

    <div class="mt-2 flex flex-wrap items-center gap-1.5">
      <span class="mr-1 text-xs font-semibold text-gray-500 uppercase">Regime:</span>
      {#each MVP_REGIMES as r}
        <button
          type="button"
          onclick={() => toggleRegime(r)}
          class="rounded border border-dashed px-2 py-0.5 text-xs font-medium transition-opacity {REGIME_FILTER_COLORS[r]} {activeFilters.regimes.includes(r)
            ? 'ring-2 ring-offset-1 ring-current'
            : 'opacity-60 hover:opacity-100'}"
        >
          {r}
        </button>
      {/each}
    </div>

    {#if filtersActive}
      <div class="mt-2">
        <button
          type="button"
          onclick={() => onclearfilters?.()}
          class="text-xs text-gray-400 hover:text-gray-700 underline"
        >
          Clear filters
        </button>
      </div>
    {/if}
  </div>

  <div class="p-4">
    <div class="mb-3 flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-900">
        NDO browser
        {#if filtersActive}
          <span class="ml-1 text-sm font-normal text-gray-400">({descriptors.length} results)</span>
        {/if}
      </h2>
      {#if isLoading}
        <span class="text-sm text-gray-500">Loading…</span>
      {/if}
    </div>

    {#if errorMessage}
      <p class="mb-3 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
        {errorMessage}
      </p>
    {/if}

    {#if descriptors.length === 0 && !isLoading}
      <p class="text-sm text-gray-500">
        {filtersActive
          ? 'No NDOs match the selected filters.'
          : 'No NDOs yet. Create one from within a group.'}
      </p>
    {:else}
      <ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {#each descriptors as d (d.hash)}
          <li>
            <NdoCard descriptor={d} href={ndoHref(d.hash)} />
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</section>
