<script lang="ts">
  import {
    SOURCE_REGIME_STATE_OPTIONS,
    SOURCE_TYPE_OPTIONS
  } from '../../../domain/spec-profiles.js';
  import EcologicalValueVector from './EcologicalValueVector.svelte';
  import type { SourceProfile, SourceRegimeState, SourceType } from '../../../domain/types.js';

  interface Props {
    profile: SourceProfile;
    readonly?: boolean;
    onchange?: (profile: SourceProfile) => void;
  }

  let { profile, readonly = false, onchange }: Props = $props();

  function update<K extends keyof SourceProfile>(key: K, value: SourceProfile[K]) {
    onchange?.({ ...profile, [key]: value });
  }

  let stewardInput = $state('');

  function addSteward() {
    if (!stewardInput.trim()) return;
    update('stewarded_by', [...profile.stewarded_by, stewardInput.trim()]);
    stewardInput = '';
  }
</script>

<div class="space-y-5">
  <div class="rounded-lg border border-teal-200 bg-teal-50/40 p-4">
    <h3 class="text-sm font-semibold text-teal-900">Source condition indicators</h3>
    <p class="mt-1 text-xs text-teal-800">
      Adaptive governance reads boundary events and monitoring data — not a complete interior model.
    </p>

    <div class="mt-4 grid gap-4 sm:grid-cols-2">
      <div>
        <label class="text-xs font-medium text-gray-700" for="sp-type">Source type</label>
        <select
          id="sp-type"
          class="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
          value={profile.source_type}
          disabled={readonly}
          onchange={(e) => update('source_type', e.currentTarget.value as SourceType)}
        >
          {#each SOURCE_TYPE_OPTIONS as opt}
            <option value={opt.id}>{opt.label}</option>
          {/each}
        </select>
      </div>
      <div>
        <label class="text-xs font-medium text-gray-700" for="sp-state">Regime state</label>
        <select
          id="sp-state"
          class="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
          value={profile.regime_state}
          disabled={readonly}
          onchange={(e) => update('regime_state', e.currentTarget.value as SourceRegimeState)}
        >
          {#each SOURCE_REGIME_STATE_OPTIONS as opt}
            <option value={opt.id}>{opt.label}</option>
          {/each}
        </select>
      </div>
      <div>
        <label class="text-xs text-gray-600" for="sp-stock">Current stock</label>
        <input
          id="sp-stock"
          type="number"
          class="mt-0.5 w-full rounded border border-gray-300 px-2 py-1 text-sm"
          value={profile.current_stock ?? ''}
          disabled={readonly}
          oninput={(e) =>
            update('current_stock', e.currentTarget.value ? Number(e.currentTarget.value) : null)}
        />
      </div>
      <div>
        <label class="text-xs text-gray-600" for="sp-flux">Flux rate</label>
        <input
          id="sp-flux"
          type="number"
          class="mt-0.5 w-full rounded border border-gray-300 px-2 py-1 text-sm"
          value={profile.flux_rate ?? ''}
          disabled={readonly}
          oninput={(e) =>
            update('flux_rate', e.currentTarget.value ? Number(e.currentTarget.value) : null)}
        />
      </div>
      <div>
        <label class="text-xs text-gray-600" for="sp-assim">Assimilation capacity</label>
        <input
          id="sp-assim"
          type="number"
          class="mt-0.5 w-full rounded border border-gray-300 px-2 py-1 text-sm"
          value={profile.assimilation_capacity ?? ''}
          disabled={readonly}
          oninput={(e) =>
            update(
              'assimilation_capacity',
              e.currentTarget.value ? Number(e.currentTarget.value) : null
            )}
        />
      </div>
      <div>
        <label class="text-xs text-gray-600" for="sp-resilience">Resilience (0–1)</label>
        <input
          id="sp-resilience"
          type="number"
          min="0"
          max="1"
          step="0.1"
          class="mt-0.5 w-full rounded border border-gray-300 px-2 py-1 text-sm"
          value={profile.resilience ?? ''}
          disabled={readonly}
          oninput={(e) =>
            update('resilience', e.currentTarget.value ? Number(e.currentTarget.value) : null)}
        />
      </div>
    </div>

    <div class="mt-4">
      <p class="text-xs font-medium text-gray-700">Stewards</p>
      {#if !readonly}
        <div class="mt-1 flex gap-2">
          <input
            type="text"
            bind:value={stewardInput}
            placeholder="Add steward"
            class="flex-1 rounded border border-gray-300 px-2 py-1 text-sm"
            onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), addSteward())}
          />
          <button
            type="button"
            class="rounded border border-teal-600 px-2 py-1 text-xs"
            onclick={addSteward}
          >
            Add
          </button>
        </div>
      {/if}
      <ul class="mt-2 flex flex-wrap gap-1">
        {#each profile.stewarded_by as steward}
          <li class="rounded bg-teal-100 px-2 py-0.5 text-xs text-teal-900">{steward}</li>
        {/each}
      </ul>
    </div>
  </div>

  <EcologicalValueVector
    {profile}
    {readonly}
    onchange={(values) => update('ecological_values', values)}
  />
</div>
