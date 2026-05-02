<svelte:head><title>NDO Detail — UI Kit</title></svelte:head>

<script lang="ts">
  let tab = $state<'resources' | 'governance' | 'composition' | 'activity'>('resources');

  const ndo = {
    hash: 'uhC0kVX5k7dL2mPqRsTuVwXyZaB3cDeF4gHiJkLm',
    name: 'Community Solar Array',
    description:
      'Shared photovoltaic infrastructure governed under nondominium principles by the Sensorica collective. Access is open to all AccountableAgents.',
    lifecycle_stage: 'Active',
    resource_nature: 'Physical',
    property_regime: 'Nondominium',
    initiator: 'uhCAk2vMp8X3nRwsQzLtYd4uJcFe7gHiKoNbPmVa',
    created_at: 1710000000000000
  };

  const tabs: { id: typeof tab; label: string }[] = [
    { id: 'resources', label: 'Resources' },
    { id: 'governance', label: 'Governance' },
    { id: 'composition', label: 'Composition' },
    { id: 'activity', label: 'Activity' }
  ];

  const formattedDate = new Date(ndo.created_at / 1000).toLocaleDateString();
</script>

<!-- NDO Detail scenario — mirrors NdoView + NdoIdentityLayer + tab content -->
<div class="detail-shell">

  <!-- Header + tabs — mirrors NdoView.svelte -->
  <div class="ndo-header">
    <div class="header-top">
      <h1 class="text-xl font-bold text-gray-900">{ndo.name}</h1>
      <p class="font-mono text-xs text-gray-500 mt-0.5">{ndo.hash}</p>
    </div>
    <nav class="tab-nav" aria-label="NDO sections">
      {#each tabs as t}
        <button
          type="button"
          class="tab-btn"
          class:is-active={tab === t.id}
          onclick={() => { tab = t.id; }}
        >{t.label}</button>
      {/each}
    </nav>
  </div>

  <!-- Identity layer — mirrors NdoIdentityLayer.svelte -->
  <div class="identity-layer">
    <div class="identity-badges">
      <ndo-badge variant="lifecycle-active" label={ndo.lifecycle_stage}></ndo-badge>
      <ndo-badge variant="regime-nondominium" label={ndo.property_regime}></ndo-badge>
      <ndo-badge variant="nature-physical" label={ndo.resource_nature}></ndo-badge>
    </div>
    <div class="identity-meta">
      <span>By <span class="font-mono">{ndo.initiator.slice(0, 12)}…</span></span>
      <span>{formattedDate}</span>
    </div>
    <p class="identity-desc">{ndo.description}</p>
  </div>

  <!-- Tab content -->
  <div class="tab-content">
    {#if tab === 'resources'}
      <h3 class="text-base font-semibold text-gray-900 mb-3">Specification</h3>
      <p class="text-sm text-gray-600 mb-4">Community Solar Array v1.0</p>
      <h3 class="text-base font-semibold text-gray-900 mb-2">Economic resources</h3>
      <ul class="item-list">
        <li class="item">
          <span class="font-medium">12 kWp</span>
          <ndo-badge variant="lifecycle-active" label="in_custody"></ndo-badge>
        </li>
        <li class="item">
          <span class="font-medium">8 kWp</span>
          <ndo-badge variant="lifecycle-stable" label="available"></ndo-badge>
        </li>
      </ul>

    {:else if tab === 'governance'}
      <h3 class="text-base font-semibold text-gray-900 mb-3">Governance rules</h3>
      <ul class="item-list">
        <li class="item column">
          <div class="font-medium text-gray-800">UsageLimit</div>
          <code class="text-xs text-gray-600">max_hours_per_week: 40</code>
        </li>
        <li class="item column">
          <div class="font-medium text-gray-800">AccessControl</div>
          <code class="text-xs text-gray-600">require_role: "AccountableAgent"</code>
        </li>
        <li class="item column">
          <div class="font-medium text-gray-800">TransferPolicy</div>
          <code class="text-xs text-gray-600">regime: "Nondominium" — transfer_custody only</code>
        </li>
      </ul>

    {:else if tab === 'composition'}
      <div class="coming-soon-block">
        <ndo-status-dot status="coming-soon"></ndo-status-dot>
        <p class="text-sm text-gray-700 mt-3">Composition view (NdoHardLink graph) not yet implemented.</p>
      </div>

    {:else if tab === 'activity'}
      <h3 class="text-base font-semibold text-gray-900 mb-3">Economic events</h3>
      <ul class="item-list">
        <li class="item column">
          <div class="flex items-center gap-2">
            <span class="font-medium text-gray-900">transfer_custody</span>
            <ndo-badge variant="nature-physical" label="4 kWp"></ndo-badge>
          </div>
          <div class="text-xs text-gray-500 mt-1">{formattedDate} · Monthly collective distribution</div>
        </li>
        <li class="item column">
          <div class="flex items-center gap-2">
            <span class="font-medium text-gray-900">use</span>
            <ndo-badge variant="lifecycle-active" label="12 kWp"></ndo-badge>
          </div>
          <div class="text-xs text-gray-500 mt-1">{formattedDate} · Annual output survey</div>
        </li>
      </ul>
    {/if}
  </div>

</div>

<style>
  .detail-shell { background: rgb(var(--ndo-gray-100)); min-height: calc(100vh - 3.5rem); }

  /* Header */
  .ndo-header {
    background: #fff;
    border-bottom: 1px solid rgb(var(--ndo-gray-200));
    padding: 1rem 1.5rem 0;
  }
  .header-top { margin-bottom: 0.75rem; }

  /* Tabs */
  .tab-nav { display: flex; gap: 0.25rem; }
  .tab-btn {
    padding: 0.5rem 0.75rem;
    font-size: var(--ndo-text-sm);
    font-weight: var(--ndo-weight-medium);
    border-radius: var(--ndo-radius-sm) var(--ndo-radius-sm) 0 0;
    border: 1px solid transparent;
    border-bottom: none;
    background: transparent;
    color: rgb(var(--ndo-gray-500));
    cursor: pointer;
    transition: var(--ndo-transition-colors);
  }
  .tab-btn:hover { color: rgb(var(--ndo-gray-800)); }
  .tab-btn.is-active {
    border-color: rgb(var(--ndo-gray-200));
    background: rgb(var(--ndo-gray-50));
    color: rgb(var(--ndo-gray-900));
  }

  /* Identity layer */
  .identity-layer {
    background: rgb(var(--ndo-gray-50));
    border-bottom: 1px solid rgb(var(--ndo-gray-100));
    padding: 1rem 1.5rem;
  }
  .identity-badges { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem; }
  .identity-meta {
    display: flex;
    gap: 1rem;
    font-size: var(--ndo-text-xs);
    color: rgb(var(--ndo-gray-500));
    margin-bottom: 0.5rem;
  }
  .identity-desc { margin: 0; font-size: var(--ndo-text-sm); color: rgb(var(--ndo-gray-600)); }

  /* Tab content */
  .tab-content { padding: 1.5rem; }

  .item-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; }
  .item {
    background: #fff;
    border: 1px solid rgb(var(--ndo-gray-200));
    border-radius: var(--ndo-radius-md);
    padding: 0.75rem;
    font-size: var(--ndo-text-sm);
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .item.column { flex-direction: column; align-items: flex-start; }

  .coming-soon-block {
    border: 1px dashed rgb(var(--ndo-gray-300));
    border-radius: var(--ndo-radius-lg);
    background: #fff;
    padding: 2rem;
    text-align: center;
  }
</style>
