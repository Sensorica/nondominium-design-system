// Mock stand-ins for the production Effect-TS stores.
//
// These expose the SAME property and method names the real stores do
// (`lobbyStore.filteredNdos`, `groupStore.members`, `appContext.lobbyUserProfile`),
// so the replica components below can stay near-verbatim copies of the app's.
// The only thing that changes is where the data comes from: module state here,
// a conductor there.
//
// One deliberate simplification: production holds `appContext.myAgentPubKey` as
// a `Uint8Array` and compares it with `encodeHashToBase64(...)` at every call
// site. The prototype holds the base64 string directly and compares strings.
// The derived results are identical; carrying Holochain's codec into a mock
// would buy nothing.

import type {
  ActionHash,
  ActiveFilters,
  AgentPubKey,
  CellId,
  ConstraintViolation,
  EconomicResourceRow,
  GovernanceRule,
  GroupDescriptor,
  GroupMemberProfile,
  LifecycleStage,
  LobbyUserProfile,
  Member,
  NdoDescriptor,
  NdoInput,
  NdoTransitionHistoryEvent,
  Person,
  PersonRole,
  PropertyRegime,
  ResourceNature,
  ResourceScope,
  ResourceSpecificationInput,
  ResourceSpecificationListing,
  Rivalry,
  RuleData,
  GovernanceRuleInput,
  LogEconomicEventInput,
  VfAction,
  VfCommitment,
  VfEconomicEvent
} from './types';
import {
  checkActionPermitted,
  checkRuleDataPermitted,
  checkScopeCoherence,
  hasHardViolation,
  type ResourceClassification
} from './constraints';
import { urlParam } from './url-state.svelte';
import {
  INITIAL_EVENTS,
  INITIAL_GROUPS,
  INITIAL_GROUP_MEMBERS,
  INITIAL_GROUP_NDOS,
  INITIAL_LOBBY_PROFILE,
  INITIAL_MY_ROLES,
  INITIAL_NDOS,
  INITIAL_NDO_MEMBERS,
  INITIAL_PERSONS,
  INITIAL_RESOURCES,
  INITIAL_RULES,
  INITIAL_SPEC_LISTINGS,
  INITIAL_COMMITMENTS,
  INITIAL_TRANSITIONS,
  ME_AGENT_B64
} from './mock';

export { ME_AGENT_B64 };

// ── data states ─────────────────────────────────────────────────────────────
//
// Every screen below is one the app renders today. Most of them nobody can
// reach on demand: a spinner shows for as long as the conductor takes, an error
// banner needs a broken conductor, an onboarding panel needs a fresh agent with
// no groups. They are implemented, they are unreachable, and so they go
// unreviewed — which is exactly the class of screen a design system exists to
// hold still.
//
// `?state=` picks which one the mock layer serves. The replica components never
// see the param: they read `lobbyStore.isLoading` and `appContext.myAgentPubKey`
// as they always have, and the store decides what those mean. That is the whole
// trick, and it is why the components stay copies rather than forks.

export type DataState =
  | 'default'
  | 'loading'
  | 'error'
  | 'empty'
  | 'onboarding'
  | 'filtered'
  | 'filtered-empty'
  | 'no-profile'
  | 'anonymous';

/** The variant the URL asks for. Reactive: `page` is, and `urlParam` reads it. */
const ds = (): DataState => (urlParam('state') as DataState | null) ?? 'default';

/** Preset filters for the two filtered variants, so the reviewer sees the
 *  "(N results)" count and the Clear filters affordance without clicking. */
const FILTER_PRESET: Record<string, ActiveFilters> = {
  filtered: { stages: ['Active', 'Stable'], natures: [], regimes: [] },
  'filtered-empty': { stages: ['Ideation'], natures: ['Digital'], regimes: [] }
};

// ── appContext ──────────────────────────────────────────────────────────────

const ctx = $state({
  lobbyUserProfile: { ...INITIAL_LOBBY_PROFILE } as LobbyUserProfile | null,
  /** Base64 in the prototype; a Uint8Array in production. */
  myAgentPubKey: ME_AGENT_B64 as string | null,
  myPerson: { name: 'Ada Riverstone', agent_pub_key: ME_AGENT_B64 } as Person | null,
  currentView: 'lobby' as 'lobby' | 'group' | 'ndo',
  selectedGroupId: null as string | null,
  selectedNdoId: null as string | null,
  /** Per-group Level 2 disclosure choices. localStorage in production. */
  groupMemberProfiles: {} as Record<string, GroupMemberProfile>
});

/** Accessors rather than a plain `$state` object, so `?state=` can withhold the
 *  Level 1 profile or the agent key without any component knowing. Production is
 *  a plain object; the shape a component sees is identical. */
export const appContext = {
  get lobbyUserProfile() {
    return ds() === 'no-profile' ? null : ctx.lobbyUserProfile;
  },
  set lobbyUserProfile(v: LobbyUserProfile | null) {
    ctx.lobbyUserProfile = v;
  },
  get myAgentPubKey() {
    return ds() === 'anonymous' ? null : ctx.myAgentPubKey;
  },
  set myAgentPubKey(v: string | null) {
    ctx.myAgentPubKey = v;
  },
  get myPerson() {
    return ds() === 'anonymous' ? null : ctx.myPerson;
  },
  set myPerson(v: Person | null) {
    ctx.myPerson = v;
  },
  get currentView() {
    return ctx.currentView;
  },
  set currentView(v: 'lobby' | 'group' | 'ndo') {
    ctx.currentView = v;
  },
  get selectedGroupId() {
    return ctx.selectedGroupId;
  },
  set selectedGroupId(v: string | null) {
    ctx.selectedGroupId = v;
  },
  get selectedNdoId() {
    return ctx.selectedNdoId;
  },
  set selectedNdoId(v: string | null) {
    ctx.selectedNdoId = v;
  },
  get groupMemberProfiles() {
    return ctx.groupMemberProfiles;
  }
};

// ── shared mutable data ─────────────────────────────────────────────────────

const data = $state({
  ndos: INITIAL_NDOS.map((n) => ({ ...n })) as NdoDescriptor[],
  groups: INITIAL_GROUPS.map((g) => ({ ...g })) as GroupDescriptor[],
  groupNdoHashes: { ...INITIAL_GROUP_NDOS } as Record<string, string[]>,
  groupMembers: { ...INITIAL_GROUP_MEMBERS } as Record<string, Member[]>,
  transitions: { ...INITIAL_TRANSITIONS } as Record<string, NdoTransitionHistoryEvent[]>,
  // Layer 1 and Layer 2 collections live here rather than being read straight
  // off the INITIAL_* constants, because a create has to show up on the next
  // screen (ISA criterion 6) and a module constant cannot carry that.
  specListings: INITIAL_SPEC_LISTINGS.map((l) => ({ ...l })) as ResourceSpecificationListing[],
  resources: structuredClone(INITIAL_RESOURCES) as Record<string, EconomicResourceRow[]>,
  rules: structuredClone(INITIAL_RULES) as Record<string, GovernanceRule[]>,
  events: structuredClone(INITIAL_EVENTS) as Record<string, VfEconomicEvent[]>,
  commitments: structuredClone(INITIAL_COMMITMENTS) as Record<string, VfCommitment[]>,
  ndoMembers: structuredClone(INITIAL_NDO_MEMBERS) as Record<string, Member[]>
});

export const persons: Person[] = INITIAL_PERSONS;

let seq = 0;
const mockHash = (prefix: string) => `${prefix}${(++seq).toString().padStart(2, '0')}mockHashPlaceholder000000000`;

// ── lobbyStore ──────────────────────────────────────────────────────────────

function matchesFilters(d: NdoDescriptor, f: ActiveFilters): boolean {
  const stageOk =
    f.stages.length === 0 ||
    (d.lifecycle_stage !== null && f.stages.includes(d.lifecycle_stage as LifecycleStage));
  const natureOk =
    f.natures.length === 0 ||
    (d.resource_nature !== null && f.natures.includes(d.resource_nature as ResourceNature));
  const regimeOk =
    f.regimes.length === 0 ||
    (d.property_regime !== null && f.regimes.includes(d.property_regime as PropertyRegime));
  return stageOk && natureOk && regimeOk;
}

const lobbyState = $state({
  activeFilters: { stages: [], natures: [], regimes: [] } as ActiveFilters,
  isLoading: false,
  errorMessage: null as string | null
});

/** Variants that leave the browser with nothing to list. `onboarding` also
 *  withholds the groups, which is what swaps the plain empty line for the
 *  dashed Create-or-join panel. */
const EMPTY_STATES = new Set<DataState>(['loading', 'error', 'empty', 'onboarding']);

export const lobbyStore = {
  get groups() { return ds() === 'onboarding' ? [] : data.groups; },
  get ndos() { return data.ndos; },
  get filteredNdos() {
    if (EMPTY_STATES.has(ds())) return [];
    return data.ndos.filter((d) => matchesFilters(d, this.activeFilters));
  },
  get activeFilters() { return FILTER_PRESET[ds()] ?? lobbyState.activeFilters; },
  get isLoading() { return ds() === 'loading' || lobbyState.isLoading; },
  get errorMessage() {
    return ds() === 'error'
      ? 'Failed to load NDOs: the conductor closed the connection.'
      : lobbyState.errorMessage;
  },
  get myPerson() { return appContext.myPerson; },

  loadLobby() { return Promise.resolve(); },
  loadNdos() { return Promise.resolve(); },

  setFilters(partial: Partial<ActiveFilters>) {
    lobbyState.activeFilters = { ...lobbyState.activeFilters, ...partial };
  },
  clearFilters() {
    lobbyState.activeFilters = { stages: [], natures: [], regimes: [] };
  },

  createGroup(name: string, createdBy?: string): Promise<GroupDescriptor> {
    const id = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${(1000 + ++seq).toString(16)}`;
    const group: GroupDescriptor = { id, name, createdBy, createdAt: Date.now() * 1000 };
    data.groups = [...data.groups, group];
    data.groupNdoHashes[id] = [];
    data.groupMembers[id] = [{ id: 'me', name: appContext.lobbyUserProfile?.nickname ?? 'You' }];
    return Promise.resolve(group);
  },

  joinGroup(code: string): Promise<GroupDescriptor | null> {
    const id = code.replace(/^.*[?&]group=/, '').trim();
    const group = data.groups.find((g) => g.id === id) ?? null;
    if (group) {
      const members = data.groupMembers[group.id] ?? [];
      if (!members.some((m) => m.id === 'me')) {
        data.groupMembers[group.id] = [
          ...members,
          { id: 'me', name: appContext.lobbyUserProfile?.nickname ?? 'You' }
        ];
      }
    }
    return Promise.resolve(group);
  },

  generateInviteLink(groupId: string): Promise<string> {
    return Promise.resolve(`${location.origin}${location.pathname}?group=${groupId}`);
  },

  saveGroupMemberProfile(groupId: string, profile: GroupMemberProfile) {
    appContext.groupMemberProfiles[groupId] = profile;
    return Promise.resolve();
  }
};

// ── groupStore ──────────────────────────────────────────────────────────────

const groupState = $state({
  groupId: null as string | null,
  isLoading: false,
  errorMessage: null as string | null
});

export const groupStore = {
  get group() { return data.groups.find((g) => g.id === groupState.groupId) ?? null; },
  get groupNdos() {
    if (EMPTY_STATES.has(ds())) return [];
    const hashes = groupState.groupId ? (data.groupNdoHashes[groupState.groupId] ?? []) : [];
    return hashes.map((h) => data.ndos.find((n) => n.hash === h)).filter((n): n is NdoDescriptor => !!n);
  },
  get members() {
    if (EMPTY_STATES.has(ds())) return [];
    return groupState.groupId ? (data.groupMembers[groupState.groupId] ?? []) : [];
  },
  get isLoading() { return ds() === 'loading' || groupState.isLoading; },
  get errorMessage() {
    return ds() === 'error'
      ? 'Failed to load the group: this clone cell is not installed on your conductor.'
      : groupState.errorMessage;
  },

  loadGroupData(groupId: string) {
    groupState.groupId = groupId;
    return Promise.resolve();
  },
  refreshCurrentGroup() { return Promise.resolve(); },

  createNdo(input: NdoInput): Promise<string | null> {
    const hash = mockHash('uhC0k');
    const descriptor: NdoDescriptor = {
      hash,
      name: input.name,
      lifecycle_stage: input.lifecycle_stage,
      property_regime: input.property_regime,
      resource_nature: input.resource_nature,
      description: input.description ?? null,
      initiator: ME_AGENT_B64,
      created_at: Date.now() * 1000,
      successor_ndo_hash: null,
      hibernation_origin: null,
      // `null`, not the nature default. The descriptor field records whether the
      // creator OVERRODE the nature's rivalry, and NdoCreateModal leaves it unset
      // unless they picked one, so writing a default here would show every new NDO
      // as carrying an explicit override it never had.
      rivalry_override: input.rivalry_override ?? null
    };
    data.ndos = [descriptor, ...data.ndos];
    if (groupState.groupId) {
      data.groupNdoHashes[groupState.groupId] = [
        hash,
        ...(data.groupNdoHashes[groupState.groupId] ?? [])
      ];
    }
    return Promise.resolve(hash);
  }
};

// ── resourceStore ───────────────────────────────────────────────────────────

/** Production surfaces a failed write as a message under the form. `?state=error`
 *  is what drives it here, since a lookup against module state cannot fail. */
const storeError = (verb: string) => (ds() === 'error' ? `Failed to ${verb}: the conductor rejected the write.` : null);

export const resourceStore = {
  get resourceSpecificationListings(): ResourceSpecificationListing[] { return data.specListings; },
  fetchAllResourceSpecifications() { return Promise.resolve(); },
  get errorMessage() { return storeError('create'); },

  /** Layer 1 activation. Refuses on a Hard scope violation, the way the zome does. */
  createResourceSpecification(input: ResourceSpecificationInput, _cellId?: CellId): Promise<ActionHash | null> {
    const ndo = data.ndos.find((n) => n.hash === input.ndo_identity_hash);
    const ctx: ResourceClassification = {
      property_regime: (ndo?.property_regime ?? 'Private') as PropertyRegime,
      resource_nature: (ndo?.resource_nature ?? 'Physical') as ResourceNature,
      rivalry_override: (ndo?.rivalry_override ?? null) as Rivalry | null
    };
    const scopeViolation = checkScopeCoherence(ctx, input.scope);
    if (scopeViolation && scopeViolation.severity === 'Hard') return Promise.resolve(null);

    const hash = mockHash('uhC0k');
    data.specListings = [
      ...data.specListings,
      {
        action_hash: hash,
        specification: {
          name: input.name,
          description: input.description,
          category: input.category,
          image_url: input.image_url,
          tags: input.tags,
          is_active: true,
          scope: input.scope,
          ndo_identity_hash: input.ndo_identity_hash
        }
      }
    ];
    data.resources[hash] = [];
    for (const nested of input.governance_rules) {
      data.rules[hash] = [
        ...(data.rules[hash] ?? []),
        {
          rule_data: nested.rule_data,
          enforced_by: nested.enforced_by,
          ndo_identity_hash: input.ndo_identity_hash,
          property_regime: ctx.property_regime,
          resource_nature: ctx.resource_nature,
          rivalry_override: ctx.rivalry_override ?? undefined
        }
      ];
    }
    return Promise.resolve(hash);
  },

  /** Attaches a typed rule. Refuses on Hard, accepts on Soft, like the zome. */
  createGovernanceRule(input: GovernanceRuleInput, _cellId?: CellId): Promise<boolean> {
    const ctx: ResourceClassification = {
      property_regime: input.property_regime,
      resource_nature: input.resource_nature,
      rivalry_override: input.rivalry_override
    };
    if (hasHardViolation(checkRuleDataPermitted(ctx, input.rule_data))) return Promise.resolve(false);
    const key = input.specification_hash ?? input.ndo_identity_hash;
    data.rules[key] = [
      ...(data.rules[key] ?? []),
      {
        rule_data: input.rule_data,
        enforced_by: input.enforced_by,
        ndo_identity_hash: input.ndo_identity_hash,
        property_regime: input.property_regime,
        resource_nature: input.resource_nature,
        rivalry_override: input.rivalry_override
      }
    ];
    return Promise.resolve(true);
  },

  /** The dry-run path: the form calls this as it changes and renders the verdict. */
  checkRuleDataConstraints(
    input: { property_regime: PropertyRegime; resource_nature: ResourceNature; rivalry_override?: Rivalry; rule_data: RuleData },
    _cellId?: CellId
  ): Promise<ConstraintViolation[]> {
    return Promise.resolve(checkRuleDataPermitted(input, input.rule_data));
  },

  /** Same dry run for the scope lock SpecificationCreateModal needs (REQ-RES-03). */
  checkScopeConstraints(
    input: { property_regime: PropertyRegime; resource_nature: ResourceNature; rivalry_override?: Rivalry; scope: ResourceScope },
    _cellId?: CellId
  ): Promise<ConstraintViolation[]> {
    const v = checkScopeCoherence(input, input.scope);
    return Promise.resolve(v ? [v] : []);
  }
};

// ── governanceStore ─────────────────────────────────────────────────────────

export const governanceStore = {
  get errorMessage() { return storeError('write'); },

  getCommitments(ndoHash: string): VfCommitment[] { return data.commitments[ndoHash] ?? []; },

  /**
   * Every commitment on the cell, unfiltered, mirroring `fetchAllCommitments`.
   *
   * `getCommitments(ndoHash)` above answers the same question with a narrower
   * query, and that difference is the last declared divergence in the replica.
   * It matters more than it looks: the app's `ActivityTab` reads ALL commitments
   * and filters client-side on `ndo_identity_hash`, so what a reviewer is looking
   * at is a screen whose cost grows with the whole cell rather than with this
   * NDO. A prototype that pre-filters shows the same rows and hides that fact,
   * and hiding it is how a performance question stops being askable from the kit.
   *
   * The `data.commitments` map is keyed by NDO hash purely for cheap writes, so
   * flattening here is an implementation detail rather than a second source.
   */
  fetchAllCommitments(_cellId?: CellId): Promise<VfCommitment[]> {
    if (EMPTY_STATES.has(ds())) return Promise.resolve([]);
    return Promise.resolve(Object.values(data.commitments).flat());
  },

  proposeCommitment(
    input: { action: VfAction; provider: AgentPubKey; due_date: number; note: string | null; ndo_identity_hash: ActionHash },
    _cellId?: CellId
  ): Promise<ActionHash | null> {
    const ndo = data.ndos.find((n) => n.hash === input.ndo_identity_hash);
    const ctx: ResourceClassification = {
      property_regime: (ndo?.property_regime ?? 'Private') as PropertyRegime,
      resource_nature: (ndo?.resource_nature ?? 'Physical') as ResourceNature,
      rivalry_override: (ndo?.rivalry_override ?? null) as Rivalry | null
    };
    if (hasHardViolation(checkActionPermitted(ctx, input.action))) return Promise.resolve(null);
    const hash = mockHash('uhCkk');
    data.commitments[input.ndo_identity_hash] = [
      ...(data.commitments[input.ndo_identity_hash] ?? []),
      {
        action: input.action,
        provider: input.provider,
        receiver: ME_AGENT_B64,
        resource_inventoried_as: null,
        resource_conforms_to: null,
        input_of: null,
        due_date: input.due_date,
        note: input.note,
        committed_at: Date.now() * 1000,
        ndo_identity_hash: input.ndo_identity_hash
      }
    ];
    return Promise.resolve(hash);
  },

  logEconomicEvent(input: LogEconomicEventInput, _cellId?: CellId): Promise<ActionHash | null> {
    const ndo = data.ndos.find((n) => n.hash === input.ndo_identity_hash);
    const ctx: ResourceClassification = {
      property_regime: (ndo?.property_regime ?? 'Private') as PropertyRegime,
      resource_nature: (ndo?.resource_nature ?? 'Physical') as ResourceNature,
      rivalry_override: (ndo?.rivalry_override ?? null) as Rivalry | null
    };
    if (hasHardViolation(checkActionPermitted(ctx, input.action))) return Promise.resolve(null);
    const hash = mockHash('uhCkk');
    const key = input.resource_inventoried_as;
    data.events[key] = [
      ...(data.events[key] ?? []),
      {
        action: input.action,
        provider: input.provider,
        receiver: input.receiver,
        resource_inventoried_as: key,
        affects: key,
        resource_quantity: input.resource_quantity,
        event_time: Date.now() * 1000,
        note: input.note,
        ndo_identity_hash: input.ndo_identity_hash
      }
    ];
    return Promise.resolve(hash);
  },

  checkActionConstraints(
    input: { property_regime: PropertyRegime; resource_nature: ResourceNature; rivalry_override?: Rivalry; action: VfAction },
    _cellId?: CellId
  ): Promise<ConstraintViolation[]> {
    return Promise.resolve(checkActionPermitted(input, input.action));
  }
};

// ── service-shaped lookups (what the Effect services return) ────────────────

export const ndoService = {
  /** Production holds these in NdoView's own `$state`, written by an async load.
   *  Here they come from `?state=`, because a lookup against module state can
   *  neither be slow nor fail, and both screens exist in the app. */
  get isLoading() { return ds() === 'loading'; },
  get loadError() {
    return ds() === 'error' ? 'Failed to load this NDO: no such record on the DHT.' : null;
  },
  getDescriptor(hash: string): NdoDescriptor | null {
    if (ds() === 'loading' || ds() === 'error') return null;
    return data.ndos.find((n) => n.hash === hash) ?? null;
  },
  getTransitionHistory(hash: string): NdoTransitionHistoryEvent[] {
    if (EMPTY_STATES.has(ds())) return [];
    return data.transitions[hash] ?? [];
  },
  updateLifecycleStage(hash: string, newStage: LifecycleStage, successorHash?: string) {
    const ndo = data.ndos.find((n) => n.hash === hash);
    if (!ndo) return;
    const from = ndo.lifecycle_stage ?? '';
    if (newStage === 'Hibernating') ndo.hibernation_origin = from;
    else if (from === 'Hibernating') ndo.hibernation_origin = null;
    if (newStage === 'Deprecated' && successorHash) ndo.successor_ndo_hash = successorHash;
    ndo.lifecycle_stage = newStage;
    data.transitions[hash] = [
      ...(data.transitions[hash] ?? []),
      {
        from_stage: from,
        to_stage: newStage,
        agent: ME_AGENT_B64,
        timestamp: Date.now() * 1000,
        event_hash: mockHash('uhCkk')
      }
    ];
  },
  // NDO membership. This was a hardcoded empty array with a comment saying
  // "production returns a stub error here", and NdoView rendered a matching
  // "not yet implemented on the DHT" notice. That was true of the app until
  // PR #129 (join, list, is-member on the per-NDO cell) and has been false
  // since. The replica kept telling reviewers that a shipped feature does not
  // exist, which is worse than omitting it: an omission looks like a gap, and
  // this looked like an answer.
  //
  // The app's `NdoView` holds `ndoMembers`, `membersLoading` and `membersError`
  // in its own `$state` and fills them from `NdoServiceTag.getNdoMembers`.
  // `joinNdo` is idempotent behind an `is_ndo_member` guard, so joining twice
  // is a no-op rather than a duplicate row, and that is mirrored here.

  isNdoMember(hash: string): boolean {
    return (data.ndoMembers[hash] ?? []).some((m) => m.id === 'me');
  },

  getNdoMembers(hash: string): Member[] {
    if (EMPTY_STATES.has(ds())) return [];
    return data.ndoMembers[hash] ?? [];
  },

  joinNdo(hash: string): Promise<boolean> {
    if (this.isNdoMember(hash)) return Promise.resolve(true);
    data.ndoMembers[hash] = [
      ...(data.ndoMembers[hash] ?? []),
      {
        id: 'me',
        name: appContext.lobbyUserProfile?.nickname ?? 'You',
        role: 'Member'
      }
    ];
    return Promise.resolve(true);
  }
};

export const personService = {
  getAllPersons(): Person[] { return persons; },
  getPersonRoles(): PersonRole[] { return INITIAL_MY_ROLES; }
};

export const resourceService = {
  getResourcesBySpecification(specHash: string): EconomicResourceRow[] {
    return data.resources[specHash] ?? [];
  },
  getGovernanceRules(specHash: string): GovernanceRule[] {
    return data.rules[specHash] ?? [];
  }
};

export const governanceService = {
  getEventsByResource(resourceHash: string): VfEconomicEvent[] {
    return data.events[resourceHash] ?? [];
  },

  /**
   * Every economic event on the cell, unfiltered. Mirrors `getAllEconomicEvents`.
   *
   * `ActivityTab` needs this as a SECOND pass, not as a replacement for the
   * specification walk. The app does both: it walks the NDO's specifications and
   * each specification's resources collecting their events, and then, under its
   * own comment "Also include any agent-wide events that carry this ndo hash",
   * reads every event on the cell and merges the ones whose `ndo_identity_hash`
   * matches and that the walk did not already produce, deduping on the triple
   * `(event_time, action, resource_quantity)`.
   *
   * The case that needs it is an event tagged to this NDO whose resource hangs
   * off a specification the walk never visits. The walk cannot reach it by
   * construction, so a prototype with only the walk renders an activity feed
   * that is silently short, and short in a way no fixture will show you unless
   * someone seeds exactly that shape.
   *
   * I argued this half was not divergent, on a grep window that ended four lines
   * above the second query. It was wrong, and it was wrong in the direction that
   * would have closed the gap while leaving it open.
   */
  getAllEconomicEvents(_cellId?: CellId): VfEconomicEvent[] {
    if (EMPTY_STATES.has(ds())) return [];
    return Object.values(data.events).flat();
  }
};

// ── ndoDescriptorCache (production has the same module) ─────────────────────

const cache = new Map<string, NdoDescriptor>();
export const ndoDescriptorCache = {
  get: (k: string) => cache.get(k),
  set: (k: string, v: NdoDescriptor) => cache.set(k, v)
};
