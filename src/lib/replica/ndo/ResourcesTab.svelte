<script lang="ts">
  // Copy of ui/src/lib/components/ndo/ResourcesTab.svelte.
  // Markup below is byte-identical; the Effect service calls become synchronous
  // lookups, and the ActionHash prop becomes the base64 string the prototype
  // routes on.
  import { onMount } from 'svelte';
  import type {
    CellId,
    EconomicResourceRow,
    LifecycleStage,
    PropertyRegime,
    ResourceSpecificationListing
  } from '../types';
  import { resourceService, resourceStore } from '../stores.svelte';
  import { urlParam } from '../url-state.svelte';
  import { operationalStateLabel } from '../operational-state-labels';
  import SpecificationCreateModal from './SpecificationCreateModal.svelte';

  interface Props {
    /** NDO Layer 0 action hash (prop name kept for NdoView compatibility). */
    specActionHash: string;
    /** The NDO's own clone cell; null for legacy NDOs in the shared cell. */
    ndoCellId?: CellId | null;
    lifecycleStage?: LifecycleStage | string | null;
    /** Layer 0 property regime; forwarded so the create form can lock scope (REQ-RES-03). */
    propertyRegime?: PropertyRegime | string | null;
  }

  let {
    specActionHash,
    ndoCellId = null,
    lifecycleStage = null,
    propertyRegime = null
  }: Props = $props();

  // The app's shape: a listing per Layer 1 specification, each with its own
  // inventoried instances, keyed by spec hash. The replica held a flat row list
  // and a global table, which could not express "this NDO has three specs and
  // only one of them has resources" — the state the Resources tab exists to show.
  let listings = $state<ResourceSpecificationListing[]>([]);
  let instancesBySpec = $state<Map<string, EconomicResourceRow[]>>(new Map());
  let loadError = $state<string | null>(null);
  let showCreateModal = $state(false);

  // The app's gate, copied unchanged. Layer 1 activation is refused at the four
  // stages where an NDO has no form worth specifying yet or has left service.
  // These are the same four the screen map already pins as ndo-bare (Ideation),
  // ndo-hibernating, ndo-deprecated and ndo-terminal, which is why the blocked
  // notice needs no key of its own.
  const ineligibleStages = new Set(['Ideation', 'Hibernating', 'Deprecated', 'EndOfLife']);
  const canCreateSpec = $derived(!lifecycleStage || !ineligibleStages.has(lifecycleStage));

  function load() {
    loadError = null;
    listings = resourceStore.resourceSpecificationListings.filter(
      (l) => l.specification.ndo_identity_hash === specActionHash
    );
    const next = new Map<string, EconomicResourceRow[]>();
    for (const listing of listings) {
      next.set(listing.action_hash.toString(), resourceService.getResourcesBySpecification(listing.action_hash));
    }
    instancesBySpec = next;
  }

  // The screen map addresses this modal by key, so it must open from the URL as
  // well as from the button. Without this the key resolves to a page that
  // renders the tab with the modal shut, and the screen would be listed as
  // covered while showing nothing.
  $effect(() => {
    if (urlParam('modal') === 'spec-create') showCreateModal = true;
  });

  onMount(load);
</script>

{#if showCreateModal}
  <SpecificationCreateModal
    ndoActionHash={specActionHash}
    {ndoCellId}
    {lifecycleStage}
    {propertyRegime}
    onclose={() => {
      showCreateModal = false;
    }}
    oncreated={() => {
      load();
    }}
  />
{/if}

<div class="space-y-4">
  <div class="flex items-center justify-between gap-3">
    <div>
      <h3 class="text-base font-semibold text-gray-900">Layer 1 specifications</h3>
      <p class="text-xs text-gray-500">Resource specifications linked to this NDO.</p>
    </div>
    <button
      type="button"
      disabled={!canCreateSpec}
      title={!canCreateSpec
        ? `Cannot create while NDO is ${lifecycleStage}`
        : 'Create a Layer 1 specification'}
      onclick={() => {
        showCreateModal = true;
      }}
      class="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      + New specification
    </button>
  </div>

  {#if !canCreateSpec}
    <p class="rounded border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-800">
      Layer 1 activation is blocked while the NDO is <strong>{lifecycleStage}</strong>. Advance the
      lifecycle first.
    </p>
  {/if}

  {#if loadError}
    <p class="text-sm text-red-600">{loadError}</p>
  {:else if listings.length === 0}
    <p class="text-sm text-gray-500">No resource specifications for this NDO yet.</p>
  {:else}
    <div class="space-y-4">
      {#each listings as listing (listing.action_hash.toString())}
        {@const instances = instancesBySpec.get(listing.action_hash.toString()) ?? []}
        <div class="rounded border border-gray-200 bg-white p-4">
          <div class="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div class="font-medium text-gray-900">{listing.specification.name}</div>
              <div class="mt-0.5 text-xs text-gray-500">
                {listing.specification.category ?? '—'} · scope
                {listing.specification.scope ?? '—'} ·
                {listing.specification.is_active !== false ? 'active' : 'inactive'}
              </div>
              {#if listing.specification.description}
                <p class="mt-2 text-sm text-gray-600">{listing.specification.description}</p>
              {/if}
            </div>
          </div>

          <h4 class="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Economic resources
          </h4>
          {#if instances.length === 0}
            <p class="mt-1 text-sm text-gray-500">No inventoried resources for this specification.</p>
          {:else}
            <ul class="mt-1 space-y-2">
              {#each instances as row, i (i)}
                <li class="rounded border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                  <span class="font-medium">Qty</span> {row.resource.quantity}
                  {row.resource.unit} ·
                  <span class="font-medium">Operational state</span>
                  {operationalStateLabel(row.resource.operational_state)}
                </li>
              {/each}
            </ul>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>
