<script lang="ts">
  import type {
    NdoDescriptor,
    ResourceSpecification,
    ResourceSpecificationInput
  } from '../../../domain/types.js';
  import { canActivateLayer1, layer1GateMessagePlain } from '../../../domain/layer1.js';
  import { SCOPE_OPTIONS } from '../../../domain/wizard-questions.js';
  import NdoButton from '../../primitives/NdoButton.svelte';
  import SpecificationFormModal, {
    type SpecFormInitial
  } from './SpecificationFormModal.svelte';

  interface Props {
    descriptor: NdoDescriptor;
    specifications?: ResourceSpecification[];
    oncreate?: (input: ResourceSpecificationInput) => void | Promise<void>;
    onupdate?: (
      actionHash: string,
      input: ResourceSpecificationInput
    ) => void | Promise<void>;
  }

  let {
    descriptor,
    specifications = [],
    oncreate,
    onupdate
  }: Props = $props();

  let showForm = $state(false);
  let formMode = $state<'create' | 'edit'>('create');
  let formInitial = $state<SpecFormInitial | null>(null);
  let editingHash = $state<string | null>(null);

  const lifecycleStage = $derived(
    descriptor.lifecycle_stage ? String(descriptor.lifecycle_stage) : null
  );
  const canCreate = $derived(canActivateLayer1(descriptor.lifecycle_stage));
  /** Latest linked spec is canonical (REQ-NDO-L1-03). */
  const latestHash = $derived(
    specifications.length > 0 ? specifications[specifications.length - 1].action_hash : null
  );

  function scopeLabel(scope: string): string {
    return SCOPE_OPTIONS.find((o) => o.id === scope)?.label ?? scope;
  }

  function openCreate() {
    formMode = 'create';
    editingHash = null;
    formInitial = {
      name: '',
      description: '',
      category: 'general',
      tagsRaw: '',
      imageUrl: '',
      scope: 'Project'
    };
    showForm = true;
  }

  function openEdit(spec: ResourceSpecification) {
    formMode = 'edit';
    editingHash = spec.action_hash;
    formInitial = {
      name: spec.name,
      description: spec.description,
      category: spec.category,
      tagsRaw: spec.tags.join(', '),
      imageUrl: spec.image_url ?? '',
      scope: spec.scope,
      activated_at_stage: String(spec.activated_at_stage),
      ndo_identity_hash: spec.ndo_identity_hash
    };
    showForm = true;
  }

  function closeForm() {
    showForm = false;
    formInitial = null;
    editingHash = null;
  }

  async function handleSubmit(input: ResourceSpecificationInput) {
    if (formMode === 'edit' && editingHash) {
      await onupdate?.(editingHash, input);
    } else {
      await oncreate?.(input);
    }
  }
</script>

{#if showForm && formInitial}
  {#key editingHash ?? 'create'}
    <SpecificationFormModal
      {lifecycleStage}
      propertyRegime={descriptor.property_regime}
      resourceNature={descriptor.resource_nature}
      ndoName={descriptor.name}
      initial={formInitial}
      mode={formMode}
      {canCreate}
      onclose={closeForm}
      onsubmit={handleSubmit}
    />
  {/key}
{/if}

<div class="space-y-4" data-testid="resources-panel">
  <div class="flex items-center justify-between gap-3">
    <div>
      <h3 class="text-base font-semibold text-gray-900">Kinds of item</h3>
      <p class="text-xs text-gray-500">
        Templates for things people can create or share under this resource.
      </p>
    </div>
    <NdoButton class="px-3 py-1.5 text-xs" disabled={!canCreate} onclick={openCreate}>
      + Add kind of item
    </NdoButton>
  </div>

  {#if !canCreate}
    <p class="rounded border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-800">
      {layer1GateMessagePlain(lifecycleStage)}
    </p>
  {/if}

  {#if specifications.length === 0}
    <div class="rounded border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center">
      <p class="text-sm text-gray-700">No kinds of item yet.</p>
      <p class="mt-1 text-xs text-gray-500">
        Add a kind when you know what people will create or share — a printer type, a design
        package, a supply — not a single numbered unit.
      </p>
      {#if canCreate}
        <div class="mt-3">
          <NdoButton class="px-3 py-1.5 text-xs" onclick={openCreate}>
            + Add kind of item
          </NdoButton>
        </div>
      {/if}
    </div>
  {:else}
    <div class="space-y-4">
      {#each specifications as listing (listing.action_hash)}
        <div class="rounded border border-gray-200 bg-white p-4">
          <div class="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <span class="font-medium text-gray-900">{listing.name}</span>
                {#if listing.action_hash === latestHash}
                  <span
                    class="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-blue-700 uppercase"
                  >
                    Current
                  </span>
                {/if}
              </div>
              <div class="mt-0.5 text-xs text-gray-500">
                {listing.category} · {scopeLabel(listing.scope)} ·
                {listing.is_active ? 'active' : 'inactive'}
              </div>
              {#if listing.description}
                <p class="mt-2 text-sm text-gray-600">{listing.description}</p>
              {/if}
              {#if listing.tags.length > 0}
                <p class="mt-1 text-xs text-gray-400">Tags: {listing.tags.join(', ')}</p>
              {/if}
              <p class="mt-1 text-xs text-gray-400">
                Added at lifecycle {listing.activated_at_stage}
              </p>
            </div>
            <NdoButton
              variant="ghost"
              class="px-2 py-1 text-xs"
              onclick={() => openEdit(listing)}
            >
              Edit
            </NdoButton>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
