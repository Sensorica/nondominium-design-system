<script lang="ts">
  import '../app.css';
  import 'virtual:uno.css';
  import { page } from '$app/state';

  let { children } = $props();

  const navLinks = [
    { href: '/', label: 'Tokens' },
    { href: '/playbook', label: 'Playbook' },
    { href: '/ui-kit', label: 'UI Kit' }
  ];
</script>

<div class="layout">
  <header class="site-header">
    <a href="/" class="site-logo">
      <span class="logo-mark">NDO</span>
      <span class="logo-text">Design System</span>
    </a>
    <nav class="site-nav" aria-label="Main navigation">
      {#each navLinks as link}
        <a
          href={link.href}
          class="nav-link"
          class:is-active={page.url.pathname === link.href ||
            (link.href !== '/' && page.url.pathname.startsWith(link.href))}
        >
          {link.label}
        </a>
      {/each}
    </nav>
  </header>

  <main class="site-main">
    {@render children()}
  </main>
</div>

<style>
  .layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .site-header {
    display: flex;
    align-items: center;
    gap: 2rem;
    padding: 0 1.5rem;
    height: 3.5rem;
    background: #fff;
    border-bottom: 1px solid rgb(var(--ndo-gray-200));
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .site-logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: inherit;
  }

  .logo-mark {
    background: rgb(var(--ndo-blue-600));
    color: #fff;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 0.15rem 0.4rem;
    border-radius: 0.25rem;
    letter-spacing: 0.05em;
  }

  .logo-text {
    font-size: 0.9375rem;
    font-weight: 600;
    color: rgb(var(--ndo-gray-900));
  }

  .site-nav {
    display: flex;
    gap: 0.25rem;
  }

  .nav-link {
    padding: 0.375rem 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: rgb(var(--ndo-gray-600));
    text-decoration: none;
    transition: background-color 150ms ease, color 150ms ease;
  }

  .nav-link:hover { background: rgb(var(--ndo-gray-100)); color: rgb(var(--ndo-gray-900)); }
  .nav-link.is-active { background: rgb(var(--ndo-blue-50)); color: rgb(var(--ndo-blue-700)); }

  .site-main { flex: 1; }
</style>
