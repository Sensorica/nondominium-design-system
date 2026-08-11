<script lang="ts">
  // The playbook index. Seven categories, in the order a screen is built:
  // the things you press, the things that label, the things that hold, the
  // things you fill, the things that move you, the things that report, and the
  // frame around all of it.
  import { paths } from '$lib/paths';

  const categories = [
    { href: paths.playbookButtons(), icon: '🔘', title: 'Buttons', body: 'Primary, ghost and destructive, in two sizes.' },
    { href: paths.playbookBadges(), icon: '🏷️', title: 'Badges', body: 'The three domain axes: stage, nature, regime. Twenty-one variants.' },
    { href: paths.playbookCards(), icon: '🃏', title: 'Cards', body: 'The NDO card and the panel, with their canonical recipes.' },
    { href: paths.playbookInputs(), icon: '✏️', title: 'Inputs', body: 'Field, input, select, textarea, and the error state.' },
    { href: paths.playbookNavigation(), icon: '🧭', title: 'Navigation', body: 'Tabs, sidebar items and the screen-map entry.' },
    { href: paths.playbookStatus(), icon: '🟢', title: 'Status', body: 'Status dots and filter chips.' },
    { href: paths.playbookShell(), icon: '🖼️', title: 'Shell', body: 'The app frame: rail, content column, modal and toast.' },
  ];
</script>

<header>
  <h1 class="ndo-h1">📖 Playbook</h1>
  <p class="ndo-p mt-2" style="max-width:62ch">
    Every component in the system, with its variants and the markup that produces them. Components
    come in two forms: Svelte components for the prototype, and <code>ndo-*</code> custom elements
    for embedding anywhere else. They share the token layer, so they render identically.
  </p>
</header>

<div class="grid">
  {#each categories as category (category.href)}
    <a class="ndo-card ndo-card--interactive" href={category.href}>
      <span style="font-size:1.5rem" aria-hidden="true">{category.icon}</span>
      <h2 class="ndo-h3 mt-2">{category.title}</h2>
      <p class="ndo-small mt-1">{category.body}</p>
    </a>
  {/each}
</div>

<style>
  .grid { display: grid; gap: var(--ndo-spacing-4); grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
  code { font-family: var(--ndo-font-mono); font-size: var(--ndo-text-sm); }
</style>
