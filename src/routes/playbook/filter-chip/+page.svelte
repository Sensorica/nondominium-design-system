<svelte:head><title>Filter chips — Playbook</title></svelte:head>

<script lang="ts">
  import { base } from '$app/paths';
  import { applyNdoFilters, NdoBrowser, MOCK_NDOS, type ActiveFilters } from '@nondominium/ndo-ui';

  let activeFilters = $state<ActiveFilters>({ stages: [], natures: [], regimes: [] });
  const filtered = $derived(applyNdoFilters(MOCK_NDOS, activeFilters));
</script>

<h1 class="text-xl font-bold text-gray-900 mb-1">Filter chips</h1>
<p class="text-sm text-gray-600 mb-2">
  Svelte pattern from <code class="font-mono text-blue-600">@nondominium/ndo-ui</code> —
  matches hApp <code class="font-mono">NdoBrowser.svelte</code>.
</p>
<p class="text-xs text-gray-500 mb-6">
  OR within each dimension (stage / nature / regime); AND across dimensions.
  Inactive chips render at 60% opacity.
</p>

<section class="specimen-section">
  <h2 class="specimen-heading">Interactive browser</h2>
  <NdoBrowser
    descriptors={filtered}
    {activeFilters}
    ndoHref={(hash) => `${base}/ui-kit/ndo-detail?hash=${encodeURIComponent(hash)}`}
    onfilterchange={(partial) => {
      activeFilters = { ...activeFilters, ...partial };
    }}
    onclearfilters={() => {
      activeFilters = { stages: [], natures: [], regimes: [] };
    }}
  />
</section>

<section class="specimen-section">
  <h2 class="specimen-heading">hApp source</h2>
  <p class="text-sm text-gray-600">
    Color maps: <code class="font-mono">ui/src/lib/components/lobby/NdoBrowser.svelte</code> (lines 44–70).
    Canonical copy: <code class="font-mono">packages/ndo-ui/src/domain/variants.ts</code>.
  </p>
</section>

<style>
  .specimen-section { margin-bottom: 2rem; }
  .specimen-heading {
    font-size: 0.8125rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: rgb(var(--ndo-gray-500));
    margin: 0 0 0.75rem;
  }
</style>
