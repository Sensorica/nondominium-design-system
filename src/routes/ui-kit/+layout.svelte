<script lang="ts">
  import { page } from '$app/state';

  let { children } = $props();

  const scenarios = [
    { href: '/ui-kit/browse',     label: 'Browse (Lobby)' },
    { href: '/ui-kit/ndo-detail', label: 'NDO Detail' }
  ];
</script>

<div class="kit-layout">
  <aside class="kit-sidebar">
    <div class="sidebar-title">Scenarios</div>
    <nav>
      {#each scenarios as s}
        <a
          href={s.href}
          class="sidebar-link"
          class:is-active={page.url.pathname === s.href}
        >{s.label}</a>
      {/each}
    </nav>
  </aside>

  <div class="kit-content">
    {@render children()}
  </div>
</div>

<style>
  .kit-layout { display: flex; min-height: calc(100vh - 3.5rem); }

  .kit-sidebar {
    width: 13rem;
    flex-shrink: 0;
    padding: 1.5rem 1rem;
    border-right: 1px solid rgb(var(--ndo-gray-200));
    background: rgb(var(--ndo-gray-50));
  }

  .sidebar-title {
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: rgb(var(--ndo-gray-500));
    margin-bottom: 0.5rem;
    padding: 0 0.5rem;
  }

  .sidebar-link {
    display: block;
    padding: 0.375rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    color: rgb(var(--ndo-gray-700));
    text-decoration: none;
    transition: background-color 150ms ease, color 150ms ease;
  }
  .sidebar-link:hover { background: rgb(var(--ndo-gray-100)); color: rgb(var(--ndo-gray-900)); }
  .sidebar-link.is-active { background: rgb(var(--ndo-blue-50)); color: rgb(var(--ndo-blue-700)); font-weight: 500; }

  .kit-content { flex: 1; min-width: 0; overflow: auto; }
</style>
