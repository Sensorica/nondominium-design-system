// Session state for the Layer 0 app. One module-level singleton, so creating a
// group, joining an NDO or advancing a stage survives navigation inside the
// prototype and a trip out to the index and back. A full reload reseeds.
import {
  associateNdoWithGroups,
  canActivateLayer1,
  EMPTY_FILTERS,
  allowedTransitions,
  getMockGroups,
  layer1GateMessagePlain,
  MOCK_AGENT_NAMES,
  MOCK_LOBBY_PROFILE,
  MOCK_NDOS,
  resolveScope,
  validateSpecInput,
  type ActiveFilters,
  type GroupDescriptor,
  type GroupMember,
  type LifecycleStage,
  type LobbyUserProfile,
  type NdoDescriptor,
  type NdoInput,
  type NdoTransitionHistoryEvent,
  type ResourceSpecification,
  type ResourceSpecificationInput
} from '@nondominium/ndo-ui';

/** Lynn. She initiated "Neighborhood Tool Library (planned)". */
export const MY_KEY = 'uhCAk5vMp8X3nRwsQzLtYd4uJcFe7gHiKoNbPmVe';

const ACTIVE_NDO = 'uhC0kVX5k7dL2mPqRsTuVwXyZaB3cDeF4gHiJkLm';

export const OPERATIONAL: Record<string, 'InUse' | 'InStorage' | 'Available'> = {
  uhC0kAb3cDeF4gHiJkLmNoPqRsTuVwXy: 'InUse',
  uhC0k1234abcdefghijklmnopqrstuvwx: 'InStorage',
  uhC0kVX5k7dL2mPqRsTuVwXyZaB3cDeF4gHiJkLm: 'Available'
};

type Patch = {
  lifecycle_stage: LifecycleStage | string;
  successor_ndo_hash: string | null;
  hibernation_origin: LifecycleStage | string | null;
};

function seedHistory(): Record<string, NdoTransitionHistoryEvent[]> {
  return {
    [ACTIVE_NDO]: [
      {
        from_stage: 'Stable',
        to_stage: 'Active',
        agent: MOCK_AGENT_NAMES.tibi,
        timestamp: 1711000000000000,
        event_hash: 'uhC0keventHashExample001'
      }
    ]
  };
}

function seedMembers(): Record<string, GroupMember[]> {
  return {
    uhC0kAb3cDeF4gHiJkLmNoPqRsTuVwXy: [
      { id: 'bob', name: MOCK_AGENT_NAMES.bob, role: 'Member' },
      { id: 'lynn', name: MOCK_AGENT_NAMES.lynn, role: 'Member' }
    ]
  };
}

export type NavigationTrailEntry = { label: string; href: string };

export const rp = $state({
  groups: getMockGroups() as GroupDescriptor[],
  created: [] as NdoDescriptor[],
  joined: ['uhC0kAb3cDeF4gHiJkLmNoPqRsTuVwXy'] as string[],
  members: seedMembers(),
  filters: { ...EMPTY_FILTERS } as ActiveFilters,
  profile: { ...MOCK_LOBBY_PROFILE } as LobbyUserProfile,
  patches: {} as Record<string, Patch>,
  history: seedHistory(),
  /** Layer 1 specs keyed by NDO identity hash. Empty until someone creates one. */
  specs: {} as Record<string, ResourceSpecification[]>,
  /** Cross-perspective jump stack. Cleared on a switcher switch. */
  trail: [] as NavigationTrailEntry[]
});

export function pushTrail(entry: NavigationTrailEntry): void {
  rp.trail = [...rp.trail, entry];
}

export function popTrail(): NavigationTrailEntry | null {
  if (rp.trail.length === 0) return null;
  const next = [...rp.trail];
  const top = next.pop()!;
  rp.trail = next;
  return top;
}

export function clearTrail(): void {
  rp.trail = [];
}

export function trailTop(): NavigationTrailEntry | null {
  return rp.trail.length ? rp.trail[rp.trail.length - 1] : null;
}

let groupSeq = 0;
let ndoSeq = 0;
let specSeq = 0;

export function applyPatch(d: NdoDescriptor): NdoDescriptor {
  const p = rp.patches[d.hash];
  if (!p) return d;
  return {
    ...d,
    lifecycle_stage: p.lifecycle_stage,
    successor_ndo_hash: p.successor_ndo_hash,
    hibernation_origin: p.hibernation_origin
  };
}

export function historyFor(hash: string): NdoTransitionHistoryEvent[] {
  return rp.history[hash] ?? [];
}

export function createGroup(name: string): string {
  groupSeq += 1;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'group';
  const id = `grp_${slug}-${groupSeq}`;
  rp.groups = [
    ...rp.groups,
    { id, name, createdBy: MOCK_AGENT_NAMES.lynn, createdAt: Date.now(), ndoHashes: [] }
  ];
  return id;
}

/** Invite strings look like `nondominium://join?group=<id>`. A bare group id works too. */
export function groupIdFromInvite(code: string): string | null {
  const trimmed = code.trim();
  const fromQuery = trimmed.match(/[?&]group=([^&\s]+)/);
  if (fromQuery) return decodeURIComponent(fromQuery[1]);
  if (trimmed.startsWith('grp_')) return trimmed;
  return null;
}

export function hasGroup(id: string): boolean {
  return rp.groups.some((g) => g.id === id);
}

export function createNdo(groupId: string, input: NdoInput): string {
  ndoSeq += 1;
  const hash = `uhC0kNew${ndoSeq}Layer0DemoAbcdefghijklmn`;
  const d: NdoDescriptor = {
    hash,
    name: input.name,
    description: input.description ?? null,
    lifecycle_stage: input.lifecycle_stage,
    property_regime: input.property_regime,
    resource_nature: input.resource_nature,
    initiator: MY_KEY,
    created_at: Date.now() * 1000,
    successor_ndo_hash: null,
    hibernation_origin: null
  };
  rp.created = [...rp.created, d];
  rp.groups = associateNdoWithGroups(rp.groups, hash, [groupId]);
  return hash;
}

export function joinNdo(hash: string): void {
  if (!rp.joined.includes(hash)) rp.joined = [...rp.joined, hash];
  const current = rp.members[hash] ?? [];
  if (!current.some((m) => m.id === 'lynn')) {
    rp.members = {
      ...rp.members,
      [hash]: [...current, { id: 'lynn', name: MOCK_AGENT_NAMES.lynn, role: 'Member' }]
    };
  }
}

export function associate(hash: string, groupIds: string[]): void {
  rp.groups = associateNdoWithGroups(rp.groups, hash, groupIds);
}

export function advanceStage(
  hash: string,
  current: NdoDescriptor,
  payload: { newStage: string; successorHash?: string }
): void {
  const from = current.lifecycle_stage ? String(current.lifecycle_stage) : '';
  const allowed = allowedTransitions(current.lifecycle_stage, current.hibernation_origin);
  if (!allowed.includes(payload.newStage as LifecycleStage)) {
    throw new Error(`Cannot move from ${from} to ${payload.newStage}.`);
  }
  if (payload.newStage === 'Deprecated' && !payload.successorHash) {
    throw new Error('Deprecated requires a successor NDO.');
  }
  const event: NdoTransitionHistoryEvent = {
    from_stage: from,
    to_stage: payload.newStage,
    agent: MOCK_AGENT_NAMES.lynn,
    timestamp: Date.now() * 1000,
    event_hash: `uhC0kevent${Date.now()}`
  };
  const previousOrigin = rp.patches[hash]?.hibernation_origin ?? current.hibernation_origin;
  const hibernation_origin =
    payload.newStage === 'Hibernating'
      ? from
      : from === 'Hibernating' && payload.newStage === previousOrigin
        ? null
        : previousOrigin;
  rp.history = { ...rp.history, [hash]: [...historyFor(hash), event] };
  rp.patches = {
    ...rp.patches,
    [hash]: {
      lifecycle_stage: payload.newStage,
      successor_ndo_hash: payload.successorHash ?? current.successor_ndo_hash,
      hibernation_origin
    }
  };
}

export function setFilters(partial: Partial<ActiveFilters>): void {
  rp.filters = { ...rp.filters, ...partial };
}

export function clearFilters(): void {
  rp.filters = { ...EMPTY_FILTERS };
}

export function saveProfile(profile: LobbyUserProfile): void {
  rp.profile = profile;
}

export function initiatorName(d: NdoDescriptor, fallback: string | null): string | null {
  if (d.initiator === MY_KEY) return MOCK_AGENT_NAMES.lynn;
  return fallback;
}

export function specsFor(ndoHash: string): ResourceSpecification[] {
  return rp.specs[ndoHash] ?? [];
}

/**
 * Activate Layer 1 for an NDO. Enforces the lifecycle gate and field rules.
 * Records the stage observed now (mock of Rust `ndo_state_hash`).
 */
export function createSpecification(
  ndo: NdoDescriptor,
  input: ResourceSpecificationInput
): ResourceSpecification {
  const stage = ndo.lifecycle_stage ? String(ndo.lifecycle_stage) : '';
  if (!canActivateLayer1(ndo.lifecycle_stage)) {
    throw new Error(layer1GateMessagePlain(stage));
  }
  const scope = resolveScope(ndo.property_regime, input.scope);
  const validated = validateSpecInput({ ...input, scope });
  if (!validated.ok) {
    throw new Error(validated.error);
  }
  specSeq += 1;
  const spec: ResourceSpecification = {
    action_hash: `uhC0kSpec${specSeq}Layer1DemoAbcdefghijklmn`,
    name: validated.input.name,
    description: validated.input.description,
    category: validated.input.category,
    image_url: validated.input.image_url,
    tags: validated.input.tags,
    is_active: true,
    scope: validated.input.scope,
    ndo_identity_hash: ndo.hash,
    activated_at_stage: stage || 'Specification',
    author: MY_KEY,
    created_at: Date.now() * 1000
  };
  const existing = rp.specs[ndo.hash] ?? [];
  rp.specs = { ...rp.specs, [ndo.hash]: [...existing, spec] };
  return spec;
}

/**
 * Author-only update of mutable Layer 1 fields.
 * Cannot reparent or rewrite the stage observed at activation.
 */
export function updateSpecification(
  ndoHash: string,
  actionHash: string,
  input: ResourceSpecificationInput,
  propertyRegime?: string | null
): ResourceSpecification {
  const list = rp.specs[ndoHash] ?? [];
  const index = list.findIndex((s) => s.action_hash === actionHash);
  if (index < 0) {
    throw new Error('Resource specification not found.');
  }
  const original = list[index];
  if (original.author !== MY_KEY) {
    throw new Error('Only the author can update this resource specification.');
  }
  if (original.ndo_identity_hash !== ndoHash) {
    throw new Error('ResourceSpecification ndo_identity_hash is immutable.');
  }
  const scope = resolveScope(propertyRegime, input.scope);
  const validated = validateSpecInput({ ...input, scope });
  if (!validated.ok) {
    throw new Error(validated.error);
  }
  const updated: ResourceSpecification = {
    ...original,
    name: validated.input.name,
    description: validated.input.description,
    category: validated.input.category,
    image_url: validated.input.image_url,
    tags: validated.input.tags,
    scope: validated.input.scope
  };
  const next = [...list];
  next[index] = updated;
  rp.specs = { ...rp.specs, [ndoHash]: next };
  return updated;
}

export { MOCK_NDOS };
