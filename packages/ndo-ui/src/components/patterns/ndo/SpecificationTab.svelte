<script lang="ts">
  import type {
    NdoDescriptor,
    NdoSpecificationDraft,
    SourceProfile
  } from '../../../domain/types.js';
  import SpecificationEditor from './SpecificationEditor.svelte';
  import GovernanceTemplatePicker from './GovernanceTemplatePicker.svelte';
  import SourceProfilePanel from './SourceProfilePanel.svelte';
  import NdoButton from '../../primitives/NdoButton.svelte';

  interface Props {
    descriptor: NdoDescriptor;
    specDraft?: NdoSpecificationDraft;
    sourceProfile?: SourceProfile | null;
    onspecchange?: (draft: NdoSpecificationDraft) => void;
    onsourcechange?: (profile: SourceProfile) => void;
    onsave?: () => void;
  }

  let {
    descriptor,
    specDraft: initialDraft,
    sourceProfile: initialSourceProfile,
    onspecchange,
    onsourcechange,
    onsave
  }: Props = $props();

  let draft = $state<NdoSpecificationDraft>(
    initialDraft ?? {
      category: '',
      tags: [],
      fields: [],
      governance_rule_ids: []
    }
  );

  let sourceProfile = $state<SourceProfile | null>(
    initialSourceProfile ?? descriptor.source_profile ?? null
  );

  $effect(() => {
    if (initialDraft) draft = initialDraft;
  });

  $effect(() => {
    if (initialSourceProfile) sourceProfile = initialSourceProfile;
  });

  const isSourceNdo = $derived(
    descriptor.ndo_archetype === 'source_ndo' || !!sourceProfile || !!descriptor.source_profile
  );

  function handleSpecChange(next: NdoSpecificationDraft) {
    draft = next;
    onspecchange?.(next);
  }

  function handleRuleChange(ids: string[]) {
    draft = { ...draft, governance_rule_ids: ids };
    onspecchange?.(draft);
  }
</script>

<div class="space-y-8">
  <section>
    <h2 class="text-base font-semibold text-gray-900">Layer 1 — Specification</h2>
    <p class="mt-1 text-sm text-gray-600">
      Profile-driven fields based on resource nature. Nothing here blocks participation.
    </p>
    <div class="mt-4">
      <SpecificationEditor {descriptor} bind:draft onchange={handleSpecChange} />
    </div>
  </section>

  {#if isSourceNdo && sourceProfile}
    <section>
      <h2 class="text-base font-semibold text-teal-900">Source-NDO profile</h2>
      <p class="mt-1 text-sm text-gray-600">
        Ecological condition indicators and stewardship obligations.
      </p>
      <div class="mt-4">
        <SourceProfilePanel
          profile={sourceProfile}
          onchange={(p) => {
            sourceProfile = p;
            onsourcechange?.(p);
          }}
        />
      </div>
    </section>
  {/if}

  <section>
    <h2 class="text-base font-semibold text-gray-900">Governance rules</h2>
    <p class="mt-1 text-sm text-gray-600">
      Select recommended templates — each explains who can do what and why.
    </p>
    <div class="mt-4">
      <GovernanceTemplatePicker
        {descriptor}
        selectedRuleIds={draft.governance_rule_ids}
        onchange={handleRuleChange}
      />
    </div>
  </section>

  {#if onsave}
    <div class="flex justify-end border-t border-gray-100 pt-4">
      <NdoButton onclick={() => onsave?.()}>Save specification (mock)</NdoButton>
    </div>
  {/if}
</div>
