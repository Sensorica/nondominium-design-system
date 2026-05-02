<svelte:head><title>Browse (Lobby) — UI Kit</title></svelte:head>

<script lang="ts">
  const ndos = [
    {
      hash: 'uhC0kVX5k7dL2mPqRsTuVwXyZaB3cDeF',
      name: 'Community Solar Array',
      description: 'Shared photovoltaic infrastructure governed under nondominium principles.',
      lifecycle_stage: 'active',
      resource_nature: 'physical',
      property_regime: 'nondominium'
    },
    {
      hash: 'uhC0kAb3cDeF4gHiJkLmNoPqRsTuVwXy',
      name: 'Open Hardware CNC Bed',
      description: 'Community-maintained CNC router available for approved fabrication tasks.',
      lifecycle_stage: 'stable',
      resource_nature: 'physical',
      property_regime: 'pool'
    },
    {
      hash: 'uhC0kZyXwVuTsRqPoNmLkJiHgFeDcBa9',
      name: 'Distributed Sensor Design v3',
      description: 'Open-source IoT sensor design file for environmental monitoring in urban commons.',
      lifecycle_stage: 'distributed',
      resource_nature: 'digital',
      property_regime: 'commons'
    },
    {
      hash: 'uhC0k1234abcdefghijklmnopqrstuvwx',
      name: 'Collective Laser Cutter',
      description: 'Shared laser cutter maintained by the Open Hardware collective.',
      lifecycle_stage: 'prototype',
      resource_nature: 'physical',
      property_regime: 'collective'
    }
  ];

  function badges(ndo: typeof ndos[0]): string {
    const parts = [
      `lifecycle-${ndo.lifecycle_stage}:${ndo.lifecycle_stage.charAt(0).toUpperCase() + ndo.lifecycle_stage.slice(1)}`,
      `regime-${ndo.property_regime}:${ndo.property_regime.charAt(0).toUpperCase() + ndo.property_regime.slice(1)}`,
      `nature-${ndo.resource_nature}:${ndo.resource_nature.charAt(0).toUpperCase() + ndo.resource_nature.slice(1)}`
    ];
    return parts.join(';');
  }
</script>

<!-- Lobby scenario — mirrors LobbyView.svelte + GroupSidebar.svelte + NdoBrowser.svelte -->
<div class="lobby-shell">
  <!-- Groups sidebar -->
  <aside class="groups-sidebar">
    <div class="sidebar-header">
      <h2 class="sidebar-title">Groups</h2>
      <ndo-status-dot status="coming-soon" label="Coming soon"></ndo-status-dot>
    </div>
    <ul class="group-list">
      <li><a href="#" class="group-link is-active">Sensorica</a></li>
      <li><a href="#" class="group-link">Open Value Network</a></li>
    </ul>
  </aside>

  <!-- Main area -->
  <div class="lobby-main">
    <header class="lobby-header">
      <h1 class="text-2xl font-bold text-gray-900">Lobby</h1>
      <p class="text-gray-600 mt-1">Browse NDOs on your conductor.</p>
      <p class="text-sm text-gray-500 mt-2">
        Signed in as <span class="font-medium text-gray-800 font-mono">uhCAkMockUser…</span>
      </p>
    </header>

    <section class="ndo-browser">
      <div class="browser-header">
        <h2 class="text-lg font-semibold text-gray-900">NDO browser</h2>
        <ndo-button variant="primary">+ New NDO</ndo-button>
      </div>
      <ul class="ndo-grid">
        {#each ndos as ndo (ndo.hash)}
          <li><ndo-card name={ndo.name} description={ndo.description} hash={ndo.hash} href="#" badges={badges(ndo)}></ndo-card></li>
        {/each}
      </ul>
    </section>
  </div>
</div>

<style>
  .lobby-shell {
    display: flex;
    min-height: calc(100vh - 3.5rem);
    background: rgb(var(--ndo-gray-100));
  }

  /* Groups sidebar */
  .groups-sidebar {
    width: 13rem;
    flex-shrink: 0;
    background: rgb(var(--ndo-gray-50));
    border-right: 1px solid rgb(var(--ndo-gray-200));
    padding: 0.75rem;
  }
  .sidebar-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
  .sidebar-title { font-size: 0.875rem; font-weight: 600; color: rgb(var(--ndo-gray-800)); margin: 0; }
  .group-list { list-style: none; padding: 0; margin: 0; }
  .group-link {
    display: block;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    color: rgb(var(--ndo-gray-700));
    text-decoration: none;
    transition: background-color 150ms ease;
  }
  .group-link:hover { background: rgb(var(--ndo-gray-100)); color: rgb(var(--ndo-gray-900)); }
  .group-link.is-active { background: rgb(var(--ndo-blue-50)); color: rgb(var(--ndo-blue-700)); font-weight: 500; }

  /* Main */
  .lobby-main { flex: 1; padding: 1.5rem; min-width: 0; }
  .lobby-header { margin-bottom: 1.5rem; }

  /* Browser */
  .ndo-browser {
    background: #fff;
    border-radius: var(--ndo-radius-lg);
    border: 1px solid rgb(var(--ndo-gray-200));
    padding: 1rem;
    box-shadow: var(--ndo-shadow-sm);
  }
  .browser-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
  }
  .ndo-grid {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 0.75rem;
    grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
  }
</style>
