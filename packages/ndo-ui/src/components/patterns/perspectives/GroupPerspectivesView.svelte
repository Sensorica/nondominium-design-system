<script lang="ts">
  import type {
    GroupDescriptor,
    GroupMember,
    NdoDescriptor,
    NdoInput,
    ResourceSpecification
  } from '../../../domain/types.js';
  import type { PerspectiveId } from '../../../domain/coming-next.js';
  import Breadcrumb, { type BreadcrumbItem } from './Breadcrumb.svelte';
  import PerspectiveSwitcher from './PerspectiveSwitcher.svelte';
  import ResourcePerspective from './ResourcePerspective.svelte';
  import AgentPerspective from './AgentPerspective.svelte';
  import AgentProfile from './AgentProfile.svelte';
  import NdoCreateModal from '../group/NdoCreateModal.svelte';
  import MemberList from '../group/MemberList.svelte';
  import NdoButton from '../../primitives/NdoButton.svelte';
  import ComingNextPopup from '../../primitives/ComingNextPopup.svelte';

  /**
   * The Group page with Perspectives. Lobby stays the outermost layer;
   * Resource and Agent are live; Intelligence and Work stay Soon.
   */
  interface TrailEntry {
    label: string;
    href: string;
  }

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
    /** Controlled perspective from the URL; defaults to resource. */
    activePerspective?: PerspectiveId;
    agentId?: string | null;
    allGroups?: GroupDescriptor[];
    allNdos?: NdoDescriptor[];
    membersByGroup?: (groupId: string, createdBy?: string) => GroupMember[];
    membersByNdo?: Record<string, GroupMember[]>;
    specsByNdo?: Record<string, ResourceSpecification[]>;
    currentAgentId?: string | null;
    trailTop?: TrailEntry | null;
    agentNdoHref?: (hash: string, tab?: 'resources') => string;
    onselectndo?: (hash: string, tab?: 'resources') => void;
    onactive?: (id: PerspectiveId) => void;
    onselectagent?: (agentId: string) => void;
    onselectgroup?: (groupId: string) => void;
    onresources?: (groupId: string) => void;
    onclearagent?: () => void;
    onback?: () => void;
    onmemberjump?: (member: GroupMember) => void;
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
    activePerspective = 'resource',
    agentId = null,
    allGroups = [],
    allNdos = [],
    membersByGroup = () => [],
    membersByNdo = {},
    specsByNdo = {},
    currentAgentId = null,
    trailTop = null,
    agentNdoHref,
    onselectndo,
    onactive,
    onselectagent,
    onselectgroup,
    onresources,
    onclearagent,
    onback,
    onmemberjump
  }: Props = $props();

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
      active={activePerspective}
      onselect={(id) => onactive?.(id)}
    />
  </div>

  {#if errorMessage}
    <p class="mb-4 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
      {errorMessage}
    </p>
  {/if}

  {#if activePerspective === 'agent'}
    {#if agentId}
      <AgentProfile
        {agentId}
        {groupId}
        groups={allGroups.length ? allGroups : group ? [group] : []}
        ndos={allNdos.length ? allNdos : ndos}
        {membersByGroup}
        {membersByNdo}
        {specsByNdo}
        {joinedHashes}
        {currentAgentId}
        {trailTop}
        ndoHref={agentNdoHref}
        onselectndo={(hash, tab) => onselectndo?.(hash, tab)}
        onselectagent={(id) => onselectagent?.(id)}
        onselectgroup={(id) => onselectgroup?.(id)}
        onback={() => (trailTop ? onback?.() : onclearagent?.())}
      />
    {:else}
      <AgentPerspective
        {groupId}
        groupName={group?.name}
        {members}
        groups={allGroups.length ? allGroups : group ? [group] : []}
        onselectagent={(id) => onselectagent?.(id)}
        onselectgroup={(id) => onselectgroup?.(id)}
        onresources={(id) => onresources?.(id)}
      />
    {/if}
  {:else}
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
      onmemberclick={(m) => {
        if (onmemberjump) onmemberjump(m);
        else soonId = 'jump-agent';
      }}
    />
  {/if}
</div>
