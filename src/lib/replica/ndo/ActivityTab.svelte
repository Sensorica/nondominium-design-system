<script lang="ts">
  // Copy of ui/src/lib/components/ndo/ActivityTab.svelte from the app at
  // 20adb117219de3e7a1a45b53d8a02fc0602feb7e.
  //
  // #132 turned this tab from an events list into the NDO's action surface: it
  // now tracks commitments as well as events, filters both by ndo_identity_hash
  // rather than walking each inventoried resource, and carries the two creation
  // forms behind a canAct gate. The replica had only the old events walk.
  //
  // Hash types alias to base64 strings here, so encodeHashToBase64 is identity.
  // It is shimmed rather than deleted so the two filters stay byte-identical to
  // the app's, which is what makes a later diff of this file mean anything.
  import { onMount } from 'svelte';
  import type {
    CellId,
    PropertyRegime,
    ResourceNature,
    Rivalry,
    VfCommitment,
    VfEconomicEvent
  } from '../types';
  import {
    governanceService,
    governanceStore,
    resourceService,
    resourceStore
  } from '../stores.svelte';
  import { urlParam } from '../url-state.svelte';
  import CommitmentCreateForm from './CommitmentCreateForm.svelte';
  import EconomicEventCreateForm from './EconomicEventCreateForm.svelte';

  const encodeHashToBase64 = (h: string): string => h;

  interface Props {
    /** NDO Layer 0 action hash. */
    specActionHash: string;
    /** The NDO's own clone cell; null for legacy NDOs in the shared cell. */
    ndoCellId?: CellId | null;
    propertyRegime?: string | null;
    resourceNature?: string | null;
    rivalryOverride?: string | null;
  }

  let {
    specActionHash,
    ndoCellId = null,
    propertyRegime = null,
    resourceNature = null,
    rivalryOverride = null
  }: Props = $props();

  let events = $state<VfEconomicEvent[]>([]);
  let commitments = $state<VfCommitment[]>([]);
  let loadError = $state<string | null>(null);
  let showCommitment = $state(false);
  let showEvent = $state(false);

  // A commitment or event is written against a classification pair, so both must
  // be known before either form can build one. Same gate as the rule editor.
  const canAct = $derived(propertyRegime != null && resourceNature != null);

  const ndoCommitments = $derived(
    commitments.filter(
      (c) => encodeHashToBase64(c.ndo_identity_hash) === encodeHashToBase64(specActionHash)
    )
  );

  const ndoEvents = $derived(
    events.filter(
      (e) => encodeHashToBase64(e.ndo_identity_hash) === encodeHashToBase64(specActionHash)
    )
  );

  async function load() {
    loadError = null;

    // Commitments: the app fetches every commitment on the cell unfiltered and
    // lets the ndoCommitments derivation below do the filtering, so the screen
    // costs what the whole cell costs rather than what this NDO costs. A
    // pre-filtered read produces identical rows and quietly removes the shape
    // that makes the performance question askable, which is the replica being
    // better than the app and thereby ceasing to be evidence about it.
    commitments = await governanceStore.fetchAllCommitments();

    // Events, both passes, matching the app.
    //
    // First: walk this NDO's SPECIFICATIONS, then each specification's
    // resources, then each resource's events. Walking resources keyed by the NDO
    // hash instead, as this did until now, happens to return the same rows
    // because the seeded fixture keys them that way. That was right by accident
    // of the fixture rather than by shape, and it passed the typecheck, the
    // class comparison and a browser pass while being the wrong query.
    const merged: VfEconomicEvent[] = [];
    for (const listing of resourceStore.resourceSpecificationListings.filter(
      (l) => l.specification.ndo_identity_hash === specActionHash
    )) {
      for (const row of resourceService.getResourcesBySpecification(listing.action_hash)) {
        merged.push(...governanceService.getEventsByResource(row.actionHash));
      }
    }

    // Second: the app's own "Also include any agent-wide events that carry this
    // ndo hash". This catches an event tagged to this NDO whose resource hangs
    // off another specification, which the walk above cannot reach. The dedupe
    // key is the app's, event_time plus action plus resource_quantity.
    for (const ev of governanceService.getAllEconomicEvents()) {
      if (
        encodeHashToBase64(ev.ndo_identity_hash) === encodeHashToBase64(specActionHash) &&
        !merged.some(
          (m) =>
            m.event_time === ev.event_time &&
            m.action === ev.action &&
            m.resource_quantity === ev.resource_quantity
        )
      ) {
        merged.push(ev);
      }
    }

    events = merged.sort(
      (a: VfEconomicEvent, b: VfEconomicEvent) => Number(b.event_time) - Number(a.event_time)
    );
  }

  // The screen map addresses this modal by key, so it must open from the URL as
  // well as from the button. Without this the key resolves to a page that
  // renders the tab with the modal shut, and the screen would be listed as
  // covered while showing nothing.
  $effect(() => {
    const m = urlParam('modal');
    if (m === 'commitment') showCommitment = true;
    if (m === 'event') showEvent = true;
  });

  onMount(() => {
    void load();
  });
</script>

{#if showCommitment && canAct}
  <CommitmentCreateForm
    ndoActionHash={specActionHash}
    {ndoCellId}
    propertyRegime={propertyRegime as PropertyRegime}
    resourceNature={resourceNature as ResourceNature}
    rivalryOverride={(rivalryOverride as Rivalry | null) ?? undefined}
    onclose={() => {
      showCommitment = false;
    }}
    oncreated={() => {
      load();
    }}
  />
{/if}

{#if showEvent && canAct}
  <EconomicEventCreateForm
    ndoActionHash={specActionHash}
    {ndoCellId}
    propertyRegime={propertyRegime as PropertyRegime}
    resourceNature={resourceNature as ResourceNature}
    rivalryOverride={(rivalryOverride as Rivalry | null) ?? undefined}
    pendingCommitments={ndoCommitments}
    onclose={() => {
      showEvent = false;
    }}
    oncreated={() => {
      load();
    }}
  />
{/if}

<div class="space-y-6">
  <div class="flex flex-wrap items-center justify-between gap-3">
    <div>
      <h3 class="text-base font-semibold text-gray-900">Activity</h3>
      <p class="text-xs text-gray-500">
        Commitments and events for this NDO (client-filtered by <code>ndo_identity_hash</code>).
      </p>
    </div>
    <div class="flex gap-2">
      <button
        type="button"
        disabled={!canAct}
        onclick={() => {
          showCommitment = true;
        }}
        class="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        + New commitment
      </button>
      <button
        type="button"
        disabled={!canAct}
        onclick={() => {
          showEvent = true;
        }}
        class="rounded border border-blue-300 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-50"
      >
        + New event
      </button>
    </div>
  </div>

  {#if loadError}
    <p class="text-sm text-red-600">{loadError}</p>
  {/if}

  <section>
    <h4 class="mb-2 text-sm font-semibold text-gray-800">Commitments</h4>
    {#if ndoCommitments.length === 0}
      <p class="text-sm text-gray-500">No commitments for this NDO yet.</p>
    {:else}
      <ul class="space-y-2">
        {#each ndoCommitments as c, i (i)}
          <li class="rounded border border-gray-200 bg-white p-3 text-sm">
            <div class="font-medium text-gray-900">{c.action}</div>
            <div class="mt-1 text-gray-600">
              Due {new Date(Number(c.due_date) / 1000).toLocaleString()}
            </div>
            {#if c.note}
              <div class="mt-1 text-xs text-gray-500">{c.note}</div>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
  </section>

  <section>
    <h4 class="mb-2 text-sm font-semibold text-gray-800">Economic events</h4>
    {#if ndoEvents.length === 0}
      <p class="text-sm text-gray-500">No events recorded for this NDO yet.</p>
    {:else}
      <ul class="space-y-2">
        {#each ndoEvents as ev, i (i)}
          <li class="rounded border border-gray-200 bg-white p-3 text-sm">
            <div class="font-medium text-gray-900">{ev.action}</div>
            <div class="mt-1 text-gray-600">
              Qty {ev.resource_quantity} · {new Date(Number(ev.event_time) / 1000).toLocaleString()}
            </div>
            {#if ev.note}
              <div class="mt-1 text-xs text-gray-500">{ev.note}</div>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
  </section>
</div>
