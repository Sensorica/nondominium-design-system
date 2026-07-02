<script lang="ts">
  import { getSpecProfileFields } from '../../../domain/spec-profiles.js';
  import type {
    NdoDescriptor,
    NdoSpecificationDraft,
    SpecFieldValue
  } from '../../../domain/types.js';

  interface Props {
    descriptor: NdoDescriptor;
    draft?: NdoSpecificationDraft;
    onchange?: (draft: NdoSpecificationDraft) => void;
  }

  let {
    descriptor,
    draft = $bindable({
      category: '',
      tags: [],
      fields: [],
      governance_rule_ids: []
    }),
    onchange
  }: Props = $props();

  const isSourceNdo = $derived(
    descriptor.ndo_archetype === 'source_ndo' || !!descriptor.source_profile
  );

  const fields = $derived(
    getSpecProfileFields(
      (descriptor.resource_nature ??
        'Physical') as import('../../../domain/types.js').ResourceNature,
      isSourceNdo
    )
  );

  function getFieldValue(fieldId: string): string {
    return draft.fields.find((f) => f.fieldId === fieldId)?.value ?? '';
  }

  function setFieldValue(fieldId: string, value: string) {
    const existing = draft.fields.filter((f) => f.fieldId !== fieldId);
    const nextFields: SpecFieldValue[] = value.trim()
      ? [...existing, { fieldId, value }]
      : existing;
    draft = { ...draft, fields: nextFields };
    onchange?.(draft);
  }

  function setCategory(value: string) {
    draft = { ...draft, category: value };
    onchange?.(draft);
  }

  function setTags(value: string) {
    draft = {
      ...draft,
      tags: value
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    };
    onchange?.(draft);
  }
</script>

<div class="space-y-5">
  <p class="rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">
    Incomplete specifications are valid — enrich iteratively as the resource matures (Open Know-How
    pattern).
  </p>

  <div class="grid gap-4 sm:grid-cols-2">
    <div>
      <label class="text-sm font-medium text-gray-700" for="spec-category">Category</label>
      <input
        id="spec-category"
        type="text"
        class="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
        value={draft.category ?? ''}
        placeholder="e.g. Open Hardware, Hydrology"
        oninput={(e) => setCategory(e.currentTarget.value)}
      />
    </div>
    <div>
      <label class="text-sm font-medium text-gray-700" for="spec-tags">Tags</label>
      <input
        id="spec-tags"
        type="text"
        class="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
        value={(draft.tags ?? []).join(', ')}
        placeholder="comma-separated"
        oninput={(e) => setTags(e.currentTarget.value)}
      />
    </div>
  </div>

  <div class="space-y-4">
    <h3 class="text-sm font-semibold text-gray-900">
      Profile fields for {descriptor.resource_nature}
      {#if isSourceNdo}
        <span class="font-normal text-teal-700">(Source-NDO)</span>
      {/if}
    </h3>

    {#each fields as field}
      <div>
        <label class="text-sm font-medium text-gray-700" for="field-{field.id}">
          {field.label}
          {#if field.required}<span class="text-red-500">*</span>{/if}
        </label>
        {#if field.helpText}
          <p class="text-xs text-gray-500">{field.helpText}</p>
        {/if}
        {#if field.inputType === 'textarea'}
          <textarea
            id="field-{field.id}"
            rows="3"
            class="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
            placeholder={field.placeholder}
            value={getFieldValue(field.id)}
            oninput={(e) => setFieldValue(field.id, e.currentTarget.value)}
          ></textarea>
        {:else}
          <input
            id="field-{field.id}"
            type={field.inputType === 'number'
              ? 'number'
              : field.inputType === 'url'
                ? 'url'
                : 'text'}
            class="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
            placeholder={field.placeholder}
            value={getFieldValue(field.id)}
            oninput={(e) => setFieldValue(field.id, e.currentTarget.value)}
          />
        {/if}
      </div>
    {/each}
  </div>
</div>
