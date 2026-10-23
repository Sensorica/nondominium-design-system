<script lang="ts">
  import type {
    PropertyRegime,
    ResourceNature,
    ResourceScope,
    ResourceSpecificationInput
  } from '../../../domain/types.js';
  import {
    isScopeLocked,
    layer1GateMessagePlain,
    resolveScope,
    SPEC_NAME_MAX_LENGTH,
    validateSpecInput
  } from '../../../domain/layer1.js';
  import {
    categoryChipsForNature,
    startersForNdo,
    type SpecStarter
  } from '../../../domain/spec-starters.js';
  import { SCOPE_OPTIONS } from '../../../domain/wizard-questions.js';
  import Modal from '../../primitives/Modal.svelte';
  import NdoButton from '../../primitives/NdoButton.svelte';

  export interface SpecFormInitial {
    name: string;
    description: string;
    category: string;
    tagsRaw: string;
    imageUrl: string;
    scope: ResourceScope;
    /** Present when editing — shown read-only under the form. */
    activated_at_stage?: string;
    ndo_identity_hash?: string;
  }

  interface Props {
    lifecycleStage: string | null;
    propertyRegime?: PropertyRegime | string | null;
    resourceNature?: ResourceNature | string | null;
    ndoName?: string | null;
    /** Seed values for this mount (parent remounts the modal per open). */
    initial: SpecFormInitial;
    mode: 'create' | 'edit';
    canCreate: boolean;
    onclose: () => void;
    onsubmit: (input: ResourceSpecificationInput) => void | Promise<void>;
  }

  let {
    lifecycleStage,
    propertyRegime = null,
    resourceNature = null,
    ndoName = null,
    initial,
    mode,
    canCreate,
    onclose,
    onsubmit
  }: Props = $props();

  const scopeLocked = $derived(isScopeLocked(propertyRegime));
  let chosenScope = $state<ResourceScope>(initial.scope);
  const scope = $derived(resolveScope(propertyRegime, chosenScope));

  let name = $state(initial.name);
  let description = $state(initial.description);
  let category = $state(initial.category);
  let tagsRaw = $state(initial.tagsRaw);
  let imageUrl = $state(initial.imageUrl);
  let errorMessage = $state('');
  let isSubmitting = $state(false);
  let howOpen = $state(false);
  let appliedStarterId = $state<string | null>(null);

  const starters = $derived(
    mode === 'create'
      ? startersForNdo({
          name: ndoName,
          resource_nature: resourceNature,
          property_regime: propertyRegime
        })
      : []
  );
  const chips = $derived(categoryChipsForNature(resourceNature));

  const title = $derived(mode === 'edit' ? 'Edit kind of item' : 'Add a kind of item');
  const subtitle = $derived(
    mode === 'edit'
      ? 'Update what this kind means. The link to the resource stays fixed.'
      : 'Describe a type of thing people can create, share, or borrow under this resource.'
  );

  function applyStarter(s: SpecStarter) {
    name = s.name;
    description = s.description;
    category = s.category;
    chosenScope = s.scope;
    tagsRaw = (s.tags ?? []).join(', ');
    appliedStarterId = s.id;
    errorMessage = '';
  }

  async function handleSubmit() {
    if (mode === 'create' && !canCreate) {
      errorMessage = layer1GateMessagePlain(lifecycleStage);
      return;
    }
    const tags = tagsRaw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const input: ResourceSpecificationInput = {
      name,
      description,
      category: category.trim() || 'general',
      image_url: imageUrl.trim() || null,
      tags,
      scope
    };
    const validated = validateSpecInput(input);
    if (!validated.ok) {
      errorMessage = validated.error;
      return;
    }
    isSubmitting = true;
    errorMessage = '';
    try {
      await onsubmit({
        name: validated.input.name,
        description: validated.input.description,
        category: validated.input.category,
        image_url: validated.input.image_url,
        tags: validated.input.tags,
        scope: validated.input.scope
      });
      onclose();
    } catch (e) {
      errorMessage = e instanceof Error ? e.message : 'Could not save this kind of item.';
    } finally {
      isSubmitting = false;
    }
  }
</script>

<Modal {title} {subtitle} maxWidth="lg" {onclose}>
  {#snippet children()}
    {#if mode === 'create' && !canCreate}
      <p class="rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        {layer1GateMessagePlain(lifecycleStage)}
      </p>
    {:else}
      <div class="space-y-4">
        {#if mode === 'create'}
          <p class="rounded border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700">
            This is a <strong>kind</strong> of item (a template), not a single unit on the shelf.
            Individual units come later.
          </p>

          {#if starters.length > 0}
            <div>
              <p class="mb-2 text-sm font-medium text-gray-800">Start from a common pattern</p>
              <div class="grid gap-2 sm:grid-cols-3" data-testid="spec-starters">
                {#each starters as s (s.id)}
                  <button
                    type="button"
                    class="rounded border px-3 py-2 text-left transition-colors
                      {appliedStarterId === s.id
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'}"
                    onclick={() => applyStarter(s)}
                  >
                    <span class="block text-sm font-medium text-gray-900">{s.label}</span>
                    <span class="mt-0.5 block text-xs text-gray-500">{s.blurb}</span>
                  </button>
                {/each}
              </div>
              <p class="mt-1.5 text-xs text-gray-400">Fills the fields below — edit anything.</p>
            </div>
          {/if}
        {/if}

        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700" for="spec-name"
            >Name *</label
          >
          <input
            id="spec-name"
            type="text"
            maxlength={SPEC_NAME_MAX_LENGTH}
            bind:value={name}
            placeholder="e.g. Prusa MK4 printer type"
            class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          <p class="mt-1 text-xs text-gray-500">
            What kind of thing is this? Keep it short (max {SPEC_NAME_MAX_LENGTH} characters).
          </p>
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700" for="spec-desc"
            >Description *</label
          >
          <textarea
            id="spec-desc"
            rows="3"
            bind:value={description}
            placeholder="What it is, how it is used, anything someone needs before adding a unit."
            class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          ></textarea>
          <p class="mt-1 text-xs text-gray-500">
            Help someone decide if this kind fits what they need.
          </p>
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700" for="spec-cat"
            >Category</label
          >
          <input
            id="spec-cat"
            type="text"
            bind:value={category}
            class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          <div class="mt-1.5 flex flex-wrap gap-1.5">
            {#each chips as chip}
              <button
                type="button"
                class="rounded-full border px-2 py-0.5 text-xs
                  {category === chip
                  ? 'border-blue-400 bg-blue-50 text-blue-800'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'}"
                onclick={() => (category = chip)}
              >
                {chip}
              </button>
            {/each}
          </div>
          <p class="mt-1 text-xs text-gray-500">A loose label for browsing — pick a chip or type your own.</p>
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700" for="spec-scope"
            >Who can find this kind?</label
          >
          <select
            id="spec-scope"
            value={scope}
            disabled={scopeLocked}
            onchange={(e) => (chosenScope = e.currentTarget.value as ResourceScope)}
            class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
          >
            {#each SCOPE_OPTIONS as opt}
              <option value={opt.id}>{opt.label}</option>
            {/each}
          </select>
          <p class="mt-1 text-xs text-gray-500">
            {#if scopeLocked}
              This resource is open access ({propertyRegime}), so its kinds stay
              <strong>Public commons</strong> — narrowing would hide them from global discovery.
            {:else}
              {SCOPE_OPTIONS.find((o) => o.id === scope)?.description ??
                'Choose how widely this kind should be discoverable.'}
            {/if}
          </p>
        </div>

        <div>
          <label class="mb-1 block text-sm text-gray-600" for="spec-tags"
            >Tags <span class="text-gray-400">(optional, comma-separated)</span></label
          >
          <input
            id="spec-tags"
            type="text"
            bind:value={tagsRaw}
            placeholder="e.g. 3d-printing, shared-lab"
            class="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm text-gray-600" for="spec-img"
            >Image URL <span class="text-gray-400">(optional)</span></label
          >
          <input
            id="spec-img"
            type="url"
            bind:value={imageUrl}
            placeholder="https://…"
            class="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <details
          class="rounded border border-gray-100 bg-gray-50 px-3 py-2"
          bind:open={howOpen}
        >
          <summary class="cursor-pointer text-sm font-medium text-gray-700">
            How this is used
          </summary>
          <ul class="mt-2 list-disc space-y-1 pl-5 text-xs text-gray-600">
            <li>The resource (NDO) is the shared thing or project.</li>
            <li>A <em>kind of item</em> describes a type you can invent under it.</li>
            <li>Individual units (instances) are added later — not in this form.</li>
            <li>Access rules and governance attach afterward.</li>
          </ul>
        </details>

        {#if mode === 'edit' && initial.activated_at_stage && initial.ndo_identity_hash}
          <p class="text-xs text-gray-500">
            Activated at stage <strong>{initial.activated_at_stage}</strong> · NDO
            <span class="font-mono">{initial.ndo_identity_hash.slice(0, 16)}…</span>
          </p>
        {/if}
      </div>
    {/if}

    {#if errorMessage}
      <p class="mt-4 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
        {errorMessage}
      </p>
    {/if}
  {/snippet}

  {#snippet footer()}
    <NdoButton variant="ghost" onclick={onclose}>Cancel</NdoButton>
    <NdoButton
      disabled={(mode === 'create' && !canCreate) || isSubmitting}
      onclick={handleSubmit}
    >
      {isSubmitting ? 'Saving…' : mode === 'edit' ? 'Save changes' : 'Add kind of item'}
    </NdoButton>
  {/snippet}
</Modal>
