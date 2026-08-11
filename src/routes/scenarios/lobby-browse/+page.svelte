<script lang="ts">
  // Scenario: filtering. The interesting claim here is the filter algebra —
  // OR inside a dimension, AND across dimensions — because it is the only part
  // a reviewer cannot check by looking at a single component.
  import { paths } from '$lib/paths';
  import { INITIAL_NDOS } from '$lib/mock';
  import { LIFECYCLE_STAGES, RESOURCE_NATURES } from '$lib/types';
  import { STAGE_VOCAB, NATURE_VOCAB } from '$lib/ndo-ui';
  import Chip from '$lib/components/shared/Chip.svelte';
  import NdoCard from '$lib/components/shared/NdoCard.svelte';
  import EmptyState from '$lib/components/shared/EmptyState.svelte';

  let stages = $state<string[]>(['Active', 'Distributed']);
  let natures = $state<string[]>([]);

  const results = $derived(
    INITIAL_NDOS.filter(
      (n) =>
        (stages.length === 0 || stages.includes(n.lifecycle_stage)) &&
        (natures.length === 0 || natures.includes(n.resource_nature))
    )
  );

  function toggle(list: string[], value: string) {
    return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
  }
</script>

<div class="ndo-shell__content">
  <header>
    <h1 class="ndo-h1">🏛️ Lobby browse</h1>
    <p class="ndo-p mt-2" style="max-width:62ch">
      The lobby is the only surface that needs no identity at all. An agent with no profile, no
      group and no Person entry can read all of it — which means the filters have to do the work
      that an account would otherwise do.
    </p>
  </header>

  <section class="ndo-panel">
    <div class="ndo-panel__head"><h2 class="ndo-h3">The filter algebra</h2></div>
    <div class="ndo-panel__body flex flex-col gap-4">
      <p class="ndo-small">
        Selecting <strong>Active</strong> and <strong>Distributed</strong> shows objects at either
        stage. Adding <strong>Physical</strong> narrows that set rather than widening it. OR inside a
        dimension, AND across dimensions: it is what a reader expects, and it is the only reading
        under which adding a chip can never surprise them with more results.
      </p>

      <div>
        <p class="ndo-label mb-2">Lifecycle stage</p>
        <div class="chips">
          {#each LIFECYCLE_STAGES as stage (stage)}
            <Chip
              label={stage}
              icon={STAGE_VOCAB[stage].icon}
              pressed={stages.includes(stage)}
              onclick={() => (stages = toggle(stages, stage))}
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
              pressed={natures.includes(nature)}
              onclick={() => (natures = toggle(natures, nature))}
            />
          {/each}
        </div>
      </div>

      <p class="ndo-mono">
        stages [{stages.join(', ') || 'any'}] AND natures [{natures.join(', ') || 'any'}] → {results.length} results
      </p>
    </div>
  </section>

  {#if results.length === 0}
    <EmptyState icon="🔍" title="Nothing matches those filters" body="Loosen a dimension, or clear them all.">
      {#snippet action()}
        <button class="ndo-btn ndo-btn--ghost" onclick={() => { stages = []; natures = []; }}>Clear filters</button>
      {/snippet}
    </EmptyState>
  {:else}
    <div class="grid">
      {#each results as ndo (ndo.id)}
        <NdoCard {ndo} />
      {/each}
    </div>
  {/if}

  <p class="ndo-small">
    Live version: <a href={paths.appHome()}>the lobby in the prototype</a>.
  </p>
</div>

<style>
  .chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .grid { display: grid; gap: var(--ndo-spacing-4); grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
  a { color: var(--ndo-color-link); }
</style>
