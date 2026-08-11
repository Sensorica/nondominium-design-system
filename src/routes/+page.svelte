<script lang="ts">
  // The hub. Four doors, each a section of the system, in the order a newcomer
  // needs them: what it looks like, what the pieces are, what they compose into,
  // and what the product actually is.
  import { paths } from '$lib/paths';

  const doors = [
    {
      href: paths.tokens(),
      title: 'Tokens',
      body: 'The palette, scale and radii the app actually uses, plus the brand colours sampled from the logo.',
    },
    {
      href: paths.patterns(),
      title: 'Patterns',
      body: 'Seven categories, each shown with the app\'s own class string and the file it came from.',
    },
    {
      href: paths.ndoUiPlaybook(),
      title: 'ndo-ui library',
      body: 'The component library the app is meant to move to: sheets per component, and screens composed from them.',
    },
    {
      href: paths.scenarios(),
      title: 'Scenarios',
      body: 'Six composed pages, each arguing one open design question.',
    },
    {
      href: paths.appHome(),
      title: 'Prototype',
      body: 'A replica of the app: thirty-nine states, the same markup and classes, on mock data.',
    },
  ];
</script>

<div class="ndo-shell__content">
  <header class="hero">
    <img class="hero__logo" src={paths.logo()} alt="Nondominium" />
    <h1 class="ndo-h1">Design System</h1>
    <p class="ndo-p mt-3" style="max-width:64ch">
      The visual language of
      <a href="https://github.com/Sensorica/nondominium">Nondominium</a>, a Holochain application
      for resource governance without ownership. This documents the app as it is today, not an
      aspiration: the prototype is a replica of its components, and a check fails the build if the
      two drift apart.
    </p>
  </header>

  <div class="doors">
    {#each doors as door (door.href)}
      <a class="ndo-card ndo-card--interactive door" href={door.href}>
        <h2 class="ndo-h3">{door.title}</h2>
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
        Every prototype state and every scenario carries a comment thread. Press <kbd>c</kbd> or
        use the floating button to open the drawer; threads live as GitHub Discussions in a private
        Sensorica repository, so the site stays static and the review history stays with the org.
      </p>
      <p class="ndo-small">
        Inside the prototype, press <kbd>m</kbd> for the screen map, and use the chip at the bottom
        left to come back here.
      </p>
    </div>
  </section>
</div>

<style>
  .hero { display: flex; flex-direction: column; align-items: flex-start; gap: var(--ndo-spacing-3); }
  .hero__logo { width: 200px; max-width: 55vw; height: auto; }
  .doors { display: grid; gap: var(--ndo-spacing-4); grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); }
  /* The door's top edge carries the mark's gradient. A pseudo-element, not
     border-image: border-image paints all four edges and swallows the card. */
  .door { position: relative; overflow: hidden; }
  .door::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--ndo-brand-gradient);
  }
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
