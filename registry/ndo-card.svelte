<svelte:options customElement="ndo-card" />

<script lang="ts">
  // NOTE: registry files must use legacy `export let` syntax.
  export let name = '';
  export let description = '';
  export let hash = '';
  export let href = '#';
  // Serialized badges: "variant:label;variant:label"
  // e.g. "lifecycle-active:Active;nature-physical:Physical;regime-nondominium:Nondominium"
  export let badges = '';

  type Badge = { variant: string; label: string };

  $: parsedBadges = badges
    ? badges
        .split(';')
        .filter(Boolean)
        .map((pair): Badge => {
          const colonIdx = pair.indexOf(':');
          if (colonIdx === -1) return { variant: 'neutral', label: pair };
          return {
            variant: pair.slice(0, colonIdx),
            label: pair.slice(colonIdx + 1)
          };
        })
    : ([] as Badge[]);
</script>

<a {href} class="card">
  {#if parsedBadges.length > 0}
    <div class="badges">
      {#each parsedBadges as b (b.variant + b.label)}
        <ndo-badge variant={b.variant} label={b.label}></ndo-badge>
      {/each}
    </div>
  {/if}

  <h3 class="name">{name}</h3>

  {#if description}
    <p class="description">{description}</p>
  {/if}

  {#if hash}
    <p class="hash">#{hash.slice(0, 12)}…</p>
  {/if}
</a>

<style>
  :host { display: block; }

  .card {
    display: block;
    background: rgb(var(--ndo-color-card-bg));
    border: 1px solid rgb(var(--ndo-gray-200));
    border-radius: var(--ndo-radius-lg);
    padding: var(--ndo-spacing-4);
    text-decoration: none;
    color: inherit;
    box-shadow: var(--ndo-shadow-sm);
    transition: var(--ndo-transition-shadow);
  }
  .card:hover { box-shadow: var(--ndo-shadow-md); }

  .badges {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ndo-spacing-2);
    margin-bottom: var(--ndo-spacing-2);
  }

  .name {
    margin: 0;
    font-family: var(--ndo-font-sans);
    font-size: var(--ndo-text-lg);
    font-weight: var(--ndo-weight-semibold);
    color: rgb(var(--ndo-gray-900));
    line-height: var(--ndo-lh-lg);
  }

  .description {
    margin: var(--ndo-spacing-1) 0 0;
    font-family: var(--ndo-font-sans);
    font-size: var(--ndo-text-sm);
    color: rgb(var(--ndo-gray-600));
    line-height: var(--ndo-lh-sm);
    /* line-clamp equivalent in shadow DOM */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .hash {
    margin: var(--ndo-spacing-1) 0 0;
    font-family: var(--ndo-font-mono);
    font-size: var(--ndo-text-xs);
    color: rgb(var(--ndo-gray-400));
  }
</style>
