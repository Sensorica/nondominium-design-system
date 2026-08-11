<script lang="ts">
  // Gate chrome: a single centred card on the app canvas. Gates are the screens
  // nobody can demo in a real deployment, because they only appear when an agent
  // happens to be in an unusual state. Here each one is an ordinary URL.
  import type { Snippet } from 'svelte';
  import { paths } from '$lib/paths';
  import { joining } from '$lib/guards/joining.svelte';
  let { children }: { children: Snippet } = $props();
</script>

<div class="gate">
  <div class="gate__card">
    <a class="gate__brand" href={paths.appHome()}>
      <span aria-hidden="true">🧿</span> Nondominium
    </a>
    {@render children()}
  </div>
  <p class="gate__status ndo-mono">joining.status = {joining.status}</p>
</div>

<style>
  .gate {
    min-height: 100vh;
    background: var(--ndo-color-bg-app);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--ndo-spacing-4);
    padding: var(--ndo-spacing-6) var(--ndo-spacing-4);
  }
  .gate__card {
    width: 100%;
    max-width: 520px;
    background: rgb(var(--ndo-color-card-bg));
    border: 1px solid var(--ndo-color-border);
    border-radius: var(--ndo-radius-xl);
    box-shadow: var(--ndo-shadow-md);
    padding: var(--ndo-spacing-6);
    display: flex;
    flex-direction: column;
    gap: var(--ndo-spacing-4);
  }
  .gate__brand {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: var(--ndo-text-sm);
    font-weight: var(--ndo-weight-semibold);
    color: var(--ndo-color-text-secondary);
    text-decoration: none;
  }
  .gate__status { text-align: center; }
</style>
