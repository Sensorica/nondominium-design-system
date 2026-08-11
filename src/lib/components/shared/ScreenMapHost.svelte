<script lang="ts">
  // The screen-map overlay: every keyed screen in the prototype, grouped, one
  // keypress away. Rendered once from the app root layout so it covers the
  // shell and gate groups alike.
  //
  // Implemented in Svelte rather than as a custom element (the reference
  // implementation's overlay predates its own registry conventions): the
  // catalogue needs the router, and a CE would have to re-emit navigation
  // events to reach it.
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { screenMap, SCREEN_MAP_GROUPS, urlForKey, labelForKey, screenKeyForUrl } from '$lib/screen-map.svelte';

  const currentKey = $derived(screenKeyForUrl(page.url));

  function onKeydown(e: KeyboardEvent) {
    const tag = (e.target as HTMLElement)?.tagName;
    if (tag && ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'm') screenMap.open = !screenMap.open;
    else if (e.key === 'Escape' && screenMap.open) screenMap.open = false;
  }

  function go(key: string) {
    const url = urlForKey(key);
    screenMap.open = false;
    if (url) goto(url);
  }
</script>

<svelte:window onkeydown={onKeydown} />

{#if screenMap.open}
  <div
    class="ndo-modal-backdrop"
    role="button"
    tabindex="-1"
    onclick={(e) => { if (e.target === e.currentTarget) screenMap.open = false; }}
    onkeydown={() => {}}
  >
    <div class="ndo-modal map" role="dialog" aria-modal="true" aria-label="Screen map">
      <header class="ndo-modal__head">
        <div>
          <h2 class="ndo-h3">🗺️ Screen map</h2>
          <p class="ndo-small">Every keyed screen in the prototype. Press <kbd>m</kbd> to toggle.</p>
        </div>
        <button class="ndo-btn ndo-btn--ghost ndo-btn--sm" onclick={() => (screenMap.open = false)}>Close</button>
      </header>

      <div class="ndo-modal__body">
        {#each SCREEN_MAP_GROUPS as group (group.title)}
          <section>
            <p class="ndo-label mb-2">{group.title}</p>
            <div class="grid gap-1.5" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr))">
              {#each group.keys as key (key)}
                <button
                  class="entry"
                  class:entry--current={key === currentKey}
                  onclick={() => go(key)}
                >
                  <span class="entry__label">{labelForKey(key)}</span>
                  <span class="ndo-mono">{key}</span>
                </button>
              {/each}
            </div>
          </section>
        {/each}
      </div>
    </div>
  </div>
{/if}

<style>
  .map { max-width: 880px; }
  .entry {
    display: flex;
    flex-direction: column;
    gap: 2px;
    text-align: left;
    padding: var(--ndo-spacing-2) var(--ndo-spacing-3);
    border: 1px solid var(--ndo-color-border);
    border-radius: var(--ndo-radius-lg);
    background: rgb(var(--ndo-color-card-bg));
    cursor: pointer;
    font-family: inherit;
    transition: var(--ndo-transition-colors);
  }
  .entry:hover { background: var(--ndo-color-surface); border-color: rgb(var(--ndo-primary-300)); }
  .entry--current { background: rgb(var(--ndo-primary-50)); border-color: rgb(var(--ndo-primary-400)); }
  .entry__label {
    font-size: var(--ndo-text-sm);
    font-weight: var(--ndo-weight-medium);
    color: var(--ndo-color-text-primary);
  }
  kbd {
    font-family: var(--ndo-font-mono);
    font-size: var(--ndo-text-xs);
    background: var(--ndo-color-surface);
    border: 1px solid var(--ndo-color-border);
    border-radius: var(--ndo-radius-sm);
    padding: 0 4px;
  }
</style>
