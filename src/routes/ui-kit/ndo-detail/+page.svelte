<svelte:head><title>NDO Detail — UI Kit</title></svelte:head>

<script lang="ts">
  import { base } from '$app/paths';
  import { browser } from '$app/environment';
  import { page } from '$app/state';
  import {
    AppShell,
    NdoDetailLayout,
    LifecycleTransitionModal,
    MOCK_GROUPS,
    MOCK_NDOS,
    MOCK_LOBBY_PROFILE
  } from '@nondominium/ndo-ui';

  const hash = $derived(
    browser ? (page.url.searchParams.get('hash') ?? MOCK_NDOS[0].hash) : MOCK_NDOS[0].hash
  );
  const descriptor = $derived(MOCK_NDOS.find((d) => d.hash === hash) ?? MOCK_NDOS[0]);

  let showTransitionModal = $state(false);
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
  groups={MOCK_GROUPS}
  activePath={`${base}/ui-kit/ndo-detail`}
  profileNickname={MOCK_LOBBY_PROFILE.nickname}
  browseHref={`${base}/ui-kit/browse`}
  groupHref={(id) => `${base}/ui-kit/group?id=${id}`}
  onprofileclick={() => {}}
>
  <NdoDetailLayout
    {descriptor}
    initiatorName="Alice M."
    isInitiator={true}
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
