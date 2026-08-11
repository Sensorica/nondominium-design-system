import { associateNdoWithGroups, cloneGroups } from '../domain/ndo-associations.js';
import type { GroupDescriptor } from '../domain/types.js';
import { MOCK_GROUPS } from './mockGroups.js';

let internalGroups = cloneGroups(MOCK_GROUPS);

/** Snapshot of mock group↔NDO links (persists across UI kit routes in one session). */
export function getMockGroups(): GroupDescriptor[] {
  return cloneGroups(internalGroups);
}

export function applyMockNdoGroupAssociations(ndoHash: string, groupIds: string[]): void {
  internalGroups = associateNdoWithGroups(internalGroups, ndoHash, groupIds);
}

export function resetMockGroups(): void {
  internalGroups = cloneGroups(MOCK_GROUPS);
}
