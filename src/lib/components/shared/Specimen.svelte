<script lang="ts">
  // A specimen block: what it is, the live thing, and optionally the markup.
  // Every playbook page is a stack of these, so the pages stay comparable.
  import type { Snippet } from 'svelte';
  let {
    title,
    note = '',
    code = '',
    demo,
  }: { title: string; note?: string; code?: string; demo: Snippet } = $props();
</script>

<section class="ndo-panel">
  <div class="ndo-panel__head">
    <h2 class="ndo-h3">{title}</h2>
  </div>
  <div class="ndo-panel__body flex flex-col gap-4">
    {#if note}<p class="ndo-small">{note}</p>{/if}
    <div class="stage">{@render demo()}</div>
    {#if code}<pre class="code"><code>{code}</code></pre>{/if}
  </div>
</section>

<style>
  .stage {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--ndo-spacing-3);
    padding: var(--ndo-spacing-4);
    border: 1px dashed var(--ndo-color-border);
    border-radius: var(--ndo-radius-lg);
    background: var(--ndo-color-surface);
  }
  .code {
    margin: 0;
    padding: var(--ndo-spacing-3);
    border-radius: var(--ndo-radius-lg);
    background: rgb(var(--ndo-gray-900));
    color: rgb(var(--ndo-gray-100));
    font-family: var(--ndo-font-mono);
    font-size: var(--ndo-text-xs);
    line-height: var(--ndo-lh-sm);
    overflow-x: auto;
  }
</style>
