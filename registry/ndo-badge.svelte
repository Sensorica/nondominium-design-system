<svelte:options customElement="ndo-badge" />

<script lang="ts">
  // NOTE: registry files must use legacy `export let` syntax.
  // Svelte 5 runes ($props) are incompatible with customElement compiler mode.
  export let variant:
    | 'lifecycle-ideation'
    | 'lifecycle-specification'
    | 'lifecycle-development'
    | 'lifecycle-prototype'
    | 'lifecycle-stable'
    | 'lifecycle-distributed'
    | 'lifecycle-active'
    | 'lifecycle-hibernating'
    | 'lifecycle-deprecated'
    | 'lifecycle-end-of-life'
    | 'nature-physical'
    | 'nature-digital'
    | 'nature-service'
    | 'nature-hybrid'
    | 'nature-information'
    | 'regime-nondominium'
    | 'regime-commons'
    | 'regime-collective'
    | 'regime-pool'
    | 'regime-common-pool'
    | 'regime-private'
    | 'regime-nondominium-filter'
    | 'regime-commons-filter'
    | 'regime-collective-filter'
    | 'regime-pool-filter'
    | 'regime-common-pool-filter'
    | 'regime-private-filter'
    | 'coming-soon'
    | 'neutral' = 'neutral';

  export let label = '';
</script>

<span class="badge {variant}">
  <slot>{label}</slot>
</span>

<style>
  :host { display: inline-flex; }

  .badge {
    display: inline-flex;
    align-items: center;
    padding: var(--ndo-spacing-0-5) var(--ndo-spacing-2);
    border-radius: var(--ndo-radius-sm);
    font-family: var(--ndo-font-sans);
    font-size: var(--ndo-text-xs);
    font-weight: var(--ndo-weight-medium);
    line-height: 1.5;
    white-space: nowrap;
    border: 1px solid transparent;
  }

  /* Lifecycle */
  .badge.lifecycle-ideation      { background: rgb(var(--ndo-gray-100));    color: rgb(var(--ndo-gray-600)); }
  .badge.lifecycle-specification { background: rgb(var(--ndo-blue-50));     color: rgb(var(--ndo-blue-600)); }
  .badge.lifecycle-development   { background: rgb(var(--ndo-indigo-100));  color: rgb(var(--ndo-indigo-700)); }
  .badge.lifecycle-prototype     { background: rgb(var(--ndo-amber-100));   color: rgb(var(--ndo-amber-700)); }
  .badge.lifecycle-stable        { background: rgb(var(--ndo-green-100));   color: rgb(var(--ndo-green-700)); }
  .badge.lifecycle-distributed   { background: rgb(var(--ndo-teal-100));    color: rgb(var(--ndo-teal-700)); }
  .badge.lifecycle-active        { background: rgb(var(--ndo-emerald-100)); color: rgb(var(--ndo-emerald-700)); }
  .badge.lifecycle-hibernating   { background: rgb(var(--ndo-yellow-100));  color: rgb(var(--ndo-yellow-700)); }
  .badge.lifecycle-deprecated    { background: rgb(var(--ndo-orange-100));  color: rgb(var(--ndo-orange-700)); }
  .badge.lifecycle-end-of-life   { background: rgb(var(--ndo-red-100));     color: rgb(var(--ndo-red-700)); }

  /* Resource nature */
  .badge.nature-physical    { background: rgb(var(--ndo-blue-100));   color: rgb(var(--ndo-blue-700)); }
  .badge.nature-digital     { background: rgb(var(--ndo-purple-100)); color: rgb(var(--ndo-purple-700)); }
  .badge.nature-service     { background: rgb(var(--ndo-orange-100)); color: rgb(var(--ndo-orange-700)); }
  .badge.nature-hybrid      { background: rgb(var(--ndo-teal-100));   color: rgb(var(--ndo-teal-700)); }
  .badge.nature-information { background: rgb(var(--ndo-indigo-100)); color: rgb(var(--ndo-indigo-700)); }

  /* Property regime on cards — dashed gray (hApp NdoCard) */
  .badge.regime-nondominium,
  .badge.regime-commons,
  .badge.regime-collective,
  .badge.regime-pool,
  .badge.regime-common-pool,
  .badge.regime-private {
    background: transparent;
    border: 1px dashed rgb(var(--ndo-gray-400));
    color: rgb(var(--ndo-gray-700));
  }

  /* Property regime filter chips — filled colors (hApp NdoBrowser) */
  .badge.regime-private-filter {
    background: rgb(var(--ndo-gray-100));
    color: rgb(var(--ndo-gray-600));
    border: 1px dashed rgb(var(--ndo-gray-300));
  }
  .badge.regime-commons-filter {
    background: rgb(var(--ndo-cyan-100));
    color: rgb(var(--ndo-cyan-700));
    border: 1px dashed rgb(var(--ndo-cyan-300));
  }
  .badge.regime-nondominium-filter {
    background: rgb(var(--ndo-emerald-100));
    color: rgb(var(--ndo-emerald-700));
    border: 1px dashed rgb(var(--ndo-emerald-300));
  }
  .badge.regime-common-pool-filter {
    background: rgb(var(--ndo-rose-100));
    color: rgb(var(--ndo-rose-700));
    border: 1px dashed rgb(var(--ndo-rose-300));
  }
  .badge.regime-collective-filter {
    background: rgb(var(--ndo-violet-100));
    color: rgb(var(--ndo-violet-700));
    border: 1px dashed rgb(var(--ndo-violet-300));
  }
  .badge.regime-pool-filter {
    background: rgb(var(--ndo-teal-100));
    color: rgb(var(--ndo-teal-700));
    border: 1px dashed rgb(var(--ndo-teal-300));
  }

  /* Special */
  .badge.coming-soon { background: rgb(var(--ndo-amber-50)); color: rgb(var(--ndo-amber-600)); }
  .badge.neutral     { background: rgb(var(--ndo-gray-100)); color: rgb(var(--ndo-gray-600)); }
</style>
