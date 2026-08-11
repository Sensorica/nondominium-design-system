<script lang="ts">
  // Tab bar for the NDO detail surfaces. Tabs are ROUTES, not in-page state:
  // every surface in this design system must be deep-linkable and commentable,
  // which an in-page tab cannot be.
  import { page } from '$app/state';

  let { tabs }: { tabs: { href: string; label: string; icon?: string }[] } = $props();
  const current = $derived(page.url.pathname);
</script>

<nav class="ndo-tabs" aria-label="NDO sections">
  {#each tabs as tab (tab.href)}
    <a class="ndo-tab" href={tab.href} aria-current={current === tab.href ? 'page' : undefined}>
      {#if tab.icon}<span aria-hidden="true">{tab.icon}</span> {/if}{tab.label}
    </a>
  {/each}
</nav>
