<script lang="ts">
  // The lobby: browse every NDO the agent can see, across every group they
  // belong to. Filter chips are multi-select within a dimension and intersect
  // across dimensions — OR inside, AND across (REQ-UI-LOBBY-01).
  import { paths } from '$lib/paths';
  import { appState, filteredNdos, clearFilters, toggleFilter } from '$lib/state.svelte';
  import { LIFECYCLE_STAGES, PROPERTY_REGIMES, RESOURCE_NATURES } from '$lib/types';
  import { NATURE_VOCAB, REGIME_VOCAB, STAGE_VOCAB } from '$lib/ndo-ui';
  import Chip from '$lib/components/shared/Chip.svelte';
  import EmptyState from '$lib/components/shared/EmptyState.svelte';
  import NdoCard from '$lib/components/shared/NdoCard.svelte';

  const results = $derived(filteredNdos());
  const activeCount = $derived(
    appState.filters.stages.length + appState.filters.natures.length + appState.filters.regimes.length
  );
</script>

<header class="flex items-start justify-between gap-4 flex-wrap">
  <div>
    <h1 class="ndo-h1">🏛️ Lobby</h1>
    <p class="ndo-p mt-2" style="max-width:56ch">
      Every Nondominium Object visible to you. Browsing needs no identity at all — you only commit
      one when you act.
    </p>
  </div>
  <a class="ndo-btn ndo-btn--primary" href={paths.ndoCreate(appState.selectedGroupId ?? undefined)}>
    ➕ New NDO
  </a>
</header>

<section class="ndo-panel">
  <div class="ndo-panel__head">
    <h2 class="ndo-h3">Filters</h2>
    {#if activeCount > 0}
      <button class="ndo-btn ndo-btn--ghost ndo-btn--sm" onclick={clearFilters}>
        Clear {activeCount}
      </button>
    {/if}
  </div>
  <div class="ndo-panel__body flex flex-col gap-4">
    <div>
      <p class="ndo-label mb-2">Lifecycle stage</p>
      <div class="chips">
        {#each LIFECYCLE_STAGES as stage (stage)}
          <Chip
            label={stage}
            icon={STAGE_VOCAB[stage].icon}
            hint={STAGE_VOCAB[stage].hint}
            pressed={appState.filters.stages.includes(stage)}
            onclick={() => toggleFilter('stages', stage)}
          />
        {/each}
      </div>
    </div>
    <div>
      <p class="ndo-label mb-2">Resource nature</p>
      <div class="chips">
        {#each RESOURCE_NATURES as nature (nature)}
          <Chip
            label={nature}
            icon={NATURE_VOCAB[nature].icon}
            hint={NATURE_VOCAB[nature].hint}
            pressed={appState.filters.natures.includes(nature)}
            onclick={() => toggleFilter('natures', nature)}
          />
        {/each}
      </div>
    </div>
    <div>
      <p class="ndo-label mb-2">Property regime</p>
      <div class="chips">
        {#each PROPERTY_REGIMES as regime (regime)}
          <Chip
            label={regime}
            icon={REGIME_VOCAB[regime].icon}
            hint={REGIME_VOCAB[regime].hint}
            pressed={appState.filters.regimes.includes(regime)}
            onclick={() => toggleFilter('regimes', regime)}
          />
        {/each}
      </div>
    </div>
  </div>
</section>

<section>
  <p class="ndo-label mb-3">{results.length} NDO{results.length === 1 ? '' : 's'}</p>
  {#if results.length === 0}
    <EmptyState icon="🔍" title="Nothing matches those filters" body="Loosen a dimension, or clear them all.">
      {#snippet action()}
        <button class="ndo-btn ndo-btn--ghost" onclick={clearFilters}>Clear filters</button>
      {/snippet}
    </EmptyState>
  {:else}
    <div class="grid">
      {#each results as ndo (ndo.id)}
        <NdoCard {ndo} />
      {/each}
    </div>
  {/if}
</section>

<style>
  .chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .grid { display: grid; gap: var(--ndo-spacing-4); grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
</style>
