<script lang="ts">
  import { NATURE_CHOICES, SOURCE_STAGE_GLOSS } from '../../../domain/wizard-questions.js';
  import { SOURCE_TYPE_OPTIONS } from '../../../domain/spec-profiles.js';
  import { getArchetype } from '../../../domain/wizard-archetypes.js';
  import type { ResourceNature, SourceType, WizardKernelState } from '../../../domain/types.js';

  interface Props {
    kernel: WizardKernelState;
    nameWarning?: string;
    sourceType?: SourceType | null;
    onchange: (patch: Partial<WizardKernelState>) => void;
    onsourcetype?: (sourceType: SourceType) => void;
  }

  let { kernel, nameWarning = '', sourceType = null, onchange, onsourcetype }: Props = $props();

  const archetype = $derived(getArchetype(kernel.archetype));
  const maturityOptions = $derived(archetype.allowedLifecycleStages);
  const stageGloss = $derived(
    archetype.isSourceNdo ? SOURCE_STAGE_GLOSS[kernel.lifecycle_stage] : undefined
  );
</script>

<div class="space-y-5">
  {#if archetype.isSourceNdo}
    <div>
      <p class="text-sm font-medium text-gray-900">What kind of source is this?</p>
      <div class="mt-2 grid gap-2 sm:grid-cols-2">
        {#each SOURCE_TYPE_OPTIONS as choice}
          <button
            type="button"
            class="rounded-lg border px-3 py-2 text-left text-sm {sourceType === choice.id
              ? 'border-teal-500 bg-teal-50'
              : 'border-gray-200 hover:bg-gray-50'}"
            onclick={() => onsourcetype?.(choice.id)}
          >
            <span class="font-medium text-gray-900">{choice.label}</span>
            <p class="mt-0.5 text-xs text-gray-500">{choice.description}</p>
          </button>
        {/each}
      </div>
      <p class="mt-1 text-xs text-gray-500">
        A watershed, forest, or fishery is physical. A knowledge or social commons is digital.
      </p>
    </div>
  {:else}
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
  {/if}

  <div>
    <label class="mb-1 block text-sm font-medium text-gray-700" for="wizard-name">
      {archetype.isSourceNdo ? 'What do you want to call this source?' : 'What do you want to call it?'}
      <span class="text-red-500">*</span>
    </label>
    <input
      id="wizard-name"
      type="text"
      value={kernel.name}
      oninput={(e) => onchange({ name: e.currentTarget.value })}
      placeholder={archetype.isSourceNdo ? 'A watershed, fishery, or commons others will recognize' : 'A name others will recognize'}
      class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
    />
    {#if nameWarning}
      <p class="mt-1 text-xs text-amber-600">{nameWarning}</p>
    {/if}
  </div>

  <div>
    <p class="text-sm font-medium text-gray-900">
      {archetype.isSourceNdo ? 'How far along is stewardship?' : 'How mature is it right now?'}
    </p>
    {#if maturityOptions.length === 1}
      <p class="mt-2">
        <span
          class="inline-flex rounded-full border border-blue-500 bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800"
        >
          {maturityOptions[0]}
        </span>
      </p>
      <p class="mt-1 text-xs text-gray-500">
        Registered at {maturityOptions[0]}. Maturity changes later, through a lifecycle transition.
      </p>
    {:else}
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
        {#if stageGloss}
          {stageGloss}
        {:else}
          Hibernating and terminal stages are set after creation through lifecycle transitions.
        {/if}
      </p>
    {/if}
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
      placeholder={archetype.isSourceNdo ? 'What does this source yield, and who depends on it?' : 'What is this NDO about?'}
      class="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
    ></textarea>
  </div>
</div>
