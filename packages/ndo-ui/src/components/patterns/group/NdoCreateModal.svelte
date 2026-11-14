<script lang="ts">
  import type {
    NdoDescriptor,
    NdoInput,
    NdoArchetypeId,
    WizardResult
  } from '../../../domain/types.js';
  import { getArchetype } from '../../../domain/wizard-archetypes.js';
  import { buildWizardResult, getWizardSteps, type WizardStepId } from '../../../domain/wizard-state.js';
  import {
    createWizardModel,
    reduceWizard,
    validateWizardForSubmit,
    wizardCurrentStep
  } from '../../../domain/wizard-machine.js';
  import Modal from '../../primitives/Modal.svelte';
  import NdoButton from '../../primitives/NdoButton.svelte';
  import WizardStepper from '../wizard/WizardStepper.svelte';
  import ArchetypeStep from '../wizard/ArchetypeStep.svelte';
  import NarrativeKernelStep from '../wizard/NarrativeKernelStep.svelte';
  import RefinementStep from '../wizard/RefinementStep.svelte';
  import ReviewStep from '../wizard/ReviewStep.svelte';
  import NdoPreviewPanel from '../wizard/NdoPreviewPanel.svelte';

  interface Props {
    groupId: string;
    groupName?: string;
    existingNdos?: NdoDescriptor[];
    isSubmitting?: boolean;
    errorMessage?: string | null;
    /** Pre-select archetype for demos (e.g. source_ndo walkthrough) */
    initialArchetype?: NdoArchetypeId;
    onclose: () => void;
    onsubmit?: (input: NdoInput) => void | Promise<void>;
    onwizardcomplete?: (result: WizardResult) => void | Promise<void>;
  }

  let {
    groupId: _groupId,
    groupName = 'Group',
    existingNdos = [],
    isSubmitting = false,
    errorMessage = null,
    initialArchetype = 'stub',
    onclose,
    onsubmit,
    onwizardcomplete
  }: Props = $props();

  let model = $state(createWizardModel(initialArchetype));

  const steps = $derived(getWizardSteps(model.kernel.archetype));
  const currentStep = $derived(wizardCurrentStep(model));
  const archetype = $derived(getArchetype(model.kernel.archetype));
  const kernel = $derived(model.kernel);
  const refinement = $derived(model.refinement);
  const stepIndex = $derived(model.stepIndex);

  const nameWarning = $derived(
    kernel.name.trim() &&
      existingNdos.some((d) => d.name.toLowerCase() === kernel.name.trim().toLowerCase())
      ? 'An NDO with this name already exists in the Lobby.'
      : ''
  );

  const displayError = $derived(errorMessage ?? model.localError);

  async function handleSubmit() {
    const err = validateWizardForSubmit(model);
    if (err) {
      model = { ...model, localError: err };
      return;
    }
    model = reduceWizard(model, { type: 'CLEAR_ERROR' });
    const result = buildWizardResult(model.kernel, model.refinement);
    await onwizardcomplete?.(result);
    await onsubmit?.(result.ndo_input);
  }

  const stepTitles: Record<WizardStepId, string> = {
    archetype: 'What are you creating?',
    kernel: 'Describe your resource',
    refinement: 'Governance arrangement',
    review: 'Review and create'
  };

  const stepTitle = $derived(
    currentStep === 'kernel' && archetype.isSourceNdo
      ? 'Describe this source'
      : currentStep === 'refinement' && archetype.isSourceNdo
        ? 'Who stewards it'
        : (stepTitles[currentStep as WizardStepId] ?? 'Create NDO')
  );
</script>

<Modal title={stepTitle} subtitle="Register Layer 0 identity within {groupName}." maxWidth="2xl">
  {#snippet children()}
    <WizardStepper {steps} currentIndex={stepIndex} />

    <div class="grid gap-6 lg:grid-cols-5">
      <div class="lg:col-span-3">
        {#if currentStep === 'archetype'}
          <ArchetypeStep
            selected={kernel.archetype}
            onselect={(id) => {
              model = reduceWizard(model, { type: 'SELECT_ARCHETYPE', id });
            }}
          />
        {:else if currentStep === 'kernel'}
          <NarrativeKernelStep
            {kernel}
            {nameWarning}
            sourceType={refinement.source_profile?.source_type ?? null}
            onchange={(patch) => {
              model = reduceWizard(model, { type: 'PATCH_KERNEL', patch });
            }}
            onsourcetype={(sourceType) => {
              model = reduceWizard(model, { type: 'SELECT_SOURCE_TYPE', sourceType });
            }}
          />
        {:else if currentStep === 'refinement'}
          <RefinementStep
            {kernel}
            {refinement}
            onchange={(next) => {
              model = reduceWizard(model, { type: 'SET_REFINEMENT', refinement: next });
            }}
          />
        {:else if currentStep === 'review'}
          <ReviewStep {kernel} {refinement} />
        {/if}

        {#if displayError}
          <p class="mt-4 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
            {displayError}
          </p>
        {/if}
      </div>

      <div class="lg:col-span-2">
        <NdoPreviewPanel {kernel} {refinement} />
      </div>
    </div>
  {/snippet}

  {#snippet footer()}
    <NdoButton variant="ghost" onclick={onclose}>Cancel</NdoButton>
    {#if stepIndex > 0}
      <NdoButton
        variant="ghost"
        onclick={() => {
          model = reduceWizard(model, { type: 'BACK' });
        }}>Back</NdoButton
      >
    {/if}
    {#if currentStep === 'review'}
      <NdoButton disabled={isSubmitting} onclick={() => void handleSubmit()}>
        {isSubmitting ? 'Creating…' : 'Create NDO'}
      </NdoButton>
    {:else}
      <NdoButton
        onclick={() => {
          model = reduceWizard(model, { type: 'NEXT' });
        }}>Continue</NdoButton
      >
    {/if}
  {/snippet}
</Modal>
