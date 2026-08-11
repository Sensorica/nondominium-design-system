<script lang="ts">
  // Copy of ui/src/lib/components/ndo/ActivityTab.svelte.
  // Production walks every inventoried resource for the spec and merges their
  // events; the replica does the same walk against mock state, so an NDO with
  // no resources shows the same empty state for the same reason.
  import { onMount } from 'svelte';
  import type { VfEconomicEvent } from '../types';
  import { governanceService, resourceService } from '../stores.svelte';

  interface Props {
    specActionHash: string;
  }

  let { specActionHash }: Props = $props();

  let events = $state<VfEconomicEvent[]>([]);
  let loadError = $state<string | null>(null);

  onMount(() => {
    const rows = resourceService.getResourcesBySpecification(specActionHash);
    const merged: VfEconomicEvent[] = [];
    for (const row of rows) {
      merged.push(...governanceService.getEventsByResource(row.actionHash));
    }
    events = merged.sort((a, b) => Number(b.event_time) - Number(a.event_time));
    loadError = null;
  });
</script>

<div>
  <h3 class="mb-2 text-base font-semibold text-gray-900">Economic events</h3>
  <p class="mb-3 text-xs text-gray-500">
    Events are loaded per inventoried resource (`get_events_for_resource`) for all instances of this
    specification.
  </p>
  {#if loadError}
    <p class="text-sm text-red-600">{loadError}</p>
  {:else if events.length === 0}
    <p class="text-sm text-gray-500">No events recorded for resources under this specification.</p>
  {:else}
    <ul class="space-y-2">
      {#each events as ev, i (i)}
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
</div>
