<script lang="ts">
  // The app shell's left rail: identity at the top, groups in the middle,
  // prototype affordances at the bottom.
  //
  // The "New NDO" link is context-aware (REQ-UI-NAV-03): with a group selected
  // it opens the group-scoped create flow, otherwise it lands on the page that
  // explains why NDOs are created inside a group. There is deliberately no
  // global create button — that is the navigational hierarchy, not an oversight.
  import { page } from '$app/state';
  import { paths } from '$lib/paths';
  import { appState, ME_ID, agentLabel } from '$lib/state.svelte';
  import { joining } from '$lib/guards/joining.svelte';
  import { screenMap } from '$lib/screen-map.svelte';

  const current = $derived(page.url.pathname);
  const groups = $derived(appState.groups.filter((g) => g.memberIds.includes(ME_ID)));
  const newNdoHref = $derived(paths.ndoCreate(appState.selectedGroupId ?? undefined));
</script>

<aside class="ndo-shell__aside">
  <a class="brand" href={paths.appHome()}>
    <span class="brand__mark" aria-hidden="true">🧿</span>
    <span>
      <span class="brand__title">Nondominium</span>
      <span class="brand__sub">Prototype</span>
    </span>
  </a>

  <div class="who">
    <span class="who__name">{appState.profile?.nickname ?? 'Anonymous'}</span>
    <span class="who__meta">
      {#if joining.can.hasPerson}
        Person: {agentLabel(ME_ID)}
      {:else}
        No Person entry yet
      {/if}
    </span>
    <a class="who__link" href={paths.profile()}>
      {appState.profile ? 'View profile' : 'Set up profile'}
    </a>
  </div>

  <nav class="nav" aria-label="Primary">
    <a class="item" href={paths.appHome()} class:item--on={current === paths.appHome()}>
      <span aria-hidden="true">🏛️</span> Lobby
    </a>
    <a class="item" href={paths.agents()} class:item--on={current.startsWith(paths.agents())}>
      <span aria-hidden="true">👤</span> Agents
    </a>
    <a class="item" href={newNdoHref.split('?')[0]} class:item--on={current.startsWith(paths.ndoCreate().split('?')[0])}>
      <span aria-hidden="true">➕</span> New NDO
    </a>

    <p class="section">Groups</p>
    {#each groups as group (group.id)}
      <a
        class="item"
        href={paths.groupDetail(group.id)}
        class:item--on={current.startsWith(paths.groupDetail(group.id))}
        onclick={() => (appState.selectedGroupId = group.id)}
      >
        <span aria-hidden="true">👥</span> {group.name}
      </a>
    {/each}
    <a class="item item--muted" href={paths.groupCreate()}>＋ Create group</a>
    <a class="item item--muted" href={paths.groupJoin()}>🔑 Join group</a>
  </nav>

  <div class="foot">
    <button class="mapbtn" onclick={() => (screenMap.open = true)}>🗺️ Screen map <kbd>m</kbd></button>
    <a class="foot__link" href={paths.home()}>← Design system</a>
  </div>
</aside>

<style>
  .brand { display: flex; align-items: center; gap: 10px; text-decoration: none; }
  .brand__mark { font-size: 22px; }
  .brand__title { display: block; font-size: var(--ndo-text-sm); font-weight: var(--ndo-weight-bold); color: #fff; }
  .brand__sub { display: block; font-size: var(--ndo-text-xs); color: rgb(255 255 255 / 0.5); }

  .who {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: var(--ndo-spacing-3);
    border-radius: var(--ndo-radius-lg);
    background: rgb(255 255 255 / 0.06);
  }
  .who__name { font-size: var(--ndo-text-sm); font-weight: var(--ndo-weight-semibold); color: #fff; }
  .who__meta { font-size: var(--ndo-text-xs); color: rgb(255 255 255 / 0.5); }
  .who__link { font-size: var(--ndo-text-xs); color: rgb(var(--ndo-primary-300)); text-decoration: none; margin-top: 4px; }
  .who__link:hover { text-decoration: underline; }

  .nav { display: flex; flex-direction: column; gap: 2px; flex: 1; }
  .section {
    margin: var(--ndo-spacing-3) 0 var(--ndo-spacing-1);
    padding: 0 var(--ndo-spacing-2);
    font-size: var(--ndo-text-xs);
    font-weight: var(--ndo-weight-semibold);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgb(255 255 255 / 0.4);
  }
  .item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    border-radius: var(--ndo-radius-md);
    font-size: var(--ndo-text-sm);
    color: rgb(255 255 255 / 0.68);
    text-decoration: none;
    transition: var(--ndo-transition-colors);
  }
  .item:hover { background: rgb(255 255 255 / 0.08); color: rgb(255 255 255 / 0.92); }
  .item--on { background: rgb(255 255 255 / 0.13); color: #fff; }
  .item--muted { color: rgb(255 255 255 / 0.45); font-size: var(--ndo-text-xs); }

  .foot { display: flex; flex-direction: column; gap: 8px; margin-top: auto; }
  .mapbtn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border-radius: var(--ndo-radius-md);
    border: 1px solid rgb(255 255 255 / 0.15);
    background: transparent;
    color: rgb(255 255 255 / 0.7);
    font: inherit;
    font-size: var(--ndo-text-xs);
    cursor: pointer;
  }
  .mapbtn:hover { background: rgb(255 255 255 / 0.08); color: #fff; }
  kbd {
    font-family: var(--ndo-font-mono);
    border: 1px solid rgb(255 255 255 / 0.2);
    border-radius: var(--ndo-radius-sm);
    padding: 0 4px;
    margin-left: auto;
  }
  .foot__link { font-size: var(--ndo-text-xs); color: rgb(255 255 255 / 0.4); text-decoration: none; padding: 0 10px; }
  .foot__link:hover { color: rgb(255 255 255 / 0.7); }
</style>
