// Single module-level $state singleton imported by every app page. Instantiated
// once at module scope, so creates, edits, lifecycle transitions and modal
// targets persist across client-side navigations within a session.
//
// The flow guards (joining, lifecycle) keep their own singletons under guards/ —
// they own "what state is the agent or the NDO in". This owns the domain data
// and the layer-level modals.

import type {
  Agent,
  Agreement,
  ConfirmTarget,
  Contribution,
  EconomicResource,
  GroupDescriptor,
  GroupMemberProfile,
  LifecycleStage,
  LobbyUserProfile,
  NdoDescriptor,
  NdoHardLink,
  NdoTransitionHistoryEvent,
  ToastTarget,
  WorkLogEntry,
} from './types';
import {
  INITIAL_AGENTS,
  INITIAL_AGREEMENTS,
  INITIAL_CONTRIBUTIONS,
  INITIAL_GROUPS,
  INITIAL_HARD_LINKS,
  INITIAL_NDOS,
  INITIAL_PROFILE,
  INITIAL_RESOURCES,
  INITIAL_TRANSITIONS,
  INITIAL_WORK_LOG,
  ME_ID,
} from './mock';

export { ME_ID } from './mock';

/** Named `appState` (not `state`) so pages can import it and still use the
 *  `$state` rune for local reactive vars without a name clash. */
export const appState = $state({
  ndos: INITIAL_NDOS.map((n) => ({ ...n })) as NdoDescriptor[],
  groups: INITIAL_GROUPS.map((g) => ({ ...g })) as GroupDescriptor[],
  agents: [...INITIAL_AGENTS] as Agent[],
  hardLinks: [...INITIAL_HARD_LINKS] as NdoHardLink[],
  contributions: [...INITIAL_CONTRIBUTIONS] as Contribution[],
  agreements: [...INITIAL_AGREEMENTS] as Agreement[],
  resources: [...INITIAL_RESOURCES] as EconomicResource[],
  workLog: [...INITIAL_WORK_LOG] as WorkLogEntry[],

  /** Transition history, keyed by NDO id. Seeded only for the mature NDO so the
   *  history panel has something to render; every recorded transition appends. */
  transitions: { ndo1: [...INITIAL_TRANSITIONS] } as Record<string, NdoTransitionHistoryEvent[]>,

  /** Level 1 identity. `null` = the agent has not set up a lobby profile. */
  profile: { ...INITIAL_PROFILE } as LobbyUserProfile | null,

  /** Which group the sidebar considers selected. Drives the context-aware
   *  "New NDO" link (REQ-UI-NAV-03). */
  selectedGroupId: 'gr1' as string | null,

  /** Lobby filter chips. OR within a dimension, AND across dimensions
   *  (REQ-UI-LOBBY-01). Empty set means no constraint. */
  filters: {
    stages: [] as LifecycleStage[],
    natures: [] as string[],
    regimes: [] as string[],
  },

  /** Layer-level modals, rendered once by the app layout. */
  confirmModal: null as ConfirmTarget | null,
  toast: null as ToastTarget | null,
});

// ── Lookups ──────────────────────────────────────────────────────────────────

export const ndoById = (id: string) => appState.ndos.find((n) => n.id === id);
export const groupById = (id: string) => appState.groups.find((g) => g.id === id);
export const agentById = (id: string) => appState.agents.find((a) => a.id === id);

/** How the UI names an agent: the Person entry's name, else a truncated
 *  AgentPubKey (REQ-UI-NDO-02). */
export function agentLabel(id: string): string {
  const a = agentById(id);
  if (!a) return id;
  return a.person?.name ?? a.pubKey;
}

export const ndosForGroup = (groupId: string) =>
  appState.ndos.filter((n) => n.groupIds.includes(groupId));

export const transitionsFor = (ndoId: string) => appState.transitions[ndoId] ?? [];

export const contributionsFor = (ndoId: string) =>
  appState.contributions.filter((c) => c.ndoId === ndoId);

export const resourcesFor = (ndoId: string) =>
  appState.resources.filter((r) => r.ndoId === ndoId);

export const agreementFor = (ndoId: string) =>
  appState.agreements.find((a) => a.ndoId === ndoId) ?? null;

export const linksFor = (ndoId: string) =>
  appState.hardLinks.filter((l) => l.from === ndoId || l.to === ndoId);

export const workLogFor = (groupId: string) =>
  appState.workLog.filter((w) => w.groupId === groupId);

/** The lobby view: every NDO the agent can see across their groups, after the
 *  active filter chips. */
export function filteredNdos(): NdoDescriptor[] {
  const { stages, natures, regimes } = appState.filters;
  return appState.ndos.filter(
    (n) =>
      (stages.length === 0 || stages.includes(n.lifecycle_stage)) &&
      (natures.length === 0 || natures.includes(n.resource_nature)) &&
      (regimes.length === 0 || regimes.includes(n.property_regime))
  );
}

// ── Mutations ────────────────────────────────────────────────────────────────

let seq = 100;
const nextId = (prefix: string) => `${prefix}${++seq}`;

export function createNdo(input: Omit<NdoDescriptor, 'id' | 'hash' | 'initiator' | 'created_at' | 'groupIds'>, groupId: string | null) {
  const id = nextId('ndo');
  const ndo: NdoDescriptor = {
    ...input,
    id,
    hash: `uhC0k${id.toUpperCase()}mock…hash`,
    initiator: ME_ID,
    created_at: new Date().toISOString().slice(0, 10),
    groupIds: groupId ? [groupId] : [],
  };
  appState.ndos = [ndo, ...appState.ndos];
  return ndo;
}

export function recordTransition(
  ndoId: string,
  to: LifecycleStage,
  opts: { successorHash?: string } = {}
) {
  const ndo = ndoById(ndoId);
  if (!ndo) return;
  const from = ndo.lifecycle_stage;

  if (to === 'Hibernating') ndo.hibernation_origin = from;
  if (from === 'Hibernating' && to !== 'Deprecated' && to !== 'EndOfLife') {
    ndo.hibernation_origin = undefined;
  }
  if (to === 'Deprecated' && opts.successorHash) ndo.successor_ndo_hash = opts.successorHash;

  ndo.lifecycle_stage = to;
  const event: NdoTransitionHistoryEvent = {
    from_stage: from,
    to_stage: to,
    agent: ME_ID,
    timestamp: new Date().toISOString().slice(0, 10),
    // Null in the MVP: automatic EconomicEvent generation is backend Phase 2.3.
    event_hash: null,
  };
  appState.transitions[ndoId] = [...transitionsFor(ndoId), event];
}

export function createGroup(name: string, description: string) {
  const id = nextId('gr');
  const group: GroupDescriptor = {
    id,
    networkSeed: id,
    name,
    description,
    createdBy: ME_ID,
    createdAt: new Date().toISOString().slice(0, 10),
    memberIds: [ME_ID],
  };
  appState.groups = [...appState.groups, group];
  appState.selectedGroupId = id;
  return group;
}

export function joinGroup(groupId: string) {
  const g = groupById(groupId);
  if (g && !g.memberIds.includes(ME_ID)) g.memberIds = [...g.memberIds, ME_ID];
  appState.selectedGroupId = groupId;
  return g;
}

export function setGroupMemberProfile(groupId: string, profile: GroupMemberProfile) {
  const g = groupById(groupId);
  if (g) g.memberProfile = profile;
}

export function associateNdo(ndoId: string, groupId: string) {
  const n = ndoById(ndoId);
  if (n && !n.groupIds.includes(groupId)) n.groupIds = [...n.groupIds, groupId];
}

export function addHardLink(from: string, to: string, link_type: NdoHardLink['link_type'], note?: string) {
  appState.hardLinks = [...appState.hardLinks, { id: nextId('hl'), from, to, link_type, note }];
}

export function logWork(groupId: string, summary: string, hours: number) {
  appState.workLog = [
    { id: nextId('wl'), groupId, agent: ME_ID, summary, hours, at: new Date().toISOString().slice(0, 10) },
    ...appState.workLog,
  ];
}

/** Fork is informational in the MVP (REQ-UI-NDO-05): the modal explains the
 *  friction and hands over the initiator's key. Nothing is committed. */
export function toggleFilter(dimension: 'stages' | 'natures' | 'regimes', value: string) {
  const list = appState.filters[dimension] as string[];
  appState.filters[dimension] = (
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
  ) as never;
}

export function clearFilters() {
  appState.filters.stages = [];
  appState.filters.natures = [];
  appState.filters.regimes = [];
}

// ── Layer-level modal helpers ────────────────────────────────────────────────

export function openConfirm(message: string, onConfirm: () => void, detail?: string) {
  appState.confirmModal = { message, detail, onConfirm };
}

export function showToast(kind: ToastTarget['kind'], message: string) {
  appState.toast = { kind, message };
}
