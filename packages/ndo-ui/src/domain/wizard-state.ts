import { getArchetype } from './wizard-archetypes.js';
import { getGovernanceTemplatesForNdo } from './governance-templates.js';
import {
  accessOptionsForNature,
  buildDefaultRefinement,
  inferRegimeFromRivalryAndAccess,
  inferTransferability,
  natureForSourceType,
  regimesForNature,
  rivalryForNature,
  scopePermitted,
  withCoherentScope,
  type NatureChoice
} from './wizard-questions.js';
import type {
  EconomicMode,
  NdoArchetypeId,
  NdoDescriptor,
  NdoInput,
  NdoSpecificationDraft,
  PropertyRegime,
  ResourceNature,
  Rivalry,
  SourceProfile,
  SourceRegimeState,
  SourceType,
  SubtractionKind,
  UseKind,
  WizardKernelState,
  WizardRefinementState,
  WizardResult
} from './types.js';

export type WizardStepId = 'archetype' | 'kernel' | 'refinement' | 'review';

export interface WizardStepMeta {
  id: WizardStepId;
  label: string;
  shortLabel: string;
}

export function getWizardSteps(archetypeId: NdoArchetypeId): WizardStepMeta[] {
  const archetype = getArchetype(archetypeId);
  const steps: WizardStepMeta[] = [
    { id: 'archetype', label: 'Intent', shortLabel: '1' },
    { id: 'kernel', label: 'Identity', shortLabel: '2' }
  ];
  if (archetype.showRefinement) {
    steps.push({
      id: 'refinement',
      label: archetype.isSourceNdo ? 'Stewardship' : 'Governance',
      shortLabel: '3'
    });
  }
  steps.push({ id: 'review', label: 'Review', shortLabel: String(steps.length + 1) });
  return steps;
}

export function emptyEconomicForeshadow(): Pick<
  WizardKernelState,
  | 'economic_mode'
  | 'use_kind'
  | 'default_unit'
  | 'initial_quantity'
  | 'identification_pattern'
  | 'unique_id'
  | 'max_concurrent_users'
> {
  return {
    economic_mode: null,
    use_kind: null,
    default_unit: null,
    initial_quantity: null,
    identification_pattern: null,
    unique_id: null,
    max_concurrent_users: null
  };
}

/** True when Layer 0 must choose Use vs Consume. */
export function needsEconomicMode(
  nature: ResourceNature,
  isSourceNdo: boolean
): boolean {
  if (isSourceNdo) return false;
  return nature === 'Physical' || nature === 'Hybrid';
}

/** Gate for inventoriable / Layer 1 create affordances on the Resources tab. */
export type ManualCreateGate = {
  economicMode?: EconomicMode | null;
  resourceNature?: ResourceNature | string | null;
  isSource?: boolean;
  /** Linked ResourceSpecification count — first-order NDOs allow only the initial Specify. */
  existingSpecCount?: number;
};

/**
 * Whether the UI may offer manual `create_economic_resource` (Inventoried instances).
 *
 * False for: Digital (unique by locator), Source (not stock), Use/Consume
 * (hard dual create owns the inventoriable resource). Hybrid may inventory the
 * physical twin when `economic_mode` is unset.
 */
export function allowsManualEconomicResourceCreate(gate: ManualCreateGate): boolean {
  if (gate.isSource) return false;
  if (String(gate.resourceNature ?? '') === 'Digital') return false;
  if (gate.economicMode) return false;
  return true;
}

/**
 * Whether the UI may offer the initial Layer 1 Specify CTA (create a ResourceSpecification).
 * False once a specification already exists (first-order NDO = one live form; further versions
 * are edits/supersedes, not sibling kinds). Use/Consume dual-create owns the one kind.
 * Another concrete artifact is a new NDO, not another spec row.
 */
export function allowsManualKindOfItemCreate(gate: ManualCreateGate): boolean {
  if (gate.economicMode) return false;
  if ((gate.existingSpecCount ?? 0) > 0) return false;
  return true;
}

/** Map Use/Consume (+ use_kind) onto legacy SubtractionKind. */
export function deriveSubtraction(
  economicMode: EconomicMode | null,
  useKind: UseKind | null
): SubtractionKind | null {
  if (economicMode === 'consume') return 'consumable';
  if (economicMode === 'use') {
    if (useKind === 'capacity') return 'capacity';
    if (useKind === 'unit') return 'unit';
  }
  return null;
}

export function createInitialKernel(archetypeId: NdoArchetypeId): WizardKernelState {
  const archetype = getArchetype(archetypeId);
  const resource_nature: ResourceNature =
    archetype.id === 'open_design' ? 'Digital' : 'Physical';
  return {
    archetype: archetypeId,
    tier: archetype.tier,
    name: '',
    description: '',
    // Share-a-design defaults to Digital (not inventoriable). Source NDOs stay Physical
    // unless KnowledgeCommons maps nature elsewhere.
    resource_nature,
    lifecycle_stage: archetype.defaultLifecycleStage,
    ...emptyEconomicForeshadow()
  };
}

/**
 * When nature changes, clear inventoriable fields unless Physical/Hybrid non-Source.
 * Syncs refinement.subtraction from economic_mode.
 */
export function alignKernelToNature(
  kernel: WizardKernelState,
  nature: ResourceNature,
  isSourceNdo: boolean
): WizardKernelState {
  if (!needsEconomicMode(nature, isSourceNdo)) {
    return { ...kernel, resource_nature: nature, ...emptyEconomicForeshadow() };
  }
  return { ...kernel, resource_nature: nature };
}

export function syncRefinementSubtraction(
  refinement: WizardRefinementState,
  kernel: WizardKernelState,
  isSourceNdo: boolean
): WizardRefinementState {
  if (!needsEconomicMode(kernel.resource_nature, isSourceNdo)) {
    return { ...refinement, subtraction: null };
  }
  return {
    ...refinement,
    subtraction: deriveSubtraction(kernel.economic_mode, kernel.use_kind)
  };
}

export function createInitialRefinement(
  archetypeId: NdoArchetypeId,
  nature: ResourceNature
): WizardRefinementState {
  const archetype = getArchetype(archetypeId);
  const regime = archetype.defaultRegime ?? 'Commons';
  const refinement = buildDefaultRefinement(nature, regime);

  if (archetype.isSourceNdo) {
    refinement.property_regime = archetype.defaultRegime ?? 'Nondominium';
    refinement.transferability = 'Shareable';
    refinement.source_profile = createDefaultSourceProfile();
  }

  return withCoherentScope(refinement);
}

/** Keep rivalry, and drop a regime the nature no longer allows. */
export function alignRefinementToNature(
  refinement: WizardRefinementState,
  nature: ResourceNature,
  allowedRegimes: readonly PropertyRegime[] | null
): WizardRefinementState {
  const rivalry = rivalryForNature(nature);
  const regimes = regimesForNature(nature, allowedRegimes);
  const property_regime = regimes.includes(refinement.property_regime)
    ? refinement.property_regime
    : (regimes[0] ?? refinement.property_regime);
  return withCoherentScope({
    ...refinement,
    rivalry,
    property_regime,
    transferability: inferTransferability(property_regime),
    subtraction: rivalry === 'Rivalrous' ? (refinement.subtraction ?? null) : null,
    regime_not_sure: regimes.includes(refinement.property_regime) ? refinement.regime_not_sure : false
  });
}

/** A source type sets Layer 0 nature: ecological sources are physical, knowledge and social commons are digital. */
export function applySourceType(
  kernel: WizardKernelState,
  refinement: WizardRefinementState,
  sourceType: SourceType,
  allowedRegimes: readonly PropertyRegime[] | null
): { kernel: WizardKernelState; refinement: WizardRefinementState } {
  const nature = natureForSourceType(sourceType);
  const source_profile = {
    ...(refinement.source_profile ?? createDefaultSourceProfile()),
    source_type: sourceType
  };
  const nextKernel = alignKernelToNature(
    { ...kernel, resource_nature: nature },
    nature,
    true
  );
  return {
    kernel: nextKernel,
    refinement: syncRefinementSubtraction(
      alignRefinementToNature({ ...refinement, source_profile }, nature, allowedRegimes),
      nextKernel,
      true
    )
  };
}

export function createDefaultSourceProfile(): SourceProfile {
  return {
    source_type: 'Hydrological',
    regime_state: 'Stable',
    stewarded_by: [],
    current_stock: null,
    flux_rate: null,
    assimilation_capacity: null,
    resilience: 0.7,
    tipping_threshold: null,
    complex_interior: true,
    ecological_values: {}
  };
}

export function applyAccessAnswer(
  refinement: WizardRefinementState,
  accessId: 'private' | 'community_share' | 'uncapturable' | 'bounded_pool',
  rivalry: Rivalry
): WizardRefinementState {
  const regime = inferRegimeFromRivalryAndAccess(rivalry, accessId);
  return withCoherentScope({
    ...refinement,
    property_regime: regime,
    rivalry,
    regime_not_sure: false,
    transferability: regime === 'Private' ? 'Transferable' : 'Shareable'
  });
}

/** Recommended Layer 1 template ids for the current kernel + refinement. */
export function recommendedGovernanceRuleIds(
  kernel: WizardKernelState,
  refinement: WizardRefinementState
): string[] {
  const isSource = kernel.archetype === 'source_ndo';
  return getGovernanceTemplatesForNdo({
    regime: refinement.property_regime,
    nature: kernel.resource_nature,
    isSourceNdo: isSource,
    economicMode: kernel.economic_mode,
    useKind: kernel.use_kind,
    maxConcurrentUsers: kernel.max_concurrent_users
  }).map((t) => t.id);
}

/**
 * Empty draft when enrichment opens — recommended templates are listed on the
 * Governance tab; the agent must select and apply them (no silent preselect).
 */
export function defaultSpecificationDraftForDescriptor(
  _descriptor: NdoDescriptor
): NdoSpecificationDraft {
  return { fields: [], governance_rule_ids: [] };
}

export function buildWizardResult(
  kernel: WizardKernelState,
  refinement: WizardRefinementState,
  specification?: NdoSpecificationDraft | null
): WizardResult {
  const isSource = kernel.archetype === 'source_ndo';
  const synced = syncRefinementSubtraction(refinement, kernel, isSource);
  // Never pre-fill governance_rule_ids for create: recommendations are shown on
  // Review / Governance for the agent to select and Apply explicitly.
  const draft =
    specification ??
    ({
      fields: [],
      governance_rule_ids: []
    } satisfies NdoSpecificationDraft);
  const ndo_input: NdoInput = {
    name: kernel.name.trim(),
    property_regime: synced.property_regime,
    resource_nature: kernel.resource_nature,
    lifecycle_stage: kernel.lifecycle_stage,
    ...(kernel.description.trim() && { description: kernel.description.trim() }),
    ndo_archetype: kernel.archetype,
    ...(isSource && synced.source_profile ? { source_profile: synced.source_profile } : {}),
    ...(kernel.economic_mode != null ? { economic_mode: kernel.economic_mode } : {}),
    ...(kernel.use_kind != null ? { use_kind: kernel.use_kind } : {}),
    ...(kernel.default_unit?.trim() ? { default_unit: kernel.default_unit.trim() } : {}),
    ...(kernel.initial_quantity != null ? { initial_quantity: kernel.initial_quantity } : {}),
    ...(kernel.identification_pattern != null
      ? { identification_pattern: kernel.identification_pattern }
      : kernel.economic_mode === 'use' && kernel.use_kind === 'unit'
        ? { identification_pattern: 'Serialized' as const }
        : {}),
    ...(kernel.unique_id?.trim() ? { unique_id: kernel.unique_id.trim() } : {}),
    ...(kernel.max_concurrent_users != null
      ? { max_concurrent_users: kernel.max_concurrent_users }
      : {})
  };

  return {
    kernel,
    refinement: synced,
    specification: draft,
    ndo_input
  };
}

export function validateKernel(kernel: WizardKernelState): string | null {
  if (!kernel.name.trim()) return 'Name is required.';
  const archetype = getArchetype(kernel.archetype);
  if (!(archetype.allowedLifecycleStages as readonly string[]).includes(kernel.lifecycle_stage)) {
    return 'This intent cannot be registered at that stage.';
  }

  if (!needsEconomicMode(kernel.resource_nature, archetype.isSourceNdo)) {
    return null;
  }

  if (!kernel.economic_mode) {
    return 'Choose whether this is for use (operate) or consume (batch / stock).';
  }

  if (kernel.economic_mode === 'use') {
    if (!kernel.use_kind) {
      return 'Choose whether this is one held thing or a place with capacity.';
    }
    if (kernel.use_kind === 'capacity') {
      const n = kernel.max_concurrent_users;
      if (n == null || !Number.isFinite(n) || n < 2) {
        return 'Capacity requires a maximum concurrent occupants of at least 2.';
      }
    }
    return null;
  }

  // consume
  if (!kernel.default_unit?.trim()) {
    return 'Enter a unit for this batch (e.g. kg, each, L).';
  }
  if (
    kernel.initial_quantity == null ||
    !Number.isFinite(kernel.initial_quantity) ||
    kernel.initial_quantity <= 0
  ) {
    return 'Enter an initial quantity greater than zero.';
  }
  if (!kernel.identification_pattern) {
    return 'Choose how this batch is identified (lot or stock).';
  }
  return null;
}

export function validateRefinement(
  refinement: WizardRefinementState,
  isSourceNdo: boolean,
  nature: ResourceNature,
  allowedRegimes: readonly PropertyRegime[] | null,
  kernel?: WizardKernelState
): string | null {
  if (
    refinement.property_regime === 'Nondominium' &&
    (refinement.scope == null || !scopePermitted(refinement.property_regime, refinement.scope))
  ) {
    return 'This property arrangement requires public scope.';
  }
  const regimes = isSourceNdo
    ? regimesForNature(nature, allowedRegimes)
    : accessOptionsForNature(nature, allowedRegimes).map((option) => option.suggestedRegime);
  if (!regimes.includes(refinement.property_regime)) {
    return 'This access arrangement does not fit the kind of resource.';
  }
  // Subtraction is set on the identity step for Physical/Hybrid; only fall back
  // if kernel was not provided (legacy callers).
  if (!isSourceNdo && rivalryForNature(nature) === 'Rivalrous') {
    const subtraction =
      kernel != null
        ? deriveSubtraction(kernel.economic_mode, kernel.use_kind)
        : refinement.subtraction;
    if (!subtraction) {
      return 'Choose whether this is for use or consume on the identity step.';
    }
  }
  if (isSourceNdo && refinement.source_profile) {
    if (refinement.source_profile.stewarded_by.length === 0) {
      return 'At least one steward is required for a Source-NDO.';
    }
  }
  return null;
}

export function updateSourceProfileField(
  profile: SourceProfile,
  field: keyof SourceProfile,
  value: unknown
): SourceProfile {
  return { ...profile, [field]: value };
}

export function setSourceType(profile: SourceProfile, sourceType: SourceType): SourceProfile {
  return { ...profile, source_type: sourceType };
}

export function setSourceRegimeState(
  profile: SourceProfile,
  state: SourceRegimeState
): SourceProfile {
  return { ...profile, regime_state: state };
}

export function suggestedNatureFromChoice(choice: NatureChoice): ResourceNature {
  return choice.id;
}
