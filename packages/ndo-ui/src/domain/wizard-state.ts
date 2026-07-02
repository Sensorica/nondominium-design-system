import { getArchetype } from './wizard-archetypes.js';
import {
  buildDefaultRefinement,
  inferRegimeFromRivalryAndAccess,
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
    steps.push({ id: 'refinement', label: 'Governance', shortLabel: '3' });
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
    resource_nature: archetype.isSourceNdo ? 'Physical' : 'Physical',
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

  return refinement;
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
  return {
    ...refinement,
    property_regime: regime,
    rivalry,
    regime_not_sure: false,
    transferability: regime === 'Private' ? 'Transferable' : 'Shareable'
  };
}

export function buildWizardResult(
  kernel: WizardKernelState,
  refinement: WizardRefinementState,
  specification?: NdoSpecificationDraft | null
): WizardResult {
  const ndo_input: NdoInput = {
    name: kernel.name.trim(),
    property_regime: refinement.property_regime,
    resource_nature: kernel.resource_nature,
    lifecycle_stage: kernel.lifecycle_stage,
    ...(kernel.description.trim() && { description: kernel.description.trim() })
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
  return null;
}

export function validateRefinement(
  refinement: WizardRefinementState,
  isSourceNdo: boolean
): string | null {
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
