// The A to E prototype store: one reactive singleton over ./logic.ts.
//
// Equivalent to the handoff's `useProto()` hook, with one difference in
// shape: it is a module-level singleton, not a hook, so every component of a
// direction reads the same state without passing it down. All five shared-store
// directions persist under ONE key, which is what makes cross-direction
// continuity work: pick up a signal in D, then see the trace in A.
//
// What this layer adds to the pure logic:
//   - persistence to localStorage (every access guarded; private mode works,
//     it just forgets on reload),
//   - `load()`, which honours ?fresh=1 and ?example=1,
//   - the write lifecycle each toast shows: "Saved on your device", then
//     "Sharing with your groups" (n of 23), then "Shared and confirmed", or
//     queued while offline and propagated on reconnect,
//   - the acting agent (always the prototype's own key, ME_ID).
//
// It must only be touched in the browser. The direction layout calls `load()`
// once mounted and renders the direction after that; see ../README.md.

import { fromStore } from 'svelte/store';
import { developer, type WriteStage } from '../plain';
import * as L from './logic';

export const STORE_KEY = 'ndo-proto-shared-v1';

export interface Toast {
  id: string;
  title: string;
  stage: WriteStage;
  peers: number;
}

export type Result<V = undefined> = { ok: true; value: V } | { ok: false; error: string };

// Unique across reloads, because ids are persisted.
let uid = Date.now() % 1e9;
const ctx = (): L.Ctx => ({
  me: L.ME_ID,
  id: (prefix) => prefix + uid++,
  hash: () => 'uhC0' + Math.random().toString(36).slice(2, 10)
});

let state = $state.raw<L.ProtoState>(L.exampleState());
let toasts = $state.raw<Toast[]>([]);
let ready = $state(false);

const dev = fromStore(developer);
const signals = $derived(L.deriveSignals(state, L.ME_ID, dev.current));

function save(): void {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or disabled: the session keeps working in memory.
  }
}

function commit(next: L.ProtoState): void {
  state = next;
  save();
}

// ── Toasts and the write lifecycle ────────────────────────────────────────

function pushToast(t: Omit<Toast, 'id'>, ttl = 5200): string {
  const id = 'k' + uid++;
  toasts = [...toasts, { id, ...t }];
  setTimeout(() => dropToast(id), ttl);
  return id;
}

function patchToast(id: string, p: Partial<Toast>): void {
  toasts = toasts.map((t) => (t.id === id ? { ...t, ...p } : t));
}

export function dropToast(id: string): void {
  toasts = toasts.filter((t) => t.id !== id);
}

/** Runs one write through signed, gossiping, validated (or queued offline).
 *  The trace it left follows the same stages and pays out its receipts when
 *  validated. */
function lifecycle(w: L.Write): void {
  const offline = state.offline;
  const tid = pushToast({ title: w.title, stage: offline ? 'queued' : 'signed', peers: 0 });
  if (offline) return;
  setTimeout(() => {
    patchToast(tid, { stage: 'gossip' });
    if (w.traceId) commit(L.patchTrace(state, w.traceId, { status: 'gossip' }));
  }, 700);
  let peers = 0;
  const iv = setInterval(() => {
    peers = Math.min(23, peers + 4 + Math.floor(Math.random() * 4));
    patchToast(tid, { peers });
    if (peers >= 23) clearInterval(iv);
  }, 300);
  setTimeout(() => {
    clearInterval(iv);
    patchToast(tid, { stage: 'validated', peers: 23 });
    if (w.traceId) commit(L.settleTrace(state, ctx(), w.traceId, ['Marco', 'FabLab node']));
  }, 2600);
}

function run<V>(o: L.Outcome<V>): Result<V> {
  if (!o.ok) return { ok: false, error: o.error };
  commit(o.state);
  o.writes.forEach(lifecycle);
  return { ok: true, value: o.value };
}

// ── Loading ───────────────────────────────────────────────────────────────

/**
 * Bring the store up in the browser. Honours ?fresh=1 (start over as a new
 * person: no profile, no groups) and ?example=1 (reload the example network);
 * otherwise restores what this browser saved, or the example on first visit.
 * Returns the flags it consumed, so the caller can drop them from the URL and
 * a reload does not reset again.
 */
export function load(search: URLSearchParams): { consumed: string[] } {
  developer.refresh();
  if (search.get('fresh') === '1') {
    commit(L.freshState());
    ready = true;
    return { consumed: ['fresh'] };
  }
  if (search.get('example') === '1') {
    commit(L.exampleState());
    ready = true;
    return { consumed: ['example'] };
  }
  if (!ready) {
    let restored: L.ProtoState | null = null;
    try {
      const raw = localStorage.getItem(STORE_KEY);
      restored = raw ? L.normalizeLoaded(JSON.parse(raw), ctx().id) : null;
    } catch {
      restored = null;
    }
    state = restored ?? L.exampleState();
    save();
    ready = true;
  }
  return { consumed: [] };
}

// ── Actions: one per useProto() action, same arguments ────────────────────

export const actions = {
  /** Signals route to the zome call they were derived from. */
  pickUp: (sig: L.Signal) => run(L.pickUp(state, ctx(), sig)),
  /** zome_gouvernance::create_validation_receipt */
  validate: (ref: string, ndo: string) => run(L.validate(state, ctx(), ref, ndo)),
  /** zome_gouvernance::log_economic_event (+ issue_participation_receipts for Work) */
  logEvent: (ndo: string, i: number, action: string, note?: string) => run(L.logEvent(state, ctx(), ndo, i, action, note)),
  /** zome_group::log_work */
  logWork: (ndo: string, description: string, hours: number | string) => run(L.logWork(state, ctx(), ndo, description, hours)),
  /** log_economic_event(Cite) → zome_gouvernance::create_ndo_hard_link */
  hardLink: (from: string, to: string, type: string) => run(L.hardLink(state, ctx(), from, to, type)),
  /** zome_resource::update_lifecycle_stage (initiator only) */
  advance: (ndo: string, to: string, successor?: string) => run(L.advance(state, ctx(), ndo, to, successor)),
  /** zome_resource::create_ndo → zome_group::create_ndo_anchor. `value` is the new id. */
  createNdo: (f: L.NdoForm) => run(L.createNdo(state, ctx(), f)),
  /** zome_person::create_person / update_person, assign_person_role */
  updateProfile: (p: L.ProfileForm) => run(L.updateProfile(state, ctx(), p)),
  /** zome_group::create_group (+ lobby::announce_group). `value` is { id, invite }. */
  createGroup: (g: { name: string; desc?: string }) => run(L.createGroup(state, ctx(), g)),
  /** zome_group::join_group. `value` is { id }. */
  joinGroup: (code: string) => run(L.joinGroup(state, ctx(), code)),
  /** zome_resource::create_governance_rule */
  addRule: (ndo: string, type: string, summary: string) => run(L.addRule(state, ctx(), ndo, type, summary)),
  /** zome_resource::create_economic_resource */
  addInstance: (ndo: string, label: string) => run(L.addInstance(state, ctx(), ndo, label)),
  /** zome_resource::update_operational_state (custodian only) */
  setOpState: (ndo: string, i: number, st: string) => run(L.setOpState(state, ctx(), ndo, i, st)),
  /** transfer_custody → log_economic_event(TransferCustody) → issue_participation_receipts */
  transferCustody: (ndo: string, i: number, to: string) => run(L.transferCustody(state, ctx(), ndo, i, to)),
  /** zome_gouvernance::propose_commitment (receiver is the caller) */
  propose: (f: L.CommitForm) => run(L.propose(state, ctx(), f)),
  /** [transfer_custody →] log_economic_event → claim_commitment → issue_participation_receipts */
  fulfil: (cid: string) => run(L.fulfil(state, ctx(), cid)),
  /** Joins the example network's invites at once (onboarding shortcut). */
  joinDemo: () => run(L.joinDemo(state, ctx())),
  /** Conductor behaviour, not a zome call: writes queue offline and gossip on reconnect. */
  toggleOffline(): void {
    const was = state.offline;
    commit({ ...state, offline: !was });
    if (!was) return;
    const queued = state.traces.filter((t) => t.status === 'queued');
    queued.forEach((t, i) => {
      setTimeout(() => commit(L.patchTrace(state, t.id, { status: 'gossip' })), 400 + i * 200);
      setTimeout(() => commit(L.settleTrace(state, ctx(), t.id, ['Marco'])), 1800 + i * 200);
    });
    if (queued.length) {
      pushToast({ title: queued.length + ' queued trace' + (queued.length > 1 ? 's' : '') + ' propagating', stage: 'gossip', peers: 3 });
    }
  },
  /** Reload the example network. */
  reset(): void {
    try {
      localStorage.removeItem(STORE_KEY);
    } catch {
      // Nothing saved, or storage disabled.
    }
    commit(L.exampleState());
  },
  /** Start over as a brand-new person: no Person entry, no groups. */
  startFresh(): void {
    commit(L.freshState());
  }
};

// ── Queries ───────────────────────────────────────────────────────────────

export const q = {
  ndo: (id: string | null | undefined) => (id ? state.ndos.find((n) => n.id === id) : undefined),
  group: (id: string | null | undefined) => (id ? state.groups.find((g) => g.id === id) : undefined),
  tracesOf: (id: string) => state.traces.filter((t) => t.ndo === id),
  signalsOf: (id: string) => signals.filter((g) => g.ndo === id),
  hardLinksOf: (id: string) => state.hardLinks.filter((h) => h.from === id || h.to === id),
  commitmentsOf: (id: string) => state.commitments.filter((c) => c.ndo === id),
  openCommitments: () => state.commitments.filter((c) => c.status === 'open'),
  heatOf: (id: string, decayDays = 14) => L.heatOf(state, id, decayDays),
  agent: (id: string) => L.agentName(state, id),
  reputation: () => L.reputation(state),
  allowedStages: (id: string) => {
    const n = state.ndos.find((x) => x.id === id);
    return n ? L.allowedStages(n) : [];
  }
};

/** The whole store, for components: `proto.s`, `proto.signals`, `proto.actions`, `proto.q`. */
export const proto = {
  /** The persisted state (read-only: change it through `actions`). */
  get s(): L.ProtoState {
    return state;
  },
  /** Derived, never stored. Recomputed when the state or Developer details changes. */
  get signals(): L.Signal[] {
    return signals;
  },
  get toasts(): Toast[] {
    return toasts;
  },
  /** False until `load()` has run in the browser. */
  get ready(): boolean {
    return ready;
  },
  /** Developer details, reactive. Same value as `$developer`. */
  get dev(): boolean {
    return dev.current;
  },
  /** The acting agent. */
  get me(): { id: string; name: string; roles: L.RoleType[]; avatar: string | null } {
    const p = state.profile;
    return {
      id: L.ME_ID,
      name: p ? p.name : 'New agent',
      roles: state.roles ?? L.DEFAULT_ROLES,
      avatar: p && p.avatar.startsWith('https://') ? p.avatar : null
    };
  },
  actions,
  q,
  load,
  dropToast
};
