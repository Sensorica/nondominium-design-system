<script>
  import { base } from '$app/paths';
</script>

<svelte:head><title>Playbook — Nondominium DS</title></svelte:head>

<h1 class="text-2xl font-bold text-gray-900 mb-1">Playbook</h1>
<p class="text-sm text-gray-500 mb-6">Custom elements available in the <code>ndo-*</code> namespace.</p>

<div class="component-grid">
  {#each [
    { path: '/playbook/badge',  name: 'Badge',      tag: 'ndo-badge',      desc: 'Lifecycle, nature, and property regime labels' },
    { path: '/playbook/button', name: 'Button',     tag: 'ndo-button',     desc: 'Primary, ghost, and destructive actions' },
    { path: '/playbook/card',   name: 'Card',       tag: 'ndo-card',       desc: 'NDO listing card with badge composition' },
    { path: '/playbook/status', name: 'Status Dot', tag: 'ndo-status-dot', desc: 'Inline status indicators' },
    { path: '/playbook/shell',  name: 'Shell',      tag: 'ndo-shell',      desc: 'Application layout patterns' }
  ] as c}
    <a href="{base}{c.path}" class="component-card">
      <span class="component-name">{c.name}</span>
      <code class="component-tag">&lt;{c.tag}&gt;</code>
      <p class="component-desc">{c.desc}</p>
    </a>
  {/each}
</div>

<style>
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
