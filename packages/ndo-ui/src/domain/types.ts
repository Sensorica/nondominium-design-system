export type PropertyRegime = 'Private' | 'Commons' | 'Nondominium' | 'CommonPool';

/** Layer 0 nature. Digital includes designs, data, documents, datasets, and methods. */
export type ResourceNature = 'Physical' | 'Digital' | 'Hybrid';

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

/** How a rivalrous resource subtracts. A usage rule, not a second rivalry value. */
export type SubtractionKind = 'unit' | 'capacity' | 'consumable';

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
  /** Prototype: carry Source / archetype metadata from the create wizard into session state. */
  ndo_archetype?: NdoArchetypeId | null;
  source_profile?: SourceProfile | null;
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
  /** Set for Physical and Hybrid. Null for Digital. */
  subtraction?: SubtractionKind | null;
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

/**
 * VF-aligned inventory intent (foreshadow — not yet on Rust ResourceSpecification).
 * @see https://www.valueflo.ws/concepts/resources/#inventory
 */
export type InventoryIntent = 'Inventoried' | 'NotInventoried' | 'NotApplicable';

/**
 * VF identification pattern for inventoriable kinds (foreshadow).
 * Serialized = unique id per instance; LotControlled = batch id; Stock = count/volume.
 * Not used for Digital — digital kinds use {@link DigitalLocatorKind} instead.
 */
export type IdentificationPattern = 'Serialized' | 'LotControlled' | 'Stock';

/**
 * How a digital artifact is reached (foreshadow — not shelf inventory).
 * Digital kinds are NotApplicable for inventory; identity is by address / content hash.
 */
export type DigitalLocatorKind =
  | 'ContentAddressed'
  | 'Url'
  | 'Repository'
  | 'DistributedStore'
  | 'HostedService'
  | 'LocalHost';

/** Prototype foreshadow of SourceSpecification Layer 1 fields (not on Rust yet). */
export interface SourceSpecForeshadow {
  boundary_description?: string | null;
  monitoring_plan?: string | null;
  stakeholder_map?: string | null;
  restoration_obligations?: string | null;
}

/** Prototype-only VF foreshadow fields stored on the session spec. */
export interface SpecForeshadow extends SourceSpecForeshadow {
  inventory_intent: InventoryIntent;
  identification_pattern: IdentificationPattern | null;
  default_unit: string | null;
  substitutable: boolean | null;
  /** Digital only: how the artifact is located (never inventory). */
  digital_locator_kind?: DigitalLocatorKind | null;
  /** Digital only: address, URI, CID, repo path, host id, etc. */
  digital_locator?: string | null;
}

/**
 * Layer 1 ResourceSpecification — mirrors the Rust entry in zome_resource.
 * Linked from Layer 0 via NdoToSpecification; does not modify NondominiumIdentity.
 */
export interface ResourceSpecification {
  /** Original create action hash (stable identity for this spec). */
  action_hash: string;
  name: string;
  description: string;
  /**
   * Primary browse classification (Rust field name `category`).
   * Not the kind itself — VF classification for discovery.
   */
  category: string;
  image_url: string | null;
  /** Additional browse classifications / facets. */
  tags: string[];
  is_active: boolean;
  scope: ResourceScope;
  /** Immutable pointer to the Layer 0 NDO action hash. */
  ndo_identity_hash: string;
  /**
   * Lifecycle stage observed when Layer 1 was activated
   * (mock equivalent of Rust `ndo_state_hash`).
   */
  activated_at_stage: LifecycleStage | string;
  /** Author agent key; updates are author-only. */
  author: string;
  created_at: number;
  /** Prototype foreshadow of VF inventory / identification (not on Rust yet). */
  inventory_intent?: InventoryIntent;
  identification_pattern?: IdentificationPattern | null;
  default_unit?: string | null;
  substitutable?: boolean | null;
  digital_locator_kind?: DigitalLocatorKind | null;
  digital_locator?: string | null;
  /** Source-NDO Layer 1 foreshadow (SourceSpecification). */
  boundary_description?: string | null;
  monitoring_plan?: string | null;
  stakeholder_map?: string | null;
  restoration_obligations?: string | null;
}

/** Mutable fields accepted when creating or updating a Layer 1 specification. */
export interface ResourceSpecificationInput {
  name: string;
  description: string;
  /** Primary browse classification (maps to Rust `category`). */
  category?: string;
  image_url?: string | null;
  tags?: string[];
  scope: ResourceScope;
  inventory_intent?: InventoryIntent;
  identification_pattern?: IdentificationPattern | null;
  default_unit?: string | null;
  substitutable?: boolean | null;
  digital_locator_kind?: DigitalLocatorKind | null;
  digital_locator?: string | null;
  boundary_description?: string | null;
  monitoring_plan?: string | null;
  stakeholder_map?: string | null;
  restoration_obligations?: string | null;
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
