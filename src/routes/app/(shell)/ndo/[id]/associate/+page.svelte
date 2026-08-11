<script lang="ts">
  // Associating an NDO with a group commits a SoftLink on that group's cell.
  // Soft, because it says "this group cares about this object", not "this object
  // belongs to this group" — an NDO can be visible in several groups at once and
  // is owned by none of them.
  import { page } from '$app/state';
  import { paths } from '$lib/paths';
  import { appState, associateNdo, ME_ID, ndoById, showToast } from '$lib/state.svelte';
  import EmptyState from '$lib/components/shared/EmptyState.svelte';

  const id = $derived(page.params.id ?? '');
  const ndo = $derived(ndoById(id));
  const myGroups = $derived(appState.groups.filter((g) => g.memberIds.includes(ME_ID)));

  function associate(groupId: string, groupName: string) {
    associateNdo(id, groupId);
    showToast('success', `Linked to ${groupName}`);
  }
</script>

{#if !ndo}
  <EmptyState icon="🫥" title="No such NDO" />
{:else}
  <section class="ndo-panel">
    <div class="ndo-panel__head"><h2 class="ndo-h3">🔗 Associate {ndo.name}</h2></div>
    <div class="ndo-panel__body flex flex-col gap-4">
      <p class="ndo-small">
        A SoftLink on a group cell makes this NDO visible in that group's browser. It grants no
        rights and claims no ownership.
      </p>
      <ul class="list">
        {#each myGroups as group (group.id)}
          {@const linked = ndo.groupIds.includes(group.id)}
          <li>
            <span>
              <strong class="ndo-small">{group.name}</strong>
              <span class="ndo-mono block">{group.networkSeed}</span>
            </span>
            {#if linked}
              <span class="ndo-badge ndo-badge--regime-nondominium">🔗 Linked</span>
            {:else}
              <button class="ndo-btn ndo-btn--ghost ndo-btn--sm" onclick={() => associate(group.id, group.name)}>
                Link
              </button>
            {/if}
          </li>
        {/each}
      </ul>
    </div>
    <div class="ndo-modal__foot">
      <a class="ndo-btn ndo-btn--ghost" href={paths.ndoDetail(id)}>Done</a>
    </div>
  </section>
{/if}

<style>
  .list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--ndo-spacing-3); }
  .list li { display: flex; align-items: center; justify-content: space-between; gap: var(--ndo-spacing-3); }
  .block { display: block; }
</style>
