// Seed data for the prototype, in the exact shapes the production stores hand
// to components: base64-looking hashes, microsecond timestamps, `null` rather
// than `undefined` for absent descriptor fields.
//
// Records are chosen so every lifecycle stage, every regime and every nature
// has at least one representative, and so the screens that only appear in an
// edge state — hibernating with an origin, deprecated with a successor, an
// agent with no Person entry — have something to render.

import type {
  EconomicResourceRow,
  GovernanceRule,
  GroupDescriptor,
  LobbyUserProfile,
  Member,
  NdoDescriptor,
  NdoTransitionHistoryEvent,
  Person,
  PersonRole,
  ResourceSpecificationListing,
  VfEconomicEvent
} from './types';

/** Microseconds, the unit Holochain timestamps arrive in. */
const µs = (iso: string) => new Date(iso).getTime() * 1000;

export const ME_AGENT_B64 = 'uhCAkR7v2xQ8mN3pL5tW9yB1cE4fH7jK0nQ3sV6xZ9aD2gJ5';

export const INITIAL_LOBBY_PROFILE: LobbyUserProfile = {
  nickname: 'riverstone',
  realName: 'Ada Riverstone',
  bio: 'Fabrication and open hardware. Custodian of the shared CNC.',
  email: 'ada@example.org'
};

export const INITIAL_PERSONS: Person[] = [
  { name: 'Ada Riverstone', agent_pub_key: ME_AGENT_B64 },
  { name: 'Tomas Belén', agent_pub_key: 'uhCAkM1p8dR4tY7uI0oP3aS6dF9gH2jK5lZ8xC1vB4nM7' },
  { name: 'Kesse Nyarko', agent_pub_key: 'uhCAkZ4x0cV7bN2mQ5wE8rT1yU4iO7pA0sD3fG6hJ9kL2' },
  { name: 'Mira Solano', agent_pub_key: 'uhCAkQ9s5tG2hJ6kL9zX3cV7bN1mQ4wE7rT0yU3iO6pA9' }
];

export const INITIAL_MY_ROLES: PersonRole[] = [
  { role_name: 'AccountableAgent' },
  { role_name: 'Repair' }
];

export const INITIAL_GROUPS: GroupDescriptor[] = [
  { id: 'sensorica-lab-7f3a', name: 'Sensorica Lab', createdBy: 'Kesse Nyarko', createdAt: µs('2025-11-02') },
  { id: 'watershed-commons-2b91', name: 'Watershed Commons', createdBy: 'Tomas Belén', createdAt: µs('2026-04-11') },
  { id: 'open-hardware-c4e8', name: 'Open Hardware Circle', createdBy: 'Ada Riverstone', createdAt: µs('2026-06-08') }
];

export const INITIAL_NDOS: NdoDescriptor[] = [
  {
    hash: 'uhC0kVX5k7dL2mPqR8sT1uW4xY7zA0bC3dE6fG9h',
    name: 'Community Solar Array',
    lifecycle_stage: 'Active',
    property_regime: 'Nondominium',
    resource_nature: 'Physical',
    description:
      'Shared photovoltaic infrastructure on the lab roof. Output feeds the workshop and the neighbouring co-op.',
    initiator: 'uhCAkZ4x0cV7bN2mQ5wE8rT1yU4iO7pA0sD3fG6hJ9kL2',
    created_at: µs('2025-12-14'),
    successor_ndo_hash: null,
    hibernation_origin: null
  },
  {
    hash: 'uhC0kNb8j3fK9pQ2rS5tU8vW1xY4zA7bC0dE3fG6',
    name: 'CNC Router Cell',
    lifecycle_stage: 'Distributed',
    property_regime: 'CommonPool',
    resource_nature: 'Physical',
    description: 'Three-axis router, custody rotates between accountable agents. Maintenance log attached.',
    initiator: ME_AGENT_B64,
    created_at: µs('2026-01-22'),
    successor_ndo_hash: null,
    hibernation_origin: null
  },
  {
    hash: 'uhC0kTr4h1dJ7nO5pQ8rS2tU6vW9xY3zA6bC9dE',
    name: 'Sensor Firmware',
    lifecycle_stage: 'Stable',
    property_regime: 'Commons',
    resource_nature: 'Digital',
    description: 'Water-quality sensor firmware. Copy-left, attribution required, fork friction is social.',
    initiator: 'uhCAkM1p8dR4tY7uI0oP3aS6dF9gH2jK5lZ8xC1vB4nM7',
    created_at: µs('2026-02-09'),
    successor_ndo_hash: null,
    hibernation_origin: null
  },
  {
    hash: 'uhC0kGf6m2sL8qR3tU7vW0xY4zA8bC1dE5fG9hJ',
    name: 'Watershed Survey Method',
    lifecycle_stage: 'Prototype',
    property_regime: 'Commons',
    resource_nature: 'Information',
    description: 'Documented sampling protocol: sites, cadence, chain of custody, and reporting format.',
    initiator: 'uhCAkM1p8dR4tY7uI0oP3aS6dF9gH2jK5lZ8xC1vB4nM7',
    created_at: µs('2026-05-30'),
    successor_ndo_hash: null,
    hibernation_origin: null
  },
  {
    hash: 'uhC0kPd3k9rM5tU1vW6xY2zA7bC4dE8fG3hJ6kL',
    name: 'Repair Clinic',
    lifecycle_stage: 'Development',
    property_regime: 'Nondominium',
    resource_nature: 'Service',
    description: 'Monthly repair service. Agents with the Repair role take bookings and log outcomes.',
    initiator: ME_AGENT_B64,
    created_at: µs('2026-06-17'),
    successor_ndo_hash: null,
    hibernation_origin: null
  },
  {
    hash: 'uhC0kWc7n4tP0vX5yZ9aB2cD6eF1gH4jK8mN3pQ',
    name: 'Tool Library Ledger',
    lifecycle_stage: 'Specification',
    property_regime: 'CommonPool',
    resource_nature: 'Hybrid',
    description: 'Digital twin of the physical tool library. Custody chain, condition, and reliability.',
    initiator: 'uhCAkQ9s5tG2hJ6kL9zX3cV7bN1mQ4wE7rT0yU3iO6pA9',
    created_at: µs('2026-07-04'),
    successor_ndo_hash: null,
    hibernation_origin: null
  },
  {
    hash: 'uhC0kJh2b6vR9xZ4aC8dF1gJ5kM9nP3qS7tV0wY',
    name: 'Neighbourhood Battery',
    lifecycle_stage: 'Ideation',
    property_regime: 'Nondominium',
    resource_nature: 'Physical',
    description: 'Storage buffer for the solar array. Still an idea; nothing specified yet.',
    // No Person entry for this agent — the card falls back to a truncated key.
    initiator: 'uhCAkB2n6yP9cX3vZ7aD1fG5hJ8kM2nQ6sT9wY4bE7',
    created_at: µs('2026-08-02'),
    successor_ndo_hash: null,
    hibernation_origin: null
  },
  {
    hash: 'uhC0kLm5c1wS3yA7bD2eG6hK0mP4rT8vX1zB5dF',
    name: 'Seasonal Kiln',
    lifecycle_stage: 'Hibernating',
    property_regime: 'CommonPool',
    resource_nature: 'Physical',
    description: 'Wood-fired kiln. Dormant outside the firing season; resumes at Active.',
    initiator: 'uhCAkQ9s5tG2hJ6kL9zX3cV7bN1mQ4wE7rT0yU3iO6pA9',
    created_at: µs('2026-01-09'),
    successor_ndo_hash: null,
    hibernation_origin: 'Active'
  },
  {
    hash: 'uhC0kRq8d5zT2bE6fH1jL4nQ8sV3wY7aC0dG4hK',
    name: 'Sensor Firmware v1',
    lifecycle_stage: 'Deprecated',
    property_regime: 'Commons',
    resource_nature: 'Digital',
    description: 'Superseded by the current firmware NDO. Kept for provenance and attribution.',
    initiator: 'uhCAkM1p8dR4tY7uI0oP3aS6dF9gH2jK5lZ8xC1vB4nM7',
    created_at: µs('2025-09-15'),
    successor_ndo_hash: 'uhC0kTr4h1dJ7nO5pQ8rS2tU6vW9xY3zA6bC9dE',
    hibernation_origin: null
  },
  {
    hash: 'uhC0kYv1e7aU4cF9gJ3kM7pR1tW5xZ8bD2eH6jN',
    name: 'Prototype Bench Mk I',
    lifecycle_stage: 'EndOfLife',
    property_regime: 'Private',
    resource_nature: 'Physical',
    description: 'Decommissioned. The tombstone stays: identity anchors are permanent.',
    initiator: ME_AGENT_B64,
    created_at: µs('2025-08-21'),
    successor_ndo_hash: null,
    hibernation_origin: null
  }
];

/** Which group each NDO is soft-linked from. */
export const INITIAL_GROUP_NDOS: Record<string, string[]> = {
  'sensorica-lab-7f3a': [
    'uhC0kVX5k7dL2mPqR8sT1uW4xY7zA0bC3dE6fG9h',
    'uhC0kNb8j3fK9pQ2rS5tU8vW1xY4zA7bC0dE3fG6',
    'uhC0kPd3k9rM5tU1vW6xY2zA7bC4dE8fG3hJ6kL',
    'uhC0kWc7n4tP0vX5yZ9aB2cD6eF1gH4jK8mN3pQ',
    'uhC0kJh2b6vR9xZ4aC8dF1gJ5kM9nP3qS7tV0wY',
    'uhC0kLm5c1wS3yA7bD2eG6hK0mP4rT8vX1zB5dF',
    'uhC0kYv1e7aU4cF9gJ3kM7pR1tW5xZ8bD2eH6jN'
  ],
  'watershed-commons-2b91': [
    'uhC0kTr4h1dJ7nO5pQ8rS2tU6vW9xY3zA6bC9dE',
    'uhC0kGf6m2sL8qR3tU7vW0xY4zA8bC1dE5fG9hJ'
  ],
  'open-hardware-c4e8': [
    'uhC0kNb8j3fK9pQ2rS5tU8vW1xY4zA7bC0dE3fG6',
    'uhC0kTr4h1dJ7nO5pQ8rS2tU6vW9xY3zA6bC9dE',
    'uhC0kRq8d5zT2bE6fH1jL4nQ8sV3wY7aC0dG4hK'
  ]
};

export const INITIAL_GROUP_MEMBERS: Record<string, Member[]> = {
  'sensorica-lab-7f3a': [
    { id: 'm1', name: 'Ada Riverstone' },
    { id: 'm2', name: 'Tomas Belén' },
    { id: 'm3', name: 'Kesse Nyarko' },
    { id: 'm4', name: 'Mira Solano' }
  ],
  'watershed-commons-2b91': [
    { id: 'm1', name: 'Ada Riverstone' },
    { id: 'm2', name: 'Tomas Belén' }
  ],
  'open-hardware-c4e8': [
    { id: 'm1', name: 'Ada Riverstone' },
    { id: 'm3', name: 'Kesse Nyarko' }
  ]
};

/** Transition history, keyed by NDO hash. Only the mature NDO has a trail. */
export const INITIAL_TRANSITIONS: Record<string, NdoTransitionHistoryEvent[]> = {
  'uhC0kVX5k7dL2mPqR8sT1uW4xY7zA0bC3dE6fG9h': [
    { from_stage: 'Ideation', to_stage: 'Specification', agent: 'uhCAkZ4x0cV7bN2mQ5wE8rT1yU4iO7pA0sD3fG6hJ9kL2', timestamp: µs('2025-12-20'), event_hash: 'uhCkkA1b2C3d4E5f6G7h8J9k0L1m2N3p4Q5r6S7t8V9w' },
    { from_stage: 'Specification', to_stage: 'Development', agent: 'uhCAkZ4x0cV7bN2mQ5wE8rT1yU4iO7pA0sD3fG6hJ9kL2', timestamp: µs('2026-01-15'), event_hash: 'uhCkkB2c3D4e5F6g7H8j9K0l1M2n3P4q5R6s7T8u9W0x' },
    { from_stage: 'Development', to_stage: 'Prototype', agent: ME_AGENT_B64, timestamp: µs('2026-03-02'), event_hash: 'uhCkkC3d4E5f6G7h8J9k0L1m2N3p4Q5r6S7t8V9w0X1y' },
    { from_stage: 'Prototype', to_stage: 'Stable', agent: 'uhCAkZ4x0cV7bN2mQ5wE8rT1yU4iO7pA0sD3fG6hJ9kL2', timestamp: µs('2026-04-19'), event_hash: 'uhCkkD4e5F6g7H8j9K0l1M2n3P4q5R6s7T8u9W0x1Y2z' },
    { from_stage: 'Stable', to_stage: 'Distributed', agent: 'uhCAkZ4x0cV7bN2mQ5wE8rT1yU4iO7pA0sD3fG6hJ9kL2', timestamp: µs('2026-05-27'), event_hash: 'uhCkkE5f6G7h8J9k0L1m2N3p4Q5r6S7t8V9w0X1y2Z3a' },
    { from_stage: 'Distributed', to_stage: 'Active', agent: 'uhCAkZ4x0cV7bN2mQ5wE8rT1yU4iO7pA0sD3fG6hJ9kL2', timestamp: µs('2026-06-30'), event_hash: 'uhCkkF6g7H8j9K0l1M2n3P4q5R6s7T8u9W0x1Y2z3A4b' }
  ]
};

export const INITIAL_SPEC_LISTINGS: ResourceSpecificationListing[] = [
  { action_hash: 'uhC0kVX5k7dL2mPqR8sT1uW4xY7zA0bC3dE6fG9h', specification: { name: 'Community Solar Array', category: 'Energy', is_active: true } },
  { action_hash: 'uhC0kNb8j3fK9pQ2rS5tU8vW1xY4zA7bC0dE3fG6', specification: { name: 'CNC Router Cell', category: 'Fabrication', is_active: true } },
  { action_hash: 'uhC0kTr4h1dJ7nO5pQ8rS2tU6vW9xY3zA6bC9dE', specification: { name: 'Sensor Firmware', category: 'Software', is_active: true } },
  { action_hash: 'uhC0kLm5c1wS3yA7bD2eG6hK0mP4rT8vX1zB5dF', specification: { name: 'Seasonal Kiln', category: 'Fabrication', is_active: false } }
];

/** Economic resource instances, keyed by specification hash. */
export const INITIAL_RESOURCES: Record<string, EconomicResourceRow[]> = {
  'uhC0kVX5k7dL2mPqR8sT1uW4xY7zA0bC3dE6fG9h': [
    { actionHash: 'uhCkkR1a2B3c4D5e6F7g8H9j0K1l2M3n4P5q6R7s8T9u', resource: { quantity: 24, unit: 'panel', state: 'Active' } },
    { actionHash: 'uhCkkR2b3C4d5E6f7G8h9J0k1L2m3N4p5Q6r7S8t9U0v', resource: { quantity: 1, unit: 'inverter', state: 'Maintenance' } }
  ],
  'uhC0kNb8j3fK9pQ2rS5tU8vW1xY4zA7bC0dE3fG6': [
    { actionHash: 'uhCkkR3c4D5e6F7g8H9j0K1l2M3n4P5q6R7s8T9u0V1w', resource: { quantity: 1, unit: 'unit', state: 'Active' } }
  ]
};

/** Governance rules, keyed by specification hash. */
export const INITIAL_RULES: Record<string, GovernanceRule[]> = {
  'uhC0kVX5k7dL2mPqR8sT1uW4xY7zA0bC3dE6fG9h': [
    {
      rule_type: 'access_requirement',
      rule_data: '{\n  "min_role": "AccountableAgent",\n  "requires_validation": true\n}',
      enforced_by: 'PrimaryAccountableAgent'
    },
    {
      rule_type: 'benefit_redistribution',
      rule_data: '{\n  "contributor_pool": 0.6,\n  "maintenance_reserve": 0.3,\n  "commons_levy": 0.1\n}'
    }
  ]
};

/** Economic events, keyed by economic resource action hash. */
export const INITIAL_EVENTS: Record<string, VfEconomicEvent[]> = {
  uhCkkR1a2B3c4D5e6F7g8H9j0K1l2M3n4P5q6R7s8T9u: [
    { action: 'Work', resource_quantity: 14, event_time: µs('2026-06-02'), note: 'Inverter replacement and rewiring.' },
    { action: 'Modify', resource_quantity: 6, event_time: µs('2026-07-11'), note: 'Mount reinforcement before the storm season.' }
  ],
  uhCkkR2b3C4d5E6f7G8h9J0k1L2m3N4p5Q6r7S8t9U0v: [
    { action: 'Use', resource_quantity: 1, event_time: µs('2026-07-28') }
  ],
  uhCkkR3c4D5e6F7g8H9j0K1l2M3n4P5q6R7s8T9u0V1w: [
    { action: 'Work', resource_quantity: 9, event_time: µs('2026-05-19'), note: 'Spindle bearing service.' }
  ]
};
