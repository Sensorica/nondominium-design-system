// Domain types, copied from `nondominium/packages/shared-types`.
//
// These are verbatim, field for field, including the `| null` unions the real
// descriptor carries. The prototype's whole value is that it renders what the
// app renders, and a component branches differently on `null` than it does on
// `undefined` — so the nulls come across too.

export type PropertyRegime = 'Private' | 'Commons' | 'Nondominium' | 'CommonPool';

export type ResourceNature = 'Physical' | 'Digital' | 'Service' | 'Hybrid' | 'Information';

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
}

export interface NdoInput {
  name: string;
  property_regime: PropertyRegime;
  resource_nature: ResourceNature;
  lifecycle_stage: LifecycleStage;
  description?: string;
}

export interface NdoTransitionHistoryEvent {
  from_stage: string;
  to_stage: string;
  agent: string;
  timestamp: number;
  event_hash: string;
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

export interface Person {
  name: string;
  agent_pub_key: string;
}

export interface PersonRole {
  role_name: string;
}

export interface GovernanceRule {
  rule_type: string;
  rule_data: string;
  enforced_by?: string;
}

export interface ResourceSpecificationListing {
  action_hash: string;
  specification: { name: string; category?: string; is_active?: boolean };
}

export interface EconomicResourceRow {
  actionHash: string;
  resource: { quantity: number; unit: string; state: string };
}

export interface VfEconomicEvent {
  action: string;
  resource_quantity: number;
  /** Microseconds. */
  event_time: number;
  note?: string;
}

export interface ActiveFilters {
  stages: LifecycleStage[];
  natures: ResourceNature[];
  regimes: PropertyRegime[];
}
