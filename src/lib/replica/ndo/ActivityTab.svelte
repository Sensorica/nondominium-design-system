<script lang="ts">
  // Copy of ui/src/lib/components/ndo/ActivityTab.svelte from the app at
  // 3cbebf0fb08ecc9070bc22d290ca23b250b56da9. Script and markup are the app's.
  //
  // Wiring only: imports are repointed, the Effect programs become calls on the
  // mock services, and the two creation forms also open from ?modal= so the
  // screen map can address them. Hash types alias to base64 strings here, so
  // encodeHashToBase64 is identity; it is shimmed rather than deleted so the
  // filters stay byte-identical to the app's.
  import type {
    ActionHash,
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
  import { bindUrlModal } from '../url-state.svelte';
  import CommitmentCreateForm from './CommitmentCreateForm.svelte';
  import EconomicEventCreateForm from './EconomicEventCreateForm.svelte';

  const encodeHashToBase64 = (h: string): string => h;

  interface Props {
    /** NDO Layer 0 action hash. */
    specActionHash: ActionHash;
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
    try {
      const all = await governanceStore.fetchAllCommitments(ndoCellId ?? undefined);
      commitments = all;

      const listings = await resourceStore.fetchSpecificationsForNdo(
        specActionHash,
        ndoCellId ?? undefined
      );
      const merged: VfEconomicEvent[] = [];
      for (const listing of listings) {
        for (const row of resourceService.getResourcesBySpecification(listing.action_hash)) {
          merged.push(...governanceService.getEventsByResource(row.actionHash));
        }
      }
      // Also include any agent-wide events that carry this ndo hash
      for (const ev of governanceService.getAllEconomicEvents(ndoCellId ?? undefined)) {
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
      events = merged.sort((a, b) => Number(b.event_time) - Number(a.event_time));
    } catch {
      loadError = 'Failed to load activity for this NDO';
      events = [];
      commitments = [];
    }
  }

  // Wiring: the screen map addresses both forms by key, so they also open from
  // the URL, and closing one clears that param again. The app holds them in
  // local state only.
  bindUrlModal(
    'modal',
    'commitment',
    { get: () => showCommitment, set: (open) => (showCommitment = open) },
    { tab: 'activity' }
  );
  bindUrlModal(
    'modal',
    'event',
    { get: () => showEvent, set: (open) => (showEvent = open) },
    { tab: 'activity' }
  );

  $effect(() => {
    void specActionHash;
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
      void load();
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
      void load();
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
