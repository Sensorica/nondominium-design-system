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

export interface NdoDescriptor {
  hash: string;
  name: string;
  lifecycle_stage: LifecycleStage | string | null;
  property_regime: PropertyRegime | string | null;
  resource_nature: ResourceNature | string | null;
  description: string | null;
  initiator: string | null;
  created_at: number | null;
  successor_ndo_hash: string | null;
  hibernation_origin: LifecycleStage | string | null;
}

export interface GroupDescriptor {
  id: string;
  name: string;
  createdBy?: string;
  createdAt?: number;
  ndoHashes?: string[];
  memberProfile?: GroupMemberProfile;
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

export interface ActiveFilters {
  stages: LifecycleStage[];
  natures: ResourceNature[];
  regimes: PropertyRegime[];
}

export interface GroupMember {
  id: string;
  name: string;
  role?: string;
}
