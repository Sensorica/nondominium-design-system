<script lang="ts">
  // The authenticated shell: sidebar rail plus the content column. Everything a
  // member does after the gates lives here.
  import type { Snippet } from 'svelte';
  import Sidebar from '$lib/components/shared/Sidebar.svelte';
  let { children }: { children: Snippet } = $props();
</script>

<div class="ndo-shell">
  <Sidebar />
  <main class="ndo-shell__main">
    <div class="ndo-shell__content">
      {@render children()}
    </div>
  </main>
</div>
