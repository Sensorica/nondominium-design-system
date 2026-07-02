<script lang="ts">
  import { base } from '$app/paths';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { page } from '$app/state';
  import {
    AppShell,
    NdoCreateModal,
    MOCK_NDOS,
    MOCK_LOBBY_PROFILE,
    getMockGroups,
    type NdoInput,
    type NdoArchetypeId,
    type WizardResult
  } from '@nondominium/ndo-ui';

  const archetypeParam = $derived(
    browser ? (page.url.searchParams.get('archetype') as NdoArchetypeId | null) : null
  );

  const initialArchetype = $derived(
    archetypeParam === 'source_ndo' ||
      archetypeParam === 'open_design' ||
      archetypeParam === 'active_project' ||
      archetypeParam === 'stub'
      ? archetypeParam
      : 'stub'
  );

  let submitted = $state(false);
  let lastInput = $state<NdoInput | null>(null);
  let lastResult = $state<WizardResult | null>(null);

  function handleSubmit(input: NdoInput) {
    lastInput = input;
    submitted = true;
  }

  function handleWizardComplete(result: WizardResult) {
    lastResult = result;
  }

  const demoGroup = $derived(getMockGroups()[0]);
</script>

<svelte:head><title>NDO Create Wizard — UI Kit</title></svelte:head>

<AppShell
  groups={getMockGroups()}
  activePath={`${base}/ui-kit/ndo-create`}
  profileNickname={MOCK_LOBBY_PROFILE.nickname}
  browseHref={`${base}/ui-kit/browse`}
  groupHref={(id) => `${base}/ui-kit/group?id=${id}`}
  onprofileclick={() => {}}
>
  <div class="p-6">
    <div class="mb-4 flex flex-wrap gap-2">
      <span class="text-sm text-gray-600">Demo entry:</span>
      <a href="{base}/ui-kit/ndo-create" class="text-sm text-blue-600 hover:underline">Stub</a>
      <a
        href="{base}/ui-kit/ndo-create?archetype=open_design"
        class="text-sm text-blue-600 hover:underline">Open design</a
      >
      <a
        href="{base}/ui-kit/ndo-create?archetype=source_ndo"
        class="text-sm text-blue-600 hover:underline">Source-NDO</a
      >
    </div>

    {#if submitted && lastInput}
      <div class="mx-auto max-w-lg rounded-xl border border-emerald-200 bg-white p-6 shadow-sm">
        <h1 class="text-lg font-semibold text-gray-900">NDO created (mock)</h1>
        <p class="mt-2 text-sm text-gray-600">
          {lastInput.name} · {lastInput.lifecycle_stage} · {lastInput.property_regime}
        </p>
        {#if lastResult?.refinement.source_profile}
          <p class="mt-1 text-sm text-teal-800">
            Source-NDO · {lastResult.refinement.source_profile.source_type} · stewards:
            {lastResult.refinement.source_profile.stewarded_by.join(', ')}
          </p>
        {/if}
        <p class="mt-3 text-xs text-gray-500">
          Continue to Layer 1 enrichment on the Specification tab.
        </p>
        <a
          href="{base}/ui-kit/ndo-enrich?hash={MOCK_NDOS.at(-1)?.hash}"
          class="mt-4 inline-block text-sm text-blue-600 hover:underline"
        >
          Open enrichment editor →
        </a>
        <a
          href="{base}/ui-kit/group"
          class="ml-4 mt-4 inline-block text-sm text-gray-500 hover:underline">← Group</a
        >
      </div>
    {:else}
      {#key initialArchetype}
        <NdoCreateModal
          groupId={demoGroup.id}
          groupName={demoGroup.name}
          existingNdos={MOCK_NDOS}
          {initialArchetype}
          onclose={() => goto(`${base}/ui-kit/group?id=${demoGroup.id}`)}
          onsubmit={handleSubmit}
          onwizardcomplete={handleWizardComplete}
        />
      {/key}
    {/if}
  </div>
</AppShell>
