<script lang="ts">
  // Root of the prototype. Mounts the screen-map overlay once, the way the DS
  // needs, and nothing else: the app's own chrome starts one level down so the
  // connection states can render full-screen, exactly as they do in production.
  import type { Snippet } from 'svelte';
  import ScreenMapHost from '$lib/components/shared/ScreenMapHost.svelte';
  let { children }: { children: Snippet } = $props();
</script>

{@render children()}

<ScreenMapHost />
