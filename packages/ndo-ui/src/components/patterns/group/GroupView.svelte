<script lang="ts">
  import type {
    ActiveFilters,
    GroupDescriptor,
    GroupMember,
    GroupMemberProfile,
    LobbyUserProfile,
    NdoDescriptor,
    NdoInput
  } from '../../../domain/types.js';
  import { applyNdoFilters, EMPTY_FILTERS } from '../../../domain/filter-logic.js';
  import NdoBrowser from '../lobby/NdoBrowser.svelte';
  import NdoCreateModal from './NdoCreateModal.svelte';
  import GroupProfileModal from './GroupProfileModal.svelte';
  import MemberList from './MemberList.svelte';
  import NdoButton from '../../primitives/NdoButton.svelte';

  interface Props {
    group: GroupDescriptor | null;
    groupId: string;
    ndos: NdoDescriptor[];
    members?: GroupMember[];
    lobbyProfile?: LobbyUserProfile | null;
    isLoading?: boolean;
    errorMessage?: string | null;
    autoOpenCreateModal?: boolean;
    showProfileModal?: boolean;
    allNdosForDuplicateCheck?: NdoDescriptor[];
    ndoHref?: (hash: string) => string;
    oncreateclick?: () => void;
    oncreatendo?: (input: NdoInput) => void | Promise<void>;
    onclosecreate?: () => void;
    oncloseprofile?: () => void;
    onsaveprofile?: (profile: GroupMemberProfile) => void;
  }

  let {
    group,
    groupId,
    ndos,
    members = [],
    lobbyProfile = null,
    isLoading = false,
    errorMessage = null,
    autoOpenCreateModal = false,
    showProfileModal = false,
    allNdosForDuplicateCheck = [],
    ndoHref,
    oncreateclick,
    oncreatendo,
    onclosecreate,
    oncloseprofile,
    onsaveprofile
  }: Props = $props();

  let activeFilters = $state<ActiveFilters>({ ...EMPTY_FILTERS });
  let showCreateModal = $state(false);

  $effect(() => {
    if (autoOpenCreateModal) showCreateModal = true;
  });

  const filteredNdos = $derived(applyNdoFilters(ndos, activeFilters));

  function setFilters(partial: Partial<ActiveFilters>): void {
    activeFilters = { ...activeFilters, ...partial };
  }

  function clearFilters(): void {
    activeFilters = { ...EMPTY_FILTERS };
  }

  function openCreate() {
    showCreateModal = true;
    oncreateclick?.();
  }
</script>

{#if showCreateModal}
  <NdoCreateModal
    {groupId}
    groupName={group?.name}
    existingNdos={allNdosForDuplicateCheck}
    {errorMessage}
    onclose={() => {
      showCreateModal = false;
      onclosecreate?.();
    }}
    onsubmit={oncreatendo}
  />
{/if}

{#if showProfileModal}
  <GroupProfileModal
    {groupId}
    {lobbyProfile}
    onclose={() => oncloseprofile?.()}
    onsave={(profile) => onsaveprofile?.(profile)}
  />
{/if}

<div class="p-6">
  <div class="mb-6 flex items-start justify-between">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">{group?.name ?? 'Group'}</h1>
      <p class="mt-1 font-mono text-sm text-gray-400">{groupId}</p>
    </div>
    <NdoButton onclick={openCreate}>
      <span class="text-base leading-none">+</span> Create NDO
    </NdoButton>
  </div>

  {#if errorMessage}
    <p class="mb-4 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
      {errorMessage}
    </p>
  {/if}

  <NdoBrowser
    descriptors={filteredNdos}
    {activeFilters}
    onfilterchange={(f) => setFilters(f)}
    onclearfilters={() => clearFilters()}
    {isLoading}
    {ndoHref}
  />

  <MemberList {members} />
</div>
