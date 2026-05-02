<svelte:options customElement="ndo-status-dot" />

<script lang="ts">
  // NOTE: registry files must use legacy `export let` syntax.
  export let status: 'active' | 'inactive' | 'pending' | 'coming-soon' = 'pending';
  export let label = '';
</script>

<span class="status-dot {status}" aria-label={label || status}>
  <span class="dot" aria-hidden="true"></span>
  {#if label}
    <span class="label">{label}</span>
  {/if}
</span>

<style>
  :host { display: inline-flex; }

  .status-dot {
    display: inline-flex;
    align-items: center;
    gap: var(--ndo-spacing-1-5);
    font-family: var(--ndo-font-sans);
    font-size: var(--ndo-text-xs);
    font-weight: var(--ndo-weight-medium);
  }

  .dot {
    display: inline-block;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .status-dot.active      { color: rgb(var(--ndo-emerald-700)); }
  .status-dot.active .dot { background: rgb(var(--ndo-emerald-700)); }

  .status-dot.inactive      { color: rgb(var(--ndo-gray-500)); }
  .status-dot.inactive .dot { background: rgb(var(--ndo-gray-400)); }

  .status-dot.pending      { color: rgb(var(--ndo-amber-600)); }
  .status-dot.pending .dot { background: rgb(var(--ndo-amber-600)); }

  .status-dot.coming-soon      { color: rgb(var(--ndo-amber-600)); }
  .status-dot.coming-soon .dot {
    background: rgb(var(--ndo-amber-50));
    border: 2px solid rgb(var(--ndo-amber-600));
  }

  .label { line-height: 1; }
</style>
