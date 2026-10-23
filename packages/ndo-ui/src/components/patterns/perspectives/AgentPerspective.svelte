<script lang="ts">
  import type { GroupDescriptor, GroupMember } from '../../../domain/types.js';
  import {
    agentsInGroup,
    collectSkills,
    filterAgentsBySkill
  } from '../../../domain/agent-perspective.js';
  import ComingNextPopup from '../../primitives/ComingNextPopup.svelte';
  import SoonBadge from '../../primitives/SoonBadge.svelte';

  /**
   * Agent Perspective directory for the current group: people, skill chips,
   * and session groups. The profile is a sibling component (AgentProfile).
   */
  interface Props {
    groupId: string;
    groupName?: string;
    members?: GroupMember[];
    groups?: GroupDescriptor[];
    onselectagent?: (agentId: string) => void;
    onselectgroup?: (groupId: string) => void;
    onresources?: (groupId: string) => void;
  }

  let {
    groupId,
    groupName,
    members = [],
    groups = [],
    onselectagent,
    onselectgroup,
    onresources
  }: Props = $props();

  let skill = $state<string | null>(null);
  let soonId = $state<string | null>(null);

  const people = $derived(agentsInGroup(members));
  const skills = $derived(collectSkills(people));
  const filtered = $derived(filterAgentsBySkill(people, skill));
</script>

{#if soonId}
  <ComingNextPopup featureId={soonId} onclose={() => (soonId = null)} />
{/if}

<div data-testid="agent-perspective" class="space-y-6">
  <div>
    <h2 class="text-lg font-semibold text-gray-900">Who is here</h2>
    <p class="mt-1 text-sm text-gray-500">
      Agents in {groupName ?? 'this group'}. Declared interests narrow the list; they are not
      validated roles.
    </p>
  </div>

  {#if skills.length > 0}
    <div>
      <p class="text-xs font-medium text-gray-700">Declared interests</p>
      <div class="mt-2 flex flex-wrap gap-1.5">
        <button
          type="button"
          data-testid="agent-skill-chip"
          data-skill=""
          class="rounded-full border px-2.5 py-0.5 text-xs {skill === null
            ? 'border-blue-500 bg-blue-50 text-blue-800'
            : 'border-gray-200 text-gray-600 hover:bg-gray-50'}"
          onclick={() => (skill = null)}
        >
          All
        </button>
        {#each skills as s}
          <button
            type="button"
            data-testid="agent-skill-chip"
            data-skill={s}
            class="rounded-full border px-2.5 py-0.5 text-xs {skill === s
              ? 'border-blue-500 bg-blue-50 text-blue-800'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'}"
            onclick={() => (skill = skill === s ? null : s)}
          >
            {s}
          </button>
        {/each}
      </div>
    </div>
  {/if}

  <ul class="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
    {#each filtered as person (person.id)}
      <li>
        <button
          type="button"
          class="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-gray-50"
          data-testid="agent-card"
          data-agent={person.id}
          onclick={() => onselectagent?.(person.id)}
        >
          <span
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-800"
            aria-hidden="true"
          >
            {person.name.slice(0, 1)}
          </span>
          <span class="min-w-0 flex-1">
            <span class="block text-sm font-medium text-gray-900">{person.name}</span>
            <span class="mt-0.5 block text-xs text-gray-500">{person.bio}</span>
            <span class="mt-1 flex flex-wrap gap-1">
              {#each person.skills as s}
                <span class="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600">{s}</span>
              {/each}
            </span>
          </span>
        </button>
      </li>
    {:else}
      <li class="px-4 py-6 text-center text-sm text-gray-500">No agents match this interest.</li>
    {/each}
  </ul>

  <div>
    <h3 class="text-sm font-semibold text-gray-900">Groups</h3>
    <p class="mt-1 text-xs text-gray-500">
      A group is a kind of agent. Open its Agent directory, or switch to its Resource list.
    </p>
    <ul class="mt-3 grid gap-2 sm:grid-cols-2">
      {#each groups as g (g.id)}
        <li
          class="rounded-lg border border-gray-200 bg-white p-3 {g.id === groupId
            ? 'ring-1 ring-blue-200'
            : ''}"
        >
          <p class="text-sm font-medium text-gray-900">
            {g.name}
            {#if g.id === groupId}
              <span class="ml-1 text-xs font-normal text-blue-700">(here)</span>
            {/if}
          </p>
          <p class="mt-0.5 font-mono text-[10px] text-gray-400">{g.id}</p>
          <div class="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              class="rounded border border-blue-200 px-2 py-1 text-xs text-blue-800 hover:bg-blue-50"
              onclick={() => onselectgroup?.(g.id)}
            >
              Agents
            </button>
            <button
              type="button"
              class="rounded border border-gray-200 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
              onclick={() => onresources?.(g.id)}
            >
              Resources
            </button>
          </div>
        </li>
      {/each}
    </ul>
  </div>

  <div class="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
    <button
      type="button"
      class="inline-flex items-center gap-1.5 rounded border border-gray-200 px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50"
      onclick={() => (soonId = 'tool-map')}
    >
      Map
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
