<script lang="ts">
  import {
    ACCESS_CONTROL_QUESTION,
    RIVALRY_QUESTION,
    SCOPE_OPTIONS
  } from '../../../domain/wizard-questions.js';
  import { getArchetype } from '../../../domain/wizard-archetypes.js';
  import {
    SOURCE_REGIME_STATE_OPTIONS,
    SOURCE_TYPE_OPTIONS
  } from '../../../domain/spec-profiles.js';
  import { MVP_REGIMES } from '../../../domain/enums.js';
  import type {
    PropertyRegime,
    ResourceScope,
    Rivalry,
    SourceRegimeState,
    SourceType,
    WizardKernelState,
    WizardRefinementState
  } from '../../../domain/types.js';
  import { applyAccessAnswer } from '../../../domain/wizard-state.js';

  interface Props {
    kernel: WizardKernelState;
    refinement: WizardRefinementState;
    onchange: (refinement: WizardRefinementState) => void;
  }

  let { kernel, refinement, onchange }: Props = $props();

  const archetype = $derived(getArchetype(kernel.archetype));
  const allowedRegimes = $derived(archetype.allowedRegimes ?? MVP_REGIMES);

  let rivalryAnswer = $state<Rivalry>(refinement.rivalry ?? 'Rivalrous');

  $effect(() => {
    rivalryAnswer = refinement.rivalry ?? 'Rivalrous';
  });

  function handleRivalry(rivalry: Rivalry) {
    rivalryAnswer = rivalry;
    onchange({ ...refinement, rivalry });
  }

  function handleAccess(accessId: (typeof ACCESS_CONTROL_QUESTION.options)[number]['id']) {
    onchange(applyAccessAnswer(refinement, accessId, rivalryAnswer));
  }

  function handleNotSure() {
    onchange({
      ...refinement,
      regime_not_sure: true,
      property_regime: archetype.defaultRegime ?? 'Commons'
    });
  }

  function updateSourceField<K extends keyof NonNullable<WizardRefinementState['source_profile']>>(
    key: K,
    value: NonNullable<WizardRefinementState['source_profile']>[K]
  ) {
    if (!refinement.source_profile) return;
    onchange({
      ...refinement,
      source_profile: { ...refinement.source_profile, [key]: value }
    });
  }

  function addSteward(name: string) {
    if (!refinement.source_profile || !name.trim()) return;
    const stewards = [...refinement.source_profile.stewarded_by, name.trim()];
    updateSourceField('stewarded_by', stewards);
  }

  function removeSteward(index: number) {
    if (!refinement.source_profile) return;
    const stewards = refinement.source_profile.stewarded_by.filter((_, i) => i !== index);
    updateSourceField('stewarded_by', stewards);
  }

  let stewardInput = $state('');
</script>

<div class="space-y-5">
  <p class="rounded border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-800">
    There is no wrong answer here. These choices shape governance — you can refine Layer 1
    specification after creation.
  </p>

  {#if !archetype.isSourceNdo}
    <div>
      <p class="text-sm font-medium text-gray-900">{RIVALRY_QUESTION.question}</p>
      <div class="mt-2 space-y-2">
        {#each RIVALRY_QUESTION.options as opt}
          <button
            type="button"
            class="w-full rounded-lg border px-3 py-2 text-left text-sm {rivalryAnswer === opt.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:bg-gray-50'}"
            onclick={() => handleRivalry(opt.id)}
          >
            <span class="font-medium">{opt.label}</span>
            {#if opt.description}
              <p class="text-xs text-gray-500">{opt.description}</p>
            {/if}
          </button>
        {/each}
      </div>
    </div>

    <div>
      <p class="text-sm font-medium text-gray-900">{ACCESS_CONTROL_QUESTION.question}</p>
      <div class="mt-2 space-y-2">
        {#each ACCESS_CONTROL_QUESTION.options.filter( (o) => allowedRegimes.includes(o.suggestedRegime) ) as opt}
          <button
            type="button"
            class="w-full rounded-lg border px-3 py-2 text-left text-sm {refinement.property_regime ===
              opt.suggestedRegime && !refinement.regime_not_sure
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:bg-gray-50'}"
            onclick={() => handleAccess(opt.id)}
          >
            <span class="font-medium">{opt.label}</span>
            <p class="text-xs text-gray-500">{opt.description}</p>
            <p class="mt-1 text-xs font-medium text-gray-700">→ {opt.suggestedRegime}</p>
          </button>
        {/each}
      </div>
      <button
        type="button"
        class="mt-2 text-xs text-gray-500 underline hover:text-gray-700"
        onclick={handleNotSure}
      >
        I'm not sure yet — use a provisional default ({archetype.defaultRegime ?? 'Commons'})
      </button>
    </div>
  {:else}
    <div>
      <p class="text-sm font-medium text-gray-900">Property arrangement for this source</p>
      <div class="mt-2 flex gap-2">
        {#each allowedRegimes as regime}
          <button
            type="button"
            class="rounded-lg border px-3 py-2 text-sm {refinement.property_regime === regime
              ? 'border-teal-500 bg-teal-50'
              : 'border-gray-200'}"
            onclick={() =>
              onchange({
                ...refinement,
                property_regime: regime as PropertyRegime,
                transferability: 'Shareable',
                source_profile: refinement.source_profile ?? {
                  source_type: 'Hydrological',
                  regime_state: 'Stable',
                  stewarded_by: [],
                  complex_interior: true
                }
              })}
          >
            {regime}
          </button>
        {/each}
      </div>
      <p class="mt-1 text-xs text-gray-500">
        Sources use stewardship, not ownership. No primary accountable agent.
      </p>
    </div>

    {#if refinement.source_profile}
      <div class="space-y-4 rounded-lg border border-teal-200 bg-teal-50/40 p-4">
        <p class="text-sm font-medium text-teal-900">Source profile</p>

        <div>
          <p class="text-xs font-medium text-gray-700">Source type</p>
          <div class="mt-1 flex flex-wrap gap-2">
            {#each SOURCE_TYPE_OPTIONS as opt}
              <button
                type="button"
                class="rounded border px-2 py-1 text-xs {refinement.source_profile.source_type ===
                opt.id
                  ? 'border-teal-600 bg-teal-100'
                  : 'border-gray-200 bg-white'}"
                onclick={() => updateSourceField('source_type', opt.id as SourceType)}
              >
                {opt.label}
              </button>
            {/each}
          </div>
        </div>

        <div>
          <p class="text-xs font-medium text-gray-700">Current regime state</p>
          <select
            class="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
            value={refinement.source_profile.regime_state}
            onchange={(e) =>
              updateSourceField('regime_state', e.currentTarget.value as SourceRegimeState)}
          >
            {#each SOURCE_REGIME_STATE_OPTIONS as opt}
              <option value={opt.id}>{opt.label} — {opt.description}</option>
            {/each}
          </select>
        </div>

        <div>
          <p class="text-xs font-medium text-gray-700">
            Stewards <span class="text-red-500">*</span>
          </p>
          <div class="mt-1 flex gap-2">
            <input
              type="text"
              bind:value={stewardInput}
              placeholder="Agent or collective name"
              class="flex-1 rounded border border-gray-300 px-2 py-1.5 text-sm"
              onkeydown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSteward(stewardInput);
                  stewardInput = '';
                }
              }}
            />
            <button
              type="button"
              class="rounded border border-teal-600 px-2 py-1 text-xs text-teal-800"
              onclick={() => {
                addSteward(stewardInput);
                stewardInput = '';
              }}
            >
              Add
            </button>
          </div>
          {#if refinement.source_profile.stewarded_by.length}
            <ul class="mt-2 flex flex-wrap gap-1">
              {#each refinement.source_profile.stewarded_by as steward, i}
                <li class="flex items-center gap-1 rounded bg-teal-100 px-2 py-0.5 text-xs">
                  {steward}
                  <button type="button" class="text-teal-700" onclick={() => removeSteward(i)}
                    >×</button
                  >
                </li>
              {/each}
            </ul>
          {/if}
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="text-xs text-gray-600" for="current-stock">Current stock</label>
            <input
              id="current-stock"
              type="number"
              class="mt-0.5 w-full rounded border border-gray-300 px-2 py-1 text-sm"
              value={refinement.source_profile.current_stock ?? ''}
              oninput={(e) =>
                updateSourceField(
                  'current_stock',
                  e.currentTarget.value ? Number(e.currentTarget.value) : null
                )}
            />
          </div>
          <div>
            <label class="text-xs text-gray-600" for="flux-rate">Flux rate</label>
            <input
              id="flux-rate"
              type="number"
              class="mt-0.5 w-full rounded border border-gray-300 px-2 py-1 text-sm"
              value={refinement.source_profile.flux_rate ?? ''}
              oninput={(e) =>
                updateSourceField(
                  'flux_rate',
                  e.currentTarget.value ? Number(e.currentTarget.value) : null
                )}
            />
          </div>
        </div>
      </div>
    {/if}
  {/if}

  <div>
    <p class="text-sm font-medium text-gray-900">Visibility scope</p>
    <div class="mt-2 flex flex-wrap gap-2">
      {#each SCOPE_OPTIONS as opt}
        <button
          type="button"
          class="rounded-full border px-3 py-1 text-xs {refinement.scope === opt.id
            ? 'border-blue-500 bg-blue-100'
            : 'border-gray-200'}"
          onclick={() => onchange({ ...refinement, scope: opt.id as ResourceScope })}
        >
          {opt.label}
        </button>
      {/each}
    </div>
  </div>
</div>
