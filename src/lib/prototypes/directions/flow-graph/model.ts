// Direction F's presentation logic, ported from the data-dc-script block of
// "F Flow Graph.dc.html": layout, card titles, badges, subtitles, the actions
// each entry offers and the forms that map one to one onto zome inputs.
//
// Every word comes from $lib/prototypes/plain: the handoff's F_WORD, F_TYPE,
// F_LANE, F_ACT and F_FIELD maps were merged there, so this file keeps none.
import { ACTION_PAST, ACTION_PHRASE, ENTRY_TYPE_WORD, FIELD_WORD, LANE_WORD, plain, ruleSentence, word } from '$lib/prototypes/plain';
import {
  CONDUCTORS,
  ENUMS,
  LANES,
  TYPES,
  allowedTransitions,
  typeSpec,
  type AgentKey,
  type Backend,
  type Data,
  type Entry,
  type EntryType,
  type LaneId,
  type RefCategory
} from './backend';

// ── Geometry (handoff): 250px columns, 218 × 116 cards, 132px apart ──
export const LW = 250;
export const NW = 218;
export const NH = 116;
export const RH = 132;
export const TOP = 20;
export const HEAD = 44;
export const MIN_ZOOM = 0.85;
export const MAX_ZOOM = 1.8;

/** Column dot colours from the handoff README, as DS colour tokens. */
export const LANE_COL: Record<LaneId, string> = {
  group: 'sky-700',
  agent: 'gray-500',
  l0: 'blue-600',
  l1: 'violet-700',
  l2: 'green-700',
  plan: 'amber-600',
  event: 'teal-700',
  ppr: 'rose-700'
};

export const tok = (t: string, a?: number) => (a == null ? `rgb(var(--ndo-${t}))` : `rgb(var(--ndo-${t}) / ${a})`);

export const kebab = (s: string) => String(s).replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
export const short = (h: string | null | undefined) => (h ? h.slice(0, 12) + '…' : 'none');
export const hhmm = (t: number) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

/** Fields the inspector never lists: UI-only mirrors of other fields. */
export const HIDE = new Set(['provider_person', 'receiver_person', 'custodian_person', 'person', 'event_hash_ui', 'owner', 'label', 'agent']);

/** Receipt types by action (handoff "Fulfilling a commitment"). */
export const PPR: Record<string, [string, string | null]> = {
  TransferCustody: ['CustodyTransfer', 'CustodyAcceptance'],
  Move: ['TransportFulfillmentCompleted', null],
  Work: ['MaintenanceFulfillmentCompleted', null],
  Modify: ['MaintenanceFulfillmentCompleted', null],
  Use: ['RuleCompliance', null],
  AccessForUse: ['RuleCompliance', 'RuleCompliance']
};

export type Persp = 'network' | AgentKey;

export interface Ctx {
  B: Backend;
  dev: boolean;
}

export const laneOf = (e: Entry): LaneId => TYPES[e.type].lane;
export const laneIndex = (lane: LaneId) => LANES.findIndex((l) => l.id === lane);
export const typeWord = (t: EntryType, dev: boolean) => (dev ? t : (ENTRY_TYPE_WORD[t] ?? t));
export const laneWord = (id: LaneId, dev: boolean) => (dev ? LANES.find((l) => l.id === id)!.label : (LANE_WORD[id] ?? id));

/** A conductor's display name: its Person entry once it has one (so a new
 *  person in the blank scenario shows the name they gave), else the
 *  scenario's name for that conductor. */
export function aname(B: Backend, a: string): string {
  const p = B.personOf(a);
  const e = p ? B.state.entries[p] : undefined;
  return (e?.data.name as string | undefined) || CONDUCTORS[a]?.name || short(a);
}

// ── Visible entries and their positions ──
export function layout(B: Backend, persp: Persp) {
  const s = B.state;
  const vis = s.order
    .map((h) => s.entries[h])
    .filter((e) => !typeSpec(e.type).hidden && !(e.private && persp !== 'network' && e.data.owner !== persp));
  const col: Partial<Record<LaneId, number>> = {};
  const pos: Record<string, { x: number; y: number }> = {};
  for (const e of vis) {
    const lane = laneOf(e);
    const i = (col[lane] = (col[lane] ?? 0) + 1);
    pos[e.hash] = { x: laneIndex(lane) * LW + 16, y: TOP + (i - 1) * RH };
  }
  return { vis, pos };
}

/** Whether an entry has not reached the conductor we look from yet. */
export const isPending = (e: Entry, persp: Persp) => (persp !== 'network' ? !e.held[persp] : Object.values(e.held).some((x) => x === false));

// ── Titles ──
function itemName(B: Backend, h: string | null | undefined): string {
  const e = h ? B.state.entries[h] : undefined;
  if (!e) return 'an item';
  return (e.data.label as string) || TYPES[e.type].title(e.data);
}

/** The person a sentence about a promise starts with. "Borrow" is something
 *  the receiver does, so an AccessForUse promise starts with the receiver;
 *  every other action with the provider. What happened is told from the
 *  provider in the past tense, as the handoff does ("Sarah lent X"). */
const subjectOf = (d: Data) => (d.action === 'AccessForUse' ? d.receiver : d.provider);
const phrase = (action: string) => ACTION_PHRASE[action] ?? action;

export function title(ctx: Ctx, e: Entry): string {
  const { B, dev } = ctx;
  if (!dev) {
    const d = e.data;
    switch (e.type) {
      case 'Commitment':
        return aname(B, subjectOf(d)) + ' will ' + phrase(d.action) + ' ' + itemName(B, d.resource_inventoried_as);
      case 'EconomicEvent':
        // The handoff's past tense, from the provider: "Sarah handed over X".
        return aname(B, d.provider) + ' ' + (ACTION_PAST[d.action] ?? phrase(d.action)) + ' ' + itemName(B, d.resource_inventoried_as);
      case 'GovernanceRule':
        return plain(d.rule_type as string);
      case 'ValidationReceipt':
        return (d.approved ? 'Approved by ' : 'Rejected by ') + aname(B, d.validator);
      case 'PrivateParticipationClaim':
        return plain(d.claim_type as string);
      case 'Claim':
        return ENTRY_TYPE_WORD.Claim;
      case 'NdoAnchor':
        return 'Listed: ' + d.name;
      case 'PersonRole':
        return plain(d.role_name as string);
    }
  }
  return TYPES[e.type].title(e.data) || e.type;
}

// ── Badges: the DS shape grammar ──
export interface BadgeSpec {
  variant: string;
  label: string;
}

/** A governance rule's typed payload in one line, e.g. "Credentialed ·
 *  Transport": the Developer details badge. The plain badge is the handoff's
 *  sentence, ruleSentence() in plain.ts. */
export function ruleSummary(r: Data): string {
  switch (r.type) {
    case 'AccessRequirement':
      return r.accessibility + (r.required_role ? ' · ' + r.required_role : '');
    case 'UsageLimit': {
      const parts = [r.max_duration_hours ? r.max_duration_hours + ' h' : null, r.period_days ? r.period_days + ' d' : null].filter(Boolean);
      return parts.join(' / ') || 'no limit';
    }
    case 'TransferCondition':
      return r.transfer_type + (r.requires_validation ? ' · validated' : '');
    case 'MaintenanceSchedule':
      return r.interval_days + ' d' + (r.required_role ? ' · ' + r.required_role : '');
    default:
      return String(r.type);
  }
}

export function badges(ctx: Ctx, e: Entry): BadgeSpec[] {
  const { B, dev } = ctx;
  const d = e.data;
  const w = (x: string) => word(x, dev);
  switch (e.type) {
    case 'NondominiumIdentity':
      return [
        { variant: 'lifecycle-' + kebab(d.lifecycle_stage), label: w(d.lifecycle_stage) },
        { variant: 'regime-' + kebab(d.property_regime), label: w(d.property_regime) },
        { variant: 'nature-' + kebab(d.resource_nature), label: d.resource_nature }
      ];
    case 'NdoAnchor':
      return [{ variant: 'lifecycle-' + kebab(d.lifecycle_stage), label: w(d.lifecycle_stage) }];
    case 'GovernanceRule': {
      // Plain view: the handoff's sentence ("Needs role: Trusted member").
      return [{ variant: 'rule-' + kebab(d.rule_data.type), label: dev ? ruleSummary(d.rule_data) : ruleSentence(d.rule_data) }];
    }
    case 'EconomicResource':
      return [{ variant: 'op-' + kebab(d.operational_state), label: w(d.operational_state) }];
    case 'ResourceSpecification':
      return [{ variant: 'neutral', label: d.category }];
    case 'Commitment': {
      const kept = B.claimsOf(e.hash).length > 0;
      return [{ variant: kept ? 'lifecycle-active' : 'coming-soon', label: kept ? (dev ? 'claimed' : 'kept') : dev ? 'open' : 'waiting' }];
    }
    case 'ValidationReceipt':
      return [{ variant: d.approved ? 'op-available' : 'lifecycle-end-of-life', label: d.approved ? 'approved' : 'rejected' }];
    case 'PrivateParticipationClaim':
      return [{ variant: 'neutral', label: 'private' }];
    case 'PersonRole':
      return dev ? [{ variant: 'scope-network', label: 'RoleType' }] : [];
    default:
      return [];
  }
}

// ── Card subtitles ──
export function sub(ctx: Ctx, e: Entry): string {
  const { B, dev } = ctx;
  const d = e.data;
  const s = B.state;
  const t = (h: string | null | undefined) => (h && s.entries[h] ? title(ctx, s.entries[h]) : 'none');
  switch (e.type) {
    case 'GroupProfile':
      return B.membersOf(e.hash).length + ' members';
    case 'NdoAnchor':
      return 'anchors ' + d.name;
    case 'Person':
      return B.rolesOf(d.agent).map((r) => word(r, dev)).join(', ') || 'no roles';
    case 'PersonRole':
      return '→ ' + aname(B, d.assigned_to);
    case 'NondominiumIdentity':
      return 'initiator ' + aname(B, d.initiator);
    case 'ResourceSpecification':
      return 'of ' + t(d.ndo_identity_hash);
    case 'GovernanceRule':
      return d.specification_hash ? 'on ' + t(d.specification_hash) : 'on ' + t(d.ndo_identity_hash);
    case 'EconomicResource':
      return d.quantity + ' ' + d.unit + ' · custodian ' + aname(B, d.custodian);
    case 'Commitment':
    case 'EconomicEvent':
      return aname(B, d.provider) + ' → ' + aname(B, d.receiver) + ' · ' + (s.entries[d.resource_inventoried_as]?.data.label ?? 'none');
    case 'Claim':
      return 'claims ' + t(d.fulfills);
    case 'ValidationReceipt':
      return 'of ' + t(d.validated_item);
    case 'PrivateParticipationClaim':
      return 'on ' + aname(B, d.owner) + "'s chain · with " + aname(B, d.counterparty);
    default:
      return '';
  }
}

// ── Edges ──
export interface Edge {
  from: string;
  to: string;
  f: string;
  cat: RefCategory;
  touch: boolean;
}

export function edgesOf(vis: Entry[], pos: Record<string, unknown>, sel: Entry | null, showAgents: boolean, showStruct: boolean) {
  const edges: Edge[] = [];
  const linked = new Set<string>(sel ? [sel.hash] : []);
  for (const e of vis)
    for (const [f, cat] of TYPES[e.type].refs) {
      const t = e.data[f] as string | undefined;
      if (!t || !pos[t]) continue;
      const touch = !!sel && (e.hash === sel.hash || t === sel.hash);
      if (touch) {
        linked.add(e.hash);
        linked.add(t);
      }
      if (cat === 'flow' || touch || (cat === 'agents' && showAgents) || (cat === 'structure' && showStruct)) edges.push({ from: t, to: e.hash, f, cat, touch });
    }
  return { edges, linked };
}

export function edgePath(a: { x: number; y: number }, b: { x: number; y: number }) {
  const ay = a.y + NH / 2;
  const by = b.y + NH / 2;
  if (Math.abs(a.x - b.x) < 10) {
    const x = a.x + NW;
    const m = x + 28 + Math.abs(by - ay) * 0.08;
    return { d: `M${x} ${ay} C${m} ${ay} ${m} ${by} ${x} ${by}`, mx: m - 6, my: (ay + by) / 2 };
  }
  const [x1, x2] = b.x > a.x ? [a.x + NW, b.x] : [a.x, b.x + NW];
  const dx = Math.max(40, Math.abs(x2 - x1) / 2) * (x2 > x1 ? 1 : -1);
  return { d: `M${x1} ${ay} C${x1 + dx} ${ay} ${x2 - dx} ${by} ${x2} ${by}`, mx: (x1 + x2) / 2, my: (ay + by) / 2 };
}

// ── Actions and forms ──
/** [key, zome input label, kind, options, default]. Options are [value, label]. */
export type FieldDef = [string, string, 'text' | 'number' | 'select', [string, string][] | null, string];
export type Call = (zome: string, fn: string, input: Data) => string | string[];

export interface ActionDef {
  id: string;
  label: string;
  call: string;
  fields: (v: Record<string, string>) => FieldDef[];
  run: (v: Record<string, string>, c: Call) => string | string[] | undefined;
}

const opt = (a: readonly string[]): [string, string][] => a.map((x) => [x, x]);

export function actionsFor(ctx: Ctx, e: Entry | null, writer: AgentKey): ActionDef[] {
  const { B, dev } = ctx;
  const s = B.state;
  const ag = Object.keys(CONDUCTORS);
  const agOpt = (a: string[]): [string, string][] => a.map((x) => [x, aname(B, x)]);
  const all = (t: EntryType) => s.order.map((h) => s.entries[h]).filter((x) => x.type === t);
  const none: [string, string] = ['', 'none'];
  const bool: [string, string][] = dev
    ? [
        ['true', 'true'],
        ['false', 'false']
      ]
    : [
        ['true', 'Yes'],
        ['false', 'No']
      ];
  const roleOpt: [string, string][] = [none, ...opt(ENUMS.RoleType)];
  const ruleFields = (v: Record<string, string>): FieldDef[] => {
    const t = v.rule_type || 'AccessRequirement';
    const f: FieldDef[] = [['rule_type', 'RuleData', 'select', opt(ENUMS.GovernanceRuleType), 'AccessRequirement']];
    if (t === 'AccessRequirement') f.push(['accessibility', 'accessibility', 'select', opt(ENUMS.Accessibility), 'Credentialed'], ['required_role', 'required_role', 'select', roleOpt, 'AccountableAgent']);
    if (t === 'UsageLimit') f.push(['max_duration_hours', 'max_duration_hours', 'number', null, '40'], ['period_days', 'period_days', 'number', null, '7']);
    if (t === 'TransferCondition') f.push(['transfer_type', 'transfer_type', 'select', opt(ENUMS.TransferType), 'Custody'], ['requires_validation', 'requires_validation', 'select', bool, 'true'], ['validator_role', 'validator_role', 'select', roleOpt, '']);
    if (t === 'MaintenanceSchedule') f.push(['interval_days', 'interval_days', 'number', null, '90'], ['required_role', 'required_role', 'select', roleOpt, 'Repair']);
    return f;
  };
  const ruleData = (v: Record<string, string>): Data => {
    const t = v.rule_type;
    if (t === 'AccessRequirement') return { type: t, accessibility: v.accessibility, required_role: v.required_role || null, min_affiliation: null };
    if (t === 'UsageLimit') return { type: t, max_duration_hours: +v.max_duration_hours || null, max_quantity_per_period: null, period_days: +v.period_days || null };
    if (t === 'TransferCondition') return { type: t, transfer_type: v.transfer_type, requires_validation: v.requires_validation === 'true', validator_role: v.validator_role || null };
    return { type: t, interval_days: +v.interval_days, required_role: v.required_role || null };
  };
  const pprs = (c: Call, ev: string, d: Data, fulfills: string | null) => {
    const [pc, rc] = PPR[d.action] || ['RuleCompliance', null];
    c('zome_gouvernance', 'issue_participation_receipts', { fulfills, fulfilled_by: ev, provider: d.provider, receiver: d.receiver, provider_claim_type: pc, receiver_claim_type: rc });
  };

  if (!e)
    return [
      { id: 'person', label: 'Create person', call: 'zome_person::create_person', fields: () => [['name', 'name', 'text', null, '']], run: (v, c) => c('zome_person', 'create_person', { name: v.name }) },
      {
        id: 'group',
        label: 'Create group',
        call: 'zome_group::create_group',
        fields: () => [
          ['name', 'name', 'text', null, ''],
          ['description', 'description', 'text', null, '']
        ],
        run: (v, c) => c('zome_group', 'create_group', { name: v.name, description: v.description })
      },
      {
        id: 'ndo',
        label: 'Create a shared resource',
        call: 'zome_resource::create_ndo → zome_group::create_ndo_anchor',
        fields: () => [
          ['name', 'name', 'text', null, ''],
          ['description', 'description', 'text', null, ''],
          ['property_regime', 'property_regime', 'select', opt(ENUMS.PropertyRegime), 'Nondominium'],
          ['resource_nature', 'resource_nature', 'select', opt(ENUMS.ResourceNature), 'Physical'],
          ['group', 'anchor in group', 'select', [none, ...all('GroupProfile').filter((g) => B.membersOf(g.hash).includes(writer)).map((g): [string, string] => [g.hash, g.data.name])], '']
        ],
        run: (v, c) => {
          const n = c('zome_resource', 'create_ndo', { name: v.name, description: v.description, property_regime: v.property_regime, resource_nature: v.resource_nature, lifecycle_stage: 'Ideation' }) as string;
          if (v.group) c('zome_group', 'create_ndo_anchor', { group_hash: v.group, identity_action_hash: n });
          return n;
        }
      }
    ];

  const d = e.data;
  switch (e.type) {
    case 'Person':
      return [{ id: 'role', label: 'Assign role to ' + d.name, call: 'zome_person::assign_person_role', fields: () => [['role_name', 'role_name', 'select', opt(ENUMS.RoleType), 'Transport']], run: (v, c) => c('zome_person', 'assign_person_role', { role_name: v.role_name, assigned_to: d.agent }) }];
    case 'GroupProfile':
      return [
        {
          id: 'join',
          label: 'Join group',
          call: 'zome_group::join_group',
          fields: () => [],
          run: (_v, c) => {
            c('zome_group', 'join_group', { group_hash: e.hash });
            return e.hash;
          }
        }
      ];
    case 'NondominiumIdentity': {
      const next = allowedTransitions(d);
      return [
        {
          id: 'stage',
          label: 'Change stage',
          call: 'zome_resource::update_lifecycle_stage',
          fields: (v) => {
            const f: FieldDef[] = [['new_stage', 'new_stage', 'select', opt(next), next[0] ?? '']];
            if ((v.new_stage || next[0]) === 'Deprecated')
              f.push(['successor_ndo_hash', 'successor_ndo_hash', 'select', [['', 'Pick one (required)'], ...all('NondominiumIdentity').filter((x) => x.hash !== e.hash).map((x): [string, string] => [x.hash, x.data.name])], '']);
            return f;
          },
          run: (v, c) => {
            c('zome_resource', 'update_lifecycle_stage', { original_action_hash: e.hash, new_stage: v.new_stage, successor_ndo_hash: v.successor_ndo_hash || null, transition_event_hash: null });
            return e.hash;
          }
        },
        {
          id: 'spec',
          label: 'Add a kind of item',
          call: 'zome_resource::create_resource_specification',
          fields: () => [
            ['name', 'name', 'text', null, ''],
            ['description', 'description', 'text', null, '']
          ],
          run: (v, c) => c('zome_resource', 'create_resource_specification', { name: v.name, description: v.description, ndo_identity_hash: e.hash })
        },
        { id: 'rule', label: 'Add governance rule', call: 'zome_resource::create_governance_rule', fields: ruleFields, run: (v, c) => c('zome_resource', 'create_governance_rule', { ndo_identity_hash: e.hash, rule_data: ruleData(v) }) },
        {
          id: 'anchor',
          label: 'List in a group',
          call: 'zome_group::create_ndo_anchor',
          fields: () => [['group', 'group_hash', 'select', all('GroupProfile').map((g): [string, string] => [g.hash, g.data.name]), all('GroupProfile')[0]?.hash ?? '']],
          run: (v, c) => c('zome_group', 'create_ndo_anchor', { group_hash: v.group, identity_action_hash: e.hash })
        }
      ];
    }
    case 'ResourceSpecification':
      return [
        {
          id: 'res',
          label: 'Add an item',
          call: 'zome_resource::create_economic_resource',
          fields: () => [
            ['label', 'label (UI only)', 'text', null, d.name],
            ['quantity', 'quantity', 'number', null, '1'],
            ['unit', 'unit', 'text', null, 'unit'],
            ['current_location', 'current_location', 'text', null, '']
          ],
          run: (v, c) => c('zome_resource', 'create_economic_resource', { spec_hash: e.hash, label: v.label, quantity: +v.quantity, unit: v.unit, current_location: v.current_location })
        },
        { id: 'rule', label: 'Add governance rule', call: 'zome_resource::create_governance_rule', fields: ruleFields, run: (v, c) => c('zome_resource', 'create_governance_rule', { ndo_identity_hash: d.ndo_identity_hash, specification_hash: e.hash, rule_data: ruleData(v) }) }
      ];
    case 'EconomicResource': {
      const states = ENUMS.OperationalState.filter((x) => x !== d.operational_state);
      const others = ag.filter((a) => a !== d.custodian);
      return [
        {
          id: 'val',
          label: 'Approve this item',
          call: 'zome_gouvernance::create_validation_receipt',
          fields: () => [
            ['approved', 'approved', 'select', bool, 'true'],
            ['notes', 'notes', 'text', null, '']
          ],
          run: (v, c) => c('zome_gouvernance', 'create_validation_receipt', { validated_item: e.hash, validation_type: 'resource_approval', approved: v.approved === 'true', notes: v.notes })
        },
        {
          id: 'op',
          label: 'Change status',
          call: 'zome_resource::update_operational_state',
          fields: () => [['state', 'new_operational_state', 'select', opt(states), states[0]]],
          run: (v, c) => {
            c('zome_resource', 'update_operational_state', { resource_hash: e.hash, new_operational_state: v.state });
            return e.hash;
          }
        },
        {
          id: 'cust',
          label: 'Transfer custody',
          call: 'transfer_custody → log_economic_event → issue_participation_receipts',
          fields: () => [['to', 'new_custodian', 'select', agOpt(others), others[0] ?? '']],
          run: (v, c) => {
            const from = d.custodian;
            c('zome_resource', 'transfer_custody', { resource_hash: e.hash, new_custodian: v.to, request_contact_info: false });
            const ev = c('zome_gouvernance', 'log_economic_event', { action: 'TransferCustody', provider: from, receiver: v.to, resource_inventoried_as: e.hash }) as string;
            pprs(c, ev, { action: 'TransferCustody', provider: from, receiver: v.to }, null);
            return ev;
          }
        },
        {
          id: 'commit',
          label: 'Make a promise',
          call: 'zome_gouvernance::propose_commitment',
          fields: () => [
            ['action', 'action', 'select', opt(['TransferCustody', 'Use', 'Work', 'Move', 'AccessForUse']), 'Use'],
            ['provider', 'provider', 'select', agOpt(ag), d.custodian],
            ['note', 'note', 'text', null, '']
          ],
          run: (v, c) => c('zome_gouvernance', 'propose_commitment', { action: v.action, resource_hash: e.hash, provider: v.provider, note: v.note, ndo_identity_hash: d.ndo_identity_hash })
        },
        {
          id: 'event',
          label: 'Record what happened',
          call: 'zome_gouvernance::log_economic_event',
          fields: () => [
            ['action', 'action', 'select', opt(['Use', 'Work', 'Modify', 'Move', 'Cite']), 'Use'],
            ['provider', 'provider', 'select', agOpt(ag), writer],
            ['receiver', 'receiver', 'select', agOpt(ag), d.custodian],
            ['qty', 'resource_quantity', 'number', null, String(d.quantity)],
            ['note', 'note', 'text', null, '']
          ],
          run: (v, c) => c('zome_gouvernance', 'log_economic_event', { action: v.action, provider: v.provider, receiver: v.receiver, resource_inventoried_as: e.hash, resource_quantity: +v.qty, note: v.note })
        }
      ];
    }
    case 'Commitment':
      return B.claimsOf(e.hash).length
        ? []
        : [
            {
              id: 'val',
              label: 'Approve this promise',
              call: 'zome_gouvernance::create_validation_receipt',
              fields: () => [
                ['approved', 'approved', 'select', bool, 'true'],
                ['notes', 'notes', 'text', null, '']
              ],
              run: (v, c) => c('zome_gouvernance', 'create_validation_receipt', { validated_item: e.hash, validation_type: 'commitment_approval', approved: v.approved === 'true', notes: v.notes })
            },
            {
              id: 'fulfil',
              label: 'Keep this promise',
              call: (d.action === 'TransferCustody' ? 'transfer_custody → ' : '') + 'log_economic_event → claim_commitment → issue_participation_receipts',
              fields: () => [['note', 'fulfillment_note', 'text', null, '']],
              run: (v, c) => {
                if (!d.resource_inventoried_as) throw new Error('Commitment has no resource_inventoried_as');
                if (d.action === 'TransferCustody') c('zome_resource', 'transfer_custody', { resource_hash: d.resource_inventoried_as, new_custodian: d.receiver, request_contact_info: false });
                const ev = c('zome_gouvernance', 'log_economic_event', { action: d.action, provider: d.provider, receiver: d.receiver, resource_inventoried_as: d.resource_inventoried_as, note: v.note }) as string;
                c('zome_gouvernance', 'claim_commitment', { commitment_hash: e.hash, fulfillment_note: v.note });
                pprs(c, ev, d, e.hash);
                return ev;
              }
            }
          ];
    case 'EconomicEvent':
      return [
        {
          id: 'val',
          label: 'Confirm what happened',
          call: 'zome_gouvernance::create_validation_receipt',
          fields: () => [['approved', 'approved', 'select', bool, 'true']],
          run: (v, c) => c('zome_gouvernance', 'create_validation_receipt', { validated_item: e.hash, validation_type: 'process_validation', approved: v.approved === 'true' })
        }
      ];
    default:
      return [];
  }
}

/** Resolve a form's fields twice, so a field that depends on another (the
 *  rule payload on the rule type, the successor on Deprecated) sees the
 *  defaults of the first pass. */
export function fieldsOf(a: ActionDef, vals: Record<string, string>) {
  const f1 = a.fields(vals);
  const v1 = { ...Object.fromEntries(f1.map((f) => [f[0], f[4] ?? ''])), ...vals };
  const f2 = a.fields(v1);
  return { fields: f2, v: { ...Object.fromEntries(f2.map((f) => [f[0], f[4] ?? ''])), ...vals } };
}

/** Form label: the zome input name with Developer details, a plain word otherwise. */
export const fieldLabel = (l: string, dev: boolean) => (dev ? l : (FIELD_WORD[l] ?? l));
/** Option label: an enum option shows its plain word unless Developer details is on. */
export const optionLabel = (value: string, label: string, dev: boolean) => (dev || value !== label ? label : plain(label));

// ── Activity feed ──
/** The entry type each zome function writes, so a plain activity row can say
 *  what was written in the shared entry-type words ("Sarah · new Promise"). */
const WRITES: Record<string, [EntryType, 'new' | 'updated']> = {
  create_person: ['Person', 'new'],
  assign_person_role: ['PersonRole', 'new'],
  create_group: ['GroupProfile', 'new'],
  join_group: ['GroupProfile', 'updated'],
  create_ndo_anchor: ['NdoAnchor', 'new'],
  refresh_ndo_anchor_lifecycle_stage: ['NdoAnchor', 'updated'],
  create_ndo: ['NondominiumIdentity', 'new'],
  update_lifecycle_stage: ['NondominiumIdentity', 'updated'],
  create_resource_specification: ['ResourceSpecification', 'new'],
  create_governance_rule: ['GovernanceRule', 'new'],
  create_economic_resource: ['EconomicResource', 'new'],
  update_operational_state: ['EconomicResource', 'updated'],
  transfer_custody: ['EconomicResource', 'updated'],
  propose_commitment: ['Commitment', 'new'],
  log_economic_event: ['EconomicEvent', 'new'],
  claim_commitment: ['Claim', 'new'],
  create_validation_receipt: ['ValidationReceipt', 'new'],
  issue_participation_receipts: ['PrivateParticipationClaim', 'new']
};

export function callPhrase(fn: string): string {
  const w = WRITES[fn];
  if (!w) return fn;
  if (fn === 'join_group') return 'joined a ' + ENTRY_TYPE_WORD.GroupProfile.toLowerCase();
  return (w[1] === 'new' ? 'new ' : 'updated ') + ENTRY_TYPE_WORD[w[0]];
}

export interface View {
  x: number;
  y: number;
  k: number;
}

/** One card, everything it shows computed once per render. */
export interface NodeView {
  e: Entry;
  title: string;
  sub: string;
  badges: BadgeSpec[];
  author: { id: string; name: string };
}

export type { Data, Entry, EntryType };
