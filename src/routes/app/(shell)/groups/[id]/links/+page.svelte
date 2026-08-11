<script lang="ts">
  // SoftLinks: the group cell's record of which NDOs it is associated with.
  // A SoftLink is not a hard cross-NDO relation — those live in the governance
  // zome and are shown on the NDO's composition tab.
  import { page } from '$app/state';
  import { paths } from '$lib/paths';
  import { groupById, ndosForGroup } from '$lib/state.svelte';
  import NdoBadge from '$lib/components/shared/NdoBadge.svelte';
  import EmptyState from '$lib/components/shared/EmptyState.svelte';
  import { shortHash } from '$lib/ndo-ui';

  const id = $derived(page.params.id ?? '');
  const group = $derived(groupById(id));
  const linked = $derived(ndosForGroup(id));
</script>

<section class="ndo-panel">
  <div class="ndo-panel__head">
    <h2 class="ndo-h3">SoftLinks on {group?.name ?? 'this group'}</h2>
    <span class="ndo-field__hint">{linked.length} associations</span>
  </div>
  <div class="ndo-panel__body">
    {#if linked.length === 0}
      <EmptyState icon="🔗" title="No associations" body="Create an NDO in this group, or associate an existing one." />
    {:else}
      <ul class="list">
        {#each linked as ndo (ndo.id)}
          <li>
            <span>
              <a href={paths.ndoDetail(ndo.id)}>{ndo.name}</a>
              <span class="ndo-mono block">{shortHash(ndo.hash)}</span>
            </span>
            <NdoBadge stage={ndo.lifecycle_stage} />
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</section>

<style>
  .list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--ndo-spacing-3); }
  .list li { display: flex; align-items: center; justify-content: space-between; gap: var(--ndo-spacing-3); }
  .block { display: block; }
  a { color: var(--ndo-color-link); font-size: var(--ndo-text-sm); font-weight: var(--ndo-weight-medium); }
</style>
