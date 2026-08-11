<svelte:head><title>NDO Detail — UI Kit</title></svelte:head>

<script lang="ts">
  import { base } from '$app/paths';
  import { browser } from '$app/environment';
  import { page } from '$app/state';
  import {
    AppShell,
    NdoDetailLayout,
    LifecycleTransitionModal,
    MOCK_NDOS,
    MOCK_LOBBY_PROFILE,
    getMockInitiatorName,
    getMockGroups,
    applyMockNdoGroupAssociations,
    getAssociatedGroupIds
  } from '@nondominium/ndo-ui';

  const hash = $derived(
    browser ? (page.url.searchParams.get('hash') ?? MOCK_NDOS[0].hash) : MOCK_NDOS[0].hash
  );
  const descriptor = $derived(MOCK_NDOS.find((d) => d.hash === hash) ?? MOCK_NDOS[0]);
  const initiatorName = $derived(getMockInitiatorName(descriptor.hash));

  let groups = $state(getMockGroups());
  const associatedGroupIds = $derived(getAssociatedGroupIds(groups, descriptor.hash));

  let showTransitionModal = $state(false);
  let associateMessage = $state<string | null>(null);

  async function handleAssociate(groupIds: string[]) {
    applyMockNdoGroupAssociations(descriptor.hash, groupIds);
    groups = getMockGroups();
    associateMessage = `Associated with ${groupIds.length} group${groupIds.length !== 1 ? 's' : ''}.`;
    setTimeout(() => {
      associateMessage = null;
    }, 4000);
  }
</script>

{#if showTransitionModal}
  <LifecycleTransitionModal
    {descriptor}
    candidateNdos={MOCK_NDOS}
    onclose={() => { showTransitionModal = false; }}
    onconfirm={async () => {}}
  />
{/if}

<AppShell
  {groups}
  activePath={`${base}/ui-kit/ndo-detail`}
  profileNickname={MOCK_LOBBY_PROFILE.nickname}
  browseHref={`${base}/ui-kit/browse`}
  groupHref={(id) => `${base}/ui-kit/group?id=${id}`}
  onprofileclick={() => {}}
>
  {#if associateMessage}
    <div class="border-b border-emerald-200 bg-emerald-50 px-6 py-2 text-sm text-emerald-800">
      {associateMessage}
    </div>
  {/if}

  <NdoDetailLayout
    {descriptor}
    initiatorName={initiatorName}
    isInitiator={true}
    {groups}
    {associatedGroupIds}
    onassociate={handleAssociate}
    ontransitionclick={() => { showTransitionModal = true; }}
    transitionHistory={[
      {
        from_stage: 'Stable',
        to_stage: 'Active',
        agent: MOCK_LOBBY_PROFILE.nickname,
        timestamp: 1711000000000000,
        event_hash: 'uhC0keventHashExample001'
      }
    ]}
  />
</AppShell>
