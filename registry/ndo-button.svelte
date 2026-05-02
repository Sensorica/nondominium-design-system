<svelte:options customElement="ndo-button" />

<script lang="ts">
  // NOTE: registry files must use legacy `export let` syntax.
  export let variant: 'primary' | 'ghost' | 'destructive' = 'primary';
  export let disabled = false;
  export let href = '';
  export let type: 'button' | 'submit' | 'reset' = 'button';
</script>

{#if href}
  <a
    class="btn {variant}"
    href={disabled ? undefined : href}
    aria-disabled={disabled || undefined}
  >
    <slot />
  </a>
{:else}
  <button class="btn {variant}" {type} {disabled}>
    <slot />
  </button>
{/if}

<style>
  :host { display: inline-flex; }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--ndo-spacing-2);
    padding: var(--ndo-spacing-1-5) var(--ndo-spacing-4);
    border-radius: var(--ndo-radius-md);
    font-family: var(--ndo-font-sans);
    font-size: var(--ndo-text-sm);
    font-weight: var(--ndo-weight-medium);
    line-height: var(--ndo-lh-sm);
    cursor: pointer;
    border: 1px solid transparent;
    text-decoration: none;
    transition: var(--ndo-transition-colors), var(--ndo-transition-shadow);
    white-space: nowrap;
  }

  .btn:disabled,
  .btn[aria-disabled='true'] {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* Primary */
  .btn.primary {
    background: rgb(var(--ndo-blue-600));
    color: #fff;
    border-color: rgb(var(--ndo-blue-600));
  }
  .btn.primary:hover:not(:disabled) {
    background: rgb(var(--ndo-blue-700));
    border-color: rgb(var(--ndo-blue-700));
  }

  /* Ghost */
  .btn.ghost {
    background: transparent;
    color: rgb(var(--ndo-gray-700));
    border-color: rgb(var(--ndo-gray-300));
  }
  .btn.ghost:hover:not(:disabled) {
    background: rgb(var(--ndo-gray-50));
    color: rgb(var(--ndo-gray-900));
  }

  /* Destructive */
  .btn.destructive {
    background: rgb(var(--ndo-red-700));
    color: #fff;
    border-color: rgb(var(--ndo-red-700));
  }
  .btn.destructive:hover:not(:disabled) {
    background: rgb(var(--ndo-red-700) / 0.85);
  }
</style>
