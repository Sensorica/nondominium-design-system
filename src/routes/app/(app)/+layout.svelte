<script lang="ts">
  // Mirrors ui/src/routes/+layout.svelte: the app shell wraps every page.
  //
  // The app's root layout also mounts ProfileSetupModal here, and LobbyView
  // mounts a second instance of the same modal. Two native <dialog> elements
  // for one thing is a duplication in the app worth fixing there; the prototype
  // keeps only the LobbyView one, because two Melt dialogs on one page fight
  // over the open state and neither opens. The surface is reachable at
  // /app?profile=1.
  import type { Snippet } from 'svelte';
  import AppShell from '$lib/replica/shell/AppShell.svelte';

  let { children }: { children: Snippet } = $props();
</script>

<AppShell>
  {@render children()}
</AppShell>
