<script lang="ts">
  // Copy of ui/src/lib/components/group/GroupView.svelte.
  //
  // Markup unchanged. The two modals are driven from the query string so each
  // is a deep-linkable surface; production keeps them local. The pull-based
  // refresh loop is kept even though mock state never changes underneath it,
  // because its existence is part of what a reviewer should see: this screen is
  // eventually consistent in production, and the poll is why.
  import type { GroupMemberProfile, LifecycleStage, NdoDescriptor, PropertyRegime, ResourceNature } from '../types';
  import type { ActiveFilters } from '../types';
  import { setUrlFlag, urlFlag } from '../url-state.svelte';
  import { appContext, groupStore, lobbyStore } from '../stores.svelte';
  import NdoBrowser from '../lobby/NdoBrowser.svelte';
  import NdoCreateModal from './NdoCreateModal.svelte';
  import GroupProfileModal from './GroupProfileModal.svelte';
  import MemberList from './MemberList.svelte';

  interface Props {
    groupId: string;
    autoOpenCreateModal?: boolean;
  }

  let { groupId, autoOpenCreateModal = false }: Props = $props();

  let activeFilters = $state<ActiveFilters>({ stages: [], natures: [], regimes: [] });
  let inviteCopied = $state(false);

  function setFilters(partial: Partial<ActiveFilters>): void {
    activeFilters = { ...activeFilters, ...partial };
  }

  function clearFilters(): void {
    activeFilters = { stages: [], natures: [], regimes: [] };
  }

  const filteredNdos = $derived.by(() => {
    const { stages, natures, regimes } = activeFilters;
    const noFilter = stages.length === 0 && natures.length === 0 && regimes.length === 0;
    if (noFilter) return groupStore.groupNdos;
    return groupStore.groupNdos.filter((d: NdoDescriptor) => {
      const stageOk =
        stages.length === 0 ||
        (d.lifecycle_stage !== null && stages.includes(d.lifecycle_stage as LifecycleStage));
      const natureOk =
        natures.length === 0 ||
        (d.resource_nature !== null && natures.includes(d.resource_nature as ResourceNature));
      const regimeOk =
        regimes.length === 0 ||
        (d.property_regime !== null && regimes.includes(d.property_regime as PropertyRegime));
      return stageOk && natureOk && regimeOk;
    });
  });

  const showCreateModal = $derived(autoOpenCreateModal || urlFlag('createNdo'));
  const showProfileModal = $derived(urlFlag('groupProfile'));

  const setParam = (key: string, on: boolean) => setUrlFlag(key, on);

  function saveGroupProfile(profile: GroupMemberProfile): void {
    void lobbyStore.saveGroupMemberProfile(groupId, profile);
  }

  async function copyInviteLink() {
    const link = await lobbyStore.generateInviteLink(groupId);
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      inviteCopied = true;
      setTimeout(() => {
        inviteCopied = false;
      }, 2000);
    } catch {
      // clipboard unavailable
    }
  }

  $effect(() => {
    appContext.currentView = 'group';
    appContext.selectedGroupId = groupId;
    void groupStore.loadGroupData(groupId);
  });

  // Pull-based reactivity for shared-group items, kept from the app. Against
  // mock state this is a no-op; it is here because the behaviour it compensates
  // for (gossip latency between members) is a real design constraint.
  // TODO(signals): production plans to replace this with remote signals.
  $effect(() => {
    void groupId;
    if (typeof window === 'undefined') return;

    const POLL_INTERVAL_MS = 8000;
    const refresh = () => {
      void groupStore.refreshCurrentGroup();
    };
    const onFocus = () => refresh();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') refresh();
    };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') refresh();
    }, POLL_INTERVAL_MS);

    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
      window.clearInterval(intervalId);
    };
  });
</script>

{#if showCreateModal}
  <NdoCreateModal
    {groupId}
    onclose={() => {
      setParam('createNdo', false);
    }}
  />
{/if}

{#if showProfileModal}
  <GroupProfileModal
    {groupId}
    onclose={() => {
      setParam('groupProfile', false);
    }}
    onsave={(profile) => {
      saveGroupProfile(profile);
      setParam('groupProfile', false);
    }}
  />
{/if}

<div class="p-6">
  <!-- Group header -->
  <div class="mb-6 flex items-start justify-between">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">
        {groupStore.group?.name ?? 'Group'}
      </h1>
      <p class="mt-1 font-mono text-sm text-gray-400">{groupId}</p>
    </div>
    <div class="flex items-center gap-2">
      <button
        type="button"
        onclick={copyInviteLink}
        class="rounded border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
      >
        {inviteCopied ? 'Invite link copied!' : 'Copy invite link'}
      </button>
      <button
        type="button"
        onclick={() => {
          setParam('createNdo', true);
        }}
        class="flex items-center gap-1.5 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        <span class="text-base leading-none">+</span> Create NDO
      </button>
    </div>
  </div>

  {#if groupStore.errorMessage}
    <p class="mb-4 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
      {groupStore.errorMessage}
    </p>
  {/if}

  <!-- Group-scoped NDO browser -->
  <NdoBrowser
    descriptors={filteredNdos}
    {activeFilters}
    onfilterchange={(f) => setFilters(f)}
    onclearfilters={() => clearFilters()}
    isLoading={groupStore.isLoading}
  />

  <!-- Member list -->
  <div class="mt-6">
    <MemberList members={groupStore.members} />
  </div>
</div>
