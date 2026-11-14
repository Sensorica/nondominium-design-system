import type { NdoDescriptor } from './types.js';
import { ALL_LIFECYCLE_STAGES } from './enums.js';

/** Who created / joined the NDO, relative to the current agent. */
export type ScopeFilter = 'all' | 'mine' | 'joined';

export type SortKey = 'newest' | 'oldest' | 'name' | 'stage';

export const OWNERSHIP_SCOPE_OPTIONS: { id: ScopeFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'mine', label: 'Created by me' },
  { id: 'joined', label: 'Joined by me' }
];

export const RESOURCE_SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: 'newest', label: 'Newest first' },
  { id: 'oldest', label: 'Oldest first' },
  { id: 'name', label: 'Name (A–Z)' },
  { id: 'stage', label: 'Lifecycle stage' }
];

/** Case-insensitive match on name and description. Empty query matches all. */
export function searchNdos(all: NdoDescriptor[], query: string): NdoDescriptor[] {
  const q = query.trim().toLowerCase();
  if (!q) return all;
  return all.filter(
    (d) => d.name.toLowerCase().includes(q) || (d.description ?? '').toLowerCase().includes(q)
  );
}

/**
 * Scope by relationship to the current agent. `mine` uses the descriptor's
 * initiator; `joined` uses the set of NDO hashes the agent has joined
 * (NDO membership). An agent who is both is in both.
 */
export function scopeNdos(
  all: NdoDescriptor[],
  scope: ScopeFilter,
  myAgentKey: string | null,
  joinedHashes: ReadonlySet<string> | readonly string[] = []
): NdoDescriptor[] {
  if (scope === 'all') return all;
  if (scope === 'mine') {
    return myAgentKey ? all.filter((d) => d.initiator === myAgentKey) : [];
  }
  const joined = joinedHashes instanceof Set ? joinedHashes : new Set(joinedHashes);
  return all.filter((d) => joined.has(d.hash));
}

export function sortNdos(all: NdoDescriptor[], key: SortKey): NdoDescriptor[] {
  const copy = [...all];
  switch (key) {
    case 'newest':
      return copy.sort((a, b) => (b.created_at ?? 0) - (a.created_at ?? 0));
    case 'oldest':
      return copy.sort((a, b) => (a.created_at ?? 0) - (b.created_at ?? 0));
    case 'name':
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case 'stage':
      return copy.sort(
        (a, b) =>
          ALL_LIFECYCLE_STAGES.indexOf((a.lifecycle_stage ?? '') as never) -
          ALL_LIFECYCLE_STAGES.indexOf((b.lifecycle_stage ?? '') as never)
      );
  }
}

/** Deep link to an NDO (copied by "Copy NDO link"). */
export function ndoLinkFor(origin: string, ndoPath: string): string {
  return `${origin.replace(/\/$/, '')}${ndoPath}`;
}
