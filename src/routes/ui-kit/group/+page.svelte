<svelte:head><title>Group View — UI Kit</title></svelte:head>

<script lang="ts">
  import { base } from '$app/paths';

  const ndos = [
    {
      hash: 'uhC0kVX5k7dL2mPqRsTuVwXyZaB3cDeF',
      name: 'Community Solar Array',
      description: 'Shared photovoltaic infrastructure governed under nondominium principles by the Sensorica collective.',
      lifecycle: 'active',
      nature: 'physical',
      regime: 'nondominium'
    },
    {
      hash: 'uhC0kAb3cDeF4gHiJkLmNoPqRsTuVwXy',
      name: 'Open Hardware CNC Bed',
      description: 'Community-maintained CNC router available for approved fabrication tasks. Requires Transport role.',
      lifecycle: 'stable',
      nature: 'physical',
      regime: 'pool'
    },
    {
      hash: 'uhC0kZyXwVuTsRqPoNmLkJiHgFeDcBa9',
      name: 'Distributed Sensor Design v3',
      description: 'Open-source IoT sensor design file for environmental monitoring in urban commons.',
      lifecycle: 'distributed',
      nature: 'digital',
      regime: 'commons'
    },
    {
      hash: 'uhC0k1234abcdefghijklmnopqrstuvwx',
      name: 'Collective Laser Cutter',
      description: 'Shared laser cutter maintained by the Open Hardware collective. Validation pending.',
      lifecycle: 'prototype',
      nature: 'physical',
      regime: 'collective'
    }
  ];

  function badges(ndo: typeof ndos[0]): string {
    return [
      `lifecycle-${ndo.lifecycle}:${ndo.lifecycle[0].toUpperCase() + ndo.lifecycle.slice(1)}`,
      `nature-${ndo.nature}:${ndo.nature[0].toUpperCase() + ndo.nature.slice(1)}`,
      `regime-${ndo.regime}:${ndo.regime[0].toUpperCase() + ndo.regime.slice(1)}`
    ].join(';');
  }

  let showBanner = $state(true);
  let showEmpty = $state(false);
  let activeFilters = $state<Set<string>>(new Set());

  function toggleFilter(label: string) {
    const next = new Set(activeFilters);
    next.has(label) ? next.delete(label) : next.add(label);
    activeFilters = next;
  }
</script>

<!-- Group header -->
<div class="group-shell">
  <div class="group-header">
    <div>
      <h1 class="group-name">Sensorica</h1>
      <div class="group-meta">
        <span>7 members</span>
        <span>·</span>
        <span>4 NDOs</span>
        <span>·</span>
        <ndo-status-dot status="active" label="Active"></ndo-status-dot>
      </div>
    </div>
    <div class="header-actions">
      <ndo-button variant="ghost">🍴 Fork NDO</ndo-button>
      <ndo-button variant="primary" href="{base}/ui-kit/ndo-create">+ Create NDO</ndo-button>
    </div>
  </div>

  <!-- Level-2 identity banner -->
  {#if showBanner}
    <div class="profile-banner">
      <span class="banner-text">
        👤 How do you want to appear in <strong>Sensorica</strong>?
        Your Lobby profile is set but not linked to this group yet.
        <a href="#" class="banner-link">Set group profile →</a>
      </span>
      <button class="banner-dismiss" onclick={() => (showBanner = false)}>Dismiss</button>
    </div>
  {/if}

  <!-- Filter chips -->
  <div class="filter-bar">
    <span class="filter-label">Lifecycle</span>
    {#each ['Active', 'Stable', 'Distributed', 'Prototype'] as chip}
      <button
        class="filter-chip"
        class:is-active={activeFilters.has(chip)}
        onclick={() => toggleFilter(chip)}
      >{chip}</button>
    {/each}

    <div class="filter-divider"></div>
    <span class="filter-label">Nature</span>
    {#each ['Physical', 'Digital'] as chip}
      <button
        class="filter-chip"
        class:is-active={activeFilters.has(chip)}
        onclick={() => toggleFilter(chip)}
      >{chip}</button>
    {/each}

    <div class="filter-divider"></div>
    <span class="filter-label">Regime</span>
    {#each ['Nondominium', 'Commons', 'Pool'] as chip}
      <button
        class="filter-chip"
        class:is-active={activeFilters.has(chip)}
        onclick={() => toggleFilter(chip)}
      >{chip}</button>
    {/each}

    <button class="toggle-empty-btn" onclick={() => (showEmpty = !showEmpty)}>
      {showEmpty ? 'Show NDOs' : 'Show empty state'}
    </button>
  </div>

  <!-- NDO grid -->
  {#if !showEmpty}
    <ul class="ndo-grid">
      {#each ndos as ndo (ndo.hash)}
        <li>
          <ndo-card
            name={ndo.name}
            description={ndo.description}
            hash={ndo.hash}
            href="{base}/ui-kit/ndo-detail"
            badges={badges(ndo)}
          ></ndo-card>
        </li>
      {/each}
    </ul>
  {:else}
    <div class="empty-state">
      <div class="empty-icon">📦</div>
      <div class="empty-title">No NDOs in this group yet</div>
      <p class="empty-desc">NDOs created in this group will appear here. Start by creating your first Nondominium Object.</p>
      <ndo-button variant="primary" href="{base}/ui-kit/ndo-create">+ Create first NDO</ndo-button>
    </div>
  {/if}
</div>

<!-- Group members sidebar injected via the main shell — shown here as an info panel -->
<div class="members-panel">
  <div class="members-title">Members (7)</div>
  {#each [
    { initials: 'AL', name: 'Alice M.', role: 'Primary Accountable' },
    { initials: 'BK', name: 'Bob K.', role: 'Transport' },
    { initials: 'CR', name: 'Carol R.', role: 'Accountable Agent' }
  ] as m}
    <div class="member-item">
      <div class="member-avatar">{m.initials}</div>
      <div>
        <div class="member-name">{m.name}</div>
        <div class="member-role">{m.role}</div>
      </div>
    </div>
  {/each}
  <div class="member-item" style="opacity:0.55;">
    <div class="member-avatar more">+4</div>
    <div class="member-name" style="font-size:var(--ndo-text-xs); color:rgb(var(--ndo-gray-500));">4 more members</div>
  </div>
  <button class="invite-btn">🔗 Copy invite link</button>
</div>

<style>
  .group-shell {
    flex: 1;
    min-width: 0;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: rgb(var(--ndo-gray-100));
    min-height: calc(100vh - 3.5rem);
  }

  /* Header */
  .group-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .group-name {
    font-size: var(--ndo-text-2xl);
    font-weight: var(--ndo-weight-bold);
    color: rgb(var(--ndo-gray-900));
    margin: 0 0 0.25rem;
  }
  .group-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: var(--ndo-text-sm);
    color: rgb(var(--ndo-gray-500));
  }
  .header-actions { display: flex; gap: 0.5rem; align-items: center; }

  /* Banner */
  .profile-banner {
    background: rgb(var(--ndo-amber-50));
    border: 1px solid rgb(var(--ndo-amber-100));
    border-radius: var(--ndo-radius-lg);
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
  .banner-text { font-size: var(--ndo-text-sm); color: rgb(var(--ndo-amber-800)); }
  .banner-link { color: rgb(var(--ndo-amber-800)); font-weight: 600; }
  .banner-dismiss {
    font-size: var(--ndo-text-xs);
    color: rgb(var(--ndo-amber-700));
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0.2rem 0.5rem;
    border-radius: var(--ndo-radius-sm);
    white-space: nowrap;
  }
  .banner-dismiss:hover { background: rgb(var(--ndo-amber-100)); }

  /* Filters */
  .filter-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
  }
  .filter-label {
    font-size: var(--ndo-text-xs);
    font-weight: 600;
    color: rgb(var(--ndo-gray-500));
  }
  .filter-chip {
    padding: 0.25rem 0.625rem;
    border-radius: 999px;
    font-size: var(--ndo-text-xs);
    font-weight: 500;
    border: 1px solid rgb(var(--ndo-gray-300));
    background: #fff;
    color: rgb(var(--ndo-gray-700));
    cursor: pointer;
    transition: background-color 150ms ease, color 150ms ease, border-color 150ms ease;
  }
  .filter-chip:hover { border-color: rgb(var(--ndo-gray-400)); }
  .filter-chip.is-active {
    background: rgb(var(--ndo-blue-50));
    color: rgb(var(--ndo-blue-700));
    border-color: rgb(var(--ndo-blue-600));
  }
  .filter-divider {
    width: 1px;
    height: 1.25rem;
    background: rgb(var(--ndo-gray-300));
  }
  .toggle-empty-btn {
    margin-left: auto;
    font-size: var(--ndo-text-xs);
    color: rgb(var(--ndo-gray-400));
    background: none;
    border: 1px dashed rgb(var(--ndo-gray-300));
    border-radius: var(--ndo-radius-sm);
    padding: 0.2rem 0.5rem;
    cursor: pointer;
  }
  .toggle-empty-btn:hover { color: rgb(var(--ndo-gray-600)); }

  /* NDO grid */
  .ndo-grid {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 0.75rem;
    grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
  }

  /* Empty state */
  .empty-state {
    border: 2px dashed rgb(var(--ndo-gray-300));
    border-radius: var(--ndo-radius-xl);
    padding: 3rem 2rem;
    text-align: center;
    background: #fff;
  }
  .empty-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
  .empty-title { font-size: var(--ndo-text-lg); font-weight: var(--ndo-weight-semibold); color: rgb(var(--ndo-gray-700)); margin: 0 0 0.25rem; }
  .empty-desc { font-size: var(--ndo-text-sm); color: rgb(var(--ndo-gray-500)); margin: 0 0 1.25rem; }

  /* Members panel */
  .members-panel {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 13rem;
    background: #fff;
    border-top: 1px solid rgb(var(--ndo-gray-200));
    border-left: 1px solid rgb(var(--ndo-gray-200));
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .members-title {
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: rgb(var(--ndo-gray-400));
    margin-bottom: 0.125rem;
  }
  .member-item { display: flex; align-items: center; gap: 0.5rem; }
  .member-avatar {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    background: rgb(var(--ndo-blue-100));
    color: rgb(var(--ndo-blue-700));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.5625rem;
    font-weight: 700;
    flex-shrink: 0;
  }
  .member-avatar.more { background: rgb(var(--ndo-gray-200)); color: rgb(var(--ndo-gray-500)); }
  .member-name { font-size: var(--ndo-text-xs); color: rgb(var(--ndo-gray-800)); }
  .member-role { font-size: 0.6875rem; color: rgb(var(--ndo-gray-500)); }
  .invite-btn {
    width: 100%;
    padding: 0.3rem 0.5rem;
    border-radius: var(--ndo-radius-sm);
    font-size: var(--ndo-text-xs);
    color: rgb(var(--ndo-blue-600));
    background: transparent;
    border: 1px dashed rgb(var(--ndo-blue-600) / 0.5);
    cursor: pointer;
    transition: background-color 150ms ease;
    margin-top: 0.25rem;
  }
  .invite-btn:hover { background: rgb(var(--ndo-blue-50)); }
</style>
