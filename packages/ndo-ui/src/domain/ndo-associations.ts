import type { GroupDescriptor } from './types.js';

function cloneGroups(groups: GroupDescriptor[]): GroupDescriptor[] {
  return groups.map((g) => ({
    ...g,
    ndoHashes: g.ndoHashes ? [...g.ndoHashes] : undefined
  }));
}

/** Group IDs whose `ndoHashes` already include this NDO. */
export function getAssociatedGroupIds(groups: GroupDescriptor[], ndoHash: string): string[] {
  return groups.filter((g) => g.ndoHashes?.includes(ndoHash)).map((g) => g.id);
}

/** Returns updated groups with the NDO hash added to each selected group. */
export function associateNdoWithGroups(
  groups: GroupDescriptor[],
  ndoHash: string,
  groupIds: string[]
): GroupDescriptor[] {
  if (groupIds.length === 0) return groups;

  return groups.map((g) => {
    if (!groupIds.includes(g.id)) return g;
    const hashes = new Set(g.ndoHashes ?? []);
    hashes.add(ndoHash);
    return { ...g, ndoHashes: [...hashes] };
  });
}

/** Groups the agent can still associate this NDO with. */
export function getAvailableGroupsForAssociation(
  groups: GroupDescriptor[],
  associatedGroupIds: string[]
): GroupDescriptor[] {
  const associated = new Set(associatedGroupIds);
  return groups.filter((g) => !associated.has(g.id));
}

export { cloneGroups };
