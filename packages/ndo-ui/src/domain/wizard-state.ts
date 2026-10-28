import { getArchetype } from './wizard-archetypes.js';
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
  NdoArchetypeId,
  NdoInput,
  NdoSpecificationDraft,
  PropertyRegime,
  ResourceNature,
  Rivalry,
  SourceProfile,
  SourceRegimeState,
  SourceType,
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

export function createInitialKernel(archetypeId: NdoArchetypeId): WizardKernelState {
  const archetype = getArchetype(archetypeId);
  return {
    archetype: archetypeId,
    tier: archetype.tier,
    name: '',
    description: '',
    // Share-a-design defaults to Digital (not inventoriable). Source NDOs stay Physical
    // unless KnowledgeCommons maps nature elsewhere.
    resource_nature:
      archetype.id === 'open_design' ? 'Digital' : 'Physical',
    lifecycle_stage: archetype.defaultLifecycleStage
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
  return {
    kernel: { ...kernel, resource_nature: nature },
    refinement: alignRefinementToNature(
      { ...refinement, source_profile },
      nature,
      allowedRegimes
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

export function buildWizardResult(
  kernel: WizardKernelState,
  refinement: WizardRefinementState,
  specification?: NdoSpecificationDraft | null
): WizardResult {
  const isSource = kernel.archetype === 'source_ndo';
  const ndo_input: NdoInput = {
    name: kernel.name.trim(),
    property_regime: refinement.property_regime,
    resource_nature: kernel.resource_nature,
    lifecycle_stage: kernel.lifecycle_stage,
    ...(kernel.description.trim() && { description: kernel.description.trim() }),
    ndo_archetype: kernel.archetype,
    ...(isSource && refinement.source_profile
      ? { source_profile: refinement.source_profile }
      : {})
  };

  return {
    kernel,
    refinement,
    specification: specification ?? null,
    ndo_input
  };
}

export function validateKernel(kernel: WizardKernelState): string | null {
  if (!kernel.name.trim()) return 'Name is required.';
  const archetype = getArchetype(kernel.archetype);
  if (!(archetype.allowedLifecycleStages as readonly string[]).includes(kernel.lifecycle_stage)) {
    return 'This intent cannot be registered at that stage.';
  }
  return null;
}

export function validateRefinement(
  refinement: WizardRefinementState,
  isSourceNdo: boolean,
  nature: ResourceNature,
  allowedRegimes: readonly PropertyRegime[] | null
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
  if (!isSourceNdo && rivalryForNature(nature) === 'Rivalrous' && !refinement.subtraction) {
    return 'Choose how use runs out.';
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
