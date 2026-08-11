<script lang="ts">
  import { CREATABLE_NDO_LIFECYCLE_STAGES } from '../../../domain/enums.js';
  import { NATURE_CHOICES } from '../../../domain/wizard-questions.js';
  import { getArchetype } from '../../../domain/wizard-archetypes.js';
  import type { CreatableNdoLifecycleStage } from '../../../domain/enums.js';
  import type { ResourceNature, WizardKernelState } from '../../../domain/types.js';

  interface Props {
    kernel: WizardKernelState;
    nameWarning?: string;
    onchange: (patch: Partial<WizardKernelState>) => void;
  }

  let { kernel, nameWarning = '', onchange }: Props = $props();

  const archetype = $derived(getArchetype(kernel.archetype));
  const maturityOptions = $derived(
    archetype.tier === 'Simple'
      ? (['Ideation', 'Specification', 'Active'] as CreatableNdoLifecycleStage[])
      : [...CREATABLE_NDO_LIFECYCLE_STAGES]
  );
</script>

<div class="space-y-5">
  <div>
    <p class="text-sm font-medium text-gray-900">What kind of thing is this?</p>
    <div class="mt-2 grid gap-2 sm:grid-cols-2">
      {#each NATURE_CHOICES as choice}
        <button
          type="button"
          class="rounded-lg border px-3 py-2 text-left text-sm {kernel.resource_nature === choice.id
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 hover:bg-gray-50'}"
          onclick={() => onchange({ resource_nature: choice.id as ResourceNature })}
        >
          <span class="font-medium text-gray-900">{choice.label}</span>
          <p class="mt-0.5 text-xs text-gray-500">{choice.description}</p>
        </button>
      {/each}
    </div>
  </div>

  <div>
    <label class="mb-1 block text-sm font-medium text-gray-700" for="wizard-name">
      What do you want to call it? <span class="text-red-500">*</span>
    </label>
    <input
      id="wizard-name"
      type="text"
      value={kernel.name}
      oninput={(e) => onchange({ name: e.currentTarget.value })}
      placeholder="A name others will recognize"
      class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
    />
    {#if nameWarning}
      <p class="mt-1 text-xs text-amber-600">{nameWarning}</p>
    {/if}
  </div>

  <div>
    <p class="text-sm font-medium text-gray-900">How mature is it right now?</p>
    <div class="mt-2 flex flex-wrap gap-2">
      {#each maturityOptions as stage}
        <button
          type="button"
          class="rounded-full border px-3 py-1 text-xs font-medium {kernel.lifecycle_stage === stage
            ? 'border-blue-500 bg-blue-100 text-blue-800'
            : 'border-gray-200 text-gray-600 hover:bg-gray-50'}"
          onclick={() => onchange({ lifecycle_stage: stage })}
        >
          {stage}
        </button>
      {/each}
    </div>
    <p class="mt-1 text-xs text-gray-500">
      Hibernating and terminal stages are set after creation through lifecycle transitions.
    </p>
  </div>

  <div>
    <label class="mb-1 block text-sm text-gray-600" for="wizard-desc">
      Short description <span class="text-gray-400">(optional)</span>
    </label>
    <textarea
      id="wizard-desc"
      rows="2"
      value={kernel.description}
      oninput={(e) => onchange({ description: e.currentTarget.value })}
      placeholder="What is this NDO about?"
      class="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
    ></textarea>
  </div>
</div>
