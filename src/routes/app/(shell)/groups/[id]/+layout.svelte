<script lang="ts">
  // Group chrome: identity header plus tabs. Every tab is a route, so a
  // reviewer can deep-link and comment on the member list independently of the
  // NDO list.
  import type { Snippet } from 'svelte';
  import { page } from '$app/state';
  import { paths } from '$lib/paths';
  import { appState, groupById, ME_ID } from '$lib/state.svelte';
  import TabNav from '$lib/components/shared/TabNav.svelte';
  import EmptyState from '$lib/components/shared/EmptyState.svelte';

  let { children }: { children: Snippet } = $props();

  const id = $derived(page.params.id ?? '');
  const group = $derived(groupById(id));
  const isMember = $derived(!!group?.memberIds.includes(ME_ID));

  const tabs = $derived([
    { href: paths.groupDetail(id), label: 'NDOs', icon: '🧿' },
    { href: paths.groupMembers(id), label: 'Members', icon: '👥' },
    { href: paths.groupWorkLog(id), label: 'Work log', icon: '📓' },
    { href: paths.groupLinks(id), label: 'Links', icon: '🔗' },
    { href: paths.groupProfile(id), label: 'My disclosure', icon: '🕶️' },
  ]);

  // Membership self-heal (REQ-UI-GRP-04): joining commits best-effort over a
  // gossiping DHT, so the real client reconciles on every open. The prototype
  // keeps the same shape so the behaviour is reviewable.
  $effect(() => {
    if (group && !group.memberIds.includes(ME_ID)) {
      appState.selectedGroupId = group.id;
    } else if (group) {
      appState.selectedGroupId = group.id;
    }
  });
</script>

{#if !group}
  <EmptyState icon="🫥" title="No such group" body="This network seed is not announced on your lobby." />
{:else}
  <header class="flex items-start justify-between gap-4 flex-wrap">
    <div>
      <h1 class="ndo-h1">👥 {group.name}</h1>
      {#if group.description}<p class="ndo-p mt-2" style="max-width:60ch">{group.description}</p>{/if}
      <p class="ndo-mono mt-2">network_seed: {group.networkSeed}</p>
    </div>
    <div class="flex gap-2">
      {#if !isMember}
        <a class="ndo-btn ndo-btn--ghost" href={paths.inviteLanding(group.id)}>Join this group</a>
      {/if}
      <a class="ndo-btn ndo-btn--primary" href={paths.ndoCreate(group.id)}>➕ New NDO</a>
    </div>
  </header>

  <TabNav {tabs} />

  {@render children()}
{/if}
