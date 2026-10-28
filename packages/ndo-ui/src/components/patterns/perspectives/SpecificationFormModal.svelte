<script lang="ts">
  import type {
    DigitalLocatorKind,
    IdentificationPattern,
    InventoryIntent,
    NdoArchetypeId,
    PropertyRegime,
    ResourceNature,
    ResourceScope,
    ResourceSpecificationInput,
    SourceType
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
  import {
    getSourceSpecificationFields,
    isSourceNdoDescriptor
  } from '../../../domain/spec-profiles.js';
  import {
    defaultForeshadowForNature,
    DIGITAL_LOCATOR_OPTIONS,
    IDENTIFICATION_PATTERN_OPTIONS,
    INVENTORY_INTENT_OPTIONS,
    isDigitalNature,
    trackingFieldsApply,
    validateForeshadow
  } from '../../../domain/spec-inventory.js';
  import { SCOPE_OPTIONS } from '../../../domain/wizard-questions.js';
  import Modal from '../../primitives/Modal.svelte';
  import NdoButton from '../../primitives/NdoButton.svelte';

  export interface SpecFormInitial {
    name: string;
    description: string;
    /** Primary browse classification (Rust `category`). */
    category: string;
    tagsRaw: string;
    imageUrl: string;
    scope: ResourceScope;
    inventory_intent?: InventoryIntent;
    identification_pattern?: IdentificationPattern | null;
    default_unit?: string | null;
    substitutable?: boolean | null;
    digital_locator_kind?: DigitalLocatorKind | null;
    digital_locator?: string | null;
    boundary_description?: string | null;
    monitoring_plan?: string | null;
    stakeholder_map?: string | null;
    restoration_obligations?: string | null;
    /** Present when editing — shown read-only under the form. */
    activated_at_stage?: string;
    ndo_identity_hash?: string;
  }

  interface Props {
    lifecycleStage: string | null;
    propertyRegime?: PropertyRegime | string | null;
    resourceNature?: ResourceNature | string | null;
    ndoName?: string | null;
    ndoArchetype?: NdoArchetypeId | string | null;
    sourceType?: SourceType | string | null;
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
    ndoArchetype = null,
    sourceType = null,
    initial,
    mode,
    canCreate,
    onclose,
    onsubmit
  }: Props = $props();

  const isSource = isSourceNdoDescriptor({
    ndo_archetype: ndoArchetype,
    source_profile: sourceType ? { source_type: sourceType } : null
  });
  const natureDefault = defaultForeshadowForNature(resourceNature, { isSource });
  const digital = $derived(isDigitalNature(resourceNature));
  const sourceFields = getSourceSpecificationFields();

  const scopeLocked = $derived(isScopeLocked(propertyRegime));
  let chosenScope = $state<ResourceScope>(initial.scope);
  const scope = $derived(resolveScope(propertyRegime, chosenScope));

  let name = $state(initial.name);
  let description = $state(initial.description);
  let category = $state(initial.category);
  let tagsRaw = $state(initial.tagsRaw);
  let imageUrl = $state(initial.imageUrl);
  let inventoryIntent = $state<InventoryIntent>(
    isSource || isDigitalNature(resourceNature)
      ? 'NotApplicable'
      : (initial.inventory_intent ?? natureDefault.inventory_intent)
  );
  let identificationPattern = $state<IdentificationPattern | null>(
    initial.identification_pattern !== undefined
      ? initial.identification_pattern
      : natureDefault.identification_pattern
  );
  let defaultUnit = $state(initial.default_unit ?? natureDefault.default_unit ?? '');
  let substitutable = $state<boolean | null>(
    initial.substitutable !== undefined ? initial.substitutable : natureDefault.substitutable
  );
  let digitalLocatorKind = $state<DigitalLocatorKind | null>(
    initial.digital_locator_kind !== undefined
      ? initial.digital_locator_kind
      : (natureDefault.digital_locator_kind ?? null)
  );
  let digitalLocator = $state(initial.digital_locator ?? '');
  let boundaryDescription = $state(initial.boundary_description ?? '');
  let monitoringPlan = $state(initial.monitoring_plan ?? '');
  let stakeholderMap = $state(initial.stakeholder_map ?? '');
  let restorationObligations = $state(initial.restoration_obligations ?? '');
  let errorMessage = $state('');
  let isSubmitting = $state(false);
  let howOpen = $state(false);
  let appliedStarterId = $state<string | null>(null);

  const showTracking = $derived(!isSource && !digital && trackingFieldsApply(inventoryIntent));
  const locatorPlaceholder = $derived(
    DIGITAL_LOCATOR_OPTIONS.find((o) => o.id === digitalLocatorKind)?.placeholder ?? 'Address…'
  );

  const starters = $derived(
    mode === 'create'
      ? startersForNdo({
          name: ndoName,
          resource_nature: resourceNature,
          property_regime: propertyRegime,
          ndo_archetype: ndoArchetype,
          source_type: sourceType
        })
      : []
  );
  const chips = $derived(
    categoryChipsForNature(resourceNature, { isSource, source_type: sourceType })
  );

  const title = $derived(
    isSource
      ? mode === 'edit'
        ? 'Edit Source specification'
        : 'Specify this Source'
      : mode === 'edit'
        ? 'Edit kind of item'
        : 'Add a kind of item'
  );
  const subtitle = $derived(
    mode === 'edit'
      ? isSource
        ? 'Update boundary, monitoring, and stewardship notes. The link to Layer 0 stays fixed.'
        : 'Update what this kind means. The link to the resource stays fixed.'
      : isSource
        ? 'Describe the generative system — boundaries and monitoring, not shelf inventory. Extracted units are separate.'
        : digital
          ? 'Describe a digital kind — classified for browsing, located by address, never inventoried.'
          : 'Describe a type of thing under this resource — separate from browse labels and shelf units.'
  );

  function sourceFieldValue(id: string): string {
    switch (id) {
      case 'boundary_description':
        return boundaryDescription;
      case 'monitoring_plan':
        return monitoringPlan;
      case 'stakeholder_map':
        return stakeholderMap;
      case 'restoration_obligations':
        return restorationObligations;
      default:
        return '';
    }
  }

  function setSourceFieldValue(id: string, value: string) {
    switch (id) {
      case 'boundary_description':
        boundaryDescription = value;
        break;
      case 'monitoring_plan':
        monitoringPlan = value;
        break;
      case 'stakeholder_map':
        stakeholderMap = value;
        break;
      case 'restoration_obligations':
        restorationObligations = value;
        break;
    }
  }

  function applyStarter(s: SpecStarter) {
    name = s.name;
    description = s.description;
    category = s.category;
    chosenScope = s.scope;
    tagsRaw = (s.tags ?? []).join(', ');
    inventoryIntent =
      isSource || isDigitalNature(resourceNature) ? 'NotApplicable' : s.inventory_intent;
    identificationPattern = s.identification_pattern;
    defaultUnit = s.default_unit ?? '';
    substitutable = s.substitutable;
    digitalLocatorKind = s.digital_locator_kind ?? null;
    digitalLocator = s.digital_locator ?? '';
    boundaryDescription = s.boundary_description ?? '';
    monitoringPlan = s.monitoring_plan ?? '';
    stakeholderMap = s.stakeholder_map ?? '';
    restorationObligations = s.restoration_obligations ?? '';
    appliedStarterId = s.id;
    errorMessage = '';
  }

  function foreshadowPayload() {
    return {
      inventory_intent: isSource || digital ? ('NotApplicable' as const) : inventoryIntent,
      identification_pattern: identificationPattern,
      default_unit: defaultUnit,
      substitutable,
      digital_locator_kind: digitalLocatorKind,
      digital_locator: digitalLocator,
      boundary_description: boundaryDescription,
      monitoring_plan: monitoringPlan,
      stakeholder_map: stakeholderMap,
      restoration_obligations: restorationObligations
    };
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
    const foreshadow = validateForeshadow(foreshadowPayload(), resourceNature, { isSource });
    if (!foreshadow.ok) {
      errorMessage = foreshadow.error;
      return;
    }
    const input: ResourceSpecificationInput = {
      name,
      description,
      category: category.trim() || (isSource ? 'source' : 'general'),
      image_url: imageUrl.trim() || null,
      tags,
      scope,
      inventory_intent: foreshadow.foreshadow.inventory_intent,
      identification_pattern: foreshadow.foreshadow.identification_pattern,
      default_unit: foreshadow.foreshadow.default_unit,
      substitutable: foreshadow.foreshadow.substitutable,
      digital_locator_kind: foreshadow.foreshadow.digital_locator_kind,
      digital_locator: foreshadow.foreshadow.digital_locator,
      boundary_description: foreshadow.foreshadow.boundary_description,
      monitoring_plan: foreshadow.foreshadow.monitoring_plan,
      stakeholder_map: foreshadow.foreshadow.stakeholder_map,
      restoration_obligations: foreshadow.foreshadow.restoration_obligations
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
        ...input,
        name: validated.input.name,
        description: validated.input.description,
        category: validated.input.category,
        image_url: validated.input.image_url,
        tags: validated.input.tags,
        scope: validated.input.scope
      });
      onclose();
    } catch (e) {
      errorMessage =
        e instanceof Error
          ? e.message
          : isSource
            ? 'Could not save this Source specification.'
            : 'Could not save this kind of item.';
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
      <div class="space-y-5">
        {#if mode === 'create'}
          <p class="rounded border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700">
            {#if isSource}
              A <strong>Source specification</strong> describes the generative system (boundaries,
              monitoring, stewardship) — not inventoriable stock. Water m³, fish, or timber remain
              separate yielded resource units.
            {:else if digital}
              The <strong>kind</strong> is the type (ValueFlows ResourceSpecification). Browse
              classifications help others find it. Digital kinds are located by address or content
              hash — never tracked as shelf inventory.
            {:else}
              The <strong>kind</strong> is the type (ValueFlows ResourceSpecification). Browse
              classifications are labels for finding it. Inventory is whether you track individual
              units — not every kind needs units.
            {/if}
          </p>

          {#if starters.length > 0}
            <div>
              <p class="mb-2 text-sm font-medium text-gray-800">Start from a common pattern</p>
              <div class="grid gap-2 sm:grid-cols-2" data-testid="spec-starters">
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
              <p class="mt-1.5 text-xs text-gray-400">
                {#if isSource}
                  Fills Source specification fields and browse labels — edit anything.
                {:else}
                  Fills kind, tracking, and browse classification — edit anything.
                {/if}
              </p>
            </div>
          {/if}
        {/if}

        <!-- 1. The kind / Source identity -->
        <section class="space-y-3" data-testid="spec-section-kind">
          <h4 class="text-xs font-semibold tracking-wide text-gray-500 uppercase">
            {isSource ? 'Source identity' : 'The kind'}
          </h4>
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700" for="spec-name"
              >Name *</label
            >
            <input
              id="spec-name"
              type="text"
              maxlength={SPEC_NAME_MAX_LENGTH}
              bind:value={name}
              placeholder={isSource
                ? 'e.g. Mill Creek watershed specification'
                : 'e.g. Prusa MK4 printer type'}
              class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            <p class="mt-1 text-xs text-gray-500">
              {#if isSource}
                Name this Source specification (max {SPEC_NAME_MAX_LENGTH} characters).
              {:else}
                What kind of thing is this? (max {SPEC_NAME_MAX_LENGTH} characters)
              {/if}
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
              placeholder={isSource
                ? 'What this Source yields, receives, and how stewards observe it.'
                : 'What it is, how it is used, anything someone needs before adding a unit.'}
              class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            ></textarea>
          </div>
        </section>

        <!-- 2. Source specification / Tracking / digital location -->
        <section class="space-y-3" data-testid="spec-section-tracking">
          {#if isSource}
            <h4 class="text-xs font-semibold tracking-wide text-gray-500 uppercase">
              Source specification
            </h4>
            <p
              class="rounded border border-teal-100 bg-teal-50 px-3 py-2 text-sm text-teal-900"
              data-testid="source-not-inventoriable"
            >
              Sources are <strong>not inventoriable</strong>. Condition indicators live on the
              Source profile; this Layer 1 form captures boundaries, monitoring, and stewardship.
            </p>
            {#each sourceFields as field (field.id)}
              <div>
                <label class="mb-1 block text-sm font-medium text-gray-700" for="src-{field.id}">
                  {field.label}
                  {#if field.required}<span class="text-red-500">*</span>{/if}
                </label>
                {#if field.helpText}
                  <p class="mb-1 text-xs text-gray-500">{field.helpText}</p>
                {/if}
                <textarea
                  id="src-{field.id}"
                  rows="2"
                  value={sourceFieldValue(field.id)}
                  placeholder={field.placeholder ?? ''}
                  oninput={(e) => setSourceFieldValue(field.id, e.currentTarget.value)}
                  class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                ></textarea>
              </div>
            {/each}
          {:else if digital}
            <h4 class="text-xs font-semibold tracking-wide text-gray-500 uppercase">
              Digital location
            </h4>
            <p
              class="rounded border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-900"
              data-testid="digital-not-inventoriable"
            >
              Digital artifacts are <strong>not inventoriable</strong> — they do not sit on a
              shelf. Classify them for browsing; identify them by where they can be reached
              (address, hash, repo, store, or host).
            </p>
            <fieldset>
              <legend class="mb-2 text-sm font-medium text-gray-700"
                >How is this artifact reached?</legend
              >
              <div class="space-y-2">
                {#each DIGITAL_LOCATOR_OPTIONS as opt}
                  <label
                    class="flex cursor-pointer gap-2 rounded border px-3 py-2 text-sm
                      {digitalLocatorKind === opt.id
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-gray-200 bg-white'}"
                  >
                    <input
                      type="radio"
                      name="digital-locator-kind"
                      value={opt.id}
                      checked={digitalLocatorKind === opt.id}
                      onchange={() => (digitalLocatorKind = opt.id)}
                      class="mt-0.5"
                    />
                    <span>
                      <span class="font-medium text-gray-900">{opt.label}</span>
                      <span class="mt-0.5 block text-xs text-gray-500">{opt.description}</span>
                    </span>
                  </label>
                {/each}
              </div>
            </fieldset>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700" for="spec-digital-locator"
                >Address <span class="font-normal text-gray-400">(optional)</span></label
              >
              <input
                id="spec-digital-locator"
                type="text"
                bind:value={digitalLocator}
                placeholder={locatorPlaceholder}
                class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
              <p class="mt-1 text-xs text-gray-500">
                URI, content hash, repo ref, DHT address, DB key, or host path — not a stock
                quantity.
              </p>
            </div>
          {:else}
            <h4 class="text-xs font-semibold tracking-wide text-gray-500 uppercase">Tracking</h4>
            <fieldset>
              <legend class="mb-2 text-sm font-medium text-gray-700">Will we track units?</legend>
              <div class="space-y-2">
                {#each INVENTORY_INTENT_OPTIONS as opt}
                  <label
                    class="flex cursor-pointer gap-2 rounded border px-3 py-2 text-sm
                      {inventoryIntent === opt.id
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-gray-200 bg-white'}"
                  >
                    <input
                      type="radio"
                      name="inventory-intent"
                      value={opt.id}
                      checked={inventoryIntent === opt.id}
                      onchange={() => (inventoryIntent = opt.id)}
                      class="mt-0.5"
                    />
                    <span>
                      <span class="font-medium text-gray-900">{opt.label}</span>
                      <span class="mt-0.5 block text-xs text-gray-500">{opt.description}</span>
                    </span>
                  </label>
                {/each}
              </div>
            </fieldset>

            {#if showTracking}
              <fieldset>
                <legend class="mb-2 text-sm font-medium text-gray-700"
                  >How are units identified?</legend
                >
                <div class="space-y-2">
                  {#each IDENTIFICATION_PATTERN_OPTIONS as opt}
                    <label
                      class="flex cursor-pointer gap-2 rounded border px-3 py-2 text-sm
                        {identificationPattern === opt.id
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-200 bg-white'}"
                    >
                      <input
                        type="radio"
                        name="identification-pattern"
                        value={opt.id}
                        checked={identificationPattern === opt.id}
                        onchange={() => (identificationPattern = opt.id)}
                        class="mt-0.5"
                      />
                      <span>
                        <span class="font-medium text-gray-900">{opt.label}</span>
                        <span class="mt-0.5 block text-xs text-gray-500">{opt.description}</span>
                      </span>
                    </label>
                  {/each}
                </div>
              </fieldset>
              <div>
                <label class="mb-1 block text-sm font-medium text-gray-700" for="spec-unit"
                  >Default unit {inventoryIntent === 'Inventoried' ? '*' : ''}</label
                >
                <input
                  id="spec-unit"
                  type="text"
                  bind:value={defaultUnit}
                  placeholder="e.g. each, kg, L, kit"
                  class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
                <p class="mt-1 text-xs text-gray-500">
                  Measure for instances of this kind (ValueFlows default unit of resource).
                </p>
              </div>
              <label class="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={substitutable === true}
                  onchange={(e) => (substitutable = e.currentTarget.checked)}
                />
                Units of this kind are interchangeable (substitutable)
              </label>
            {:else}
              <p class="text-xs text-gray-500">
                No shelf units will be tracked for this kind — it stays knowledge-only until you
                change tracking.
              </p>
            {/if}
          {/if}
        </section>

        <!-- 3. Browse classifications -->
        <section class="space-y-3" data-testid="spec-section-classifications">
          <h4 class="text-xs font-semibold tracking-wide text-gray-500 uppercase">
            Browse classifications
          </h4>
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700" for="spec-cat"
              >Primary browse classification</label
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
            <p class="mt-1 text-xs text-gray-500">
              A discovery label — not the kind itself. Stored as <code class="text-[10px]"
                >category</code
              > on the chain today.
            </p>
          </div>
          <div>
            <label class="mb-1 block text-sm text-gray-600" for="spec-tags"
              >Additional classifications
              <span class="text-gray-400">(optional, comma-separated)</span></label
            >
            <input
              id="spec-tags"
              type="text"
              bind:value={tagsRaw}
              placeholder="e.g. 3d-printing, shared-lab"
              class="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </section>

        <!-- 4. Who can find -->
        <section class="space-y-3" data-testid="spec-section-scope">
          <h4 class="text-xs font-semibold tracking-wide text-gray-500 uppercase">
            {isSource ? 'Who can find this Source specification?' : 'Who can find this kind?'}
          </h4>
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700" for="spec-scope">Scope</label>
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
        </section>

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
            How this maps to ValueFlows
          </summary>
          <ul class="mt-2 list-disc space-y-1 pl-5 text-xs text-gray-600">
            <li>
              <strong>Kind</strong> = ResourceSpecification (the type). Name and description define
              it.
            </li>
            <li>
              <strong>Browse classifications</strong> = VF classifications for filter/match — not
              the kind.
            </li>
            <li>
              <strong>Tracking</strong> (physical/hybrid) = whether instances are inventoried, and
              how they are identified (serialized, lot, or stock).
            </li>
            <li>
              <strong>Digital location</strong> = address, content hash, repo, store, or host —
              digital kinds are never inventoried.
            </li>
            <li>
              <strong>Instances</strong> (EconomicResource) are added later only when inventoriable.
            </li>
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
