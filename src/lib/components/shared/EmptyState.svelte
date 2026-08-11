<script lang="ts">
  // Empty states are one sentence and, where an action would resolve them, one
  // action. See the brand brief: length is a content rule, not a taste call.
  import type { Snippet } from 'svelte';
  let {
    icon = '🫙',
    title,
    body = '',
    action,
  }: { icon?: string; title: string; body?: string; action?: Snippet } = $props();
</script>

<div class="ndo-empty">
  <span class="ndo-empty__icon" aria-hidden="true">{icon}</span>
  <p class="ndo-h3">{title}</p>
  {#if body}<p class="ndo-small mt-2">{body}</p>{/if}
  {#if action}<div class="mt-4">{@render action()}</div>{/if}
</div>
