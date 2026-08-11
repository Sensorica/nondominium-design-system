<script lang="ts">
  import {
    ArchetypeStep,
    NarrativeKernelStep,
    NdoPreviewPanel,
    RefinementStep,
    ReviewStep,
    WizardStepper,
    createInitialKernel,
    createInitialRefinement,
    getWizardSteps,
    type NdoArchetypeId
  } from '@nondominium/ndo-ui';

  let archetype = $state<NdoArchetypeId>('open_design');
  let kernel = $state(createInitialKernel('open_design'));
  let refinement = $state(createInitialRefinement('open_design', kernel.resource_nature));
  let stepIndex = $state(1);

  const steps = $derived(getWizardSteps(kernel.archetype));

  function selectArchetype(id: NdoArchetypeId) {
    archetype = id;
    kernel = createInitialKernel(id);
    refinement = createInitialRefinement(id, kernel.resource_nature);
    stepIndex = 0;
  }
</script>

<svelte:head><title>Wizard — Playbook</title></svelte:head>

<h1 class="mb-1 text-xl font-bold text-gray-900">NDO Creation Wizard</h1>
<p class="mb-6 text-sm text-gray-600">
  Stepped creation flow: archetype launcher → narrative kernel → contextual refinement → review.
</p>

<section class="specimen-section">
  <h2 class="specimen-heading">Step navigation (specimen)</h2>
  <WizardStepper {steps} currentIndex={stepIndex} />
  <div class="mt-2 flex gap-2">
    <button
      type="button"
      class="rounded border px-2 py-1 text-xs"
      disabled={stepIndex <= 0}
      onclick={() => (stepIndex -= 1)}
    >
      Prev
    </button>
    <button
      type="button"
      class="rounded border px-2 py-1 text-xs"
      disabled={stepIndex >= steps.length - 1}
      onclick={() => (stepIndex += 1)}
    >
      Next
    </button>
  </div>
</section>

<section class="specimen-section">
  <h2 class="specimen-heading">Archetype launcher</h2>
  <ArchetypeStep selected={archetype} onselect={selectArchetype} />
</section>

<section class="specimen-section">
  <h2 class="specimen-heading">Live preview panel</h2>
  <div class="max-w-sm">
    <NdoPreviewPanel {kernel} {refinement} />
  </div>
</section>

<section class="specimen-section">
  <h2 class="specimen-heading">Narrative kernel step</h2>
  <NarrativeKernelStep {kernel} onchange={(p) => (kernel = { ...kernel, ...p })} />
</section>

<section class="specimen-section">
  <h2 class="specimen-heading">Refinement step</h2>
  <RefinementStep {kernel} {refinement} onchange={(r) => (refinement = r)} />
</section>

<section class="specimen-section">
  <h2 class="specimen-heading">Review step</h2>
  <ReviewStep {kernel} {refinement} />
</section>

<style>
  .specimen-section {
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid rgb(var(--ndo-gray-200));
  }
  .specimen-heading {
    font-size: 0.8125rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: rgb(var(--ndo-gray-500));
    margin: 0 0 0.75rem;
  }
</style>
