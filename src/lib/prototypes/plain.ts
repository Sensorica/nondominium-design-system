// The plain-language layer: the ONE module every direction, F included, takes
// its words from.
//
// The audience is people new to resource sharing, not ValueFlows experts, so
// the default UI uses everyday words. "Developer details" adds the technical
// layer (zome function names, hashes, rule chains) on top; it never replaces a
// plain word with jargon, except where a direction deliberately shows the raw
// enum through `word()`.
//
// Sources, merged without contradiction:
//   PLAIN      core.jsx (A to E)        wins on every conflict
//   F_WORD     F Flow Graph.dc.html     every entry already equals PLAIN
//   F_TYPE     F Flow Graph.dc.html     entry types, kept as ENTRY_TYPE_WORD
//   F_LANE     F Flow Graph.dc.html     graph lanes, kept as LANE_WORD
//   F_ACT      F Flow Graph.dc.html     action phrases, kept as ACTION_PHRASE
//   F_FIELD    F Flow Graph.dc.html     form labels, kept as FIELD_WORD
//   F_ERR      ui.jsx + F               kept as ERROR_WORDS
// Conflicts resolved in favour of core.jsx are marked "CONFLICT" below.
//
// Pure TypeScript with no Svelte import: the rules checker imports this under
// bun. The Developer details toggle is a Svelte store contract (`subscribe`),
// so a component reads it as `$developer` and a .svelte.ts module wraps it
// with `fromStore`.

/** Backend enum value to everyday word. core.jsx's PLAIN, verbatim, plus the
 *  keys F_WORD adds (none: F_WORD is a subset with identical values). */
export const PLAIN: Readonly<Record<string, string>> = {
  // LifecycleStage
  Ideation: 'Idea',
  Specification: 'Being specified',
  Development: 'In development',
  Prototype: 'Prototype',
  Stable: 'Stable',
  Distributed: 'Distributed',
  Active: 'Active',
  Hibernating: 'Paused',
  Deprecated: 'Replaced',
  EndOfLife: 'Retired',
  // PropertyRegime
  Nondominium: 'Uncapturable',
  Commons: 'Commons',
  Collective: 'Co-owned',
  Pool: 'Shared pool',
  CommonPool: 'Common pool',
  Public: 'Public',
  Private: 'Private',
  // ResourceNature, Rivalry
  Hybrid: 'Physical + digital',
  Rivalrous: 'One user at a time',
  NonRivalrous: 'Many users at once',
  // OperationalState
  InTransit: 'On the move',
  InStorage: 'In storage',
  InMaintenance: 'Being repaired',
  InUse: 'In use',
  PendingValidation: 'Waiting for approval',
  // VfAction
  AccessForUse: 'Borrow',
  TransferCustody: 'Hand over',
  Work: 'Work on',
  // GovernanceRuleType
  AccessRequirement: 'Who can access',
  UsageLimit: 'Usage limit',
  TransferCondition: 'Hand-over condition',
  MaintenanceSchedule: 'Maintenance schedule',
  // RoleType
  SimpleAgent: 'Member',
  AccountableAgent: 'Trusted member',
  PrimaryAccountableAgent: 'Steward',
  // Accessibility, TransferType, rule summary fragments
  Free: 'Open to all',
  Credentialed: 'Needs a role',
  Gated: 'Needs approval',
  Custody: 'Custody',
  validated: 'needs approval',
  // ParticipationClaimType
  CustodyTransfer: 'Handed over an item',
  CustodyAcceptance: 'Took responsibility for an item',
  RuleCompliance: 'Followed the rules',
  ResourceValidation: 'Approved something',
  ResourceCreation: 'Created a resource',
  MaintenanceFulfillmentCompleted: 'Did maintenance',
  TransportFulfillmentCompleted: 'Transported an item',
  // NdoLinkType
  Component: 'is part of',
  DerivedFrom: 'is derived from',
  Supersedes: 'replaces'
};

/** Plain words are always shown. A value with no entry passes through
 *  unchanged, and a " · "-joined summary (a rule summary such as
 *  "Credentialed · Transport") is translated part by part. */
export function plain(t: string): string;
export function plain(t: string | null | undefined): string | null | undefined;
export function plain(t: string | null | undefined): string | null | undefined {
  if (t == null) return t;
  const s = String(t);
  if (PLAIN[s]) return PLAIN[s];
  return s
    .split(' · ')
    .map((p) => PLAIN[p.trim()] ?? p)
    .join(' · ');
}

/** F's convention: the raw enum when Developer details is on, the plain word
 *  otherwise. A to E keep plain words either way and use `plain()`. */
export function word(t: string, dev: boolean): string {
  return dev ? t : plain(t);
}

/** Source-chain entry type to everyday word (F_TYPE). Note the vocabulary
 *  split: F calls a Commitment a "Promise", A to E call the same thing a
 *  "Request" in their copy. Both are in the handoff; the choice is open. */
export const ENTRY_TYPE_WORD: Readonly<Record<string, string>> = {
  GroupProfile: 'Group',
  NdoAnchor: 'Listed in group',
  Person: 'Person',
  PersonRole: 'Role',
  NondominiumIdentity: 'Shared resource',
  ResourceSpecification: 'Kind of item',
  GovernanceRule: 'Rule',
  EconomicResource: 'Item',
  Commitment: 'Promise',
  Claim: 'Promise kept',
  EconomicEvent: 'What happened',
  ValidationReceipt: 'Approval',
  PrivateParticipationClaim: 'Private receipt'
};

/** F's eight lanes, in ValueFlows order (F_LANE). */
export const LANE_WORD: Readonly<Record<string, string>> = {
  group: 'Groups',
  agent: 'People',
  l0: 'Shared resources',
  l1: 'Rules',
  l2: 'Items',
  plan: 'Promises',
  event: 'What happened',
  ppr: 'Receipts'
};

/** Lower-case verb phrases for sentences ("asked to borrow"), F_ACT.
 *  CONFLICT: F_ACT had AccessForUse 'lend for use'; core.jsx says 'Borrow',
 *  so the phrase follows core.jsx. */
export const ACTION_PHRASE: Readonly<Record<string, string>> = {
  TransferCustody: 'hand over',
  AccessForUse: 'borrow',
  Use: 'use',
  Work: 'work on',
  Move: 'move',
  Modify: 'modify',
  Cite: 'cite',
  Transfer: 'transfer'
};

/** Past-tense phrases for what happened ("Sarah handed over the CNC
 *  machine"), from F's title() for an EconomicEvent. Actions it has no phrase
 *  for fall back to ACTION_PHRASE. */
export const ACTION_PAST: Readonly<Record<string, string>> = {
  TransferCustody: 'handed over',
  AccessForUse: 'lent',
  Use: 'used',
  Work: 'worked on',
  Move: 'moved',
  Modify: 'modified',
  Cite: 'cited'
};

/** A governance rule's typed payload (RuleData, as F stores it) as the
 *  sentence F's rule badge shows without Developer details: "Needs role:
 *  Trusted member", "Max 336 h per 30 days". F's badges(), verbatim. */
export function ruleSentence(r: {
  type: string;
  accessibility?: string | null;
  required_role?: string | null;
  max_duration_hours?: number | null;
  period_days?: number | null;
  requires_validation?: boolean | null;
  interval_days?: number | null;
}): string {
  const role = (x: string) => PLAIN[x] ?? x;
  switch (r.type) {
    case 'AccessRequirement':
      return (
        { Free: 'Open to all', Credentialed: 'Needs role: ' + role(r.required_role || 'a role'), Gated: 'Needs approval' }[
          r.accessibility ?? ''
        ] ?? plain(r.type)
      );
    case 'UsageLimit':
      return (
        [r.max_duration_hours ? 'Max ' + r.max_duration_hours + ' h' : null, r.period_days ? 'per ' + r.period_days + ' days' : null]
          .filter(Boolean)
          .join(' ') || 'Limited use'
      );
    case 'TransferCondition':
      return r.requires_validation ? 'Hand-over needs approval' : 'Free hand-over';
    case 'MaintenanceSchedule':
      return 'Every ' + r.interval_days + ' days' + (r.required_role ? ' · ' + role(r.required_role) : '');
    default:
      return plain(r.type);
  }
}

/** Zome input field name to form label (F_FIELD). No conflict with PLAIN. */
export const FIELD_WORD: Readonly<Record<string, string>> = {
  name: 'Name',
  description: 'Description',
  property_regime: 'Ownership model',
  resource_nature: 'Type',
  'anchor in group': 'Group',
  role_name: 'Role',
  new_stage: 'Next stage',
  successor_ndo_hash: 'Replaced by',
  group_hash: 'Group',
  RuleData: 'Kind of rule',
  accessibility: 'Who can access',
  required_role: 'Required role',
  max_duration_hours: 'Max hours',
  period_days: 'Per number of days',
  transfer_type: 'What is transferred',
  requires_validation: 'Needs approval',
  validator_role: 'Approved by role',
  interval_days: 'Every (days)',
  'label (UI only)': 'Name',
  quantity: 'Quantity',
  unit: 'Unit',
  current_location: 'Location',
  approved: 'Approve',
  notes: 'Comment',
  new_operational_state: 'New status',
  new_custodian: 'Hand over to',
  action: 'What',
  provider: 'From',
  receiver: 'To',
  note: 'Note',
  resource_quantity: 'Quantity',
  fulfillment_note: 'Note'
};

/** Backend error text to friendly text. ui.jsx's list first, verbatim; then
 *  the patterns only F has. CONFLICT: F said "This promise has already been
 *  kept." for /already claimed/; ui.jsx's wording wins. F's patterns were
 *  case-sensitive; ui.jsx's are case-insensitive and cover them. */
export const ERROR_WORDS: ReadonlyArray<readonly [RegExp, string]> = [
  [/NotCustodian|only the current custodian/i, 'Only the person currently holding this item can do that.'],
  // Before the lifecycle NotAuthor below: a rule has its own author.
  [/only the rule's author/i, 'Only the person who added this rule can change it. You can add a new rule instead.'],
  [/NotAuthor|only the initiator/i, 'Only the person who created this resource can change its stage.'],
  [/ownership_transfer_not_permitted_by_regime|does not permit ownership-transfer/i, "An uncapturable resource can't have a rule that hands over ownership. Choose custody, use rights or benefit instead."],
  [/Cannot activate Layer 1 while the NDO is/i, "Kinds of item can't be added yet. Move the resource past the idea stage first."],
  [/nondominium_no_unilateral_capture|not permitted on a Nondominium resource/i, "Nobody can take, use up or reduce an uncapturable resource that way."],
  [/requires successor/i, 'Pick the resource that replaces this one first.'],
  [/cannot validate their own/i, "You can't approve your own item. Ask someone else."],
  [/already validated/i, 'You have already approved this.'],
  [/already claimed/i, 'This has already been done.'],
  [/already a member/i, 'You are already in this group.'],
  [/Invalid invite/i, "That invite link doesn't work. Check you copied all of it."],
  // Field by field: the zome says which field is empty, and so do we.
  [/WorkLog description cannot be empty/i, 'Please describe the work you did.'],
  [/description cannot be empty/i, 'Please fill in the description.'],
  [/^Label cannot be empty/i, 'Please give the item a name.'],
  [/^Unit cannot be empty/i, 'Please fill in the unit.'],
  [/name cannot be empty/i, 'Please fill in the name.'],
  [/cannot be empty/i, 'Please fill in every required field.'],
  [/hours must be/i, 'Enter how many hours you worked.'],
  [/neither provider nor receiver/i, 'Only the two people in this agreement can complete it.'],
  [/must start with https/i, 'The picture link must start with https://'],
  [/Instances cannot be added at stage (\w+)/, "Items can't be added while the resource is in this stage."],
  [/Provider and receiver are both you/, "Choose who you are asking. It can't be yourself."],
  // F only
  [/No Person profile/, 'Create a profile first.'],
  [/Only group members/, 'Join the group first.'],
  [/already assigned/, 'This person already has that role.']
];

/** Friendly text for a backend error. Unmatched errors pass through, as in
 *  ui.jsx. F stripped a leading "zome_fn: " before passing through; opt in
 *  with `stripCallPrefix`. */
export function friendly(e: string, opts?: { stripCallPrefix?: boolean }): string;
export function friendly(e: string | null | undefined, opts?: { stripCallPrefix?: boolean }): string | null | undefined;
export function friendly(
  e: string | null | undefined,
  opts: { stripCallPrefix?: boolean } = {}
): string | null | undefined {
  if (!e) return e;
  const hit = ERROR_WORDS.find(([r]) => r.test(e));
  if (hit) return hit[1];
  return opts.stripCallPrefix ? e.replace(/^[a-z_]+: /, '') : e;
}

/** The write lifecycle a toast moves through. */
export type WriteStage = 'queued' | 'signed' | 'gossip' | 'validated';

/** Toast wording per stage, with and without Developer details (ui.jsx
 *  STAGE_LABEL). */
export function stageLabel(stage: WriteStage, dev: boolean): string {
  return (
    dev
      ? {
          queued: 'Queued · no peers reachable',
          signed: 'Signed on your source chain',
          gossip: 'Gossiping',
          validated: 'Validated by peers'
        }
      : {
          queued: 'Saved on your device · will share when back online',
          signed: 'Saved on your device',
          gossip: 'Sharing with your groups',
          validated: 'Shared and confirmed'
        }
  )[stage];
}

/** "n of 23 people" while gossiping. */
export function peersLabel(peers: number, dev: boolean): string {
  return peers + (dev ? ' of 23 peers' : ' of 23 people');
}

// ── Developer details ─────────────────────────────────────────────────────
//
// One switch for every direction, persisted under the key core.jsx used, so a
// reviewer who turns it on in A still has it on in F. Unlike the handoff, it
// does not reload the page: every subscriber re-renders.

export const DEVELOPER_KEY = 'ndo-dev';

type Subscriber = (on: boolean) => void;

function readDeveloper(): boolean {
  try {
    return typeof localStorage !== 'undefined' && localStorage.getItem(DEVELOPER_KEY) === '1';
  } catch {
    return false;
  }
}

let developerOn = readDeveloper();
const subscribers = new Set<Subscriber>();

function publish(on: boolean): void {
  developerOn = on;
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(DEVELOPER_KEY, on ? '1' : '0');
  } catch {
    // Private mode or storage disabled: the switch still works for this page.
  }
  for (const fn of subscribers) fn(on);
}

/** The Developer details switch. A Svelte store: `$developer` in a component. */
export const developer = {
  subscribe(fn: Subscriber): () => void {
    subscribers.add(fn);
    fn(developerOn);
    return () => {
      subscribers.delete(fn);
    };
  },
  set(on: boolean): void {
    publish(on);
  },
  toggle(): void {
    publish(!developerOn);
  },
  /** Non-reactive read, for event handlers and pure code. */
  get(): boolean {
    return developerOn;
  },
  /** Re-read storage, e.g. after mount when the module was first evaluated
   *  on the server. */
  refresh(): void {
    const on = readDeveloper();
    if (on !== developerOn) publish(on);
  }
};
