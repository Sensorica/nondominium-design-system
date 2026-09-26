<script lang="ts">
  // A labelled field (ui.jsx PField). The label wraps the control.
  import type { Snippet } from 'svelte';
  import './proto.css';

  let { label, hint = null, children }: { label: string; hint?: string | null; children: Snippet } = $props();
</script>

<label class="field">
  <span class="pu-label">{label}</span>
  {@render children()}
  {#if hint}<span class="pu-hint">{hint}</span>{/if}
</label>

<style>
  .field {
    display: block;
    min-width: 0;
  }
</style>
