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

/** Stable mock agent pubkeys. Lynn matches the Resource Perspective session `MY_KEY`. */
export const MOCK_AGENT_KEYS: Record<MockAgentId, string> = {
  lynn: 'uhCAk5vMp8X3nRwsQzLtYd4uJcFe7gHiKoNbPmVe',
  bob: 'uhCAk9Rp7Yq2mNwsQzLtYd4uJcFe7gHiKoNbPmVb',
  bauwens: 'uhCAk4vMp8X3nRwsQzLtYd4uJcFe7gHiKoNbPmVd',
  tibi: 'uhCAk2vMp8X3nRwsQzLtYd4uJcFe7gHiKoNbPmVa',
  /** Mill Creek Watershed initiator in the name map; distinct from Tibi’s key on Community Solar. */
  sacha: 'uhCAk3vMp8X3nRwsQzLtYd4uJcFe7gHiKoNbPmVc'
};

export interface MockAgent {
  id: MockAgentId;
  name: string;
  nickname: string;
  bio: string;
  /** Declared interests — not validated roles, not a reputation score. */
  skills: string[];
}

export const MOCK_AGENTS: MockAgent[] = [
  {
    id: 'lynn',
    name: MOCK_AGENT_NAMES.lynn,
    nickname: MOCK_AGENT_NAMES.lynn,
    bio: 'Commons-oriented contributor working across Sensorica and WaterFrance.',
    skills: ['coordination', 'fabrication', 'monitoring']
  },
  {
    id: 'bob',
    name: MOCK_AGENT_NAMES.bob,
    nickname: MOCK_AGENT_NAMES.bob,
    bio: 'Open hardware fabricator who keeps shared tools running.',
    skills: ['fabrication', 'repair']
  },
  {
    id: 'bauwens',
    name: MOCK_AGENT_NAMES.bauwens,
    nickname: MOCK_AGENT_NAMES.bauwens,
    bio: 'Peer-production researcher bridging theory and workshop practice.',
    skills: ['coordination', 'documentation']
  },
  {
    id: 'tibi',
    name: MOCK_AGENT_NAMES.tibi,
    nickname: MOCK_AGENT_NAMES.tibi,
    bio: 'Sensorica initiator focused on shared energy infrastructure.',
    skills: ['monitoring', 'fabrication', 'coordination']
  },
  {
    id: 'sacha',
    name: MOCK_AGENT_NAMES.sacha,
    nickname: MOCK_AGENT_NAMES.sacha,
    bio: 'Watershed steward for WaterFrance; tracks flow and stewardship obligations.',
    skills: ['monitoring', 'stewardship']
  }
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

export function getMockAgent(id: string): MockAgent | null {
  return MOCK_AGENTS.find((a) => a.id === id) ?? null;
}

export function agentIdFromName(name: string | null | undefined): MockAgentId | null {
  if (!name) return null;
  const found = MOCK_AGENTS.find((a) => a.name === name || a.nickname === name);
  return found?.id ?? null;
}

export function agentIdFromKey(key: string | null | undefined): MockAgentId | null {
  if (!key) return null;
  const entry = (Object.entries(MOCK_AGENT_KEYS) as [MockAgentId, string][]).find(
    ([, k]) => k === key
  );
  return entry?.[0] ?? null;
}

export function agentKeyForId(id: string): string | null {
  return MOCK_AGENT_KEYS[id as MockAgentId] ?? null;
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
