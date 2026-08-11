<script lang="ts">
  // Every group the agent belongs to, plus the two ways to get another one.
  // Groups are cloned DNA cells, so joining is provisioning, not a row insert.
  import { paths } from '$lib/paths';
  import { appState, ME_ID, ndosForGroup } from '$lib/state.svelte';
  import EmptyState from '$lib/components/shared/EmptyState.svelte';

  const mine = $derived(appState.groups.filter((g) => g.memberIds.includes(ME_ID)));
</script>

<header class="flex items-start justify-between gap-4 flex-wrap">
  <div>
    <h1 class="ndo-h1">👥 Groups</h1>
    <p class="ndo-p mt-2" style="max-width:56ch">
      Each group is its own cloned DNA cell with its own DHT. NDOs are created inside a group, never
      globally — that is the Lobby → Group → NDO hierarchy.
    </p>
  </div>
  <div class="flex gap-2">
    <a class="ndo-btn ndo-btn--ghost" href={paths.groupJoin()}>🔑 Join</a>
    <a class="ndo-btn ndo-btn--primary" href={paths.groupCreate()}>＋ Create</a>
  </div>
</header>

{#if mine.length === 0}
  <EmptyState icon="👥" title="You are not in any group yet" body="Create one, or paste an invite link." />
{:else}
  <div class="grid">
    {#each mine as group (group.id)}
      <a class="ndo-card ndo-card--interactive" href={paths.groupDetail(group.id)}>
        <h2 class="ndo-h3">{group.name}</h2>
        {#if group.description}<p class="ndo-small mt-2">{group.description}</p>{/if}
        <div class="mt-3 flex items-center justify-between">
          <span class="ndo-small">{group.memberIds.length} members · {ndosForGroup(group.id).length} NDOs</span>
          <span class="ndo-mono">{group.networkSeed}</span>
        </div>
      </a>
    {/each}
  </div>
{/if}

<style>
  .grid { display: grid; gap: var(--ndo-spacing-4); grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
</style>
