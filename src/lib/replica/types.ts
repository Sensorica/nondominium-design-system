// Domain types, copied from `nondominium/packages/shared-types` at origin/dev
// 20adb117219de3e7a1a45b53d8a02fc0602feb7e (PR #132, NDO Layer 1 typed
// governance rules, classification constraints, and OperationalState).
//
// These are verbatim, field for field, including the `| null` unions the real
// descriptor carries. The prototype's whole value is that it renders what the
// app renders, and a component branches differently on `null` than it does on
// `undefined` — so the nulls come across too.
//
// Two deliberate substitutions, and they are the only ones:
//
//   1. Holochain's `ActionHash`, `AgentPubKey`, `EntryHash`, `DnaHash` and
//      `CellId` are raw byte arrays in the app, which imports them from
//      `@holochain/client`. This prototype has no conductor and no client, so
//      it aliases each to the base64 form the UI displays. Anywhere the app
//      calls `encodeHashToBase64` before rendering, the prototype's value is
//      already in that form.
//   2. Nothing else. If a field looks wrong, it is wrong in the app too, and
//      the fix belongs there.

/** Base64 of a raw 39-byte hash. See the note above. */
export type ActionHash = string;
export type AgentPubKey = string;
export type EntryHash = string;
export type DnaHash = string;
/** `[DnaHash, AgentPubKey]` in the app; the pair, base64-encoded, here. */
export type CellId = [DnaHash, AgentPubKey];
/** Microseconds since the epoch, as Holochain returns it. */
export type Timestamp = number;

// ---------------------------------------------------------------------------
// Layer 0 classification
// ---------------------------------------------------------------------------

// Seven variants as of #132. The four-variant version this file carried before
// (Private, Commons, Nondominium, CommonPool) was the UI's own narrowed set from
// the 2026-08-11 design review; the shared types have since restored the full
// Rust enum from `crates/shared/src/types.rs`, and the prototype follows the
// types, not the review.
export type PropertyRegime =
  | 'Private'
  | 'Commons'
  | 'Collective'
  | 'Pool'
  | 'CommonPool'
  | 'Public'
  | 'Nondominium';

export type ResourceNature = 'Physical' | 'Digital' | 'Service' | 'Hybrid' | 'Information';

/** Whether use by one agent excludes another. Decides which rules are coherent. */
export type Rivalry = 'Rivalrous' | 'NonRivalrous';

/** How far the resource's benefit reaches. */
export type ResourceScope = 'Project' | 'Network' | 'Public';

export type LifecycleStage =
  | 'Ideation'
  | 'Specification'
  | 'Development'
  | 'Prototype'
  | 'Stable'
  | 'Distributed'
  | 'Active'
  | 'Hibernating'
  | 'Deprecated'
  | 'EndOfLife';

/** Stages allowed when registering a new NDO via `create_ndo`. */
export const CREATABLE_NDO_LIFECYCLE_STAGES = [
  'Ideation',
  'Specification',
  'Development',
  'Prototype',
  'Stable',
  'Distributed',
  'Active'
] as const satisfies readonly LifecycleStage[];

export type CreatableNdoLifecycleStage = (typeof CREATABLE_NDO_LIFECYCLE_STAGES)[number];

// ---------------------------------------------------------------------------
// Layer 2 operational state
// ---------------------------------------------------------------------------

// Distinct from LifecycleStage on purpose, and this is the distinction #132
// spent a type on. A resource being repaired is still `LifecycleStage.Active`;
// it is `OperationalState.InMaintenance`. Never render one as the other.
export type OperationalState =
  | 'Available'
  | 'Reserved'
  | 'InTransit'
  | 'InStorage'
  | 'InMaintenance'
  | 'InUse'
  | 'PendingValidation';

// ---------------------------------------------------------------------------
// Classification constraints
// ---------------------------------------------------------------------------

export type ConstraintSeverity = 'Hard' | 'Soft';

export interface ConstraintViolation {
  rule_id: string;
  message: string;
  severity: ConstraintSeverity;
}

export interface CheckActionConstraintsInput {
  property_regime: PropertyRegime;
  resource_nature: ResourceNature;
  rivalry_override?: Rivalry;
  action: VfAction;
}

export interface CheckRuleDataConstraintsInput {
  property_regime: PropertyRegime;
  resource_nature: ResourceNature;
  rivalry_override?: Rivalry;
  rule_data: RuleData;
}

// ---------------------------------------------------------------------------
// Layer 1 typed governance rules
// ---------------------------------------------------------------------------

export type Accessibility = 'Free' | 'Credentialed' | 'Gated';

export type TransferType = 'Ownership' | 'Custody' | 'UseRights' | 'Benefit';

export type GovernanceRuleType =
  | 'AccessRequirement'
  | 'UsageLimit'
  | 'TransferCondition'
  | 'MaintenanceSchedule';

export interface AccessRequirementData {
  accessibility: Accessibility;
  required_role?: string;
  min_affiliation?: string;
}

export interface UsageLimitData {
  max_duration_hours?: number;
  max_quantity_per_period?: number;
  period_days?: number;
}

export interface TransferConditionData {
  transfer_type: TransferType;
  requires_validation: boolean;
  validator_role?: string;
}

export interface MaintenanceScheduleData {
  interval_days: number;
  required_role?: string;
}

/** Tagged RuleData — mirrors Rust `RuleData` enum (externally tagged by default). */
export type RuleData =
  | { AccessRequirement: AccessRequirementData }
  | { UsageLimit: UsageLimitData }
  | { TransferCondition: TransferConditionData }
  | { MaintenanceSchedule: MaintenanceScheduleData };

export interface GovernanceRule {
  rule_data: RuleData;
  enforced_by?: string;
  ndo_identity_hash: ActionHash;
  property_regime: PropertyRegime;
  resource_nature: ResourceNature;
  rivalry_override?: Rivalry;
}

export interface NestedGovernanceRuleInput {
  rule_data: RuleData;
  enforced_by?: string;
}

export interface GovernanceRuleInput {
  rule_data: RuleData;
  enforced_by?: string;
  ndo_identity_hash: ActionHash;
  property_regime: PropertyRegime;
  resource_nature: ResourceNature;
  rivalry_override?: Rivalry;
  /** When set, links the rule to a Layer 1 specification. */
  specification_hash?: ActionHash;
}

// ---------------------------------------------------------------------------
// Layer 1 specifications and resources
// ---------------------------------------------------------------------------

export interface ResourceSpecification {
  name: string;
  description: string;
  category: string;
  image_url?: string;
  tags?: string[];
  is_active?: boolean;
  scope?: ResourceScope;
  ndo_identity_hash?: ActionHash;
}

export interface ResourceSpecificationInput {
  name: string;
  description: string;
  category: string;
  image_url?: string;
  tags: string[];
  scope: ResourceScope;
  ndo_identity_hash: ActionHash;
  governance_rules: NestedGovernanceRuleInput[];
}

export interface EconomicResource {
  quantity: number;
  unit: string;
  custodian: AgentPubKey;
  current_location?: string;
  operational_state: OperationalState;
}

export interface ResourceSpecificationListing {
  action_hash: ActionHash;
  specification: ResourceSpecification;
}

export interface EconomicResourceRow {
  actionHash: ActionHash;
  resource: EconomicResource;
}

// ---------------------------------------------------------------------------
// ValueFlows events and commitments
// ---------------------------------------------------------------------------

export type VfAction =
  | 'Transfer'
  | 'Move'
  | 'Use'
  | 'Consume'
  | 'Produce'
  | 'Work'
  | 'Modify'
  | 'Combine'
  | 'Separate'
  | 'Raise'
  | 'Lower'
  | 'Cite'
  | 'Accept'
  | 'InitialTransfer'
  | 'AccessForUse'
  | 'TransferCustody';

export interface VfCommitment {
  action: VfAction;
  provider: AgentPubKey;
  receiver: AgentPubKey;
  resource_inventoried_as?: ActionHash | null;
  resource_conforms_to?: ActionHash | null;
  input_of?: ActionHash | null;
  due_date: Timestamp;
  note?: string | null;
  committed_at: Timestamp;
  ndo_identity_hash: ActionHash;
}

export interface ProposeCommitmentInput {
  action: VfAction;
  resource_hash?: ActionHash | null;
  resource_spec_hash?: ActionHash | null;
  provider: AgentPubKey;
  due_date: Timestamp;
  note?: string | null;
  ndo_identity_hash: ActionHash;
}

export interface ProposeCommitmentOutput {
  commitment_hash: ActionHash;
  commitment: VfCommitment;
}

export interface VfEconomicEvent {
  action: VfAction;
  provider: AgentPubKey;
  receiver: AgentPubKey;
  resource_inventoried_as: ActionHash;
  affects: ActionHash;
  resource_quantity: number;
  event_time: Timestamp;
  note?: string | null;
  ndo_identity_hash: ActionHash;
}

export interface LogEconomicEventInput {
  action: VfAction;
  provider: AgentPubKey;
  receiver: AgentPubKey;
  resource_inventoried_as: ActionHash;
  resource_quantity: number;
  note?: string | null;
  commitment_hash?: ActionHash | null;
  generate_pprs?: boolean | null;
  ndo_identity_hash: ActionHash;
}

export interface LogEconomicEventOutput {
  event_hash: ActionHash;
  event: VfEconomicEvent;
}

// ---------------------------------------------------------------------------
// NDO identity, groups, and agents
// ---------------------------------------------------------------------------

/** NDO card / lobby descriptor. */
export interface NdoDescriptor {
  hash: string;
  name: string;
  lifecycle_stage: string | null;
  property_regime: string | null;
  resource_nature: string | null;
  description: string | null;
  initiator: string | null;
  /** Microseconds, as Holochain returns it. The UI divides by 1000. */
  created_at: number | null;
  successor_ndo_hash: string | null;
  hibernation_origin: string | null;
  rivalry_override: string | null;
}

export interface NdoInput {
  name: string;
  property_regime: PropertyRegime;
  resource_nature: ResourceNature;
  lifecycle_stage: LifecycleStage;
  description?: string;
  rivalry_override?: Rivalry;
}

export interface NdoTransitionHistoryEvent {
  from_stage: string;
  to_stage: string;
  /**
   * Raw 39-byte key in the app, base64 here. It was declared `string` in the
   * app until 2026-08-25, which typechecked a `.slice(0, 10)` as a string slice
   * and let TransitionHistoryPanel render a comma-separated byte list (#132,
   * F9). The prototype cannot reproduce that bug because its value is already
   * encoded, which is exactly why the panel must never be "fixed" here first.
   */
  agent: AgentPubKey;
  timestamp: number;
  event_hash: ActionHash;
}

export interface GroupDescriptor {
  /** Canonical key — the cloned cell's `network_seed`. */
  id: string;
  name: string;
  createdBy?: string;
  createdAt?: number;
}

export interface LobbyUserProfile {
  nickname: string;
  realName?: string;
  bio?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface GroupMemberProfile {
  isAnonymous: boolean;
  shownFields: (keyof Omit<LobbyUserProfile, 'nickname'>)[];
}

export interface Member {
  id: string;
  name: string;
  role?: string;
}

// Both of these carried a narrowed shape until 2026-09-08: `Person` had two fields
// and `PersonRole` had one, which is what the prototype happened to render rather
// than what the app declares. `GovernanceTab` imports `PersonRole` from the shared
// types, so a designer reading the kit saw a one-field type where the app has six,
// and could not see that a role carries who assigned it and when. Restored from
// `packages/shared-types/src/person.types.ts` at 20adb11.

export interface Person {
  name: string;
  nickname?: string;
  avatar_url?: string;
  bio?: string;
  agent_pub_key: AgentPubKey;
  created_at: Timestamp;
  /** ActionHash of the corresponding ReaAgent in the hREA DNA (Phase 1 bridge) */
  hrea_agent_hash?: ActionHash;
}

export interface PersonRole {
  role_name: string;
  description?: string;
  permissions?: string[];
  assigned_to?: AgentPubKey;
  assigned_by: AgentPubKey;
  assigned_at: Timestamp;
}

export interface ActiveFilters {
  stages: LifecycleStage[];
  natures: ResourceNature[];
  regimes: PropertyRegime[];
}
