<script lang="ts">
  // Playbook chrome. Each category page is a specimen sheet: what the component
  // is for, every variant it has, and the recipe to reproduce it. The rail in
  // the root layout already lists the categories, so this adds only the page
  // frame and the registry bundle the custom-element demos need.
  import type { Snippet } from 'svelte';
  import { paths } from '$lib/paths';
  let { children }: { children: Snippet } = $props();
</script>

<svelte:head>
  <script type="module" src={paths.registryBundle()}></script>
</svelte:head>

<div class="ndo-shell__content">
  {@render children()}
</div>
