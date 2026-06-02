<script>
  import { base } from '$app/paths';
</script>

<svelte:head><title>Playbook — Nondominium DS</title></svelte:head>

<h1 class="text-2xl font-bold text-gray-900 mb-1">Playbook</h1>
<p class="text-sm text-gray-500 mb-6">
  Custom elements (<code class="font-mono">ndo-*</code>) and Svelte 5 patterns from
  <code class="font-mono">@nondominium/ndo-ui</code>.
</p>

<h2 class="section-label">Custom elements</h2>
<div class="component-grid mb-8">
  {#each [
    { path: '/playbook/badge', name: 'Badge', tag: 'ndo-badge', desc: 'Lifecycle, nature, and property regime labels' },
    { path: '/playbook/button', name: 'Button', tag: 'ndo-button', desc: 'Primary, ghost, and destructive actions' },
    { path: '/playbook/card', name: 'Card', tag: 'ndo-card', desc: 'NDO listing card with badge composition' },
    { path: '/playbook/status', name: 'Status Dot', tag: 'ndo-status-dot', desc: 'Inline status indicators' }
  ] as c}
    <a href="{base}{c.path}" class="component-card">
      <span class="component-name">{c.name}</span>
      <code class="component-tag">&lt;{c.tag}&gt;</code>
      <p class="component-desc">{c.desc}</p>
    </a>
  {/each}
</div>

<h2 class="section-label">Svelte patterns</h2>
<div class="component-grid">
  {#each [
    { path: '/playbook/shell', name: 'App Shell', desc: 'AppShell + Sidebar layout matching hApp' },
    { path: '/playbook/sidebar', name: 'Sidebar', desc: 'Browse, groups, create/join, profile' },
    { path: '/playbook/filter-chip', name: 'Filter chips', desc: 'NdoBrowser multi-select filters' },
    { path: '/playbook/modal', name: 'Modal', desc: 'Backdrop blur dialog shell' },
    { path: '/playbook/tabs', name: 'Tabs', desc: 'NDO detail four-tab navigation' },
    { path: '/playbook/forms', name: 'Forms', desc: 'UserProfileForm and related inputs' }
  ] as c}
    <a href="{base}{c.path}" class="component-card">
      <span class="component-name">{c.name}</span>
      <p class="component-desc">{c.desc}</p>
    </a>
  {/each}
</div>

<style>
  .section-label {
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: rgb(var(--ndo-gray-500));
    margin: 0 0 0.75rem;
  }

  .component-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
  }

  .component-card {
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
  .component-card:hover { box-shadow: var(--ndo-shadow-md); }

  .component-name {
    font-size: 0.9375rem;
    font-weight: 600;
    color: rgb(var(--ndo-gray-900));
  }

  .component-tag {
    font-size: 0.75rem;
    color: rgb(var(--ndo-blue-600));
    font-family: var(--ndo-font-mono);
  }

  .component-desc {
    margin: 0.25rem 0 0;
    font-size: 0.8125rem;
    color: rgb(var(--ndo-gray-600));
    line-height: 1.4;
  }
</style>
