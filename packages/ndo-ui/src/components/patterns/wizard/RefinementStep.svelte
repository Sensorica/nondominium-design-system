<script lang="ts">
  import {
    ACCESS_CONTROL_QUESTION,
    RIVALRY_STATEMENT,
    SCOPE_OPTIONS,
    SOURCE_ARRANGEMENTS,
    SOURCE_RIVALRY_STATEMENT,
    SUBTRACTION_OPTIONS,
    accessOptionsForNature,
    regimesForNature,
    rivalryForNature,
    scopePermitted,
    withCoherentScope
  } from '../../../domain/wizard-questions.js';
  import { getArchetype } from '../../../domain/wizard-archetypes.js';
  import { SOURCE_REGIME_STATE_OPTIONS } from '../../../domain/spec-profiles.js';
  import type {
    ResourceScope,
    SourceRegimeState,
    SubtractionKind,
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
  const natureRivalry = $derived(rivalryForNature(kernel.resource_nature));
  const rivalryStatement = $derived(
    (archetype.isSourceNdo ? SOURCE_RIVALRY_STATEMENT : RIVALRY_STATEMENT)[natureRivalry]
  );
  const sourceArrangements = $derived(
    SOURCE_ARRANGEMENTS.filter((option) => natureRegimes.includes(option.regime))
  );
  const natureRegimes = $derived(regimesForNature(kernel.resource_nature, archetype.allowedRegimes));
  const accessOptions = $derived(accessOptionsForNature(kernel.resource_nature, archetype.allowedRegimes));
  const scopeOptions = $derived(
    SCOPE_OPTIONS.filter((opt) => scopePermitted(refinement.property_regime, opt.id))
  );

  function handleAccess(accessId: (typeof ACCESS_CONTROL_QUESTION.options)[number]['id']) {
    onchange(applyAccessAnswer(refinement, accessId, natureRivalry));
  }

  function handleNotSure() {
    const preferred = archetype.defaultRegime ?? 'Commons';
    const fallback = natureRegimes.includes(preferred) ? preferred : natureRegimes[0];
    if (!fallback) return;
    onchange(
      withCoherentScope({
        ...refinement,
        regime_not_sure: true,
        property_regime: fallback
      })
    );
  }

  function handleSubtraction(kind: SubtractionKind) {
    onchange({ ...refinement, subtraction: kind });
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
    These choices shape governance. Layer 1 specification can be refined after creation.
  </p>

  <div>
    <p class="text-sm font-medium text-gray-900">
      {archetype.isSourceNdo
        ? 'When someone draws from this, is there less left for others?'
        : 'When someone uses this, can others use it at the same time?'}
    </p>
    <p class="mt-2">
      <span
        class="inline-flex rounded-full border border-blue-500 bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800"
      >
        {rivalryStatement.label}
      </span>
    </p>
    <p class="mt-1 text-xs text-gray-500">{rivalryStatement.detail}</p>
  </div>

  {#if !archetype.isSourceNdo}
    {#if natureRivalry === 'Rivalrous'}
      <div>
        <p class="text-sm font-medium text-gray-900">How does use run out?</p>
        <div class="mt-2 space-y-2">
          {#each SUBTRACTION_OPTIONS as opt}
            <button
              type="button"
              class="w-full rounded-lg border px-3 py-2 text-left text-sm {refinement.subtraction ===
              opt.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:bg-gray-50'}"
              onclick={() => handleSubtraction(opt.id)}
            >
              <span class="font-medium">{opt.label}</span>
              <p class="text-xs text-gray-500">{opt.description}</p>
            </button>
          {/each}
        </div>
      </div>
    {/if}

    <div>
      <p class="text-sm font-medium text-gray-900">{ACCESS_CONTROL_QUESTION.question}</p>
      <div class="mt-2 space-y-2">
        {#each accessOptions as opt}
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
      <p class="text-sm font-medium text-gray-900">How is this source held?</p>
      <div class="mt-2 space-y-2">
        {#each sourceArrangements as option}
          <button
            type="button"
            class="w-full rounded-lg border px-3 py-2 text-left text-sm {refinement.property_regime ===
            option.regime
              ? 'border-teal-500 bg-teal-50'
              : 'border-gray-200 hover:bg-gray-50'}"
            onclick={() =>
              onchange(
                withCoherentScope({
                  ...refinement,
                  property_regime: option.regime,
                  transferability: 'Shareable',
                  source_profile: refinement.source_profile ?? {
                    source_type: 'Hydrological',
                    regime_state: 'Stable',
                    stewarded_by: [],
                    complex_interior: true
                  }
                })
              )}
          >
            <span class="font-medium">{option.label}</span>
            <p class="text-xs text-gray-500">{option.description}</p>
          </button>
        {/each}
      </div>
    </div>

    {#if refinement.source_profile}
      <div class="space-y-4 rounded-lg border border-teal-200 bg-teal-50/40 p-4">
        <p class="text-sm font-medium text-teal-900">Who carries it, and what is known so far</p>
        <p class="text-xs text-gray-600">
          Stewards monitor and care for the source. They do not own it. Stock and flux can wait.
        </p>

        <div>
          <p class="text-xs font-medium text-gray-700">Initial condition <span class="font-normal text-gray-400">(optional)</span></p>
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
            <span class="font-normal text-gray-400">— obligations, not title</span>
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
      {#each scopeOptions as opt}
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
    {#if scopeOptions.length < SCOPE_OPTIONS.length}
      <p class="mt-1 text-xs text-gray-500">
        An uncapturable {archetype.isSourceNdo ? 'source' : 'resource'} stays publicly visible. A narrower scope would hide it.
      </p>
    {/if}
  </div>
</div>
