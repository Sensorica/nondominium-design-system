<script lang="ts">
  // The true root. Owns the token sheet, the design-system chrome, and the
  // comments host (mounted once so it covers the playbook, the scenarios, and
  // the prototype alike).
  //
  // The prototype at /app renders WITHOUT this chrome: it is meant to look like
  // the product, not like documentation about the product.
  import '../app.css';
  import '$lib/styles/app.css';
  import { page } from '$app/state';
  import { paths } from '$lib/paths';
  import CommentsHost from '$lib/components/comments/CommentsHost.svelte';

  let { children } = $props();

  const current = $derived(page.url.pathname);
  const isApp = $derived(current.startsWith(paths.appHome()));

  const playbookLinks = [
    { href: paths.playbookButtons(), label: 'Buttons', icon: '🔘' },
    { href: paths.playbookBadges(), label: 'Badges', icon: '🏷️' },
    { href: paths.playbookCards(), label: 'Cards', icon: '🃏' },
    { href: paths.playbookInputs(), label: 'Inputs', icon: '✏️' },
    { href: paths.playbookNavigation(), label: 'Navigation', icon: '🧭' },
    { href: paths.playbookStatus(), label: 'Status', icon: '🟢' },
    { href: paths.playbookShell(), label: 'Shell', icon: '🖼️' },
  ];
  const scenarioLinks = [
    { href: paths.scenarioLobbyBrowse(), label: 'Lobby browse', icon: '🏛️' },
    { href: paths.scenarioNdoCreation(), label: 'NDO creation', icon: '➕' },
    { href: paths.scenarioNdoLifecycle(), label: 'NDO lifecycle', icon: '🔄' },
    { href: paths.scenarioGroupCollaboration(), label: 'Group collaboration', icon: '👥' },
    { href: paths.scenarioAgentIdentity(), label: 'Agent identity', icon: '🪪' },
    { href: paths.scenarioGovernanceReview(), label: 'Governance review', icon: '⚖️' },
  ];
</script>

<svelte:head>
  <link rel="stylesheet" href={paths.tokenSheet()} />
</svelte:head>

<CommentsHost />

{#if isApp}
  {@render children()}
{:else}
  <div class="chrome">
    <aside class="rail">
      <a class="brand" href={paths.home()}>
        <span class="brand__mark" aria-hidden="true">🧿</span>
        <span>
          <span class="brand__title">Nondominium</span>
          <span class="brand__sub">Design System</span>
        </span>
      </a>

      <a class="appmode" href={paths.appHome()}>🚀 App mode</a>

      <nav class="nav">
        <div class="group">
          <a class="grouphead" href={paths.tokens()} class:on={current === paths.tokens()}>🎨 Tokens</a>
        </div>

        <div class="group">
          <a class="grouphead" href={paths.playbook()} class:on={current.startsWith(paths.playbook())}>
            📖 Playbook
          </a>
          {#each playbookLinks as link (link.href)}
            <a class="item" href={link.href} class:item--on={current === link.href}>
              <span class="ic" aria-hidden="true">{link.icon}</span>{link.label}
            </a>
          {/each}
        </div>

        <div class="group">
          <a class="grouphead" href={paths.scenarios()} class:on={current.startsWith(paths.scenarios())}>
            🖼️ Scenarios
          </a>
          {#each scenarioLinks as link (link.href)}
            <a class="item" href={link.href} class:item--on={current === link.href}>
              <span class="ic" aria-hidden="true">{link.icon}</span>{link.label}
            </a>
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
  .chrome { display: grid; grid-template-columns: var(--ndo-sidebar-width) 1fr; min-height: 100vh; }
  .rail {
    background: rgb(var(--ndo-gray-900));
    padding: var(--ndo-spacing-4) var(--ndo-spacing-3);
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: var(--ndo-spacing-4);
  }
  .brand { display: flex; align-items: center; gap: 10px; text-decoration: none; }
  .brand__mark { font-size: 22px; }
  .brand__title { display: block; font-size: var(--ndo-text-sm); font-weight: var(--ndo-weight-bold); color: #fff; }
  .brand__sub { display: block; font-size: var(--ndo-text-xs); color: rgb(255 255 255 / 0.5); }

  .appmode {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 9px 12px;
    border-radius: var(--ndo-radius-lg);
    background: rgb(var(--ndo-primary-600));
    color: #fff;
    font-size: var(--ndo-text-sm);
    font-weight: var(--ndo-weight-semibold);
    text-decoration: none;
    transition: var(--ndo-transition-colors);
  }
  .appmode:hover { background: rgb(var(--ndo-primary-500)); }

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
  .grouphead:hover, .grouphead.on { color: rgb(255 255 255 / 0.75); }
  .item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    border-radius: var(--ndo-radius-md);
    font-size: var(--ndo-text-sm);
    color: rgb(255 255 255 / 0.65);
    text-decoration: none;
    transition: var(--ndo-transition-colors);
  }
  .item:hover { background: rgb(255 255 255 / 0.08); color: rgb(255 255 255 / 0.92); }
  .item--on { background: rgb(255 255 255 / 0.12); color: #fff; }
  .ic { width: 18px; text-align: center; }

  .version { margin: auto 0 0; padding: 0 8px; font-size: var(--ndo-text-xs); color: rgb(255 255 255 / 0.28); }
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
  }
</style>
