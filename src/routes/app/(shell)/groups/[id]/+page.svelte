<script lang="ts">
  // Group-scoped NDO browser (REQ-UI-GRP-03). Same card, same filters idea as
  // the lobby, narrowed to what this group's SoftLinks point at.
  import { page } from '$app/state';
  import { paths } from '$lib/paths';
  import { ndosForGroup } from '$lib/state.svelte';
  import NdoCard from '$lib/components/shared/NdoCard.svelte';
  import EmptyState from '$lib/components/shared/EmptyState.svelte';

  const id = $derived(page.params.id ?? '');
  const ndos = $derived(ndosForGroup(id));
</script>

{#if ndos.length === 0}
  <EmptyState icon="🧿" title="No NDOs in this group yet" body="Create the first one.">
    {#snippet action()}
      <a class="ndo-btn ndo-btn--primary" href={paths.ndoCreate(id)}>➕ New NDO</a>
    {/snippet}
  </EmptyState>
{:else}
  <div class="grid">
    {#each ndos as ndo (ndo.id)}
      <NdoCard {ndo} />
    {/each}
  </div>
{/if}

<style>
  .grid { display: grid; gap: var(--ndo-spacing-4); grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
</style>
