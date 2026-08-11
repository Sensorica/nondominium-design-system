// Shared domain types for the /app prototype.
// Mirrors `nondominium/packages/shared-types` so prototype screens map 1:1 onto
// the real client. Where the Rust crate and the UI package disagree, the UI
// package wins here and the divergence is noted — the design system prototypes
// the UI, not the zome.

// ── NDO Layer 0 enums ────────────────────────────────────────────────────────

/** The ten-stage NDO lifecycle. Order is significant: the flow guard's forward
 *  transition table walks this array. */
export const LIFECYCLE_STAGES = [
  'Ideation',
  'Specification',
  'Development',
  'Prototype',
  'Stable',
  'Distributed',
  'Active',
  'Hibernating',
  'Deprecated',
  'EndOfLife',
] as const;
export type LifecycleStage = (typeof LIFECYCLE_STAGES)[number];

/** Stages an NDO may be registered at. Hibernating and the two terminal stages
 *  are transition-only (requirements.md §4.5, REQ-UI-NDO-01). */
export const CREATABLE_STAGES = LIFECYCLE_STAGES.slice(0, 7) as readonly LifecycleStage[];

/** The four regimes the UI exposes. The Rust crate additionally carries
 *  `Collective` and `Pool`; they were removed from the UI after design review
 *  (resources.md §2.6) and the badge registry still renders them for data that
 *  predates that decision. */
export const PROPERTY_REGIMES = ['Private', 'Commons', 'Nondominium', 'CommonPool'] as const;
export type PropertyRegime = (typeof PROPERTY_REGIMES)[number];

export const RESOURCE_NATURES = ['Physical', 'Digital', 'Service', 'Hybrid', 'Information'] as const;
export type ResourceNature = (typeof RESOURCE_NATURES)[number];

// ── NDO ──────────────────────────────────────────────────────────────────────

export type NdoDescriptor = {
  /** Stands in for the Layer 0 action hash. Short and readable in URLs. */
  id: string;
  /** The full base64 hash, shown in the identity panel and copyable. */
  hash: string;
  name: string;
  description: string;
  property_regime: PropertyRegime;
  resource_nature: ResourceNature;
  lifecycle_stage: LifecycleStage;
  /** Agent id of the initiator; resolves against `agents`. */
  initiator: string;
  created_at: string;
  /** Set once, when the NDO moves to Deprecated (REQ-NDO-LC-06). */
  successor_ndo_hash?: string;
  /** Recorded on the way into Hibernating; the stage a resume returns to. */
  hibernation_origin?: LifecycleStage;
  /** Group ids this NDO is associated with, via SoftLinks on the group cell. */
  groupIds: string[];
};

export type NdoTransitionHistoryEvent = {
  from_stage: LifecycleStage;
  to_stage: LifecycleStage;
  /** Agent id of the actor. */
  agent: string;
  timestamp: string;
  /** The triggering EconomicEvent. Null in the MVP — automatic event generation
   *  is backend Phase 2.3 (specifications.md §7.5). */
  event_hash: string | null;
};

/** Typed cross-NDO relations (zome_gouvernance `NdoLinkType`). */
export type NdoLinkType = 'Component' | 'DerivedFrom' | 'Supersedes';

export type NdoHardLink = {
  id: string;
  from: string;
  to: string;
  link_type: NdoLinkType;
  note?: string;
};

/** Peer-validated work on an NDO (zome_gouvernance `Contribution`). */
export type Contribution = {
  id: string;
  ndoId: string;
  provider: string;
  action: string;
  effort_hours?: number;
  validated_by: string[];
  at: string;
  note?: string;
};

/** A benefit-redistribution clause on an NDO (`Agreement` / `BenefitClause`). */
export type BenefitClause = {
  id: string;
  label: string;
  share: number;
  beneficiary: string;
};

export type Agreement = {
  id: string;
  ndoId: string;
  version: number;
  clauses: BenefitClause[];
  primary_accountable: string[];
};

/** An economic resource instance under an NDO's specification. */
export type EconomicResource = {
  id: string;
  ndoId: string;
  label: string;
  quantity: number;
  unit: string;
  custodian: string;
  location?: string;
  state: 'PendingValidation' | 'Active' | 'Maintenance' | 'Retired' | 'Reserved';
};

// ── Agents & identity (the three-level ladder, requirements.md §4.5) ──────────

/** Level 1 — Lobby. localStorage only, never a DHT write. */
export type LobbyUserProfile = {
  nickname: string;
  realName?: string;
  bio?: string;
  email?: string;
  phone?: string;
  address?: string;
};

/** Level 2 — Group. A per-group disclosure choice over the Level 1 profile. */
export type GroupMemberProfile = {
  isAnonymous: boolean;
  shownFields: (keyof Omit<LobbyUserProfile, 'nickname'>)[];
};

/** Level 3 — the public `Person` entry in zome_person. */
export type Agent = {
  id: string;
  /** Truncated AgentPubKey, as the UI renders it when no Person exists. */
  pubKey: string;
  /** Present only once a Person entry has been committed. */
  person?: {
    name: string;
    avatar_url?: string;
    bio?: string;
  };
  roles: RoleType[];
  joinedAt: string;
};

export const ROLE_TYPES = [
  'SimpleAgent',
  'AccountableAgent',
  'PrimaryAccountableAgent',
  'Transport',
  'Repair',
  'Storage',
] as const;
export type RoleType = (typeof ROLE_TYPES)[number];

// ── Groups ───────────────────────────────────────────────────────────────────

export type GroupDescriptor = {
  /** Canonical key = the clone cell's network seed. */
  id: string;
  networkSeed: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  /** Agent ids with a GroupMembership entry on the clone cell. */
  memberIds: string[];
  /** Level 2 disclosure choice for the current agent, if made. */
  memberProfile?: GroupMemberProfile;
};

export type WorkLogEntry = {
  id: string;
  groupId: string;
  agent: string;
  summary: string;
  hours: number;
  at: string;
};

// ── Layer-level modal targets, driven from the state singleton ───────────────

export type ConfirmTarget = { message: string; detail?: string; onConfirm: () => void };
export type ToastTarget = { kind: 'success' | 'error' | 'info'; message: string };
