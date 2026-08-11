<script lang="ts">
  // Copy of ui/src/lib/components/ndo/ResourcesTab.svelte.
  // Markup below is byte-identical; the Effect service calls become synchronous
  // lookups, and the ActionHash prop becomes the base64 string the prototype
  // routes on.
  import { onMount } from 'svelte';
  import type { EconomicResourceRow } from '../types';
  import { resourceService, resourceStore } from '../stores.svelte';

  interface Props {
    specActionHash: string;
  }

  let { specActionHash }: Props = $props();

  let instances = $state<EconomicResourceRow[]>([]);
  let loadError = $state<string | null>(null);

  const specName = $derived(
    resourceStore.resourceSpecificationListings.find(
      (l) => l.action_hash.toString() === specActionHash.toString()
    )?.specification.name ?? 'This specification'
  );

  onMount(() => {
    instances = resourceService.getResourcesBySpecification(specActionHash);
    loadError = null;
  });
</script>

<div class="space-y-4">
  <h3 class="text-base font-semibold text-gray-900">Specification</h3>
  <p class="text-sm text-gray-600">{specName}</p>

  <h3 class="text-base font-semibold text-gray-900">All resource specifications</h3>
  <div class="overflow-x-auto rounded border border-gray-200">
    <table class="min-w-full text-left text-sm">
      <thead class="bg-gray-50 text-gray-600">
        <tr>
          <th class="px-3 py-2">Name</th>
          <th class="px-3 py-2">Category</th>
          <th class="px-3 py-2">Active</th>
        </tr>
      </thead>
      <tbody>
        {#each resourceStore.resourceSpecificationListings as listing (listing.action_hash.toString())}
          <tr
            class:bg-blue-50={listing.action_hash.toString() === specActionHash.toString()}
            class="border-t border-gray-100"
          >
            <td class="px-3 py-2 font-medium">{listing.specification.name}</td>
            <td class="px-3 py-2">{listing.specification.category ?? '—'}</td>
            <td class="px-3 py-2">{listing.specification.is_active !== false ? 'yes' : 'no'}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h3 class="text-base font-semibold text-gray-900">Economic resources (this spec)</h3>
  {#if loadError}
    <p class="text-sm text-red-600">{loadError}</p>
  {:else if instances.length === 0}
    <p class="text-sm text-gray-500">No inventoried resources for this specification yet.</p>
  {:else}
    <ul class="space-y-2">
      {#each instances as row, i (i)}
        <li class="rounded border border-gray-200 bg-white p-3 text-sm">
          <span class="font-medium">Qty</span> {row.resource.quantity} {row.resource.unit} ·
          <span class="font-medium">State</span>
          {row.resource.state}
        </li>
      {/each}
    </ul>
  {/if}
</div>
