<script lang="ts">
  // Arriving from an invite link. The payload carries the network seed, the DNA
  // hash and the group name, so the landing screen can name the group before the
  // clone cell exists locally (REQ-UI-GRP-02).
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { paths } from '$lib/paths';
  import { groupById, joinGroup, showToast } from '$lib/state.svelte';
  import { joining } from '$lib/guards/joining.svelte';

  const groupId = $derived(page.url.searchParams.get('group') ?? 'gr2');
  const group = $derived(groupById(groupId));

  function accept() {
    joinGroup(groupId);
    joining.to('group-undisclosed');
    showToast('success', `Joined ${group?.name ?? 'the group'}`);
    goto(paths.groupProfile(groupId));
  }
</script>

<header>
  <h1 class="ndo-h2">🔑 You have been invited</h1>
  <p class="ndo-small mt-2">
    An invite link carries the group's network seed. Accepting provisions a clone cell on your
    conductor and commits a membership entry to that group's DHT.
  </p>
</header>

<div class="ndo-card">
  <h2 class="ndo-h3">{group?.name ?? 'Unknown group'}</h2>
  {#if group?.description}<p class="ndo-small mt-2">{group.description}</p>{/if}
  <p class="ndo-mono mt-3">network_seed: {groupId}</p>
  <p class="ndo-mono">members: {group?.memberIds.length ?? 0}</p>
</div>

<div class="flex items-center justify-between gap-3">
  <a class="ndo-small" href={paths.appHome()}>Decline</a>
  <button class="ndo-btn ndo-btn--primary" onclick={accept}>Join {group?.name ?? 'group'}</button>
</div>
