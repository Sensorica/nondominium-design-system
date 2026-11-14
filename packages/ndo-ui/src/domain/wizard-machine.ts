/**
 * Wizard statechart-lite: all kernel/refinement mutations go through events.
 * Dependent fields are realigned in one reducer so step N cannot leave stale
 * inventoriable / regime state after step N−1 changes.
 */
import { getArchetype } from './wizard-archetypes.js';
import type {
  NdoArchetypeId,
  SourceType,
  WizardKernelState,
  WizardRefinementState
} from './types.js';
import {
  alignKernelToNature,
  alignRefinementToNature,
  applySourceType,
  createInitialKernel,
  createInitialRefinement,
  getWizardSteps,
  syncRefinementSubtraction,
  validateKernel,
  validateRefinement,
  type WizardStepId
} from './wizard-state.js';

export type WizardModel = {
  stepIndex: number;
  kernel: WizardKernelState;
  refinement: WizardRefinementState;
  localError: string;
};

export type WizardEvent =
  | { type: 'SELECT_ARCHETYPE'; id: NdoArchetypeId }
  | { type: 'SELECT_SOURCE_TYPE'; sourceType: SourceType }
  | { type: 'PATCH_KERNEL'; patch: Partial<WizardKernelState> }
  | { type: 'PATCH_REFINEMENT'; patch: Partial<WizardRefinementState> }
  /** Replace the whole refinement object (RefinementStep owns nested edits). */
  | { type: 'SET_REFINEMENT'; refinement: WizardRefinementState }
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'CLEAR_ERROR' };

export function createWizardModel(initialArchetype: NdoArchetypeId = 'stub'): WizardModel {
  const kernel = createInitialKernel(initialArchetype);
  return {
    stepIndex: 0,
    kernel,
    refinement: createInitialRefinement(initialArchetype, kernel.resource_nature),
    localError: ''
  };
}

export function wizardCurrentStep(model: WizardModel): WizardStepId {
  const steps = getWizardSteps(model.kernel.archetype);
  return steps[model.stepIndex]?.id ?? 'archetype';
}

function withClearedError(model: WizardModel): WizardModel {
  return model.localError ? { ...model, localError: '' } : model;
}

/**
 * Pure reducer. UI holds `WizardModel` in `$state` and replaces it with the
 * return value of each event.
 */
export function reduceWizard(model: WizardModel, event: WizardEvent): WizardModel {
  const archetype = getArchetype(model.kernel.archetype);

  switch (event.type) {
    case 'CLEAR_ERROR':
      return withClearedError(model);

    case 'SELECT_ARCHETYPE': {
      const kernel = createInitialKernel(event.id);
      return {
        stepIndex: model.stepIndex,
        kernel,
        refinement: createInitialRefinement(event.id, kernel.resource_nature),
        localError: ''
      };
    }

    case 'SELECT_SOURCE_TYPE': {
      const next = applySourceType(
        model.kernel,
        model.refinement,
        event.sourceType,
        getArchetype(model.kernel.archetype).allowedRegimes
      );
      return {
        ...model,
        kernel: next.kernel,
        refinement: next.refinement,
        localError: ''
      };
    }

    case 'PATCH_KERNEL': {
      let nextKernel = { ...model.kernel, ...event.patch };
      let nextRefinement = model.refinement;
      const arch = getArchetype(nextKernel.archetype);
      if (event.patch.resource_nature) {
        nextKernel = alignKernelToNature(
          nextKernel,
          event.patch.resource_nature,
          arch.isSourceNdo
        );
        nextRefinement = alignRefinementToNature(
          nextRefinement,
          event.patch.resource_nature,
          arch.allowedRegimes
        );
      }
      nextRefinement = syncRefinementSubtraction(
        nextRefinement,
        nextKernel,
        arch.isSourceNdo
      );
      return {
        ...model,
        kernel: nextKernel,
        refinement: nextRefinement,
        localError: ''
      };
    }

    case 'PATCH_REFINEMENT':
      return {
        ...model,
        refinement: { ...model.refinement, ...event.patch },
        localError: ''
      };

    case 'SET_REFINEMENT':
      return {
        ...model,
        refinement: event.refinement,
        localError: ''
      };

    case 'BACK': {
      if (model.stepIndex <= 0) return withClearedError(model);
      return { ...model, stepIndex: model.stepIndex - 1, localError: '' };
    }

    case 'NEXT': {
      const steps = getWizardSteps(model.kernel.archetype);
      const current = steps[model.stepIndex]?.id ?? 'archetype';
      if (current === 'kernel') {
        const err = validateKernel(model.kernel);
        if (err) return { ...model, localError: err };
      }
      if (current === 'refinement') {
        const err = validateRefinement(
          model.refinement,
          archetype.isSourceNdo,
          model.kernel.resource_nature,
          archetype.allowedRegimes,
          model.kernel
        );
        if (err) return { ...model, localError: err };
      }
      if (model.stepIndex >= steps.length - 1) {
        return withClearedError(model);
      }
      let refinement = model.refinement;
      if (current === 'kernel') {
        refinement = syncRefinementSubtraction(
          refinement,
          model.kernel,
          archetype.isSourceNdo
        );
      }
      return {
        ...model,
        refinement,
        stepIndex: model.stepIndex + 1,
        localError: ''
      };
    }

    default: {
      const _exhaustive: never = event;
      return _exhaustive;
    }
  }
}

/** Validate the full wizard before submit (same rules as NEXT on each step). */
export function validateWizardForSubmit(model: WizardModel): string | null {
  const archetype = getArchetype(model.kernel.archetype);
  const kernelErr = validateKernel(model.kernel);
  if (kernelErr) return kernelErr;
  if (archetype.showRefinement) {
    return validateRefinement(
      model.refinement,
      archetype.isSourceNdo,
      model.kernel.resource_nature,
      archetype.allowedRegimes,
      model.kernel
    );
  }
  return null;
}
