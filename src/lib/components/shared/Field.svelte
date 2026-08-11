<script lang="ts">
  // Label, control, hint and error in one place, so every form in the prototype
  // spaces and describes its inputs identically.
  import type { Snippet } from 'svelte';
  let {
    label,
    hint = '',
    error = '',
    required = false,
    control,
  }: { label: string; hint?: string; error?: string; required?: boolean; control: Snippet } = $props();
</script>

<label class="ndo-field">
  <span class="ndo-field__label">
    {label}{#if required}<span aria-hidden="true" style="color:rgb(var(--ndo-red-600))"> *</span>{/if}
  </span>
  {@render control()}
  {#if error}
    <span class="ndo-field__error">⚠️ {error}</span>
  {:else if hint}
    <span class="ndo-field__hint">{hint}</span>
  {/if}
</label>
