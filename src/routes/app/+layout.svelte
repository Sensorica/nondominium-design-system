<script lang="ts">
  // Root of the prototype. The app's own chrome starts one level down, so the
  // connection states can render full-screen exactly as they do in production.
  //
  // Two things are mounted here that the app does not have, both deliberately
  // outside its markup so no replica component is touched: the screen-map
  // overlay, and a way back out. Without the second one the prototype is a
  // one-way door — the design-system rail is hidden here, and the app has no
  // link to a design system.
  import type { Snippet } from 'svelte';
  import { paths } from '$lib/paths';
  import ScreenMapHost from '$lib/components/shared/ScreenMapHost.svelte';
  import { screenMap } from '$lib/screen-map.svelte';

  let { children }: { children: Snippet } = $props();
</script>

{@render children()}

<ScreenMapHost />

<!-- Prototype-only chrome. Bottom left, opposite the comments button. -->
<div class="exit">
  <a class="exit__home" href={paths.home()}>
    <img src={paths.logoMark()} alt="" width="18" height="18" />
    <span>Design system</span>
  </a>
  <button class="exit__map" onclick={() => (screenMap.open = true)} title="Screen map (m)">
    Screens <kbd>m</kbd>
  </button>
</div>

<style>
  .exit {
    position: fixed;
    bottom: 24px;
    /* Clear of the app's sidebar (w-52 = 13rem), whose own footer button sits at
       the same corner. Prototype chrome must never cover app chrome — a control
       you cannot click is worse than no shortcut at all. */
    left: calc(13rem + 24px);
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
    padding: 9px 14px;
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
  .exit__map:hover { background: rgb(255 255 255 / 0.1); color: #fff; }

  .exit__map { border-left: 1px solid rgb(255 255 255 / 0.14); }

  kbd {
    font-family: var(--ndo-font-mono);
    font-size: 10px;
    border: 1px solid rgb(255 255 255 / 0.25);
    border-radius: var(--ndo-radius-sm);
    padding: 0 4px;
    color: rgb(var(--ndo-brand-teal-300));
  }

  @media (max-width: 640px) {
    .exit { bottom: 16px; left: calc(13rem + 12px); }
    .exit__home span { display: none; }
  }
</style>
