<script lang="ts">
  // The hub. Four doors, each a section of the system, in the order a newcomer
  // needs them: what it looks like, what the pieces are, what they compose into,
  // and what the product actually is.
  import { paths } from '$lib/paths';

  const doors = [
    {
      href: paths.tokens(),
      icon: '🎨',
      title: 'Tokens',
      body: 'Colour, type, spacing, radii and elevation. Every value in the system starts here.',
    },
    {
      href: paths.playbook(),
      icon: '📖',
      title: 'Playbook',
      body: 'Seven component categories with their canonical recipes and the props they accept.',
    },
    {
      href: paths.scenarios(),
      icon: '🖼️',
      title: 'Scenarios',
      body: 'Six composed pages showing how the pieces behave together in a real flow.',
    },
    {
      href: paths.appHome(),
      icon: '🚀',
      title: 'Prototype',
      body: 'Twenty-seven keyed screens: the whole Nondominium app, navigable, on mock state.',
    },
  ];
</script>

<div class="ndo-shell__content">
  <header>
    <h1 class="ndo-h1">🧿 Nondominium Design System</h1>
    <p class="ndo-p mt-3" style="max-width:62ch">
      The visual language for
      <a href="https://github.com/Sensorica/nondominium">Nondominium</a> — resource governance
      without ownership, on Holochain and ValueFlows. Lifecycle stage, resource nature and property
      regime are encoded directly into the tokens and the component API, so the ontology is legible
      before you read a label.
    </p>
  </header>

  <div class="doors">
    {#each doors as door (door.href)}
      <a class="ndo-card ndo-card--interactive door" href={door.href}>
        <span class="door__icon" aria-hidden="true">{door.icon}</span>
        <h2 class="ndo-h3 mt-3">{door.title}</h2>
        <p class="ndo-small mt-2">{door.body}</p>
      </a>
    {/each}
  </div>

  <section class="ndo-panel">
    <div class="ndo-panel__head">
      <h2 class="ndo-h3">Reviewing this system</h2>
    </div>
    <div class="ndo-panel__body flex flex-col gap-3">
      <p class="ndo-small">
        Every prototype screen and every scenario carries a comment thread. Press <kbd>c</kbd> or
        use the floating button to open the drawer; threads are stored as GitHub Discussions in a
        private Sensorica repository, so the site stays static and the review history stays with
        the org.
      </p>
      <p class="ndo-small">
        Inside the prototype, press <kbd>m</kbd> for the screen map: every keyed screen, grouped,
        one click away.
      </p>
    </div>
  </section>
</div>

<style>
  .doors { display: grid; gap: var(--ndo-spacing-4); grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); }
  .door__icon { font-size: 1.75rem; }
  kbd {
    font-family: var(--ndo-font-mono);
    font-size: var(--ndo-text-xs);
    background: var(--ndo-color-surface);
    border: 1px solid var(--ndo-color-border);
    border-radius: var(--ndo-radius-sm);
    padding: 0 4px;
  }
  a { color: var(--ndo-color-link); }
</style>
