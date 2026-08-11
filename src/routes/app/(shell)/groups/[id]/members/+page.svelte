<script lang="ts">
  // The member list is derived from GroupMembership entries on the group cell,
  // one per member, each authored by that member. Cross-member visibility is
  // subject to gossip, which is why the real client polls and reconciles.
  import { page } from '$app/state';
  import { paths } from '$lib/paths';
  import { agentById, groupById, ME_ID } from '$lib/state.svelte';
  import NdoBadge from '$lib/components/shared/NdoBadge.svelte';

  const group = $derived(groupById(page.params.id ?? ''));
  const members = $derived((group?.memberIds ?? []).map((id) => agentById(id)).filter(Boolean));
</script>

<section class="ndo-panel">
  <div class="ndo-panel__head">
    <h2 class="ndo-h3">{members.length} members</h2>
    <span class="ndo-field__hint">Derived from GroupMembership entries</span>
  </div>
  <div class="ndo-panel__body">
    <ul class="list">
      {#each members as member (member!.id)}
        <li>
          <span class="who">
            <span class="avatar" aria-hidden="true">{member!.person ? member!.person.name[0] : '🔑'}</span>
            <span>
              <a href={paths.agentProfile(member!.id)}>{member!.person?.name ?? 'Unnamed agent'}</a>
              {#if member!.id === ME_ID}<span class="ndo-field__hint"> — you</span>{/if}
              <span class="ndo-mono block">{member!.pubKey}</span>
            </span>
          </span>
          <span class="flex flex-wrap gap-1.5">
            {#each member!.roles as role (role)}
              <NdoBadge variant="neutral" label={role} icon={false} />
            {/each}
          </span>
        </li>
      {/each}
    </ul>
  </div>
</section>

<style>
  .list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--ndo-spacing-3); }
  .list li { display: flex; align-items: center; justify-content: space-between; gap: var(--ndo-spacing-4); flex-wrap: wrap; }
  .who { display: flex; align-items: center; gap: var(--ndo-spacing-3); }
  .avatar {
    width: 36px;
    height: 36px;
    border-radius: var(--ndo-radius-pill);
    background: rgb(var(--ndo-primary-100));
    color: rgb(var(--ndo-primary-700));
    display: grid;
    place-items: center;
    font-weight: var(--ndo-weight-bold);
  }
  .block { display: block; }
  a { color: var(--ndo-color-link); font-size: var(--ndo-text-sm); font-weight: var(--ndo-weight-medium); }
</style>
