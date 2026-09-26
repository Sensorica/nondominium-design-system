// Mock of the Nondominium hApp backend (Sensorica/nondominium@dev, commit 3cbebf0).
// TypeScript port of the handoff's ndo-backend.js, for direction F only.
//
// Every write goes through call(zome, fn, input, asAgent) using the real zome
// and function names, input field names, enums and validation messages. Two
// conductors ('a' on :8888 and 'b' on :8889) hold copies of the DHT; public
// entries gossip between them, PrivateParticipationClaim entries stay on their
// owner's chain. State persists in localStorage under `ndo-backend-v1`.
//
// Differences from the handoff source, all additive:
//   - a fourth scenario, `blank`, seeds nothing. `?fresh=1` loads it, so F can
//     start as a new person with no profile and no group (the scenario picker
//     and the guided steps play the onboarding role).
//   - the gossip timers are cancelled by `dispose()`, so leaving the route
//     does not keep writing to storage.

export const KEY = 'ndo-backend-v1';

// Loose entry payloads: every entry type has its own field set, read by field
// name exactly as the zome structs spell them.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Data = Record<string, any>;

export type AgentKey = 'a' | 'b';

export interface Conductor {
  name: string;
  org: string;
  port: number;
  pubkey: string;
}

export interface Update {
  ts: number;
  author: string;
  fn: string;
  before: Data;
  patch: Data;
}

export interface Entry {
  hash: string;
  type: EntryType;
  data: Data;
  author: string;
  author_last?: string;
  zome: string;
  fn: string;
  ts: number;
  /** Per-conductor DHT view: true once the entry has reached that conductor. */
  held: Record<string, boolean>;
  private: boolean;
  updates: Update[];
}

export interface LogRow {
  id: string;
  ts: number;
  as: string;
  zome: string;
  fn: string;
  input: Data;
  ok?: boolean;
  hash?: string;
  error?: string;
  queued?: boolean;
}

export interface BackendState {
  entries: Record<string, Entry>;
  order: string[];
  log: LogRow[];
  online: Record<string, boolean>;
  persons: Record<string, string>;
  scenario?: string;
}

export type CallResult<T = unknown> = { ok: true; value: T } | { ok: false; error: string };

// Two conductors per scenario. Keys stay 'a' / 'b'; names and ports come from
// the active scenario.
export const CONDUCTORS: Record<string, Conductor> = {};

export const ENUMS = {
  LifecycleStage: ['Ideation', 'Specification', 'Development', 'Prototype', 'Stable', 'Distributed', 'Active', 'Hibernating', 'Deprecated', 'EndOfLife'],
  PropertyRegime: ['Private', 'Commons', 'Collective', 'Pool', 'CommonPool', 'Public', 'Nondominium'],
  ResourceNature: ['Physical', 'Digital', 'Service', 'Hybrid', 'Information'],
  OperationalState: ['Available', 'Reserved', 'InTransit', 'InStorage', 'InMaintenance', 'InUse', 'PendingValidation'],
  VfAction: ['Transfer', 'Move', 'Use', 'Consume', 'Produce', 'Work', 'Modify', 'Combine', 'Separate', 'Raise', 'Lower', 'Cite', 'Accept', 'InitialTransfer', 'AccessForUse', 'TransferCustody'],
  RoleType: ['SimpleAgent', 'AccountableAgent', 'PrimaryAccountableAgent', 'Transport', 'Repair', 'Storage'],
  GovernanceRuleType: ['AccessRequirement', 'UsageLimit', 'TransferCondition', 'MaintenanceSchedule'],
  Accessibility: ['Free', 'Credentialed', 'Gated'],
  TransferType: ['Ownership', 'Custody', 'UseRights', 'Benefit'],
  ParticipationClaimType: ['ResourceCreation', 'ResourceValidation', 'CustodyTransfer', 'CustodyAcceptance', 'MaintenanceCommitmentAccepted', 'MaintenanceFulfillmentCompleted', 'StorageCommitmentAccepted', 'StorageFulfillmentCompleted', 'TransportCommitmentAccepted', 'TransportFulfillmentCompleted', 'GoodFaithTransfer', 'DisputeResolutionParticipation', 'ValidationActivity', 'RuleCompliance', 'EndOfLifeDeclaration', 'EndOfLifeValidation']
} as const;

export type LaneId = 'group' | 'agent' | 'l0' | 'l1' | 'l2' | 'plan' | 'event' | 'ppr';

// Lanes follow the ValueFlows flow left to right: who, what it is, how it is
// governed, the instance, plan, observation, receipts.
export const LANES: readonly { id: LaneId; label: string; dna: string }[] = [
  { id: 'group', label: 'Groups', dna: 'group' },
  { id: 'agent', label: 'Agents', dna: 'nondominium · zome_person' },
  { id: 'l0', label: 'Layer 0 · Identity', dna: 'zome_resource' },
  { id: 'l1', label: 'Layer 1 · Governance', dna: 'zome_resource' },
  { id: 'l2', label: 'Layer 2 · Resources', dna: 'zome_resource' },
  { id: 'plan', label: 'Commitments', dna: 'zome_gouvernance' },
  { id: 'event', label: 'Events & validation', dna: 'zome_gouvernance' },
  { id: 'ppr', label: 'Private receipts', dna: 'zome_gouvernance' }
];

export type RefCategory = 'flow' | 'agents' | 'structure';

export interface TypeSpec {
  lane: LaneId;
  hidden?: boolean;
  private?: boolean;
  title: (d: Data) => string;
  /** [field, category]. flow: value chain; agents: who; structure: NDO / group scoping. */
  refs: readonly (readonly [string, RefCategory])[];
}

export const TYPES = {
  GroupProfile: { lane: 'group', title: (d) => d.name, refs: [] },
  GroupMembership: { lane: 'group', hidden: true, title: () => 'Membership', refs: [['group_hash', 'structure']] },
  NdoAnchor: { lane: 'group', title: (d) => d.name, refs: [['group_hash', 'structure'], ['identity_action_hash', 'structure']] },
  Person: { lane: 'agent', title: (d) => d.name, refs: [] },
  PersonRole: { lane: 'agent', title: (d) => d.role_name, refs: [['person', 'agents']] },
  NondominiumIdentity: { lane: 'l0', title: (d) => d.name, refs: [['successor_ndo_hash', 'structure']] },
  ResourceSpecification: { lane: 'l1', title: (d) => d.name, refs: [['ndo_identity_hash', 'structure']] },
  GovernanceRule: { lane: 'l1', title: (d) => d.rule_type, refs: [['specification_hash', 'structure'], ['ndo_identity_hash', 'structure']] },
  EconomicResource: { lane: 'l2', title: (d) => d.label, refs: [['conforms_to', 'flow'], ['custodian_person', 'agents']] },
  Commitment: { lane: 'plan', title: (d) => d.action, refs: [['resource_inventoried_as', 'flow'], ['provider_person', 'agents'], ['receiver_person', 'agents']] },
  Claim: { lane: 'plan', title: () => 'Claim', refs: [['fulfills', 'flow']] },
  EconomicEvent: { lane: 'event', title: (d) => d.action, refs: [['resource_inventoried_as', 'flow'], ['provider_person', 'agents'], ['receiver_person', 'agents']] },
  ValidationReceipt: { lane: 'event', title: (d) => d.validation_type, refs: [['validated_item', 'flow']] },
  PrivateParticipationClaim: { lane: 'ppr', private: true, title: (d) => d.claim_type, refs: [['fulfilled_by', 'flow'], ['fulfills', 'flow']] }
} satisfies Record<string, TypeSpec>;

export type EntryType = keyof typeof TYPES;
export const typeSpec = (t: EntryType): TypeSpec => TYPES[t];

const ALLOWED_NEXT: Record<string, string> = {
  Ideation: 'Specification',
  Specification: 'Development',
  Development: 'Prototype',
  Prototype: 'Stable',
  Stable: 'Distributed',
  Distributed: 'Active'
};

/** The integrity zome's lifecycle table at 3cbebf0. */
export function allowedTransitions(d: Data): string[] {
  const from = d.lifecycle_stage as string;
  if (from === 'EndOfLife') return [];
  if (from === 'Deprecated') return ['EndOfLife'];
  if (from === 'Hibernating') return [d.hibernation_origin, 'Deprecated', 'EndOfLife'].filter(Boolean) as string[];
  return [ALLOWED_NEXT[from], 'Hibernating', 'Deprecated', 'EndOfLife'].filter(Boolean);
}

let seq = 0;
const hash = (p = 'uhCkk') =>
  p + Math.random().toString(36).slice(2, 8) + (seq++).toString(36) + Math.random().toString(36).slice(2, 6);

class BackendError extends Error {
  backend = true;
}
const err = (m: string): never => {
  throw new BackendError(m);
};

function blank(): BackendState {
  return { entries: {}, order: [], log: [], online: { a: true, b: true }, persons: {} };
}
function setConductors(sc: Scenario) {
  for (const k of Object.keys(CONDUCTORS)) delete CONDUCTORS[k];
  Object.assign(CONDUCTORS, sc.agents);
}

type Caller = (zome: string, fn: string, input: Data, as: AgentKey) => string;

export interface Scenario {
  id: string;
  title: string;
  story: string | null;
  agents: Record<AgentKey, Conductor>;
  summary: string;
  tries: string[];
  seed: (c: Caller) => void;
}

// Scenarios follow the user stories in documentation/Applications/user-story/
// that the v0.1 backend supports end to end. Text is the handoff's, verbatim.
const R = (type: string, x: Data) => ({ type, ...x });
export const SCENARIOS: Record<string, Scenario> = {
  equipment: {
    id: 'equipment',
    title: 'Equipment sharing between two organisations',
    story: 'user-story-ERP-bridge.md',
    agents: { a: { name: 'Sarah', org: 'Sensorica', port: 8888, pubkey: 'uhCAkS4r4hSnsrc' }, b: { name: 'Marco', org: 'FabLab Montréal', port: 8889, pubkey: 'uhCAkM4rc0FbLb' } },
    summary: 'Sarah (Sensorica, custodian) lends a modified Proxxon MF70 CNC machine to Marco (FabLab, Transport + Repair) for two weeks of prototype production.',
    tries: [
      "Phase 2 · As Sarah, validate Marco's AccessForUse commitment (create_validation_receipt).",
      'Phase 3 · As Sarah, set the CNC machine to Reserved, then InTransit.',
      'Phase 4 · As Sarah, transfer custody to Marco. Both get a PPR, each on their own chain.',
      'Phase 5–6 · As Marco, log a Use event, fulfil the commitment, then transfer custody back to Sarah.'
    ],
    seed(c) {
      c('zome_person', 'create_person', { name: 'Sarah', bio: 'Resource Coordinator, Sensorica' }, 'a');
      c('zome_person', 'create_person', { name: 'Marco', bio: 'Technical Manager, FabLab Montréal' }, 'b');
      c('zome_person', 'assign_person_role', { role_name: 'PrimaryAccountableAgent' }, 'a');
      for (const r of ['AccountableAgent', 'Transport', 'Repair']) c('zome_person', 'assign_person_role', { role_name: r }, 'b');
      const g = c('zome_group', 'create_group', { name: 'Sensorica', description: 'Open value network, Montréal' }, 'a');
      c('zome_group', 'create_group', { name: 'FabLab Montréal', description: 'Partner fabrication lab' }, 'b');
      c('zome_group', 'join_group', { group_hash: g }, 'b');
      const n = c('zome_resource', 'create_ndo', { name: 'CNC Machine · Proxxon MF70', property_regime: 'Pool', resource_nature: 'Physical', lifecycle_stage: 'Ideation', description: 'Modified desktop CNC mill shared with partner organisations.' }, 'a');
      for (const st of ['Specification', 'Development', 'Prototype', 'Stable', 'Distributed', 'Active']) c('zome_resource', 'update_lifecycle_stage', { original_action_hash: n, new_stage: st }, 'a');
      c('zome_group', 'create_ndo_anchor', { group_hash: g, identity_action_hash: n }, 'a');
      const sp = c('zome_resource', 'create_resource_specification', { name: 'Desktop CNC mill', description: 'Proxxon MF70, modified. Requires certified operators and facility insurance.', category: 'equipment', ndo_identity_hash: n }, 'a');
      c('zome_resource', 'create_governance_rule', { ndo_identity_hash: n, specification_hash: sp, rule_data: R('AccessRequirement', { accessibility: 'Credentialed', required_role: 'Transport', min_affiliation: null }) }, 'a');
      c('zome_resource', 'create_governance_rule', { ndo_identity_hash: n, specification_hash: sp, rule_data: R('TransferCondition', { transfer_type: 'Custody', requires_validation: true, validator_role: 'PrimaryAccountableAgent' }) }, 'a');
      c('zome_resource', 'create_governance_rule', { ndo_identity_hash: n, specification_hash: sp, rule_data: R('UsageLimit', { max_duration_hours: 336, max_quantity_per_period: null, period_days: 30 }) }, 'a');
      const r = c('zome_resource', 'create_economic_resource', { spec_hash: sp, label: 'Proxxon MF70 #1', quantity: 1, unit: 'machine', current_location: 'Sensorica Workshop, Montréal' }, 'a');
      c('zome_gouvernance', 'create_validation_receipt', { validated_item: r, validation_type: 'resource_approval', approved: true }, 'b');
      c('zome_resource', 'update_operational_state', { resource_hash: r, new_operational_state: 'Available' }, 'a');
      c('zome_gouvernance', 'propose_commitment', { action: 'AccessForUse', resource_hash: r, provider: 'a', note: 'Prototype production, 2 weeks. 48 h transport notice.', ndo_identity_hash: n }, 'b');
    }
  },
  science: {
    id: 'science',
    title: 'Open science: shared laboratory equipment',
    story: 'user-story-open-science.md',
    agents: { a: { name: 'Chen Wei', org: 'Advanced Materials Research Lab', port: 8888, pubkey: 'uhCAkCh3nW31Lab' }, b: { name: 'Elena', org: 'University research team', port: 8889, pubkey: 'uhCAkEl3n4Rdrgz' } },
    summary: 'Professor Chen Wei (lab manager, custodian) grants Dr. Elena Rodriguez two weeks on the CEM-3000 cryogenic electron microscope for climate research.',
    tries: [
      "Phase 2 · As Chen Wei, validate Elena's AccessForUse commitment (protocol approval).",
      'Phase 3 · As Chen Wei, set the microscope to Reserved.',
      'Phase 4 · As Elena, try update_operational_state(InUse). It fails: only the custodian may change state.',
      'Phase 5 · As Chen Wei, fulfil the commitment. Elena receives her PPR on her own chain.'
    ],
    seed(c) {
      c('zome_person', 'create_person', { name: 'Chen Wei', bio: 'Laboratory Manager' }, 'a');
      c('zome_person', 'create_person', { name: 'Elena', bio: 'Research Director, climate research' }, 'b');
      c('zome_person', 'assign_person_role', { role_name: 'PrimaryAccountableAgent' }, 'a');
      c('zome_person', 'assign_person_role', { role_name: 'Repair' }, 'a');
      c('zome_person', 'assign_person_role', { role_name: 'AccountableAgent' }, 'b');
      const g = c('zome_group', 'create_group', { name: 'Open Science Network', description: 'Shared research infrastructure' }, 'a');
      c('zome_group', 'join_group', { group_hash: g }, 'b');
      const n = c('zome_resource', 'create_ndo', { name: 'Cryogenic Electron Microscope CEM-3000', property_regime: 'Pool', resource_nature: 'Physical', lifecycle_stage: 'Ideation', description: 'Cryo-EM at the Advanced Materials Research Lab. Research certification and protocol approval required.' }, 'a');
      for (const st of ['Specification', 'Development', 'Prototype', 'Stable', 'Distributed', 'Active']) c('zome_resource', 'update_lifecycle_stage', { original_action_hash: n, new_stage: st }, 'a');
      c('zome_group', 'create_ndo_anchor', { group_hash: g, identity_action_hash: n }, 'a');
      const sp = c('zome_resource', 'create_resource_specification', { name: 'Cryogenic electron microscope', description: 'Minimum 2-week advance booking. Usage is logged.', category: 'laboratory', ndo_identity_hash: n }, 'a');
      c('zome_resource', 'create_governance_rule', { ndo_identity_hash: n, specification_hash: sp, rule_data: R('AccessRequirement', { accessibility: 'Gated', required_role: 'AccountableAgent', min_affiliation: 'research institution' }) }, 'a');
      c('zome_resource', 'create_governance_rule', { ndo_identity_hash: n, specification_hash: sp, rule_data: R('UsageLimit', { max_duration_hours: 80, max_quantity_per_period: null, period_days: 14 }) }, 'a');
      c('zome_resource', 'create_governance_rule', { ndo_identity_hash: n, specification_hash: sp, rule_data: R('MaintenanceSchedule', { interval_days: 30, required_role: 'Repair' }) }, 'a');
      const r = c('zome_resource', 'create_economic_resource', { spec_hash: sp, label: 'CEM-3000', quantity: 1, unit: 'instrument', current_location: 'Advanced Materials Research Lab, MIT' }, 'a');
      c('zome_gouvernance', 'create_validation_receipt', { validated_item: r, validation_type: 'resource_approval', approved: true }, 'b');
      c('zome_resource', 'update_operational_state', { resource_hash: r, new_operational_state: 'Available' }, 'a');
      c('zome_gouvernance', 'propose_commitment', { action: 'AccessForUse', resource_hash: r, provider: 'a', note: 'Climate research, 2 weeks of cryo-EM sessions.', ndo_identity_hash: n }, 'b');
    }
  },
  art: {
    id: 'art',
    title: 'ArtCoin: artwork circulating through venues',
    story: 'user-story-artcoin.md',
    agents: { a: { name: 'Maya', org: 'Independent artist', port: 8888, pubkey: 'uhCAkM4y4Rdrgz' }, b: { name: 'Jean-Pierre', org: 'Café Dubois', port: 8889, pubkey: 'uhCAkJPDub0isC' } },
    summary: 'Maya Rodriguez registers her painting "Urban Rhythms". Jean-Pierre Dubois wants to display it in his café for three months.',
    tries: [
      'Phase 3 · As Jean-Pierre, validate the artwork. Then, as Maya, set it from PendingValidation to Available.',
      "Phase 3 · As Maya, validate Jean-Pierre's AccessForUse commitment.",
      'Phase 4 · As Maya, fulfil the commitment. Custody moves to Jean-Pierre, with CustodyTransfer and CustodyAcceptance PPRs.',
      'Phase 5 · As Jean-Pierre, set the painting to InUse. As Maya, the same call fails: she is no longer custodian.'
    ],
    seed(c) {
      c('zome_person', 'create_person', { name: 'Maya', bio: 'Independent visual artist' }, 'a');
      c('zome_person', 'create_person', { name: 'Jean-Pierre', bio: 'Owner, Café Dubois' }, 'b');
      c('zome_person', 'assign_person_role', { role_name: 'AccountableAgent' }, 'a');
      c('zome_person', 'assign_person_role', { role_name: 'PrimaryAccountableAgent' }, 'b');
      const g = c('zome_group', 'create_group', { name: 'Artcoin Montréal', description: 'Artists, venues and art lovers' }, 'a');
      c('zome_group', 'join_group', { group_hash: g }, 'b');
      const n = c('zome_resource', 'create_ndo', { name: 'Urban Rhythms', property_regime: 'Private', resource_nature: 'Physical', lifecycle_stage: 'Ideation', description: 'Oil on canvas, 36 × 48 in. 70% artist commission on sales, $40/month rental, smoke-free display.' }, 'a');
      for (const st of ['Specification', 'Development', 'Prototype', 'Stable', 'Distributed', 'Active']) c('zome_resource', 'update_lifecycle_stage', { original_action_hash: n, new_stage: st }, 'a');
      c('zome_group', 'create_ndo_anchor', { group_hash: g, identity_action_hash: n }, 'a');
      const sp = c('zome_resource', 'create_resource_specification', { name: 'Oil painting · 2025 collection', description: 'Care: no direct sunlight, smoke-free environment.', category: 'artwork', ndo_identity_hash: n }, 'a');
      c('zome_resource', 'create_governance_rule', { ndo_identity_hash: n, specification_hash: sp, rule_data: R('AccessRequirement', { accessibility: 'Credentialed', required_role: 'AccountableAgent', min_affiliation: null }) }, 'a');
      c('zome_resource', 'create_governance_rule', { ndo_identity_hash: n, specification_hash: sp, rule_data: R('UsageLimit', { max_duration_hours: null, max_quantity_per_period: null, period_days: 90 }) }, 'a');
      c('zome_resource', 'create_governance_rule', { ndo_identity_hash: n, specification_hash: sp, rule_data: R('TransferCondition', { transfer_type: 'Custody', requires_validation: true, validator_role: null }) }, 'a');
      const r = c('zome_resource', 'create_economic_resource', { spec_hash: sp, label: 'Urban Rhythms · 36×48 in', quantity: 1, unit: 'piece', current_location: "Maya's studio, Montréal" }, 'a');
      c('zome_gouvernance', 'propose_commitment', { action: 'TransferCustody', resource_hash: r, provider: 'a', note: 'Café display, 3 months', ndo_identity_hash: n }, 'b');
    }
  },
  // Not in the handoff: the empty DHT `?fresh=1` starts from. Two conductors,
  // no profile, no group; the guided steps walk the onboarding path through
  // the same zome calls.
  blank: {
    id: 'blank',
    title: 'Start from nothing: a new person',
    story: null,
    agents: { a: { name: 'Conductor a', org: 'New person', port: 8888, pubkey: 'uhCAkN3wP3rs0n' }, b: { name: 'Conductor b', org: 'A peer', port: 8889, pubkey: 'uhCAkP33rN0de' } },
    summary: 'An empty DHT. Nobody has a profile and there is no group yet. Build your first shared resource from scratch, one zome call at a time.',
    tries: [
      'Profile · + New entry → Create person, as conductor a (create_person).',
      'Group · + New entry → Create group. Then, as conductor b, create a profile and pick the group card → Join group.',
      'First NDO · + New entry → Create a shared resource, listed in your group (create_ndo → create_ndo_anchor).',
      'Next · pick the shared resource card → Add a kind of item, then Add an item, and watch conductor b receive it.'
    ],
    seed() {}
  }
};

export const SCENARIO_ORDER = ['equipment', 'science', 'art', 'blank'] as const;

export interface ReputationSummary {
  total_claims: number;
  custody_claims: number;
  service_claims: number;
  governance_claims: number;
  creation_claims: number;
  end_of_life_claims: number;
}

export interface Backend {
  readonly state: BackendState;
  subscribe(f: (s: BackendState) => void): () => void;
  call<T = unknown>(zome: string, fn: string, input: Data, as: AgentKey): CallResult<T>;
  setOnline(a: string, on: boolean): void;
  reset(id?: string): void;
  scenarios: Record<string, Scenario>;
  personOf(a: string): string | undefined;
  rolesOf(a: string): string[];
  membersOf(g: string): string[];
  claimsOf(c: string): Entry[];
  validationsOf(h: string): Entry[];
  derive_reputation_summary(agent: string): ReputationSummary;
  dispose(): void;
}

export function createBackend({ gossipMs = 1400 }: { gossipMs?: number } = {}): Backend {
  let s: BackendState | null = null;
  try {
    const raw = localStorage.getItem(KEY);
    s = raw ? (JSON.parse(raw) as BackendState) : null;
  } catch {
    s = null;
  }
  const subs = new Set<(s: BackendState) => void>();
  const timers = new Set<ReturnType<typeof setTimeout>>();
  const later = (fn: () => void, ms: number) => {
    const t = setTimeout(() => {
      timers.delete(t);
      fn();
    }, ms);
    timers.add(t);
  };
  const st = (): BackendState => s as BackendState;
  const save = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch {
      // Private mode or full storage: the session still works in memory.
    }
    subs.forEach((f) => f(st()));
  };
  let instant = false;

  const others = (a: string) => Object.keys(CONDUCTORS).filter((k) => k !== a);
  const gossip = (h: string) => {
    const e = st().entries[h];
    if (!e || e.private) return;
    for (const a of others(e.author)) {
      if (instant) {
        e.held[a] = true;
        continue;
      }
      e.held[a] = false;
      if (st().online[a] && st().online[e.author])
        later(() => {
          if (st().online[a] && st().online[e.author]) {
            e.held[a] = true;
            save();
          }
        }, gossipMs + Math.random() * 600);
    }
  };
  const commit = (type: EntryType, data: Data, author: string, zome: string, fn: string) => {
    const h = hash();
    const spec: TypeSpec = TYPES[type];
    const e: Entry = { hash: h, type, data, author, zome, fn, ts: Date.now(), held: { [author]: true }, private: !!spec.private, updates: [] };
    st().entries[h] = e;
    st().order.push(h);
    gossip(h);
    return h;
  };
  const update = (h: string, patch: Data, author: string, _zome: string, fn: string) => {
    const e = st().entries[h];
    e.updates.push({ ts: Date.now(), author, fn, before: Object.fromEntries(Object.keys(patch).map((k) => [k, e.data[k]])), patch });
    Object.assign(e.data, patch);
    e.author_last = author;
    e.ts = Date.now();
    e.held = { ...e.held, [author]: true };
    gossip(h);
    return hash('uhCkkU');
  };
  const get = (h: string | null | undefined, type?: EntryType): Entry => {
    const e = h ? st().entries[h] : undefined;
    if (!e || (type && e.type !== type)) return err(type + ' not found for hash ' + (h || 'none').slice(0, 12) + '…');
    return e;
  };
  const all = () => st().order.map((h) => st().entries[h]);
  const personOf = (a: string): string | undefined => st().persons[a];
  const needPerson = (a: string) => personOf(a) || err('No Person profile for this agent. Call create_person first.');
  const rolesOf = (a: string) => all().filter((e) => e.type === 'PersonRole' && e.data.assigned_to === a).map((e) => e.data.role_name as string);
  const membersOf = (g: string) => all().filter((e) => e.type === 'GroupMembership' && e.data.group_hash === g).map((e) => e.data.agent as string);
  const claimsOf = (c: string) => all().filter((e) => e.type === 'Claim' && e.data.fulfills === c);
  const validationsOf = (h: string) => all().filter((e) => e.type === 'ValidationReceipt' && e.data.validated_item === h);
  const inEnum = (list: readonly string[], v: unknown) => list.includes(v as string);

  const H: Record<string, (i: Data, a: string) => string | string[]> = {
    // ─── zome_person ───
    'zome_person.create_person'(i, a) {
      if (!i.name || !String(i.name).trim()) err('Person name cannot be empty');
      if (personOf(a)) err('A Person already exists for this agent. Use update_person.');
      const h = commit('Person', { name: String(i.name).trim(), bio: i.bio || null, avatar_url: null, agent: a }, a, 'zome_person', 'create_person');
      st().persons[a] = h;
      return h;
    },
    'zome_person.assign_person_role'(i, a) {
      needPerson(a);
      if (!inEnum(ENUMS.RoleType, i.role_name)) err('Invalid role_name: ' + i.role_name);
      const target = i.assigned_to || a;
      if (!personOf(target)) err('Target agent has no Person profile');
      if (rolesOf(target).includes(i.role_name)) err('Role ' + i.role_name + ' already assigned');
      return commit('PersonRole', { role_name: i.role_name, description: i.description || null, assigned_to: target, assigned_by: a, person: personOf(target) }, a, 'zome_person', 'assign_person_role');
    },
    // ─── lobby / group DNA ───
    'zome_group.create_group'(i, a) {
      if (!i.name || !String(i.name).trim()) err('Group name cannot be empty');
      if (String(i.name).length > 100) err('Group name too long (max 100 characters)');
      const h = commit('GroupProfile', { name: String(i.name).trim(), description: i.description || null, network_seed: hash('seed-') }, a, 'zome_group', 'create_group');
      commit('GroupMembership', { group_hash: h, role: null, agent: a }, a, 'zome_group', 'join_group');
      return h;
    },
    'zome_group.join_group'(i, a) {
      get(i.group_hash, 'GroupProfile');
      if (membersOf(i.group_hash).includes(a)) err('Already a member of this group');
      return commit('GroupMembership', { group_hash: i.group_hash, role: null, agent: a }, a, 'zome_group', 'join_group');
    },
    'zome_group.create_ndo_anchor'(i, a) {
      const g = get(i.group_hash, 'GroupProfile');
      const n = get(i.identity_action_hash, 'NondominiumIdentity');
      if (!membersOf(g.hash).includes(a)) err('Only group members can anchor NDOs in this group');
      const d = n.data;
      return commit('NdoAnchor', { group_hash: g.hash, name: d.name, description: d.description, ndo_dna_hash: 'uhC0k' + n.hash.slice(5, 14), network_seed: hash('seed-'), identity_action_hash: n.hash, initiator: d.initiator, lifecycle_stage: d.lifecycle_stage, property_regime: d.property_regime, resource_nature: d.resource_nature }, a, 'zome_group', 'create_ndo_anchor');
    },
    // ─── zome_resource: Layer 0 ───
    'zome_resource.create_ndo'(i, a) {
      if (!i.name || !String(i.name).trim()) err('Name cannot be empty');
      for (const [k, en] of [
        ['property_regime', 'PropertyRegime'],
        ['resource_nature', 'ResourceNature'],
        ['lifecycle_stage', 'LifecycleStage']
      ] as const)
        if (!inEnum(ENUMS[en], i[k])) err('Invalid ' + k);
      return commit('NondominiumIdentity', { name: String(i.name).trim(), initiator: a, property_regime: i.property_regime, resource_nature: i.resource_nature, lifecycle_stage: i.lifecycle_stage || 'Ideation', description: i.description || null, rivalry_override: i.rivalry_override || null, successor_ndo_hash: null, hibernation_origin: null }, a, 'zome_resource', 'create_ndo');
    },
    'zome_resource.update_lifecycle_stage'(i, a) {
      const n = get(i.original_action_hash, 'NondominiumIdentity');
      const d = n.data;
      if (d.initiator !== a) err('NotAuthor: only the initiator may advance the lifecycle stage');
      if (i.new_stage === 'Deprecated' && !i.successor_ndo_hash) err('Transitioning to Deprecated requires successor_ndo_hash (REQ-NDO-LC-06)');
      if (!allowedTransitions(d).includes(i.new_stage)) err('Invalid lifecycle transition ' + d.lifecycle_stage + ' → ' + i.new_stage);
      if (i.new_stage === 'Deprecated') get(i.successor_ndo_hash, 'NondominiumIdentity');
      const patch: Data = { lifecycle_stage: i.new_stage };
      if (i.new_stage === 'Hibernating') patch.hibernation_origin = d.lifecycle_stage;
      if (d.lifecycle_stage === 'Hibernating' || ['Deprecated', 'EndOfLife'].includes(i.new_stage)) patch.hibernation_origin = null;
      if (i.new_stage === 'Deprecated') patch.successor_ndo_hash = i.successor_ndo_hash;
      const r = update(n.hash, patch, a, 'zome_resource', 'update_lifecycle_stage');
      // Group anchors cache lifecycle_stage; refresh_ndo_anchor_lifecycle_stage keeps them in sync.
      all()
        .filter((e) => e.type === 'NdoAnchor' && e.data.identity_action_hash === n.hash)
        .forEach((e) => update(e.hash, { lifecycle_stage: i.new_stage }, a, 'zome_group', 'refresh_ndo_anchor_lifecycle_stage'));
      return r;
    },
    // ─── zome_resource: Layer 1 ───
    'zome_resource.create_resource_specification'(i, a) {
      needPerson(a);
      if (!i.name || !String(i.name).trim()) err('Specification name cannot be empty');
      get(i.ndo_identity_hash, 'NondominiumIdentity');
      return commit('ResourceSpecification', { name: String(i.name).trim(), description: i.description || '', category: i.category || 'equipment', tags: [], ndo_identity_hash: i.ndo_identity_hash }, a, 'zome_resource', 'create_resource_specification');
    },
    'zome_resource.create_governance_rule'(i, a) {
      const n = get(i.ndo_identity_hash, 'NondominiumIdentity');
      const rd: Data = i.rule_data || {};
      if (!inEnum(ENUMS.GovernanceRuleType, rd.type)) err('Invalid RuleData variant');
      if (rd.type === 'MaintenanceSchedule' && !(rd.interval_days > 0)) err('MaintenanceSchedule.interval_days must be > 0');
      if (i.specification_hash) get(i.specification_hash, 'ResourceSpecification');
      return commit('GovernanceRule', { rule_type: rd.type, rule_data: rd, enforced_by: i.enforced_by || null, ndo_identity_hash: n.hash, specification_hash: i.specification_hash || null, property_regime: n.data.property_regime, resource_nature: n.data.resource_nature }, a, 'zome_resource', 'create_governance_rule');
    },
    // ─── zome_resource: Layer 2 ───
    'zome_resource.create_economic_resource'(i, a) {
      const p = needPerson(a);
      const sp = get(i.spec_hash, 'ResourceSpecification');
      if (!(i.quantity > 0)) err('Quantity must be positive');
      if (!i.unit) err('Unit cannot be empty');
      return commit('EconomicResource', { label: i.label || sp.data.name, conforms_to: sp.hash, quantity: +i.quantity, unit: i.unit, custodian: a, custodian_person: p, current_location: i.current_location || null, operational_state: 'PendingValidation', ndo_identity_hash: sp.data.ndo_identity_hash }, a, 'zome_resource', 'create_economic_resource');
    },
    'zome_resource.update_operational_state'(i, a) {
      const r = get(i.resource_hash, 'EconomicResource');
      if (r.data.custodian !== a) err('Only the current custodian can update operational state');
      if (!inEnum(ENUMS.OperationalState, i.new_operational_state)) err('Invalid OperationalState');
      return update(r.hash, { operational_state: i.new_operational_state }, a, 'zome_resource', 'update_operational_state');
    },
    'zome_resource.transfer_custody'(i, a) {
      const r = get(i.resource_hash, 'EconomicResource');
      if (r.data.custodian !== a) err('Only the current custodian can transfer custody');
      if (i.new_custodian === a) err('New custodian must differ from current custodian');
      const p = needPerson(i.new_custodian);
      return update(r.hash, { custodian: i.new_custodian, custodian_person: p }, a, 'zome_resource', 'transfer_custody');
    },
    // ─── zome_gouvernance ───
    'zome_gouvernance.propose_commitment'(i, a) {
      needPerson(a);
      needPerson(i.provider);
      if (!inEnum(ENUMS.VfAction, i.action)) err('Invalid VfAction');
      get(i.ndo_identity_hash, 'NondominiumIdentity');
      if (i.resource_hash) get(i.resource_hash, 'EconomicResource');
      return commit('Commitment', { action: i.action, provider: i.provider, receiver: a, provider_person: personOf(i.provider), receiver_person: personOf(a), resource_inventoried_as: i.resource_hash || null, resource_conforms_to: i.resource_spec_hash || null, due_date: i.due_date || Date.now() + 864e5, note: i.note || null, ndo_identity_hash: i.ndo_identity_hash }, a, 'zome_gouvernance', 'propose_commitment');
    },
    'zome_gouvernance.log_economic_event'(i, a) {
      needPerson(i.provider);
      needPerson(i.receiver);
      if (!inEnum(ENUMS.VfAction, i.action)) err('Invalid VfAction');
      const r = get(i.resource_inventoried_as, 'EconomicResource');
      return commit('EconomicEvent', { action: i.action, provider: i.provider, receiver: i.receiver, provider_person: personOf(i.provider), receiver_person: personOf(i.receiver), resource_inventoried_as: r.hash, affects: r.hash, resource_quantity: +i.resource_quantity || r.data.quantity, event_time: Date.now(), note: i.note || null, ndo_identity_hash: r.data.ndo_identity_hash }, a, 'zome_gouvernance', 'log_economic_event');
    },
    'zome_gouvernance.claim_commitment'(i, a) {
      get(i.commitment_hash, 'Commitment');
      if (claimsOf(i.commitment_hash).length) err('Commitment already claimed');
      // Backend today (commitment.rs): fulfilled_by is set to the commitment hash, not the event (TODO in source).
      return commit('Claim', { fulfills: i.commitment_hash, fulfilled_by: i.commitment_hash, claimed_at: Date.now(), note: i.fulfillment_note || null, event_hash_ui: i.event_hash || null }, a, 'zome_gouvernance', 'claim_commitment');
    },
    'zome_gouvernance.create_validation_receipt'(i, a) {
      const it = get(i.validated_item);
      if (it.author === a && it.type === 'EconomicResource') err('An agent cannot validate their own resource');
      if (validationsOf(it.hash).some((v) => v.author === a)) err('You already validated this item');
      return commit('ValidationReceipt', { validator: a, validated_item: it.hash, validation_type: i.validation_type || 'resource_approval', approved: i.approved !== false, notes: i.notes || null, validated_at: Date.now() }, a, 'zome_gouvernance', 'create_validation_receipt');
    },
    'zome_gouvernance.issue_participation_receipts'(i) {
      const ev = get(i.fulfilled_by, 'EconomicEvent');
      const mk = (owner: string, counterparty: string, claim_type: string) =>
        commit('PrivateParticipationClaim', { fulfills: i.fulfills || null, fulfilled_by: ev.hash, claimed_at: Date.now(), claim_type, counterparty, resource_hash: ev.data.resource_inventoried_as, performance_metrics: { timeliness: 1, quality: 1, reliability: 1, communication: 1, overall_satisfaction: 1 }, bilateral_signature: 'ed25519:' + hash('').slice(0, 10), owner }, owner, 'zome_gouvernance', 'issue_participation_receipts');
      const out = [mk(i.provider, i.receiver, i.provider_claim_type)];
      if (i.receiver_claim_type) out.push(mk(i.receiver, i.provider, i.receiver_claim_type));
      return out;
    }
  };

  function call<T = unknown>(zome: string, fn: string, input: Data, as: AgentKey): CallResult<T> {
    const key = zome + '.' + fn;
    const row: LogRow = { id: 'c' + seq++, ts: Date.now(), as, zome, fn, input };
    try {
      if (!H[key]) err('Unknown zome function ' + key);
      if (!st().online[as] && !instant) row.queued = true; // source chain commit still succeeds offline; gossip waits
      const v = H[key](input, as);
      row.ok = true;
      row.hash = Array.isArray(v) ? v[0] : v;
      st().log.unshift(row);
      if (st().log.length > 200) st().log.pop();
      save();
      return { ok: true, value: v as T };
    } catch (e) {
      row.ok = false;
      row.error = e instanceof Error ? e.message : String(e);
      st().log.unshift(row);
      save();
      return { ok: false, error: row.error };
    }
  }

  function setOnline(a: string, on: boolean) {
    st().online[a] = on;
    if (on)
      st().order.forEach((h) => {
        const e = st().entries[h];
        if (!e.private)
          for (const k of Object.keys(CONDUCTORS))
            if (e.held[k] === false && st().online[e.author] && st().online[k])
              later(() => {
                e.held[k] = true;
                save();
              }, 500 + Math.random() * 900);
      });
    save();
  }

  function seed(id?: string) {
    const sc = (id && SCENARIOS[id]) || (s?.scenario && SCENARIOS[s.scenario]) || SCENARIOS.equipment;
    for (const t of timers) clearTimeout(t);
    timers.clear();
    s = blank();
    s.scenario = sc.id;
    setConductors(sc);
    instant = true;
    const c: Caller = (z, f, i, a) => {
      const r = call<string>(z, f, i, a);
      if (!r.ok) throw new Error(f + ': ' + r.error);
      return r.value;
    };
    sc.seed(c);
    s.log = [];
    instant = false;
    save();
  }

  if (!s || !s.entries || !s.scenario || !SCENARIOS[s.scenario]) seed('equipment');
  else {
    setConductors(SCENARIOS[s.scenario]);
    // An entry that was still gossiping when the page closed has no timer any
    // more: resume it, as a conductor would on start-up.
    setOnline('a', s.online.a !== false);
  }

  return {
    get state() {
      return st();
    },
    subscribe(f) {
      subs.add(f);
      return () => subs.delete(f);
    },
    call,
    setOnline,
    reset: (id) => seed(id || s?.scenario),
    scenarios: SCENARIOS,
    personOf,
    rolesOf,
    membersOf,
    claimsOf,
    validationsOf,
    // Read-only zome call used by the UI.
    derive_reputation_summary(agent) {
      const mine = all().filter((e) => e.type === 'PrivateParticipationClaim' && e.data.owner === agent);
      const k = (t: string[]) => mine.filter((e) => t.some((x) => String(e.data.claim_type).startsWith(x))).length;
      return {
        total_claims: mine.length,
        custody_claims: k(['Custody', 'GoodFaith']),
        service_claims: k(['Maintenance', 'Storage', 'Transport']),
        governance_claims: k(['Validation', 'Rule', 'Dispute', 'ResourceValidation']),
        creation_claims: k(['ResourceCreation']),
        end_of_life_claims: k(['EndOfLife'])
      };
    },
    dispose() {
      for (const t of timers) clearTimeout(t);
      timers.clear();
      subs.clear();
    }
  };
}
