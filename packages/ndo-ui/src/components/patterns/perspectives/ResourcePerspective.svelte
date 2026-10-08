<script lang="ts">
  import type { ActiveFilters, NdoDescriptor } from '../../../domain/types.js';
  import { applyNdoFilters, EMPTY_FILTERS } from '../../../domain/filter-logic.js';
  import {
    OWNERSHIP_SCOPE_OPTIONS,
    RESOURCE_SORT_OPTIONS,
    scopeNdos,
    searchNdos,
    sortNdos,
    type ScopeFilter,
    type SortKey
  } from '../../../domain/resource-perspective.js';
  import NdoBrowser from '../lobby/NdoBrowser.svelte';

  interface Props {
    /** NDOs of the current group (Layer 0: Perspectives are group-scoped). */
    ndos: NdoDescriptor[];
    /** The current agent's key, matched against `descriptor.initiator`. */
    myAgentKey?: string | null;
    /** Hashes of the NDOs the current agent has joined. */
    joinedHashes?: readonly string[];
    isLoading?: boolean;
    errorMessage?: string | null;
    ndoHref?: (hash: string) => string;
    /** Absolute link copied by "Copy link"; defaults to `ndoHref`. */
    ndoLink?: (hash: string) => string;
    oncreateclick?: () => void;
  }

  let {
    ndos,
    myAgentKey = null,
    joinedHashes = [],
    isLoading = false,
    errorMessage = null,
    ndoHref = (hash) => `/ndo/${encodeURIComponent(hash)}`,
    ndoLink,
    oncreateclick
  }: Props = $props();

  let query = $state('');
  let sort = $state<SortKey>('newest');
  let scope = $state<ScopeFilter>('all');
  let activeFilters = $state<ActiveFilters>({ ...EMPTY_FILTERS });
  let copiedHash = $state<string | null>(null);

  const visible = $derived(
    sortNdos(
      applyNdoFilters(searchNdos(scopeNdos(ndos, scope, myAgentKey, joinedHashes), query), activeFilters),
      sort
    )
  );

  const emptyMessage = $derived.by(() => {
    if (ndos.length === 0) return 'No NDOs yet. Create one from within this group.';
    if (query.trim()) return `No NDOs match “${query.trim()}”.`;
    if (scope === 'mine') return 'You have not created an NDO in this group yet.';
    if (scope === 'joined') return 'You have not joined an NDO in this group yet.';
    return 'No NDOs yet. Create one from within this group.';
  });

  async function copyLink(hash: string, e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const link = (ndoLink ?? ndoHref)(hash);
    try {
      await navigator.clipboard.writeText(link);
      copiedHash = hash;
      setTimeout(() => {
        if (copiedHash === hash) copiedHash = null;
      }, 2000);
    } catch {
      // clipboard unavailable
    }
  }
</script>

<div data-testid="resource-perspective" class="space-y-3">
  <div
    class="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm"
  >
    <label class="flex min-w-[14rem] flex-1 items-center gap-2 text-sm text-gray-500">
      <span class="sr-only">Search NDOs</span>
      <span aria-hidden="true">🔍</span>
      <input
        type="search"
        bind:value={query}
        placeholder="Search by name or description"
        data-testid="resource-search"
        class="w-full rounded border border-gray-300 px-2 py-1 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none"
      />
    </label>

    <div class="flex items-center gap-1" role="group" aria-label="Show">
      {#each OWNERSHIP_SCOPE_OPTIONS as o (o.id)}
        <button
          type="button"
          data-scope={o.id}
          aria-pressed={scope === o.id}
          onclick={() => (scope = o.id)}
          class="rounded border px-2.5 py-1 text-xs font-medium transition-colors {scope === o.id
            ? 'border-blue-300 bg-blue-50 text-blue-700'
            : 'border-gray-200 text-gray-600 hover:bg-gray-50'}"
        >
          {o.label}
        </button>
      {/each}
    </div>

    <label class="flex items-center gap-2 text-xs text-gray-500">
      Sort
      <select
        bind:value={sort}
        data-testid="resource-sort"
        class="rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700"
      >
        {#each RESOURCE_SORT_OPTIONS as o (o.id)}
          <option value={o.id}>{o.label}</option>
        {/each}
      </select>
    </label>
  </div>

  <NdoBrowser
    descriptors={visible}
    {activeFilters}
    {isLoading}
    {errorMessage}
    {ndoHref}
    {emptyMessage}
    onfilterchange={(f) => (activeFilters = { ...activeFilters, ...f })}
    onclearfilters={() => (activeFilters = { ...EMPTY_FILTERS })}
  >
    {#snippet cardAction(d)}
      <button
        type="button"
        data-testid="copy-ndo-link"
        title="Copy NDO link"
        onclick={(e) => copyLink(d.hash, e)}
        class="absolute top-3 right-3 rounded border border-gray-200 bg-white/90 px-1.5 py-0.5 text-[11px] text-gray-500 hover:bg-white hover:text-gray-800"
      >
        {copiedHash === d.hash ? 'Link copied' : '🔗 Copy link'}
      </button>
    {/snippet}
  </NdoBrowser>

  {#if oncreateclick && ndos.length === 0 && !isLoading}
    <div class="text-center">
      <button
        type="button"
        onclick={oncreateclick}
        class="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Create the first NDO
      </button>
    </div>
  {/if}
</div>
