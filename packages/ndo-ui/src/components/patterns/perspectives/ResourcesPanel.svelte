<script lang="ts">
  import type {
    NdoDescriptor,
    ResourceSpecification,
    ResourceSpecificationInput
  } from '../../../domain/types.js';
  import { canActivateLayer1, layer1GateMessagePlain } from '../../../domain/layer1.js';
  import { foreshadowBadge, isDigitalNature } from '../../../domain/spec-inventory.js';
  import { isSourceNdoDescriptor } from '../../../domain/spec-profiles.js';
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
  const digital = $derived(isDigitalNature(descriptor.resource_nature));
  const isSource = $derived(isSourceNdoDescriptor(descriptor));
  const sourceType = $derived(descriptor.source_profile?.source_type ?? null);
  /** Latest linked spec is canonical (REQ-NDO-L1-03). */
  const latestHash = $derived(
    specifications.length > 0 ? specifications[specifications.length - 1].action_hash : null
  );

  function scopeLabel(scope: string): string {
    return SCOPE_OPTIONS.find((o) => o.id === scope)?.label ?? scope;
  }

  function badgeFor(spec: ResourceSpecification): string | null {
    if (
      !spec.inventory_intent &&
      !spec.digital_locator_kind &&
      !spec.boundary_description &&
      !spec.monitoring_plan
    ) {
      return null;
    }
    return foreshadowBadge({
      inventory_intent: spec.inventory_intent ?? 'NotApplicable',
      identification_pattern: spec.identification_pattern ?? null,
      default_unit: spec.default_unit ?? null,
      substitutable: spec.substitutable ?? null,
      digital_locator_kind: spec.digital_locator_kind ?? null,
      digital_locator: spec.digital_locator ?? null,
      boundary_description: spec.boundary_description ?? null,
      monitoring_plan: spec.monitoring_plan ?? null,
      stakeholder_map: spec.stakeholder_map ?? null,
      restoration_obligations: spec.restoration_obligations ?? null
    });
  }

  function openCreate() {
    formMode = 'create';
    editingHash = null;
    formInitial = {
      name: '',
      description: '',
      category: isSource ? 'watershed' : 'general',
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
      inventory_intent: spec.inventory_intent,
      identification_pattern: spec.identification_pattern,
      default_unit: spec.default_unit,
      substitutable: spec.substitutable,
      digital_locator_kind: spec.digital_locator_kind,
      digital_locator: spec.digital_locator,
      boundary_description: spec.boundary_description,
      monitoring_plan: spec.monitoring_plan,
      stakeholder_map: spec.stakeholder_map,
      restoration_obligations: spec.restoration_obligations,
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
      ndoArchetype={descriptor.ndo_archetype}
      {sourceType}
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
      <h3 class="text-base font-semibold text-gray-900">
        {isSource ? 'Source specification' : 'Kinds of item'}
      </h3>
      <p class="text-xs text-gray-500">
        {#if isSource}
          Boundaries, monitoring, and stewardship — not inventoriable stock.
        {:else if digital}
          Digital kinds — classified for browsing, located by address, never inventoried.
        {:else}
          Types under this resource — inventoriable or knowledge-only.
        {/if}
      </p>
    </div>
    <NdoButton class="px-3 py-1.5 text-xs" disabled={!canCreate} onclick={openCreate}>
      {isSource ? '+ Specify this Source' : '+ Add kind of item'}
    </NdoButton>
  </div>

  {#if !canCreate}
    <p class="rounded border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-800">
      {layer1GateMessagePlain(lifecycleStage)}
    </p>
  {/if}

  {#if specifications.length === 0}
    <div class="rounded border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center">
      <p class="text-sm text-gray-700">
        {isSource ? 'No Source specification yet.' : 'No kinds of item yet.'}
      </p>
      <p class="mt-1 text-xs text-gray-500">
        {#if isSource}
          Activate Layer 1 when boundaries and a monitoring plan are ready. Yielded units (water,
          fish, timber) stay separate EconomicResource kinds.
        {:else if digital}
          Add a kind when you know the artifact type — a design package, docs set, or method.
          Identify it by digital location (URL, hash, repo, store), not stock quantity.
        {:else}
          Add a kind when you know the type people will use — a printer type, a design package, a
          supply. A kind can be inventoriable (track units) or knowledge-only.
        {/if}
      </p>
      {#if canCreate}
        <div class="mt-3">
          <NdoButton class="px-3 py-1.5 text-xs" onclick={openCreate}>
            {isSource ? '+ Specify this Source' : '+ Add kind of item'}
          </NdoButton>
        </div>
      {/if}
    </div>
  {:else}
    <div class="space-y-4">
      {#each specifications as listing (listing.action_hash)}
        {@const badge = badgeFor(listing)}
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
                {#if badge}
                  <span
                    class="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-700"
                    data-testid="spec-foreshadow-badge"
                  >
                    {badge}
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
              {#if listing.boundary_description}
                <p class="mt-1 text-xs text-teal-800">
                  Boundary: {listing.boundary_description}
                </p>
              {/if}
              {#if listing.tags.length > 0}
                <p class="mt-1 text-xs text-gray-400">
                  Classifications: {listing.tags.join(', ')}
                </p>
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
