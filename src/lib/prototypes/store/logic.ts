// The A to E prototype store, as pure logic.
//
// A TypeScript port of the handoff's core.jsx. Nothing here touches Svelte,
// the DOM, storage or timers, so `scripts/check-prototype-rules.ts` runs it
// under bun. `store.svelte.ts` wraps it in a reactive singleton that persists,
// runs the toast lifecycle, and supplies the acting agent.
//
// Every action is `(state, ctx, ...args) => Outcome`: it either fails with the
// backend's error string, or returns the next state plus the writes it made.
// Each action's comment names the zome call it stands for (see
// docs/prototypes/BACKEND.md). The error strings are the handoff's, verbatim;
// the friendly wording for them lives in ../plain.ts.
//
// Scenario data follows docs/prototypes/user-stories/.

import { PLAIN, plain } from '../plain';

// ── Enums, checked against Sensorica/nondominium@3cbebf0 ──────────────────
// LifecycleStage, PropertyRegime, ResourceNature, Rivalry, OperationalState,
// VfAction, NdoLinkType: crates/shared/src/types.rs.
// GovernanceRuleType, Accessibility, TransferType: crates/shared/src/rule_data.rs.
// RoleType: zomes/integrity/zome_person/src/lib.rs.
// ParticipationClaimType: zomes/integrity/zome_gouvernance/src/ppr.rs.

export const STAGES = [
  'Ideation',
  'Specification',
  'Development',
  'Prototype',
  'Stable',
  'Distributed',
  'Active',
  'Hibernating',
  'Deprecated',
  'EndOfLife'
] as const;
export type LifecycleStage = (typeof STAGES)[number];

export const ENUM = {
  regime: ['Nondominium', 'Commons', 'Collective', 'Pool', 'CommonPool', 'Public', 'Private'],
  nature: ['Physical', 'Digital', 'Service', 'Hybrid', 'Information'],
  opstate: ['Available', 'Reserved', 'InTransit', 'InStorage', 'InMaintenance', 'InUse', 'PendingValidation'],
  role: ['SimpleAgent', 'AccountableAgent', 'PrimaryAccountableAgent', 'Transport', 'Repair', 'Storage'],
  rule: ['AccessRequirement', 'UsageLimit', 'TransferCondition', 'MaintenanceSchedule'],
  action: ['AccessForUse', 'TransferCustody', 'Use', 'Work', 'Move', 'Modify', 'Cite'],
  accessibility: ['Free', 'Credentialed', 'Gated'],
  transfer: ['Ownership', 'Custody', 'UseRights', 'Benefit']
} as const;

export type PropertyRegime = (typeof ENUM.regime)[number];
export type ResourceNature = (typeof ENUM.nature)[number];
export type OperationalState = (typeof ENUM.opstate)[number];
export type RoleType = (typeof ENUM.role)[number];
export type RuleType = (typeof ENUM.rule)[number];
export type VfAction = (typeof ENUM.action)[number];
export type Rivalry = 'Rivalrous' | 'NonRivalrous';

export const LINK_TYPES = ['Component', 'DerivedFrom', 'Supersedes'] as const;
export type NdoLinkType = (typeof LINK_TYPES)[number];

export type ClaimType =
  | 'ResourceCreation'
  | 'ResourceValidation'
  | 'CustodyTransfer'
  | 'CustodyAcceptance'
  | 'MaintenanceFulfillmentCompleted'
  | 'TransportFulfillmentCompleted'
  | 'RuleCompliance';

/** Receipt types by fulfilled action: [provider's, receiver's]. */
export const PPR_TYPES: Record<VfAction, readonly [ClaimType, ClaimType | null]> = {
  TransferCustody: ['CustodyTransfer', 'CustodyAcceptance'],
  AccessForUse: ['RuleCompliance', 'RuleCompliance'],
  Move: ['TransportFulfillmentCompleted', null],
  Work: ['MaintenanceFulfillmentCompleted', null],
  Modify: ['MaintenanceFulfillmentCompleted', null],
  Use: ['RuleCompliance', null],
  Cite: ['RuleCompliance', null]
};

// ── Agents ────────────────────────────────────────────────────────────────

/** The prototype's own agent. A fresh start keeps the key; only the profile
 *  is new. */
export const ME_ID = 'tib';
export const DEFAULT_ROLES: RoleType[] = ['AccountableAgent', 'Transport', 'Repair'];

export const AGENTS: Readonly<Record<string, string>> = {
  tib: 'Tiberius',
  sar: 'Sarah',
  mar: 'Marco',
  che: 'Chen Wei',
  ele: 'Elena',
  may: 'Maya',
  jp: 'Jean-Pierre',
  mit: 'Dr. Mitchell',
  vas: 'Elena V.',
  mc: 'Marcus',
  dk: 'David',
  sop: 'Sophie',
  mg: 'Maria',
  jc: 'James'
};

// ── State ─────────────────────────────────────────────────────────────────

export interface Profile {
  name: string;
  handle: string;
  bio: string;
  avatar: string;
  private: { email: string; location: string; time_zone: string };
}

export interface Group {
  id: string;
  name: string;
  desc: string;
  invite: string;
}

export interface Ndo {
  id: string;
  name: string;
  group: string;
  stage: LifecycleStage;
  regime: PropertyRegime;
  nature: ResourceNature;
  rivalry: Rivalry;
  initiator: string;
  desc: string;
  hash: string;
  /** Hand-placed field position (A). New NDOs have none. */
  x?: number;
  y?: number;
  hibernation_origin?: LifecycleStage | null;
  successor?: string;
}

/** [type, summary, author]. The author is whoever created the rule
 *  (create_governance_rule); only they may change it (update_governance_rule). */
export type Rule = [RuleType, string, string];
/** [label, OperationalState, custodian] */
export type Instance = [string, OperationalState, string];
export type LinkKind = 'use' | 'cite' | 'hard';
/** [from, to, kind]. A set on that triple: the field (A) keys trails on it. */
export type Link = [string, string, LinkKind];

/** The identity of a link: two links with the same key are the same trail. */
export const linkKey = ([a, b, k]: Link): string => a + '>' + b + ':' + k;

/** Drops repeated (from, to, kind) links, keeping the first. */
export function uniqLinks(links: readonly Link[]): Link[] {
  const seen = new Set<string>();
  return links.filter((l) => {
    const key = linkKey(l);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export type TraceKind = 'commit' | 'work' | 'custody' | 'cite' | 'use' | 'note' | 'lifecycle' | 'rule';
export type TraceStatus = 'queued' | 'signed' | 'gossip' | 'validated';

export interface ReceiptInput {
  text: string;
  ndo: string;
  type: ClaimType;
  with?: string;
}
export interface Receipt extends ReceiptInput {
  id: string;
}

export interface Trace {
  id: string;
  ndo: string;
  agent: string;
  kind: TraceKind;
  text: string;
  note?: string | null;
  /** Minutes ago. Seeded traces carry their age; new ones are 0. */
  ago: number;
  status: TraceStatus;
  hops: string[];
  mine?: boolean;
  /** Receipts this write earns once peers validate it. Held on the trace so a
   *  write made offline still earns them on reconnect. */
  receipts?: ReceiptInput[];
}

export interface Commitment {
  id: string;
  ndo: string;
  action: VfAction;
  provider: string;
  receiver: string;
  inst: number;
  note: string;
  status: 'open' | 'claimed';
  mine?: boolean;
}

export interface HardLink {
  from: string;
  to: string;
  type: NdoLinkType;
}

export interface InviteBundle {
  group: Group;
  ndos: Ndo[];
  rules: Record<string, Rule[]>;
  instances: Record<string, Instance[]>;
  links: Link[];
  traces?: Trace[];
  commitments?: Commitment[];
  hardLinks?: HardLink[];
}

export interface ProtoState {
  profile: Profile | null;
  roles: RoleType[];
  groups: Group[];
  invites: Record<string, InviteBundle>;
  ndos: Ndo[];
  links: Link[];
  traces: Trace[];
  hardLinks: HardLink[];
  validations: Record<string, string[]>;
  rules: Record<string, Rule[]>;
  instances: Record<string, Instance[]>;
  commitments: Commitment[];
  receipts: Receipt[];
  offline: boolean;
}

// ── Seed ──────────────────────────────────────────────────────────────────

export const SEED: ProtoState = {
  profile: {
    name: 'Tiberius',
    handle: 'tibi',
    bio: 'Transport and repair, FabLab network',
    avatar: '',
    private: { email: 'tiberius@fablab.example', location: 'Montréal', time_zone: 'America/Toronto' }
  },
  roles: [...DEFAULT_ROLES],
  groups: [
    { id: 'sen', name: 'Sensorica', desc: 'Open value network, Montréal', invite: 'ndo-invite:sen-4f9q' },
    { id: 'ovn', name: 'Open Value Network', desc: 'Research, art and fabrication commons', invite: 'ndo-invite:ovn-2k7m' }
  ],
  // A group Tiberius has been invited to but not joined yet (food basket user story).
  invites: {
    'ndo-invite:food-7k2p': {
      group: { id: 'food', name: 'Local Food Coop', desc: '8 farms, 3 community kitchens, 2 hubs', invite: 'ndo-invite:food-7k2p' },
      ndos: [
        {
          id: 'seed', name: 'Weekly Organic Baskets', group: 'food', stage: 'Active', regime: 'CommonPool', nature: 'Physical', rivalry: 'Rivalrous', initiator: 'mg',
          desc: "Maria Garcia's weekly harvest, consolidated at the hub by James Chen. Food safety and temperature tracking rules.", hash: 'uhC0hH5jK6lm', x: 320, y: 650
        }
      ],
      rules: { seed: [['AccessRequirement', 'Credentialed · Storage', 'mg'], ['MaintenanceSchedule', '7 d · Repair · cold chain', 'mg']] },
      instances: { seed: [['Harvest baskets · 40', 'Available', 'mg'], ['Refrigerated van', 'InMaintenance', 'jc']] },
      links: [['seed', 'sol', 'use']]
    }
  },
  ndos: [
    { id: 'sol', name: 'CNC Machine · Proxxon MF70', group: 'sen', stage: 'Active', regime: 'Pool', nature: 'Physical', rivalry: 'Rivalrous', initiator: 'sar', desc: 'Modified desktop CNC mill at the Sensorica Workshop, Montréal. Lent to partner FabLabs under certified-operator rules.', hash: 'uhC0kVX5k7dL', x: 330, y: 360 },
    { id: 'sns', name: 'Environmental Sensor Design v3', group: 'ovn', stage: 'Distributed', regime: 'Commons', nature: 'Digital', rivalry: 'NonRivalrous', initiator: 'tib', desc: 'Open design for climate-research sensors, commissioned by Dr. Sarah Mitchell and produced across three makerspaces.', hash: 'uhC0mQ2pT8wa', x: 560, y: 250 },
    { id: 'las', name: 'Cryo-EM CEM-3000', group: 'ovn', stage: 'Active', regime: 'Pool', nature: 'Physical', rivalry: 'Rivalrous', initiator: 'che', desc: 'Cryogenic electron microscope at the Advanced Materials Research Lab. Research certification and protocol approval required.', hash: 'uhC0rJ7xN3ke', x: 640, y: 470 },
    { id: 'cnc', name: 'Urban Rhythms', group: 'ovn', stage: 'Active', regime: 'Private', nature: 'Physical', rivalry: 'Rivalrous', initiator: 'may', desc: 'Oil on canvas by Maya Rodriguez, 36 × 48 in. 70% artist commission, $40/month rental, smoke-free display.', hash: 'uhC0aB4cD9fg', x: 200, y: 560 },
    { id: 'fw', name: 'Urban Canopy', group: 'sen', stage: 'Development', regime: 'Commons', nature: 'Hybrid', rivalry: 'Rivalrous', initiator: 'vas', desc: '12-metre interactive light sculpture, co-produced by four studios. Lead artist Elena Vasquez, fabrication by Marcus Chen.', hash: 'uhC0zZ1yX2wv', x: 720, y: 160 },
    { id: 'mesh', name: 'Fragments of Memory · tour', group: 'ovn', stage: 'Specification', regime: 'Collective', nature: 'Physical', rivalry: 'Rivalrous', initiator: 'dk', desc: "David Kim's photography exhibition touring 5 venues over 6 months, coordinated by Sophie Laurent.", hash: 'uhC0nN7pQ8rs', x: 130, y: 250 }
  ],
  // Economic-event relationships between NDOs (derived from Use / Cite events) plus hard links.
  links: [['sol', 'sns', 'use'], ['las', 'sns', 'cite'], ['fw', 'sol', 'hard'], ['mesh', 'cnc', 'cite'], ['cnc', 'fw', 'cite'], ['sns', 'las', 'hard']],
  traces: [
    { id: 't1', ndo: 'sol', agent: 'mar', kind: 'commit', text: 'asked to borrow it for 2 weeks', note: 'Prototype run at the FabLab. 48 h transport notice works for me.', ago: 30, status: 'validated', hops: ['Marco', 'Sensorica node'] },
    { id: 't2', ndo: 'sol', agent: 'sar', kind: 'work', text: 'approved Marco to hold it', ago: 120, status: 'validated', hops: ['Sarah'] },
    { id: 't3', ndo: 'sol', agent: 'sar', kind: 'custody', text: 'reserved Proxxon MF70 #1 for Marco', ago: 90, status: 'validated', hops: ['Sarah'] },
    { id: 't4', ndo: 'sol', agent: 'sar', kind: 'work', text: 'declared this NDO', ago: 20160, status: 'validated', hops: ['Sarah'] },
    { id: 't5', ndo: 'sns', agent: 'mit', kind: 'commit', text: 'commissioned 12 sensor units', ago: 600, status: 'validated', hops: ['Dr. Mitchell'] },
    { id: 't6', ndo: 'sns', agent: 'tib', kind: 'cite', text: 'published design files v3', ago: 2880, status: 'validated', hops: [] },
    { id: 't7', ndo: 'las', agent: 'ele', kind: 'commit', text: 'asked to borrow it for climate research', note: 'Two weeks of cryo sessions. Protocol attached.', ago: 240, status: 'validated', hops: ['Elena', 'MIT node'] },
    { id: 't8', ndo: 'las', agent: 'che', kind: 'work', text: 'calibrated the microscope', ago: 1440, status: 'validated', hops: ['Chen Wei'] },
    { id: 't9', ndo: 'cnc', agent: 'jp', kind: 'commit', text: 'asked to show it in his café for 3 months', ago: 180, status: 'validated', hops: ['Jean-Pierre'] },
    { id: 't10', ndo: 'cnc', agent: 'may', kind: 'work', text: 'registered Urban Rhythms', ago: 4320, status: 'validated', hops: ['Maya'] },
    { id: 't11', ndo: 'fw', agent: 'mc', kind: 'work', text: 'logged 6 h welding · canopy frame', ago: 300, status: 'validated', hops: ['Marcus'] },
    { id: 't12', ndo: 'fw', agent: 'vas', kind: 'cite', text: 'noted the CNC machine is used to cut panels', ago: 10080, status: 'validated', hops: ['Elena V.'] },
    { id: 't13', ndo: 'mesh', agent: 'sop', kind: 'work', text: 'confirmed 3 of 5 venues', ago: 700, status: 'validated', hops: ['Sophie'] },
    { id: 't14', ndo: 'mesh', agent: 'dk', kind: 'work', text: 'declared the tour', ago: 1440, status: 'validated', hops: ['David'] }
  ],
  // Hard links between NDOs (governance zome NdoHardLink: Component / DerivedFrom / Supersedes).
  hardLinks: [{ from: 'fw', to: 'sol', type: 'Component' }, { from: 'sns', to: 'las', type: 'DerivedFrom' }],
  validations: {},
  rules: {
    // Each rule's author is its NDO's initiator.
    sol: [['AccessRequirement', 'Credentialed · Transport', 'sar'], ['TransferCondition', 'Custody · validated', 'sar'], ['UsageLimit', '336 h / 30 d', 'sar']],
    las: [['AccessRequirement', 'Gated · AccountableAgent', 'che'], ['UsageLimit', '80 h / 14 d', 'che'], ['MaintenanceSchedule', '30 d · Repair', 'che']],
    cnc: [['AccessRequirement', 'Credentialed · AccountableAgent', 'may'], ['UsageLimit', 'no hour limit / 90 d', 'may'], ['TransferCondition', 'Custody · validated', 'may']],
    fw: [['MaintenanceSchedule', '14 d · Repair', 'vas']]
  },
  instances: {
    sol: [['Proxxon MF70 #1', 'Reserved', 'sar']],
    las: [['CEM-3000', 'Available', 'che']],
    cnc: [['Urban Rhythms · 36×48 in', 'PendingValidation', 'may']],
    sns: [['Sensor batch · 12 units', 'InUse', 'tib']],
    fw: [['Steel canopy frame', 'InStorage', 'mc']]
  },
  commitments: [
    { id: 'c1', ndo: 'sol', action: 'AccessForUse', provider: 'sar', receiver: 'mar', inst: 0, note: 'Prototype production, 2 weeks', status: 'open' },
    { id: 'c2', ndo: 'las', action: 'AccessForUse', provider: 'che', receiver: 'ele', inst: 0, note: 'Climate research, 2 weeks', status: 'open' },
    { id: 'c3', ndo: 'cnc', action: 'TransferCustody', provider: 'may', receiver: 'jp', inst: 0, note: 'Café display, 3 months', status: 'open' },
    { id: 'c4', ndo: 'sns', action: 'TransferCustody', provider: 'tib', receiver: 'mit', inst: 0, note: 'Deliver the 12-unit batch for calibration', status: 'open' }
  ],
  receipts: [
    { id: 'r1', text: 'created Environmental Sensor Design v3', ndo: 'sns', type: 'ResourceCreation', with: 'mit' },
    { id: 'r2', text: 'moved the laser cutter to Montréal', ndo: 'sol', type: 'TransportFulfillmentCompleted', with: 'sar' }
  ],
  offline: false
};

/** Seed records the screen map links to when a view needs one. Defined in
 *  the registry, so pages that only need the ids do not import the seed. */
export { EXAMPLE_GROUP, EXAMPLE_NDO } from '../directions';

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

/** The example network, as a fresh copy. */
export const exampleState = (): ProtoState => clone(SEED);

export const DEMO_INVITES = ['ndo-invite:sen-4f9q', 'ndo-invite:ovn-2k7m'] as const;

function packGroup(S: ProtoState, gid: string): InviteBundle {
  const ids = S.ndos.filter((n) => n.group === gid).map((n) => n.id);
  const has = (id: string) => ids.includes(id);
  const pick = <V>(o: Record<string, V>) => Object.fromEntries(Object.entries(o).filter(([k]) => has(k)));
  return {
    group: S.groups.find((g) => g.id === gid)!,
    ndos: S.ndos.filter((n) => has(n.id)),
    rules: pick(S.rules),
    instances: pick(S.instances),
    links: S.links.filter(([a, b]) => has(a) && has(b)),
    traces: S.traces.filter((t) => has(t.ndo)),
    commitments: S.commitments.filter((k) => has(k.ndo)),
    hardLinks: S.hardLinks.filter((h) => has(h.from))
  };
}

/** Fresh start: no profile, no groups. The example groups become invites, so
 *  a new agent walks the whole flow: create_person, then create_group (blank
 *  canvas) or join the example network, then create_ndo, then manage. */
export function freshState(): ProtoState {
  const S = clone(SEED);
  const inv: Record<string, InviteBundle> = {
    'ndo-invite:sen-4f9q': packGroup(S, 'sen'),
    'ndo-invite:ovn-2k7m': packGroup(S, 'ovn')
  };
  inv['ndo-invite:ovn-2k7m'].links = S.links.filter(
    ([a, b]) =>
      S.ndos.some((n) => n.id === a) &&
      S.ndos.some((n) => n.id === b) &&
      !inv['ndo-invite:sen-4f9q'].links.some((l) => l[0] === a && l[1] === b)
  );
  return {
    ...S,
    profile: null,
    roles: ['SimpleAgent'],
    groups: [],
    ndos: [],
    links: [],
    traces: [],
    hardLinks: [],
    validations: {},
    rules: {},
    instances: {},
    commitments: [],
    receipts: [],
    invites: { ...inv, ...S.invites }
  };
}

/** Accept a persisted state if it has the shape this store writes, and heal
 *  what older builds could save: ids made unique again (a crash between two
 *  writes could duplicate one), repeated (from, to, kind) links dropped (an
 *  older hardLink appended a 'hard' link beside an existing one, which crashed
 *  A's field), and rules saved before they carried an author given their NDO's
 *  initiator. Returns null for anything unusable, so the caller falls back to
 *  the seed. */
export function normalizeLoaded(v: unknown, id: (prefix: string) => string): ProtoState | null {
  if (!v || typeof v !== 'object') return null;
  const s = v as Partial<ProtoState>;
  if (!Array.isArray(s.ndos) || !Array.isArray(s.commitments) || !Array.isArray(s.hardLinks)) return null;
  const out = { ...exampleState(), ...s, roles: s.roles ?? [...DEFAULT_ROLES] } as ProtoState;
  for (const k of ['traces', 'receipts', 'commitments'] as const) {
    const seen = new Set<string>();
    out[k] = ((out[k] ?? []) as { id: string }[]).map((x) => {
      const y = seen.has(x.id) ? { ...x, id: x.id + '-' + id('') } : x;
      seen.add(y.id);
      return y;
    }) as never;
  }
  const bundles = Object.values(out.invites ?? {});
  const initiators = new Map([...out.ndos, ...bundles.flatMap((b) => b.ndos ?? [])].map((n) => [n.id, n.initiator]));
  const withAuthors = (rules: Record<string, Rule[]> | undefined): Record<string, Rule[]> =>
    Object.fromEntries(
      Object.entries(rules ?? {}).map(([ndo, list]) => [
        ndo,
        list.map((r): Rule => (r[2] ? r : [r[0], r[1], initiators.get(ndo) ?? '']))
      ])
    );
  out.links = uniqLinks(out.links ?? []);
  out.rules = withAuthors(out.rules);
  out.invites = Object.fromEntries(
    Object.entries(out.invites ?? {}).map(([code, b]) => [code, { ...b, links: uniqLinks(b.links ?? []), rules: withAuthors(b.rules) }])
  );
  return out;
}

// ── Lifecycle: the integrity zome's state machine ─────────────────────────
//
// Mirrors validate_update_nondominium_identity in
// dnas/nondominium/zomes/integrity/zome_resource/src/lib.rs at 3cbebf0:
//   forward chain Ideation → … → Active, no skipping;
//   any non-terminal stage may suspend to Hibernating, recording its origin;
//   Hibernating resumes only to that origin (a missing origin is invalid);
//   any non-terminal stage, Hibernating included, may go to Deprecated
//   (successor required) or EndOfLife;
//   Deprecated exits only to EndOfLife; EndOfLife is terminal.

export const FORWARD: Partial<Record<LifecycleStage, LifecycleStage>> = {
  Ideation: 'Specification',
  Specification: 'Development',
  Development: 'Prototype',
  Prototype: 'Stable',
  Stable: 'Distributed',
  Distributed: 'Active'
};

export function allowedStages(n: Pick<Ndo, 'stage' | 'hibernation_origin'>): LifecycleStage[] {
  if (n.stage === 'EndOfLife') return [];
  if (n.stage === 'Deprecated') return ['EndOfLife'];
  if (n.stage === 'Hibernating') {
    return [...(n.hibernation_origin ? [n.hibernation_origin] : []), 'Deprecated', 'EndOfLife'];
  }
  const next = FORWARD[n.stage];
  return [...(next ? [next] : []), 'Hibernating', 'Deprecated', 'EndOfLife'];
}

/** Stages where an NDO cannot take new items (the zome refuses Layer 1
 *  activation while the NDO is in one of these). */
export const NO_ITEM_STAGES: readonly LifecycleStage[] = ['Ideation', 'Hibernating', 'Deprecated', 'EndOfLife'];

// ── Derived: signals ──────────────────────────────────────────────────────

export type SignalKind = 'fulfil' | 'validate' | 'available' | 'request' | 'maintain';
export type SignalLane = 'hands' | 'eyes' | 'avail';

export interface Signal {
  id: string;
  kind: SignalKind;
  /** Commitment id, "ndo:index" for an item, or the NDO id for maintenance. */
  ref: string;
  ndo: string;
  lane: SignalLane;
  title: string;
  sub: string;
  strength: number;
  verb: string;
  why: string[];
  progress?: [number, number];
}

export function agentName(s: ProtoState, id: string): string {
  if (id === ME_ID) return s.profile ? s.profile.name : 'New agent';
  return AGENTS[id] ?? id;
}

/** Signals are not stored anywhere: they are derived on the client from backed
 *  entries (open commitments, PendingValidation resources, Available
 *  resources, MaintenanceSchedule rules). `dev` switches the wording to the
 *  hApp's own terms. */
export function deriveSignals(s: ProtoState, me: string = ME_ID, dev = false): Signal[] {
  const out: Signal[] = [];
  const nd = (id: string) => s.ndos.find((n) => n.id === id);
  const who = (id: string) => agentName(s, id);
  const roles = s.roles ?? DEFAULT_ROLES;
  for (const k of s.commitments) {
    if (k.status !== 'open' || !nd(k.ndo)) continue;
    const r = (s.instances[k.ndo] ?? [])[k.inst];
    if (k.provider === me || k.receiver === me) {
      const verbFor: Partial<Record<VfAction, string>> = { TransferCustody: 'Hand over', AccessForUse: 'Lend', Move: 'Move', Work: 'Work on', Use: 'Use' };
      out.push({
        id: 'sig-f-' + k.id, kind: 'fulfil', ref: k.id, ndo: k.ndo, lane: 'hands',
        title: (dev ? 'Fulfil ' + k.action : verbFor[k.action] ?? 'Complete') + (r ? ' · ' + r[0] : ''),
        sub: who(k.provider) + ' → ' + who(k.receiver) + (k.note ? ' · ' + k.note : ''),
        strength: 4, verb: dev ? 'Fulfil' : 'Done it',
        why: [
          'open Commitment { action: ' + k.action + ' }',
          '← propose_commitment by ' + who(k.receiver),
          '← you are ' + (k.provider === me ? 'provider' : 'receiver'),
          k.action === 'TransferCustody' ? '← transfer_custody needs the current custodian' : '← claim_commitment + issue_participation_receipts'
        ]
      });
    } else {
      const v = s.validations[k.id] ?? [];
      if (!v.includes(me)) {
        out.push({
          id: 'sig-vc-' + k.id, kind: 'validate', ref: k.id, ndo: k.ndo, lane: 'eyes',
          title: dev ? 'Validate ' + who(k.receiver) + "'s " + k.action : 'Approve ' + who(k.receiver) + "'s request",
          sub: 'validators so far', progress: [v.length, 2], strength: 3, verb: dev ? 'Validate' : 'Approve',
          why: ['open Commitment { action: ' + k.action + ' }', '← TransferCondition / AccessRequirement on this NDO', '← create_validation_receipt']
        });
      }
    }
  }
  for (const [ndo, list] of Object.entries(s.instances)) {
    if (!nd(ndo)) continue;
    list.forEach((r, i) => {
      const key = ndo + ':' + i;
      const v = s.validations[key] ?? [];
      if (r[1] === 'PendingValidation' && r[2] !== me && !v.includes(me)) {
        out.push({
          id: 'sig-vr-' + key, kind: 'validate', ref: key, ndo, lane: 'eyes',
          title: (dev ? 'Validate ' : 'Check and approve ') + r[0],
          sub: dev ? 'PendingValidation · validators' : 'waiting for approval · approvals',
          progress: [v.length, 1], strength: 3, verb: dev ? 'Validate' : 'Approve',
          why: ['EconomicResource { operational_state: PendingValidation }', '← create_economic_resource by ' + who(r[2]), '← create_validation_receipt']
        });
      }
      if (r[1] === 'PendingValidation' && r[2] === me && v.length) {
        out.push({
          id: 'sig-av-' + key, kind: 'available', ref: key, ndo, lane: 'hands',
          title: 'Make ' + r[0] + ' available', sub: v.length + ' validation receipt' + (v.length > 1 ? 's' : ''),
          strength: 3, verb: 'Make available',
          why: ['ValidationReceipt { approved: true }', '← you are custodian', '← update_operational_state(Available)']
        });
      }
      const alreadyAsked = s.commitments.some((k) => k.ndo === ndo && k.inst === i && k.status === 'open' && k.receiver === me);
      if (r[1] === 'Available' && r[2] !== me && !alreadyAsked) {
        const limit = (s.rules[ndo] ?? []).find((x) => x[0] === 'UsageLimit');
        out.push({
          id: 'sig-rq-' + key, kind: 'request', ref: key, ndo, lane: 'avail',
          title: r[0] + ' is available', sub: (dev ? 'custodian ' : 'held by ') + who(r[2]) + (limit ? ' · ' + limit[1] : ''),
          strength: 4, verb: dev ? 'Request' : 'Ask to borrow',
          why: ['EconomicResource { operational_state: Available }', ...(s.rules[ndo] ?? []).map((x) => '← ' + x[0] + ' { ' + x[1] + ' }'), '← propose_commitment(AccessForUse)']
        });
      }
    });
  }
  for (const [ndo, rs] of Object.entries(s.rules)) {
    const m = rs.find((x) => x[0] === 'MaintenanceSchedule');
    if (!m || !nd(ndo) || !(s.instances[ndo] ?? []).length) continue;
    const role = (m[1].split('·')[1] ?? '').trim();
    const holds = roles.includes(role as RoleType);
    out.push({
      id: 'sig-m-' + ndo, kind: 'maintain', ref: ndo, ndo, lane: 'hands',
      title: 'Scheduled maintenance · ' + s.instances[ndo][0][0],
      sub: plain(m[1]) + (role && !holds ? ' · needs role ' + role : ''),
      strength: 2, verb: 'Log work',
      why: [
        'GovernanceRule MaintenanceSchedule { ' + m[1] + ' }',
        role ? '← required_role: ' + role + (holds ? ' (you hold it)' : ' (you do not hold it)') : '← no required role',
        '← log_economic_event(Work) + issue_participation_receipts'
      ]
    });
  }
  return out;
}

// ── Derived: time, heat, reputation ───────────────────────────────────────

export function fmtAgo(m: number): string {
  if (m < 1) return 'now';
  if (m < 60) return Math.round(m) + ' min';
  if (m < 1440) return Math.round(m / 60) + ' h';
  if (m < 10080) return Math.round(m / 1440) + ' d';
  return Math.round(m / 10080) + ' wk';
}

export type Freshness = 'fresh' | 'warm' | 'fading' | 'cold';
export function freshness(m: number, decayDays = 14): Freshness {
  const d = m / 1440;
  if (d < 0.05) return 'fresh';
  if (d < decayDays * 0.15) return 'warm';
  if (d < decayDays) return 'fading';
  return 'cold';
}

export function heat(m: number, decayDays = 14): number {
  return Math.max(0.08, 1 - m / (decayDays * 1440));
}

export function heatOf(s: ProtoState, ndo: string, decayDays = 14): number {
  return s.traces.filter((t) => t.ndo === ndo).reduce((a, t) => a + heat(t.ago, decayDays), 0);
}

export interface Reputation {
  total_claims: number;
  custody_claims: number;
  service_claims: number;
  governance_claims: number;
  creation_claims: number;
}

/** derive_reputation_summary, counted by receipt type prefix. */
export function reputation(s: ProtoState): Reputation {
  const r = s.receipts;
  const k = (p: string[]) => r.filter((x) => p.some((y) => (x.type ?? '').startsWith(y))).length;
  return {
    total_claims: r.length,
    custody_claims: k(['Custody']),
    service_claims: k(['Maintenance', 'Transport', 'Storage']),
    governance_claims: k(['Rule', 'Validation']),
    creation_claims: k(['ResourceCreation'])
  };
}

// ── Actions ───────────────────────────────────────────────────────────────

/** What an action needs from outside: who is acting, and where ids come from. */
export interface Ctx {
  me: string;
  /** A unique id with the given prefix. */
  id: (prefix: string) => string;
  /** A fake entry hash for a new NDO. */
  hash: () => string;
}

/** One write, as the toast lifecycle sees it. `traceId` is the trace it left,
 *  if any; that trace carries the receipts earned once peers validate it. */
export interface Write {
  title: string;
  traceId?: string;
}

export type Fail = { ok: false; error: string };
export type Done<V = undefined> = { ok: true; state: ProtoState; writes: Write[]; value: V };
export type Outcome<V = undefined> = Fail | Done<V>;

export const fail = (error: string): Fail => ({ ok: false, error });

type Patch = Partial<ProtoState> | ((x: ProtoState) => Partial<ProtoState>);

/** Leaves a trace on an NDO and applies the entry change: the core of every
 *  write. The trace starts 'queued' offline and 'signed' online. Receipts
 *  default to a maintenance receipt for 'work' traces, as in core.jsx. */
function leave(
  s: ProtoState,
  ctx: Ctx,
  ndo: string,
  kind: TraceKind,
  text: string,
  note: string | null,
  patch: Patch = {},
  receipts?: ReceiptInput[]
): Done<string> {
  const id = ctx.id('t');
  const earned = receipts ?? (kind === 'work' ? [{ text, ndo, type: 'MaintenanceFulfillmentCompleted' as const }] : []);
  const trace: Trace = {
    id, ndo, agent: ctx.me, kind, text, note, ago: 0,
    status: s.offline ? 'queued' : 'signed', hops: [], mine: true,
    ...(earned.length ? { receipts: earned } : {})
  };
  const extra = typeof patch === 'function' ? patch(s) : patch;
  return { ok: true, state: { ...s, traces: [trace, ...s.traces], ...extra }, writes: [{ title: text, traceId: id }], value: id };
}

const done = <V>(state: ProtoState, title: string, value: V): Done<V> => ({ ok: true, state, writes: [{ title }], value });
const plainDone = <V>(d: Done<unknown>, value: V): Done<V> => ({ ...d, value });

const instOf = (s: ProtoState, ndo: string, i: number): Instance | undefined => (s.instances[ndo] ?? [])[i];

function setInst(x: ProtoState, ndo: string, i: number, p: [string | null, OperationalState | null, string | null]) {
  return {
    ...x.instances,
    [ndo]: x.instances[ndo].map((r, j): Instance => (j === i ? [p[0] ?? r[0], p[1] ?? r[1], p[2] ?? r[2]] : r))
  };
}

/** zome_gouvernance::create_validation_receipt (resource approval or commitment approval) */
export function validate(s: ProtoState, ctx: Ctx, ref: string, ndo: string): Outcome {
  const v = s.validations[ref] ?? [];
  if (v.includes(ctx.me)) return fail('You already validated this item.');
  const isRes = ref.includes(':');
  const r = isRes ? instOf(s, ref.split(':')[0], +ref.split(':')[1]) : undefined;
  if (r && r[2] === ctx.me) return fail('An agent cannot validate their own resource.');
  const d = leave(s, ctx, ndo, 'work', 'validated ' + (r ? r[0] : 'commitment'), null,
    (x) => ({ validations: { ...x.validations, [ref]: [...(x.validations[ref] ?? []), ctx.me] } }),
    [{ text: 'validated ' + (r ? r[0] : 'a commitment'), ndo, type: 'ResourceValidation' }]);
  return plainDone(d, undefined);
}

/** zome_gouvernance::log_economic_event (+ issue_participation_receipts for Work) */
export function logEvent(s: ProtoState, ctx: Ctx, ndo: string, i: number, action: string, note?: string): Outcome {
  const r = instOf(s, ndo, i);
  if (!r) return fail('log_economic_event needs a resource (resource_inventoried_as).');
  if (!(ENUM.action as readonly string[]).includes(action)) return fail('Invalid VfAction.');
  const isWork = action === 'Work' || action === 'Modify';
  const d = leave(s, ctx, ndo, isWork ? 'work' : action === 'Cite' ? 'cite' : 'use',
    action + ' · ' + r[0] + (note ? ' · ' + note : ''), note || null, {},
    isWork ? [{ text: action + ' on ' + r[0], ndo, type: 'MaintenanceFulfillmentCompleted', with: r[2] }] : []);
  return plainDone(d, undefined);
}

/** zome_group::log_work (group WorkLog: description + hours; planning only, no PPR) */
export function logWork(s: ProtoState, ctx: Ctx, ndo: string, description: string, hours: number | string): Outcome {
  if (!description || !description.trim()) return fail('WorkLog description cannot be empty');
  if (!(+hours > 0)) return fail('WorkLog hours must be greater than 0');
  return plainDone(leave(s, ctx, ndo, 'note', 'logged ' + +hours + ' h work', description.trim()), undefined);
}

/** zome_gouvernance::create_ndo_hard_link. It needs a fulfilment event, so the
 *  UI logs a Cite event first. */
export function hardLink(s: ProtoState, ctx: Ctx, from: string, to: string, type: string): Outcome {
  if (from === to) return fail('An NDO cannot link to itself.');
  if (!(LINK_TYPES as readonly string[]).includes(type)) return fail('Invalid NdoLinkType.');
  if (s.hardLinks.some((h) => h.from === from && h.to === to && h.type === type)) return fail('This hard link already exists.');
  const target = s.ndos.find((n) => n.id === to);
  const d = leave(s, ctx, from, 'cite', 'linked: this ' + (PLAIN[type] ?? type) + ' ' + (target ? target.name : to), null,
    (x) => ({ hardLinks: [...x.hardLinks, { from, to, type: type as NdoLinkType }], links: uniqLinks([...x.links, [from, to, 'hard']]) }));
  return plainDone(d, undefined);
}

/** zome_resource::update_lifecycle_stage: initiator only; Deprecated needs a successor */
export function advance(s: ProtoState, ctx: Ctx, ndo: string, to: string, successor?: string): Outcome {
  const n = s.ndos.find((x) => x.id === ndo);
  if (!n) return fail('NDO not found.');
  if (n.initiator && n.initiator !== ctx.me) {
    return fail('NotAuthor: only the initiator (' + (AGENTS[n.initiator] ?? n.initiator) + ') may change the lifecycle stage.');
  }
  if (!allowedStages(n).includes(to as LifecycleStage)) return fail('Invalid lifecycle transition ' + n.stage + ' → ' + to + '.');
  if (to === 'Deprecated' && !successor) return fail('Transitioning to Deprecated requires successor_ndo_hash (REQ-NDO-LC-06).');
  const patch: Partial<Ndo> = { stage: to as LifecycleStage, hibernation_origin: to === 'Hibernating' ? n.stage : null };
  if (to === 'Deprecated') patch.successor = successor;
  const d = leave(s, ctx, ndo, 'lifecycle', 'moved to ' + to, null, (x) => ({ ndos: x.ndos.map((m) => (m.id === ndo ? { ...m, ...patch } : m)) }));
  return plainDone(d, undefined);
}

export interface NdoForm {
  name: string;
  desc?: string;
  regime: PropertyRegime;
  nature: ResourceNature;
  group?: string;
}

/** zome_resource::create_ndo → zome_group::create_ndo_anchor. Returns the new id. */
export function createNdo(s: ProtoState, ctx: Ctx, f: NdoForm): Outcome<string> {
  if (!f.name || !f.name.trim()) return fail('NDO name cannot be empty.');
  const group = f.group || s.groups[0]?.id;
  if (!group) return fail('Only group members can declare an NDO. Join or create a group first.');
  const id = ctx.id('n');
  const n: Ndo = {
    id, name: f.name.trim(), group, stage: 'Ideation', regime: f.regime, nature: f.nature,
    rivalry: ['Digital', 'Information', 'Service'].includes(f.nature) ? 'NonRivalrous' : 'Rivalrous',
    initiator: ctx.me, desc: f.desc || '', hash: ctx.hash()
  };
  const d = leave(s, ctx, id, 'work', 'declared this NDO', null, { ndos: [...s.ndos, n] }, [{ text: 'declared ' + n.name, ndo: id, type: 'ResourceCreation' }]);
  return plainDone(d, id);
}

export interface ProfileForm {
  name: string;
  handle?: string;
  bio?: string;
  avatar?: string;
  email?: string;
  location?: string;
  time_zone?: string;
  roles?: RoleType[];
}

/** First time: zome_person::create_person + lobby::upsert_lobby_agent_profile;
 *  later update_person. Roles via assign_person_role. */
export function updateProfile(s: ProtoState, _ctx: Ctx, p: ProfileForm): Outcome {
  if (!p.name || !p.name.trim()) return fail('Person name cannot be empty.');
  if (p.handle && p.handle.length > 64) return fail('handle must be ≤ 64 characters');
  if (p.avatar && !p.avatar.startsWith('https://')) return fail('avatar_url must start with https://');
  const profile: Profile = {
    name: p.name.trim(), handle: p.handle || '', bio: p.bio || '', avatar: p.avatar || '',
    private: { email: p.email || '', location: p.location || '', time_zone: p.time_zone || '' }
  };
  return done({ ...s, profile, roles: p.roles ?? s.roles ?? [...DEFAULT_ROLES] }, 'updated your profile', undefined);
}

/** zome_group::create_group (+ lobby::announce_group) */
export function createGroup(s: ProtoState, ctx: Ctx, g: { name: string; desc?: string }): Outcome<{ id: string; invite: string }> {
  if (!g.name || !g.name.trim()) return fail('Group name cannot be empty.');
  if (g.name.length > 100) return fail('Group name too long (max 100 characters).');
  const id = ctx.id('g');
  const grp: Group = { id, name: g.name.trim(), desc: g.desc || '', invite: 'ndo-invite:' + id + '-' + ctx.hash().slice(-4) };
  return done({ ...s, groups: [...s.groups, grp] }, 'created group ' + grp.name, { id, invite: grp.invite });
}

/** zome_group::join_group via invite link (group DNA hash + network seed) */
export function joinGroup(s: ProtoState, _ctx: Ctx, code: string): Outcome<{ id: string }> {
  const c = (code || '').trim();
  const inv = s.invites?.[c];
  if (s.groups.some((g) => g.invite === c)) return fail('You are already a member of this group.');
  if (!inv) return fail('Invalid invite code.');
  const rest = { ...s.invites };
  delete rest[c];
  const all = [...s.ndos, ...inv.ndos];
  const exists = (id: string) => all.some((n) => n.id === id);
  const next: ProtoState = {
    ...s,
    invites: rest,
    groups: [...s.groups, inv.group],
    ndos: all,
    rules: { ...s.rules, ...inv.rules },
    instances: { ...s.instances, ...inv.instances },
    links: uniqLinks([...s.links, ...inv.links].filter(([a, b]) => exists(a) && exists(b))),
    traces: [...s.traces, ...(inv.traces ?? [])],
    commitments: [...s.commitments, ...(inv.commitments ?? [])],
    hardLinks: [...s.hardLinks, ...(inv.hardLinks ?? [])]
  };
  return done(next, 'joined ' + inv.group.name, { id: inv.group.id });
}

/** Joins the example network's group invites at once (onboarding shortcut). */
export function joinDemo(s: ProtoState, ctx: Ctx): Outcome {
  let cur = s;
  const writes: Write[] = [];
  for (const code of DEMO_INVITES) {
    if (!cur.invites[code]) continue;
    const r = joinGroup(cur, ctx, code);
    if (r.ok) {
      cur = r.state;
      writes.push(...r.writes);
    }
  }
  return { ok: true, state: cur, writes, value: undefined };
}

/** check_rule_data_permitted in crates/shared/src/constraints.rs at 3cbebf0,
 *  Hard violations only: validate_create_governance_rule (and the update,
 *  which runs the same check) rejects them in the integrity zome. The message
 *  is the zome's hard_violation_message. An ownership-transfer rule is Hard
 *  only on Nondominium; on the other regimes that do not permit it (Commons,
 *  Pool, CommonPool, Public) it is Soft, an advisory the zome accepts, and so
 *  is Gated access on Nondominium. */
export function hardRuleViolation(regime: PropertyRegime, type: string, summary: string): string | null {
  const transferType = summary.split(' · ')[0].trim();
  if (type === 'TransferCondition' && transferType === 'Ownership' && regime === 'Nondominium') {
    return '[ownership_transfer_not_permitted_by_regime] Nondominium does not permit ownership-transfer rules.';
  }
  return null;
}

/** zome_resource::create_governance_rule (typed RuleData). Creating always adds
 *  a new rule, as the zome does, even beside one of the same type; the caller
 *  becomes its author. Changing a rule is updateRule. */
export function addRule(s: ProtoState, ctx: Ctx, ndo: string, type: string, summary: string): Outcome {
  if (!(ENUM.rule as readonly string[]).includes(type)) return fail('Invalid RuleData variant.');
  const n = s.ndos.find((x) => x.id === ndo);
  if (!n) return fail('NDO not found.');
  const bad = hardRuleViolation(n.regime, type, summary);
  if (bad) return fail(bad);
  const d = leave(s, ctx, ndo, 'rule', 'added rule ' + type, null, (x) => ({
    rules: { ...x.rules, [ndo]: [...(x.rules[ndo] ?? []), [type as RuleType, summary || 'none', ctx.me]] }
  }));
  return plainDone(d, undefined);
}

/** zome_resource::update_governance_rule: author only (the coordinator returns
 *  ResourceError::NotAuthor otherwise), and the same Hard constraints as
 *  create. `i` is the rule's index on its NDO. */
export function updateRule(s: ProtoState, ctx: Ctx, ndo: string, i: number, type: string, summary: string): Outcome {
  const n = s.ndos.find((x) => x.id === ndo);
  if (!n) return fail('NDO not found.');
  const r = (s.rules[ndo] ?? [])[i];
  if (!r) return fail('Governance rule not found.');
  if (r[2] !== ctx.me) {
    return fail("NotAuthor: only the rule's author (" + agentName(s, r[2]) + ') can change this rule.');
  }
  if (!(ENUM.rule as readonly string[]).includes(type)) return fail('Invalid RuleData variant.');
  const bad = hardRuleViolation(n.regime, type, summary);
  if (bad) return fail(bad);
  const d = leave(s, ctx, ndo, 'rule', 'changed rule ' + type, null, (x) => ({
    rules: { ...x.rules, [ndo]: x.rules[ndo].map((q, j): Rule => (j === i ? [type as RuleType, summary || 'none', q[2]] : q)) }
  }));
  return plainDone(d, undefined);
}

/** zome_resource::create_economic_resource: starts PendingValidation, caller is custodian */
export function addInstance(s: ProtoState, ctx: Ctx, ndo: string, label: string): Outcome {
  const n = s.ndos.find((x) => x.id === ndo);
  if (!n) return fail('NDO not found.');
  if (NO_ITEM_STAGES.includes(n.stage)) return fail('Instances cannot be added at stage ' + n.stage + '.');
  if (!label || !label.trim()) return fail('Label cannot be empty.');
  const d = leave(s, ctx, ndo, 'work', 'created resource ' + label, null,
    (x) => ({ instances: { ...x.instances, [ndo]: [...(x.instances[ndo] ?? []), [label.trim(), 'PendingValidation', ctx.me]] } }),
    [{ text: 'created ' + label, ndo, type: 'ResourceCreation' }]);
  return plainDone(d, undefined);
}

/** zome_resource::update_operational_state: custodian only */
export function setOpState(s: ProtoState, ctx: Ctx, ndo: string, i: number, state: string): Outcome {
  const r = instOf(s, ndo, i);
  if (!r) return fail('Resource not found.');
  if (r[2] !== ctx.me) return fail('NotCustodian: only the current custodian (' + (AGENTS[r[2]] ?? r[2]) + ') can update operational state.');
  if (!(ENUM.opstate as readonly string[]).includes(state)) return fail('Invalid OperationalState.');
  const d = leave(s, ctx, ndo, 'custody', r[0] + ' → ' + state, null, (x) => ({ instances: setInst(x, ndo, i, [null, state as OperationalState, null]) }));
  return plainDone(d, undefined);
}

/** transfer_custody → log_economic_event(TransferCustody) → issue_participation_receipts */
export function transferCustody(s: ProtoState, ctx: Ctx, ndo: string, i: number, to: string): Outcome {
  const r = instOf(s, ndo, i);
  if (!r) return fail('Resource not found.');
  if (r[2] !== ctx.me) return fail('NotCustodian: only the current custodian (' + (AGENTS[r[2]] ?? r[2]) + ') can transfer custody.');
  if (to === ctx.me) return fail('New custodian must differ from current custodian.');
  const d = leave(s, ctx, ndo, 'custody', 'transferred custody of ' + r[0] + ' → ' + agentName(s, to), null,
    (x) => ({ instances: setInst(x, ndo, i, [null, null, to]) }),
    [{ text: 'handed ' + r[0] + ' to ' + agentName(s, to), ndo, type: 'CustodyTransfer', with: to }]);
  return plainDone(d, undefined);
}

export interface CommitForm {
  ndo: string;
  action: string;
  provider: string;
  inst?: number;
  note?: string;
}

/** zome_gouvernance::propose_commitment: the receiver is the caller */
export function propose(s: ProtoState, ctx: Ctx, f: CommitForm): Outcome {
  if (!(ENUM.action as readonly string[]).includes(f.action)) return fail('Invalid VfAction.');
  if (f.provider === ctx.me) return fail('Provider and receiver are both you. Pick another provider.');
  const c: Commitment = {
    id: ctx.id('c'), ndo: f.ndo, action: f.action as VfAction, provider: f.provider, receiver: ctx.me,
    inst: f.inst || 0, note: f.note || '', status: 'open', mine: true
  };
  const d = leave(s, ctx, f.ndo, 'commit', 'proposed ' + f.action + (f.note ? ' · ' + f.note : ''), null, (x) => ({ commitments: [c, ...x.commitments] }));
  return plainDone(d, undefined);
}

/** [transfer_custody →] log_economic_event → claim_commitment → issue_participation_receipts.
 *  A commitment can be claimed once. */
export function fulfil(s: ProtoState, ctx: Ctx, cid: string): Outcome {
  const c = s.commitments.find((x) => x.id === cid);
  if (!c || c.status !== 'open') return fail('Commitment already claimed.');
  const r = instOf(s, c.ndo, c.inst);
  if (c.action === 'TransferCustody') {
    if (!r) return fail('Commitment has no resource.');
    if (r[2] !== ctx.me) return fail('transfer_custody: NotCustodian. Only ' + (AGENTS[r[2]] ?? r[2]) + ' can fulfil this TransferCustody commitment.');
  }
  if (c.provider !== ctx.me && c.receiver !== ctx.me) return fail('You are neither provider nor receiver of this commitment.');
  const [pc, rc] = PPR_TYPES[c.action] ?? ['RuleCompliance', null];
  const other = c.provider === ctx.me ? c.receiver : c.provider;
  const mineType = c.provider === ctx.me ? pc : rc;
  const d = leave(s, ctx, c.ndo, c.action === 'TransferCustody' ? 'custody' : 'use',
    'fulfilled ' + c.action + ' · ' + agentName(s, c.provider) + ' → ' + agentName(s, c.receiver), null,
    (x) => ({
      commitments: x.commitments.map((k) => (k.id === cid ? { ...k, status: 'claimed' as const } : k)),
      instances: c.action === 'TransferCustody' ? setInst(x, c.ndo, c.inst, [null, 'InTransit', c.receiver]) : x.instances
    }),
    mineType ? [{ text: c.action + ' with ' + agentName(s, other), ndo: c.ndo, type: mineType, with: other }] : []);
  return plainDone(d, undefined);
}

/** Signals route to the zome call they were derived from. */
export function pickUp(s: ProtoState, ctx: Ctx, sig: Signal): Outcome {
  if (sig.kind === 'fulfil') return fulfil(s, ctx, sig.ref);
  if (sig.kind === 'validate') return validate(s, ctx, sig.ref, sig.ndo);
  const [ndo, i] = sig.ref.split(':');
  if (sig.kind === 'available') return setOpState(s, ctx, ndo, +i, 'Available');
  if (sig.kind === 'request') {
    const r = instOf(s, ndo, +i);
    if (!r) return fail('Resource not found.');
    return propose(s, ctx, { ndo, inst: +i, action: 'AccessForUse', provider: r[2], note: 'requested from signal' });
  }
  return logEvent(s, ctx, sig.ndo, 0, 'Work', 'scheduled maintenance');
}

/** A trace reached peers: mark it validated and pay out the receipts it
 *  carries. Used by the store's timers and on reconnect. */
export function settleTrace(s: ProtoState, ctx: Ctx, traceId: string, hops: string[]): ProtoState {
  const t = s.traces.find((x) => x.id === traceId);
  if (!t) return s;
  const paid = (t.receipts ?? []).map((r): Receipt => ({ id: ctx.id('r'), ...r }));
  return {
    ...s,
    traces: s.traces.map((x) => (x.id === traceId ? { ...x, status: 'validated' as const, hops, receipts: undefined } : x)),
    receipts: paid.length ? [...paid, ...s.receipts] : s.receipts
  };
}

export function patchTrace(s: ProtoState, traceId: string, p: Partial<Trace>): ProtoState {
  return { ...s, traces: s.traces.map((t) => (t.id === traceId ? { ...t, ...p } : t)) };
}
