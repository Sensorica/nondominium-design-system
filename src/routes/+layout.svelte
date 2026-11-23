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
  import '$lib/styles/scrollbars.css';
  import { page } from '$app/state';
  import { afterNavigate } from '$app/navigation';
  import { paths } from '$lib/paths';
  import CommentsHost from '$lib/components/comments/CommentsHost.svelte';
  import { DIRECTION_LIST, type DirectionSlug } from '$lib/prototypes/directions';
  import { theme, initTheme, toggleTheme, applyTheme, pinnedLight, type Theme } from '$lib/theme.svelte';

  let { children } = $props();

  // Below the 860px breakpoint the rail collapses to a top bar and the nav
  // opens behind a hamburger. Any navigation closes it, so a tapped link lands
  // on the page rather than on the still-open menu.
  let navOpen = $state(false);
  afterNavigate(() => {
    navOpen = false;
  });
  function onKeydown(e: KeyboardEvent) {
    if (navOpen && e.key === 'Escape') navOpen = false;
  }

  const current = $derived(page.url.pathname);

  // The theme: app.html wrote the first one before paint; from here the
  // layout keeps <html data-theme> in step with the toggle, the OS, and the
  // route (the replica and the card frames stay light, see theme.svelte.ts).
  // In an effect, not at init: the prerendered HTML says light, and state
  // changed before hydration would leave the toggle's attributes stale.
  $effect(() => initTheme());
  $effect(() => {
    applyTheme(pinned ? 'light' : theme.mode);
  });
  const nextTheme = $derived<Theme>(theme.mode === 'dark' ? 'light' : 'dark');
  const pinned = $derived(pinnedLight(current));
  const toggleTitle = $derived(
    pinned
      ? `This page shows the app, which has no dark mode; the ${theme.mode} theme applies elsewhere`
      : `Switch to ${nextTheme} theme`
  );
  // Full-bleed: the replica at /app, and each prototype direction. The
  // direction index at /prototypes keeps the chrome.
  // An error page keeps the chrome even under those subtrees: a mistyped
  // /app/... or /guidelines/... URL must still show the way back.
  const isApp = $derived(
    !page.error &&
    (current.startsWith(paths.appHome()) ||
      DIRECTION_LIST.some((d) => current === paths.protoDirection(d.slug as DirectionSlug)) ||
      // A guideline card's isolated frame (/guidelines/<id>) must paint only the
      // card body, same as the original's own <body> — not the index at
      // /guidelines itself, which keeps the chrome.
      (current.startsWith(paths.guidelines() + '/') && current !== paths.guidelines()))
  );

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

<svelte:window onkeydown={onKeydown} />

<CommentsHost />

{#if isApp}
  {@render children()}
{:else}
  <div class="chrome">
    <aside class="rail" class:rail--open={navOpen}>
      <div class="railhead">
        <a class="brand" href={paths.home()}>
          <img class="brand__mark" src={paths.logoMark()} alt="" width="34" height="34" />
          <span>
            <span class="brand__title">Nondominium</span>
            <span class="brand__sub">Design System</span>
          </span>
        </a>

        <div class="railtools">
        <button
          type="button"
          class="themetoggle"
          class:themetoggle--pinned={pinned}
          aria-label={toggleTitle}
          title={toggleTitle}
          aria-pressed={theme.mode === 'dark'}
          onclick={toggleTheme}
        >
          <span class="themetoggle__disc" aria-hidden="true"></span>
        </button>

        <button
          type="button"
          class="menutoggle"
          aria-controls="ds-menu"
          aria-expanded={navOpen}
          aria-label={navOpen ? 'Close menu' : 'Open menu'}
          onclick={() => (navOpen = !navOpen)}
        >
          <span class="menutoggle__bars" aria-hidden="true"></span>
        </button>
        </div>
      </div>

      <div class="railbody" id="ds-menu">
        <a class="appmode" href={paths.appHome()}>Open the current app →</a>

        <nav class="nav">
          <div class="group">
            <a class="grouphead" href={paths.tokens()} class:on={current === paths.tokens()}>Tokens</a>
          </div>

          <div class="group">
            <a class="grouphead" href={paths.guidelines()} class:on={current === paths.guidelines()}>
              Claude Design cards
            </a>
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
            <a class="grouphead" href={paths.prototypes()} class:on={current === paths.prototypes()}>
              Prototype directions
            </a>
            {#each DIRECTION_LIST as d (d.slug)}
              <a class="item" href={paths.protoDirection(d.slug as DirectionSlug)}>
                {d.id} {d.name}{d.status === 'target' ? ' · target' : d.status === 'archived' ? ' · archived' : ''}
              </a>
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

          <div class="group">
            <a class="grouphead" href={paths.meetings()} class:on={current.startsWith(paths.meetings())}>
              Meetings
            </a>
          </div>

          <div class="group">
            <a class="grouphead" href={paths.brainstorms()} class:on={current.startsWith(paths.brainstorms())}>
              Brainstorms
            </a>
          </div>

          <div class="group">
            <a class="grouphead" href={paths.architecture()} class:on={current.startsWith(paths.architecture())}>
              Architecture
            </a>
          </div>

          <div class="group">
            <a class="grouphead" href={paths.releaseCurrent()} class:on={current.startsWith(paths.releases())}>
              Release board
            </a>
          </div>

          <div class="group">
            <a class="grouphead" href={paths.workflow()} class:on={current.startsWith(paths.workflow())}>
              Workflow
            </a>
          </div>

          <div class="group">
            <a class="grouphead" href={paths.previews()} class:on={current.startsWith(paths.previews())}>
              Branch previews
            </a>
          </div>
        </nav>

        <p class="version">v0.2.0 · press <kbd>c</kbd> to comment</p>
      </div>
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

  .railhead { display: flex; align-items: center; justify-content: space-between; gap: var(--ndo-spacing-3); }
  .railbody { display: flex; flex-direction: column; gap: var(--ndo-spacing-4); flex: 1; }

  /* Hidden on desktop; the breakpoint below shows it. Three bars drawn in CSS,
     not an icon: the app has no icon set (see the note in the script). */
  .menutoggle {
    display: none;
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 1px solid rgb(255 255 255 / 0.15);
    border-radius: var(--ndo-radius-md);
    background: transparent;
    color: #fff;
    cursor: pointer;
    transition: var(--ndo-transition-colors);
  }
  .menutoggle:hover { background: rgb(255 255 255 / 0.07); }
  .menutoggle:focus-visible { outline: 2px solid rgb(var(--ndo-brand-teal-300)); outline-offset: 2px; }
  .menutoggle__bars,
  .menutoggle__bars::before,
  .menutoggle__bars::after {
    display: block;
    width: 18px;
    height: 2px;
    border-radius: 1px;
    background: currentColor;
    transition: transform var(--ndo-duration-base) var(--ndo-easing), background-color var(--ndo-duration-base) var(--ndo-easing);
  }
  .menutoggle__bars { position: relative; }
  .menutoggle__bars::before,
  .menutoggle__bars::after { content: ''; position: absolute; left: 0; }
  .menutoggle__bars::before { transform: translateY(-6px); }
  .menutoggle__bars::after { transform: translateY(6px); }
  /* Open: the middle bar fades and the outer two cross into an X. */
  .rail--open .menutoggle__bars { background: transparent; }
  .rail--open .menutoggle__bars::before { transform: rotate(45deg); }
  .rail--open .menutoggle__bars::after { transform: rotate(-45deg); }

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

  /* The theme toggle sits in the rail head, beside the brand, so it is in view
     on every page and at every width (below 860px, next to the hamburger). Same
     box as the hamburger, and like it drawn in CSS rather than taken from an
     icon set: a disc half lit, the half that shows is the theme it switches to. */
  .railtools { display: flex; align-items: center; gap: var(--ndo-spacing-2); }
  .themetoggle {
    display: inline-flex;
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 1px solid rgb(255 255 255 / 0.15);
    border-radius: var(--ndo-radius-md);
    background: transparent;
    color: #fff;
    cursor: pointer;
    transition: var(--ndo-transition-colors);
  }
  .themetoggle:hover { background: rgb(255 255 255 / 0.07); }
  /* On a pinned page the toggle still works (the choice applies to the rest of
     the site) but reads as quieter, so the light page does not look like a bug. */
  .themetoggle--pinned { opacity: 0.5; }
  .themetoggle:focus-visible { outline: 2px solid rgb(var(--ndo-brand-teal-300)); outline-offset: 2px; }
  .themetoggle__disc {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 1.5px solid currentColor;
    background: linear-gradient(90deg, currentColor 50%, transparent 50%);
    transition: transform var(--ndo-duration-base) var(--ndo-easing);
  }
  .themetoggle[aria-pressed='true'] .themetoggle__disc { transform: rotate(180deg); }

  .version { margin: auto 0 0; padding: 0 8px; font-size: var(--ndo-text-xs); color: rgb(255 255 255 / 0.3); }
  kbd {
    font-family: var(--ndo-font-mono);
    border: 1px solid rgb(255 255 255 / 0.2);
    border-radius: var(--ndo-radius-sm);
    padding: 0 3px;
  }

  .main { min-height: 100vh; background: var(--ndo-color-bg-app); }
  /* File paths and package names in running text break rather than widen the
     page; a code block keeps white-space: pre and scrolls. */
  .main :global(code) { overflow-wrap: break-word; }

  /* Mobile: the rail becomes a sticky top bar (brand + hamburger), and the
     rest of it drops down over the page as a scrollable panel. */
  @media (max-width: 860px) {
    /* minmax(0, …): a bare 1fr floors at the content's min width, so one
       unbreakable code line widened the column past the screen and pushed
       the hamburger off it. */
    .chrome { grid-template-columns: minmax(0, 1fr); }
    .main { min-width: 0; }
    /* Token tables keep their columns and scroll sideways. */
    .main :global(table.token-table) { display: block; overflow-x: auto; }
    .rail {
      height: auto;
      overflow: visible;
      padding: var(--ndo-spacing-2) var(--ndo-spacing-3);
      z-index: 50;
    }
    /* The gradient hairline moves from the right edge to the bottom edge. */
    .rail::after { top: auto; left: 0; width: auto; height: 2px; }
    .menutoggle { display: inline-flex; }
    .themetoggle { width: 40px; height: 40px; }
    .railbody {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      max-height: calc(100dvh - 100%);
      overflow-y: auto;
      padding: var(--ndo-spacing-4) var(--ndo-spacing-3);
      background: rgb(var(--ndo-brand-ink));
      box-shadow: 0 12px 24px rgb(0 0 0 / 0.35);
    }
    .rail--open .railbody { display: flex; }
    .version { margin-top: var(--ndo-spacing-2); }
  }
</style>
