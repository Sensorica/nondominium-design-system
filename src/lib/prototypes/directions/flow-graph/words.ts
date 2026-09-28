// Direction F's own word map, ported verbatim from the <script type="text/x-dc">
// block of "F Flow Graph.dc.html" (F_TYPE, F_LANE, F_WORD, F_ACT, F_FIELD,
// F_ERR, human(), friendlyErr()). F used to take these words from the shared
// $lib/prototypes/plain module, but that module's PLAIN table invents entries
// F's original never had (e.g. GovernanceRuleType keys), which drifted F's
// copy away from the original ("Access requirement" became "Who can access").
// This module is F's alone: A to E keep using $lib/prototypes/plain, which is
// unaffected by anything here. The `developer` toggle store is not a word map
// and still comes from $lib/prototypes/plain (see App.svelte).
//
// Three additions beyond the original, clearly marked below: F_ERR gains three
// patterns for constraints backend.ts enforces that the original mock did not
// (capture resistance, the Layer-1-at-Ideation gate, ownership-transfer on a
// Nondominium regime). Those constraints come from the real zome
// (crates/shared/src/constraints.rs) — fidelity to the hApp over fidelity to
// the original mock — so their errors need friendly text too.

/** Generic camelCase/PascalCase to "Sentence case", the original's human(). */
export const human = (s: string): string =>
  String(s)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/^./, (c) => c.toUpperCase());

/** F_TYPE: source-chain entry type to everyday word. */
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

/** F_LANE: the eight ValueFlows lanes. */
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

/** F_WORD: enum value to plain word, for lifecycle/regime/operational state.
 *  A value with no entry passes through unchanged (word() below), exactly as
 *  the original's `w = x => this.state.dev ? x : (F_WORD[x] || x)`. */
export const F_WORD: Readonly<Record<string, string>> = {
  Ideation: 'Idea',
  Specification: 'Being specified',
  Development: 'In development',
  Hibernating: 'Paused',
  Deprecated: 'Replaced',
  EndOfLife: 'Retired',
  Nondominium: 'Uncapturable',
  Collective: 'Co-owned',
  Pool: 'Shared pool',
  CommonPool: 'Common pool',
  Hybrid: 'Physical + digital',
  InTransit: 'On the move',
  InStorage: 'In storage',
  InMaintenance: 'Being repaired',
  InUse: 'In use',
  PendingValidation: 'Waiting for approval'
};

/** The raw enum when Developer details is on, F_WORD's plain word otherwise. */
export const word = (t: string, dev: boolean): string => (dev ? t : (F_WORD[t] ?? t));

/** F_ACT: lower-case verb phrases for a Commitment's "X will …" sentence.
 *  Note AccessForUse is 'lend for use' here, not core.jsx's 'borrow': F's
 *  original always speaks from the provider (the lender), never the
 *  receiver — see title()'s Commitment case below. */
export const ACTION_PHRASE: Readonly<Record<string, string>> = {
  TransferCustody: 'hand over',
  AccessForUse: 'lend for use',
  Use: 'use',
  Work: 'work on',
  Move: 'move',
  Modify: 'modify',
  Cite: 'cite',
  Transfer: 'transfer'
};
const phrase = (action: string) => ACTION_PHRASE[action] ?? human(action);

/** The inline past-tense object from title()'s EconomicEvent case ("Sarah
 *  handed over the CNC machine"). Falls back to human(), as the original does. */
const ACTION_PAST: Readonly<Record<string, string>> = {
  TransferCustody: 'handed over',
  AccessForUse: 'lent',
  Use: 'used',
  Work: 'worked on',
  Move: 'moved',
  Modify: 'modified',
  Cite: 'cited'
};
const pastPhrase = (action: string) => ACTION_PAST[action] ?? human(action);

/** RoleType to plain word: the inline `{SimpleAgent: 'Member', ...}` literal
 *  the original repeats in title()'s PersonRole case, sub()'s Person case, and
 *  badges()'s role() helper. One copy, three call sites. */
export const ROLE_WORD: Readonly<Record<string, string>> = {
  SimpleAgent: 'Member',
  AccountableAgent: 'Trusted member',
  PrimaryAccountableAgent: 'Steward'
};
export const roleWord = (x: string): string => ROLE_WORD[x] ?? x;

/** F_FIELD: zome input field name to form label. */
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
export const fieldLabel = (l: string, dev: boolean): string => (dev ? l : (FIELD_WORD[l] ?? l));
/** An enum option shows `human(label)` unless Developer details is on, or the
 *  option's value and label already differ (the option already carries a
 *  human label, e.g. a person's name) — the original's own render step (line
 *  535: `st.dev || ov !== ol ? ol : human(ol)`), not F_WORD: a select never
 *  gets F_WORD's plainer rewrites (`Hibernating` stays `Hibernating`, not
 *  "Paused" — human() is a no-op on it, since it has no camelCase boundary
 *  to split), only mechanical sentence-casing for a multi-word enum like
 *  `PendingValidation` → "Pending validation". */
export const optionLabel = (value: string, label: string, dev: boolean): string =>
  dev || value !== label ? label : human(label);

/** F_ERR: backend error text to friendly text, in the original's order (first
 *  match wins). The three entries after the original's eleven are additive:
 *  backend.ts enforces hApp constraints the original mock never had. */
const F_ERR: ReadonlyArray<readonly [RegExp, string]> = [
  [/NotCustodian|Only the current custodian/, 'Only the person currently holding this item can do that.'],
  [/NotAuthor|only the initiator/, 'Only the person who created this resource can change its stage.'],
  [/requires successor/, 'Pick the resource that replaces this one first.'],
  [/cannot validate their own/, "You can't approve your own item. Ask someone else."],
  [/already validated/, 'You have already approved this.'],
  [/already claimed/, 'This promise has already been kept.'],
  [/already a member/, 'You are already in this group.'],
  [/cannot be empty/, 'Please fill in the name.'],
  [/No Person profile/, 'Create a profile first.'],
  [/Only group members/, 'Join the group first.'],
  [/already assigned/, 'This person already has that role.'],
  // Additive: hApp constraints (crates/shared/src/constraints.rs) backend.ts
  // enforces that the original mock did not.
  [/ownership_transfer_not_permitted_by_regime/, "An uncapturable resource can't have a rule that hands over ownership. Choose custody, use rights or benefit instead."],
  [/Cannot activate Layer 1 while the NDO is/, "Kinds of item can't be added yet. Move the resource past the idea stage first."],
  [/nondominium_no_unilateral_capture/, "Nobody can take, use up or reduce an uncapturable resource that way."]
];

/** friendlyErr(): a matched pattern's text, or the raw message with a leading
 *  "zome_fn: " prefix stripped, exactly as the original's friendlyErr(). */
export function friendlyErr(m: string): string {
  const hit = F_ERR.find(([r]) => r.test(m));
  return hit ? hit[1] : m.replace(/^[a-z_]+: /, '');
}

/** ruleSentence(): a GovernanceRule's typed payload as the sentence its badge
 *  shows without Developer details ("Needs role: Trusted member"). Ported
 *  from badges()'s inline `f` object, using roleWord() for role(). */
export function ruleSentence(r: {
  type: string;
  accessibility?: string | null;
  required_role?: string | null;
  max_duration_hours?: number | null;
  period_days?: number | null;
  requires_validation?: boolean | null;
  interval_days?: number | null;
}): string {
  switch (r.type) {
    case 'AccessRequirement':
      return (
        { Free: 'Open to all', Credentialed: 'Needs role: ' + roleWord(r.required_role || 'a role'), Gated: 'Needs approval' }[
          r.accessibility ?? ''
        ] ?? ''
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
      return 'Every ' + r.interval_days + ' days' + (r.required_role ? ' · ' + roleWord(r.required_role) : '');
    default:
      return human(r.type);
  }
}

export { phrase as actionPhrase, pastPhrase as actionPast };
