<script lang="ts">
  import type {
    GroupDescriptor,
    GroupMember,
    NdoDescriptor,
    ResourceSpecification
  } from '../../../domain/types.js';
  import {
    connections,
    groupsForAgent,
    ndosInitiatedBy,
    ndosJoinedBy,
    roleInGroup,
    specsAuthoredBy,
    type AgentConnectionReason
  } from '../../../domain/agent-perspective.js';
  import { getMockAgent } from '../../../fixtures/mockAgents.js';
  import ComingNextPopup from '../../primitives/ComingNextPopup.svelte';
  import SoonBadge from '../../primitives/SoonBadge.svelte';
  import NdoButton from '../../primitives/NdoButton.svelte';

  interface TrailEntry {
    label: string;
    href: string;
  }

  interface Props {
    agentId: string;
    groupId: string;
    groups: GroupDescriptor[];
    ndos: NdoDescriptor[];
    membersByGroup: (groupId: string, createdBy?: string) => GroupMember[];
    membersByNdo?: Record<string, GroupMember[]>;
    specsByNdo?: Record<string, ResourceSpecification[]>;
    joinedHashes?: readonly string[];
    currentAgentId?: string | null;
    trailTop?: TrailEntry | null;
    /** Build an NDO URL (optional tab). Navigation is via onselectndo. */
    ndoHref?: (hash: string, tab?: 'resources') => string;
    onselectndo?: (hash: string, tab?: 'resources') => void;
    onselectagent?: (agentId: string) => void;
    onselectgroup?: (groupId: string) => void;
    onback?: () => void;
  }

  let {
    agentId,
    groupId,
    groups,
    ndos,
    membersByGroup,
    membersByNdo = {},
    specsByNdo = {},
    joinedHashes = [],
    currentAgentId = null,
    trailTop = null,
    ndoHref,
    onselectndo,
    onselectagent,
    onselectgroup,
    onback
  }: Props = $props();

  let soonId = $state<string | null>(null);

  const agent = $derived(getMockAgent(agentId));
  const role = $derived(roleInGroup(agentId, groupId, membersByGroup));
  const theirGroups = $derived(groupsForAgent(agentId, groups, membersByGroup));
  const initiated = $derived(ndosInitiatedBy(agentId, ndos));
  const joined = $derived(
    ndosJoinedBy(agentId, ndos, membersByNdo, joinedHashes, currentAgentId)
  );
  const specs = $derived(specsAuthoredBy(agentId, specsByNdo));
  const peers = $derived(
    connections(agentId, groups, membersByGroup, ndos, membersByNdo, specsByNdo)
  );

  const REASON_LABEL: Record<AgentConnectionReason, string> = {
    same_group: 'same group',
    same_resource: 'same resource',
    specified_resource: 'specified this resource'
  };

  function ndoName(hash: string): string {
    return ndos.find((d) => d.hash === hash)?.name ?? hash.slice(0, 12);
  }
</script>

{#if soonId}
  <ComingNextPopup featureId={soonId} onclose={() => (soonId = null)} />
{/if}

{#if !agent}
  <div data-testid="agent-profile-missing" class="rounded border border-amber-200 bg-amber-50 p-4">
    <p class="text-sm text-amber-900">This agent is not in the session.</p>
    {#if onback}
      <button type="button" class="mt-2 text-sm text-blue-700 underline" onclick={() => onback?.()}>
        Back
      </button>
    {/if}
  </div>
{:else}
  <div data-testid="agent-profile" class="space-y-6" data-agent={agentId}>
    {#if trailTop}
      <div>
        <NdoButton variant="ghost" class="px-0 text-sm" onclick={() => onback?.()}>
          ← Back to {trailTop.label}
        </NdoButton>
      </div>
    {/if}

    <div class="flex items-start gap-4">
      <span
        class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl font-semibold text-blue-800"
        aria-hidden="true"
      >
        {agent.name.slice(0, 1)}
      </span>
      <div class="min-w-0">
        <h2 class="text-xl font-bold text-gray-900">{agent.name}</h2>
        {#if role}
          <p class="mt-0.5 text-sm text-gray-500">{role} in this group</p>
        {/if}
        <p class="mt-2 text-sm text-gray-600">{agent.bio}</p>
        <div class="mt-2 flex flex-wrap gap-1">
          {#each agent.skills as s}
            <span class="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600">{s}</span>
          {/each}
        </div>
      </div>
    </div>

    <section>
      <h3 class="text-sm font-semibold text-gray-900">Groups</h3>
      <ul class="mt-2 space-y-1">
        {#each theirGroups as g}
          <li>
            <button
              type="button"
              class="text-sm text-blue-700 hover:underline"
              onclick={() => onselectgroup?.(g.id)}
            >
              {g.name}
            </button>
          </li>
        {:else}
          <li class="text-sm text-gray-500">No groups in this session.</li>
        {/each}
      </ul>
    </section>

    <section>
      <h3 class="text-sm font-semibold text-gray-900">Initiated</h3>
      <ul class="mt-2 space-y-1">
        {#each initiated as d}
          <li>
            {#if onselectndo}
              <button
                type="button"
                class="text-sm text-blue-700 hover:underline"
                onclick={() => onselectndo?.(d.hash)}>{d.name}</button
              >
            {:else if ndoHref}
              <a class="text-sm text-blue-700 hover:underline" href={ndoHref(d.hash)}>{d.name}</a>
            {:else}
              <span class="text-sm text-gray-800">{d.name}</span>
            {/if}
            <span class="ml-1 text-xs text-gray-400">{d.lifecycle_stage}</span>
          </li>
        {:else}
          <li class="text-sm text-gray-500">None in this session.</li>
        {/each}
      </ul>
    </section>

    <section>
      <h3 class="text-sm font-semibold text-gray-900">Joined</h3>
      <ul class="mt-2 space-y-1">
        {#each joined as d}
          <li>
            {#if onselectndo}
              <button
                type="button"
                class="text-sm text-blue-700 hover:underline"
                onclick={() => onselectndo?.(d.hash)}>{d.name}</button
              >
            {:else if ndoHref}
              <a class="text-sm text-blue-700 hover:underline" href={ndoHref(d.hash)}>{d.name}</a>
            {:else}
              <span class="text-sm text-gray-800">{d.name}</span>
            {/if}
          </li>
        {:else}
          <li class="text-sm text-gray-500">None in this session.</li>
        {/each}
      </ul>
    </section>

    <section>
      <h3 class="text-sm font-semibold text-gray-900">Specifications</h3>
      <p class="mt-0.5 text-xs text-gray-500">Layer 1 specs this agent authored in the session.</p>
      <ul class="mt-2 space-y-2">
        {#each specs as spec}
          <li class="rounded border border-gray-100 bg-gray-50 px-3 py-2">
            {#if onselectndo}
              <button
                type="button"
                class="text-sm font-medium text-blue-700 hover:underline"
                data-testid="agent-spec-link"
                onclick={() => onselectndo?.(spec.ndo_identity_hash, 'resources')}
              >
                {spec.name}
              </button>
            {:else if ndoHref}
              <a
                class="text-sm font-medium text-blue-700 hover:underline"
                href={ndoHref(spec.ndo_identity_hash, 'resources')}
                data-testid="agent-spec-link"
              >
                {spec.name}
              </a>
            {:else}
              <span class="text-sm font-medium text-gray-900">{spec.name}</span>
            {/if}
            <p class="mt-0.5 text-xs text-gray-500">
              on {ndoName(spec.ndo_identity_hash)} · activated at {spec.activated_at_stage}
            </p>
          </li>
        {:else}
          <li class="text-sm text-gray-500">None yet.</li>
        {/each}
      </ul>
    </section>

    <section>
      <h3 class="text-sm font-semibold text-gray-900">Connected agents</h3>
      <ul class="mt-2 divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
        {#each peers as peer}
          <li>
            <button
              type="button"
              data-testid="agent-connection"
              data-agent={peer.agentId}
              class="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-gray-50"
              onclick={() => onselectagent?.(peer.agentId)}
            >
              <span class="text-sm font-medium text-gray-900">{peer.name}</span>
              <span class="text-[10px] text-gray-400">
                {peer.reasons.map((r) => REASON_LABEL[r]).join(' · ')}
              </span>
            </button>
          </li>
        {:else}
          <li class="px-3 py-4 text-sm text-gray-500">No connections derived yet.</li>
        {/each}
      </ul>
    </section>

    <div class="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded border border-gray-200 px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50"
        onclick={() => (soonId = 'agent-reputation')}
      >
        Reputation
        <SoonBadge />
      </button>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded border border-gray-200 px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50"
        onclick={() => (soonId = 'agent-invite')}
      >
        Ask to collaborate
        <SoonBadge />
      </button>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded border border-gray-200 px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50"
        onclick={() => (soonId = 'tool-chat')}
      >
        Chat
        <SoonBadge />
      </button>
    </div>
  </div>
{/if}
