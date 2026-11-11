<script lang="ts">
  import {
    CONSUME_IDENTIFICATION_OPTIONS,
    ECONOMIC_MODE_OPTIONS,
    NATURE_CHOICES,
    SOURCE_STAGE_GLOSS,
    USE_KIND_OPTIONS
  } from '../../../domain/wizard-questions.js';
  import { SOURCE_TYPE_OPTIONS } from '../../../domain/spec-profiles.js';
  import { getArchetype } from '../../../domain/wizard-archetypes.js';
  import { needsEconomicMode } from '../../../domain/wizard-state.js';
  import type {
    ConsumeIdentification,
    EconomicMode,
    ResourceNature,
    SourceType,
    UseKind,
    WizardKernelState
  } from '../../../domain/types.js';

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
  const showEconomicFork = $derived(
    needsEconomicMode(kernel.resource_nature, archetype.isSourceNdo)
  );

  function setEconomicMode(mode: EconomicMode) {
    if (mode === 'use') {
      onchange({
        economic_mode: 'use',
        use_kind: kernel.use_kind ?? 'unit',
        default_unit: null,
        initial_quantity: null,
        identification_pattern: null
      });
    } else {
      onchange({
        economic_mode: 'consume',
        use_kind: null,
        unique_id: null,
        max_concurrent_users: null,
        identification_pattern: kernel.identification_pattern ?? 'LotControlled'
      });
    }
  }

  function setUseKind(kind: UseKind) {
    onchange({
      use_kind: kind,
      max_concurrent_users: kind === 'capacity' ? (kernel.max_concurrent_users ?? 8) : null,
      unique_id: kind === 'unit' ? kernel.unique_id : null
    });
  }
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

  {#if showEconomicFork}
    <div>
      <p class="text-sm font-medium text-gray-900">
        How will people mainly interact with this? <span class="text-red-500">*</span>
      </p>
      <p class="mt-1 text-xs text-gray-500">
        Categories of similar tools can emerge later. Here you register this thing or this batch.
      </p>
      <div class="mt-2 space-y-2">
        {#each ECONOMIC_MODE_OPTIONS as opt}
          <button
            type="button"
            class="w-full rounded-lg border px-3 py-2 text-left text-sm {kernel.economic_mode ===
            opt.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:bg-gray-50'}"
            onclick={() => setEconomicMode(opt.id)}
          >
            <span class="font-medium text-gray-900">{opt.label}</span>
            <p class="mt-0.5 text-xs text-gray-500">{opt.description}</p>
          </button>
        {/each}
      </div>
    </div>

    {#if kernel.economic_mode === 'use'}
      <div>
        <p class="text-sm font-medium text-gray-900">
          Is it one held thing, or a place with capacity? <span class="text-red-500">*</span>
        </p>
        <div class="mt-2 space-y-2">
          {#each USE_KIND_OPTIONS as opt}
            <button
              type="button"
              class="w-full rounded-lg border px-3 py-2 text-left text-sm {kernel.use_kind === opt.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:bg-gray-50'}"
              onclick={() => setUseKind(opt.id)}
            >
              <span class="font-medium text-gray-900">{opt.label}</span>
              <p class="mt-0.5 text-xs text-gray-500">{opt.description}</p>
            </button>
          {/each}
        </div>
      </div>

      {#if kernel.use_kind === 'unit'}
        <div>
          <label class="mb-1 block text-sm text-gray-600" for="wizard-unique-id">
            Unique ID <span class="text-gray-400">(optional serial / QR / barcode)</span>
          </label>
          <input
            id="wizard-unique-id"
            type="text"
            value={kernel.unique_id ?? ''}
            oninput={(e) => onchange({ unique_id: e.currentTarget.value || null })}
            placeholder="e.g. SN-1042 or QR payload"
            class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      {:else if kernel.use_kind === 'capacity'}
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700" for="wizard-capacity">
            Max concurrent occupants <span class="text-red-500">*</span>
          </label>
          <input
            id="wizard-capacity"
            type="number"
            min="2"
            step="1"
            value={kernel.max_concurrent_users ?? 8}
            oninput={(e) =>
              onchange({
                max_concurrent_users: e.currentTarget.value
                  ? Number(e.currentTarget.value)
                  : null
              })}
            class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <p class="mt-1 text-xs text-gray-500">At least 2. This becomes a capacity usage rule.</p>
        </div>
      {/if}
    {:else if kernel.economic_mode === 'consume'}
      <div class="space-y-4 rounded-lg border border-amber-100 bg-amber-50/40 p-3">
        <p class="text-xs text-amber-900">
          You are creating an NDO for <strong>this batch</strong>. When it is gone, close it with
          End of life (reason: Depleted). A new harvest is a new NDO.
        </p>
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700" for="wizard-unit">
            Unit <span class="text-red-500">*</span>
          </label>
          <input
            id="wizard-unit"
            type="text"
            value={kernel.default_unit ?? ''}
            oninput={(e) => onchange({ default_unit: e.currentTarget.value || null })}
            placeholder="kg, each, L, bushel…"
            class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700" for="wizard-qty">
            Initial quantity <span class="text-red-500">*</span>
          </label>
          <input
            id="wizard-qty"
            type="number"
            min="0"
            step="any"
            value={kernel.initial_quantity ?? ''}
            oninput={(e) =>
              onchange({
                initial_quantity: e.currentTarget.value ? Number(e.currentTarget.value) : null
              })}
            placeholder="e.g. 250"
            class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <p class="text-sm font-medium text-gray-900">
            How is this batch identified? <span class="text-red-500">*</span>
          </p>
          <div class="mt-2 space-y-2">
            {#each CONSUME_IDENTIFICATION_OPTIONS as opt}
              <button
                type="button"
                class="w-full rounded-lg border px-3 py-2 text-left text-sm {kernel.identification_pattern ===
                opt.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'}"
                onclick={() =>
                  onchange({ identification_pattern: opt.id as ConsumeIdentification })}
              >
                <span class="font-medium text-gray-900">{opt.label}</span>
                <p class="mt-0.5 text-xs text-gray-500">{opt.description}</p>
              </button>
            {/each}
          </div>
        </div>
      </div>
    {/if}
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
      placeholder={archetype.isSourceNdo
        ? 'A watershed, fishery, or commons others will recognize'
        : 'A name others will recognize'}
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
      placeholder={archetype.isSourceNdo
        ? 'What does this source yield, and who depends on it?'
        : 'What is this NDO about?'}
      class="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
    ></textarea>
  </div>
</div>
