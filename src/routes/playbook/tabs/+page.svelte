<svelte:head><title>Tabs — Playbook</title></svelte:head>

<script lang="ts">
  import { NdoDetailLayout, MOCK_NDOS } from '@nondominium/ndo-ui';

  const descriptor = MOCK_NDOS.find((d) => d.lifecycle_stage === 'Active') ?? MOCK_NDOS[0];
</script>

<h1 class="text-xl font-bold text-gray-900 mb-1">Tabs</h1>
<p class="text-sm text-gray-600 mb-6">
  NDO detail tab bar from <code class="font-mono">NdoDetailLayout</code> —
  hApp <code class="font-mono">NdoView.svelte</code> underline active state.
</p>

<section class="specimen-section">
  <h2 class="specimen-heading">Four-tab layout</h2>
  <div class="rounded-lg border border-gray-200 overflow-hidden">
    <NdoDetailLayout
      {descriptor}
      initiatorName="Alice M."
      isInitiator={true}
      showFork={false}
      showAssociate={false}
      showJoin={false}
    />
  </div>
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
