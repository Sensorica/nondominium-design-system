import { describe, expect, test } from 'bun:test';
import { joinAffordance } from './ndo-membership.js';
import { ndosJoinedBy } from './agent-perspective.js';
import type { GroupMember, NdoDescriptor } from './types.js';

const ndo = (hash: string, name = hash): NdoDescriptor => ({
  hash,
  name,
  description: null,
  lifecycle_stage: 'Active',
  property_regime: 'Commons',
  resource_nature: 'Physical',
  initiator: 'uhCAkInitiator',
  created_at: 1,
  successor_ndo_hash: null,
  hibernation_origin: null
});

describe('joinAffordance', () => {
  test('unknown membership keeps Join disabled until the read returns', () => {
    expect(joinAffordance({ joined: null, loading: false })).toEqual({
      disabled: true,
      headerLabel: 'Join NDO',
      confirmLabel: 'Join this NDO'
    });
  });

  test('joined agent sees a disabled Joined affordance', () => {
    expect(joinAffordance({ joined: true, loading: false })).toEqual({
      disabled: true,
      headerLabel: 'Joined',
      confirmLabel: 'Joined'
    });
  });

  test('not-yet-joined agent can click Join', () => {
    expect(joinAffordance({ joined: false, loading: false })).toEqual({
      disabled: false,
      headerLabel: 'Join NDO',
      confirmLabel: 'Join this NDO'
    });
  });

  test('loading disables the control and shows Joining…', () => {
    expect(joinAffordance({ joined: false, loading: true }).disabled).toBe(true);
    expect(joinAffordance({ joined: false, loading: true }).headerLabel).toBe('Joining…');
  });
});

describe('ndosJoinedBy', () => {
  const ndos = [ndo('created-only', 'Created'), ndo('joined', 'Joined'), ndo('both', 'Both')];

  test('initiation alone does not put an NDO on the joined list', () => {
    expect(ndosJoinedBy('lynn', ndos, {}, [], 'lynn')).toEqual([]);
  });

  test('returns NDOs from membership lists', () => {
    const membersByNdo: Record<string, GroupMember[]> = {
      joined: [{ id: 'lynn', name: 'Lynn', role: 'Member' }],
      both: [{ id: 'lynn', name: 'Lynn', role: 'Member' }]
    };
    expect(ndosJoinedBy('lynn', ndos, membersByNdo).map((d) => d.hash)).toEqual([
      'joined',
      'both'
    ]);
  });

  test('joinedHashes covers the current agent when membership rows are not loaded yet', () => {
    expect(
      ndosJoinedBy('lynn', ndos, {}, ['joined', 'both'], 'lynn').map((d) => d.hash)
    ).toEqual(['joined', 'both']);
  });
});
