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
  ActiveFilters,
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
  ResourceSpecificationListing,
  VfEconomicEvent
} from './types';
import { urlParam } from './url-state.svelte';
import {
  INITIAL_EVENTS,
  INITIAL_GROUPS,
  INITIAL_GROUP_MEMBERS,
  INITIAL_GROUP_NDOS,
  INITIAL_LOBBY_PROFILE,
  INITIAL_MY_ROLES,
  INITIAL_NDOS,
  INITIAL_PERSONS,
  INITIAL_RESOURCES,
  INITIAL_RULES,
  INITIAL_SPEC_LISTINGS,
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
  transitions: { ...INITIAL_TRANSITIONS } as Record<string, NdoTransitionHistoryEvent[]>
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
      hibernation_origin: null
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

export const resourceStore = {
  get resourceSpecificationListings(): ResourceSpecificationListing[] { return INITIAL_SPEC_LISTINGS; },
  fetchAllResourceSpecifications() { return Promise.resolve(); }
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
  /** Production returns a stub error here; the screen renders that message. */
  getNdoMembers(): Member[] { return []; }
};

export const personService = {
  getAllPersons(): Person[] { return persons; },
  getPersonRoles(): PersonRole[] { return INITIAL_MY_ROLES; }
};

export const resourceService = {
  getResourcesBySpecification(specHash: string): EconomicResourceRow[] {
    return INITIAL_RESOURCES[specHash] ?? [];
  },
  getGovernanceRules(specHash: string): GovernanceRule[] {
    return INITIAL_RULES[specHash] ?? [];
  }
};

export const governanceService = {
  getEventsByResource(resourceHash: string): VfEconomicEvent[] {
    return INITIAL_EVENTS[resourceHash] ?? [];
  }
};

// ── ndoDescriptorCache (production has the same module) ─────────────────────

const cache = new Map<string, NdoDescriptor>();
export const ndoDescriptorCache = {
  get: (k: string) => cache.get(k),
  set: (k: string, v: NdoDescriptor) => cache.set(k, v)
};
