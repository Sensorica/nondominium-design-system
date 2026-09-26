<script lang="ts">
  // The screen-map overlay host: owns the `m` toggle and mounts the panel.
  // Rendered from the /app layout and from the direction layout, so the map is
  // one keypress away from the replica and from every direction.
  //
  // Implemented in Svelte rather than as a custom element (the reference
  // implementation's overlay predates its own registry conventions): the
  // catalogue needs the router, and a CE would have to re-emit navigation
  // events to reach it.
  import { screenMap } from '$lib/screen-map.svelte';
  import ScreenMapPanel from './ScreenMapPanel.svelte';

  function onKeydown(e: KeyboardEvent) {
    const tag = (e.target as HTMLElement)?.tagName;
    if (tag && ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'm') screenMap.open = !screenMap.open;
    else if (e.key === 'Escape' && screenMap.open) screenMap.open = false;
  }
</script>

<svelte:window onkeydown={onKeydown} />

{#if screenMap.open}
  <ScreenMapPanel />
{/if}
