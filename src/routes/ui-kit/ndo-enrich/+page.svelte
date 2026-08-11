<script lang="ts">
  import { base } from '$app/paths';
  import { browser } from '$app/environment';
  import { page } from '$app/state';
  import {
    AppShell,
    NdoDetailLayout,
    MOCK_NDOS,
    MOCK_LOBBY_PROFILE,
    MOCK_SPEC_DRAFT,
    MOCK_SOURCE_NDO,
    type NdoSpecificationDraft,
    type SourceProfile,
    getMockInitiatorName,
    getMockGroups,
    applyMockNdoGroupAssociations,
    getAssociatedGroupIds
  } from '@nondominium/ndo-ui';

  const hash = $derived(
    browser ? (page.url.searchParams.get('hash') ?? MOCK_SOURCE_NDO.hash) : MOCK_SOURCE_NDO.hash
  );

  const descriptor = $derived(
    MOCK_NDOS.find((d) => d.hash === hash) ??
      (hash === MOCK_SOURCE_NDO.hash ? MOCK_SOURCE_NDO : MOCK_NDOS[0])
  );
  const initiatorName = $derived(getMockInitiatorName(descriptor.hash));

  let groups = $state(getMockGroups());
  const associatedGroupIds = $derived(getAssociatedGroupIds(groups, descriptor.hash));

  let specDraft = $state<NdoSpecificationDraft>({ ...MOCK_SPEC_DRAFT });
  let sourceProfile = $state<SourceProfile | null>(
    descriptor.source_profile ? { ...descriptor.source_profile } : null
  );
  let saved = $state(false);

  $effect(() => {
    sourceProfile = descriptor.source_profile ? { ...descriptor.source_profile } : null;
    specDraft =
      descriptor.ndo_archetype === 'source_ndo' || descriptor.source_profile
        ? { ...MOCK_SPEC_DRAFT }
        : { category: '', tags: [], fields: [], governance_rule_ids: [] };
  });
</script>

<svelte:head><title>NDO Enrichment — UI Kit</title></svelte:head>

<AppShell
  {groups}
  activePath={`${base}/ui-kit/ndo-enrich`}
  profileNickname={MOCK_LOBBY_PROFILE.nickname}
  browseHref={`${base}/ui-kit/browse`}
  groupHref={(id) => `${base}/ui-kit/group?id=${id}`}
  onprofileclick={() => {}}
>
  <div class="border-b border-gray-200 bg-gray-50 px-6 py-3">
    <p class="text-sm text-gray-600">
      Layer 1 enrichment editor — profile-driven specification + governance template picker.
      {#if descriptor.ndo_archetype === 'source_ndo'}
        <span class="font-medium text-teal-800">Source-NDO walkthrough.</span>
      {/if}
    </p>
    {#if saved}
      <p class="mt-1 text-sm text-emerald-700">Specification saved (mock).</p>
    {/if}
  </div>

  <NdoDetailLayout
    {descriptor}
    initiatorName={initiatorName}
    isInitiator={true}
    {groups}
    {associatedGroupIds}
    onassociate={async (groupIds) => {
      applyMockNdoGroupAssociations(descriptor.hash, groupIds);
      groups = getMockGroups();
    }}
    {specDraft}
    {sourceProfile}
    onspecchange={(d) => {
      specDraft = d;
      saved = false;
    }}
    onsourcechange={(p) => {
      sourceProfile = p;
      saved = false;
    }}
    onspecsave={() => {
      saved = true;
    }}
    defaultTab="specification"
  />
</AppShell>
