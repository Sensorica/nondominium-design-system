<script lang="ts">
  // Copy of ui/src/lib/components/lobby/LobbyView.svelte.
  // Markup unchanged; the profile modal is driven from the query string so it
  // is a deep-linkable surface.
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { setUrlFlag, urlFlag } from '../url-state.svelte';
  import { paths } from '$lib/paths';
  import { appContext, lobbyStore } from '../stores.svelte';
  import NdoBrowser from './NdoBrowser.svelte';
  import LobbyProfileBar from './LobbyProfileBar.svelte';
  import ProfileSetupModal from './ProfileSetupModal.svelte';

  let showProfileModal = $state(false);

  $effect(() => {
    showProfileModal = urlFlag('profile');
  });

  const setProfileParam = (on: boolean) => setUrlFlag('profile', on);

  // Clear the flag only when the dialog was open, i.e. the agent dismissed or
  // saved it. Melt's Dialog calls onOpenChange(false), and so onclose, from the
  // modal's first effect, which runs before this component's own effect has read
  // the URL. Clearing there was the bug behind a dead ?profile=1: it called
  // replaceState during hydration, before SvelteKit's router exists, the call
  // threw ("reading '$set'") and the throw aborted the rest of the effect flush,
  // so the effect that opens the modal never ran. showProfileModal is still
  // false at that moment, which is what the guard keys on.
  function handleProfileClose() {
    if (showProfileModal) setProfileParam(false);
  }

  // As the app: the Person sync stays reactive, and NDOs load once on mount.
  $effect(() => {
    appContext.myPerson = lobbyStore.myPerson;
  });

  onMount(() => {
    void lobbyStore.loadNdos();
  });
</script>

<div class="flex min-h-full flex-col">
  <LobbyProfileBar onOpenProfile={() => setProfileParam(true)} />
  <ProfileSetupModal open={showProfileModal} onclose={handleProfileClose} />

  <div class="flex min-h-full flex-col p-6">
  <header class="mb-6">
    <h1 class="text-2xl font-bold text-gray-900">Browse NDOs</h1>
    <p class="mt-1 text-gray-600">All NDOs across your groups.</p>
    {#if lobbyStore.myPerson}
      <p class="mt-2 text-sm text-gray-500">
        Agent: <span class="font-medium text-gray-800">{lobbyStore.myPerson.name}</span>
      </p>
    {/if}
  </header>

  <NdoBrowser
    descriptors={lobbyStore.filteredNdos}
    activeFilters={lobbyStore.activeFilters}
    onfilterchange={(f) => lobbyStore.setFilters(f)}
    onclearfilters={() => lobbyStore.clearFilters()}
    isLoading={lobbyStore.isLoading}
    errorMessage={lobbyStore.errorMessage}
    onRetry={() => void lobbyStore.loadNdos()}
    hasGroups={lobbyStore.groups.length > 0}
    showOnboarding={true}
    onCreateGroup={() => goto(`${paths.appHome()}?openCreateGroup=1`)}
    onJoinGroup={() => goto(`${paths.appHome()}?openJoinGroup=1`)}
  />
  </div>
</div>
