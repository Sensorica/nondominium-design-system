<script lang="ts">
  import type {
    NdoDescriptor,
    ResourceSpecification,
    ResourceSpecificationInput
  } from '../../../domain/types.js';
  import { canActivateLayer1, layer1GateMessagePlain } from '../../../domain/layer1.js';
  import { foreshadowBadge, isDigitalNature } from '../../../domain/spec-inventory.js';
  import { isSourceNdoDescriptor } from '../../../domain/spec-profiles.js';
  import { deriveNdoUiProfile } from '../../../domain/ndo-ui-profile.js';
  import { SCOPE_OPTIONS } from '../../../domain/wizard-questions.js';
  import NdoButton from '../../primitives/NdoButton.svelte';
  import SpecificationFormModal, {
    type SpecFormInitial
  } from './SpecificationFormModal.svelte';

  /** Read-only inventoriable EconomicResource row under this NDO’s specification. */
  export type InventoriedInstanceView = {
    action_hash: string;
    quantity: number;
    unit: string;
    operational_state: string;
  };

  export type CreateInstanceInput = {
    spec_action_hash: string;
    quantity: number;
    unit: string;
  };

  interface Props {
    descriptor: NdoDescriptor;
    specifications?: ResourceSpecification[];
    /**
     * Inventoried EconomicResource rows keyed by specification action_hash.
     * When `economic_mode` is set these are dual-created with the NDO — show
     * them read-only; do not offer create.
     */
    instancesBySpec?: Record<string, InventoriedInstanceView[]>;
    oncreate?: (input: ResourceSpecificationInput) => void | Promise<void>;
    onupdate?: (
      actionHash: string,
      input: ResourceSpecificationInput
    ) => void | Promise<void>;
    /**
     * Only used for Physical/Hybrid without `economic_mode`. Ignored for Digital,
     * Source, and Use/Consume dual-created NDOs.
     */
    oncreateinstance?: (input: CreateInstanceInput) => void | Promise<void>;
  }

  let {
    descriptor,
    specifications = [],
    instancesBySpec = {},
    oncreate,
    onupdate,
    oncreateinstance
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
  const uiProfile = $derived(
    deriveNdoUiProfile({
      economicMode: descriptor.economic_mode,
      resourceNature: descriptor.resource_nature,
      propertyRegime: descriptor.property_regime,
      useKind: descriptor.use_kind,
      isSource,
      existingSpecCount: specifications.length,
      hasInventoriableResource: Object.keys(instancesBySpec).length > 0
    })
  );
  const canOfferSpecify = $derived(canCreate && uiProfile.resources.allowSpecCreate);
  // Digital / Source never inventory; Use/Consume seed via dual create; Hybrid may inventory the physical twin.
  const allowsManualInstanceCreate = $derived(uiProfile.resources.allowInstanceCreate);
  // Still list dual-created Use/Consume instances (read-only); never for Digital/Source.
  const showInstancesSection = $derived(
    !digital &&
      !isSource &&
      specifications.length > 0 &&
      (Object.keys(instancesBySpec).length > 0 ||
        (allowsManualInstanceCreate && !!oncreateinstance))
  );
  /** Latest linked spec is canonical (REQ-NDO-L1-03). */
  const latestHash = $derived(
    specifications.length > 0 ? specifications[specifications.length - 1].action_hash : null
  );

  let draftQty = $state<Record<string, string>>({});
  let draftUnit = $state<Record<string, string>>({});
  let createPending = $state<string | null>(null);
  let createError = $state<string | null>(null);
  let copiedHash = $state<string | null>(null);

  async function copyInstanceHash(hash: string) {
    try {
      await navigator.clipboard.writeText(hash);
      copiedHash = hash;
      setTimeout(() => {
        if (copiedHash === hash) copiedHash = null;
      }, 2000);
    } catch {
      copiedHash = null;
    }
  }

  async function submitInstance(spec: ResourceSpecification) {
    if (!oncreateinstance || !allowsManualInstanceCreate) return;
    createError = null;
    const raw = draftQty[spec.action_hash] ?? '1';
    const quantity = Number(raw);
    if (!Number.isFinite(quantity) || quantity <= 0) {
      createError = 'Quantity must be a positive number.';
      return;
    }
    const unit =
      (draftUnit[spec.action_hash] ?? spec.default_unit ?? 'each').trim() || 'each';
    createPending = spec.action_hash;
    try {
      await oncreateinstance({
        spec_action_hash: spec.action_hash,
        quantity,
        unit
      });
      draftQty = { ...draftQty, [spec.action_hash]: '1' };
    } catch (e) {
      createError = e instanceof Error ? e.message : 'Could not create the resource instance.';
    } finally {
      createPending = null;
    }
  }

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
      economicMode={descriptor.economic_mode}
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
        {isSource ? 'Source specification' : 'Specification'}
      </h3>
      <p class="text-xs text-gray-500">
        {#if isSource}
          Boundaries, monitoring, and stewardship — not inventoriable stock.
        {:else if digital}
          This NDO’s form — classified for browsing, located by address, never inventoried. Another
          document or design is a new NDO.
        {:else if descriptor.economic_mode === 'use'}
          The form of this held thing or place — seeded with the NDO, not a stock of many instances.
        {:else if descriptor.economic_mode === 'consume'}
          The form of this batch or lot — seeded with the NDO. A new delivery is a new NDO.
        {:else if String(descriptor.resource_nature ?? '') === 'Hybrid'}
          Hybrid may inventory the physical twin; the digital face is located by address, not shelf
          units. One specification per NDO.
        {:else}
          The form of this resource — inventoriable or knowledge-only. One specification per NDO;
          another thing is a new NDO.
        {/if}
      </p>
    </div>
    {#if canOfferSpecify}
      <NdoButton class="px-3 py-1.5 text-xs" onclick={openCreate}>
        {isSource ? '+ Specify this Source' : '+ Specify this NDO'}
      </NdoButton>
    {/if}
  </div>

  {#if !canCreate}
    <p class="rounded border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-800">
      {layer1GateMessagePlain(lifecycleStage)}
    </p>
  {:else if !isSource && specifications.length > 0}
    <p class="rounded border border-gray-100 bg-gray-50 px-3 py-2 text-xs text-gray-600">
      {#if descriptor.economic_mode}
        This inventoriable NDO already has its specification from create — edit it below rather than
        adding another.
      {:else}
        This NDO already has a specification — edit the canonical form below. Another artifact is a
        new NDO.
      {/if}
    </p>
  {/if}

  {#if specifications.length === 0}
    <div class="rounded border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center">
      <p class="text-sm text-gray-700">
        {isSource ? 'No Source specification yet.' : 'No specification yet.'}
      </p>
      <p class="mt-1 text-xs text-gray-500">
        {#if isSource}
          Activate Layer 1 when boundaries and a monitoring plan are ready. Yielded units (water,
          fish, timber) stay separate EconomicResource NDOs.
        {:else if digital}
          Specify this digital artifact when you know its type and location (URL, hash, repo,
          store) — never as inventoriable stock.
        {:else if descriptor.economic_mode}
          Dual create seeds the specification when this NDO reaches a Layer 1–eligible stage (at
          create, or on the first transition out of Ideation). Edit that form once it appears.
        {:else}
          Specify this NDO when you know its form — inventoriable (track units) or knowledge-only.
        {/if}
      </p>
      {#if canOfferSpecify}
        <div class="mt-3">
          <NdoButton class="px-3 py-1.5 text-xs" onclick={openCreate}>
            {isSource ? '+ Specify this Source' : '+ Specify this NDO'}
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

  {#if showInstancesSection}
    <section class="space-y-3" data-testid="inventoried-instances">
      <h3 class="text-sm font-semibold text-gray-800">Inventoried instances</h3>
      <p class="text-xs text-gray-500">
        {#if allowsManualInstanceCreate}
          A quantity of a kind, held on this NDO. New instances start pending validation. The action
          hash is what an economic event records.
        {:else if descriptor.economic_mode === 'use'}
          This NDO is the held thing (or place). Its economic resource was created with the NDO —
          copy the action hash below for events. A second instance would mean a different NDO.
        {:else}
          This NDO is this batch or lot. Its economic resource was created with the NDO — copy the
          action hash below for events. A new delivery is a new NDO, not another instance here.
        {/if}
      </p>
      {#if createError}
        <p class="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {createError}
        </p>
      {/if}
      {#each specifications as listing (listing.action_hash)}
        {@const instances = instancesBySpec[listing.action_hash] ?? []}
        <div class="rounded border border-gray-200 bg-white p-4">
          <div class="font-medium text-gray-900">{listing.name}</div>
          <h4 class="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Economic resources
          </h4>
          {#if instances.length === 0}
            <p class="mt-1 text-sm text-gray-500">No inventoried resources for this specification.</p>
          {:else}
            <ul class="mt-1 space-y-2">
              {#each instances as row (row.action_hash)}
                <li class="rounded border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                  <div>
                    <span class="font-medium">Qty</span>
                    {row.quantity}
                    {row.unit} ·
                    <span class="font-medium">Operational state</span>
                    {row.operational_state}
                  </div>
                  <div class="mt-1 flex items-center gap-2">
                    <span class="font-mono text-xs text-gray-500"
                      >{row.action_hash.slice(0, 20)}…</span
                    >
                    <button
                      type="button"
                      class="text-xs text-blue-700 underline"
                      onclick={() => void copyInstanceHash(row.action_hash)}
                    >
                      {copiedHash === row.action_hash ? 'Copied' : 'Copy action hash'}
                    </button>
                  </div>
                </li>
              {/each}
            </ul>
          {/if}
          {#if allowsManualInstanceCreate && oncreateinstance}
            <div class="mt-3 flex flex-wrap items-end gap-2" data-testid="create-instance-form">
              <label class="text-xs text-gray-600">
                Qty
                <input
                  class="mt-1 block w-20 rounded border border-gray-300 px-2 py-1 text-sm"
                  type="number"
                  min="0"
                  step="any"
                  value={draftQty[listing.action_hash] ?? '1'}
                  oninput={(e) => {
                    draftQty = {
                      ...draftQty,
                      [listing.action_hash]: (e.currentTarget as HTMLInputElement).value
                    };
                  }}
                />
              </label>
              <label class="text-xs text-gray-600">
                Unit
                <input
                  class="mt-1 block w-24 rounded border border-gray-300 px-2 py-1 text-sm"
                  type="text"
                  value={draftUnit[listing.action_hash] ?? listing.default_unit ?? 'each'}
                  oninput={(e) => {
                    draftUnit = {
                      ...draftUnit,
                      [listing.action_hash]: (e.currentTarget as HTMLInputElement).value
                    };
                  }}
                />
              </label>
              <NdoButton
                class="px-3 py-1.5 text-xs"
                disabled={createPending === listing.action_hash}
                onclick={() => void submitInstance(listing)}
              >
                {createPending === listing.action_hash ? 'Creating…' : 'Create instance'}
              </NdoButton>
            </div>
          {/if}
        </div>
      {/each}
    </section>
  {/if}
</div>
