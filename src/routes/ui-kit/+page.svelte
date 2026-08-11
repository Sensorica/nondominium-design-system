<script>
  import { base } from '$app/paths';
</script>

<svelte:head><title>UI Kit — Nondominium DS</title></svelte:head>

<div class="p-6">
  <h1 class="text-2xl font-bold text-gray-900 mb-1">UI Kit</h1>
  <p class="text-sm text-gray-500 mb-6">
    Full-page scenario views replicating real Nondominium screens.
  </p>

  <div class="scenario-grid">
    {#each [{ path: '/ui-kit/browse', label: 'Browse (Lobby)', desc: 'Group sidebar + NDO browser grid — mirrors LobbyView + NdoBrowser' }, { path: '/ui-kit/ndo-detail', label: 'NDO Detail', desc: 'Identity layer + tab navigation — mirrors NdoView + NdoIdentityLayer' }, { path: '/ui-kit/group', label: 'Group View', desc: 'Group panel with NDO grid, member list, filter chips, and Create NDO flow' }, { path: '/ui-kit/ndo-create', label: 'NDO Create Wizard', desc: 'Multi-step creation: archetype → narrative kernel → governance → review' }, { path: '/ui-kit/ndo-enrich', label: 'NDO Enrichment', desc: 'Layer 1 specification editor + governance templates + Source-NDO profile' }, { path: '/ui-kit/agent-profile', label: 'Agent Profile', desc: 'Three-tier identity, roles, PPR reputation summary, and role promotion flow' }] as s}
      <a href="{base}{s.path}" class="scenario-card">
        <span class="scenario-label">{s.label}</span>
        <p class="scenario-desc">{s.desc}</p>
      </a>
    {/each}
  </div>
</div>

<style>
  .scenario-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  }
  .scenario-card {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 1rem;
    background: #fff;
    border: 1px solid rgb(var(--ndo-gray-200));
    border-radius: 0.5rem;
    text-decoration: none;
    color: inherit;
    box-shadow: var(--ndo-shadow-sm);
    transition: box-shadow 150ms ease;
  }
  .scenario-card:hover {
    box-shadow: var(--ndo-shadow-md);
  }
  .scenario-label {
    font-size: 0.9375rem;
    font-weight: 600;
    color: rgb(var(--ndo-gray-900));
  }
  .scenario-desc {
    margin: 0.25rem 0 0;
    font-size: 0.8125rem;
    color: rgb(var(--ndo-gray-600));
    line-height: 1.4;
  }
</style>
