// Seed data for the prototype, in the exact shapes the production stores hand
// to components: base64-looking hashes, microsecond timestamps, `null` rather
// than `undefined` for absent descriptor fields.
//
// Records are chosen so every lifecycle stage, every regime and every nature
// has at least one representative, and so the screens that only appear in an
// edge state — hibernating with an origin, deprecated with a successor, an
// agent with no Person entry — have something to render.

import type {
  ConstraintViolation,
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
  VfCommitment,
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

// `Person` and `PersonRole` carried a narrowed two-field and one-field shape here
// until 2026-09-08, matching a narrowed shape in types.ts rather than the app's.
// Both are now the app's, so these records carry the fields a real Person entry
// has. `created_at` is the DHT write, not the human's arrival; `assigned_by` and
// `assigned_at` are what make a role a validated credential rather than a label,
// and a kit that omits them cannot show a reviewer who vouched for whom.
export const INITIAL_PERSONS: Person[] = [
  {
    name: 'Ada Riverstone',
    agent_pub_key: ME_AGENT_B64,
    created_at: µs('2026-02-14')
  },
  {
    name: 'Tomas Belén',
    agent_pub_key: 'uhCAkM1p8dR4tY7uI0oP3aS6dF9gH2jK5lZ8xC1vB4nM7',
    created_at: µs('2026-01-08')
  },
  {
    name: 'Kesse Nyarko',
    agent_pub_key: 'uhCAkZ4x0cV7bN2mQ5wE8rT1yU4iO7pA0sD3fG6hJ9kL2',
    created_at: µs('2025-11-22')
  },
  {
    name: 'Mira Solano',
    agent_pub_key: 'uhCAkQ9s5tG2hJ6kL9zX3cV7bN1mQ4wE7rT0yU3iO6pA9',
    created_at: µs('2026-03-30')
  }
];

// Kesse is the oldest agent in the mock and assigns both of Ada's roles, so the
// promotion chain reads the way the app's does: a role is granted by someone who
// already holds governance standing, never self-assigned.
export const INITIAL_MY_ROLES: PersonRole[] = [
  {
    role_name: 'AccountableAgent',
    assigned_by: 'uhCAkZ4x0cV7bN2mQ5wE8rT1yU4iO7pA0sD3fG6hJ9kL2',
    assigned_at: µs('2026-02-20')
  },
  {
    role_name: 'Repair',
    assigned_by: 'uhCAkZ4x0cV7bN2mQ5wE8rT1yU4iO7pA0sD3fG6hJ9kL2',
    assigned_at: µs('2026-04-11')
  }
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
    hibernation_origin: null,
    rivalry_override: 'Rivalrous'
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
    hibernation_origin: null,
    rivalry_override: 'Rivalrous'
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
    hibernation_origin: null,
    rivalry_override: 'NonRivalrous'
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
    hibernation_origin: null,
    rivalry_override: 'NonRivalrous'
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
    hibernation_origin: null,
    rivalry_override: 'Rivalrous'
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
    hibernation_origin: null,
    rivalry_override: null
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
    hibernation_origin: null,
    rivalry_override: 'Rivalrous'
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
    hibernation_origin: 'Active',
    rivalry_override: 'Rivalrous'
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
    hibernation_origin: null,
    rivalry_override: 'NonRivalrous'
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
    hibernation_origin: null,
    rivalry_override: 'Rivalrous'
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

// NDO membership, per NDO identity hash. Distinct from group membership: an NDO
// is its own cloned cell (ADR-010) and joining a group does not join you to the
// NDOs anchored in it. PR #129 shipped join, list and is-member on that cell;
// the prototype rendered "not yet implemented on the DHT" until 2026-09-08,
// which was true before #129 and has been false since.
//
// The Solar Array carries four members and the CNC Router two, so a reviewer can
// see a populated list and a sparse one. The Sensor Firmware deliberately has no
// entry at all, which is how the empty state gets a surface: an NDO nobody has
// joined renders the invitation to join rather than an empty table. `me` is
// absent from all three, so the Join button has something to do on every one.
export const INITIAL_NDO_MEMBERS: Record<string, Member[]> = {
  'uhC0kVX5k7dL2mPqR8sT1uW4xY7zA0bC3dE6fG9h': [
    { id: 'm2', name: 'Tomas Belén', role: 'Member' },
    { id: 'm3', name: 'Kesse Nyarko', role: 'Member' },
    { id: 'm4', name: 'Mira Solano', role: 'Member' }
  ],
  'uhC0kNb8j3fK9pQ2rS5tU8vW1xY4zA7bC0dE3fG6': [
    { id: 'm3', name: 'Kesse Nyarko', role: 'Member' }
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

// Layer 1 specifications, keyed by the NDO identity they specify. `scope` and
// `ndo_identity_hash` arrived with #132: a specification now says how far its
// benefit reaches and which Layer 0 identity it belongs to.
export const INITIAL_SPEC_LISTINGS: ResourceSpecificationListing[] = [
  {
    action_hash: 'uhC0kVX5k7dL2mPqR8sT1uW4xY7zA0bC3dE6fG9h',
    specification: {
      name: 'Community Solar Array',
      description: 'Roof-mounted photovoltaic array, 24 panels on a single inverter string.',
      category: 'Energy',
      is_active: true,
      scope: 'Network',
      ndo_identity_hash: 'uhC0kVX5k7dL2mPqR8sT1uW4xY7zA0bC3dE6fG9h'
    }
  },
  {
    // The ONE listing whose action_hash differs from its ndo_identity_hash, and it
    // exists to make two queries separable that the rest of this fixture cannot
    // tell apart. Every other listing here was seeded with action_hash equal to
    // the NDO hash, and `INITIAL_RESOURCES` was keyed by those same values, so
    // `getResourcesBySpecification(ndoHash)` and a proper walk through
    // `specificationsForNdo` returned identical rows. A walk that used the wrong
    // key was indistinguishable from a correct one, and no typecheck, class
    // comparison or browser pass could say otherwise: the instruments were fine,
    // the data could not answer the question. A fixture whose keys collide cannot
    // discriminate between two queries that differ only in which key they use.
    action_hash: 'uhC0kSpec2Mount9rT4vX7zB1dF5hK8mQ2sU6wY0aC3',
    specification: {
      name: 'Solar Array Mounting Rig',
      description: 'Roof mounting rails and ballast for the panel array, specified separately from the panels.',
      category: 'Fabrication',
      is_active: true,
      scope: 'Network',
      ndo_identity_hash: 'uhC0kVX5k7dL2mPqR8sT1uW4xY7zA0bC3dE6fG9h'
    }
  },
  {
    action_hash: 'uhC0kNb8j3fK9pQ2rS5tU8vW1xY4zA7bC0dE3fG6',
    specification: {
      name: 'CNC Router Cell',
      description: 'Three-axis router, 1200x600 bed, with dust extraction and a tool library.',
      category: 'Fabrication',
      is_active: true,
      scope: 'Network',
      ndo_identity_hash: 'uhC0kNb8j3fK9pQ2rS5tU8vW1xY4zA7bC0dE3fG6'
    }
  },
  {
    action_hash: 'uhC0kTr4h1dJ7nO5pQ8rS2tU6vW9xY3zA6bC9dE',
    specification: {
      name: 'Sensor Firmware',
      description: 'Firmware for the open sensor board, including the calibration protocol.',
      category: 'Software',
      is_active: true,
      scope: 'Public',
      ndo_identity_hash: 'uhC0kTr4h1dJ7nO5pQ8rS2tU6vW9xY3zA6bC9dE'
    }
  },
  {
    action_hash: 'uhC0kLm5c1wS3yA7bD2eG6hK0mP4rT8vX1zB5dF',
    specification: {
      name: 'Seasonal Kiln',
      description: 'Wood-fired kiln, fired twice a year by whoever has the firing role.',
      category: 'Fabrication',
      is_active: false,
      scope: 'Project',
      ndo_identity_hash: 'uhC0kLm5c1wS3yA7bD2eG6hK0mP4rT8vX1zB5dF'
    }
  }
];

// Economic resource instances, keyed by specification hash.
//
// `operational_state` replaced `state` in #132, and the two enums are not the
// same thing: a resource under repair stays `LifecycleStage.Active` and becomes
// `OperationalState.InMaintenance`. The old mock carried `state: 'Active'` and
// `state: 'Maintenance'`, neither of which is an OperationalState value, and a
// component rendering one of those inside a lifecycle badge is exactly the
// conflation the type split exists to prevent.
export const INITIAL_RESOURCES: Record<string, EconomicResourceRow[]> = {
  'uhC0kVX5k7dL2mPqR8sT1uW4xY7zA0bC3dE6fG9h': [
    {
      actionHash: 'uhCkkR1a2B3c4D5e6F7g8H9j0K1l2M3n4P5q6R7s8T9u',
      resource: {
        quantity: 24,
        unit: 'panel',
        custodian: ME_AGENT_B64,
        current_location: 'Workshop roof, east bay',
        operational_state: 'InUse'
      }
    },
    {
      actionHash: 'uhCkkR2b3C4d5E6f7G8h9J0k1L2m3N4p5Q6r7S8t9U0v',
      resource: {
        quantity: 1,
        unit: 'inverter',
        custodian: 'uhCAkM1p8dR4tY7uI0oP3aS6dF9gH2jK5lZ8xC1vB4nM7',
        current_location: 'Bench 3',
        operational_state: 'InMaintenance'
      }
    }
  ],
  // Keyed by the SECOND Solar Array specification, not by the NDO hash. The
  // specification walk reaches this row; a query keyed on the NDO hash does not.
  'uhC0kSpec2Mount9rT4vX7zB1dF5hK8mQ2sU6wY0aC3': [
    {
      actionHash: 'uhCkkR4d5E6f7G8h9J0k1L2m3N4p5Q6r7S8t9U0v1W2x',
      resource: {
        quantity: 8,
        unit: 'rail',
        custodian: 'uhCAkZ4x0cV7bN2mQ5wE8rT1yU4iO7pA0sD3fG6hJ9kL2',
        current_location: 'Roof, north run',
        operational_state: 'InStorage'
      }
    }
  ],
  'uhC0kNb8j3fK9pQ2rS5tU8vW1xY4zA7bC0dE3fG6': [
    {
      actionHash: 'uhCkkR3c4D5e6F7g8H9j0K1l2M3n4P5q6R7s8T9u0V1w',
      resource: {
        quantity: 1,
        unit: 'unit',
        custodian: ME_AGENT_B64,
        current_location: 'Fabrication floor',
        operational_state: 'Available'
      }
    }
  ]
};

// Typed governance rules, keyed by specification hash.
//
// Every rule here is one of the four `RuleData` discriminants from
// `crates/shared/src/rule_data.rs`. The previous seed invented `rule_type:
// 'access_requirement'` and `'benefit_redistribution'` with hand-written JSON
// payloads; neither name exists in the type, and anyone designing a rule
// surface from that seed was designing against a fiction. Benefit
// redistribution is real, but it lives in `Agreement` and `BenefitClause` in
// `zome_gouvernance`, not in a governance rule, so it is not represented here
// at all rather than represented wrongly.
//
// The set is chosen so all four discriminants render, and so the coherence
// story is visible: a `TransferCondition` of type `Ownership` is attached to a
// `Nondominium` NDO, which is the case the constraint checker refuses, because
// a nondominium resource has no ownership to transfer.
export const INITIAL_RULES: Record<string, GovernanceRule[]> = {
  'uhC0kVX5k7dL2mPqR8sT1uW4xY7zA0bC3dE6fG9h': [
    {
      rule_data: {
        AccessRequirement: {
          accessibility: 'Credentialed',
          required_role: 'AccountableAgent',
          min_affiliation: 'ActiveAffiliate'
        }
      },
      enforced_by: 'PrimaryAccountableAgent',
      ndo_identity_hash: 'uhC0kVX5k7dL2mPqR8sT1uW4xY7zA0bC3dE6fG9h',
      property_regime: 'Nondominium',
      resource_nature: 'Physical',
      rivalry_override: 'Rivalrous'
    },
    {
      rule_data: {
        MaintenanceSchedule: {
          interval_days: 90,
          required_role: 'Repair'
        }
      },
      ndo_identity_hash: 'uhC0kVX5k7dL2mPqR8sT1uW4xY7zA0bC3dE6fG9h',
      property_regime: 'Nondominium',
      resource_nature: 'Physical',
      rivalry_override: 'Rivalrous'
    },
    {
      // The incoherent one, kept on purpose: Nondominium forbids alienation, so
      // a transfer condition of type Ownership is a rule the regime cannot host.
      // The constraint surface has to be able to show a rule being refused, and
      // a seed with only valid rules can never render that screen.
      rule_data: {
        TransferCondition: {
          transfer_type: 'Ownership',
          requires_validation: true,
          validator_role: 'PrimaryAccountableAgent'
        }
      },
      ndo_identity_hash: 'uhC0kVX5k7dL2mPqR8sT1uW4xY7zA0bC3dE6fG9h',
      property_regime: 'Nondominium',
      resource_nature: 'Physical',
      rivalry_override: 'Rivalrous'
    }
  ],
  'uhC0kNb8j3fK9pQ2rS5tU8vW1xY4zA7bC0dE3fG6': [
    {
      rule_data: {
        UsageLimit: {
          max_duration_hours: 6,
          max_quantity_per_period: 3,
          period_days: 7
        }
      },
      enforced_by: 'AccountableAgent',
      ndo_identity_hash: 'uhC0kNb8j3fK9pQ2rS5tU8vW1xY4zA7bC0dE3fG6',
      property_regime: 'Pool',
      resource_nature: 'Physical',
      rivalry_override: 'Rivalrous'
    }
  ],
  'uhC0kTr4h1dJ7nO5pQ8rS2tU6vW9xY3zA6bC9dE': [
    {
      // A non-rivalrous commons resource: open access, no quota, because there
      // is nothing to deplete. This is the rule that should look different from
      // every rule above it.
      rule_data: {
        AccessRequirement: {
          accessibility: 'Free'
        }
      },
      ndo_identity_hash: 'uhC0kTr4h1dJ7nO5pQ8rS2tU6vW9xY3zA6bC9dE',
      property_regime: 'Commons',
      resource_nature: 'Digital',
      rivalry_override: 'NonRivalrous'
    }
  ]
};

// The constraint verdicts the app's checker returns for the rules above, so the
// violation surface has something to render without a conductor. Keyed by the
// rule's position in INITIAL_RULES for the NDO it belongs to.
export const INITIAL_RULE_VIOLATIONS: Record<string, ConstraintViolation[]> = {
  'uhC0kVX5k7dL2mPqR8sT1uW4xY7zA0bC3dE6fG9h#2': [
    {
      rule_id: 'REQ-RES-03',
      message:
        'A Nondominium resource cannot host a TransferCondition of type Ownership: the regime permits no alienation, so there is no ownership to transfer.',
      severity: 'Hard'
    }
  ]
};

// Economic events, keyed by economic resource action hash.
//
// #132 added `ndo_identity_hash` to every event, which is what binds an event
// to the per-NDO cell it was written in.
export const INITIAL_EVENTS: Record<string, VfEconomicEvent[]> = {
  // Reachable only through the second Solar Array specification.
  'uhCkkR4d5E6f7G8h9J0k1L2m3N4p5Q6r7S8t9U0v1W2x': [
    {
      action: 'Move',
      provider: 'uhCAkZ4x0cV7bN2mQ5wE8rT1yU4iO7pA0sD3fG6hJ9kL2',
      receiver: ME_AGENT_B64,
      resource_inventoried_as: 'uhCkkR4d5E6f7G8h9J0k1L2m3N4p5Q6r7S8t9U0v1W2x',
      affects: 'uhCkkR4d5E6f7G8h9J0k1L2m3N4p5Q6r7S8t9U0v1W2x',
      resource_quantity: 8,
      event_time: µs('2026-08-04'),
      note: 'Rails carried up to the north run.',
      ndo_identity_hash: 'uhC0kVX5k7dL2mPqR8sT1uW4xY7zA0bC3dE6fG9h'
    }
  ],
  // THE ORPHAN, and the only reason `getAllEconomicEvents` exists. It carries the
  // Solar Array's ndo_identity_hash, but its resource hangs off no specification
  // of that NDO, so the specification walk cannot reach it by construction. The
  // app handles this with a second pass over every event on the cell, filtered on
  // ndo_identity_hash and deduped against the walk. Without a row of this shape
  // the second pass is unfalsifiable: it would merge nothing, and a prototype
  // missing it would render an activity feed that is silently short.
  'uhCkkR9z8Y7x6W5v4U3t2S1r0Q9p8N7m6L5k4J3h2G1f': [
    {
      action: 'Cite',
      provider: 'uhCAkQ9s5tG2hJ6kL9zX3cV7bN1mQ4wE7rT0yU3iO6pA9',
      receiver: ME_AGENT_B64,
      resource_inventoried_as: 'uhCkkR9z8Y7x6W5v4U3t2S1r0Q9p8N7m6L5k4J3h2G1f',
      affects: 'uhCkkR9z8Y7x6W5v4U3t2S1r0Q9p8N7m6L5k4J3h2G1f',
      resource_quantity: 1,
      event_time: µs('2026-08-21'),
      note: 'Array output cited in the watershed energy report.',
      ndo_identity_hash: 'uhC0kVX5k7dL2mPqR8sT1uW4xY7zA0bC3dE6fG9h'
    }
  ],
  uhCkkR1a2B3c4D5e6F7g8H9j0K1l2M3n4P5q6R7s8T9u: [
    {
      action: 'Work',
      provider: 'uhCAkM1p8dR4tY7uI0oP3aS6dF9gH2jK5lZ8xC1vB4nM7',
      receiver: ME_AGENT_B64,
      resource_inventoried_as: 'uhCkkR1a2B3c4D5e6F7g8H9j0K1l2M3n4P5q6R7s8T9u',
      affects: 'uhCkkR1a2B3c4D5e6F7g8H9j0K1l2M3n4P5q6R7s8T9u',
      resource_quantity: 14,
      event_time: µs('2026-06-02'),
      note: 'Inverter replacement and rewiring.',
      ndo_identity_hash: 'uhC0kVX5k7dL2mPqR8sT1uW4xY7zA0bC3dE6fG9h'
    },
    {
      action: 'Modify',
      provider: ME_AGENT_B64,
      receiver: ME_AGENT_B64,
      resource_inventoried_as: 'uhCkkR1a2B3c4D5e6F7g8H9j0K1l2M3n4P5q6R7s8T9u',
      affects: 'uhCkkR1a2B3c4D5e6F7g8H9j0K1l2M3n4P5q6R7s8T9u',
      resource_quantity: 6,
      event_time: µs('2026-07-11'),
      note: 'Mount reinforcement before the storm season.',
      ndo_identity_hash: 'uhC0kVX5k7dL2mPqR8sT1uW4xY7zA0bC3dE6fG9h'
    }
  ],
  uhCkkR2b3C4d5E6f7G8h9J0k1L2m3N4p5Q6r7S8t9U0v: [
    {
      action: 'Use',
      provider: ME_AGENT_B64,
      receiver: 'uhCAkZ4x0cV7bN2mQ5wE8rT1yU4iO7pA0sD3fG6hJ9kL2',
      resource_inventoried_as: 'uhCkkR2b3C4d5E6f7G8h9J0k1L2m3N4p5Q6r7S8t9U0v',
      affects: 'uhCkkR2b3C4d5E6f7G8h9J0k1L2m3N4p5Q6r7S8t9U0v',
      resource_quantity: 1,
      event_time: µs('2026-07-28'),
      ndo_identity_hash: 'uhC0kVX5k7dL2mPqR8sT1uW4xY7zA0bC3dE6fG9h'
    }
  ],
  uhCkkR3c4D5e6F7g8H9j0K1l2M3n4P5q6R7s8T9u0V1w: [
    {
      action: 'Work',
      provider: 'uhCAkQ9s5tG2hJ6kL9zX3cV7bN1mQ4wE7rT0yU3iO6pA9',
      receiver: ME_AGENT_B64,
      resource_inventoried_as: 'uhCkkR3c4D5e6F7g8H9j0K1l2M3n4P5q6R7s8T9u0V1w',
      affects: 'uhCkkR3c4D5e6F7g8H9j0K1l2M3n4P5q6R7s8T9u0V1w',
      resource_quantity: 9,
      event_time: µs('2026-05-19'),
      note: 'Spindle bearing service.',
      ndo_identity_hash: 'uhC0kNb8j3fK9pQ2rS5tU8vW1xY4zA7bC0dE3fG6'
    }
  ]
};

// Pending commitments, keyed by NDO identity hash. EconomicEventCreateForm
// offers these when logging an event, so the fulfilment path is reachable.
export const INITIAL_COMMITMENTS: Record<string, VfCommitment[]> = {
  'uhC0kNb8j3fK9pQ2rS5tU8vW1xY4zA7bC0dE3fG6': [
    {
      action: 'Use',
      provider: ME_AGENT_B64,
      receiver: 'uhCAkM1p8dR4tY7uI0oP3aS6dF9gH2jK5lZ8xC1vB4nM7',
      resource_inventoried_as: 'uhCkkR3c4D5e6F7g8H9j0K1l2M3n4P5q6R7s8T9u0V1w',
      resource_conforms_to: null,
      input_of: null,
      due_date: µs('2026-09-20'),
      note: 'Two panels of ply for the enclosure.',
      committed_at: µs('2026-09-01'),
      ndo_identity_hash: 'uhC0kNb8j3fK9pQ2rS5tU8vW1xY4zA7bC0dE3fG6'
    }
  ]
};
