import type { GroupMember, LobbyUserProfile } from '../domain/types.js';

/** Demo personas — Lynn is the default “current agent” in UI kit routes. */
export const MOCK_AGENT_NAMES = {
  lynn: 'Lynn',
  bob: 'Bob',
  bauwens: 'Bauwens',
  tibi: 'Tibi',
  sacha: 'Sacha'
} as const;

export type MockAgentId = keyof typeof MOCK_AGENT_NAMES;

export interface MockAgent {
  id: MockAgentId;
  name: string;
  nickname: string;
}

export const MOCK_AGENTS: MockAgent[] = [
  { id: 'lynn', name: MOCK_AGENT_NAMES.lynn, nickname: MOCK_AGENT_NAMES.lynn },
  { id: 'bob', name: MOCK_AGENT_NAMES.bob, nickname: MOCK_AGENT_NAMES.bob },
  { id: 'bauwens', name: MOCK_AGENT_NAMES.bauwens, nickname: MOCK_AGENT_NAMES.bauwens },
  { id: 'tibi', name: MOCK_AGENT_NAMES.tibi, nickname: MOCK_AGENT_NAMES.tibi },
  { id: 'sacha', name: MOCK_AGENT_NAMES.sacha, nickname: MOCK_AGENT_NAMES.sacha }
];

export const MOCK_CURRENT_AGENT_ID: MockAgentId = 'lynn';

export const MOCK_LOBBY_PROFILE: LobbyUserProfile = {
  nickname: MOCK_AGENT_NAMES.lynn,
  realName: MOCK_AGENT_NAMES.lynn,
  bio: 'Commons-oriented contributor working across Sensorica and WaterFrance.',
  email: 'lynn@example.com',
  phone: '+1 555 0100'
};

/** NDO action hash → initiator display name */
export const MOCK_NDO_INITIATOR_NAMES: Record<string, string> = {
  uhC0kVX5k7dL2mPqRsTuVwXyZaB3cDeF4gHiJkLm: MOCK_AGENT_NAMES.tibi,
  uhC0kAb3cDeF4gHiJkLmNoPqRsTuVwXy: MOCK_AGENT_NAMES.bob,
  uhC0kZyXwVuTsRqPoNmLkJiHgFeDcBa9: MOCK_AGENT_NAMES.bob,
  uhC0k1234abcdefghijklmnopqrstuvwx: MOCK_AGENT_NAMES.bauwens,
  uhC0kIdeationOnlyHashExample00001: MOCK_AGENT_NAMES.lynn,
  uhC0kSourceNdoRiverExample01: MOCK_AGENT_NAMES.sacha
};

export function getMockInitiatorName(ndoHash: string): string | null {
  return MOCK_NDO_INITIATOR_NAMES[ndoHash] ?? null;
}

export const MOCK_GROUP_MEMBERS: Record<string, GroupMember[]> = {
  grp_sensorica: [
    { id: 'tibi', name: MOCK_AGENT_NAMES.tibi, role: 'Creator' },
    { id: 'lynn', name: MOCK_AGENT_NAMES.lynn, role: 'Member' },
    { id: 'bob', name: MOCK_AGENT_NAMES.bob, role: 'Member' },
    { id: 'bauwens', name: MOCK_AGENT_NAMES.bauwens, role: 'Member' }
  ],
  grp_opensourceecology: [
    { id: 'bauwens', name: MOCK_AGENT_NAMES.bauwens, role: 'Creator' },
    { id: 'bob', name: MOCK_AGENT_NAMES.bob, role: 'Member' },
    { id: 'lynn', name: MOCK_AGENT_NAMES.lynn, role: 'Member' }
  ],
  grp_waterfrance: [
    { id: 'sacha', name: MOCK_AGENT_NAMES.sacha, role: 'Creator' },
    { id: 'lynn', name: MOCK_AGENT_NAMES.lynn, role: 'Member' },
    { id: 'tibi', name: MOCK_AGENT_NAMES.tibi, role: 'Member' }
  ]
};

export function getMockGroupMembers(groupId: string, createdBy?: string): GroupMember[] {
  return (
    MOCK_GROUP_MEMBERS[groupId] ?? [
      { id: 'creator', name: createdBy ?? 'Creator', role: 'Creator' },
      { id: 'lynn', name: MOCK_AGENT_NAMES.lynn, role: 'Member' }
    ]
  );
}
