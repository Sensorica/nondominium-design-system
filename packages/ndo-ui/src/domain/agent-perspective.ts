/**
 * Agent Perspective helpers — pure filters over session data, same style as
 * resource-perspective.ts. Connections are derived, never stored.
 */
import type {
  GroupDescriptor,
  GroupMember,
  NdoDescriptor,
  ResourceSpecification
} from './types.js';
import {
  agentIdFromKey,
  agentIdFromName,
  agentKeyForId,
  getMockAgent,
  getMockInitiatorName,
  MOCK_AGENTS,
  type MockAgent
} from '../fixtures/mockAgents.js';

export type AgentConnectionReason = 'same_group' | 'same_resource' | 'specified_resource';

export interface AgentConnection {
  agentId: string;
  name: string;
  reasons: AgentConnectionReason[];
}

/** People listed for a group directory. */
export function agentsInGroup(members: GroupMember[]): MockAgent[] {
  const ids = new Set(members.map((m) => m.id));
  return MOCK_AGENTS.filter((a) => ids.has(a.id));
}

/** Groups where this agent appears as a member (seeded or session-created). */
export function groupsForAgent(
  agentId: string,
  groups: GroupDescriptor[],
  membersByGroup: (groupId: string, createdBy?: string) => GroupMember[]
): GroupDescriptor[] {
  return groups.filter((g) => membersByGroup(g.id, g.createdBy).some((m) => m.id === agentId));
}

/**
 * NDOs this agent initiated. Prefer the per-hash initiator name map (seeded
 * fixtures). Only when that map has no entry for the hash, fall back to the
 * pubkey on the descriptor (session creates).
 */
export function ndosInitiatedBy(agentId: string, ndos: NdoDescriptor[]): NdoDescriptor[] {
  const agent = getMockAgent(agentId);
  const key = agentKeyForId(agentId);
  if (!agent) return [];
  return ndos.filter((d) => {
    const named = getMockInitiatorName(d.hash);
    if (named != null) return named === agent.name;
    return !!(key && d.initiator === key);
  });
}

/** NDOs where the agent appears in the membership list (or joinedHashes for the current agent). */
export function ndosJoinedBy(
  agentId: string,
  ndos: NdoDescriptor[],
  membersByNdo: Record<string, GroupMember[]>,
  joinedHashes: readonly string[] = [],
  currentAgentId: string | null = null
): NdoDescriptor[] {
  return ndos.filter((d) => {
    const members = membersByNdo[d.hash] ?? [];
    if (members.some((m) => m.id === agentId)) return true;
    if (currentAgentId === agentId && joinedHashes.includes(d.hash)) return true;
    return false;
  });
}

/** Specifications whose author pubkey matches this agent. */
export function specsAuthoredBy(
  agentId: string,
  specsByNdo: Record<string, ResourceSpecification[]>
): ResourceSpecification[] {
  const key = agentKeyForId(agentId);
  if (!key) return [];
  const out: ResourceSpecification[] = [];
  for (const list of Object.values(specsByNdo)) {
    for (const spec of list) {
      if (spec.author === key) out.push(spec);
    }
  }
  return out.sort((a, b) => b.created_at - a.created_at);
}

export function filterAgentsBySkill(agents: MockAgent[], skill: string | null): MockAgent[] {
  if (!skill) return agents;
  const q = skill.trim().toLowerCase();
  if (!q) return agents;
  return agents.filter((a) => a.skills.some((s) => s.toLowerCase() === q));
}

/** All distinct skills across a set of agents, sorted. */
export function collectSkills(agents: MockAgent[]): string[] {
  const set = new Set<string>();
  for (const a of agents) for (const s of a.skills) set.add(s);
  return [...set].sort((a, b) => a.localeCompare(b));
}

/**
 * Derived connections: same group, same NDO membership, or
 * “specified this resource” (spec author ↔ NDO initiator when they differ).
 */
export function connections(
  agentId: string,
  groups: GroupDescriptor[],
  membersByGroup: (groupId: string, createdBy?: string) => GroupMember[],
  ndos: NdoDescriptor[],
  membersByNdo: Record<string, GroupMember[]>,
  specsByNdo: Record<string, ResourceSpecification[]>
): AgentConnection[] {
  const reasons = new Map<string, Set<AgentConnectionReason>>();

  function add(otherId: string, reason: AgentConnectionReason) {
    if (!otherId || otherId === agentId) return;
    if (!getMockAgent(otherId)) return;
    let set = reasons.get(otherId);
    if (!set) {
      set = new Set();
      reasons.set(otherId, set);
    }
    set.add(reason);
  }

  for (const g of groupsForAgent(agentId, groups, membersByGroup)) {
    for (const m of membersByGroup(g.id, g.createdBy)) {
      add(m.id, 'same_group');
    }
  }

  const myNdos = new Set([
    ...ndosInitiatedBy(agentId, ndos).map((d) => d.hash),
    ...ndosJoinedBy(agentId, ndos, membersByNdo).map((d) => d.hash)
  ]);
  for (const hash of myNdos) {
    for (const m of membersByNdo[hash] ?? []) {
      add(m.id, 'same_resource');
    }
    const initiatorName = getMockInitiatorName(hash);
    const initiatorId = agentIdFromName(initiatorName) ?? agentIdFromKey(
      ndos.find((d) => d.hash === hash)?.initiator
    );
    if (initiatorId) add(initiatorId, 'same_resource');
  }

  for (const [ndoHash, list] of Object.entries(specsByNdo)) {
    const ndo = ndos.find((d) => d.hash === ndoHash);
    const initiatorId =
      agentIdFromName(getMockInitiatorName(ndoHash)) ??
      (ndo ? agentIdFromKey(ndo.initiator) : null);
    for (const spec of list) {
      const authorId = agentIdFromKey(spec.author);
      if (!authorId || !initiatorId || authorId === initiatorId) continue;
      if (authorId === agentId) add(initiatorId, 'specified_resource');
      if (initiatorId === agentId) add(authorId, 'specified_resource');
    }
  }

  return [...reasons.entries()]
    .map(([id, set]) => {
      const agent = getMockAgent(id)!;
      return {
        agentId: id,
        name: agent.name,
        reasons: [...set]
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function roleInGroup(
  agentId: string,
  groupId: string,
  membersByGroup: (groupId: string, createdBy?: string) => GroupMember[],
  createdBy?: string
): string | null {
  return membersByGroup(groupId, createdBy).find((m) => m.id === agentId)?.role ?? null;
}
