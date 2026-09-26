<script lang="ts">
  // Shell for every direction route. Full-bleed, like /app: the root layout
  // drops the design-system chrome for these paths. What stays, outside the
  // direction's own markup: a way back out, the `m` screen map, and (from the
  // root layout) the `c` comments.
  //
  // It also brings the shared store up. Directions A to E run on one store,
  // loaded here once the page is in the browser, and the direction renders
  // only after that, so no direction ever sees the server's placeholder state.
  // F keeps its own backend and is rendered as soon as the page is mounted.
  //
  // A direction fills `.stage` with `height: 100%`, never `100vh`: the status
  // banner, when there is one, takes its own row above it.
  import { onDestroy, type Snippet } from 'svelte';
  import { afterNavigate } from '$app/navigation';
  import { page } from '$app/state';
  import { paths } from '$lib/paths';
  import ScreenMapHost from '$lib/components/shared/ScreenMapHost.svelte';
  import { screenMap } from '$lib/screen-map.svelte';
  import { DIRECTION_LIST, type DirectionSlug } from '$lib/prototypes/directions';
  import { proto } from '$lib/prototypes/store/store.svelte';
  import { dropParams } from '$lib/prototypes/url.svelte';
  import { modals } from '$lib/prototypes/ui';

  let { children }: { children: Snippet } = $props();

  const direction = $derived(
    DIRECTION_LIST.find((d) => page.url.pathname === paths.protoDirection(d.slug as DirectionSlug))
  );

  // afterNavigate runs once the router has started (on the first load and on
  // every navigation), so ?fresh=1 and ?example=1 work from a link inside the
  // site as well as on a cold load, and dropping them from the URL cannot hit
  // a router that does not exist yet.
  let mounted = $state(false);
  afterNavigate(({ from, to }) => {
    mounted = true;
    // A shared modal belongs to the direction that opened it (its `after`
    // callback navigates within that direction), so moving to another
    // direction closes it. The exit chip stays clickable above an open modal
    // on purpose: leaving is always one click away, and leaving closes it.
    if (from?.url.pathname !== to?.url.pathname) modals.close();
    if (!to || !direction || direction.store !== 'shared') return;
    const { consumed } = proto.load(to.url.searchParams);
    if (consumed.length) dropParams(consumed);
  });

  // Leaving the directions altogether (the index, /app, the screen map)
  // unmounts this layout: close any modal so it cannot reappear later.
  onDestroy(() => modals.close());

  const live = $derived(mounted && (direction?.store !== 'shared' || proto.ready));
</script>

<div class="frame">
  {#if direction?.status === 'archived'}
    <p class="banner banner--archived">
      {direction.id} {direction.name} is archived: it was considered and not chosen.
      <a href={paths.prototypes()}>Back to the directions</a>
    </p>
  {:else if direction?.status === 'target'}
    <p class="banner banner--target">
      {direction.id} {direction.name} is the chosen target: this is the direction being implemented against the hApp.
      <a href={paths.prototypes()}>All directions</a>
    </p>
  {/if}

  <div class="stage">
    {#if live}
      {@render children()}
    {:else}
      <p class="loading">Loading {direction ? `${direction.id} ${direction.name}` : 'the prototype'}…</p>
    {/if}
  </div>
</div>

<ScreenMapHost />

<!-- Prototype-only chrome. Bottom left, opposite the comments button. A
     direction whose own UI sits in that corner moves it with
     --proto-exit-left / --proto-exit-bottom on :root (see the README). -->
<div class="exit">
  <a class="exit__home" href={paths.prototypes()}>
    <img src={paths.logoMark()} alt="" width="18" height="18" />
    <span>Directions</span>
  </a>
  <button class="exit__map" onclick={() => (screenMap.open = true)} title="Screen map (m)">
    Screens <kbd>m</kbd>
  </button>
</div>

<style>
  .frame {
    display: flex;
    flex-direction: column;
    height: 100vh;
    height: 100dvh;
  }
  .stage {
    position: relative;
    flex: 1;
    min-height: 0;
  }

  .banner {
    margin: 0;
    padding: 5px 16px;
    font-family: var(--ndo-font-sans);
    font-size: var(--ndo-text-xs);
    line-height: 18px;
    border-bottom: 1px solid;
  }
  .banner a {
    margin-left: 8px;
    color: inherit;
    font-weight: var(--ndo-weight-semibold);
  }
  .banner--archived {
    background: rgb(var(--ndo-gray-100));
    color: rgb(var(--ndo-gray-700));
    border-color: rgb(var(--ndo-gray-300));
  }
  .banner--target {
    background: rgb(var(--ndo-blue-50));
    color: rgb(var(--ndo-blue-800));
    border-color: rgb(var(--ndo-blue-100));
  }

  .loading {
    margin: 0;
    padding: var(--ndo-spacing-6);
    font-family: var(--ndo-font-sans);
    font-size: var(--ndo-text-sm);
    color: var(--ndo-color-text-muted);
  }

  .exit {
    position: fixed;
    bottom: var(--proto-exit-bottom, 16px);
    left: var(--proto-exit-left, 16px);
    z-index: 60;
    display: flex;
    align-items: stretch;
    border-radius: var(--ndo-radius-pill);
    background: rgb(var(--ndo-brand-ink));
    box-shadow: var(--ndo-shadow-lg);
    overflow: hidden;
  }
  .exit__home,
  .exit__map {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 7px 12px;
    border: none;
    background: none;
    font-family: var(--ndo-font-sans);
    font-size: var(--ndo-text-xs);
    font-weight: var(--ndo-weight-medium);
    color: rgb(255 255 255 / 0.82);
    text-decoration: none;
    cursor: pointer;
    transition: var(--ndo-transition-colors);
  }
  .exit__home:hover,
  .exit__map:hover {
    background: rgb(255 255 255 / 0.1);
    color: rgb(255 255 255);
  }
  .exit__map {
    border-left: 1px solid rgb(255 255 255 / 0.14);
  }
  kbd {
    font-family: var(--ndo-font-mono);
    font-size: 10px;
    border: 1px solid rgb(255 255 255 / 0.25);
    border-radius: var(--ndo-radius-sm);
    padding: 0 4px;
    color: rgb(var(--ndo-brand-teal-300));
  }
  @media (max-width: 640px) {
    .exit__home span {
      display: none;
    }
  }
</style>
