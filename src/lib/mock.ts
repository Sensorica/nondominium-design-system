// Seed data for the /app prototype. Every screen renders off these constants,
// copied once into the state singleton so edits persist for a session without
// mutating the seeds themselves.
//
// Records are chosen so that every lifecycle stage, every property regime, and
// every resource nature has at least one representative NDO. The screen map
// deep-links to specific ids for exactly that reason: `ndo-lifecycle` points at
// an NDO mid-ladder, `ndo-detail` at a mature one.

import type {
  Agent,
  Agreement,
  Contribution,
  EconomicResource,
  GroupDescriptor,
  LobbyUserProfile,
  NdoDescriptor,
  NdoHardLink,
  NdoTransitionHistoryEvent,
  WorkLogEntry,
} from './types';

/** The agent operating the prototype. */
export const ME_ID = 'ag1';

export const INITIAL_PROFILE: LobbyUserProfile = {
  nickname: 'riverstone',
  realName: 'Ada Riverstone',
  bio: 'Fabrication and open hardware. Custodian of the shared CNC.',
  email: 'ada@example.org',
};

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'ag1',
    pubKey: 'uhCAkR7v2…9tQb',
    person: { name: 'Ada Riverstone', bio: 'Fabrication and open hardware.' },
    roles: ['AccountableAgent', 'Repair'],
    joinedAt: '2026-02-04',
  },
  {
    id: 'ag2',
    pubKey: 'uhCAkM1p8…kL3d',
    person: { name: 'Tomas Belén', bio: 'Logistics, transport, and route planning.' },
    roles: ['AccountableAgent', 'Transport'],
    joinedAt: '2026-01-18',
  },
  {
    id: 'ag3',
    pubKey: 'uhCAkZ4x0…7rWm',
    person: { name: 'Kesse Nyarko', bio: 'Governance and validation. Keeps the rules honest.' },
    roles: ['PrimaryAccountableAgent'],
    joinedAt: '2025-11-02',
  },
  {
    id: 'ag4',
    pubKey: 'uhCAkQ9s5…2vHt',
    person: { name: 'Mira Solano', bio: 'Storage and inventory.' },
    roles: ['AccountableAgent', 'Storage'],
    joinedAt: '2026-03-21',
  },
  {
    // No Person entry yet — renders as a truncated pubkey (REQ-UI-NDO-02).
    id: 'ag5',
    pubKey: 'uhCAkB2n6…8yPc',
    roles: ['SimpleAgent'],
    joinedAt: '2026-07-30',
  },
];

export const INITIAL_GROUPS: GroupDescriptor[] = [
  {
    id: 'gr1',
    networkSeed: 'gr1',
    name: 'Sensorica Lab',
    description: 'Open value network fabrication lab. Shared tooling, shared benefit.',
    createdBy: 'ag3',
    createdAt: '2025-11-02',
    memberIds: ['ag1', 'ag2', 'ag3', 'ag4'],
    memberProfile: { isAnonymous: false, shownFields: ['realName', 'bio'] },
  },
  {
    id: 'gr2',
    networkSeed: 'gr2',
    name: 'Watershed Commons',
    description: 'Regional water monitoring and remediation.',
    createdBy: 'ag2',
    createdAt: '2026-04-11',
    memberIds: ['ag1', 'ag2', 'ag5'],
    memberProfile: { isAnonymous: true, shownFields: [] },
  },
  {
    id: 'gr3',
    networkSeed: 'gr3',
    name: 'Open Hardware Circle',
    description: 'Design files, build guides, and fabrication methods.',
    createdBy: 'ag1',
    createdAt: '2026-06-08',
    memberIds: ['ag1', 'ag3'],
  },
];

export const INITIAL_NDOS: NdoDescriptor[] = [
  {
    id: 'ndo1',
    hash: 'uhC0kVX5k7dL2mPqR8sT1uW4xY7zA0bC3dE6fG9h',
    name: 'Community Solar Array',
    description:
      'Shared photovoltaic infrastructure on the lab roof. Output feeds the workshop and the neighbouring co-op.',
    property_regime: 'Nondominium',
    resource_nature: 'Physical',
    lifecycle_stage: 'Active',
    initiator: 'ag3',
    created_at: '2025-12-14',
    groupIds: ['gr1'],
  },
  {
    id: 'ndo2',
    hash: 'uhC0kNb8j3fK9pQ2rS5tU8vW1xY4zA7bC0dE3fG6',
    name: 'CNC Router Cell',
    description: 'Three-axis router, custody rotates between accountable agents. Maintenance log attached.',
    property_regime: 'CommonPool',
    resource_nature: 'Physical',
    lifecycle_stage: 'Distributed',
    initiator: 'ag1',
    created_at: '2026-01-22',
    groupIds: ['gr1', 'gr3'],
  },
  {
    id: 'ndo3',
    hash: 'uhC0kTr4h1dJ7nO5pQ8rS2tU6vW9xY3zA6bC9dE',
    name: 'Sensor Firmware',
    description: 'Water-quality sensor firmware. Copy-left, attribution required, fork friction is social.',
    property_regime: 'Commons',
    resource_nature: 'Digital',
    lifecycle_stage: 'Stable',
    initiator: 'ag2',
    created_at: '2026-02-09',
    groupIds: ['gr2', 'gr3'],
  },
  {
    id: 'ndo4',
    hash: 'uhC0kGf6m2sL8qR3tU7vW0xY4zA8bC1dE5fG9hJ',
    name: 'Watershed Survey Method',
    description: 'Documented sampling protocol: sites, cadence, chain of custody, and reporting format.',
    property_regime: 'Commons',
    resource_nature: 'Information',
    lifecycle_stage: 'Prototype',
    initiator: 'ag2',
    created_at: '2026-05-30',
    groupIds: ['gr2'],
  },
  {
    id: 'ndo5',
    hash: 'uhC0kPd3k9rM5tU1vW6xY2zA7bC4dE8fG3hJ6kL',
    name: 'Repair Clinic',
    description: 'Monthly repair service. Agents with the Repair role take bookings and log outcomes.',
    property_regime: 'Nondominium',
    resource_nature: 'Service',
    lifecycle_stage: 'Development',
    initiator: 'ag1',
    created_at: '2026-06-17',
    groupIds: ['gr1'],
  },
  {
    id: 'ndo6',
    hash: 'uhC0kWc7n4tP0vX5yZ9aB2cD6eF1gH4jK8mN3pQ',
    name: 'Tool Library Ledger',
    description: 'Digital twin of the physical tool library. Custody chain, condition, and reliability.',
    property_regime: 'CommonPool',
    resource_nature: 'Hybrid',
    lifecycle_stage: 'Specification',
    initiator: 'ag4',
    created_at: '2026-07-04',
    groupIds: ['gr1'],
  },
  {
    id: 'ndo7',
    hash: 'uhC0kJh2b6vR9xZ4aC8dF1gJ5kM9nP3qS7tV0wY',
    name: 'Neighbourhood Battery',
    description: 'Storage buffer for the solar array. Still an idea; nothing specified yet.',
    property_regime: 'Nondominium',
    resource_nature: 'Physical',
    lifecycle_stage: 'Ideation',
    initiator: 'ag5',
    created_at: '2026-08-02',
    groupIds: ['gr1'],
  },
  {
    id: 'ndo8',
    hash: 'uhC0kLm5c1wS3yA7bD2eG6hK0mP4rT8vX1zB5dF',
    name: 'Seasonal Kiln',
    description: 'Wood-fired kiln. Dormant outside the firing season; resumes at Active.',
    property_regime: 'CommonPool',
    resource_nature: 'Physical',
    lifecycle_stage: 'Hibernating',
    hibernation_origin: 'Active',
    initiator: 'ag4',
    created_at: '2026-01-09',
    groupIds: ['gr1'],
  },
  {
    id: 'ndo9',
    hash: 'uhC0kRq8d5zT2bE6fH1jL4nQ8sV3wY7aC0dG4hK',
    name: 'Sensor Firmware v1',
    description: 'Superseded by the current firmware NDO. Kept for provenance and attribution.',
    property_regime: 'Commons',
    resource_nature: 'Digital',
    lifecycle_stage: 'Deprecated',
    successor_ndo_hash: 'uhC0kTr4h1dJ7nO5pQ8rS2tU6vW9xY3zA6bC9dE',
    initiator: 'ag2',
    created_at: '2025-09-15',
    groupIds: ['gr3'],
  },
  {
    id: 'ndo10',
    hash: 'uhC0kYv1e7aU4cF9gJ3kM7pR1tW5xZ8bD2eH6jN',
    name: 'Prototype Bench Mk I',
    description: 'Decommissioned. The tombstone stays: identity anchors are permanent.',
    property_regime: 'Private',
    resource_nature: 'Physical',
    lifecycle_stage: 'EndOfLife',
    initiator: 'ag1',
    created_at: '2025-08-21',
    groupIds: ['gr1'],
  },
];

export const INITIAL_TRANSITIONS: NdoTransitionHistoryEvent[] = [
  { from_stage: 'Ideation', to_stage: 'Specification', agent: 'ag3', timestamp: '2025-12-20', event_hash: null },
  { from_stage: 'Specification', to_stage: 'Development', agent: 'ag3', timestamp: '2026-01-15', event_hash: null },
  { from_stage: 'Development', to_stage: 'Prototype', agent: 'ag1', timestamp: '2026-03-02', event_hash: null },
  { from_stage: 'Prototype', to_stage: 'Stable', agent: 'ag3', timestamp: '2026-04-19', event_hash: null },
  { from_stage: 'Stable', to_stage: 'Distributed', agent: 'ag3', timestamp: '2026-05-27', event_hash: null },
  { from_stage: 'Distributed', to_stage: 'Active', agent: 'ag3', timestamp: '2026-06-30', event_hash: null },
];

export const INITIAL_HARD_LINKS: NdoHardLink[] = [
  { id: 'hl1', from: 'ndo1', to: 'ndo8', link_type: 'Component', note: 'Kiln draws from the array in shoulder season.' },
  { id: 'hl2', from: 'ndo3', to: 'ndo9', link_type: 'Supersedes', note: 'v2 replaces v1; attribution flows upstream.' },
  { id: 'hl3', from: 'ndo4', to: 'ndo3', link_type: 'DerivedFrom', note: 'Method derived from the firmware sampling loop.' },
  { id: 'hl4', from: 'ndo6', to: 'ndo2', link_type: 'Component', note: 'The router is one entry in the ledger.' },
];

export const INITIAL_CONTRIBUTIONS: Contribution[] = [
  { id: 'c1', ndoId: 'ndo1', provider: 'ag1', action: 'Work', effort_hours: 14, validated_by: ['ag3'], at: '2026-06-02', note: 'Inverter replacement and rewiring.' },
  { id: 'c2', ndoId: 'ndo1', provider: 'ag4', action: 'Modify', effort_hours: 6, validated_by: ['ag3'], at: '2026-07-11', note: 'Mount reinforcement before the storm season.' },
  { id: 'c3', ndoId: 'ndo2', provider: 'ag1', action: 'Work', effort_hours: 9, validated_by: ['ag3', 'ag4'], at: '2026-05-19', note: 'Spindle bearing service.' },
  { id: 'c4', ndoId: 'ndo3', provider: 'ag2', action: 'Produce', effort_hours: 22, validated_by: ['ag1'], at: '2026-04-08', note: 'Calibration routine rewrite.' },
  { id: 'c5', ndoId: 'ndo4', provider: 'ag2', action: 'Cite', validated_by: ['ag1'], at: '2026-07-25', note: 'Cited in the regional watershed report.' },
];

export const INITIAL_AGREEMENTS: Agreement[] = [
  {
    id: 'agr1',
    ndoId: 'ndo1',
    version: 2,
    primary_accountable: ['ag3'],
    clauses: [
      { id: 'bc1', label: 'Contributor pool', share: 0.6, beneficiary: 'Validated contributors, effort-weighted' },
      { id: 'bc2', label: 'Maintenance reserve', share: 0.3, beneficiary: 'Sensorica Lab maintenance fund' },
      { id: 'bc3', label: 'Commons levy', share: 0.1, beneficiary: 'Network commons' },
    ],
  },
  {
    id: 'agr2',
    ndoId: 'ndo2',
    version: 1,
    primary_accountable: ['ag1', 'ag3'],
    clauses: [
      { id: 'bc4', label: 'Custodian stipend', share: 0.25, beneficiary: 'Current custodian' },
      { id: 'bc5', label: 'Contributor pool', share: 0.75, beneficiary: 'Validated contributors, effort-weighted' },
    ],
  },
];

export const INITIAL_RESOURCES: EconomicResource[] = [
  { id: 'er1', ndoId: 'ndo1', label: 'Panel bank A', quantity: 24, unit: 'panel', custodian: 'ag3', location: 'Lab roof, east', state: 'Active' },
  { id: 'er2', ndoId: 'ndo1', label: 'Inverter', quantity: 1, unit: 'unit', custodian: 'ag1', location: 'Lab utility room', state: 'Maintenance' },
  { id: 'er3', ndoId: 'ndo2', label: 'Router bed', quantity: 1, unit: 'unit', custodian: 'ag1', location: 'Workshop bay 2', state: 'Active' },
  { id: 'er4', ndoId: 'ndo2', label: 'Spare collets', quantity: 8, unit: 'piece', custodian: 'ag4', location: 'Tool library', state: 'Reserved' },
  { id: 'er5', ndoId: 'ndo6', label: 'Ledger index', quantity: 1, unit: 'record', custodian: 'ag4', state: 'PendingValidation' },
];

export const INITIAL_WORK_LOG: WorkLogEntry[] = [
  { id: 'wl1', groupId: 'gr1', agent: 'ag1', summary: 'Serviced the router spindle and logged the contribution.', hours: 3, at: '2026-08-08' },
  { id: 'wl2', groupId: 'gr1', agent: 'ag4', summary: 'Inventory pass on the tool library ledger.', hours: 2, at: '2026-08-06' },
  { id: 'wl3', groupId: 'gr1', agent: 'ag3', summary: 'Validated two contributions on the solar array.', hours: 1, at: '2026-08-05' },
  { id: 'wl4', groupId: 'gr2', agent: 'ag2', summary: 'Sampled four upstream sites; uploaded the readings.', hours: 5, at: '2026-08-09' },
];
