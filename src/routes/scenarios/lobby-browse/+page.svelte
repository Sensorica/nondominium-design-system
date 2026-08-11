<script lang="ts">
  // Composed from the real NdoBrowser, so what you filter here is what the app
  // filters. The claim under review is the filter algebra, which is the one
  // part of this screen you cannot check by looking at a single component.
  import { paths } from '$lib/paths';
  import NdoBrowser from '$lib/replica/lobby/NdoBrowser.svelte';
  import { INITIAL_NDOS } from '$lib/replica/mock';
  import type { ActiveFilters } from '$lib/replica/types';

  let activeFilters = $state<ActiveFilters>({ stages: ['Active', 'Distributed'], natures: [], regimes: [] });

  const filtered = $derived(
    INITIAL_NDOS.filter((d) => {
      const { stages, natures, regimes } = activeFilters;
      const stageOk = stages.length === 0 || stages.includes(d.lifecycle_stage as never);
      const natureOk = natures.length === 0 || natures.includes(d.resource_nature as never);
      const regimeOk = regimes.length === 0 || regimes.includes(d.property_regime as never);
      return stageOk && natureOk && regimeOk;
    })
  );
</script>

<div class="p-6">
  <header class="mb-6">
    <h1 class="text-2xl font-bold text-gray-900">Lobby browse</h1>
    <p class="mt-2 max-w-2xl text-sm text-gray-600">
      The lobby is the only surface that needs no identity at all: no profile, no group, no Person
      entry. That puts the whole discovery burden on the filters, which is why they get three rows
      and thirty controls above a grid that often holds fewer than ten cards.
    </p>
  </header>

  <section class="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
    <h2 class="text-base font-semibold text-gray-900">The filter algebra</h2>
    <p class="mt-1 text-sm text-gray-600">
      Selecting <strong>Active</strong> and <strong>Distributed</strong> shows objects at either
      stage. Adding <strong>Physical</strong> narrows that set rather than widening it. OR within a
      dimension, AND across dimensions — the only reading under which adding a chip can never
      surprise you with more results.
    </p>
    <p class="mt-2 font-mono text-xs text-gray-400">
      stages [{activeFilters.stages.join(', ') || 'any'}] AND natures [{activeFilters.natures.join(', ') || 'any'}]
      AND regimes [{activeFilters.regimes.join(', ') || 'any'}] → {filtered.length} results
    </p>
  </section>

  <NdoBrowser
    descriptors={filtered}
    {activeFilters}
    onfilterchange={(f) => (activeFilters = { ...activeFilters, ...f })}
    onclearfilters={() => (activeFilters = { stages: [], natures: [], regimes: [] })}
  />

  <section class="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
    <h2 class="text-sm font-semibold text-amber-800">Open questions</h2>
    <ul class="mt-1 list-disc space-y-1 pl-5 text-sm text-amber-700">
      <li>Thirty always-visible filter controls above a ten-card grid. Should the rows collapse until a dimension is used?</li>
      <li>A card colours ten stages as two (green or grey). A reader who filters by Prototype sees a green badge and no confirmation that the filter took.</li>
      <li>There is no sort and no result count unless a filter is active.</li>
    </ul>
  </section>

  <p class="mt-4 text-sm text-gray-500">
    Live: <a class="text-blue-600 hover:underline" href={paths.appHome()}>the lobby in the prototype</a>.
  </p>
</div>
