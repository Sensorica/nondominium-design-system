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

export type Rivalry = 'Rivalrous' | 'NonRivalrous';

export type ResourceScope = 'Project' | 'Network' | 'Public';

export type ResourceSource = 'Network' | 'Partner' | 'Purchased' | 'Donated';

export type Accessibility = 'Free' | 'Credentialed' | 'Gated';

export type Transferability = 'Transferable' | 'NonTransferable' | 'Shareable';

export type WizardTier = 'Simple' | 'Guided' | 'Expert';

export type NdoArchetypeId = 'stub' | 'open_design' | 'active_project' | 'source_ndo';

export type SourceRegimeState =
  | 'Pristine'
  | 'Stable'
  | 'Stressed'
  | 'Degraded'
  | 'Critical'
  | 'Transformed';

export type SourceType =
  | 'Hydrological'
  | 'Biological'
  | 'Atmospheric'
  | 'KnowledgeCommons'
  | 'SocialCommons';

export type EcologicalValueDimension =
  | 'Sustenance'
  | 'Regeneration'
  | 'Resilience'
  | 'AdaptiveCapacity'
  | 'GenerativeCapacity'
  | 'CommonsValue'
  | 'LearningValue';

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
  /** Optional forward-map classification fields */
  rivalry?: Rivalry | null;
  scope?: ResourceScope | null;
  source?: ResourceSource | null;
  transferability?: Transferability | null;
  accessibility?: Accessibility | null;
  /** When set, this NDO is a Source-NDO specialization */
  ndo_archetype?: NdoArchetypeId | null;
  source_profile?: SourceProfile | null;
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

export interface SourceProfile {
  source_type: SourceType;
  regime_state: SourceRegimeState;
  stewarded_by: string[];
  current_stock?: number | null;
  flux_rate?: number | null;
  assimilation_capacity?: number | null;
  resilience?: number | null;
  tipping_threshold?: number | null;
  adaptive_capacity?: number | null;
  generative_capacity?: number | null;
  dependency_index?: number | null;
  complex_interior?: boolean;
  ecological_values?: Partial<Record<EcologicalValueDimension, number>>;
}

export interface WizardKernelState {
  archetype: NdoArchetypeId;
  tier: WizardTier;
  name: string;
  description: string;
  resource_nature: ResourceNature;
  lifecycle_stage: LifecycleStage;
}

export interface WizardRefinementState {
  property_regime: PropertyRegime;
  rivalry: Rivalry | null;
  scope: ResourceScope | null;
  source: ResourceSource | null;
  transferability: Transferability | null;
  accessibility: Accessibility | null;
  regime_not_sure: boolean;
  source_profile?: SourceProfile | null;
}

export interface SpecFieldValue {
  fieldId: string;
  value: string;
}

export interface NdoSpecificationDraft {
  category?: string;
  tags?: string[];
  fields: SpecFieldValue[];
  governance_rule_ids: string[];
}

export interface WizardResult {
  kernel: WizardKernelState;
  refinement: WizardRefinementState;
  specification?: NdoSpecificationDraft | null;
  /** Layer 0 payload compatible with existing hApp API */
  ndo_input: NdoInput;
}

export interface GovernanceRuleTemplate {
  id: string;
  rule_type: string;
  label: string;
  rationale: string;
  rule_data: Record<string, unknown>;
  enforced_by?: string;
}

export interface SpecProfileField {
  id: string;
  label: string;
  placeholder?: string;
  helpText?: string;
  inputType: 'text' | 'textarea' | 'url' | 'number';
  required?: boolean;
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
