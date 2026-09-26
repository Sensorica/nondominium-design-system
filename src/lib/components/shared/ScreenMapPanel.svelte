<script lang="ts">
  // The screen map itself: every keyed screen, in two sections (the current
  // app and the prototype directions), filtered as you type. Mounted by
  // ScreenMapHost only while the map is open, so opening it is a fresh start:
  // empty search, the section you are in, the screen you are on in view.
  //
  // Keyboard: the search has focus on open. ArrowUp and ArrowDown move the
  // selection, Enter opens it, Escape clears the search and then closes.
  // Everything the map handles stops here, so a direction's own Escape (a
  // drawer, a modal) does not fire underneath it.
  import { onMount, tick } from 'svelte';
  import { browser } from '$app/environment';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { paths } from '$lib/paths';
  import { currentUrl } from '$lib/replica/url-state.svelte';
  import {
    screenMap,
    SCREEN_MAP_GROUPS,
    SECTION_TITLE,
    KIND_LABEL,
    kindForKey,
    labelForKey,
    screenKeyForUrl,
    sectionForKey,
    urlForKey,
    type ScreenMapGroup,
    type ScreenMapSection
  } from '$lib/screen-map.svelte';

  const SECTIONS: ScreenMapSection[] = ['app', 'prototypes'];

  // currentUrl, not page.url: the prototype's tab and modal clicks are shallow
  // replaceState writes, which SvelteKit keeps out of page.url.
  const here = (): URL => (browser ? currentUrl() : page.url);
  const currentKey = $derived(screenKeyForUrl(here()));

  function startSection(): ScreenMapSection {
    const key = screenKeyForUrl(here());
    if (key) return sectionForKey(key);
    return here().pathname.startsWith(paths.prototypes()) ? 'prototypes' : 'app';
  }

  // What a search matches: the label, the key, the group, the kind, and for a
  // direction its name, status and fidelity. Built once; the catalogue is static.
  const HAY: Record<string, string> = Object.fromEntries(
    SCREEN_MAP_GROUPS.flatMap((g) => {
      const extra = g.direction ? `${g.direction.status} ${g.direction.fidelity} fidelity` : '';
      return g.keys.map((key) => [
        key,
        [labelForKey(key), key, g.title, KIND_LABEL[kindForKey(key)], extra].join(' ').toLowerCase()
      ]);
    })
  );

  const TOTAL: Record<ScreenMapSection, number> = {
    app: SCREEN_MAP_GROUPS.filter((g) => g.section === 'app').reduce((n, g) => n + g.keys.length, 0),
    prototypes: SCREEN_MAP_GROUPS.filter((g) => g.section === 'prototypes').reduce((n, g) => n + g.keys.length, 0)
  };

  let section = $state<ScreenMapSection>(startSection());
  let query = $state('');
  let active = $state(0);
  let navigating = false;

  let rootEl = $state<HTMLDivElement>();
  let inputEl = $state<HTMLInputElement>();
  let bodyEl = $state<HTMLDivElement>();

  const terms = $derived(query.trim().toLowerCase().split(/\s+/).filter(Boolean));
  const matches = (key: string) => terms.every((t) => HAY[key].includes(t));

  const filtered = (s: ScreenMapSection): { group: ScreenMapGroup; keys: string[] }[] =>
    SCREEN_MAP_GROUPS.filter((g) => g.section === s)
      .map((group) => ({ group, keys: group.keys.filter(matches) }))
      .filter((x) => x.keys.length > 0);

  const found = $derived({
    app: filtered('app').reduce((n, x) => n + x.keys.length, 0),
    prototypes: filtered('prototypes').reduce((n, x) => n + x.keys.length, 0)
  });
  const visible = $derived(filtered(section));
  const flat = $derived(visible.flatMap((x) => x.keys));
  const activeKey = $derived(flat[Math.min(active, flat.length - 1)] ?? '');
  const other = $derived<ScreenMapSection>(section === 'app' ? 'prototypes' : 'app');

  const rowId = (key: string) => `screen-map-row-${key.replace(/[^a-z0-9-]/gi, '_')}`;

  function select(key: string) {
    const i = flat.indexOf(key);
    if (i >= 0) active = i;
  }

  function close() {
    screenMap.open = false;
  }

  function go(key: string) {
    const url = urlForKey(key);
    navigating = true;
    screenMap.open = false;
    // paths.* already carry the base, as every other goto in the replica.
    if (url) goto(url);
  }

  function setSection(s: ScreenMapSection) {
    section = s;
    active = 0;
    if (!query) select(currentKey);
  }

  function reveal(key: string, focusRow: boolean) {
    const el = document.getElementById(rowId(key));
    if (!el) return;
    el.scrollIntoView({ block: 'nearest' });
    if (focusRow) el.focus();
  }

  function move(delta: number, focusRow: boolean) {
    if (!flat.length) return;
    active = (Math.min(active, flat.length - 1) + delta + flat.length) % flat.length;
    tick().then(() => reveal(activeKey, focusRow));
  }

  function onInput() {
    active = 0;
  }

  function onKeydown(e: KeyboardEvent) {
    const onRow = (e.target as HTMLElement).dataset?.screenKey !== undefined;
    const inSearch = e.target === inputEl;
    let handled = true;

    if (e.key === 'Escape') {
      if (query) {
        query = '';
        active = 0;
        select(currentKey);
        inputEl?.focus();
      } else close();
    } else if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && (inSearch || onRow)) {
      move(e.key === 'ArrowDown' ? 1 : -1, onRow);
    } else if (e.key === 'Enter' && inSearch) {
      if (activeKey) go(activeKey);
    } else if (e.key === 'Tab') {
      trapTab(e);
      return;
    } else handled = false;

    if (handled) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  /** Keep Tab inside the dialog: it is modal. */
  function trapTab(e: KeyboardEvent) {
    if (!rootEl) return;
    const focusables = [
      ...rootEl.querySelectorAll<HTMLElement>('button:not([tabindex="-1"]), input')
    ].filter((el) => el.getClientRects().length > 0);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      last.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === last) {
      first.focus();
      e.preventDefault();
    }
    e.stopPropagation();
  }

  function onTabKeydown(e: KeyboardEvent) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    e.stopPropagation();
    setSection(other);
    tick().then(() => document.getElementById(`screen-map-tab-${section}`)?.focus());
  }

  /** Put the screen you are on in the middle of the scroll area. */
  function centreCurrent() {
    const el = bodyEl?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!el || !bodyEl) return;
    const r = el.getBoundingClientRect();
    const b = bodyEl.getBoundingClientRect();
    bodyEl.scrollTop += r.top - b.top - b.height / 2 + r.height / 2;
  }

  onMount(() => {
    const previous = document.activeElement as HTMLElement | null;
    select(currentKey);
    // A listener of our own rather than a delegated handler, so stopping the
    // keys we handle reliably keeps them from the window listeners below.
    rootEl?.addEventListener('keydown', onKeydown);
    inputEl?.focus();
    tick().then(centreCurrent);
    return () => {
      rootEl?.removeEventListener('keydown', onKeydown);
      if (!navigating && previous?.isConnected) previous.focus();
    };
  });
</script>

{#snippet row(key: string, label: string, showKind: boolean)}
  {@const kind = kindForKey(key)}
  <button
    id={rowId(key)}
    class="row"
    class:row--active={key === activeKey}
    class:row--current={key === currentKey}
    aria-current={key === currentKey ? 'page' : undefined}
    tabindex={key === activeKey ? 0 : -1}
    data-screen-key={key}
    title="{labelForKey(key)} ({key})"
    onclick={() => go(key)}
    onmousemove={() => select(key)}
    onfocus={() => select(key)}
  >
    {#if showKind}<span class="kind kind--{kind}">{KIND_LABEL[kind]}</span>{/if}
    <span class="row__label">{label}</span>
    {#if key === currentKey}<span class="here">You are here</span>{/if}
    <span class="row__key">{key}</span>
  </button>
{/snippet}

<div
  bind:this={rootEl}
  class="backdrop"
  role="presentation"
  onclick={(e) => { if (e.target === e.currentTarget) close(); }}
>
  <div class="panel" role="dialog" aria-modal="true" aria-labelledby="screen-map-title">
    <header class="head">
      <div class="head__title">
        <img src={paths.logoMark()} alt="" width="22" height="22" />
        <div>
          <h2 id="screen-map-title">Screen map</h2>
          <p>Every keyed screen, grouped. Type to filter, pick one to open it.</p>
        </div>
      </div>
      <button class="ndo-btn ndo-btn--ghost ndo-btn--sm" onclick={close}>Close</button>
    </header>

    <div class="toolbar">
      <label class="search">
        <span class="sr-only">Filter screens by label or key</span>
        <svg class="search__icon" viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
          <circle cx="7" cy="7" r="4.75" fill="none" stroke="currentColor" stroke-width="1.5" />
          <path d="M10.5 10.5 14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
        <input
          bind:this={inputEl}
          bind:value={query}
          oninput={onInput}
          class="search__input"
          type="search"
          placeholder="Filter by label or key"
          autocomplete="off"
          spellcheck="false"
          aria-controls="screen-map-results"
          aria-activedescendant={activeKey ? rowId(activeKey) : undefined}
        />
      </label>

      <div class="seg" role="tablist" aria-label="Sections">
        {#each SECTIONS as s (s)}
          <button
            id="screen-map-tab-{s}"
            class="seg__tab"
            role="tab"
            aria-selected={section === s}
            aria-controls="screen-map-results"
            tabindex={section === s ? 0 : -1}
            onclick={() => setSection(s)}
            onkeydown={onTabKeydown}
          >
            {SECTION_TITLE[s]}
            <span class="seg__count">{terms.length ? found[s] : TOTAL[s]}</span>
          </button>
        {/each}
      </div>

      <p class="count" aria-live="polite">
        {#if terms.length}
          {found[section]} of {TOTAL[section]} screens match
        {:else}
          {TOTAL[section]} screens
        {/if}
      </p>
    </div>

    <div
      bind:this={bodyEl}
      id="screen-map-results"
      class="body"
      role="tabpanel"
      aria-labelledby="screen-map-tab-{section}"
    >
      {#if flat.length === 0}
        <div class="empty">
          <p>No screen in {SECTION_TITLE[section]} matches "{query.trim()}".</p>
          {#if found[other] > 0}
            <button class="ndo-btn ndo-btn--ghost ndo-btn--sm" onclick={() => setSection(other)}>
              Show {found[other]} in {SECTION_TITLE[other]}
            </button>
          {:else}
            <button class="ndo-btn ndo-btn--ghost ndo-btn--sm" onclick={() => { query = ''; inputEl?.focus(); }}>
              Clear the search
            </button>
          {/if}
        </div>
      {:else if section === 'app'}
        <div class="cols">
          {#each visible as { group, keys } (group.title)}
            <section class="group">
              <h3 class="group__title">
                {group.title}
                <span class="group__count">{terms.length ? `${keys.length} of ${group.keys.length}` : group.keys.length}</span>
              </h3>
              {#each keys as key (key)}
                {@render row(key, labelForKey(key), true)}
              {/each}
            </section>
          {/each}
        </div>
      {:else}
        <div class="dirs">
          {#each visible as { group, keys } (group.title)}
            {@const d = group.direction}
            {#if d}
              <section
                class="dir"
                class:dir--target={d.status === 'target'}
                class:dir--archived={d.status === 'archived'}
                aria-label="{group.title}, {d.status}"
              >
                <header class="dir__head">
                  <span class="dir__letter">{d.id}</span>
                  <div class="dir__name">
                    <h3>{d.name}</h3>
                    <p>{d.pitch}</p>
                  </div>
                  <div class="dir__meta">
                    <span class="status status--{d.status}">{d.status}</span>
                    <span class="fid">{d.fidelity} fidelity</span>
                  </div>
                </header>
                <div class="dir__views">
                  {#each keys as key (key)}
                    {@render row(key, d.views.find((v) => key.endsWith(`:${v.id}`))?.label ?? d.views[0].label, false)}
                  {/each}
                </div>
              </section>
            {:else}
              <section class="index">
                {#each keys as key (key)}
                  {@render row(key, labelForKey(key), false)}
                {/each}
              </section>
            {/if}
          {/each}
        </div>
      {/if}
    </div>

    <footer class="foot" aria-hidden="true">
      <span><kbd>↑</kbd> <kbd>↓</kbd> move</span>
      <span><kbd>Enter</kbd> open</span>
      <span><kbd>Esc</kbd> clear, then close</span>
      <span><kbd>m</kbd> toggle the map</span>
    </footer>
  </div>
</div>

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 80;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--ndo-spacing-4);
    background: var(--ndo-color-overlay);
  }

  .panel {
    position: relative;
    display: flex;
    flex-direction: column;
    width: min(1500px, 100%);
    height: min(940px, 100%);
    overflow: hidden;
    border-radius: var(--ndo-radius-xl);
    background: rgb(var(--ndo-color-card-bg));
    box-shadow: var(--ndo-shadow-xl);
    color: var(--ndo-color-text-primary);
    font-family: var(--ndo-font-sans);
  }
  /* The design system's own chrome marks its cards with the brand gradient
     along the top edge. */
  .panel::before {
    content: '';
    position: absolute;
    inset: 0 0 auto;
    height: 3px;
    background: var(--ndo-brand-gradient);
  }

  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ndo-spacing-4);
    padding: var(--ndo-spacing-4) var(--ndo-spacing-6) var(--ndo-spacing-3);
  }
  .head__title { display: flex; align-items: center; gap: var(--ndo-spacing-3); }
  .head h2 {
    margin: 0;
    font-size: var(--ndo-text-lg);
    line-height: var(--ndo-lh-lg);
    font-weight: var(--ndo-weight-semibold);
  }
  .head p {
    margin: 0;
    font-size: var(--ndo-text-xs);
    line-height: var(--ndo-lh-xs);
    color: var(--ndo-color-text-muted);
  }

  .toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--ndo-spacing-3) var(--ndo-spacing-4);
    padding: 0 var(--ndo-spacing-6) var(--ndo-spacing-3);
    border-bottom: 1px solid var(--ndo-color-border);
  }

  .search {
    position: relative;
    flex: 1 1 320px;
    max-width: 520px;
  }
  .search__icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--ndo-color-text-muted);
    pointer-events: none;
  }
  .search__input {
    width: 100%;
    height: 36px;
    padding: 0 var(--ndo-spacing-3) 0 32px;
    border: 1px solid var(--ndo-color-border-strong);
    border-radius: var(--ndo-radius-lg);
    background: rgb(var(--ndo-color-card-bg));
    color: var(--ndo-color-text-primary);
    font: inherit;
    font-size: var(--ndo-text-sm);
    transition: var(--ndo-transition-colors);
  }
  .search__input::placeholder { color: var(--ndo-color-text-muted); }
  .search__input:focus {
    outline: none;
    border-color: rgb(var(--ndo-primary-500));
    box-shadow: var(--ndo-focus-ring);
  }

  .seg {
    display: inline-flex;
    gap: 2px;
    padding: 3px;
    border: 1px solid var(--ndo-color-border);
    border-radius: var(--ndo-radius-lg);
    background: var(--ndo-color-surface);
  }
  .seg__tab {
    display: inline-flex;
    align-items: center;
    gap: var(--ndo-spacing-2);
    height: 28px;
    padding: 0 var(--ndo-spacing-3);
    border: none;
    border-radius: var(--ndo-radius-md);
    background: transparent;
    color: var(--ndo-color-text-secondary);
    font: inherit;
    font-size: var(--ndo-text-sm);
    font-weight: var(--ndo-weight-medium);
    cursor: pointer;
    transition: var(--ndo-transition-colors);
  }
  .seg__tab:hover { color: var(--ndo-color-text-primary); }
  .seg__tab[aria-selected='true'] {
    background: rgb(var(--ndo-color-card-bg));
    color: var(--ndo-color-text-primary);
    box-shadow: var(--ndo-shadow-sm), inset 0 -2px 0 rgb(var(--ndo-brand-teal-500));
  }
  .seg__tab:focus-visible { outline: none; box-shadow: var(--ndo-focus-ring); }
  .seg__count {
    min-width: 22px;
    padding: 0 6px;
    border-radius: var(--ndo-radius-pill);
    background: rgb(var(--ndo-gray-500) / 0.15);
    font-family: var(--ndo-font-mono);
    font-size: 11px;
    line-height: 18px;
    text-align: center;
  }

  .count {
    margin: 0 0 0 auto;
    font-size: var(--ndo-text-xs);
    color: var(--ndo-color-text-muted);
  }

  .body {
    position: relative;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: var(--ndo-spacing-4) var(--ndo-spacing-6) var(--ndo-spacing-6);
  }

  /* ── Current app: groups flow down balanced columns, like an index ── */
  .cols {
    column-width: 440px;
    column-gap: var(--ndo-spacing-8);
  }
  .group {
    break-inside: avoid;
    margin-bottom: var(--ndo-spacing-5);
  }
  .group__title {
    display: flex;
    align-items: center;
    gap: var(--ndo-spacing-2);
    margin: 0 0 var(--ndo-spacing-1);
    padding: 0 var(--ndo-spacing-2) var(--ndo-spacing-1);
    border-bottom: 1px solid var(--ndo-color-border-subtle);
    font-size: var(--ndo-text-xs);
    line-height: var(--ndo-lh-xs);
    font-weight: var(--ndo-weight-semibold);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--ndo-color-text-muted);
  }
  .group__count {
    font-family: var(--ndo-font-mono);
    font-weight: var(--ndo-weight-normal);
    letter-spacing: 0;
    text-transform: none;
    color: var(--ndo-color-text-mono);
  }

  /* ── One entry: kind, label, key, on one line ── */
  .row {
    display: flex;
    align-items: center;
    gap: var(--ndo-spacing-2);
    width: 100%;
    min-height: 30px;
    padding: 3px var(--ndo-spacing-2);
    border: none;
    border-radius: var(--ndo-radius-md);
    background: transparent;
    color: var(--ndo-color-text-primary);
    font: inherit;
    text-align: left;
    cursor: pointer;
    transition: var(--ndo-transition-colors);
  }
  .row--active {
    background: rgb(var(--ndo-primary-500) / 0.1);
    box-shadow: inset 2px 0 0 rgb(var(--ndo-primary-600));
  }
  .row--current {
    background: rgb(var(--ndo-brand-teal-500) / 0.14);
    box-shadow: inset 3px 0 0 rgb(var(--ndo-brand-teal-500));
  }
  .row--current.row--active {
    background: rgb(var(--ndo-brand-teal-500) / 0.22);
  }
  .row:focus-visible {
    outline: none;
    box-shadow: var(--ndo-focus-ring);
  }
  .row__label {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: var(--ndo-text-sm);
    line-height: var(--ndo-lh-sm);
  }
  .row__key {
    flex: 0 1 auto;
    max-width: 45%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-family: var(--ndo-font-mono);
    font-size: 11px;
    color: var(--ndo-color-text-mono);
  }
  .here {
    flex: none;
    padding: 0 7px;
    border-radius: var(--ndo-radius-pill);
    background: rgb(var(--ndo-brand-teal-500));
    color: rgb(var(--ndo-brand-ink));
    font-size: 11px;
    line-height: 18px;
    font-weight: var(--ndo-weight-semibold);
  }

  /* Kind tags: the app's own 100/700 domain pairs, as tints so they hold on a
     dark card as well. */
  .kind {
    flex: none;
    width: 66px;
    padding: 0 4px;
    border-radius: var(--ndo-radius-sm);
    font-size: 11px;
    line-height: 18px;
    font-weight: var(--ndo-weight-medium);
    text-align: center;
  }
  .kind--page { background: rgb(var(--ndo-gray-500) / 0.14); color: rgb(var(--ndo-gray-700)); }
  .kind--tab { background: rgb(var(--ndo-blue-600) / 0.12); color: rgb(var(--ndo-blue-700)); }
  .kind--modal { background: rgb(var(--ndo-brand-violet-500) / 0.14); color: rgb(var(--ndo-brand-violet-700)); }
  .kind--panel { background: rgb(var(--ndo-indigo-700) / 0.1); color: rgb(var(--ndo-indigo-700)); }
  .kind--state { background: rgb(var(--ndo-amber-600) / 0.14); color: rgb(var(--ndo-amber-800)); }
  .kind--record { background: rgb(var(--ndo-brand-teal-500) / 0.16); color: rgb(var(--ndo-brand-teal-700)); }
  :global([data-theme='dark']) .kind--page { color: rgb(var(--ndo-gray-300)); }
  :global([data-theme='dark']) .kind--tab { color: rgb(var(--ndo-blue-300)); }
  :global([data-theme='dark']) .kind--modal { color: rgb(var(--ndo-brand-violet-300)); }
  :global([data-theme='dark']) .kind--panel { color: rgb(var(--ndo-indigo-300)); }
  :global([data-theme='dark']) .kind--state { color: rgb(var(--ndo-amber-300)); }
  :global([data-theme='dark']) .kind--record { color: rgb(var(--ndo-brand-teal-300)); }

  /* ── Prototype directions: one card per direction ── */
  .dirs {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: var(--ndo-spacing-4);
    align-items: start;
  }
  .index { grid-column: 1 / -1; }
  .dir {
    display: flex;
    flex-direction: column;
    gap: var(--ndo-spacing-2);
    padding: var(--ndo-spacing-3);
    border: 1px solid var(--ndo-color-border);
    border-radius: var(--ndo-radius-lg);
    background: rgb(var(--ndo-color-card-bg));
  }
  .dir--target {
    border-color: rgb(var(--ndo-brand-teal-500));
    box-shadow: 0 0 0 1px rgb(var(--ndo-brand-teal-500)), var(--ndo-shadow-md);
  }
  .dir--archived { opacity: 0.55; }
  .dir__head {
    display: flex;
    align-items: flex-start;
    gap: var(--ndo-spacing-3);
    padding: 0 var(--ndo-spacing-1) var(--ndo-spacing-2);
    border-bottom: 1px solid var(--ndo-color-border-subtle);
  }
  .dir__letter {
    flex: none;
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    border-radius: var(--ndo-radius-md);
    background: rgb(var(--ndo-brand-ink));
    color: rgb(var(--ndo-brand-teal-300));
    font-family: var(--ndo-font-mono);
    font-weight: var(--ndo-weight-bold);
  }
  .dir--target .dir__letter { background: var(--ndo-brand-gradient); color: rgb(var(--ndo-brand-ink)); }
  .dir__name { flex: 1; min-width: 0; }
  .dir__name h3 {
    margin: 0;
    font-size: var(--ndo-text-sm);
    line-height: var(--ndo-lh-sm);
    font-weight: var(--ndo-weight-semibold);
  }
  .dir__name p {
    margin: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: var(--ndo-text-xs);
    line-height: var(--ndo-lh-xs);
    color: var(--ndo-color-text-muted);
  }
  .dir__meta {
    flex: none;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
  }
  .status {
    padding: 0 8px;
    border: 1px solid var(--ndo-color-border-strong);
    border-radius: var(--ndo-radius-pill);
    font-size: 11px;
    line-height: 18px;
    font-weight: var(--ndo-weight-medium);
    text-transform: capitalize;
    color: var(--ndo-color-text-secondary);
  }
  .status--target {
    border-color: rgb(var(--ndo-brand-teal-500));
    background: rgb(var(--ndo-brand-teal-500));
    color: rgb(var(--ndo-brand-ink));
    font-weight: var(--ndo-weight-semibold);
  }
  .status--archived {
    border-style: dashed;
    color: var(--ndo-color-text-muted);
  }
  .fid {
    font-size: 11px;
    color: var(--ndo-color-text-muted);
  }

  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--ndo-spacing-3);
    padding: var(--ndo-spacing-12) var(--ndo-spacing-4);
    text-align: center;
  }
  .empty p {
    margin: 0;
    font-size: var(--ndo-text-sm);
    color: var(--ndo-color-text-secondary);
  }

  .foot {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ndo-spacing-1) var(--ndo-spacing-5);
    padding: var(--ndo-spacing-2) var(--ndo-spacing-6);
    border-top: 1px solid var(--ndo-color-border);
    background: var(--ndo-color-surface);
    font-size: var(--ndo-text-xs);
    color: var(--ndo-color-text-muted);
  }
  kbd {
    display: inline-block;
    min-width: 18px;
    padding: 0 4px;
    border: 1px solid var(--ndo-color-border-strong);
    border-radius: var(--ndo-radius-sm);
    background: rgb(var(--ndo-color-card-bg));
    font-family: var(--ndo-font-mono);
    font-size: 11px;
    line-height: 16px;
    text-align: center;
    color: var(--ndo-color-text-secondary);
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
  }

  @media (max-width: 720px) {
    .head, .toolbar, .body, .foot { padding-left: var(--ndo-spacing-4); padding-right: var(--ndo-spacing-4); }
    .count { margin-left: 0; }
    .cols { column-width: auto; }
    .dirs { grid-template-columns: 1fr; }
  }
</style>
