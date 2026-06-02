<script lang="ts">
  import type { NdoDescriptor, NdoInput, PropertyRegime, ResourceNature } from '../../../domain/types.js';
  import type { CreatableNdoLifecycleStage } from '../../../domain/enums.js';
  import {
    CREATABLE_NDO_LIFECYCLE_STAGES,
    MVP_REGIMES,
    ALL_RESOURCE_NATURES
  } from '../../../domain/enums.js';
  import { REGIME_TOOLTIPS, NATURE_TOOLTIPS } from '../../../domain/tooltips.js';
  import Modal from '../../primitives/Modal.svelte';
  import NdoButton from '../../primitives/NdoButton.svelte';

  interface Props {
    groupId: string;
    groupName?: string;
    existingNdos?: NdoDescriptor[];
    isSubmitting?: boolean;
    errorMessage?: string | null;
    onclose: () => void;
    onsubmit?: (input: NdoInput) => void | Promise<void>;
  }

  let {
    groupId,
    groupName = 'Group',
    existingNdos = [],
    isSubmitting = false,
    errorMessage = null,
    onclose,
    onsubmit
  }: Props = $props();

  let name = $state('');
  let property_regime = $state<PropertyRegime>('Commons');
  let resource_nature = $state<ResourceNature>('Physical');
  let lifecycle_stage = $state<CreatableNdoLifecycleStage>('Ideation');
  let description = $state('');
  let localError = $state('');

  const nameWarning = $derived(
    name.trim() &&
      existingNdos.some((d) => d.name.toLowerCase() === name.trim().toLowerCase())
      ? 'An NDO with this name already exists in the Lobby.'
      : ''
  );

  async function handleSubmit() {
    if (!name.trim()) {
      localError = 'Name is required.';
      return;
    }
    localError = '';
    const input: NdoInput = {
      name: name.trim(),
      property_regime,
      resource_nature,
      lifecycle_stage,
      ...(description.trim() && { description: description.trim() })
    };
    await onsubmit?.(input);
  }

  const displayError = $derived(errorMessage ?? localError);
</script>

<Modal
  title="Create NDO"
  subtitle="Register a new NondominiumIdentity Layer 0 within {groupName}."
  maxWidth="lg"
>
  {#snippet children()}
    <div class="space-y-4">
      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700" for="ndo-name">
          Name <span class="text-red-500">*</span>
        </label>
        <input
          id="ndo-name"
          type="text"
          bind:value={name}
          placeholder="Unique identifier for this NDO"
          class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {#if nameWarning}
          <p class="mt-1 text-xs text-amber-600">{nameWarning}</p>
        {/if}
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700" for="ndo-regime">
          Property Regime
        </label>
        <select
          id="ndo-regime"
          bind:value={property_regime}
          class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          {#each MVP_REGIMES as r}
            <option value={r}>{r}</option>
          {/each}
        </select>
        <p class="mt-1 text-xs text-gray-500">{REGIME_TOOLTIPS[property_regime]}</p>
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700" for="ndo-nature">
          Resource Nature
        </label>
        <select
          id="ndo-nature"
          bind:value={resource_nature}
          class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          {#each ALL_RESOURCE_NATURES as n}
            <option value={n}>{n}</option>
          {/each}
        </select>
        <p class="mt-1 text-xs text-gray-500">{NATURE_TOOLTIPS[resource_nature]}</p>
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700" for="ndo-stage">
          Initial Lifecycle Stage
        </label>
        <select
          id="ndo-stage"
          bind:value={lifecycle_stage}
          class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          {#each CREATABLE_NDO_LIFECYCLE_STAGES as s}
            <option value={s}>{s}</option>
          {/each}
        </select>
        <p class="mt-1 text-xs text-gray-500">
          Choose emergence (Ideation–Prototype) for something still forming, or
          <span class="font-medium">Stable</span> / <span class="font-medium">Distributed</span> /
          <span class="font-medium">Active</span> for an already mature or in-use resource.
        </p>
      </div>

      <div>
        <label class="mb-1 block text-sm text-gray-600" for="ndo-desc">
          Description <span class="text-gray-400">(optional)</span>
        </label>
        <textarea
          id="ndo-desc"
          bind:value={description}
          rows="3"
          placeholder="What is this NDO about?"
          class="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        ></textarea>
      </div>

      {#if displayError}
        <p class="rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
          {displayError}
        </p>
      {/if}
    </div>
  {/snippet}
  {#snippet footer()}
    <NdoButton variant="ghost" onclick={onclose}>Cancel</NdoButton>
    <NdoButton disabled={isSubmitting} onclick={() => void handleSubmit()}>
      {isSubmitting ? 'Creating…' : 'Create NDO'}
    </NdoButton>
  {/snippet}
</Modal>
