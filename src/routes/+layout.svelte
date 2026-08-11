<script lang="ts">
  // The true root. Owns the token sheet, the design-system chrome, and the
  // comments host (mounted once so it covers the playbook, the scenarios, and
  // the prototype alike).
  //
  // The prototype at /app renders WITHOUT this chrome: it is meant to look like
  // the product, not like documentation about the product.
  // Import order matches ui/src/routes/+layout.svelte: the Tailwind reset, then
  // the generated utility sheet. Without `virtual:uno.css` no utility class is
  // emitted at all, which is silent — the markup is right and the page is
  // unstyled.
  import '../app.css';
  import 'virtual:uno.css';
  import '$lib/styles/app.css';
  import { page } from '$app/state';
  import { paths } from '$lib/paths';
  import CommentsHost from '$lib/components/comments/CommentsHost.svelte';

  let { children } = $props();

  const current = $derived(page.url.pathname);
  const isApp = $derived(current.startsWith(paths.appHome()));

  // No icons in the lists. The app has no icon set, and inventing one for the
  // documentation would be the design system asserting something the product
  // does not do.
  // Two component vocabularies live in this repo and they are not the same
  // thing. `patternsLinks` documents the classes the app writes inline today;
  // `ndoUiLinks` documents @nondominium/ndo-ui, the library Tibi is building
  // for the app to move to. Naming both "playbook" is what collided when the
  // rewrite merged, so the rail names each for its subject.
  const patternsLinks = [
    { href: paths.patternsButtons(), label: 'Buttons' },
    { href: paths.patternsBadges(), label: 'Badges' },
    { href: paths.patternsCards(), label: 'Cards' },
    { href: paths.patternsInputs(), label: 'Inputs' },
    { href: paths.patternsNavigation(), label: 'Navigation' },
    { href: paths.patternsStatus(), label: 'Status' },
    { href: paths.patternsShell(), label: 'Shell' },
  ];
  const ndoUiLinks = [
    { href: paths.ndoUiPlaybook(), label: 'Component sheets' },
    { href: paths.uiKit(), label: 'Screen compositions' },
  ];
  const scenarioLinks = [
    { href: paths.scenarioLobbyBrowse(), label: 'Lobby browse' },
    { href: paths.scenarioNdoCreation(), label: 'NDO creation' },
    { href: paths.scenarioNdoLifecycle(), label: 'NDO lifecycle' },
    { href: paths.scenarioGroupCollaboration(), label: 'Group collaboration' },
    { href: paths.scenarioAgentIdentity(), label: 'Agent identity' },
    { href: paths.scenarioGovernanceReview(), label: 'Governance review' },
  ];
</script>

<svelte:head>
  <link rel="icon" href={paths.favicon()} />
  <link rel="stylesheet" href={paths.tokenSheet()} />
</svelte:head>

<CommentsHost />

{#if isApp}
  {@render children()}
{:else}
  <div class="chrome">
    <aside class="rail">
      <a class="brand" href={paths.home()}>
        <img class="brand__mark" src={paths.logoMark()} alt="" width="34" height="34" />
        <span>
          <span class="brand__title">Nondominium</span>
          <span class="brand__sub">Design System</span>
        </span>
      </a>

      <a class="appmode" href={paths.appHome()}>Open the prototype →</a>

      <nav class="nav">
        <div class="group">
          <a class="grouphead" href={paths.tokens()} class:on={current === paths.tokens()}>Tokens</a>
        </div>

        <div class="group">
          <a class="grouphead" href={paths.patterns()} class:on={current.startsWith(paths.patterns())}>
            Patterns
          </a>
          {#each patternsLinks as link (link.href)}
            <a class="item" href={link.href} class:item--on={current === link.href}>{link.label}</a>
          {/each}
        </div>

        <div class="group">
          <a
            class="grouphead"
            href={paths.ndoUiPlaybook()}
            class:on={current.startsWith(paths.ndoUiPlaybook()) || current.startsWith(paths.uiKit())}
          >
            ndo-ui library
          </a>
          {#each ndoUiLinks as link (link.href)}
            <a class="item" href={link.href} class:item--on={current.startsWith(link.href)}>{link.label}</a>
          {/each}
        </div>

        <div class="group">
          <a class="grouphead" href={paths.scenarios()} class:on={current.startsWith(paths.scenarios())}>
            Scenarios
          </a>
          {#each scenarioLinks as link (link.href)}
            <a class="item" href={link.href} class:item--on={current === link.href}>{link.label}</a>
          {/each}
        </div>
      </nav>

      <p class="version">v0.2.0 · press <kbd>c</kbd> to comment</p>
    </aside>

    <main class="main">
      {@render children()}
    </main>
  </div>
{/if}

<style>
  /* The token sheet deliberately sets no body styles, so the chrome sets its
     own. The prototype at /app sets none and inherits the Tailwind reset,
     exactly as the app does. */
  :global(body) {
    margin: 0;
    font-family: var(--ndo-font-sans);
    color: var(--ndo-color-text-primary);
    background: var(--ndo-color-bg-app);
  }

  .chrome { display: grid; grid-template-columns: var(--ndo-sidebar-width) 1fr; min-height: 100vh; }

  /* Brand ink, from the logo's wordmark. */
  .rail {
    background: rgb(var(--ndo-brand-ink));
    padding: var(--ndo-spacing-4) var(--ndo-spacing-3);
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: var(--ndo-spacing-4);
  }
  /* A hairline of the mark's own gradient down the rail's edge. */
  .rail::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 2px;
    background: var(--ndo-brand-gradient);
  }

  .brand { display: flex; align-items: center; gap: 10px; text-decoration: none; }
  .brand__mark { width: 34px; height: 34px; flex-shrink: 0; }
  .brand__title { display: block; font-size: var(--ndo-text-sm); font-weight: var(--ndo-weight-bold); color: #fff; }
  .brand__sub {
    display: block;
    font-size: var(--ndo-text-xs);
    color: rgb(var(--ndo-brand-teal-300));
  }

  .appmode {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 9px 12px;
    border-radius: var(--ndo-radius-lg);
    background: var(--ndo-brand-gradient);
    color: #fff;
    font-size: var(--ndo-text-sm);
    font-weight: var(--ndo-weight-semibold);
    text-decoration: none;
    transition: filter var(--ndo-duration-base) var(--ndo-easing);
  }
  .appmode:hover { filter: brightness(1.12); }

  .nav { display: flex; flex-direction: column; gap: var(--ndo-spacing-4); flex: 1; }
  .group { display: flex; flex-direction: column; gap: 2px; }
  .grouphead {
    padding: 6px 8px 4px;
    font-size: var(--ndo-text-xs);
    font-weight: var(--ndo-weight-semibold);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgb(255 255 255 / 0.4);
    text-decoration: none;
  }
  .grouphead:hover, .grouphead.on { color: rgb(var(--ndo-brand-teal-300)); }
  .item {
    display: block;
    padding: 6px 10px;
    border-radius: var(--ndo-radius-md);
    font-size: var(--ndo-text-sm);
    color: rgb(255 255 255 / 0.65);
    text-decoration: none;
    border-left: 2px solid transparent;
    transition: var(--ndo-transition-colors);
  }
  .item:hover { background: rgb(255 255 255 / 0.07); color: rgb(255 255 255 / 0.92); }
  .item--on {
    background: rgb(255 255 255 / 0.1);
    color: #fff;
    border-left-color: rgb(var(--ndo-brand-teal-500));
  }

  .version { margin: auto 0 0; padding: 0 8px; font-size: var(--ndo-text-xs); color: rgb(255 255 255 / 0.3); }
  kbd {
    font-family: var(--ndo-font-mono);
    border: 1px solid rgb(255 255 255 / 0.2);
    border-radius: var(--ndo-radius-sm);
    padding: 0 3px;
  }

  .main { min-height: 100vh; background: var(--ndo-color-bg-app); }

  @media (max-width: 860px) {
    .chrome { grid-template-columns: 1fr; }
    .rail { position: static; height: auto; }
    .rail::after { display: none; }
  }
</style>
