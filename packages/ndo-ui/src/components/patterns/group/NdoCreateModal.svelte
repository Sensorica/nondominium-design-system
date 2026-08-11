<script lang="ts">
  import type {
    NdoDescriptor,
    NdoInput,
    NdoArchetypeId,
    WizardResult
  } from '../../../domain/types.js';
  import { getArchetype } from '../../../domain/wizard-archetypes.js';
  import {
    buildWizardResult,
    createInitialKernel,
    createInitialRefinement,
    getWizardSteps,
    validateKernel,
    validateRefinement,
    type WizardStepId
  } from '../../../domain/wizard-state.js';
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
    groupId,
    groupName = 'Group',
    existingNdos = [],
    isSubmitting = false,
    errorMessage = null,
    initialArchetype = 'stub',
    onclose,
    onsubmit,
    onwizardcomplete
  }: Props = $props();

  let stepIndex = $state(0);
  let kernel = $state(createInitialKernel(initialArchetype));
  let refinement = $state(createInitialRefinement(initialArchetype, kernel.resource_nature));
  let localError = $state('');

  const steps = $derived(getWizardSteps(kernel.archetype));
  const currentStep = $derived(steps[stepIndex]?.id ?? 'archetype');
  const archetype = $derived(getArchetype(kernel.archetype));

  const nameWarning = $derived(
    kernel.name.trim() &&
      existingNdos.some((d) => d.name.toLowerCase() === kernel.name.trim().toLowerCase())
      ? 'An NDO with this name already exists in the Lobby.'
      : ''
  );

  const displayError = $derived(errorMessage ?? localError);

  function selectArchetype(id: NdoArchetypeId) {
    kernel = createInitialKernel(id);
    refinement = createInitialRefinement(id, kernel.resource_nature);
  }

  function patchKernel(patch: Partial<typeof kernel>) {
    const next = { ...kernel, ...patch };
    kernel = next;
    if (patch.resource_nature && archetype.isSourceNdo) {
      refinement = createInitialRefinement(next.archetype, patch.resource_nature);
    }
  }

  function goNext() {
    localError = '';
    if (currentStep === 'kernel') {
      const err = validateKernel(kernel);
      if (err) {
        localError = err;
        return;
      }
    }
    if (currentStep === 'refinement') {
      const err = validateRefinement(refinement, archetype.isSourceNdo);
      if (err) {
        localError = err;
        return;
      }
    }
    if (stepIndex < steps.length - 1) stepIndex += 1;
  }

  function goBack() {
    localError = '';
    if (stepIndex > 0) stepIndex -= 1;
  }

  async function handleSubmit() {
    const kernelErr = validateKernel(kernel);
    if (kernelErr) {
      localError = kernelErr;
      return;
    }
    if (archetype.showRefinement) {
      const refineErr = validateRefinement(refinement, archetype.isSourceNdo);
      if (refineErr) {
        localError = refineErr;
        return;
      }
    }
    localError = '';
    const result = buildWizardResult(kernel, refinement);
    await onwizardcomplete?.(result);
    await onsubmit?.(result.ndo_input);
  }

  const stepTitles: Record<WizardStepId, string> = {
    archetype: 'What are you creating?',
    kernel: 'Describe your resource',
    refinement: 'Governance arrangement',
    review: 'Review and create'
  };

  const stepTitle = $derived(stepTitles[currentStep as WizardStepId] ?? 'Create NDO');
</script>

<Modal title={stepTitle} subtitle="Register Layer 0 identity within {groupName}." maxWidth="2xl">
  {#snippet children()}
    <WizardStepper {steps} currentIndex={stepIndex} />

    <div class="grid gap-6 lg:grid-cols-5">
      <div class="lg:col-span-3">
        {#if currentStep === 'archetype'}
          <ArchetypeStep selected={kernel.archetype} onselect={selectArchetype} />
        {:else if currentStep === 'kernel'}
          <NarrativeKernelStep {kernel} {nameWarning} onchange={patchKernel} />
        {:else if currentStep === 'refinement'}
          <RefinementStep {kernel} {refinement} onchange={(r) => (refinement = r)} />
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
      <NdoButton variant="ghost" onclick={goBack}>Back</NdoButton>
    {/if}
    {#if currentStep === 'review'}
      <NdoButton disabled={isSubmitting} onclick={() => void handleSubmit()}>
        {isSubmitting ? 'Creating…' : 'Create NDO'}
      </NdoButton>
    {:else}
      <NdoButton onclick={goNext}>Continue</NdoButton>
    {/if}
  {/snippet}
</Modal>
