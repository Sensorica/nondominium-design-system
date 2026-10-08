<script lang="ts">
  import type {
    GroupDescriptor,
    GroupMember,
    NdoDescriptor,
    NdoInput
  } from '../../../domain/types.js';
  import type { PerspectiveId } from '../../../domain/coming-next.js';
  import Breadcrumb, { type BreadcrumbItem } from './Breadcrumb.svelte';
  import PerspectiveSwitcher from './PerspectiveSwitcher.svelte';
  import ResourcePerspective from './ResourcePerspective.svelte';
  import NdoCreateModal from '../group/NdoCreateModal.svelte';
  import MemberList from '../group/MemberList.svelte';
  import NdoButton from '../../primitives/NdoButton.svelte';
  import ComingNextPopup from '../../primitives/ComingNextPopup.svelte';

  /**
   * The Group page with Perspectives. Lobby stays the outermost layer (the
   * shell, outside this component) and Groups the second; this is the middle
   * layer, now a Perspective host. At Layer 0 every Perspective is scoped to
   * the current group and only Resource is live.
   */
  interface Props {
    group: GroupDescriptor | null;
    groupId: string;
    ndos: NdoDescriptor[];
    members?: GroupMember[];
    myAgentKey?: string | null;
    joinedHashes?: readonly string[];
    isLoading?: boolean;
    errorMessage?: string | null;
    allNdosForDuplicateCheck?: NdoDescriptor[];
    autoOpenCreateModal?: boolean;
    breadcrumb?: BreadcrumbItem[];
    ndoHref?: (hash: string) => string;
    ndoLink?: (hash: string) => string;
    oncreatendo?: (input: NdoInput) => void | Promise<void>;
    onactive?: (id: PerspectiveId) => void;
  }

  let {
    group,
    groupId,
    ndos,
    members = [],
    myAgentKey = null,
    joinedHashes = [],
    isLoading = false,
    errorMessage = null,
    allNdosForDuplicateCheck = [],
    autoOpenCreateModal = false,
    breadcrumb = [],
    ndoHref,
    ndoLink,
    oncreatendo,
    onactive
  }: Props = $props();

  let active = $state<PerspectiveId>('resource');
  let showCreate = $state(false);
  let inviteCopied = $state(false);
  let soonId = $state<string | null>(null);

  $effect(() => {
    if (autoOpenCreateModal) showCreate = true;
  });

  async function copyInvite() {
    try {
      await navigator.clipboard.writeText(`nondominium://join?group=${encodeURIComponent(groupId)}`);
      inviteCopied = true;
      setTimeout(() => (inviteCopied = false), 2000);
    } catch {
      // clipboard unavailable
    }
  }
</script>

{#if showCreate}
  <NdoCreateModal
    {groupId}
    groupName={group?.name}
    existingNdos={allNdosForDuplicateCheck}
    {errorMessage}
    onclose={() => (showCreate = false)}
    onsubmit={async (input) => {
      await oncreatendo?.(input);
      showCreate = false;
    }}
  />
{/if}

{#if soonId}
  <ComingNextPopup featureId={soonId} onclose={() => (soonId = null)} />
{/if}

<div class="p-6" data-testid="group-perspectives-view">
  {#if breadcrumb.length > 0}
    <div class="mb-3"><Breadcrumb items={breadcrumb} /></div>
  {/if}

  <div class="mb-4 flex items-start justify-between">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">{group?.name ?? 'Group'}</h1>
      <p class="mt-1 font-mono text-sm text-gray-400">{groupId}</p>
    </div>
    <div class="flex items-center gap-2">
      <NdoButton variant="ghost" onclick={copyInvite}>
        {inviteCopied ? 'Invite link copied!' : 'Copy invite link'}
      </NdoButton>
      <NdoButton onclick={() => (showCreate = true)}>
        <span class="text-base leading-none">+</span> Create NDO
      </NdoButton>
    </div>
  </div>

  <div class="mb-4">
    <PerspectiveSwitcher
      {active}
      onselect={(id) => {
        active = id;
        onactive?.(id);
      }}
    />
  </div>

  {#if errorMessage}
    <p class="mb-4 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
      {errorMessage}
    </p>
  {/if}

  <ResourcePerspective
    {ndos}
    {myAgentKey}
    {joinedHashes}
    {isLoading}
    {ndoHref}
    {ndoLink}
    oncreateclick={() => (showCreate = true)}
  />

  <MemberList
    {members}
    onmemberclick={() => {
      soonId = 'jump-agent';
    }}
  />
</div>
